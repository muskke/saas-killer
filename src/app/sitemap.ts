import { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/db';

// 🔥 这里的 URL 必须换成你 Vercel 部署后的真实域名！
// 如果你还没部署，先填个假的，部署后立马回来改！
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://saas-killer.chaos-meme.cn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toolsMap = await getAllTools();
  const tools = Object.values(toolsMap);

  // 1. 静态页面 (首页)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // 首页权重最高
    },
  ];

  // 2. 动态页面 (那几百个工具详情页)
  const dynamicPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/alternatives/${tool.slug}`,
    lastModified: new Date(), // 理想情况下，这里应该用 tool.updated_at
    changeFrequency: 'weekly',
    priority: 0.8, // 详情页权重次之
  }));

  // 3. 分类页面 (如果有的话，建议也加上)
  const categories = Array.from(new Set(tools.map((t) => t.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...dynamicPages];
}