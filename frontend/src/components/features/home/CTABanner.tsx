"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const CTABanner = () => {
  return (
    <section className="relative overflow-hidden rounded-[48px] p-12 md:p-24 text-center group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-[gradient_4s_ease_infinite] bg-[length:200%_200%]" />
      <div className="absolute inset-0 bg-black/10" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter text-white leading-[0.9]"
        >
          Ready to <br />
          <span className="text-white/90">Transform?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium"
        >
          Join thousands of developers and designers building the future with AI-powered tools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto backdrop-blur-md bg-white/10 px-10 py-4 rounded-2xl font-bold text-lg transition-all border border-white/20 text-white hover:border-white/40"
          >
            Contact Sales
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
