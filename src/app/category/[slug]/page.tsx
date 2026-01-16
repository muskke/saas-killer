import { getAllTools } from "@/lib/db";
import { TAXONOMY_ARRAY as TAXONOMY } from "@/lib/taxonomy";
import ToolGrid from "@/components/ToolGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. 生成静态路由 (SSG)
export async function generateStaticParams() {
    return TAXONOMY.map((category) => ({
        // 确保 slug 与 sitemap 生成逻辑（toLowerCase）一致
        slug: category.id.toLowerCase(),
    }));
}

// 2. 动态 SEO 信息
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // 查找对应的分类 ID
    // 我们比较 slug 和 id.toLowerCase()
    const category = TAXONOMY.find((c) => c.id.toLowerCase() === slug.toLowerCase());

    if (!category) return { title: "Category Not Found" };

    return {
        title: `Best Open Source ${category.label} Alternatives (2026)`,
        description: `Browse the best open-source alternatives for ${category.label} software. Self-host and save money.`,
        alternates: {
            canonical: `/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const tools = await getAllTools();

    // 这里的 slug 是小写的 (e.g. "devops")
    // 我们需要找到原始的 Case-Sensitive ID (e.g. "DevOps") 传给 ToolGrid
    const category = TAXONOMY.find((c) => c.id.toLowerCase() === slug.toLowerCase());

    if (!category) {
        notFound();
    }

    // 筛选出属于该分类的工具，用于传给 ToolGrid (虽然 ToolGrid 自己也会筛选，但如果是作为 Initial State 更好)
    // 其实 ToolGrid 接收的是全部 tools，然后通过 initialCategory state 来控制显示
    // 所以我们可以直接把全部 tools 传进去，只要设置 initialCategory={category.id} 即可

    return (
        <main className="min-h-screen font-sans bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors duration-300">

            {/* Category Header */}
            <section className="relative py-12 md:py-16 px-4 text-center overflow-hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-4">
                        {category.icon} {category.label} Directory
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                        Open Source <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{category.label}</span> Tools
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Find the best self-hosted alternatives for {category.label} software.
                    </p>
                </div>
            </section>

            <ToolGrid tools={tools} initialCategory={category.id} />
        </main>
    );
}
