"use client";

import { CTABanner } from "@/components/features/home/CTABanner";
import { Hero } from "@/components/features/home/Hero";
import { IQAssistantSection } from "@/components/features/home/IQAssistantSection";
import { MethodologySection } from "@/components/features/home/MethodologySection";
import { PerformanceSection } from "@/components/features/home/PerformanceSection";
import { SecuritySection } from "@/components/features/home/SecuritySection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StatCard } from "@/components/ui/StatCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Users, Activity, Zap, Cpu, Brain, Shield, Flashlight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-0 relative selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-16 lg:space-y-24">
          <ScrollReveal direction="up">
            <Hero />
          </ScrollReveal>

          {/* Stats Section */}
          <section className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard value="10K+" label="Active Users" icon={Users} color="indigo" />
              <StatCard value="99.9%" label="Uptime" icon={Activity} color="emerald" />
              <StatCard value="50x" label="Efficiency Gain" icon={Zap} color="amber" />
              <StatCard value="24/7" label="AI Processing" icon={Cpu} color="purple" />
            </div>
          </section>

          {/* Features Section */}
          <section className="py-8">
            <div className="text-center mb-12">
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
          <footer className="mt-32 lg:mt-40 mb-12">
            <CTABanner />
          </footer>
        </div>
      </div>
    </div>
  );
}
