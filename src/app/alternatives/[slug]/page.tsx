import { notFound } from 'next/navigation';
import { getAllTools } from '@/lib/db';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';

// 定义类型：注意！Params 现在是 Promise 了！
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. 静态生成参数 (这个不需要变，因为它是在构建时运行的)
export async function generateStaticParams() {
  const tools = await getAllTools();
  return Object.keys(tools).map((slug) => ({
    slug: slug,
  }));
}

// 2. 动态 Meta 标签 (必须 await params)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // 👈 关键修复：先解包！
  const tools = await getAllTools();
  const tool = tools.find((t: any) => t.slug === slug);
  
  if (!tool) return {};
  
  return {
    title: `${tool.name} - Open Source Alternative`,
    description: tool.description,
  };
}

// 3. 页面内容 (必须 await params)
export default async function Page({ params }: Props) {
  const { slug } = await params; // 👈 关键修复：先解包！
  const tools = await getAllTools();
  const tool = tools.find((t: any) => t.slug === slug);

  if (!tool) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 font-sans">
      {/* 顶部 Header */}
      <div className="mb-8 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-4 mb-4">
           {/* 显示 Logo */}
           <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
             {tool.logo ? (
                <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
             ) : (
                <span className="text-2xl font-bold text-indigo-500">{tool.name.charAt(0)}</span>
             )}
           </div>
           <div>
             <h1 className="text-4xl font-black text-gray-900">{tool.name}</h1>
             <p className="text-gray-500 font-mono text-sm">{tool.full_name}</p>
           </div>
        </div>
        
        <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
          {tool.description}
        </p>
      </div>

      <AdBanner category={tool.category} />
      
      {/* 详情数据区 */}
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        
        {/* 左侧：核心参数 (占 1 列) */}
        <div className="col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-4">📊 Project Stats</h3>
             {/* ... (原来的 Stars/License 代码) ... */}
             <div className="mt-4 pt-4 border-t border-gray-100">
               <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Best For</span>
               <p className="font-medium text-indigo-900 mt-1">
                 {tool.rich_features?.best_for || "Developers"}
               </p>
             </div>
             <div className="mt-4">
               <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Replaces</span>
               <div className="flex flex-wrap gap-2 mt-1">
                 {(tool.rich_features?.alternatives || ["SaaS"]).map((alt: string) => (
                   <span key={alt} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 line-through decoration-red-400">
                     {alt}
                   </span>
                 ))}
               </div>
             </div>
           </div>
           
           {/* 广告位放在这里 */}
           <div className="bg-indigo-900 text-white p-6 rounded-xl text-center">
              <p className="font-bold mb-2">Deploy {tool.name}</p>
              <p className="text-sm opacity-80 mb-4">Get $200 free credit on DigitalOcean</p>
              <a href="..." className="block bg-white text-indigo-900 font-bold py-2 rounded-lg text-sm">Start Free</a>
           </div>
        </div>

        {/* 右侧：AI 深度点评 (占 2 列) - 核心价值区 */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* 优点卡片 */}
          <div className="bg-emerald-50/50 p-8 rounded-2xl border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">👍</span> Why use {tool.name}?
            </h3>
            {/* 🔥 武器二：对比拦截器 - 截获 "X vs Y" 搜索流量 */}
            <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black mb-8 text-center">
                How it stacks up against <span className="text-red-500 line-through">Proprietary Apps</span>
              </h3>
              
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-4 mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <div>Feature</div>
                <div className="text-center">{tool.name}</div>
                <div className="text-center">Proprietary SaaS</div>
              </div>

              {/* 1. 成本对比 */}
              <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-50 items-center">
                <div className="font-bold text-gray-600">Cost</div>
                <div className="text-center text-green-600 font-bold bg-green-50 py-2 rounded-lg">FREE (Self-hosted)</div>
                <div className="text-center text-red-600 font-bold bg-red-50 py-2 rounded-lg">$10 - $50 / mo</div>
              </div>

              {/* 2. 数据掌控 */}
              <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-50 items-center">
                <div className="font-bold text-gray-600">Data Ownership</div>
                <div className="text-center text-gray-900 font-medium">100% Yours (On-premise)</div>
                <div className="text-center text-gray-400">Cloud Locked (Third-party)</div>
              </div>

              {/* 3. AI 动态对比 (利用之前脚本里的 alternatives 字段) */}
              <div className="grid grid-cols-3 gap-4 py-4 items-center">
                <div className="font-bold text-gray-600">Main Focus</div>
                <div className="text-center text-indigo-600 font-bold">{tool.category}</div>
                <div className="text-center text-gray-900 font-medium italic">
                  {tool.rich_features?.alternatives?.[0] || "Standard SaaS"}
                </div>
              </div>
            </div>
            <ul className="space-y-4">
              {(tool.rich_features?.pros || ["Open Source", "Self-hosted"]).map((pro: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span className="text-emerald-900 leading-relaxed">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 缺点卡片 (显得客观，增加信任感) */}
          <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100">
            <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Things to consider
            </h3>
            <ul className="space-y-4">
              {(tool.rich_features?.cons || ["Setup required"]).map((con: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-xs font-bold shrink-0">!</div>
                  <span className="text-orange-900 leading-relaxed">{con}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}