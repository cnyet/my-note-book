"use client";

import { AgentGrid } from "@/components/features/agents/AgentGrid";
import { LobeChatPanel } from "@/components/features/agents/LobeChatPanel";
import { GradientText } from "@/components/v-ui/GradientText";
import { motion } from "framer-motion";

export default function AgentsPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 bg-void relative overflow-hidden">
      {/* Background Circuit Texture Placeholder */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 h-full flex flex-col space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <GradientText as="h1" className="text-4xl md:text-5xl font-bold">
              Autonomous Intelligence
            </GradientText>
            <p className="text-text-secondary font-body">
              Synchronize with your agent team and orchestrate complex tasks via
              LobeChat.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-text-secondary uppercase">
                API: Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content: Split Screen */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
          {/* Left: LobeChat */}
          <div className="h-full min-h-[500px] lg:min-h-0">
            <LobeChatPanel />
          </div>

          {/* Right: Agent Grid */}
          <div className="h-full">
            <div className="bg-void/50 border border-white/5 rounded-2xl p-6 h-full glass-effect overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold">
                  Agent Workstations
                </h2>
                <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
                  5 Specialized Co-processors
                </span>
              </div>
              <AgentGrid />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
