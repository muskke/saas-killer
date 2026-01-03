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

export async function getAllTools() {
  const filePath = path.join(process.cwd(), 'data', 'alternatives.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const toolsMap = JSON.parse(fileContents);
    const tools = Object.values(toolsMap);

    // 🔥 商业逻辑：置顶付费广告 (Promoted) > 星星数量 (Stars)
    return tools.sort((a: any, b: any) => {
      if (a.promoted && !b.promoted) return -1;
      if (!a.promoted && b.promoted) return 1;
      return b.stars - a.stars;
    });
  } catch (error) {
    return [];
  }
}