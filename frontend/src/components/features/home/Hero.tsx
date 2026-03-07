"use client";

import { MousePointer2, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="text-center relative pt-16 pb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] animate-pulse" />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">AI-Powered Workflow</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.85] text-white"
      >
        Build Beyond <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]">
          Imagination
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-slate-400 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
      >
        The ultimate notebook for the AI era. Orchestrate specialized agents and
        high-performance tools in one unified workspace.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Launch Notebook <Zap size={20} className="fill-current" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto backdrop-blur-md bg-white/5 px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-white/10 flex items-center justify-center gap-2 text-white hover:border-white/20"
        >
          Explore Ecosystem <MousePointer2 size={20} />
        </motion.button>
      </motion.div>

      {/* Main interface preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-16 lg:mt-24 relative px-4"
      >
        <div className="max-w-5xl mx-auto backdrop-blur-md bg-white/5 rounded-[40px] p-2 border border-white/10 shadow-2xl group relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[40px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 z-10 pointer-events-none"></div>
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000"
            alt="App Interface"
            className="rounded-[36px] w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-1000"
          />
        </div>
      </motion.div>
    </section>
  );
};
