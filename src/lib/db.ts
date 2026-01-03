// lib/db.ts
import fs from 'fs/promises';
import path from 'path';

// 定义数据结构 (TypeScript 的好处)
export interface Tool {
  slug: string;
  name: string;
  category: string;
  stars: number;
  description: string;
  license: string;
  targetProprietary: string;
  summary?: string;
}

export async function getAllTools(): Promise<Record<string, Tool>> {
  // 找到 data/alternatives.json 的绝对路径
  const filePath = path.join(process.cwd(), 'data', 'alternatives.json');
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("❌ 找不到数据文件！请确保 data/alternatives.json 存在。");
    return {};
  }
}