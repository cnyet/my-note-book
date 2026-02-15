"use client";

import { CpuIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const PerformanceSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            Engineered for Speed
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Zero Lag. <br />
            Infinite Flow.
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-lg">
            Our proprietary rendering engine processes billions of design tokens
            per second. Experience a fluid workspace that responds as fast as
            you think.
          </p>
          <div className="flex flex-wrap gap-10 pt-4">
            <div className="flex flex-col">
              <span className="text-5xl font-black text-white">0.02ms</span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                Input Latency
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-white">120Hz</span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                Native Refresh
              </span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          <div className="relative backdrop-blur-md bg-white/5 aspect-square rounded-[80px] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
            <div className="w-full h-full relative flex items-center justify-center">
              <div className="absolute w-64 h-64 border-[1px] border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute w-80 h-80 border-[1px] border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute w-96 h-96 border-[1px] border-pink-500/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="relative bg-slate-900 w-32 h-32 rounded-[40px] flex items-center justify-center border border-white/20 shadow-2xl z-20 group-hover:scale-110 transition-transform">
                <CpuIcon size={48} className="text-indigo-400" />
              </div>
              {mounted &&
                [...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-pulse blur-[1px]"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
