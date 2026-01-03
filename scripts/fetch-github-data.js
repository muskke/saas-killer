require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// CONFIGURATION
// We target specific "High CPC" niches. Don't just search "random".
const SEARCH_QUERIES = [
  'topic:open-source-alternative', 
  'topic:self-hosted', 
  'privacy-focused alternative'
];
const MIN_STARS = 1000; // We only want popular tools
const OUTPUT_FILE = path.join(__dirname, '../data/alternatives.json');

// HEADERS (To look like a legit developer, not a bot)
const headers = {
  'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'VentureTyrant-Scraper/1.0'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ---------------------------------------------------------
// AI CLASSIFIER MODULE
// ---------------------------------------------------------

// 1. 定义高价值的 SaaS 类别（High CPC Niches）
const VALID_CATEGORIES = [
  "Project Management", "CRM", "CMS", "E-commerce", 
  "Analytics", "DevTools", "Design", "Communication", 
  "Authentication", "Database"
];

async function classifyRepo(repoName, description, topics) {
  // 模拟 OpenAI/DeepSeek 调用
  // In production: const completion = await openai.chat.completions.create(...)
  
  console.log(`🧠 AI is classifying: ${repoName}...`);
  
  const prompt = `
    Analyze this GitHub repo:
    Name: "${repoName}"
    Description: "${description}"
    Tags: "${topics.join(', ')}"
    
    Task: specificy which ONE category from this list fits best: [${VALID_CATEGORIES.join(', ')}].
    If it fits none, return "DevTools" as fallback.
    Output: ONLY the category name. No explanations.
  `;

  // 这里为了演示，我写一个伪逻辑。
  // 实际上你要把 prompt 发给 LLM。
  if (description.includes("cms") || description.includes("blog")) return "CMS";
  if (description.includes("crm") || description.includes("customer")) return "CRM";
  if (description.includes("shop") || description.includes("store")) return "E-commerce";
  
  return "DevTools"; // Fallback
}

async function fetchRepoData(query) {
  console.log(`🔥 Hunting for data: "${query}"...`);
  try {
    // GitHub Search API
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`;
    const response = await axios.get(url, { headers });
    return response.data.items;
  } catch (error) {
    console.error(`❌ Failed to fetch ${query}:`, error.response ? error.response.statusText : error.message);
    return [];
  }
}

// 模拟 AI Summary 生成 (You plug in OpenAI here later)
function generateFakeSummary(repoName, description) {
  // In production, call OpenAI API here:
  // "Write a 50-word sales pitch for ${repoName} based on ${description}"
  return `Stop using expensive SaaS. ${repoName} is a powerful open-source solution that allows you to control your data. It features ${description.slice(0, 50)}... and is completely free to deploy.`;
}

async function main() {
  let allTools = {};

  for (const query of SEARCH_QUERIES) {
    const items = await fetchRepoData(query);

    // [DEBUG MODE] Uncomment the line below to test with only 3 items first
    // const itemsToProcess = items.slice(0, 3);
    const itemsToProcess = items;

    for (const item of itemsToProcess) {
      if (item.stargazers_count < MIN_STARS) continue;
      if (allTools[item.name.toLowerCase()]) continue;

      // --- 💉 INJECTION START ---

      // 1. Extract arguments
      const repoName = item.name;
      const description = item.description || "";
      const topics = item.topics || []; // GitHub API returns 'topics' array

      // 2. Call the Classifier (Wait for it!)
      const aiCategory = await classifyRepo(repoName, description, topics);

      // --- 💉 INJECTION END ---

      allTools[item.name.toLowerCase()] = {
        slug: item.name.toLowerCase(),
        name: item.name,
        full_name: item.full_name, // 新增: 用于显示 "facebook/react" 这种权威感
        logo: item.owner.avatar_url, // 🔥 A: 解决视觉信任感，直接用 GitHub 作者头像
        url: item.homepage || item.html_url, // 新增: 官网链接
        category: aiCategory,
        stars: item.stargazers_count,
        description: description, // (如果要解决 B，这里需要接入 GPT-4 生成长文，现在先用原版)
        license: item.license ? item.license.spdx_id : "Unknown",
        summary: generateFakeSummary(item.name, description),
      };

      process.stdout.write(".");
    }

    await delay(2000);
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