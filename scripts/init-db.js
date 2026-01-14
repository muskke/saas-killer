const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "..", process.env.DATABASE_PATH || "data/tools.db");
// 如果目录不存在，创建它
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new Database(dbPath);

console.log("📦 Initializing SQLite database...");

// 1. 建表
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tools (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    stars INTEGER,
    logo TEXT,
    url TEXT,
    license TEXT,
    language TEXT,
    updated_at TEXT,
    
    -- 🔥 新增这两个字段，为了配合 fetch 脚本
    forks INTEGER DEFAULT 0,
    issues INTEGER DEFAULT 0,

    is_promoted INTEGER DEFAULT 0,
    rich_features_json TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

db.exec(createTableQuery);

// 🔥 创建 Star 历史记录表 (用于追踪每周增长)
const createStarHistoryTableQuery = `
  CREATE TABLE IF NOT EXISTS tool_star_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    stars INTEGER NOT NULL,
    recorded_at DATE NOT NULL DEFAULT (DATE('now')),
    UNIQUE(slug, recorded_at),
    FOREIGN KEY (slug) REFERENCES tools(slug) ON DELETE CASCADE
  );
`;
db.exec(createStarHistoryTableQuery);

// 2. 创建索引
db.exec("CREATE INDEX IF NOT EXISTS idx_category ON tools(category)");
db.exec("CREATE INDEX IF NOT EXISTS idx_stars ON tools(stars DESC)");
db.exec("CREATE INDEX IF NOT EXISTS idx_star_history_slug ON tool_star_history(slug)");
db.exec("CREATE INDEX IF NOT EXISTS idx_star_history_date ON tool_star_history(recorded_at)");

console.log("✅ Database schema created successfully at data/tools.db");
db.close();

