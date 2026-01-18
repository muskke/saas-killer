"use client";

import { Tool } from "@/lib/db";
import { getCompetitorPrice } from "@/lib/pricing-utils";
import { ArrowRight, Sliders } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SaaSValueCalculatorProps {
    tool: Tool;
}

export default function SaaSValueCalculator({ tool }: SaaSValueCalculatorProps) {
    const competitorName = tool.rich_features?.competitor_name || "SaaS";
    const pricePerUser = getCompetitorPrice(competitorName);
    const [teamSize, setTeamSize] = useState(10);

    // Calculate annual loss (monthly price * team * 12)
    const annualLoss = pricePerUser * teamSize * 12;

    // Calculate bar width percentage (min 10%, max 90% for visual effect)
    const maxLoss = pricePerUser * 50 * 12; // Assume 50 users is max for the bar scale
    const barWidth = Math.min(Math.max((annualLoss / maxLoss) * 100, 10), 90);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl mb-8 isolate animate-slide-up-fade delay-300">
            {/* 1. Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
            <div className="absolute left-0 top-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-10"></div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1/2 h-24 bg-indigo-500/20 blur-[100px] z-0"></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">

                {/* Left: Text Content */}
                <div className="text-center md:text-left flex-1 space-y-4">

                    {/* Flashing Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Financial Leak Detected
                    </div>

                    <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                        Stop the "SaaS Tax"
                    </h3>

                    <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                        Your team could be burning cash. Switching to{" "}
                        <span className="text-indigo-400 font-bold">{tool.name}</span>{" "}
                        instantly boosts your runway.
                    </p>
                </div>

                {/* Right: The Cards/Dashboard */}
                <div className="relative w-full md:w-auto min-w-[340px]">

                    <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-indigo-500/30">

                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Competitor Cost</div>
                                <div className="text-red-400 font-mono font-bold text-2xl tracking-tight transition-all duration-300">
                                    -${annualLoss.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-600 mt-1">/ year (est. based on {competitorName})</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Self-Hosted</div>
                                <div className="text-emerald-400 font-mono font-bold text-2xl tracking-tight">$0</div>
                                <div className="text-[10px] text-gray-600 mt-1">/ year</div>
                            </div>
                        </div>

                        {/* Slider Control */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">
                                <span className="flex items-center gap-1"><Sliders size={12} /> Team Size</span>
                                <span className="text-white">{teamSize} Users</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={teamSize}
                                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                            <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                                <span>1</span>
                                <span>50+</span>
                            </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden flex mb-6 relative">
                            <div
                                className="h-full bg-red-500 relative overflow-hidden transition-all duration-500 ease-out"
                                style={{ width: `${barWidth}%` }}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[size:10px_10px] animate-[shine_1s_linear_infinite]" style={{ backgroundSize: '20px 20px' }}></div>
                            </div>
                            <div className="h-full bg-emerald-500 flex-1 transition-all duration-500"></div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <Link
                                href={`/vs/${tool.slug}`}
                                className="flex items-center justify-between w-full group/btn"
                            >
                                <span className="text-sm font-bold text-white group-hover/btn:text-indigo-300 transition-colors">
                                    Launch Detailed Calculator
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-indigo-500 group-hover/btn:scale-110 transition-all">
                                    <ArrowRight size={14} className="text-white" />
                                </div>
                            </Link>
                        </div>

                    </div>

                    {/* Sticker */}
                    <div className="absolute -right-3 -top-3 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg transform rotate-6 scale-110 border border-yellow-200 animate-pulse-slow">
                        SAVE 100%
                    </div>

                </div>

            </div>
        </div>
    );
}
