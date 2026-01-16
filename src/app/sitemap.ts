import { MetadataRoute } from "next";
import { getAllTools } from "@/lib/db";
import { TAXONOMY_ARRAY } from "@/lib/taxonomy";

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

  // 4. 分类页面 (使用标准 Taxonomy)
  const categoryPages: MetadataRoute.Sitemap = TAXONOMY_ARRAY.map((cat) => ({
    // 使用 cat.id (例如 "Dev", "Business")
    url: `${BASE_URL}/category/${encodeURIComponent(cat.id.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 5. 对比页面 (VS Pages)
  const vsPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    // 这里的 URL 就是我们刚做的 /vs/slug
    url: `${BASE_URL}/vs/${encodeURIComponent(tool.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9, // SEO 权重给高一点，因为这是转化页
  }));

  return [...staticPages, ...categoryPages, ...dynamicPages, ...vsPages];
  // return [...staticPages, ...dynamicPages, ...vsPages];
}
