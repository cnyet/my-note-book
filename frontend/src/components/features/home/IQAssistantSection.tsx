"use client";

import { Box, Zap } from "lucide-react";

export const IQAssistantSection = () => {
  return (
    <section className="mt-16 backdrop-blur-md bg-white/5 rounded-[60px] p-8 md:p-20 border border-white/10 overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="text-left">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-10 text-indigo-400 border border-indigo-500/20">
            <Zap size={32} />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-white">
            Ask IQ Assistant.
          </h2>
          <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
            Our Gemini-powered assistant is available across the platform to
            help you build faster and smarter.
          </p>
        </div>

        <div className="bg-slate-950/80 rounded-[40px] border border-white/10 h-[450px] flex flex-col shadow-2xl relative">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <p className="text-lg font-bold text-slate-400 italic">
                "How can I improve my typography hierarchy?"
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter design prompt..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <button className="absolute right-3 p-3 bg-indigo-500 text-white rounded-xl">
                <Box size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
