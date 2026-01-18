import { notFound } from "next/navigation";
import { getAllTools, getToolBySlug } from "@/lib/db";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import ToolHero from "@/components/tool-detail/ToolHero";
import ToolBentoGrid from "@/components/tool-detail/ToolBentoGrid";
import SaaSValueCalculator from "@/components/tool-detail/SaaSValueCalculator";
import AdSection from "@/components/tool-detail/AdSection";

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
      canonical: `/alternatives/${slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug); // 🔥 直接查库，省内存

  if (!tool) notFound();

  // 🔥 容错处理：如果不幸遇到 category 为 null 的脏数据
  if (!tool.category) {
    // @ts-ignore
    tool.category = "Uncategorized";
  }

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
    <main className="min-h-screen bg-gray-50 dark:bg-black pb-20">
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

        {/* New Modular Layout */}
        <ToolHero tool={tool} />

        <ToolBentoGrid tool={tool} />

        <SaaSValueCalculator tool={tool} />

        <AdSection category={tool.category} />

        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Community Discussion
          </h3>
          <Comments />
        </div>

      </div>
    </main>
  );
}
