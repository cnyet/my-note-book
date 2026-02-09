"use client";

import { GradientText } from "@/components/v-ui/GradientText";
import { NeonButton } from "@/components/v-ui/NeonButton";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GradientText className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                Orchestrate Your Workflow. <br className="hidden md:block" />
                Empower Your Agents.
              </GradientText>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-text-secondary max-w-2xl lg:mx-0 mx-auto font-body"
            >
              The most advanced AI multi-agent orchestration platform for the
              modern developer. Automate complex tasks with precision and style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4"
            >
              <NeonButton size="lg" variant="primary">
                Deploy Your First Agent
              </NeonButton>
              <NeonButton size="lg" variant="outline">
                Explore the Platform
              </NeonButton>
            </motion.div>
          </div>

          {/* Right Illustration Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 relative w-full max-w-[600px] aspect-square"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="relative z-10 w-full h-full glass-effect rounded-3xl p-8 flex items-center justify-center border-primary/20">
              {/* CSS-based 3D illustration placeholder */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                <div className="absolute inset-0 bg-gradient-neon opacity-20 blur-2xl animate-spin-slow" />
                <div className="absolute inset-4 border-2 border-primary/40 rounded-xl rotate-45 animate-pulse" />
                <div className="absolute inset-12 border-2 border-accent/40 rounded-xl -rotate-12" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-4xl neon-glow-primary">
                    🤖
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges placeholder */}
            <div className="absolute top-10 right-10 glass-effect p-3 rounded-xl border-accent/30 animate-bounce-slow">
              <span className="text-accent text-sm font-bold">
                Autopilot v2.0
              </span>
            </div>
            <div className="absolute bottom-20 left-4 glass-effect p-3 rounded-xl border-primary/30 animate-pulse">
              <span className="text-primary text-sm font-bold">
                5 Agents Online
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
