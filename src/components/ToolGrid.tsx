'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, ArrowRight, Zap, Flame, Sparkles } from 'lucide-react';
import AdBanner from './AdBanner';

type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  stars: number;
  logo?: string;
  license?: string;
  subcategory?: string; // New 2-level
  parent_category?: string; // New 2-level
  rich_features?: {
    competitor_name?: string;
    best_for?: string;
  };
};

// 🏛️ Taxonomy - 从统一定义导入
import { TAXONOMY_ARRAY as TAXONOMY } from '@/lib/taxonomy';

// 🎨 Spotlight Card Component with Enhanced Visuals
const ToolCard = ({ tool, categoryColor, index }: { tool: Tool; categoryColor: string; index: number }) => {
  const divRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  // Determine competitor text
  const competitor = tool.rich_features?.competitor_name
    ? `vs ${tool.rich_features.competitor_name}`
    : tool.category === 'DevOps' ? 'vs AWS/Vercel'
      : tool.category === 'Note-taking' ? 'vs Notion'
        : tool.category === 'CRM' ? 'vs Salesforce'
          : tool.category === 'E-commerce' ? 'vs Shopify'
            : 'Open Source';

  // 🔥 Check if it's a trending project (high stars)
  const isTrending = tool.stars > 50000;
  const isPopular = tool.stars > 20000;

  return (
    <Link
      href={`/alternatives/${tool.slug}`}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOpacity(0)}
      style={{
        animationDelay: `${index * 50}ms`,
        // @ts-ignore
        '--spotlight-color': 'rgba(99, 102, 241, 0.08)', // Light mode: slightly stronger indigo
        '--spotlight-dark-color': 'rgba(129, 140, 248, 0.15)', // Dark mode
      }}
      className="group relative flex flex-col h-full bg-white hover:bg-gray-50/80 dark:bg-zinc-900/70 dark:hover:bg-zinc-900/70 rounded-3xl border border-gray-200 dark:border-white/[0.08] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04),0_20px_40px_-12px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.15)] hover:border-indigo-200/50 dark:hover:border-white/20 hover:-translate-y-2 animate-fade-in-up"
    >
      {/* 🌈 Subtle Border Glow on Hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(99, 102, 241, 0.2)', // Increased visibility for light mode
        }}
      />

      {/* 🕸️ Mesh Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" // Slightly more visible in light mode
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 🔦 Spotlight Gradient Effect (Light Mode) */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-500 z-10 opacity-0 group-hover:opacity-100 dark:hidden"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.10), transparent 40%)`
        }}
      />

      {/* 🔦 Spotlight Gradient Effect (Dark Mode) */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-500 z-10 opacity-0 group-hover:opacity-100 hidden dark:block"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(129, 140, 248, 0.15), transparent 40%)`
        }}
      />

      {/* ✨ Corner Sparkle Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative p-6 flex-grow z-20 flex flex-col">
        {/* Header: Logo & Badges */}
        <div className="flex justify-between items-start mb-5">
          {/* Logo with Glow Effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-500 overflow-hidden">
              {tool.logo ? (
                <Image src={tool.logo} alt={tool.name} width={56} height={56} className="w-full h-full object-cover" unoptimized />
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">{tool.name.charAt(0)}</span>
              )}
            </div>
          </div>

          {/* Badges Stack */}
          <div className="flex flex-col items-end gap-2">
            {/* 🔥 Trending Badge */}
            {isTrending && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 animate-pulse-slow">
                <Flame size={10} className="fill-current" />
                TRENDING
              </div>
            )}

            {/* ⚔️ VS Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all duration-300 group-hover:scale-105 ${categoryColor}`}>
              <Zap size={12} className="fill-current" />
              {competitor}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors">
            {tool.description}
          </p>
        </div>

        {/* Footer: Meta Info */}
        <div className="mt-auto pt-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {/* Star Count with Animation */}
            <div className={`flex items-center gap-1.5 font-semibold transition-all duration-300 ${isPopular
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-gray-400 dark:text-zinc-500 group-hover:text-amber-500 dark:group-hover:text-amber-400'
              }`}>
              <Star size={16} className={`transition-all duration-300 ${isPopular ? 'fill-current' : 'group-hover:fill-current'}`} />
              <span>
                {tool.stars < 1000 ? tool.stars : (tool.stars / 1000).toFixed(1) + 'k'}
              </span>
              {isPopular && <Sparkles size={12} className="text-amber-400 animate-pulse" />}
            </div>

            {/* Category */}
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500">
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600"></span>
              <span className="text-xs font-medium">{tool.category}</span>
            </div>
          </div>

          {/* Arrow Button */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-[-45deg] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line on Hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
};

// 💎 Sponsored Card
const SponsoredCard = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOpacity(0)}
      className="group relative flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.3)] animate-fade-in-up"
    >
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-float-delayed" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div
        className="pointer-events-none absolute -inset-px transition duration-500 z-10"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(129, 140, 248, 0.2), transparent 40%)`
        }}
      />

      <div className="relative z-20 p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/40 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 text-indigo-300 flex items-center justify-center text-2xl border border-indigo-500/30 backdrop-blur-sm">
              ☁️
            </div>
          </div>
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-yellow-900 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase shadow-lg">Sponsored</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">DigitalOcean</h3>
        <p className="text-sm text-indigo-200/80 mb-6 leading-relaxed">
          Ready to deploy? Get <span className="text-white font-bold">$200 in free credit</span> to host your favorite open source tools instantly.
        </p>

        <a
          href="https://m.do.co/c/YOUR_AFFILIATE_CODE"
          target="_blank"
          className="mt-auto w-full group/btn relative flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-500/25"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <span className="relative">Claim $200 Credit</span>
          <ArrowRight size={16} className="relative group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors pointer-events-none" />
    </div>
  )
}


export default function ToolGrid({ tools }: { tools: Tool[] }) {
  const [search, setSearch] = useState('');
  const [activeParent, setActiveParent] = useState('All');
  const [activeSub, setActiveSub] = useState('All');
  const [displayCount, setDisplayCount] = useState(24);

  // Reset subcategory when parent changes
  const handleParentChange = (pid: string) => {
    setActiveParent(pid);
    setActiveSub('All');
    setDisplayCount(24);
  };

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (!tool || !tool.name) return false;
      const toolName = (tool.name || '').toLowerCase();
      const toolDesc = (tool.description || '').toLowerCase();
      // Normalized search
      const searchLower = search.toLowerCase();
      const matchesSearch = toolName.includes(searchLower) || toolDesc.includes(searchLower);

      // 🔍 Category Filter Logic
      let matchesCategory = true;

      if (activeParent !== 'All') {
        // Strict mapping: Check if tool.parent_category matches
        // Fallback: If legacy data (parent_category missing), maybe try to guess? 
        // For now, we assume data is being migrated. 
        // If parent_category is empty, we exclude it from specific filters to avoid noise, or show in "All"
        if (tool.parent_category !== activeParent) {
          matchesCategory = false;
        } else {
          // If Parent matches, check Subcategory
          if (activeSub !== 'All' && tool.category !== activeSub && tool.subcategory !== activeSub) {
            matchesCategory = false;
          }
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [tools, search, activeParent, activeSub]);

  const visibleTools = filteredTools.slice(0, displayCount);

  // Get active subcategories for secondary nav
  const activePillar = TAXONOMY.find(t => t.id === activeParent);
  const visibleSubcategories = activePillar ? activePillar.subcategories : [];

  // Category Colors - More vibrant
  const getCategoryTheme = (cat: string) => {
    // Simplified theme logic or utilize TAXONOMY colors if needed
    // Keeping existing logic for now, but falling back to default
    if (['BaaS', 'DevOps', 'Security', 'Database', 'Backend & Auth'].some(c => cat.includes(c))) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30 group-hover:bg-cyan-500/20';
    if (['Design', 'Media', 'UI', 'Creative'].some(c => cat.includes(c))) return 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/30 group-hover:bg-fuchsia-500/20';
    return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30 group-hover:bg-indigo-500/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">

      {/* 🔍 Search & Filter Section */}
      <div className="mb-12 space-y-6">
        {/* Search with Animated Glow */}
        <div className="max-w-3xl mx-auto relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-75 blur-lg transition-all duration-500 animate-gradient-x"></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-xl flex items-center p-2 shadow-xl border border-gray-100 dark:border-zinc-800 group-focus-within:border-transparent transition-colors">
            <Search className="ml-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
            <input
              type="text"
              placeholder="Search for an alternative to..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-lg p-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            )}
          </div>
        </div>

        {/* 🏆 Primary Navigation (Pillars) - Scrollable on Mobile */}
        <div className="flex overflow-x-auto gap-2 md:gap-3 md:justify-center -mx-4 px-4 md:mx-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => handleParentChange('All')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeParent === 'All'
              ? 'bg-gradient-to-r from-slate-800 to-black dark:from-white dark:to-gray-200 text-white dark:text-black shadow-lg scale-105'
              : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
          >
            ✨ All Tools
          </button>

          {TAXONOMY.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => handleParentChange(pillar.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeParent === pillar.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border-transparent'
                : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
            >
              <span>{pillar.icon}</span>
              <span>{pillar.label}</span>
            </button>
          ))}
        </div>

        {/* 🔖 Secondary Navigation (Subcategories) - Only show if Parent selected */}
        {activeParent !== 'All' && visibleSubcategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in-down">
            <button
              onClick={() => setActiveSub('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeSub === 'All'
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
            >
              All {TAXONOMY.find(t => t.id === activeParent)?.label}
            </button>
            {visibleSubcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeSub === sub
                  ? 'bg-white dark:bg-zinc-800 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'bg-transparent border-transparent text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      <AdBanner category={activeParent} />

      {/* 📦 Tool Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SponsoredCard />
          {visibleTools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} categoryColor={getCategoryTheme(tool.category)} index={index} />
          ))}

          {visibleTools.length < filteredTools.length && (
            <div className="col-span-full pt-12 flex justify-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 24)}
                className="group relative px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full font-bold text-gray-600 dark:text-gray-300 hover:text-white transition-all active:scale-95 overflow-hidden"
              >
                {/* Button Hover Fill */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Load More Alternatives <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
            🔍
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tools found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            We couldn't find any tools matching "{search}". Try a different search term.
          </p>
          <button
            onClick={() => { setSearch(''); setActiveParent('All'); setActiveSub('All'); }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}