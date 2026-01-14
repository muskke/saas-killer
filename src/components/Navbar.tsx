'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 transition-all duration-300">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                {/* Logo + Brand - 左上角贴边 */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/logo.svg"
                        alt="SaaS Killer Logo"
                        width={36}
                        height={36}
                        className="w-9 h-9 object-contain"
                    />
                    <span className="text-gray-900 dark:text-white font-black text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        SaaS<span className="text-orange-500 dark:text-yellow-400">Killer</span>
                    </span>
                </Link>

                {/* 右上角导航 - 贴边 */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/muskke/saas-killer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Github size={18} />
                        <span className="hidden md:inline">Star on GitHub</span>
                    </a>
                    <Link
                        href="https://github.com/muskke/saas-killer/issues/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-1.5"
                    >
                        Submit Tool
                        <ExternalLink size={14} />
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
