// 🏛️ V4 Taxonomy - Single Source of Truth
// 前后端通用定义

export interface SubcategoryMeta {
    topics: string[];      // GitHub Topic keywords
    competitors: string[]; // SaaS competitors for "alternative" search
}

export interface PillarDefinition {
    label: string;
    icon: string;
    subcategories: string[];
    searchMeta: Record<string, SubcategoryMeta>;
}

export type TaxonomyType = Record<string, PillarDefinition>;

export const TAXONOMY: TaxonomyType = {
    Dev: {
        label: 'Developer',
        icon: '💻',
        subcategories: [
            "Backend & Auth", "DevOps & CI/CD", "Database & Storage",
            "AI, ML & Data", "Frontend & Headless CMS", "Automation & Workflow", "Data Visualization",
            "Testing & QA", "Monitoring & Logs", "Web3 & Blockchain",
            "Game Development", "Low-Code & Builder"
        ],
        searchMeta: {
            "Backend & Auth": { topics: ["baas", "firebase-alternative", "auth"], competitors: ["firebase", "auth0", "supabase"] },
            "DevOps & CI/CD": { topics: ["devops", "ci-cd", "container"], competitors: ["vercel", "heroku", "circleci", "gitlab"] },
            "Database & Storage": { topics: ["database", "vector-db", "sql"], competitors: ["planetscale", "neon", "minio"] },
            "AI, ML & Data": { topics: ["llm", "langchain", "machine-learning"], competitors: ["openai", "huggingface"] },
            "Frontend & Headless CMS": { topics: ["headless-cms", "jamstack"], competitors: ["contentful", "sanity", "strapi"] },
            "Automation & Workflow": { topics: ["automation", "workflow", "rpa"], competitors: ["zapier", "n8n", "make"] },
            "Data Visualization": { topics: ["visualization", "dashboards"], competitors: ["grafana", "metabase", "tableau"] },
            "Testing & QA": { topics: ["testing", "e2e", "playwright"], competitors: ["cypress", "browserstack"] },
            "Monitoring & Logs": { topics: ["monitoring", "observability", "apm"], competitors: ["datadog", "sentry", "newrelic"] },
            "Web3 & Blockchain": { topics: ["web3", "blockchain", "crypto"], competitors: ["alchemy", "infura"] },
            "Game Development": { topics: ["game-engine", "godot", "unity-alternative"], competitors: ["unity", "unreal"] },
            "Low-Code & Builder": { topics: ["low-code", "internal-tools", "no-code"], competitors: ["retool", "appsmith", "budibase"] }
        }
    },
    Business: {
        label: 'Business',
        icon: '🏢',
        subcategories: [
            "CRM & Customer Success", "ERP & Resource Mgmt", "Finance & Accounting",
            "HRM & Recruitment", "E-commerce & Retail", "Analytics & BI",
            "Marketing & SEO", "Support & Helpdesk", "Forms & Surveys",
            "Community & Events", "Legal & Compliance"
        ],
        searchMeta: {
            "CRM & Customer Success": { topics: ["crm"], competitors: ["salesforce", "hubspot", "pipedrive"] },
            "ERP & Resource Mgmt": { topics: ["erp", "inventory"], competitors: ["sap", "odoo", "netsuite"] },
            "Finance & Accounting": { topics: ["invoicing", "accounting"], competitors: ["quickbooks", "xero", "freshbooks"] },
            "HRM & Recruitment": { topics: ["hr", "recruitment", "ats"], competitors: ["workday", "greenhouse", "bamboohr"] },
            "E-commerce & Retail": { topics: ["ecommerce", "storefront"], competitors: ["shopify", "woocommerce", "magento"] },
            "Analytics & BI": { topics: ["analytics", "bi", "business-intelligence"], competitors: ["google-analytics", "amplitude", "mixpanel"] },
            "Marketing & SEO": { topics: ["marketing-automation", "email-marketing", "seo"], competitors: ["mailchimp", "hubspot", "semrush"] },
            "Support & Helpdesk": { topics: ["helpdesk", "customer-support", "ticketing"], competitors: ["intercom", "zendesk", "freshdesk"] },
            "Forms & Surveys": { topics: ["forms", "surveys"], competitors: ["typeform", "tally", "google-forms"] },
            "Community & Events": { topics: ["community", "events", "forum"], competitors: ["discourse", "circle", "meetup"] },
            "Legal & Compliance": { topics: ["contract", "gdpr", "compliance"], competitors: ["docusign", "pandadoc"] }
        }
    },
    Creative: {
        label: 'Creative',
        icon: '🎨',
        subcategories: [
            "UI/UX & Prototyping", "Graphic Design & Illustration", "3D Modeling & Animation",
            "Video Editing & Streaming", "Audio & Music Production", "Asset Management (DAM)"
        ],
        searchMeta: {
            "UI/UX & Prototyping": { topics: ["figma-alternative", "prototyping", "ui-design"], competitors: ["figma", "sketch", "invision"] },
            "Graphic Design & Illustration": { topics: ["graphic-design", "illustration"], competitors: ["canva", "adobe-illustrator", "photoshop"] },
            "3D Modeling & Animation": { topics: ["3d", "blender", "animation"], competitors: ["blender", "maya", "cinema4d"] },
            "Video Editing & Streaming": { topics: ["video-editing", "streaming", "obs"], competitors: ["premiere-pro", "davinci-resolve", "obs"] },
            "Audio & Music Production": { topics: ["daw", "audio", "music-production"], competitors: ["ableton", "pro-tools", "logic-pro"] },
            "Asset Management (DAM)": { topics: ["dam", "media-library"], competitors: ["bynder", "widen"] }
        }
    },
    Productivity: {
        label: 'Productivity',
        icon: '⚡',
        subcategories: [
            "Knowledge Base & Wiki", "Project & Task Mgmt", "Office Suite & Docs",
            "Team Collaboration", "Calendar & Scheduling", "Email Clients & Services",
            "Education & Learning"
        ],
        searchMeta: {
            "Knowledge Base & Wiki": { topics: ["knowledge-base", "wiki", "second-brain"], competitors: ["notion", "obsidian", "confluence"] },
            "Project & Task Mgmt": { topics: ["project-management", "task-manager", "kanban"], competitors: ["jira", "trello", "linear", "asana"] },
            "Office Suite & Docs": { topics: ["office-suite", "docs", "spreadsheet"], competitors: ["google-docs", "microsoft-office", "libreoffice"] },
            "Team Collaboration": { topics: ["team-chat", "collaboration"], competitors: ["slack", "microsoft-teams", "discord"] },
            "Calendar & Scheduling": { topics: ["calendar", "scheduling"], competitors: ["calendly", "cal-com"] },
            "Email Clients & Services": { topics: ["email-client", "email-server"], competitors: ["gmail", "outlook", "protonmail"] },
            "Education & Learning": { topics: ["lms", "e-learning", "flashcards"], competitors: ["coursera", "teachable", "anki"] }
        }
    },
    Social: {
        label: 'Social',
        icon: '🌐',
        subcategories: [
            "Social Networks", "Blogging & Publishing", "Forum & Community",
            "Link-in-Bio & Personal Site"
        ],
        searchMeta: {
            "Social Networks": { topics: ["social-network", "twitter-alternative", "mastodon"], competitors: ["twitter", "facebook", "mastodon"] },
            "Blogging & Publishing": { topics: ["blogging", "cms", "static-site"], competitors: ["wordpress", "ghost", "medium", "substack"] },
            "Forum & Community": { topics: ["forum", "community-platform"], competitors: ["discourse", "reddit", "discord"] },
            "Link-in-Bio & Personal Site": { topics: ["link-in-bio", "portfolio", "personal-website"], competitors: ["linktree", "carrd", "about-me"] }
        }
    },
    System: {
        label: 'System',
        icon: '🛡️',
        subcategories: [
            "HomeLab & NAS", "Infrastructure & Cloud", "Security & Passwords",
            "VPN & Network", "Browser & Extensions", "File Mgmt & Sharing", "OS & Utilities"
        ],
        searchMeta: {
            "HomeLab & NAS": { topics: ["homelab", "nas", "self-hosted", "media-server"], competitors: ["plex", "synology", "truenas"] },
            "Infrastructure & Cloud": { topics: ["infrastructure-as-code", "kubernetes", "terraform"], competitors: ["terraform", "ansible", "pulumi"] },
            "Security & Passwords": { topics: ["password-manager", "vault", "secrets"], competitors: ["1password", "lastpass", "bitwarden"] },
            "VPN & Network": { topics: ["vpn", "proxy", "firewall"], competitors: ["nordvpn", "tailscale", "cloudflare"] },
            "Browser & Extensions": { topics: ["privacy-browser", "adblocker"], competitors: ["chrome", "brave", "firefox"] },
            "File Mgmt & Sharing": { topics: ["file-sharing", "cloud-storage"], competitors: ["dropbox", "google-drive", "wetransfer"] },
            "OS & Utilities": { topics: ["linux", "terminal", "utilities", "pdf"], competitors: ["macos", "windows", "ubuntu"] }
        }
    }
};

// 转换为数组格式，供前端 UI 使用
export const TAXONOMY_ARRAY = Object.entries(TAXONOMY).map(([id, pillar]) => ({
    id,
    label: pillar.label,
    icon: pillar.icon,
    subcategories: pillar.subcategories
}));

// 生成搜索词，供脚本使用
export function generateSearchQueries(): string[] {
    const queries = new Set<string>();

    // 1. 核心增长趋势 (Growth Mechanics)
    queries.add("created:>2023-01-01 sort:stars");
    queries.add("topic:open-source-alternative sort:stars");
    queries.add("topic:self-hosted sort:stars");

    // 2. 动态遍历 TAXONOMY (Taxonomy-Driven)
    for (const pillarId in TAXONOMY) {
        const pillar = TAXONOMY[pillarId];
        for (const subcatName in pillar.searchMeta) {
            const meta = pillar.searchMeta[subcatName];
            // a) 添加 Topic 搜索
            meta.topics.forEach(topic => queries.add(`topic:${topic}`));
            // b) 添加竞品 Alternative 搜索
            meta.competitors.forEach(comp => queries.add(`${comp} alternative`));
        }
    }

    return Array.from(queries);
}
