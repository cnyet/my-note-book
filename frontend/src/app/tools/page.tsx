"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { GradientText } from "@/components/v-ui/GradientText";
import { NeonButton } from "@/components/v-ui/NeonButton";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Cpu, Palette, Zap } from "lucide-react";
import { useState } from "react";

const categories = [
  "All",
  "Development",
  "Automation",
  "Intelligence",
  "Creative",
];

const tools = [
  {
    id: "codeweaver",
    name: "CodeWeaver",
    description: "AI-assisted coding agent with deep context awareness.",
    category: "Development",
    color: "#00f2ff",
    icon: <Code size={24} />,
    action: "ACTIVATE",
  },
  {
    id: "autoflow",
    name: "AutoFlow",
    description: "Automate repetitive workflows across 500+ integrations.",
    category: "Automation",
    color: "#ff006e",
    icon: <Zap size={24} />,
    action: "DEPLOY",
  },
  {
    id: "neuralmind",
    name: "NeuralMind",
    description: "Cognitive data analysis and predictive modeling engine.",
    category: "Intelligence",
    color: "#3b82f6",
    icon: <Cpu size={24} />,
    action: "ENGAGE",
  },
  {
    id: "artifex",
    name: "Artifex",
    description: "Generative creative suite for high-fidelity assets.",
    category: "Creative",
    color: "#bc13fe",
    icon: <Palette size={24} />,
    action: "LAUNCH",
  },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = tools.filter(
    (t) => activeCategory === "All" || t.category === activeCategory,
  );

  return (
    <main className="min-h-screen pt-20 pb-16 bg-void relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="space-y-4">
            <GradientText as="h1" className="text-4xl md:text-5xl font-bold">
              Utility Directory
            </GradientText>
            <p className="text-text-secondary max-w-xl font-body">
              A curated collection of autonomous tools and micro-agents to power
              your productivity.
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-primary text-abyss shadow-[0_0_15px_rgba(0,242,255,0.4)]"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="group h-full flex flex-col justify-between border-white/5 hover:border-white/20 transition-all">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:shadow-[0_0_20px] shadow-current"
                        style={{
                          backgroundColor: `${tool.color}15`,
                          borderColor: `${tool.color}40`,
                          color: tool.color,
                          boxShadow: `0 0 15px ${tool.color}20`,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-muted">
                        {tool.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-bold">
                        {tool.name}
                      </h3>
                      <p className="text-text-secondary font-body leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <NeonButton
                      className="w-full"
                      style={{
                        backgroundColor: tool.color,
                        boxShadow: `0 0 20px ${tool.color}40`,
                      }}
                    >
                      {tool.action}
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
