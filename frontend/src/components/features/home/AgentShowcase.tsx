"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { OnlinePulse } from "@/components/v-ui/OnlinePulse";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const agents = [
  {
    name: "DevOps Assistant",
    description:
      "Automates CI/CD pipelines, monitors infrastructure, and handles deployments.",
    icon: "🛠️",
    status: "online" as const,
  },
  {
    name: "Content Creator",
    description:
      "Generates high-quality blog posts, social media content, and documentation.",
    icon: "✍️",
    status: "online" as const,
  },
  {
    name: "Customer Support Bot",
    description:
      "Handles customer inquiries with empathy and technical precision 24/7.",
    icon: "💬",
    status: "online" as const,
  },
  {
    name: "Data Analyst",
    description:
      "Processes large datasets and generates actionable business insights.",
    icon: "📊",
    status: "online" as const,
  },
];

export function AgentShowcase() {
  return (
    <section className="py-24 bg-void/30 border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 px-4 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Meet the <span className="text-accent">Elite</span> Agents
            </h2>
            <p className="text-text-secondary text-lg">
              Each agent is specialized, autonomous, and ready to contribute to
              your goals.
            </p>
          </div>
          <Link href="/agents">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-primary font-bold group"
            >
              View All Agents{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.div>
          </Link>
        </div>

        <div className="flex xl:grid xl:grid-cols-4 overflow-x-auto xl:overflow-x-visible pb-12 gap-6 scrollbar-hide snap-x px-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px] sm:min-w-[350px] snap-center"
            >
              <GlassCard className="h-full flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl border border-accent/20">
                      {agent.icon}
                    </div>
                    <OnlinePulse status={agent.status} showLabel />
                  </div>
                  <div className="space-y-3 text-left">
                    <h3 className="text-2xl font-heading font-bold">
                      {agent.name}
                    </h3>
                    <p className="text-text-secondary font-body text-sm leading-relaxed">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="pt-8 flex justify-end">
                  <Link
                    href={`/agents/${agent.name.toLowerCase().replace(/ /g, "-")}`}
                  >
                    <div className="text-xs font-mono uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
                      View Profile →
                    </div>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
