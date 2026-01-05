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
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* Hero Section (保持不变，提升气场) */}
      <section className="bg-indigo-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-indigo-900/80"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Stop Paying <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SaaS Rent.</span>
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            The curated directory of <span className="text-white font-bold">Open Source Alternatives</span>.
            <br />Privacy-focused. Self-hosted. No hidden fees.
          </p>
        </div>
      </section>

      {/* 2. Client Side Interaction (交互引擎) */}
      {/* 我们把数据传给 ToolGrid，让它在浏览器里处理搜索 */}
      {/* 🚀 传给组件的是 slimTools，体积只有原来的 1/10 */}
      <ToolGrid tools={sortedTools} categories={categories} />
      <Newsletter />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-400 text-sm">
        <p>&copy; 2026 The Venture Tyrant. Data via GitHub API.</p>
      </footer>

    </main>
  );
}