import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X, Shield, Zap, Coins } from "lucide-react";
import { getToolBySlug, getAllTools } from "@/lib/db";
import AdBanner from "@/components/AdBanner";
import SaaSTaxCalculator from "@/components/SaaSTaxCalculator";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. 生成静态路由
export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

// 2. Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};

  const competitor = tool.rich_features?.competitor_name || "SaaS";

  return {
    title: `${competitor} vs ${tool.name}: The Honest Comparison (2026)`,
    description: `See how much you save by switching from ${competitor} to ${tool.name}. Full feature comparison and ROI calculator inside.`,
  };
}

export default async function VsPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) notFound();

  const competitor =
    tool.rich_features?.competitor_name || "Proprietary Software";

  const comparisonData = tool.rich_features?.comparison_table;

  // 定义对比表值的类型
  type ComparisonValue = {
    open_source?: string;
    competitor?: string;
    saas_value?: string;
    os_value?: string;
  };

  let comparisons: { feature: string; saas_value: string; os_value: string }[] = [];

  if (comparisonData) {
    // 将数据库中的 Record<string, ...> 转换为数组格式
    comparisons = Object.entries(comparisonData).map(([key, val]) => {
      const v = val as ComparisonValue;
      return {
        feature: key,
        saas_value: v.competitor || v.saas_value || "N/A",
        os_value: v.open_source || v.os_value || "Yes"
      };
    });
  } else {
    // 默认值
    comparisons = [
      {
        feature: "Pricing",
        saas_value: "$$$ Monthly Subscription",
        os_value: "Free & Open Source",
      },
      {
        feature: "Data Privacy",
        saas_value: "They own your data",
        os_value: "100% Self-hosted",
      },
      {
        feature: "Customization",
        saas_value: "Limited",
        os_value: "Full Code Access",
      },
    ];
  }

  const toolUrl = tool.url;
  // 🔥 这里的 content 标记为 'vs-card'，以便区分流量来源是“卡片”还是“计算器”
  const trackableUrl = `${toolUrl}${toolUrl.includes("?") ? "&" : "?"
    }utm_source=saas-killer&utm_medium=directory&utm_content=vs-card`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* 顶部导航 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href={`/alternatives/${tool.slug}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          ← Back to {tool.name} Overview
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* 1. 擂台头部 */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
            The Showdown
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
            <span className="text-red-500 line-through decoration-4 decoration-red-300 opacity-60">
              {competitor}
            </span>
            <span className="mx-4 text-gray-300 dark:text-gray-600">vs</span>
            <span className="text-indigo-600 dark:text-indigo-400">{tool.name}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Why pay monthly fees for {competitor} when you can self-host{" "}
            {tool.name} for free? Let's look at the facts.
          </p>
        </div>

        {/* 2. 对比卡片区 */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 relative">
          {/* VS 图标 (绝对定位在中间) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full items-center justify-center shadow-xl border-4 border-gray-100 z-10 font-black text-xl text-gray-300 italic">
            VS
          </div>

          {/* 左侧：SaaS (反派) */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 shadow-sm opacity-80 grayscale-[0.3]">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400">{competitor}</h3>
              <p className="text-red-500 font-medium text-sm mt-1">
                The Expensive Option
              </p>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <X className="text-red-500 shrink-0" />
                <span>Closed Source (Black box)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <X className="text-red-500 shrink-0" />
                <span>Expensive monthly fees per user</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <X className="text-red-500 shrink-0" />
                <span>Data stored on their servers</span>
              </li>
            </ul>
          </div>

          {/* 右侧：Open Source (主角) */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-indigo-500 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              WINNER
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                {tool.name}
              </h3>
              <p className="text-green-600 dark:text-green-500 font-medium text-sm mt-1">
                The Freedom Choice
              </p>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium">
                <Check className="text-green-500 shrink-0" />
                <span>100% Open Source Code</span>
              </li>
              <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium">
                <Check className="text-green-500 shrink-0" />
                <span>Free forever (Self-hosted)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium">
                <Check className="text-green-500 shrink-0" />
                <span>You own your data completely</span>
              </li>
            </ul>
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800">
              <a
                href={trackableUrl}
                target="_blank"
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get {tool.name} Now
              </a>
            </div>
          </div>
        </div>

        {/* 🔥 3. 插入计算器 (The Weapon) */}
        {/* 这里是用户的决策高潮点：看完对比，直接算账 */}
        <SaaSTaxCalculator competitorName={competitor} toolUrl={tool.url} />

        {/* 4. 详细参数对比表 (Logic Support) */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mb-16">
          <div className="bg-gray-50 dark:bg-zinc-950 px-8 py-4 border-b border-gray-200 dark:border-zinc-800">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Detailed Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {comparisons.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 p-6 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="col-span-3 md:col-span-1 font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {idx === 0 ? (
                    <Coins size={18} className="text-amber-500" />
                  ) : idx === 1 ? (
                    <Shield size={18} className="text-indigo-500" />
                  ) : (
                    <Zap size={18} className="text-blue-500" />
                  )}
                  {row.feature}
                </div>
                <div className="col-span-3 md:col-span-2 grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">{row.saas_value}</div>
                  <div className="text-indigo-700 dark:text-indigo-400 font-bold">
                    {row.os_value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 底部广告 */}
        <AdBanner category={tool.category} />
      </div>
    </main>
  );
}
