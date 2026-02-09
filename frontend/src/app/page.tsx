"use client";

import { AgentShowcase } from "@/components/features/home/AgentShowcase";
import { HeroSection } from "@/components/features/home/HeroSection";
import { HowItWorks } from "@/components/features/home/HowItWorks";
import { KeyFeatures } from "@/components/features/home/KeyFeatures";
import { GradientText } from "@/components/v-ui/GradientText";
import { NeonButton } from "@/components/v-ui/NeonButton";
import { ParticleBg } from "@/components/v-ui/ParticleBg";

export default function Home() {
  return (
    <main className="flex flex-col relative">
      {/* Background Particle Engine (Global for Home) */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleBg />
      </div>

      <HeroSection />

      <HowItWorks />

      <KeyFeatures />

      <AgentShowcase />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-b from-void/50 to-abyss relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <GradientText as="h2" className="text-4xl md:text-6xl font-bold">
              Ready to automate your future?
            </GradientText>
            <p className="text-text-secondary text-xl">
              Join thousands of developers building the next generation of
              autonomous systems.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <NeonButton size="lg" variant="primary">
                Get Started for Free
              </NeonButton>
              <NeonButton size="lg" variant="outline">
                Join Discord
              </NeonButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
