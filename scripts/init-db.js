const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../data/tools.db");
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

// 2. 创建索引
db.exec("CREATE INDEX IF NOT EXISTS idx_category ON tools(category)");
db.exec("CREATE INDEX IF NOT EXISTS idx_stars ON tools(stars DESC)");

console.log("✅ Database schema created successfully at data/tools.db");
db.close();
