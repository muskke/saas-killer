require("dotenv").config();
const axios = require("axios");
const path = require("path");
const Database = require("better-sqlite3");

// --- Environment Validation & Sanitization ---
function validateAndSanitizeEnv() {
  console.log("🔒 Validating environment configuration...");
  const keys = ["GITHUB_TOKEN", "OPENAI_API_KEY"];
  let hasError = false;

  keys.forEach((key) => {
    let value = process.env[key];
    if (!value) {
      console.error(`❌ Missing environment variable: ${key}`);
      hasError = true;
      return;
    }

    // Common Mistake 3: User pasted the ENTIRE .env file (multi-line)
    if (value.includes("\n")) {
      console.warn(`⚠️  Detected multi-line content in ${key}, attempting to extract value...`);
      // Try to find the specific line "KEY=value" inside the blob
      const match = value.match(new RegExp(`^${key}=(.+)$`, "m"));
      if (match) {
        value = match[1];
        console.log(`✨ Successfully extracted ${key} from multi-line text.`);
      } else {
        // Fallback: splitting by newline and taking the first non-empty line that doesn't start with #
        const lines = value.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));
        if (lines.length > 0) {
          const cleanLine = lines.find(l => !l.includes("="));
          if (cleanLine) {
            value = cleanLine;
          } else {
            value = lines[0];
          }
        }
      }
    }

    // Common Mistake 1: User pasted "KEY=value" (single line)
    if (value.startsWith(`${key}=`)) {
      console.warn(`⚠️  Detected prefix in ${key}, fixing...`);
      value = value.replace(`${key}=`, "");
    }

    // Common Mistake 2: Quotes around the value
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      console.warn(`⚠️  Detected quotes in ${key}, fixing...`);
      value = value.slice(1, -1);
    }

    // Final trim
    process.env[key] = value.trim();

    // Log masked status
    const masked = (process.env[key] && process.env[key].length > 8)
      ? `${process.env[key].substring(0, 4)}...${process.env[key].substring(process.env[key].length - 4)}`
      : "******";
    console.log(`✅ ${key} configured (Value: ${masked})`);
  });

  if (hasError) {
    console.error("\n💥 Critical configuration errors found. Please check your GitHub Secrets.");
    process.exit(1);
  }
}

// Execute validation before initializing clients
validateAndSanitizeEnv();

// 初始化数据库
const dbPath = path.join(__dirname, "..", process.env.DATABASE_PATH || "data/tools.db");
const db = new Database(dbPath);

// 🏛️ TAXONOMY - 从统一定义导入
// 使用 require('@esbuild-kit/cjs-loader') 或 tsx 运行此脚本以支持 TS 导入
// 为了简化，我们直接复用 taxonomy.ts 中的结构，通过 require('tsx/cjs/api') 实现
// 或者，更简单：我们将 taxonomy.ts 编译输出为 taxonomy.cjs 或直接在这里 import

// 🔧 方案：使用 Node.js 原生 import() 异步导入 TS (需要 Node 18+ 且配置 tsconfig)
// 但为了兼容性，我们使用一个中间 JSON 文件，或者直接在这里保留 JS 版本，由 taxonomy.ts 生成

// 🛠️ 实用方案：使用 esbuild-register 或 tsx 作为 Node loader
// 运行命令改为: npx tsx scripts/fetch-github-data.js

// 🚀 直接读取编译后的 taxonomy (需要先 build)
// 或者使用 eval(require('fs').readFileSync('./src/lib/taxonomy.ts', 'utf8')) -- 不推荐

// ✅ 最佳实践：将 TAXONOMY 移到 JSON 文件，JS/TS 都可以 import
const taxonomyModule = require('../src/lib/taxonomy.cjs');
const TAXONOMY = taxonomyModule.TAXONOMY;
const generateSearchQueries = taxonomyModule.generateSearchQueries;
const SEARCH_QUERIES = generateSearchQueries();

// 🔥 导入共享的 AI 分析模块
const {
  createAnalyzer,
  getFallbackData,
  buildRichFeatures,
  chunkArray,
  delay,
  DEFAULT_AI_COOLDOWN_MS,
} = require("./lib/ai-analyzer");

// 🔥 核心配置：批处理大小
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 8;

// 创建 AI 分析器
const analyzer = createAnalyzer({ batchSize: BATCH_SIZE });

// 1. 抓取 GitHub 数据
async function fetchRepoData(query) {
  console.log(`\n🔍 Hunting for data: "${query}"...`);
  try {
    const response = await axios.get(
      `https://api.github.com/search/repositories`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: { q: query, sort: "stars", order: "desc", per_page: 50 },
      }
    );
    console.log(`   > GitHub returned ${response.data.items.length} items.`);
    return response.data.items;
  } catch (error) {
    console.error(`❌ GitHub API Error: ${error.message}`);
    return [];
  }
}

async function main() {
  const toolsTableInfo = db.prepare("PRAGMA table_info(tools)").all();
  const hasStarsPrev = toolsTableInfo.some((col) => col.name === "stars_prev");

  // 1. 准备 SQL 语句
  const insertStmt = db.prepare(`
    INSERT INTO tools (
      slug, name, description, category, parent_category, subcategory,${hasStarsPrev ? " stars_prev," : ""} stars, logo, url, license, language, updated_at, forks, issues, rich_features_json,
      pricing_model, deployment_complexity, tech_stack, license_type
    ) VALUES (
      @slug, @name, @description, @category, @parent_category, @subcategory,${hasStarsPrev ? " @stars_prev," : ""} @stars, @logo, @url, @license, @language, @updated_at, @forks, @issues, @rich_features_json,
      @pricing_model, @deployment_complexity, @tech_stack, @license_type
    )
    ON CONFLICT(slug) DO UPDATE SET
      ${hasStarsPrev ? "stars_prev = tools.stars,\n      " : ""}name = excluded.name,
      description = excluded.description,
      category = excluded.category,
      parent_category = excluded.parent_category,
      subcategory = excluded.subcategory,
      stars = excluded.stars,
      logo = excluded.logo,
      url = excluded.url,
      license = excluded.license,
      language = excluded.language,
      updated_at = excluded.updated_at,
      forks = excluded.forks,
      issues = excluded.issues,
      rich_features_json = excluded.rich_features_json,
      pricing_model = excluded.pricing_model,
      deployment_complexity = excluded.deployment_complexity,
      tech_stack = excluded.tech_stack,
      license_type = excluded.license_type
  `);

  // 预编译查询语句
  const checkStmt = db.prepare(
    "SELECT rich_features_json, parent_category, subcategory FROM tools WHERE slug = ?"
  );

  const updateStatsStmt = db.prepare(`
    UPDATE tools 
    SET ${hasStarsPrev ? "stars_prev = stars,\n        " : ""}stars = @stars, 
        forks = @forks, 
        issues = @issues, 
        updated_at = @updated_at,
        url = @url,
        license = @license,
        language = @language,
        logo = @logo
    WHERE slug = @slug
  `);

  const insertStarHistoryStmt = db.prepare(`
    INSERT OR IGNORE INTO tool_star_history (slug, stars, recorded_at)
    VALUES (@slug, @stars, DATE('now'))
  `);

  // 🔥 流水线模式配置
  const UPDATE_MODE = (process.env.UPDATE_MODE || "incremental").toLowerCase() === "full" ? "full" : "incremental";
  const CONCURRENCY_LIMIT = 3; // AI 并发数
  const MAX_PENDING_ITEMS = BATCH_SIZE * 5; // 🔥 背压阈值：最多缓存 5 个 batch 的数据
  const AI_COOLDOWN_MS = 1500; // 🔥 AI 请求之间的冷却时间（毫秒），防止 Rate Limit

  console.log(`\n🛡️ Update Mode: ${UPDATE_MODE}`);
  console.log(`🚀 Pipeline Mode: GitHub fetch + AI analysis running in parallel`);
  console.log(`⚡ AI Concurrency: ${CONCURRENCY_LIMIT}`);
  console.log(`📦 Backpressure threshold: ${MAX_PENDING_ITEMS} items`);
  console.log(`⏱️ AI cooldown: ${AI_COOLDOWN_MS}ms between requests\n`);

  // 状态追踪
  const seen = new Set();
  let pendingItems = []; // 待处理的 items 缓冲区
  let totalNewTools = 0;
  let totalUpdated = 0;
  let batchesProcessed = 0;
  let fetchComplete = false;
  let lastAiRequestTime = 0; // 上次 AI 请求的时间戳
  const SKIP_LOG_FIRST_N = parseInt(process.env.SKIP_LOG_FIRST_N) || 20;
  const SKIP_LOG_EVERY = parseInt(process.env.SKIP_LOG_EVERY) || 200;

  // 🔧 处理单个 item 的函数 (判断是否需要 AI 分析)
  const processItem = (item) => {
    const slug = item.name.toLowerCase();
    if (seen.has(slug)) return null;

    const row = checkStmt.get(slug);

    if (row) {
      const rich = JSON.parse(row.rich_features_json || "{}");
      const hasAiData = !!rich.long_summary && !!row.parent_category && !!row.subcategory;

      if (hasAiData && UPDATE_MODE !== "full") {
        // 增量模式：只更新 GitHub 数据，不需要 AI
        updateStatsStmt.run({
          stars: item.stargazers_count,
          forks: item.forks_count,
          issues: item.open_issues_count,
          updated_at: item.updated_at,
          url: item.homepage || item.html_url,
          license: item.license ? item.license.spdx_id : "Unknown",
          language: item.language || "Unknown",
          logo: item.owner.avatar_url,
          slug: slug
        });
        insertStarHistoryStmt.run({
          slug: slug,
          stars: item.stargazers_count
        });
        seen.add(slug);
        totalUpdated++;
        if (totalUpdated <= SKIP_LOG_FIRST_N || (SKIP_LOG_EVERY > 0 && totalUpdated % SKIP_LOG_EVERY === 0)) {
          console.log(`⏭️  Skip AI [${totalUpdated}]: ${slug}`);
          if (totalUpdated === SKIP_LOG_FIRST_N && SKIP_LOG_EVERY > 0) {
            console.log(`ℹ️  Skip logs will continue every ${SKIP_LOG_EVERY} items.`);
          }
        }
        return null; // 不需要 AI
      }
    }

    seen.add(slug);
    totalNewTools++;
    return item; // 需要 AI 分析
  };

  // 🔧 处理一个 batch 的 AI 分析并写入数据库
  const processBatchWithAI = async (batch, batchId, totalBatches) => {
    console.log(`⚡ [Batch ${batchId}/${totalBatches}] AI analyzing ${batch.length} tools...`);

    try {
      // 🔥 使用共享的 AI 分析器
      const aiResults = await analyzer.analyzeBatch(batch);

      // 同步事务写入
      const transaction = db.transaction((items) => {
        for (const item of items) {
          const slug = item.name.toLowerCase();
          const aiData = aiResults[slug] || getFallbackData(item);

          // 使用共享的 buildRichFeatures 函数
          const richFeatures = buildRichFeatures(aiData);

          const insertData = {
            slug: slug,
            name: item.name,
            description: aiData.tagline,
            category: aiData.category,
            parent_category: aiData.parent_category,
            subcategory: aiData.category,
            pricing_model: aiData.pricing_model || "Fully Open Source",
            deployment_complexity: aiData.deployment_complexity || 1,
            tech_stack: aiData.tech_stack || "Unknown",
            license_type: aiData.license_type || item.license?.name || "Unknown",
            stars: item.stargazers_count,
            logo: item.owner.avatar_url,
            url: item.homepage || item.html_url,
            license: item.license ? item.license.spdx_id : "Unknown",
            language: item.language,
            updated_at: item.updated_at,
            forks: item.forks_count,
            issues: item.open_issues_count,
            rich_features_json: JSON.stringify(richFeatures),
          };

          if (hasStarsPrev) {
            insertData.stars_prev = item.stargazers_count;
          }

          insertStmt.run(insertData);

          insertStarHistoryStmt.run({
            slug: slug,
            stars: item.stargazers_count
          });
        }
      });

      transaction(batch);
      batchesProcessed++;
      console.log(`💾 [Batch ${batchId}/${totalBatches}] SAVED.`);

    } catch (err) {
      console.error(`❌ [Batch ${batchId}] Failed:`, err.message);
    }
  };

  // 🔥 流水线：生产者 (GitHub Fetch) 和 消费者 (AI Analysis) 并行
  let allBatches = [];
  let batchCounter = 0;
  let queryIndex = 0;

  // 启动生产者 + 消费者循环
  const runPipeline = async () => {
    const activeTasks = [];
    let estimatedTotalBatches = Math.ceil(SEARCH_QUERIES.length * 25 / BATCH_SIZE); // 粗略估计

    for (const query of SEARCH_QUERIES) {
      queryIndex++;

      // 🔥 背压检查：如果队列已满，等待 AI 消费一些
      while (pendingItems.length >= MAX_PENDING_ITEMS) {
        console.log(`⏸️  Backpressure: Queue full (${pendingItems.length} items). Waiting for AI to consume...`);
        if (activeTasks.length > 0) {
          await Promise.race(activeTasks);
        } else {
          // 如果没有活跃任务但队列满了，说明逻辑有问题，强制等待一下
          await delay(1000);
        }
      }

      console.log(`\n🔍 [${queryIndex}/${SEARCH_QUERIES.length}] Fetching: "${query}"...`);

      const items = await fetchRepoData(query);

      // 立即处理获取到的数据
      for (const item of items) {
        const needsAI = processItem(item);
        if (needsAI) {
          pendingItems.push(needsAI);
        }
      }

      // 当缓冲区积累了足够的 items 时，创建 batch 并启动 AI 任务
      while (pendingItems.length >= BATCH_SIZE) {
        const batch = pendingItems.splice(0, BATCH_SIZE);
        batchCounter++;
        const currentBatchId = batchCounter;

        // 🔥 AI 冷却时间：确保请求频率不会太高
        const now = Date.now();
        const timeSinceLastRequest = now - lastAiRequestTime;
        if (timeSinceLastRequest < AI_COOLDOWN_MS && lastAiRequestTime > 0) {
          const waitTime = AI_COOLDOWN_MS - timeSinceLastRequest;
          await delay(waitTime);
        }
        lastAiRequestTime = Date.now();

        // 创建任务
        const task = () => processBatchWithAI(batch, currentBatchId, estimatedTotalBatches);

        // 并发控制：如果已有 CONCURRENCY_LIMIT 个任务在跑，等待一个完成
        if (activeTasks.length >= CONCURRENCY_LIMIT) {
          await Promise.race(activeTasks);
        }

        const promise = task();
        activeTasks.push(promise);
        promise.finally(() => {
          const idx = activeTasks.indexOf(promise);
          if (idx > -1) activeTasks.splice(idx, 1);
        });

        // 显示当前状态
        console.log(`   📊 Queue: ${pendingItems.length} pending, ${activeTasks.length} AI tasks running`);
      }

      // GitHub API 冷却
      await delay(800);
    }

    fetchComplete = true;
    console.log(`\n📡 GitHub fetch complete. Processing remaining items...`);

    // 处理剩余的 pending items
    if (pendingItems.length > 0) {
      const batch = pendingItems.splice(0, pendingItems.length);
      batchCounter++;
      const task = () => processBatchWithAI(batch, batchCounter, batchCounter);
      activeTasks.push(task());
    }

    // 等待所有 AI 任务完成
    if (activeTasks.length > 0) {
      console.log(`⏳ Waiting for ${activeTasks.length} remaining AI tasks...`);
      await Promise.all(activeTasks);
    }
  };

  await runPipeline();

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Pipeline Complete!`);
  console.log(`   📊 Tools updated (stats only): ${totalUpdated}`);
  console.log(`   🆕 New tools analyzed by AI: ${totalNewTools}`);
  console.log(`   📦 Total AI batches processed: ${batchesProcessed}`);
  console.log(`${'='.repeat(50)}\n`);

  db.close();
}

main();
