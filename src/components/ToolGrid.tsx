'use client'; // 👈 关键！声明这是客户端组件，可以交互

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 定义数据类型 (保持和 db.ts 一致)
type Tool = {
  slug: string;
  name: string;
  full_name?: string;
  logo?: string;
  category: string;
  stars: number;
  description: string;
};

export default function ToolGrid({ tools, categories }: { tools: Tool[], categories: string[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // 🔥 核心逻辑：实时过滤 (Real-time Filtering)
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="tools" className="max-w-7xl mx-auto px-4 py-12">
      
      {/* --- C: 交互区 (搜索 + 筛选) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        
        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-2 no-scrollbar space-x-2 w-full md:w-auto">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Real Search Input */}
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search tools..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {/* --- A: 视觉升级网格 (Logos + Cards) --- */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link href={`/alternatives/${tool.slug}`} key={tool.slug} className="group flex flex-col bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 transform hover:-translate-y-1">
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* 🔥 Logo Display: 如果有图显示图，没图显示首字母 */}
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {tool.logo ? (
                      <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-indigo-500">{tool.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">{tool.full_name || tool.name}</p>
                  </div>
                </div>
                <div className="flex items-center text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-md">
                  ★ {(tool.stars / 1000).toFixed(1)}k
                </div>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                {tool.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                 <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {tool.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No tools found matching "{search}"</p>
          <button onClick={() => {setSearch(''); setActiveCategory('All')}} className="mt-4 text-indigo-600 hover:underline">Clear filters</button>
        </div>
      )}
    </section>
  );
}