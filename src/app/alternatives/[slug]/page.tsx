import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTools, getToolBySlug } from "@/lib/db";
import { getCompetitorPrice } from "@/lib/pricing-utils";
import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Shield,
  Zap,
  Check,
  X,
  Github,
  Globe,
  ArrowRight,
} from "lucide-react";

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
  if (!tool) return { title: "Tool Not Found" };

  // 🔥 攻击性 SEO 标题策略
  const competitor = tool.rich_features?.competitor_name || "SaaS";
  const title = `${tool.name} - Free Open Source Alternative to ${competitor} (2026)`;

  const description =
    tool.rich_features?.long_summary?.slice(0, 160) || tool.description;

  return {
    title: title,
    description: description,
    // OpenGraph: 当链接分享到 Twitter/Discord 时显示的卡片
    openGraph: {
      title: title,
      description: description,
      images: [tool.logo || "/default-cover.png"], // 最好有个默认封面
    },
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug); // 🔥 直接查库，省内存

  if (!tool) notFound();

  // 1. 获取竞品名称
  const competitorName = tool.rich_features?.competitor_name || "SaaS";

  // 2. 使用统一的估价函数 (来自 lib/pricing-utils.ts)
  const pricePerUser = getCompetitorPrice(competitorName);
  const teamSize = 10; // 设定一个 Teaser 用的默认团队大小
  const annualLoss = pricePerUser * teamSize * 12; // 计算年亏损

  // 3. 构建结构化数据 (Schema)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://saas-killer.chaos-meme.cn";

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": "Web, All",
    "applicationCategory": tool.category,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.stars > 1000 ? (4.5 + Math.min(tool.stars / 100000, 0.4)).toFixed(1) : "4.0",
      "ratingCount": tool.stars
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.category,
        "item": `${baseUrl}/category/${encodeURIComponent(tool.category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `${baseUrl}/alternatives/${slug}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20">
      <JsonLd schema={softwareSchema} />
      <JsonLd schema={breadcrumbSchema} />
      {/* 1. 顶部面包屑/返回 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <a
          href="/"
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          ← Back to Directory
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* 🔥 终极融合卡片：Hero + Showcase */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          {/* 背景装饰：巨大的模糊 Logo 投影，贯穿整个卡片 */}
          {tool.logo && (
            <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none select-none">
              <img
                src={tool.logo}
                className="w-[500px] h-[500px] blur-3xl"
                alt=""
              />
            </div>
          )}

          <div className="p-8 md:p-12 relative z-10">
            {/* --- 上半部：身份与行动 (Identity) --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
              <div className="flex gap-6 items-start">
                {/* Logo */}
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner p-2">
                  {tool.logo ? (
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-4xl font-black text-indigo-500">
                      {tool.name.charAt(0)}
                    </span>
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
                      {tool.rich_features?.competitor_name ||
                        tool.rich_features?.alternatives?.[0] ||
                        "SaaS"}
                    </span>
                  </p>

                  {/* Stars 放在标题下方，作为一个信任背书 */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-sm">
                      <Star size={16} fill="currentColor" />
                      <span>{(tool.stars / 1000).toFixed(1)}k</span>
                    </div>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-gray-400 text-sm font-mono">
                      {tool.license}
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心 CTA 按钮 */}
              <div className="w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-3">
                <a
                  href={tool.url}
                  target="_blank"
                  className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-gray-200 hover:-translate-y-1"
                >
                  Visit Official Website <ExternalLink size={18} />
                </a>
                <p className="text-xs text-gray-400 text-center lg:text-right">
                  Free & Open Source
                </p>
                {/* 🔥 新增：对比页入口 */}
                {tool.rich_features?.competitor_name && (
                  <Link
                    href={`/vs/${tool.slug}`}
                    className="text-sm font-bold text-gray-500 hover:text-indigo-600 hover:underline flex items-center justify-center lg:justify-end gap-1 transition-all"
                  >
                    Compare with {tool.rich_features.competitor_name} →
                  </Link>
                )}
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
                  {(
                    tool.rich_features?.use_cases || [
                      "Self-hosting",
                      "Privacy",
                      "Cost saving",
                    ]
                  ).map((useCase: string, idx: number) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-default"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-xl group-hover:scale-110 transition-transform">
                        {["🚀", "🛡️", "💰"][idx] || "✨"}
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
                    {tool.language || "N/A"}
                  </span>
                </div>

                {/* Last Update */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Last Update</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${new Date(tool.updated_at).getTime() >
                        Date.now() - 90 * 24 * 60 * 60 * 1000
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                        : "bg-orange-400"
                        }`}
                    ></span>
                    <span className="font-medium text-gray-700">
                      {new Date(tool.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Forks */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Community Forks</span>
                  <span className="font-mono font-bold text-gray-700">
                    {tool.forks?.toLocaleString()}
                  </span>
                </div>

                {/* Issues */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">Open Issues</span>
                  <span className="font-mono text-gray-600">
                    {tool.issues?.toLocaleString()}
                  </span>
                </div>

                {/* License */}
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-400">License</span>
                  <span className="font-mono text-gray-600">
                    {tool.license}
                  </span>
                </div>

                {/* Best For Summary */}
                <div className="pt-3">
                  <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wider font-bold">
                    Best For
                  </span>
                  <div className="bg-gray-50 text-gray-700 p-3 rounded-xl text-sm leading-relaxed border border-gray-100">
                    {tool.rich_features?.best_for || "Developers & Teams"}
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
                  Don't struggle with localhost. Host{" "}
                  <strong>{tool.name}</strong> on a fast cloud server.
                </p>

                <a
                  href="https://m.do.co/c/YOUR_CODE"
                  target="_blank"
                  className="w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  Get $200 Free Credit
                </a>
                <p className="text-[10px] text-blue-200 mt-3 opacity-60">
                  New users only • DigitalOcean
                </p>
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
                    <li
                      key={i}
                      className="text-emerald-800 text-sm leading-relaxed flex gap-2"
                    >
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
                    <li
                      key={i}
                      className="text-rose-800 text-sm leading-relaxed flex gap-2"
                    >
                      <span className="shrink-0">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* “省钱卡片” (Teaser) */}
            {/* --- 💎 The "Premium" SaaS Tax Teaser --- */}
            <div className="relative group rounded-3xl bg-black border border-white/10 shadow-2xl overflow-hidden mb-16 isolate">
              {/* 1. 背景层：科技感网格 + 顶部聚光灯 */}
              {/* 网格背景 (Grid Pattern) */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              {/* 顶部聚光灯 (Spotlight) */}
              <div className="absolute left-0 top-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1/2 h-24 bg-indigo-500/20 blur-[100px]"></div>

              <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                {/* 左侧：强力文案 */}
                <div className="text-center md:text-left flex-1 space-y-4">
                  {/* 警告胶囊 */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Financial Leak Detected
                  </div>

                  {/* 渐变标题 */}
                  <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                    Stop the "SaaS Tax"
                  </h3>

                  <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                    Your team is burning cash. Switching to{" "}
                    <span className="text-indigo-400 font-bold">
                      {tool.name}
                    </span>{" "}
                    instantly boosts your runway.
                  </p>
                </div>

                {/* 右侧：全息数据仪表盘 (Holographic Dashboard) */}
                <div className="relative shrink-0 w-full md:w-auto">
                  {/* 仪表盘背景卡片 */}
                  <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group/chart cursor-default">
                    {/* 卡片内的光效 */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/30 blur-2xl rounded-full group-hover/chart:bg-indigo-400/40 transition-colors"></div>

                    <div className="flex items-end gap-8">
                      {/* Column 1: SaaS Cost (Bad) */}
                      <div className="flex flex-col items-center gap-3 group/bar">
                        <div className="text-center">
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                            Competitor
                          </div>
                          {/* Monospace 字体显示金额，更有数字感 */}
                          <div className="text-red-400 font-mono font-bold text-lg tabular-nums tracking-tight">
                            -${annualLoss.toLocaleString()}
                          </div>
                          {/* 🔥 新增：解释计算来源，增加可信度 */}
                          <div className="text-[9px] text-gray-600 font-medium mt-1">
                            (Est. {teamSize} users @ ${pricePerUser}/mo)
                          </div>
                        </div>

                        {/* 柱状图 */}
                        <div className="w-16 h-32 bg-gray-800 rounded-t-lg relative overflow-hidden border-x border-t border-white/5">
                          {/* 红色填充动画 */}
                          <div className="absolute bottom-0 left-0 right-0 h-[85%] bg-gradient-to-t from-red-900/80 to-red-500/80 transition-all duration-1000 group-hover/chart:h-[90%]">
                            {/* 纹理线条 */}
                            <div className="w-full h-px bg-red-400/30 mt-1"></div>
                            <div className="absolute top-0 inset-x-0 h-px bg-red-400/50 shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
                          </div>
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="h-32 flex flex-col justify-center pb-8">
                        <span className="text-gray-600 font-black italic text-xl opacity-50">
                          vs
                        </span>
                      </div>

                      {/* Column 2: Open Source (Good) */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-center">
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                            Self-Hosted
                          </div>
                          <div className="text-emerald-400 font-mono font-bold text-lg tabular-nums tracking-tight">
                            $0
                          </div>
                        </div>

                        {/* 柱状图 */}
                        <div className="w-16 h-32 flex items-end justify-center relative">
                          {/* 绿色微小柱体 */}
                          <div className="w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* CTA 按钮覆盖层 */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <Link
                        href={`/vs/${tool.slug}`}
                        className="flex items-center justify-between w-full group/btn"
                      >
                        <span className="text-sm font-bold text-white group-hover/btn:text-indigo-300 transition-colors">
                          Launch Calculator
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-indigo-500 group-hover/btn:scale-110 transition-all">
                          <ArrowRight size={14} className="text-white" />
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* 装饰性数据标签 (悬浮在卡片外) */}
                  <div className="absolute -right-4 -top-4 bg-yellow-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded shadow-lg transform rotate-6 border border-yellow-200">
                    SAVE 100%
                  </div>
                </div>
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
