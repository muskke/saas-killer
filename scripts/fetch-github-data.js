require("dotenv").config();
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");

// 初始化 AI (这里以 Gemini 为例，兼容 OpenAI 格式)
const openai = new OpenAI({
  baseURL: "https://cliproxyapi-hv47.onrender.com/v1", // 如果用 OpenAI 就删掉这行
  apiKey: process.env.OPENAI_API_KEY,
});

// 搜索关键词 (保持你的撒网策略)
const SEARCH_QUERIES = [
  "topic:open-source-alternative",
  "topic:self-hosted",
  "privacy-focused alternative",
  "notion alternative",
  "shopify alternative",
  "airtable alternative",
  "slack alternative",
];

// 🔥 核心配置：批处理大小
// 建议设置为 5-10。太大容易导致 AI 响应超时或 JSON 截断。
const BATCH_SIZE = 8;

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
        params: { q: query, sort: "stars", order: "desc", per_page: 50 }, // 抓多点，反正我们会批量处理
      }
    );
    return response.data.items;
  } catch (error) {
    console.error(`❌ GitHub API Error: ${error.message}`);
    return [];
  }
}

// 🔥 核心升级：批量 AI 分析函数
async function analyzeBatchWithAI(repos) {
  const toolsList = repos
    .map(
      (r) => `- Name: "${r.name}", Desc: "${r.description || "No description"}"`
    )
    .join("\n");

  console.log(`🧠 AI is analyzing a batch of ${repos.length} tools...`);

  // 这里的 Prompt 极其关键，要求 AI 返回以 repo.name 为 Key 的大 JSON
  const prompt = `
    Analyze the following list of Open Source tools:
    ${toolsList}

    Task: Return a STRICT JSON object where the KEY is the tool name (lowercase) and the VALUE is the analysis object.
    
    For EACH tool, the analysis object must contain:
    1. "category": Choose ONE from [CMS, CRM, Analytics, DevTools, E-commerce, Productivity, Design, Finance, Communication, Database, Media].
    2. "tagline": A catchy, marketing-style one-liner (max 10 words).
    3. "competitor_name": The SINGLE most famous SaaS tool this replaces (e.g. "Notion", "Shopify").
    4. "comparison_table": An array of EXACTLY 3 objects comparing the Open Source tool (OS) vs the SaaS Competitor.
       - Row 1: "Pricing" (e.g. OS: "Free", SaaS: "$20/mo")
       - Row 2: "Killer Feature" (e.g. "Storage Limit")
       - Row 3: "Data Privacy" (e.g. OS: "Self-hosted", SaaS: "Data Mining")
       Format: { "feature": "String", "os_value": "String", "saas_value": "String" }
    5. "best_for": Who is the ideal user?
    6. "pros": Array of 3 strings.
    7. "cons": Array of 3 strings.

    Output format example:
    {
      "appflowy": { "category": "Productivity", ... },
      "n8n": { "category": "DevTools", ... }
    }
    
    IMPORTANT: Return ONLY valid JSON. No Markdown.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemini-2.5-flash-lite", // 或 gpt-4o-mini
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
    const aiData = JSON.parse(cleanContent);
    // --- 🧹 CLEANING PROTOCOL END ---

    return aiData;
  } catch (error) {
    console.error(`❌ AI Batch Error:`, error.message);
    return {}; // 失败返回空对象，主程序会走 Fallback
  }
}

// 兜底数据生成器 (万一 AI 炸了或者漏了某个工具)
function getFallbackData(item) {
  return {
    category: "DevTools",
    tagline: item.description || "Open Source Alternative",
    competitor_name: "Proprietary SaaS",
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
  const filePath = path.join(__dirname, "../data/alternatives.json");
  let allTools = {};

  // 读取现有数据 (避免重复抓取)
  try {
    const data = await fs.readFile(filePath, "utf8");
    allTools = JSON.parse(data);
  } catch (err) {
    console.log("ℹ️ No existing data found, starting fresh.");
  }

  // 1. 收集所有要去重的工具
  let rawItems = [];
  for (const query of SEARCH_QUERIES) {
    const items = await fetchRepoData(query);
    rawItems = [...rawItems, ...items];
    await delay(1000);
  }

  // 去重逻辑：只保留未入库的 或者 强制更新的
  const uniqueItems = [];
  const seen = new Set();

  for (const item of rawItems) {
    const slug = item.name.toLowerCase();
    // 如果已经存在且有详细数据(comparison_table)，就跳过
    if (allTools[slug] && allTools[slug].rich_features?.comparison_table)
      continue;

    if (!seen.has(slug)) {
      seen.add(slug);
      uniqueItems.push(item);
    }
  }

  console.log(`\n📦 Total unique tools to analyze: ${uniqueItems.length}`);

  // 2. 切片批处理 (Batch Processing)
  const batches = chunkArray(uniqueItems, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(
      `\n🚀 Processing Batch ${i + 1}/${batches.length} (${
        batch.length
      } tools)...`
    );

    // 调用 AI 批量分析
    const aiResults = await analyzeBatchWithAI(batch);

    // 3. 将结果合并回主数据
    for (const item of batch) {
      const slug = item.name.toLowerCase();
      // 尝试从 AI 结果里拿数据，拿不到就用 Fallback
      const aiData = aiResults[slug] || getFallbackData(item);

      if (!aiResults[slug]) {
        console.warn(`⚠️ AI missed tool: ${item.name}, using fallback.`);
      }

      allTools[slug] = {
        slug: slug,
        name: item.name,
        full_name: item.full_name,
        logo: item.owner.avatar_url,
        url: item.homepage || item.html_url,
        stars: item.stargazers_count,
        license: item.license ? item.license.spdx_id : "Unknown",

        // 存入 AI 数据
        category: aiData.category,
        description: aiData.tagline,
        rich_features: {
          pros: aiData.pros,
          cons: aiData.cons,
          best_for: aiData.best_for,
          competitor_name: aiData.competitor_name,
          comparison_table: aiData.comparison_table,
        },
      };
    }

    // 每处理完一个 Batch 就保存一次 (防止程序中途崩溃白跑)
    await fs.writeFile(filePath, JSON.stringify(allTools, null, 2));
    console.log(`💾 Batch ${i + 1} saved.`);

    // 休息一下，避免令牌速率限制 (TPM)
    await delay(2000);
  }

  console.log("\n✅ All Done! Your database is now rich and valuable.");
}

main();
