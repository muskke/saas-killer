/**
 * 🔄 AI Re-Analyze Script
 * 对数据库中已有的项目进行 AI 分析，不调用 GitHub API
 * 
 * 使用方法:
 *   node scripts/ai-reanalyze.js              # 分析缺少 AI 数据的项目
 *   node scripts/ai-reanalyze.js --all        # 强制重新分析所有项目
 *   node scripts/ai-reanalyze.js --limit 100  # 只分析前 100 个
 */

require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");

// 🔥 导入共享的 AI 分析模块
const {
    createAnalyzer,
    getFallbackData,
    buildRichFeatures,
    chunkArray,
    delay,
    DEFAULT_AI_COOLDOWN_MS,
} = require("./lib/ai-analyzer");

// --- 配置 ---
const AI_COOLDOWN_MS = parseInt(process.env.AI_COOLDOWN_MS) || DEFAULT_AI_COOLDOWN_MS;

// 解析命令行参数
const args = process.argv.slice(2);
const FORCE_ALL = args.includes("--all");
const limitIndex = args.indexOf("--limit");
const LIMIT = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : null;

console.log("🔄 AI Re-Analyze Script");
console.log("========================");
console.log(`🔁 Force All: ${FORCE_ALL}`);
console.log(`🔢 Limit: ${LIMIT || "No limit"}`);
console.log("");

// 创建 AI 分析器
const analyzer = createAnalyzer();
console.log(`📦 Batch Size: ${analyzer.batchSize}`);

// 初始化数据库
const dbPath = path.join(__dirname, "..", process.env.DATABASE_PATH || "data/tools.db");
const db = new Database(dbPath);

async function main() {
    console.log("\n📂 Reading database...");

    // 查询需要分析的工具
    let query;
    if (FORCE_ALL) {
        query = "SELECT slug, name, description, stars, logo, url, license, language, updated_at, forks, issues FROM tools";
    } else {
        // 只查询缺少 AI 数据的工具
        query = `
      SELECT slug, name, description, stars, logo, url, license, language, updated_at, forks, issues, rich_features_json 
      FROM tools 
      WHERE rich_features_json IS NULL 
         OR rich_features_json = '{}' 
         OR json_extract(rich_features_json, '$.long_summary') IS NULL
    `;
    }

    if (LIMIT) {
        query += ` LIMIT ${LIMIT}`;
    }

    const tools = db.prepare(query).all();
    console.log(`📦 Found ${tools.length} tools to analyze`);

    if (tools.length === 0) {
        console.log("✅ Nothing to do!");
        db.close();
        return;
    }

    // 准备更新语句
    const updateStmt = db.prepare(`
    UPDATE tools SET
      description = @description,
      category = @category,
      parent_category = @parent_category,
      subcategory = @subcategory,
      pricing_model = @pricing_model,
      deployment_complexity = @deployment_complexity,
      tech_stack = @tech_stack,
      license_type = @license_type,
      rich_features_json = @rich_features_json
    WHERE slug = @slug
  `);

    // 批处理
    const batches = chunkArray(tools, analyzer.batchSize);
    let completedBatches = 0;
    let lastAiRequestTime = 0;

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`\n🚀 Processing Batch ${i + 1}/${batches.length}...`);

        // AI 冷却
        const now = Date.now();
        const timeSinceLastRequest = now - lastAiRequestTime;
        if (timeSinceLastRequest < AI_COOLDOWN_MS && lastAiRequestTime > 0) {
            await delay(AI_COOLDOWN_MS - timeSinceLastRequest);
        }
        lastAiRequestTime = Date.now();

        // 🔥 使用共享的 AI 分析器
        const aiResults = await analyzer.analyzeBatch(batch);

        // 事务写入
        const transaction = db.transaction((items) => {
            for (const tool of items) {
                const slug = tool.slug || tool.name.toLowerCase();
                const aiData = aiResults[slug] || aiResults[tool.name.toLowerCase()] || getFallbackData(tool);

                const richFeatures = buildRichFeatures(aiData);

                updateStmt.run({
                    slug: slug,
                    description: aiData.tagline || tool.description,
                    category: aiData.category || "Low-Code & Builder",
                    parent_category: aiData.parent_category || "Dev",
                    subcategory: aiData.category || "Low-Code & Builder",
                    pricing_model: aiData.pricing_model || "Fully Open Source",
                    deployment_complexity: aiData.deployment_complexity || 5,
                    tech_stack: aiData.tech_stack || "Unknown",
                    license_type: aiData.license_type || "Unknown",
                    rich_features_json: JSON.stringify(richFeatures),
                });
            }
        });

        transaction(batch);
        completedBatches++;
        console.log(`💾 Batch ${i + 1}/${batches.length} saved. (${Math.round((completedBatches / batches.length) * 100)}%)`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ AI Re-Analyze Complete!");
    console.log(`   📦 Total batches: ${batches.length}`);
    console.log(`   🔧 Tools updated: ${tools.length}`);
    console.log("=".repeat(50) + "\n");

    db.close();
}

main().catch(console.error);
