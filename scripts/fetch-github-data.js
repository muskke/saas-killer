require("dotenv").config();
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai"); // 👈 引入大脑

// 初始化 AI (这里以 Gemini 为例，兼容 OpenAI 格式)
const openai = new OpenAI({
  baseURL: "https://cliproxyapi-hv47.onrender.com/v1", // 如果用 OpenAI 就删掉这行
  apiKey: process.env.OPENAI_API_KEY,
});

// CONFIGURATION
// We target specific "High CPC" niches. Don't just search "random".
const SEARCH_QUERIES = [
  "topic:open-source-alternative",
  "topic:self-hosted",
  "privacy-focused alternative",
  "notion alternative", // 直接搜竞品名
  "shopify alternative",
  "airtable alternative",
  "slack alternative",
];
const MIN_STARS = 1000; // We only want popular tools
const OUTPUT_FILE = path.join(__dirname, "../data/alternatives.json");

// HEADERS (To look like a legit developer, not a bot)
const headers = {
  Authorization: process.env.GITHUB_TOKEN
    ? `token ${process.env.GITHUB_TOKEN}`
    : undefined,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "VentureTyrant-Scraper/1.0",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------
// AI CLASSIFIER MODULE
// ---------------------------------------------------------

// 1. 定义高价值的 SaaS 类别（High CPC Niches）
const VALID_CATEGORIES = [
  "Project Management",
  "CRM",
  "CMS",
  "E-commerce",
  "Analytics",
  "DevTools",
  "Design",
  "Communication",
  "Authentication",
  "Database",
];

function classifyRepo(repoName, description, topics) {
  const text = (description + " " + topics.join(" ")).toLowerCase();

  // 规则引擎：关键词匹配
  if (text.includes("crm") || text.includes("customer")) return "CRM";
  if (
    text.includes("cms") ||
    text.includes("content management") ||
    text.includes("strapi") ||
    text.includes("ghost")
  )
    return "CMS";
  if (
    text.includes("analytic") ||
    text.includes("tracking") ||
    text.includes("matomo") ||
    text.includes("plausible")
  )
    return "Analytics";
  if (
    text.includes("auth") ||
    text.includes("login") ||
    text.includes("sso") ||
    text.includes("keycloak")
  )
    return "Authentication";
  if (
    text.includes("database") ||
    text.includes("sql") ||
    text.includes("db") ||
    text.includes("supabase")
  )
    return "Database";
  if (
    text.includes("video") ||
    text.includes("photo") ||
    text.includes("media") ||
    text.includes("immich")
  )
    return "Media";
  if (
    text.includes("note") ||
    text.includes("writing") ||
    text.includes("editor") ||
    text.includes("notion")
  )
    return "Productivity";
  if (
    text.includes("shop") ||
    text.includes("commerce") ||
    text.includes("store")
  )
    return "E-commerce";
  if (
    text.includes("deploy") ||
    text.includes("docker") ||
    text.includes("ci/cd")
  )
    return "DevOps";

  return "DevTools"; // 只有完全匹配不到的才去这里
}

async function fetchRepoData(query) {
  console.log(`🔥 Hunting for data: "${query}"...`);
  try {
    // GitHub Search API
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      query
    )}&sort=stars&order=desc&per_page=200`;
    const response = await axios.get(url, { headers });
    return response.data.items;
  } catch (error) {
    console.error(
      `❌ Failed to fetch ${query}:`,
      error.response ? error.response.statusText : error.message
    );
    return [];
  }
}

// 🔥 核心升级：AI 深度分析函数
async function analyzeToolWithAI(repo) {
  console.log(`🧠 AI is analyzing: ${repo.name}...`);

  const prompt = `
    Analyze the GitHub repository "${repo.name}" (Description: "${repo.description}").
    
    Task: Return a strict JSON object with the following fields:
    1. "category": Choose ONE from [CMS, CRM, Analytics, DevTools, E-commerce, Productivity, Design, Finance, Communication, Database].
    2. "tagline": A catchy, marketing-style one-liner (max 10 words).
    3. "pros": An array of 3 distinct advantages (strings).
    4. "cons": An array of 3 potential downsides or limitations (strings).
    5. "best_for": Who is the ideal user? (e.g. "Freelancers", "Enterprise").
    6. "alternatives": List 2 famous proprietary SaaS tools this replaces (e.g. "Notion, Airtable").
    
    Output strictly JSON. No markdown formatting.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemini-2.5-flash-lite", // 或者是 "gpt-4o-mini"
      // 注意：某些模型不支持 response_format: { type: "json_object" }，如果报错可以把这行删掉
    });

    // --- 🧹 CLEANING PROTOCOL START ---
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
    console.error(`❌ AI Error for ${repo.name}:`, error.message);
    if (error.response) console.error(error.response.data); // 如果有详细数据，也打印出来
    return {
      category: "DevTools",
      tagline: repo.description,
      pros: ["Open Source", "Self-hosted", "Free"],
      cons: ["Requires setup", "Community support only", "Maintenance needed"],
      best_for: "Developers",
      alternatives: ["Unknown SaaS"],
    };
  }
}

async function main() {
  let allTools = {};

  for (const query of SEARCH_QUERIES) {
    const items = await fetchRepoData(query);

    // ⚠️ 警告：AI 是要钱的。测试时建议只跑前 5 个！
    // const itemsToProcess = items.slice(0, 5);
    const itemsToProcess = items; // 正式跑全量时用这个

    for (const item of itemsToProcess) {
      if (allTools[item.name.toLowerCase()]) continue;

      // 🔥 调用 AI 获取深度数据
      const aiData = await analyzeToolWithAI(item);

      allTools[item.name.toLowerCase()] = {
        slug: item.name.toLowerCase(),
        name: item.name,
        full_name: item.full_name,
        logo: item.owner.avatar_url,
        url: item.homepage || item.html_url,
        stars: item.stargazers_count,
        license: item.license ? item.license.spdx_id : "Unknown",

        // 融合 AI 的智慧 👇
        category: aiData.category, // 终于不再是全是 DevTools 了！
        description: aiData.tagline, // 更有吸引力的短语
        rich_features: {
          // 存入详细数据供详情页使用
          pros: aiData.pros,
          cons: aiData.cons,
          best_for: aiData.best_for,
          alternatives: aiData.alternatives,
        },
      };

      process.stdout.write("✨");
    }
    await delay(1000); // 避免 AI API 速率限制
  }

  // SAVE TO DISK
  // Ensure directory exists
  const dir = path.dirname(OUTPUT_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(allTools, null, 2));

  console.log(`\n\n✅ Mission Complete.`);
  console.log(
    `💰 Harvested ${Object.keys(allTools).length} potential money-making pages.`
  );
  console.log(`📂 Data saved to: ${OUTPUT_FILE}`);
}

main();
