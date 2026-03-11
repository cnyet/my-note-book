"use client";

import { CTABanner } from "@/components/features/home/CTABanner";
import { Hero } from "@/components/features/home/Hero";
import { IQAssistantSection } from "@/components/features/home/IQAssistantSection";
import { MethodologySection } from "@/components/features/home/MethodologySection";
import { PerformanceSection } from "@/components/features/home/PerformanceSection";
import { SecuritySection } from "@/components/features/home/SecuritySection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-0 relative selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-16 lg:space-y-24">
          <ScrollReveal direction="up">
            <Hero />
          </ScrollReveal>

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

          <ScrollReveal direction="up" delay={0.5}>
            <footer className="mt-16 lg:mt-24">
              <CTABanner />
            </footer>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
