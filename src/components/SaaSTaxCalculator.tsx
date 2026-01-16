"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  ArrowRight,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { getCompetitorPrice } from "@/lib/pricing-utils";

export default function SaaSTaxCalculator({
  competitorName,
  toolUrl,
}: {
  competitorName: string;
  toolUrl: string; // 新增这个
}) {
  const initialPrice = getCompetitorPrice(competitorName);
  const [users, setUsers] = useState(10);
  const [pricePerUser, setPricePerUser] = useState(initialPrice);

  // 3. 实时计算
  const monthlyCost = users * pricePerUser;
  const yearlyCost = monthlyCost * 12;
  const fiveYearCost = yearlyCost * 5;

  // 如果父组件传进来的 competitorName 变了，重置价格 (可选)
  useEffect(() => {
    setPricePerUser(getCompetitorPrice(competitorName));
  }, [competitorName]);

  // 🔥 构造带有追踪参数的 URL
  // 逻辑：如果原 URL 已有 ? 则加 &，否则加 ?
  const trackableUrl = `${toolUrl}${toolUrl.includes("?") ? "&" : "?"
    }utm_source=saas-killer&utm_medium=directory&utm_content=calculator`;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 md:p-8 text-white shadow-2xl border border-gray-700 relative overflow-hidden mb-12 md:mb-16 isolate">
      {/* 背景光效 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none -z-10"></div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* === 左侧：控制面板 === */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
            <Settings2 size={14} /> Interactive Calculator
          </div>
          <h3 className="text-2xl md:text-3xl font-black mb-4">
            Calculate Your "SaaS Tax"
          </h3>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            SaaS pricing is designed to scale with your success.{" "}
            <br className="hidden md:block" />
            See how much wealth transfers from your bank account to{" "}
            {competitorName}'s shareholders.
          </p>

          <div className="space-y-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
            {/* 控制项 1: 团队人数 */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <Users size={16} className="text-indigo-400" /> Team Size
                </label>
                <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg text-sm font-mono font-bold">
                  {users} people
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={users}
                onChange={(e) => setUsers(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-colors"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
                <span>1</span>
                <span>50</span>
                <span>100</span>
                <span>200+</span>
              </div>
            </div>

            {/* 控制项 2: 单价 (现在可编辑了！) */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" /> Cost Per
                  User / Mo
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className="text-gray-500 text-xs cursor-pointer hover:text-white transition-colors"
                    onClick={() => setPricePerUser(initialPrice)}
                    title="Reset to default"
                  >
                    <RefreshCw size={12} />
                  </span>
                  <div className="bg-gray-700 rounded-lg flex items-center px-3 py-1 border border-gray-600 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                    <span className="text-gray-400 text-sm mr-1">$</span>
                    <input
                      type="number"
                      value={pricePerUser}
                      onChange={(e) => setPricePerUser(Number(e.target.value))}
                      className="bg-transparent text-white font-mono font-bold text-sm w-12 outline-none"
                    />
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={pricePerUser}
                onChange={(e) => setPricePerUser(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-2">
                *Estimated standard pricing for {competitorName}. Adjust if
                needed.
              </p>
            </div>
          </div>
        </div>

        {/* === 右侧：账单展示 (痛点暴击) === */}
        <div className="bg-white rounded-2xl p-6 md:p-8 text-gray-900 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden">
          {/* 票据纹理装饰 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>

          <div className="text-center mb-6">
            <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
              Estimated Annual Waste
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tighter tabular-nums">
              ${yearlyCost.toLocaleString()}
            </div>
          </div>

          <div className="space-y-4 border-t border-dashed border-gray-300 pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">
                Monthly Burn Rate
              </span>
              <span className="font-bold font-mono text-gray-800">
                ${monthlyCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">
                5-Year Projection
              </span>
              <span className="font-bold font-mono text-red-600">
                ${fiveYearCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <span className="text-indigo-700 font-medium">
                Cost with Self-Hosted
              </span>
              <span className="font-bold font-mono text-emerald-600">$0</span>
            </div>
          </div>

          <a
            href={trackableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-8 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group transform active:scale-95 cursor-pointer"
          >
            Start Saving Today
            <ArrowRight size={18} className="..." />
          </a>

          <p className="text-center text-[10px] text-gray-400 mt-4">
            Calculations based on {users} users at ${pricePerUser}/mo.
          </p>
        </div>
      </div>
    </div>
  );
}
