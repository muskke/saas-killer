require("dotenv").config();
const axios = require("axios");
const path = require("path");
const OpenAI = require("openai");
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
        // If not found, maybe they pasted the .env but we are looking at specific key
        // Let's try to just take the first line if it looks like a token, 
        // OR warn them if it looks like they pasted the wrong secret into the wrong variable.

        // Fallback: splitting by newline and taking the first non-empty line that doesn't start with #
        const lines = value.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));
        if (lines.length > 0) {
          // Check if one of the lines is just the token (no "=")
          const cleanLine = lines.find(l => !l.includes("="));
          if (cleanLine) {
            value = cleanLine;
          } else {
            // Maybe they pasted "OTHER_KEY=..." into THIS secret? 
            // It's getting messy, let's just use the first line and hope.
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

// 初始化 AI (兼容 OpenAI 格式)
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

// 初始化数据库
const dbPath = path.join(__dirname, "..", process.env.DATABASE_PATH || "data/tools.db");
const db = new Database(dbPath);

// 搜索关键词
const SEARCH_QUERIES = [
  // 1. 通用大词 (Generic High-Volume)
  "topic:open-source-alternative",
  "topic:self-hosted",
  "topic:privacy-focused",
  "topic:opensource",
  "topic:free-software",

  // 2. SaaS 巨头精准狙击 (High Value Targets)
  // 办公/生产力
  "notion alternative",
  "airtable alternative",
  "slack alternative",
  "trello alternative",
  "zoom alternative",
  "docusign alternative", // 电子签章，很贵

  // 开发者服务 (BaaS/Infra - 这是最赚钱的领域)
  "firebase alternative", // 比如 Supabase
  "vercel alternative", // 比如 Coolify
  "heroku alternative",
  "auth0 alternative", // 比如 Clerk/Logto
  "datadog alternative", // 比如 SigNoz
  "sentry alternative",

  // 设计与媒体
  "figma alternative", // 比如 Penpot
  "adobe alternative", // 比如 Photopea
  "canva alternative",

  // 营销与电商
  "shopify alternative",
  "mailchimp alternative", // 比如 Listmonk
  "intercom alternative", // 客服系统
  "google-analytics alternative", // 比如 Plausible

  // 3. 极客关键词 (Hidden Gems)
  "topic:build-your-own-x", // 很多硬核项目在这里
  "topic:low-code",
];

// 🔥 核心配置：批处理大小
// 建议设置为 5-10。太大容易导致 AI 响应超时或 JSON 截断。
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 8;

// 辅助函数：将数组切块
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 模拟延迟 (避免并发过高炸掉接口)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// 2. AI 批量分析 (保持之前的 Prompt 逻辑不变，为了节省篇幅，这里用简化版 Prompt，请确保你用的是包含 long_summary 的完整版)
async function analyzeBatchWithAI(repos) {
  const toolsList = repos
    .map(
      (r) => `- Name: "${r.name}", Desc: "${r.description || "No description"}"`
    )
    .join("\n");
  console.log(`🧠 AI is analyzing a batch of ${repos.length} tools...`);

  // 🔥 重试配置
  const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 5; // 最多重试 5 次
  let attempt = 0;

  const prompt = `
    Analyze the following list of Open Source tools:
    ${toolsList}

    Task: Return a STRICT JSON object where the KEY is the tool name (lowercase) and the VALUE is the analysis object.
    
    For EACH tool, the analysis object must contain:
    1. "category": Choose ONE from the following list. Pick the MOST specific one:
       
       [Business]
       - CRM (Customer Relationship)
       - ERP (Enterprise Resource Planning)
       - HRM (Human Resources)
       - Finance (Accounting, Invoicing)
       - Marketing (Email, SEO, Analytics)
       - E-commerce (Stores, Inventory)
       - Support (Helpdesk, Chatbots)

       [Developer]
       - BaaS (Backend as a Service: Auth, Database, Storage)
       - DevOps (CI/CD, Docker, K8s)
       - Monitoring (Observability, Logs, Uptime)
       - Security (Password Managers, VPN, Identity)
       - CMS (Headless, Static, Blogs)
       - Database (SQL, NoSQL, Vector)
       - AI/ML (LLMs, Training, Vector DBs)

       [Creative & Office]
       - Design (UI/UX, Graphics, 3D)
       - Media (Photo, Video, Streaming)
       - Docs (Wiki, Knowledge Base, Office Suite)
       - Note-taking (Personal Knowledge Management)
       - Project Management (Kanban, Agile)
       - Communication (Chat, Video, Team)
       
       [Other]
       - Form Builder (Surveys)
       - Automation (Workflow, IPA)
       - Browser (Extensions, Privacy)
    2. "tagline": A catchy, marketing-style one-liner (max 10 words).
    3. "long_summary": A persuasive, 2-sentence description explaining WHAT the tool does and WHY it is special. (e.g. "Immich is a self-hosted photo backup solution that directly replaces Google Photos. It offers facial recognition, timeline view, and mobile backup without the monthly fees.")
    4. "use_cases": An array of 3 specific scenarios where this tool shines (e.g. ["Wedding Photography Backup", "Family Server", "Private Portfolio"]).
    5. "competitor_name": The SINGLE most famous SaaS tool this replaces.
    6. "comparison_table": An array of EXACTLY 3 objects comparing OS vs SaaS (Pricing, Killer Feature, Privacy). Format: { "feature": "String", "os_value": "String", "saas_value": "String" }.
    7. "best_for": Who is the ideal user?
    8. "pros": Array of 3 strings.
    9. "cons": Array of 3 strings.

    Output strictly JSON. No markdown.
  `;

  // 🔥 循环重试逻辑
  while (attempt < MAX_RETRIES) {
    try {
      if (attempt > 0)
        console.log(
          `🔄 Retrying batch (Attempt ${attempt + 1}/${MAX_RETRIES})...`
        );

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: process.env.OPENAI_MODEL_ID,
        temperature: 0.1, //以此降低幻觉
      });

      // 🧹 清洗数据
      let rawContent = completion.choices[0].message.content;

      // 1. 暴力撕掉 Markdown 的皮 (```json 和 ```)
      let cleanContent = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // 2. 解析清洗后的内容
      return JSON.parse(cleanContent);
    } catch (error) {
      attempt++;
      console.error(
        `❌ AI Batch Error (Attempt ${attempt}/${MAX_RETRIES}):`,
        error.message
      );

      // 如果是特定的认证错误，重试可能没用，建议检查配置
      if (error.message.includes("auth_unavailable") || error.status === 401) {
        console.warn(
          "⚠️  Warning: This looks like an API Key issue. Check your .env file!"
        );
      }

      if (attempt >= MAX_RETRIES) {
        console.error(
          "💀 Max retries reached. Using fallback data for this batch."
        );
        return {}; // 彻底失败，只能返回空对象走 fallback
      }

      // 指数退避：第一次等 5秒，第二次等 10秒，第三次等 20秒, ...
      const waitTime = 5000 * Math.pow(2, attempt - 1);
      console.log(`⏳ Cooling down for ${waitTime / 1000}s...`);
      await delay(waitTime);
    }
  }
}

// 兜底数据生成器 (万一 AI 炸了或者漏了某个工具)
function getFallbackData(item) {
  return {
    category: "DevTools",
    tagline: item.description || "Open Source Alternative",
    long_summary: item.description,
    use_cases: ["Self-hosting"],
    competitor_name: "SaaS",
    comparison_table: [
      { feature: "Pricing", os_value: "Free", saas_value: "Paid" },
      { feature: "Source Code", os_value: "Open", saas_value: "Closed" },
      { feature: "Hosting", os_value: "Self-hosted", saas_value: "Cloud" },
    ],
    best_for: "Developers",
    pros: ["Open Source", "Free", "Customizable"],
    cons: ["Setup required", "Maintenance needed", "Less support"],
  };
}

async function main() {
  // 1. 准备 SQL 语句
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO tools (
      slug, name, description, category, stars, logo, url, license, language, updated_at, forks, issues, rich_features_json
    ) VALUES (
      @slug, @name, @description, @category, @stars, @logo, @url, @license, @language, @updated_at, @forks, @issues, @rich_features_json
    )
  `);

  // 2. 收集 GitHub 数据
  let rawItems = [];
  for (const query of SEARCH_QUERIES) {
    const items = await fetchRepoData(query);
    rawItems = [...rawItems, ...items];
    await delay(1000);
  }

  // 3. 去重与检查 (Check Database directly!)
  // 🔥 环境变量控制更新策略
  // 'incremental' (默认): 旧项目只更新 GitHub API 来源数据，不重跑 AI
  // 'full': 强制重跑所有项目的 AI 分析
  const UPDATE_MODE = process.env.UPDATE_MODE || "incremental";
  console.log(`\n🛡️ Update Mode: ${UPDATE_MODE}`);

  const uniqueItems = [];
  const seen = new Set();

  // 预编译查询语句，速度更快
  const checkStmt = db.prepare(
    "SELECT rich_features_json, stars FROM tools WHERE slug = ?"
  );

  // 预编译更新基础数据的 SQL (所有 GitHub 可直接获取的字段，不涉及 AI 生成字段)
  // 🔥 关键改动：在更新 stars 之前，先把旧值存到 stars_prev
  const updateStatsStmt = db.prepare(`
    UPDATE tools 
    SET stars_prev = stars,
        stars = @stars, 
        forks = @forks, 
        issues = @issues, 
        updated_at = @updated_at,
        url = @url,
        license = @license,
        language = @language,
        logo = @logo
    WHERE slug = @slug
  `);

  // 🔥 新增：每日 Star 历史记录插入语句
  // 使用 INSERT OR IGNORE 以确保每个 slug 每天只有一条记录
  const insertStarHistoryStmt = db.prepare(`
    INSERT OR IGNORE INTO tool_star_history (slug, stars, recorded_at)
    VALUES (@slug, @stars, DATE('now'))
  `);

  for (const item of rawItems) {
    const slug = item.name.toLowerCase();

    // 🔥 查库
    const row = checkStmt.get(slug);

    if (row) {
      // 数据库里已经有这个项目
      const rich = JSON.parse(row.rich_features_json || "{}");
      const hasAiData = rich.long_summary && rich.category;

      if (hasAiData && UPDATE_MODE !== "full") {
        // ⚡ 增量模式：更新所有 GitHub 可获取的数据，跳过 AI
        if (!seen.has(slug)) { // 避免重复更新同一条
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
          // 🔥 记录今日 Star 到历史表
          insertStarHistoryStmt.run({
            slug: slug,
            stars: item.stargazers_count
          });
          seen.add(slug);
        }
        continue; // 跳过后续的 AI 处理
      }
    }

    // 如果运行到这里，说明是：
    // 1. 新项目 (row 不存在)
    // 2. 旧项目但不完整 (缺少 AI 数据)
    // 3. 全量更新模式 (UPDATE_MODE === 'full')
    if (!seen.has(slug)) {
      seen.add(slug);
      uniqueItems.push(item);
    }
  }

  console.log(
    `\n📦 Total unique tools to analyze & insert: ${uniqueItems.length}`
  );

  // 4. 批处理 AI + 入库
  const batches = chunkArray(uniqueItems, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n🚀 Processing Batch ${i + 1}/${batches.length}...`);

    const aiResults = await analyzeBatchWithAI(batch);

    // 开启事务写入 (Transaction)
    const transaction = db.transaction((items) => {
      for (const item of items) {
        const slug = item.name.toLowerCase();
        const aiData = aiResults[slug] || getFallbackData(item);

        // 构建完整数据对象
        const richFeatures = {
          pros: aiData.pros,
          cons: aiData.cons,
          best_for: aiData.best_for,
          competitor_name: aiData.competitor_name,
          comparison_table: aiData.comparison_table,
          long_summary: aiData.long_summary,
          use_cases: aiData.use_cases,
        };

        // 执行插入
        insertStmt.run({
          slug: slug,
          name: item.name,
          description: aiData.tagline, // 用 tagline 覆盖默认描述
          category: aiData.category,
          stars: item.stargazers_count,
          logo: item.owner.avatar_url,
          url: item.homepage || item.html_url,
          license: item.license ? item.license.spdx_id : "Unknown",
          language: item.language,
          updated_at: item.updated_at,
          forks: item.forks_count,
          issues: item.open_issues_count,
          rich_features_json: JSON.stringify(richFeatures),
        });

        // 🔥 为新工具也记录 Star 历史
        insertStarHistoryStmt.run({
          slug: slug,
          stars: item.stargazers_count
        });
      }
    });

    // 提交事务
    transaction(batch);
    console.log(`💾 Batch ${i + 1} committed to SQLite.`);

    await delay(2000);
  }

  console.log("\n✅ All Done! Database updated.");
  db.close();
}

main();
