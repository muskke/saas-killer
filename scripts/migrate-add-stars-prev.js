/**
 * 数据库迁移脚本：添加 stars_prev 字段用于追踪星星增长趋势
 * 
 * 运行方式：node scripts/migrate-add-stars-prev.js
 */

require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", process.env.DATABASE_PATH || "data/tools.db");
const db = new Database(dbPath);

console.log("🔧 Running migration: Add stars_prev column...\n");

try {
    // 1. 检查字段是否已存在
    const tableInfo = db.prepare("PRAGMA table_info(tools)").all();
    const hasStarsPrev = tableInfo.some(col => col.name === "stars_prev");

    if (hasStarsPrev) {
        console.log("✅ Column 'stars_prev' already exists. Skipping migration.");
    } else {
        // 2. 添加新字段，默认值为 0
        db.exec("ALTER TABLE tools ADD COLUMN stars_prev INTEGER DEFAULT 0");
        console.log("✅ Added column 'stars_prev' to tools table.");

        // 3. 初始化：将当前 stars 值复制到 stars_prev (首次运行时增长为 0)
        db.exec("UPDATE tools SET stars_prev = stars");
        console.log("✅ Initialized stars_prev with current stars values.");
    }

    console.log("\n🎉 Migration completed successfully!");
} catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
} finally {
    db.close();
}
