"use client";

import { Activity, MousePointer2, Zap } from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="text-center relative pt-32 pb-16 lg:pt-40 lg:pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden">

      {/* Animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] animate-pulse" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-pulse delay-300" />
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
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight text-white whitespace-nowrap"
      >
        Build Beyond{" "}
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
          Launch Notebook <Zap size={20} className="fill-current" aria-hidden="true" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto backdrop-blur-md bg-white/5 px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-white/10 flex items-center justify-center gap-2 text-white hover:border-white/20"
        >
          Explore Ecosystem <MousePointer2 size={20} aria-hidden="true" />
        </motion.button>
      </motion.div>

      {/* Main interface preview - dynamic 3D card with mouse parallax */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-16 lg:mt-24 relative px-4 perspective-1000"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="max-w-5xl mx-auto backdrop-blur-md bg-slate-900/80 rounded-[40px] p-2 border border-white/10 shadow-2xl group relative overflow-hidden hover:border-indigo-500/30 transition-colors duration-500"
        >
          {/* 动态内容区域 */}
          <div className="relative w-full aspect-video rounded-[36px] overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            {/* 背景网格动画 */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-[pulse_4s_ease-in-out_infinite]" />
            </div>

            {/* 浮动粒子 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-indigo-400/50 rounded-full"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * -100 - 50],
                    opacity: [0, 1, 0.8, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* 中心 UI 卡片轮播 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, y: -20, rotateY: 10 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center p-8"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="w-full h-full backdrop-blur-md bg-slate-950/90 rounded-[24px] border border-white/10 shadow-2xl p-6 overflow-hidden">
                  {/* 窗口控制栏 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>

                  {/* 场景内容 */}
                  {currentIndex === 0 && (
                    <div className="space-y-4">
                      <div className="h-12 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl animate-pulse" />
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors" />
                        ))}
                      </div>
                      <div className="h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-xl" />
                    </div>
                  )}

                  {currentIndex === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-8 w-32 bg-indigo-500/30 rounded-lg" />
                        <div className="h-8 w-24 bg-purple-500/30 rounded-lg" />
                      </div>
                      <div className="h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
                        <Activity className="w-16 h-16 text-emerald-400/50" />
                      </div>
                    </div>
                  )}

                  {currentIndex === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/5 p-4">
                            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 mb-2" />
                            <div className="h-3 w-20 bg-white/10 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 轮播指示器 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === currentIndex ? 'true' : 'false'}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'w-8 bg-indigo-500' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          {/* Border glow on hover */}
          <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 rounded-[40px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>
        
      </motion.div>
    </section>
  );
};
