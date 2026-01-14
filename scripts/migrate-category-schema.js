const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', process.env.DATABASE_PATH || 'data/tools.db');
const db = new Database(dbPath);

console.log('🔌 Connected to database:', dbPath);

try {
    // 1. Check if columns exist
    const tableInfo = db.prepare('PRAGMA table_info(tools)').all();
    const hasParent = tableInfo.some(col => col.name === 'parent_category');
    const hasSub = tableInfo.some(col => col.name === 'subcategory');

    console.log('🔍 Schema Check:', { hasParent, hasSub });

    // 2. Add parent_category
    if (!hasParent) {
        console.log('📝 Adding column: parent_category...');
        db.prepare('ALTER TABLE tools ADD COLUMN parent_category TEXT').run();
    } else {
        console.log('✅ Column parent_category already exists.');
    }

    // 3. Add subcategory
    if (!hasSub) {
        console.log('📝 Adding column: subcategory...');
        db.prepare('ALTER TABLE tools ADD COLUMN subcategory TEXT').run();
    } else {
        console.log('✅ Column subcategory already exists.');
    }

    console.log('🚀 Migration completed successfully!');
} catch (error) {
    console.error('❌ Migration failed:', error.message);
} finally {
    db.close();
}
