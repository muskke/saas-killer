import { notFound } from 'next/navigation';
import { getAllTools } from '@/lib/db';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import { CheckCircle2, AlertCircle, ExternalLink, Star, Shield, Zap } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool: any) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tools = await getAllTools();
  const tool = tools.find((t: any) => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found' };
  return { title: `${tool.name} - Open Source Alternative to ${tool.rich_features?.alternatives?.[0] || 'SaaS'}` };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tools = await getAllTools();
  const tool = tools.find((t: any) => t.slug === slug);

  if (!tool) notFound();

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* 1. 顶部面包屑/返回 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <a href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
          ← Back to Directory
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* 2. 核心头部 (Hero) */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {tool.logo ? (
                  <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-3xl font-black text-indigo-500">{tool.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">{tool.name}</h1>
                <p className="text-lg text-gray-500 font-medium">
                  Alternative to{' '}
                  <span className="text-indigo-600 font-bold">
                    {/* 优先读取 AI 生成的单一竞品名，如果没有，再尝试读旧的列表，最后兜底 */}
                    {tool.rich_features?.competitor_name || tool.rich_features?.alternatives?.[0] || 'SaaS Tools'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl font-bold border border-amber-100">
                <Star size={20} fill="currentColor" />
                {(tool.stars / 1000).toFixed(1)}k Stars
              </div>
              <a href={tool.url} target="_blank" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
                Visit Source <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* 3. 广告拦截位 */}
        <AdBanner category={tool.category} />

        {/* 4. 两栏布局：左侧参数，右侧深度分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧边栏 (Stats) */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield size={20} className="text-indigo-500" /> Project Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-400">License</span>
                  <span className="font-mono font-bold text-gray-700">{tool.license}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-400">Category</span>
                  <span className="font-bold text-indigo-600">{tool.category}</span>
                </div>
                <div className="py-3">
                  <span className="text-gray-400 block mb-2">Ideal For</span>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold">
                    {tool.rich_features?.best_for || 'General Use'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧主栏 (Analysis) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 优点与挑战 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" /> Key Pros
                </h4>
                <ul className="space-y-3">
                  {tool.rich_features?.pros?.map((p: string, i: number) => (
                    <li key={i} className="text-emerald-800 text-sm leading-relaxed flex gap-2">
                      <span className="shrink-0">•</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
                <h4 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-rose-500" /> Challenges
                </h4>
                <ul className="space-y-3">
                  {tool.rich_features?.cons?.map((c: string, i: number) => (
                    <li key={i} className="text-rose-800 text-sm leading-relaxed flex gap-2">
                      <span className="shrink-0">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 核心对比表格 (AI Powered) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-12">
              <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="text-yellow-400" /> 
                  <span>The "SaaS Tax" Calculator</span> 
                </h3>
                <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-400 uppercase tracking-wider font-bold">
                  VS {tool.rich_features?.competitor_name || 'Proprietary SaaS'}
                </span>
              </div>
              
              <div className="p-0">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase w-1/3">Feature</th>
                      <th className="p-6 text-xs font-bold text-indigo-600 uppercase text-center w-1/3">{tool.name}</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase text-center w-1/3">
                        {tool.rich_features?.competitor_name || 'SaaS'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* 🔥 动态渲染 AI 生成的 3 行数据 */}
                    {(tool.rich_features?.comparison_table || []).map((row: any, index: number) => (
                      <tr key={index}>
                        <td className="p-6 text-sm font-bold text-gray-700 flex items-center gap-2">
                          {row.feature}
                          {/* 如果是第一行(价格)，加个小火苗 */}
                          {index === 0 && <span className="text-xs text-orange-500">🔥</span>}
                        </td>
                        
                        {/* 我方 (OS) */}
                        <td className="p-6 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-200">
                            <CheckCircle2 size={14} />
                            {row.os_value}
                          </div>
                        </td>

                        {/* 敌方 (SaaS) */}
                        <td className="p-6 text-center">
                          <div className={`inline-flex items-center gap-1.5 text-sm font-medium ${index === 0 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            {/* 只有价格行加删除线，其他行正常显示 */}
                            <span className={index === 0 ? "line-through decoration-red-300" : ""}>
                              {row.saas_value}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {/* ⚠️ 万一 AI 没生成数据 (Fallback)，显示默认行，防止表格塌陷 */}
                    {(!tool.rich_features?.comparison_table) && (
                       <tr>
                         <td className="p-6 text-center text-gray-400 italic" colSpan={3}>
                           AI analysis pending...
                         </td>
                       </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}