// lib/db.ts
import fs from 'fs/promises';
import path from 'path';
import Database from 'better-sqlite3';

// 缓存数据库连接实例
let db: any;

function getDb() {
  if (db) return db;
  // Vercel 生产环境和本地环境路径可能不同，这里做个兼容
  const dbPath = path.join(process.cwd(), 'data', 'tools.db');
  db = new Database(dbPath, { readonly: true }); // 网页端只读，保证安全
  return db;
}

// 定义数据结构 (TypeScript 的好处)
export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  stars: number;
  logo: string;
  url: string;
  license: string;
  language: string;
  updated_at: string;
  rich_features: any; // 之前是对象，现在我们解析出来还是对象
};

export async function getAllTools(): Promise<Tool[]> {
  const db = getDb();
  
  // 🔥 SQL 查询：按星星倒序
  // 这里的查询速度是微秒级的
  const rows = db.prepare(`
    SELECT * FROM tools 
    ORDER BY is_promoted DESC, stars DESC
  `).all();

  // 数据清洗：把 rich_features_json 还原回对象
  return rows.map((row: any) => ({
    ...row,
    rich_features: JSON.parse(row.rich_features_json || '{}')
  }));
}

// 获取单个工具 (详情页用) - 以前要在内存里遍历数组，现在直接索引查找
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM tools WHERE slug = ?').get(slug);
  
  if (!row) return null;

  return {
    ...row,
    rich_features: JSON.parse(row.rich_features_json || '{}')
  };
}