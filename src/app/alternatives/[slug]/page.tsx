import { notFound } from 'next/navigation';
import { getAllTools, getToolBySlug } from '@/lib/db';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import Comments from '@/components/Comments';
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
  const tool = await getToolBySlug(slug); // 🔥 直接查库
  if (!tool) return { title: 'Tool Not Found' };
  
  // 🔥 攻击性 SEO 标题策略
  const competitor = tool.rich_features?.competitor_name || 'SaaS';
  const title = `${tool.name} - Free Open Source Alternative to ${competitor} (2026)`;
  
  const description = tool.rich_features?.long_summary?.slice(0, 160) || tool.description;

  return { 
    title: title,
    description: description,
    // OpenGraph: 当链接分享到 Twitter/Discord 时显示的卡片
    openGraph: {
      title: title,
      description: description,
      images: [tool.logo || '/default-cover.png'], // 最好有个默认封面
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug); // 🔥 直接查库，省内存

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
        
        {/* 🔥 终极融合卡片：Hero + Showcase */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          
          {/* 背景装饰：巨大的模糊 Logo 投影，贯穿整个卡片 */}
          {tool.logo && (
            <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none select-none">
              <img src={tool.logo} className="w-[500px] h-[500px] blur-3xl" alt="" />
            </div>
          )}

          <div className="p-8 md:p-12 relative z-10">
            
            {/* --- 上半部：身份与行动 (Identity) --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
              
              <div className="flex gap-6 items-start">
                {/* Logo */}
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner p-2">
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-4xl font-black text-indigo-500">{tool.name.charAt(0)}</span>
                  )}
                </div>
                
                {/* 标题与核心对标 */}
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {tool.name}
                  </h1>
                  
                  {/* 修复后的对标文案 */}
                  <p className="text-lg text-gray-500 font-medium flex items-center flex-wrap gap-2">
                    The open-source alternative to 
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg border border-indigo-100 font-bold text-base">
                      {tool.rich_features?.competitor_name || tool.rich_features?.alternatives?.[0] || 'SaaS'}
                    </span>
                  </p>

                  {/* Stars 放在标题下方，作为一个信任背书 */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-sm">
                      <Star size={16} fill="currentColor" />
                      <span>{(tool.stars / 1000).toFixed(1)}k</span>
                    </div>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-gray-400 text-sm font-mono">{tool.license}</span>
                  </div>
                </div>
              </div>

              {/* 核心 CTA 按钮 */}
              <div className="w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-3">
                <a href={tool.url} target="_blank" className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-gray-200 hover:-translate-y-1">
                  Visit Official Website <ExternalLink size={18} />
                </a>
                <p className="text-xs text-gray-400 text-center lg:text-right">
                  Free & Open Source
                </p>
              </div>
            </div>

            {/* --- 分隔线 (Divider) --- */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-10"></div>

            {/* --- 下半部：简介与场景 (Showcase) --- */}
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* 左侧：深度文案 (Story) */}
              <div className="lg:col-span-2 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🧐</span> What is {tool.name}?
                </h2>
                
                <div className="prose prose-lg text-gray-600 leading-relaxed">
                  <p>
                    {/* 优先显示 AI 长简介，兜底显示普通描述 */}
                    {tool.rich_features?.long_summary || tool.description}
                  </p>
                </div>

                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 text-indigo-900 text-sm font-medium inline-block">
                  💡 <strong>Bottom Line:</strong> Use this if you want 
                  <span className="mx-1 underline decoration-indigo-300 decoration-2 underline-offset-2">
                    {tool.rich_features?.best_for?.toLowerCase()}
                  </span> 
                  but hate paying monthly subscriptions.
                </div>
              </div>

              {/* 右侧：应用场景 (Use Cases) */}
              <div className="lg:col-span-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                  Best Used For
                </h4>
                
                <div className="flex flex-col gap-3">
                  {(tool.rich_features?.use_cases || ["Self-hosting", "Privacy", "Cost saving"]).map((useCase: string, idx: number) => (
                    <div key={idx} className="group flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-default">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-xl group-hover:scale-110 transition-transform">
                        {['🚀', '🛡️', '💰'][idx] || '✨'}
                      </div>
                      <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-700 transition-colors">
                        {useCase}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. 广告拦截位 */}
        <AdBanner category={tool.category} />

        {/* 4. 两栏布局：左侧参数，右侧深度分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧边栏 (Stats + Ad) */}
          <div className="space-y-6">
            
            {/* 1. 项目体检报告 (Project Vitality) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield size={20} className="text-indigo-500" /> 
                Project Vitality
              </h3>
              
              <div className="space-y-4 text-sm">
                {/* Tech Stack */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Tech Stack</span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {tool.language || 'N/A'}
                  </span>
                </div>

                {/* Last Update */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Last Update</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      new Date(tool.updated_at).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000 
                        ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                        : 'bg-orange-400'
                    }`}></span>
                    <span className="font-medium text-gray-700">
                      {new Date(tool.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Forks */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Community Forks</span>
                  <span className="font-mono font-bold text-gray-700">{tool.forks?.toLocaleString()}</span>
                </div>

                {/* Issues */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Open Issues</span>
                  <span className="font-mono text-gray-600">{tool.issues?.toLocaleString()}</span>
                </div>

                {/* License */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">License</span>
                  <span className="font-mono text-gray-600">{tool.license}</span>
                </div>

                {/* Best For Summary */}
                <div className="pt-3">
                  <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wider font-bold">Best For</span>
                  <div className="bg-gray-50 text-gray-700 p-3 rounded-xl text-sm leading-relaxed border border-gray-100">
                    {tool.rich_features?.best_for || 'Developers & Teams'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 🔥 侧边栏垂直广告 (赚钱的核心) */}
            <div className="relative overflow-hidden bg-[#0069ff] text-white p-6 rounded-3xl text-center shadow-lg hover:shadow-xl transition-all border border-blue-500 group">
                {/* 装饰背景泡泡 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-white text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl shadow-md">
                    ☁️
                  </div>
                  <h4 className="font-black text-xl mb-2">Deploy in Seconds</h4>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Don't struggle with localhost. Host <strong>{tool.name}</strong> on a fast cloud server.
                  </p>
                  
                  <a 
                    href="https://m.do.co/c/YOUR_CODE" 
                    target="_blank"
                    className="w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                  >
                    Get $200 Free Credit
                  </a>
                  <p className="text-[10px] text-blue-200 mt-3 opacity-60">New users only • DigitalOcean</p>
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

            {/* 5. 评论区 */}
            <Comments />
          </div>
        </div>
      </div>
    </main>
  );
}