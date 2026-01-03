import { getAllTools } from '@/lib/db';
import ToolGrid from '@/components/ToolGrid';
import Newsletter from '@/components/Newsletter';

export default async function Home() {
  // 1. Server Side Fetching (SEO 友好)
  const tools = await getAllTools(); 
  const categories = Array.from(new Set(tools.map((t: any) => t.category))).filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Hero Section (保持不变，提升气场) */}
      <section className="bg-indigo-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Stop Paying <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SaaS Rent.</span>
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            The curated directory of <span className="text-white font-bold">Open Source Alternatives</span>. 
            <br/>Privacy-focused. Self-hosted. No hidden fees.
          </p>
        </div>
      </section>

      {/* 2. Client Side Interaction (交互引擎) */}
      {/* 我们把数据传给 ToolGrid，让它在浏览器里处理搜索 */}
      <ToolGrid tools={tools} categories={categories} />
      <Newsletter />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-400 text-sm">
        <p>&copy; 2026 The Venture Tyrant. Data via GitHub API.</p>
      </footer>

    </main>
  );
}