"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Define Tasks",
    description:
      "Connect your tools and define high-level objectives for your agent team.",
    icon: "🎯",
  },
  {
    number: "02",
    title: "Train Agents",
    description:
      "Assign specialized roles and fine-tune models based on your specific use cases.",
    icon: "🧠",
  },
  {
    number: "03",
    title: "Execute & Scale",
    description:
      "Launch your agents and watch them collaborate to complete tasks autonomously.",
    icon: "🚀",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-void/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            How Work-Agents Works
          </h2>
          <p className="text-text-secondary text-lg">
            A seamless three-step process to transform your manual efforts into
            autonomous agentic workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-primary/10 via-accent/20 to-primary/10 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10"
            >
              <GlassCard className="h-full group hover:border-primary/30 transition-colors">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                      Step {step.number}
                    </span>
                    <h3 className="text-2xl font-heading font-bold">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary font-body leading-relaxed">
                      {step.description}
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
