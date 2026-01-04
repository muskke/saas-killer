// lib/db.ts
import path from "path";
import Database from "better-sqlite3";

// 缓存数据库连接实例
let db: any;

function getDb() {
  if (db) return db;
  const dbPath = path.join(process.cwd(), process.env.DATABASE_PATH || "data/tools.db");

  // 生产环境只读，且如果文件不存在直接报错
  db = new Database(dbPath, { readonly: true, fileMustExist: true });
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
  forks?: number;
  issues?: number;
  rich_features: any;
};

export async function getAllTools(): Promise<Tool[]> {
  const db = getDb();

  // 🔥 SQL 查询：按星星倒序
  // 这里的查询速度是微秒级的
  const rows = db
    .prepare(
      `
    SELECT * FROM tools 
    ORDER BY is_promoted DESC, stars DESC
  `
    )
    .all();

  return rows.map((row: any) => ({
    ...row,
    rich_features: JSON.parse(row.rich_features_json || "{}"),
  }));
}

// 获取单个工具 (详情页用) - 以前要在内存里遍历数组，现在直接索引查找
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM tools WHERE slug = ?").get(slug);

  if (!row) return null;

  return {
    ...row,
    rich_features: JSON.parse(row.rich_features_json || "{}"),
  };
}
