"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { GlitchText } from "@/components/v-ui/GlitchText";
import { NeonButton } from "@/components/v-ui/NeonButton";
import { useState } from "react";

const experiments = [
  {
    id: "neural-synth",
    name: "NEURAL-SYNTH",
    version: "v0.9-alpha",
    description:
      "Real-time neural network visualization with interactive node manipulation.",
    color: "#10b981",
    status: "STABLE",
  },
  {
    id: "quantum-flow",
    name: "QUANTUM-FLOW",
    version: "v1.2-beta",
    description:
      "Probabilistic workflow optimization using quantum-inspired algorithms.",
    color: "#3b82f6",
    status: "EXPERIMENTAL",
  },
  {
    id: "synthetik-voice",
    name: "SYNTHETIK-VOICE",
    version: "v0.5",
    description:
      "Generative audio synthesis for agent communication prototypes.",
    color: "#f59e0b",
    status: "UNSTABLE",
  },
];

export default function LabsPage() {
  const [selectedProject, setSelectedProject] = useState(experiments[0]);

  return (
    <main className="min-h-screen pt-20 pb-16 bg-void relative overflow-hidden scanlines">
      {/* Background Data Flow Placeholder */}
      <div className="absolute inset-0 opacity-5 pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="container mx-auto px-4 space-y-12">
        {/* Hero Title */}
        <div className="text-center py-12">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-4 tracking-[0.2em] text-white">
            <GlitchText intensity="high">WORK-AGENTS // LABS</GlitchText>
          </h1>
          <p className="text-text-muted font-mono uppercase tracking-[0.4em] text-xs">
            Access strictly restricted to level-3 verified personnel
          </p>
        </div>

        {/* Central Project Viewer (Desktop) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 min-h-[600px]">
          {/* Project List */}
          <div className="col-span-3 space-y-4">
            <h2 className="text-xs font-mono font-bold text-primary px-2 mb-4">
              ▶ ACTIVE_EXPERIMENTS
            </h2>
            {experiments.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-300 group",
                  selectedProject.id === p.id
                    ? "bg-white/10 border-white/20 shadow-[0_0_15px] shadow-white/10"
                    : "bg-transparent border-transparent hover:bg-white/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      selectedProject.id === p.id
                        ? "bg-primary animate-pulse"
                        : "bg-white/20",
                    )}
                  />
                  <span
                    className={cn(
                      "font-heading font-bold tracking-wider transition-colors",
                      selectedProject.id === p.id
                        ? "text-white"
                        : "text-text-muted group-hover:text-text-primary",
                    )}
                  >
                    {p.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="col-span-6">
            <GlassCard className="h-full p-2 border-white/10 relative group overflow-hidden">
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <span className="px-2 py-1 rounded bg-black/60 border border-white/20 text-[10px] font-mono text-primary">
                  LIVE_FEED
                </span>
                <span className="px-2 py-1 rounded bg-black/60 border border-white/20 text-[10px] font-mono text-accent">
                  SYNC_OK
                </span>
              </div>

              <div className="w-full h-full rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-primary/20 transition-colors overflow-hidden">
                {/* This would be an iframe or dynamic preview */}
                <div className="text-center space-y-4">
                  <div className="text-6xl animate-pulse">🧪</div>
                  <div className="font-mono text-xs text-text-muted animate-glitch-slow">
                    RENDERING_PROTOTYPE_{selectedProject.id.toUpperCase()}...
                  </div>
                </div>

                {/* Visual Glitch Overlays */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity animate-glitch-1 pointer-events-none" />
              </div>
            </GlassCard>
          </div>

          {/* Project Profile */}
          <div className="col-span-3 space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl font-heading font-bold text-white tracking-tight">
                {selectedProject.name}
              </h3>
              <div className="flex gap-2">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-text-muted">
                  {selectedProject.version}
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-primary">
                  {selectedProject.status}
                </span>
              </div>
              <p className="text-text-secondary text-sm font-body leading-relaxed pt-2">
                {selectedProject.description}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <NeonButton className="w-full" variant="primary">
                ACCESS_BETA_PHASE
              </NeonButton>
              <NeonButton className="w-full" variant="outline">
                VIEW_SOURCE_CODE
              </NeonButton>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {experiments.map((p) => (
            <GlassCard key={p.id} className="space-y-4 border-white/10">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-heading font-bold text-white">
                  {p.name}
                </h3>
                <span className="text-[10px] font-mono text-primary font-bold">
                  {p.status}
                </span>
              </div>
              <p className="text-text-secondary text-sm">{p.description}</p>
              <NeonButton className="w-full" size="sm">
                RUN_TEST
              </NeonButton>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
