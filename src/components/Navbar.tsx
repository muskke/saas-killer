'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 transition-all duration-300">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                {/* Logo + Brand - 左上角贴边 */}
                <Link href="/" className="flex items-center gap-2 group z-50 relative">
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

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://github.com/muskke/saas-killer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Github size={18} />
                        <span className="hidden lg:inline">Star on GitHub</span>

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

                {/* Mobile Hamburger Button */}
                <button
                    className="md:hidden z-[60] p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-white dark:bg-zinc-950 z-40 flex flex-col pt-24 px-6 md:hidden animate-fade-in-down">
                        <div className="flex flex-col gap-2 text-lg font-medium">
                            <a
                                href="https://github.com/muskke/saas-killer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white active:scale-95 transition-transform"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-3">
                                    <Github size={20} />
                                    Star on GitHub
                                </span>
                                <ExternalLink size={16} className="opacity-50" />
                            </a>
                            <Link
                                href="https://github.com/muskke/saas-killer/issues/new"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white active:scale-95 transition-transform"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-3">
                                    <ExternalLink size={20} />
                                    Submit Tool
                                </span>
                            </Link>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white mt-2">
                                <span>Dark Mode</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
