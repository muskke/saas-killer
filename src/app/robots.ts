import { MetadataRoute } from 'next';

const BASE_URL = 'https://your-project-name.vercel.app'; // 👈 记得改这里！

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // 如果以后有后台管理页，屏蔽掉
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}