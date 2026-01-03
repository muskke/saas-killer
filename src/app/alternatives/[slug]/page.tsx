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
  const tool = tools[slug];
  
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
  const tool = tools[slug];

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
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4 flex items-center">
             🚀 Project Stats
           </h3>
           <ul className="space-y-3 text-sm">
             <li className="flex justify-between">
               <span className="text-gray-500">Stars</span>
               <span className="font-mono font-bold text-amber-500">★ {tool.stars.toLocaleString()}</span>
             </li>
             <li className="flex justify-between">
               <span className="text-gray-500">Category</span>
               <span className="font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                 {tool.category}
               </span>
             </li>
             <li className="flex justify-between">
               <span className="text-gray-500">License</span>
               <span className="font-mono">{tool.license}</span>
             </li>
           </ul>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col justify-center items-center text-center">
          <p className="text-indigo-900 font-bold mb-2">Ready to try it?</p>
          <a 
            href={tool.url || `https://github.com/search?q=${tool.name}`} 
            target="_blank"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg w-full md:w-auto"
          >
            Visit Website &rarr;
          </a>
          <p className="text-xs text-indigo-400 mt-3">External Link</p>
        </div>
      </div>
    </main>
  );
}