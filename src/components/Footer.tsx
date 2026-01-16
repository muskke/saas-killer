'use client';

import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200/50 dark:border-white/5 bg-gray-50 dark:bg-zinc-950 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                {/* Left: Brand & Slogan */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                    <span className="font-bold text-gray-900 dark:text-white tracking-tight">SaaS Killer</span>
                    <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
                    <span className="text-sm text-gray-500 dark:text-zinc-500 font-medium max-w-[200px] md:max-w-none mx-auto md:mx-0">Stop paying monthly rent for software you can own.</span>
                    <span className="hidden md:inline-block w-px h-3 bg-gray-200 dark:bg-zinc-800 mx-2" />
                    <span className="text-xs text-gray-400 dark:text-zinc-600 mt-2 md:mt-0">&copy; {new Date().getFullYear()}</span>
                </div>

                {/* Right: Chaos Meme Intelligence Link - 极简文字风格 */}
                <a
                    href="https://chaos-meme.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 transition-all duration-300 opacity-60 hover:opacity-100"
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 group-hover:text-indigo-500 transition-colors">Powered by</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Chaos Meme Intelligence
                        </span>
                        <svg
                            className="w-3 h-3 text-gray-400 dark:text-zinc-500 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
