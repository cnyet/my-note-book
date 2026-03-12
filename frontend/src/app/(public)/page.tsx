"use client";

import { motion } from "framer-motion";
import { CTABanner } from "@/components/features/home/CTABanner";
import { Hero } from "@/components/features/home/Hero";
import { IQAssistantSection } from "@/components/features/home/IQAssistantSection";
import { MethodologySection } from "@/components/features/home/MethodologySection";
import { PerformanceSection } from "@/components/features/home/PerformanceSection";
import { SecuritySection } from "@/components/features/home/SecuritySection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StatCard } from "@/components/ui/StatCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Users, Activity, Zap, Cpu, Brain, Shield, Flashlight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-0 relative selection:bg-indigo-500 selection:text-white">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-[90px]" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-16 lg:space-y-24">
          <ScrollReveal direction="up">
            <Hero />
          </ScrollReveal>

          {/* Stats Section with enhanced visual */}
          <section className="py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8 backdrop-blur-xl mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease_infinite]" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                <StatCard value="10K+" label="Active Users" icon={Users} color="indigo" />
                <StatCard value="99.9%" label="Uptime" icon={Activity} color="emerald" />
                <StatCard value="50x" label="Efficiency Gain" icon={Zap} color="amber" />
                <StatCard value="24/7" label="AI Processing" icon={Cpu} color="purple" />
              </div>
            </motion.div>
          </section>

          {/* Features Section with enhanced header */}
          <section className="py-8">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Feature Highlights</span>
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-4">Powerful Features</h2>
              <p className="text-slate-400">Everything you need to automate your workflow</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon={Brain} title="AI-Powered" description="Intelligent automation powered by advanced AI models" />
              <FeatureCard icon={Shield} title="Secure" description="Enterprise-grade security with end-to-end encryption" />
              <FeatureCard icon={Flashlight} title="Fast" description="Lightning-fast processing with optimized infrastructure" />
            </div>
          </section>

          <ScrollReveal direction="up" delay={0.1}>
            <PerformanceSection />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <SecuritySection />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <MethodologySection />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <IQAssistantSection />
          </ScrollReveal>

          {/* Footer - Independent Section */}
          <footer className="mt-32 lg:mt-40 mb-12 pb-8">
            <CTABanner />
          </footer>
        </div>
      </div>
    </div>
  );
}
