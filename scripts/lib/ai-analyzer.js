/**
 * 🧠 AI Analyzer Module
 * 共享的 AI 分析逻辑，被 fetch-github-data.js 和 ai-reanalyze.js 复用
 */

const OpenAI = require("openai");

// --- 配置 ---
const DEFAULT_BATCH_SIZE = 8;
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_AI_COOLDOWN_MS = 1500;

// 延迟函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🔧 JSON 修复函数 - 处理 AI 返回的不完整 JSON
function tryRepairJson(rawJson) {
    let json = rawJson.trim();

    // 1. 移除可能的行内注释 (// ...)
    json = json.replace(/\/\/[^\n]*/g, '');

    // 2. 移除尾随逗号 (JSON 标准不允许)
    json = json.replace(/,(\s*[}\]])/g, '$1');

    // 3. 尝试闭合未完成的 JSON
    let openBraces = (json.match(/{/g) || []).length;
    let closeBraces = (json.match(/}/g) || []).length;
    let openBrackets = (json.match(/\[/g) || []).length;
    let closeBrackets = (json.match(/]/g) || []).length;

    // 4. 如果 JSON 在字符串中间截断，尝试闭合字符串
    const quoteCount = (json.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) {
        const lastQuoteIndex = json.lastIndexOf('"');
        if (lastQuoteIndex > 0) {
            const lastCompleteComma = json.lastIndexOf(',', lastQuoteIndex);
            const lastCompleteBrace = json.lastIndexOf('}', lastQuoteIndex);
            const cutPoint = Math.max(lastCompleteComma, lastCompleteBrace);

            if (cutPoint > 0) {
                json = json.substring(0, cutPoint + 1);
                openBraces = (json.match(/{/g) || []).length;
                closeBraces = (json.match(/}/g) || []).length;
                openBrackets = (json.match(/\[/g) || []).length;
                closeBrackets = (json.match(/]/g) || []).length;
            }
        }
    }

    // 5. 修正尾随逗号
    json = json.replace(/,(\s*)$/g, '$1');

    // 6. 闭合括号
    while (closeBrackets < openBrackets) { json += ']'; closeBrackets++; }
    while (closeBraces < openBraces) { json += '}'; closeBraces++; }

    return json;
}

// 🔥 构建 AI Prompt
function buildAnalysisPrompt(toolsList) {
    return `
    Analyze the following list of Open Source tools:
    ${toolsList}

    Task: Return a STRICT JSON object where the KEY is the tool name (lowercase) and the VALUE is the analysis object.
    
    For EACH tool, you MUST perform a deep analysis to classify it into the following 6-Pillar Taxonomy.
    
    CRITICAL INSTRUCTION: You must choose ONE "parent_category" and ONE "subcategory" from the list below.
    DO NOT invent new categories. 
    DO NOT use "Docs" for Notion-likes (use "Knowledge Base").
    DO NOT use "Database" for Supabase (use "Backend & Auth").
    
    [Taxonomy Tree]
    
    1. Modern Developer Stack (parent_category: "Dev")
       - "Backend & Auth" (Firebase/Auth0 alternatives, BaaS, Realtime)
       - "DevOps & CI/CD" (Vercel/Jenkins alternatives, Container, Git)
       - "Database & Storage" (SQL, NoSQL, MinIO, Vector DB)
       - "AI, ML & Data" (LLMs, LangChain, Agents, Training)
       - "Frontend & Headless CMS" (Strapi, Next.js, UI Frameworks)
       - "Automation & Workflow" (Zapier/n8n alternatives, RPA)
       - "Data Visualization" (Grafana/Metabase alternatives, Charts)
       - "Testing & QA" (E2E, Unit Testing, Load Testing)
       - "Monitoring & Logs" (Datadog/Sentry alternatives, Observability)
       - "Web3 & Blockchain" (Crypto, Smart Contracts, Nodes)
       - "Game Development" (Engines, Assets, Sprites)
       - "Low-Code & Builder" (Internal Tools, App Builders, DB GUI)

    2. Enterprise Solutions (parent_category: "Business")
       - "CRM & Customer Success" (Salesforce alternatives)
       - "ERP & Resource Mgmt" (SAP/Inventory alternatives)
       - "Finance & Accounting" (QuickBooks/Invoicing)
       - "HRM & Recruitment" (Workday/Hiring)
       - "E-commerce & Retail" (Shopify/Storefronts)
       - "Analytics & BI" (Tableau/Google Analytics alternatives)
       - "Marketing & SEO" (HubSpot/Mailchimp alternatives)
       - "Support & Helpdesk" (Intercom/Zendesk alternatives)
       - "Forms & Surveys" (Typeform/Tally alternatives)
       - "Community & Events" (Discourse/Meetup alternatives)
       - "Legal & Compliance" (Contract mgmt, GDPR)

    3. Creative Studio (parent_category: "Creative")
       - "UI/UX & Prototyping" (Figma/Sketch alternatives)
       - "Graphic Design & Illustration" (Adobe Illustrator/Canva alternatives)
       - "3D Modeling & Animation" (Blender/Maya alternatives)
       - "Video Editing & Streaming" (Premiere/OBS alternatives)
       - "Audio & Music Production" (DAW, Sound Processing)
       - "Asset Management (DAM)" (Photo library, Media organizer)

    4. Peak Productivity (parent_category: "Productivity")
       - "Knowledge Base & Wiki" (Notion/Obsidian alternatives, Second Brain)
       - "Project & Task Mgmt" (Jira/Trello/Linear alternatives)
       - "Office Suite & Docs" (Microsoft 365/Google Docs alternatives)
       - "Team Collaboration" (Slack/Discord/Teams alternatives)
       - "Calendar & Scheduling" (Calendly alternatives)
       - "Email Clients & Services" (Gmail/Outlook alternatives)
       - "Education & Learning" (LMS, Flashcards)

    5. Social & Web (parent_category: "Social")
       - "Social Networks" (Twitter/Reddit alternatives, Mastodon)
       - "Blogging & Publishing" (WordPress/Ghost/Medium alternatives)
       - "Forum & Community" (Discord/Discourse alternatives)
       - "Link-in-Bio & Personal Site" (Linktree alternatives, Portfolio, Bitly)

    6. System & Privacy (parent_category: "System")
       - "HomeLab & NAS" (Media Servers, Plex alternatives, Self-hosting dashboards)
       - "Infrastructure & Cloud" (Terraform/Ansible alternatives, K8s)
       - "Security & Passwords" (1Password/LastPass alternatives, Vaults)
       - "VPN & Network" (Proxy, Firewall, Security)
       - "Browser & Extensions" (Privacy browsers, Adblockers)
       - "File Mgmt & Sharing" (Dropbox/WeTransfer alternatives)
       - "OS & Utilities" (Linux tools, Terminal, PDF tools)
    
    7. Science (parent_category: "Science")
       - "Physics & Astronomy"
       - "Biology & Biotechnology"
       - "Chemistry & Materials"
       - "Mathematics & Statistics"

    8. Health (parent_category: "Health")
       - "Fitness & Wellness"
       - "Medical Devices"
       - "Pharma & Biotechnology"
       - "Mental Health"

    [Output Fields]
    For each tool, return:
    1. "parent_category": The string code (e.g., "Dev", "Business").
    2. "category": The EXACT subcategory name from the tree above (e.g., "Backend & Auth").
    3. "tagline": A technical, SEO-optimized H1-style tagline (max 10 words). Focus on "Open source alternative to X". 
    4. "long_summary": A high-converting 2-sentence pitch. 
       - Sentence 1: Clearly state what it replaces (e.g., "A self-hosted alternative to Shopify"). 
       - Sentence 2: Highlight the KILLER technical feature (e.g., "No transaction fees, wrote in Rust.").
       - RULE: No marketing fluff. No adjectives like "powerful", "cutting-edge". Focus on technical limits and architecture.
    5. "use_cases": Array of 3 specific personas (e.g. "Indie Hackers", "Enterprise Tech Teams"). 
    6. "competitor_name": The single biggest SaaS competitor.
    7. "comparison_table": Array of 3 comparison rows { "feature": "...", "os_value": "...", "saas_value": "..." }.
    8. "best_for": Target Audience.
    9. "pros": Array of 3 key benefits (Technical preferred).
    10. "cons": Array of 3 honest drawbacks (e.g., "Complex setup", "No mobile app").
    
    [Hardcore Metadata]
    11. "deployment_complexity": Integer 1-10 (1=Docker Run, 10=K8s Cluster required). Be realistic.
    12. "tech_stack": String (e.g., "Node.js + React", "Go + Vue", "Python + Django"). Infer from description/repo.
    13. "pricing_model": String (One of: "Fully Open Source", "Open Core", "Freemium").
       - "Fully Open Source": All features free.
       - "Open Core": Enterprise features paid.
    14. "license_type": String (e.g., "MIT", "AGPL v3", "Apache 2.0", "BSL"). Infer best guess.

    Output strictly JSON. No markdown.
  `;
}

/**
 * 创建 AI 分析器实例
 * @param {Object} options 配置选项
 * @param {string} options.apiKey OpenAI API Key
 * @param {string} options.baseURL OpenAI Base URL
 * @param {string} options.modelId 模型 ID
 * @param {number} options.maxRetries 最大重试次数
 * @param {number} options.batchSize 批处理大小
 */
function createAnalyzer(options = {}) {
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    const baseURL = options.baseURL || process.env.OPENAI_BASE_URL;
    const modelId = options.modelId || process.env.OPENAI_MODEL_ID || "gpt-4o-mini";
    const maxRetries = options.maxRetries || parseInt(process.env.MAX_RETRIES) || DEFAULT_MAX_RETRIES;
    const batchSize = options.batchSize || parseInt(process.env.BATCH_SIZE) || DEFAULT_BATCH_SIZE;

    const openai = new OpenAI({ baseURL, apiKey });

    /**
     * 批量分析工具
     * @param {Array} tools 工具列表，每个工具需要有 name 和 description 字段
     * @returns {Promise<Object>} 分析结果，key 是工具名（小写），value 是分析数据
     */
    async function analyzeBatch(tools) {
        const toolsList = tools
            .map((t) => {
                const name = t.name || t.slug;
                const desc = t.description || "No description";
                return `- Name: "${name}", Desc: "${desc}"`;
            })
            .join("\n");

        console.log(`🧠 AI is analyzing a batch of ${tools.length} tools...`);

        const prompt = buildAnalysisPrompt(toolsList);
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                if (attempt > 0) {
                    console.log(`🔄 Retrying batch (Attempt ${attempt + 1}/${maxRetries})...`);
                }

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: modelId,
                    temperature: 0.1,
                });

                let rawContent = completion.choices[0].message.content;

                if (!rawContent) {
                    throw new Error("AI returned empty content");
                }

                // 清洗 Markdown
                let cleanContent = rawContent
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                // 尝试解析
                try {
                    return JSON.parse(cleanContent);
                } catch (parseError) {
                    console.warn(`⚠️  JSON parse failed, attempting repair...`);
                    console.warn(`   Parse error: ${parseError.message}`);

                    const repairedJson = tryRepairJson(cleanContent);

                    try {
                        const result = JSON.parse(repairedJson);
                        console.log(`✅ JSON repair successful!`);
                        return result;
                    } catch (repairError) {
                        console.error(`❌ JSON repair also failed: ${repairError.message}`);
                        throw parseError;
                    }
                }
            } catch (error) {
                attempt++;

                const isJsonError = error.message.includes('JSON') ||
                    error.message.includes('Unexpected token') ||
                    error.message.includes('Unterminated');
                const isApiError = error.message.includes('auth') ||
                    error.message.includes('rate') ||
                    error.status === 401 ||
                    error.status === 429;

                console.error(
                    `❌ AI Batch Error (Attempt ${attempt}/${maxRetries}):`,
                    error.message
                );

                if (isJsonError) {
                    console.warn(`   💡 Tip: This is a JSON parsing error. The AI response may have been truncated.`);
                    console.warn(`   💡 Consider reducing BATCH_SIZE (current: ${batchSize}) to get shorter responses.`);
                }

                if (isApiError) {
                    console.warn(
                        "⚠️  Warning: This looks like an API Key or rate limit issue. Check your .env file!"
                    );
                }

                if (attempt >= maxRetries) {
                    console.error("💀 Max retries reached. Using fallback data for this batch.");
                    return {};
                }

                const waitTime = 5000 * Math.pow(2, attempt - 1);
                console.log(`⏳ Cooling down for ${waitTime / 1000}s...`);
                await delay(waitTime);
            }
        }

        return {};
    }

    return {
        analyzeBatch,
        batchSize,
    };
}

/**
 * 生成兜底数据
 * @param {Object} item 工具对象
 * @returns {Object} 兜底的分析数据
 */
function getFallbackData(item) {
    return {
        parent_category: "Dev",
        category: "Low-Code & Builder",
        tagline: item.description || "Open Source Alternative",
        long_summary: item.description,
        use_cases: ["Self-hosting"],
        competitor_name: null,
        comparison_table: [
            { feature: "Pricing", os_value: "Free", saas_value: "Paid" },
            { feature: "Source Code", os_value: "Open", saas_value: "Closed" },
            { feature: "Hosting", os_value: "Self-hosted", saas_value: "Cloud" },
        ],
        best_for: "Developers",
        pros: ["Open Source", "Free", "Customizable"],
        cons: ["Setup required", "Maintenance needed", "Less support"],
        deployment_complexity: 5,
        tech_stack: "Unknown",
        pricing_model: "Fully Open Source",
        license_type: "Unknown",
    };
}

/**
 * 构建 rich_features_json 对象
 * @param {Object} aiData AI 分析结果
 * @returns {Object} rich features 对象
 */
function buildRichFeatures(aiData) {
    return {
        pros: aiData.pros,
        cons: aiData.cons,
        best_for: aiData.best_for,
        competitor_name: aiData.competitor_name,
        comparison_table: aiData.comparison_table,
        long_summary: aiData.long_summary,
        use_cases: aiData.use_cases,
    };
}

// 辅助函数：将数组切块
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

module.exports = {
    createAnalyzer,
    getFallbackData,
    buildRichFeatures,
    tryRepairJson,
    chunkArray,
    delay,
    DEFAULT_BATCH_SIZE,
    DEFAULT_MAX_RETRIES,
    DEFAULT_AI_COOLDOWN_MS,
};
