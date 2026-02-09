"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { motion } from "framer-motion";
import { Activity, Cpu, Share2, Shield, Users, Zap } from "lucide-react";

const features = [
  {
    title: "Autonomous Operation",
    description:
      "Agents make independent decisions to reach goals without constant oversight.",
    icon: Zap,
    glow: "primary" as const,
  },
  {
    title: "Multi-Agent Collaboration",
    description:
      "Different specialized agents talk to each other to solve cross-domain problems.",
    icon: Users,
    glow: "accent" as const,
  },
  {
    title: "Secure Sandbox",
    description:
      "High-level security and isolation for code execution and tool interactions.",
    icon: Shield,
    glow: "primary" as const,
  },
  {
    title: "Real-time Monitoring",
    description:
      "Watch your agents work in real-time with comprehensive status tracking.",
    icon: Activity,
    glow: "accent" as const,
  },
  {
    title: "API Integration",
    description:
      "Powerful REST and WebSocket APIs to integrate with your existing tech stack.",
    icon: Share2,
    glow: "primary" as const,
  },
  {
    title: "Customizable Models",
    description:
      "Support for leading LLMs with fine-tuned parameters for specific agent roles.",
    icon: Cpu,
    glow: "accent" as const,
  },
];

export function KeyFeatures() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Empowered by <span className="text-primary">Next-Gen</span>{" "}
              Features
            </h2>
            <p className="text-text-secondary text-lg">
              Everything you need to build, deploy, and manage production-ready
              AI agent systems at scale.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                glow={feature.glow}
                className="h-full border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="space-y-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border",
                      feature.glow === "primary"
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-accent/10 border-accent/20 text-accent",
                    )}
                  >
                    <feature.icon size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-heading font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted font-body text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inline helper for those not using the shared utils yet in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
