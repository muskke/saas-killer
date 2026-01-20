import { getAllTools, Tool } from '@/lib/db';
import Image from 'next/image';
import ToolGrid from '@/components/ToolGrid';
import Newsletter from '@/components/Newsletter';
import JsonLd from '@/components/JsonLd';

export default async function Home() {
  const allTools = await getAllTools(); // 这里拿到的是包含所有巨量信息的完整数据

  // 🔥 核心优化：在传给 Client Component 之前，手动创建一个“瘦身版”数组
  // 我们只提取 ToolGrid 真正需要的字段
  const slimTools = allTools.map((tool: Tool) => ({
    slug: tool.slug,
    name: tool.name,
    // 简介只取前 100 个字符，防止太长
    description: tool.description?.slice(0, 100) + '...',
    category: tool.category,
    parent_category: tool.parent_category,
    subcategory: tool.subcategory,
    stars: tool.stars,
    logo: tool.logo,
    // 如果 ToolGrid 还需要竞品名，就只留这一个，其他的 pros/cons/table 全扔掉
    rich_features: {
      competitor_name: tool.rich_features?.competitor_name
    }
  }));

  // 对瘦身后的数据排序
  // 🔥 最佳实践：只传递前 50 个工具给 Client Component 用于 SEO 和首屏显示
  // 其余的数据将通过 ToolGrid 内部的 useEffect 从 /api/tools 异步加载 (Hybrid Hydration)
  const initialTools = slimTools
    .sort((a: any, b: any) => b.stars - a.stars)
    .slice(0, 50);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SaaS Killer",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://saas-killer.chaos-meme.cn",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://saas-killer.chaos-meme.cn"}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="min-h-screen font-sans bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors duration-300">
      <JsonLd schema={websiteSchema} />

      {/* Hero Section - Compact Premium Design */}
      <section className="relative py-12 md:py-20 lg:py-24 px-4 text-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900 dark:bg-zinc-950"></div>
          {/* 🔥 LCP Optimization: Use next/image with priority */}
          <div className="absolute inset-0 opacity-70 dark:opacity-50">
            <Image
              src="/hero-bg.png"
              alt="Background"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 dark:from-zinc-950/30 dark:via-zinc-950/60 dark:to-zinc-950"></div>
          <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Badge - 更精简 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-6 backdrop-blur-sm shadow-lg">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span>Open Source Alternatives Directory</span>
          </div>

          {/* Headline - 字号略微缩小 */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-lg">
            Stop Paying{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">SaaS Rent.</span>
          </h1>

          {/* Subheadline - 间距减少 */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed px-4">
            Curated directory of <span className="text-white font-semibold">Open Source Alternatives</span>.
            Privacy-focused. Self-hosted. No hidden fees.
          </p>
        </div>
      </section>

      {/* 2. Client Side Interaction (交互引擎) */}
      {/* 我们把数据传给 ToolGrid，让它在浏览器里处理搜索 */}
      {/* 🚀 传给组件的是 slimTools，体积只有原来的 1/10 */}
      <ToolGrid tools={initialTools} />
      <Newsletter />



    </main>
  );
}