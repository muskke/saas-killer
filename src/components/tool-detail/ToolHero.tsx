import { Tool } from "@/lib/db";
import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";

interface ToolHeroProps {
    tool: Tool;
}

export default function ToolHero({ tool }: ToolHeroProps) {
    return (
        <div className="relative w-full overflow-hidden bg-black text-white rounded-3xl mb-8 isolate group animate-slide-up-fade">
            {/* --- Dynamic Background --- */}
            {/* 1. Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-zinc-900 to-black z-0"></div>

            {/* 2. Mesh Gradients / Blurs (Aurora Effect) */}
            <div className="absolute top-[-50%] right-[-10%] w-[1000px] h-[1000px] bg-gradient-to-b from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full z-0 pointer-events-none mix-blend-screen animate-aurora opacity-50"></div>
            <div className="absolute bottom-[-50%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-t from-blue-600/20 to-teal-500/20 blur-[80px] rounded-full z-0 pointer-events-none mix-blend-screen animate-aurora opacity-40" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>

            {/* 3. Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] z-0 mask-image:linear-gradient(to_bottom,black,transparent)"></div>

            {/* 4. Giant Logo Reflection (Subtle) */}
            {tool.logo && (
                <div className="absolute -right-24 top-0 opacity-[0.05] grayscale pointer-events-none select-none z-0 rotate-12 transition-transform duration-[10s] ease-in-out hover:rotate-6 hover:scale-110">
                    <img
                        src={tool.logo}
                        className="w-[600px] h-[600px] object-cover blur-sm"
                        alt=""
                    />
                </div>
            )}

            {/* --- Content --- */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-10">

                {/* Left: Identity */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">

                    {/* Logo Badge */}
                    <div className="relative group/logo">
                        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse-glow z-0"></div>
                        <div className="relative w-24 h-24 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center p-4 backdrop-blur-xl shadow-2xl z-10 transition-transform duration-500 group-hover/logo:rotate-3 group-hover/logo:scale-105">
                            {tool.logo ? (
                                <img
                                    src={tool.logo}
                                    alt={tool.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <span className="text-4xl font-black text-white">{tool.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                            {tool.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
                            The premium <span className="text-indigo-400 font-bold">Open Source</span> alternative to{" "}
                            <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-lg bg-white/10 border border-white/5 text-white font-bold mx-1 backdrop-blur-md">
                                {tool.rich_features?.competitor_name || "SaaS"}
                            </span>
                        </p>
                    </div>

                    {/* Best For Tag (Pil) */}
                    {tool.rich_features?.best_for && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
                            <span>🎯 Best for:</span>
                            <span className="text-white">{tool.rich_features.best_for}</span>
                        </div>
                    )}

                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
                    {/* Main Action */}
                    <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-gray-100 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        Visit Website
                        <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Secondary Action */}
                    {tool.rich_features?.competitor_name && (
                        <Link
                            href={`/vs/${tool.slug}`}
                            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold backdrop-blur-md transition-all"
                        >
                            Compare with {tool.rich_features.competitor_name}
                        </Link>
                    )}

                    {/* Stats Row */}
                    <div className="flex items-center justify-center gap-6 mt-2 pt-4 border-t border-white/10">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-lg">
                                <Star size={18} fill="currentColor" />
                                <span>{(tool.stars / 1000).toFixed(1)}k</span>
                            </div>
                            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Stars</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-bold text-lg">{tool.license}</span>
                            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">License</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
