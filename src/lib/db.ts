// lib/db.ts
import path from "path";
import Database, { Database as DatabaseType } from "better-sqlite3";

// 缓存数据库连接实例
let db: DatabaseType | null = null;

function getDb(): DatabaseType {
  if (db) return db;

  const dbPath = path.join(process.cwd(), process.env.DATABASE_PATH || "data/tools.db");

  try {
    // 生产环境只读，且如果文件不存在直接报错
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
    return db;
  } catch (error) {
    console.error(`[DB Error] Failed to connect to database at ${dbPath}:`, error);
    throw new Error(`Database connection failed: ${dbPath}`);
  }
}

// 定义 RichFeatures 完整接口
export interface RichFeatures {
  competitor_name?: string;
  alternatives?: string[];
  best_for?: string;
  long_summary?: string;
  pros?: string[];
  cons?: string[];
  use_cases?: string[];
  comparison_table?: Record<string, { open_source: string; competitor: string }>;
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
  is_promoted?: number;
  rich_features: RichFeatures;
};

// 数据库行类型 (原始 SQLite 返回)
interface ToolRow extends Omit<Tool, 'rich_features'> {
  rich_features_json?: string;
}

export async function getAllTools(): Promise<Tool[]> {
  const database = getDb();

  // 🔥 SQL 查询：按星星倒序
  // 这里的查询速度是微秒级的
  const rows = database
    .prepare(
      `
    SELECT * FROM tools 
    ORDER BY is_promoted DESC, stars DESC
  `
    )
    .all() as ToolRow[];

  return rows.map((row) => ({
    ...row,
    rich_features: JSON.parse(row.rich_features_json || "{}") as RichFeatures,
  }));
}

// 获取单个工具 (详情页用) - 以前要在内存里遍历数组，现在直接索引查找
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const database = getDb();
  const row = database.prepare("SELECT * FROM tools WHERE slug = ?").get(slug) as ToolRow | undefined;

  if (!row) return null;

  return {
    ...row,
    rich_features: JSON.parse(row.rich_features_json || "{}") as RichFeatures,
  };
}

// 获取热门工具 (邮件推荐用) - 🔥 按本周星星增长排序
export async function getTopTools(limit: number = 3): Promise<Tool[]> {
  const database = getDb();

  // stars - stars_prev = 本周增长量
  // COALESCE 处理 stars_prev 可能为 NULL 的情况
  const rows = database
    .prepare(
      `
    SELECT *, (stars - COALESCE(stars_prev, 0)) AS star_growth 
    FROM tools 
    WHERE stars > stars_prev
    ORDER BY star_growth DESC
    LIMIT ?
  `
    )
    .all(limit) as ToolRow[];

  return rows.map((row) => ({
    ...row,
    rich_features: JSON.parse(row.rich_features_json || "{}") as RichFeatures,
  }));
}

