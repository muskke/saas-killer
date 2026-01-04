import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/db";

// 🔥 这里的 URL 必须换成你 Vercel 部署后的真实域名！
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://saas-killer.chaos-meme.cn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 获取所有工具
  // (注意：SQLite版本 getAllTools 返回的是数组，直接用即可)
  const tools = await getAllTools();

  // 2. 静态页面 (首页)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0, // 首页权重最高
    },
  ];

  // 3. 动态页面 (工具详情)
  const dynamicPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    // 这里也建议加上 encodeURIComponent，防止 slug 里有怪字符
    url: `${BASE_URL}/alternatives/${encodeURIComponent(tool.slug)}`,
    lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8, // 详情页权重次之
  }));

  // 4. 分类页面 (修复核心)
  // Step A: 过滤掉 null/undefined/空字符串
  const rawCategories = tools
    .map((t) => t.category)
    .filter((c) => c && c.trim() !== "");

  // Step B: 去重
  const categories = Array.from(new Set(rawCategories));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    // 🔥 核心修复：encodeURIComponent
    // 它会把 "Creative & Office" 变成 "Creative%20%26%20Office"
    // 这样 XML 就不会报错了！
    url: `${BASE_URL}/category/${encodeURIComponent(cat.trim().toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...dynamicPages];
}
