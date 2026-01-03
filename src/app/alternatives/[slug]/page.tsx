import { notFound } from 'next/navigation';
import { getAllTools } from '@/lib/db';
import type { Metadata } from 'next';

// 1. 生成所有静态路径 (关键！不然 Next.js 不知道有哪些页面)
export async function generateStaticParams() {
  const tools = await getAllTools();
  return Object.keys(tools).map((slug) => ({
    slug: slug,
  }));
}

// 2. 动态生成 Meta 标签
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tools = await getAllTools();
  const tool = tools[params.slug];
  if (!tool) return {};
  
  return {
    title: `${tool.name} - Open Source Alternative`,
    description: tool.description,
  };
}

// 3. 页面内容
export default async function Page({ params }: { params: { slug: string } }) {
  const tools = await getAllTools();
  const tool = tools[params.slug];

  if (!tool) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-4">{tool.name}</h1>
      <div className="text-gray-600 mb-8">{tool.description}</div>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <p><strong>Stars:</strong> {tool.stars}</p>
        <p><strong>Category:</strong> {tool.category}</p>
        <p><strong>License:</strong> {tool.license}</p>
      </div>
    </main>
  );
}