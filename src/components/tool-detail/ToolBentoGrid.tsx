import { Tool } from "@/lib/db";
import { CheckCircle2, XCircle, Clock, GitFork, AlertCircle, Scale } from "lucide-react";

interface ToolBentoGridProps {
    tool: Tool;
}

export default function ToolBentoGrid({ tool }: ToolBentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 animate-slide-up-fade delay-200">

            {/* 1. Description / Summary (Large Block) */}
            <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-white dark:bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                {/* Dot Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is {tool.name}?</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {tool.rich_features?.long_summary || tool.description}
                    </p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 relative z-10">
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-mono font-bold border border-transparent hover:border-indigo-500/30 transition-colors">
                            {tool.language}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-mono font-bold border border-transparent hover:border-indigo-500/30 transition-colors">
                            {tool.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Pros Card */}
            <div className="md:col-span-1 lg:col-span-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50">
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" /> Why {tool.name}?
                </h3>
                <ul className="space-y-3">
                    {tool.rich_features?.pros?.slice(0, 3).map((p, i) => (
                        <li key={i} className="flex gap-2 text-emerald-800 dark:text-emerald-200 text-sm">
                            <span className="select-none">•</span> {p}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 3. Cons Card */}
            <div className="md:col-span-1 lg:col-span-2 bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-rose-300/50">
                <h3 className="text-lg font-bold text-rose-900 dark:text-rose-400 mb-4 flex items-center gap-2">
                    <XCircle className="text-rose-500" /> Limitations
                </h3>
                <ul className="space-y-3">
                    {tool.rich_features?.cons?.slice(0, 3).map((c, i) => (
                        <li key={i} className="flex gap-2 text-rose-800 dark:text-rose-200 text-sm">
                            <span className="select-none">•</span> {c}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 4. Stat: Last Update */}
            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-500/20 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Clock size={20} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white">
                    {new Date(tool.updated_at).toLocaleDateString()}
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">Last Update</div>
            </div>

            {/* 5. Stat: Forks */}
            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-500/20 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <GitFork size={20} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white">
                    {tool.forks?.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">Forks</div>
            </div>

            {/* 6. Stat: Issues */}
            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-500/20 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <AlertCircle size={20} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-xl font-black text-gray-900 dark:text-white">
                    {tool.issues?.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">Issues</div>
            </div>

            {/* 7. License */}
            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:border-indigo-500/20 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Scale size={20} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-lg font-black text-gray-900 dark:text-white truncate max-w-full px-2">
                    {tool.license}
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-bold mt-1 tracking-wider">License</div>
            </div>

        </div>
    );
}
