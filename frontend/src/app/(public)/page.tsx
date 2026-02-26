"use client";

import { CTABanner } from "@/components/features/home/CTABanner";
import { Hero } from "@/components/features/home/Hero";
import { IQAssistantSection } from "@/components/features/home/IQAssistantSection";
import { MethodologySection } from "@/components/features/home/MethodologySection";
import { PerformanceSection } from "@/components/features/home/PerformanceSection";
import { SecuritySection } from "@/components/features/home/SecuritySection";

export default function Home() {
  return (
    <div className="min-h-screen pt-32 px-6 pb-0 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="animate-in fade-in duration-1000 space-y-40">
          <Hero />
          <PerformanceSection />
          <SecuritySection />
          <MethodologySection />
          <IQAssistantSection />

          <footer className="mt-20">
            <CTABanner />
          </footer>
        </div>
      </div>
    </div>
  );
}
