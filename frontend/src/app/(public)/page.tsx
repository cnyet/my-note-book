"use client";

import { CTABanner } from "@/components/features/home/CTABanner";
import { Hero } from "@/components/features/home/Hero";
import { IQAssistantSection } from "@/components/features/home/IQAssistantSection";
import { MethodologySection } from "@/components/features/home/MethodologySection";
import { PerformanceSection } from "@/components/features/home/PerformanceSection";
import { SecuritySection } from "@/components/features/home/SecuritySection";

export default function Home() {
  return (
    <div className="min-h-screen pt-20 px-6 pb-0 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Blobs - subtle gradient without animation to prevent flicker */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto">
        <div className="space-y-24 lg:space-y-32">
          <Hero />
          <PerformanceSection />
          <SecuritySection />
          <MethodologySection />
          <IQAssistantSection />

          <footer className="mt-16 lg:mt-24">
            <CTABanner />
          </footer>
        </div>
      </div>
    </div>
  );
}
