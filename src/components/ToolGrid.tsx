'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* 搜索与筛选栏 */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        
        {/* 分类标签 (横向滚动) */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar mask-gradient">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'All' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Tools
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            placeholder="Search alternatives (e.g. Notion)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50 backdrop-blur-sm"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

          <AdBanner category={activeCategory} />

      {/* 工具列表网格 */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
          {/* 🔥 $$$ 强力插入：赞助商广告位 (The Money Maker) $$$ */}
          <div className="group flex flex-col bg-gradient-to-br from-indigo-900 to-blue-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-700 relative overflow-hidden">
            {/* 标签 */}
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
              SPONSORED
            </div>
            
            <div className="flex items-center gap-3 mb-4 z-10">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl">
                ☁️
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">DigitalOcean</h3>
                <p className="text-indigo-200 text-xs">Recommended Host</p>
              </div>
            </div>
            
            <p className="text-indigo-100 text-sm mb-4 flex-grow z-10">
              Don't just look at code—deploy it. Get <strong>$200 free credit</strong> to host any of these open-source tools instantly.
            </p>
            
            <a href="https://m.do.co/c/YOUR_AFFILIATE_CODE" target="_blank" className="mt-auto w-full bg-white text-indigo-900 font-bold py-2 rounded-lg text-center hover:bg-gray-100 transition-colors z-10">
              Claim $200 Credit &rarr;
            </a>
            
            {/* 装饰背景 */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          </div>
          {visibleTools.map((tool) => (
            <Link 
              key={tool.slug} 
              href={`/alternatives/${tool.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* 顶部标签 */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-indigo-500">{tool.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star size={12} fill="currentColor" />
                  <span>{(tool.stars / 1000).toFixed(1)}k</span>
                </div>
              </div>

              {/* 内容 */}
              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                {tool.description || `Open source alternative to ${tool.rich_features?.competitor_name || 'proprietary software'}.`}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                  {tool.category || 'Tool'}
                </span>
                <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1 text-sm font-bold">
                  View Analysis <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}

          {/* 🔥 新增：加载更多按钮 */}
          {visibleTools.length < filteredTools.length && (
            <div className="mt-12 text-center">
              <button 
                onClick={handleLoadMore}
                className="bg-white border border-gray-200 text-gray-900 font-bold py-3 px-8 rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all active:scale-95"
              >
                Load More Tools ({filteredTools.length - visibleTools.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 空状态 Empty State */
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-3xl">
            🤔
          </div>
          <h3 className="text-xl font-bold text-gray-900">No tools found</h3>
          <p className="text-gray-500 mt-2">Try searching for "Notion" or "Shopify"</p>
          <button 
            onClick={() => {setSearch(''); setActiveCategory('All');}}
            className="mt-6 text-indigo-600 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}