"use client";

import { MousePointer2, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="text-center relative pt-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-10 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
        Intelligent Workflow Suite
      </div>
      <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85] text-white">
        Build Beyond <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Imagination
        </span>
      </h1>
      <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
        The ultimate notebook for the AI era. Orchestrate specialized agents and
        high-performance tools in one unified workspace.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button className="w-full sm:w-auto bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-white/5">
          Launch Notebook <Zap size={22} className="fill-current" />
        </button>
        <button className="w-full sm:w-auto backdrop-blur-md bg-white/5 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3 text-white">
          Explore Ecosystem <MousePointer2 size={22} />
        </button>
      </div>

      <div className="mt-24 relative px-4">
        <div className="max-w-6xl mx-auto backdrop-blur-md bg-white/5 rounded-[48px] p-3 border border-white/10 shadow-3xl group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 z-10 pointer-events-none"></div>
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000"
            alt="App Interface"
            className="rounded-[40px] w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-1000"
          />
        </div>
      </div>
    </section>
  );
};
