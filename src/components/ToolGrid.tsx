'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, ArrowRight } from 'lucide-react';
import AdBanner from './AdBanner';

type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  stars: number;
  logo?: string;
  license?: string;
  rich_features?: {
    competitor_name?: string;
    best_for?: string;
  };
};

export default function ToolGrid({ tools, categories }: { tools: Tool[], categories: string[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // 🔥 新增：分页状态，默认只显示 24 个
  const [displayCount, setDisplayCount] = useState(24);

  // 🔥 核心修复：使用 useMemo 缓存过滤逻辑，并增加空值防御
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 1. 防御：如果数据缺胳膊少腿，直接跳过，防止 .toLowerCase() 报错
      if (!tool || !tool.name) return false;

      // 2. 安全获取字段 (如果不小心是 null，就变成空字符串)
      const toolName = (tool.name || '').toLowerCase();
      const toolDesc = (tool.description || '').toLowerCase();
      const toolCat = (tool.category || 'Uncategorized'); // 保持原大小写用于显示
      const searchLower = search.toLowerCase();

      // 3. 搜索匹配逻辑
      const matchesSearch = toolName.includes(searchLower) ||
        toolDesc.includes(searchLower);

      // 4. 分类匹配逻辑
      const matchesCategory = activeCategory === 'All' || toolCat === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, search, activeCategory]);

  // 🔥 核心：截取当前要显示的数据
  const visibleTools = filteredTools.slice(0, displayCount);

  // 处理“加载更多”
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 24);
  };

  // 简单的哈希函数，根据分类名生成一致的颜色
  const getCategoryColor = (cat: string) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-100', // Developer
      'bg-purple-50 text-purple-700 border-purple-100', // Creative
      'bg-emerald-50 text-emerald-700 border-emerald-100', // Business
      'bg-orange-50 text-orange-700 border-orange-100', // Other
    ];
    // 简单的分配逻辑
    if (['BaaS', 'DevOps', 'Monitoring', 'Security', 'Database', 'AI/ML'].includes(cat)) return colors[0];
    if (['Design', 'Media', 'Docs', 'Note-taking'].includes(cat)) return colors[1];
    if (['CRM', 'ERP', 'Finance', 'Marketing', 'E-commerce'].includes(cat)) return colors[2];
    return colors[3];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">

      {/* 搜索与筛选区域 - 重新设计 */}
      <div className="mb-8">
        {/* 搜索框 - 更突出 */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search 200+ open source alternatives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 transition-all outline-none text-lg shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={22} />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 分类标签 - 居中显示 */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeCategory === 'All'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeCategory === cat
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <AdBanner category={activeCategory} />

      {/* 工具列表网格 */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 赞助商广告位 */}
          <div className="group flex flex-col bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            {/* 标签 */}
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
              SPONSORED
            </div>

            <div className="flex items-center gap-3 mb-4 z-10">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-md">
                ☁️
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">DigitalOcean</h3>
                <p className="text-indigo-200 text-xs">Recommended Host</p>
              </div>
            </div>

            <p className="text-indigo-100 text-sm mb-4 flex-grow z-10">
              Don't just look at code—deploy it. Get <strong className="text-white">$200 free credit</strong> to host any of these open-source tools instantly.
            </p>

            <a href="https://m.do.co/c/YOUR_AFFILIATE_CODE" target="_blank" className="mt-auto w-full bg-white text-indigo-700 font-bold py-2.5 rounded-lg text-center hover:bg-indigo-50 transition-colors z-10 flex items-center justify-center gap-2">
              Claim $200 Credit
              <ArrowRight size={16} />
            </a>
          </div>

          {visibleTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/alternatives/${tool.slug}`}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* 顶部标签 */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  {tool.logo ? (
                    <Image src={tool.logo} alt={tool.name} width={48} height={48} className="w-full h-full object-contain" unoptimized />
                  ) : (
                    <span className="text-xl font-bold text-indigo-500">{tool.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star size={12} fill="currentColor" />
                  <span>{(tool.stars / 1000).toFixed(1)}k</span>
                </div>
              </div>

              {/* 内容 */}
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4 line-clamp-2 h-10">
                {tool.description || `Open source alternative to ${tool.rich_features?.competitor_name || 'proprietary software'}.`}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${getCategoryColor(tool.category)}`}>
                  {tool.category || 'Tool'}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1 text-sm font-bold">
                  View Analysis <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}

          {/* 加载更多按钮 */}
          {visibleTools.length < filteredTools.length && (
            <div className="col-span-full mt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white font-bold py-3 px-8 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 hover:shadow-md transition-all active:scale-95"
              >
                Load More Tools ({filteredTools.length - visibleTools.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 空状态 Empty State */
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4 text-3xl">
            🤔
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No tools found</h3>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">Try searching for "Notion" or "Shopify"</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}