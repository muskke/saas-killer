'use client';

import { Sparkles, Server, Globe, Mail, Database, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

// --- 1. CONFIGURATION (The Money Logic) ---
// 这里配置你的 Affiliate 链接和文案。
// 以后想改广告，只动这里，不用改 UI。
const AD_CONFIG: Record<string, any> = {
  // 针对建站/CMS类：推域名
  'CMS': {
    name: 'Namecheap',
    title: 'Building a site? grab a $0.99 Domain.',
    desc: 'Don’t let your open-source project sit on localhost. Get a professional .com domain now.',
    icon: Globe,
    color: 'from-orange-600 to-red-600', // 暖色调吸引冲动消费
    link: 'https://namecheap.pxf.io/c/YOUR_ID', // 👈 替换你的链接
    btnText: 'Search Domains'
  },
  'E-commerce': {
    name: 'Namecheap',
    title: 'Your store needs a trustworthy domain.',
    desc: 'Boost customer trust with a premium domain name. Starting at just $5.98/yr.',
    icon: Globe,
    color: 'from-orange-600 to-red-600',
    link: 'https://namecheap.pxf.io/c/YOUR_ID',
    btnText: 'Get Domain'
  },

  // 针对邮件/营销类：推邮件服务
  'Communication': {
    name: 'Mailgun',
    title: 'Emails going to spam? Fix it.',
    desc: 'The reliable email delivery service for developers. Send 5,000 emails for free.',
    icon: Mail,
    color: 'from-zinc-800 to-black', // 专业、冷峻
    link: 'https://mailgun.com',
    btnText: 'Start Sending'
  },

  // 针对数据库类：推云数据库
  'Database': {
    name: 'Neon',
    title: 'Serverless Postgres for your App.',
    desc: 'Stop worrying about database maintenance. Instant branching, autoscaling, bottomless storage.',
    icon: Database,
    color: 'from-green-600 to-emerald-800', // 绿色代表稳定/数据
    link: 'https://neon.tech',
    btnText: 'Create Database'
  },

  // --- FALLBACK (万能保底：VPS) ---
  'DEFAULT': {
    name: 'DigitalOcean',
    title: 'Deploy this tool with $200 Free Credit.',
    desc: 'Don’t just look at the code. Run it on a high-performance Droplet in minutes.',
    icon: Server,
    color: 'from-blue-600 to-indigo-900', // 经典的科技蓝
    link: 'https://m.do.co/c/YOUR_DO_CODE', // 👈 别忘了换这个！
    btnText: 'Claim $200 Credit'
  }
};

// --- 2. THE COMPONENT ---
export default function AdBanner({ category = 'DevTools' }: { category?: string }) {
  const [isVisible, setIsVisible] = useState(true);

  // 智能匹配逻辑：
  // 1. 尝试精确匹配 category (e.g., "CMS")
  // 2. 尝试模糊匹配 (e.g., "Headless CMS" -> "CMS")
  // 3. 都没有？用 DEFAULT
  const getAdContent = (cat: string) => {
    if (AD_CONFIG[cat]) return AD_CONFIG[cat];
    
    const keys = Object.keys(AD_CONFIG);
    const found = keys.find(k => cat.includes(k)); // 简单的模糊匹配
    return found ? AD_CONFIG[found] : AD_CONFIG['DEFAULT'];
  };

  const ad = getAdContent(category);
  const Icon = ad.icon;

  if (!isVisible) return null;

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-r ${ad.color} p-1 shadow-lg my-8 transition-all hover:shadow-xl hover:scale-[1.01]`}>
      
      {/* 内部容器：白色/深色背景 */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
        
        {/* SPONSORED 标签 */}
        <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-[10px] font-black tracking-widest px-2 py-1 rounded-br-lg z-20 uppercase">
          Sponsored
        </div>

        {/* 关闭按钮 (虽然我们希望用户点广告，但提供关闭是良好的 UX) */}
        <button 
          onClick={(e) => { e.preventDefault(); setIsVisible(false); }}
          className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* 内容区 */}
        <div className="flex items-center gap-4 z-10 w-full md:w-auto">
          <div className="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner ring-1 ring-white/30">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              {ad.name}: {ad.title}
              <Sparkles className="text-yellow-300 w-4 h-4 animate-pulse hidden md:block" />
            </h4>
            <p className="text-sm text-blue-50/90 mt-1 max-w-xl font-medium leading-relaxed">
              {ad.desc}
            </p>
          </div>
        </div>

        {/* 行动按钮 (CTA) */}
        <a 
          href={ad.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-md transition-transform hover:bg-gray-50 active:scale-95 w-full md:w-auto justify-center"
        >
          {ad.btnText}
          <ArrowRight size={16} className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
        </a>

        {/* 装饰性背景纹理 */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-black/10 blur-3xl"></div>
      </div>
    </div>
  );
}