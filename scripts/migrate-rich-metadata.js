const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/tools.db');
const db = new Database(dbPath);

console.log('🛡️ Migrating database schema for Rich Metadata...');

try {
    // 1. Add pricing_model (Free, Open Core, Paid)
    try {
        db.prepare('ALTER TABLE tools ADD COLUMN pricing_model TEXT').run();
        console.log('✅ Added column: pricing_model');
    } catch (error) {
        if (!error.message.includes('duplicate column')) throw error;
        console.log('ℹ️ Column already exists: pricing_model');
    }

    // 2. Add deployment_complexity (1-10)
    try {
        db.prepare('ALTER TABLE tools ADD COLUMN deployment_complexity INTEGER').run();
        console.log('✅ Added column: deployment_complexity');
    } catch (error) {
        if (!error.message.includes('duplicate column')) throw error;
        console.log('ℹ️ Column already exists: deployment_complexity');
    }

    // 3. Add tech_stack (JSON array or string)
    try {
        db.prepare('ALTER TABLE tools ADD COLUMN tech_stack TEXT').run();
        console.log('✅ Added column: tech_stack');
    } catch (error) {
        if (!error.message.includes('duplicate column')) throw error;
        console.log('ℹ️ Column already exists: tech_stack');
    }

    // 4. Add license_type (MIT, AGPL, BSL)
    try {
        db.prepare('ALTER TABLE tools ADD COLUMN license_type TEXT').run();
        console.log('✅ Added column: license_type');
    } catch (error) {
        if (!error.message.includes('duplicate column')) throw error;
        console.log('ℹ️ Column already exists: license_type');
    }


    console.log('🎉 Schema migration completed successfully!');
} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
}
