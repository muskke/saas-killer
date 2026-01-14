import { getAllTools, Tool } from '@/lib/db';
import ToolGrid from '@/components/ToolGrid';
import Newsletter from '@/components/Newsletter';

export default async function Home() {
  const allTools = await getAllTools(); // 这里拿到的是包含所有巨量信息的完整数据

  /// 🔥 核心优化：在传给 Client Component 之前，手动创建一个“瘦身版”数组
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
  const sortedTools = slimTools.sort((a, b) => b.stars - a.stars);

  const categories = Array.from(new Set(allTools.map((t: Tool) => t.category))).filter(Boolean) as string[];

  return (
    <main className="min-h-screen font-sans bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors duration-300">

      {/* Hero Section - Compact Premium Design */}
      <section className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900 dark:bg-zinc-950"></div>
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-70 dark:opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 dark:from-zinc-950/30 dark:via-zinc-950/60 dark:to-zinc-950"></div>
          <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Badge - 更精简 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span>Open Source Alternatives Directory</span>
          </div>

          {/* Headline - 字号略微缩小 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-lg">
            Stop Paying{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">SaaS Rent.</span>
          </h1>

          {/* Subheadline - 间距减少 */}
          <p className="text-base md:text-lg text-gray-300 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Curated directory of <span className="text-white font-semibold">Open Source Alternatives</span>.
            Privacy-focused. Self-hosted. No hidden fees.
          </p>
        </div>
      </section>

      {/* 2. Client Side Interaction (交互引擎) */}
      {/* 我们把数据传给 ToolGrid，让它在浏览器里处理搜索 */}
      {/* 🚀 传给组件的是 slimTools，体积只有原来的 1/10 */}
      <ToolGrid tools={sortedTools} />
      <Newsletter />



    </main>
  );
}