/**
 * 迁移脚本：添加 tool_star_history 表
 * 用于记录每日 Star 数据，以便准确计算每周增长
 */
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", process.env.DATABASE_PATH || "data/tools.db");
const db = new Database(dbPath);

console.log("📦 Running migration: add tool_star_history table...");

// 创建 Star 历史记录表
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tool_star_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    stars INTEGER NOT NULL,
    recorded_at DATE NOT NULL DEFAULT (DATE('now')),
    UNIQUE(slug, recorded_at),
    FOREIGN KEY (slug) REFERENCES tools(slug) ON DELETE CASCADE
  );
`;

db.exec(createTableQuery);

// 创建索引以加快查询
db.exec("CREATE INDEX IF NOT EXISTS idx_star_history_slug ON tool_star_history(slug)");
db.exec("CREATE INDEX IF NOT EXISTS idx_star_history_date ON tool_star_history(recorded_at)");

console.log("✅ Migration complete: tool_star_history table created.");
db.close();
