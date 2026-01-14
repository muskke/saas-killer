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

      {/* Hero Section - Theme Aware Premium Design */}
      <section className="relative py-28 md:py-36 px-4 text-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Base background color */}
          <div className="absolute inset-0 bg-slate-900 dark:bg-zinc-950"></div>

          {/* Background Image with better visibility */}
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-70 dark:opacity-50"></div>

          {/* Light mode: subtle dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 dark:from-zinc-950/30 dark:via-zinc-950/60 dark:to-zinc-950"></div>

          {/* Dark mode glow orb effect */}
          <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>The #1 Directory for Open Source Alternatives</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-tight text-white drop-shadow-lg">
            Stop Paying <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">SaaS Rent.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-300 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            The curated directory of <span className="text-white font-semibold">Open Source Alternatives</span>.
            <br className="hidden md:block" /> Privacy-focused. Self-hosted. No hidden fees.
          </p>
        </div>

        {/* Bottom gradient fade to content area */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-zinc-950 to-transparent"></div>
      </section>

      {/* 2. Client Side Interaction (交互引擎) */}
      {/* 我们把数据传给 ToolGrid，让它在浏览器里处理搜索 */}
      {/* 🚀 传给组件的是 slimTools，体积只有原来的 1/10 */}
      <ToolGrid tools={sortedTools} categories={categories} />
      <Newsletter />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 py-12 text-center text-gray-500 dark:text-zinc-500 text-sm bg-white dark:bg-zinc-950/50">
        <p>&copy; 2026 The Venture Tyrant. Data via GitHub API.</p>
      </footer>

    </main>
  );
}