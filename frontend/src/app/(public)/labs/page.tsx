"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ArrowRight, BrainCircuit, FlaskConical, Radio } from "lucide-react";

const LabsFooter = () => (
  <footer className="mt-20 border-t border-white/10 py-12 px-6 backdrop-blur-md bg-white/5 rounded-t-[60px] flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-8 animate-pulse">
      <FlaskConical size={20} className="text-white/40" />
    </div>
    <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter">
      STAY CURIOUS
    </h2>
    <p className="text-slate-500 font-medium max-w-sm mb-12">
      Labs projects are experimental. Users assume all responsibility for
      implementation in production.
    </p>
    <div className="mt-12 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">
      Proprietary Research Unit
    </div>
  </footer>
);

export default function LabsPage() {
  return (
    <div className="min-h-screen pt-32 px-6 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="animate-in fade-in slide-in-from-top-8 duration-700 py-10 min-h-[60vh]">
          <SectionHeader
            centered
            tag="Experimental"
            title="The Future <br />Canvas."
            subtitle="Where we break boundaries. MyNoteBook Labs is our research wing for emerging interfaces."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Project Synapse Card */}
            <div className="relative group overflow-hidden rounded-[60px] glass p-10 md:p-16 border-white/10 hover:border-cyan-500/30 transition-all h-[500px] md:h-[600px] flex flex-col justify-end">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cyan-950/80 to-transparent z-10"></div>
              <div className="absolute top-10 right-10 flex items-center gap-4 text-cyan-400/30 group-hover:text-cyan-400 transition-colors z-20">
                <BrainCircuit size={80} strokeWidth={1} />
              </div>
              <div className="relative z-20">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/30">
                  <BrainCircuit size={28} />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Project Synapse
                </h3>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-sm">
                  Neural-interface design tool that translates thought patterns
                  directly into layout tokens.
                </p>
                <button className="flex items-center gap-4 text-cyan-400 font-bold hover:gap-6 transition-all">
                  Request Beta <ArrowRight />
                </button>
              </div>
            </div>

            {/* Project Echo Card */}
            <div className="relative group overflow-hidden rounded-[60px] glass p-10 md:p-16 border-white/10 hover:border-pink-500/30 transition-all h-[500px] md:h-[600px] flex flex-col justify-end">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-pink-950/80 to-transparent z-10"></div>
              <div className="absolute top-10 right-10 flex items-center gap-4 text-pink-400/30 group-hover:text-pink-400 transition-colors z-20">
                <Radio size={80} strokeWidth={1} />
              </div>
              <div className="relative z-20">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-8 border border-pink-500/30">
                  <Radio size={28} />
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Ambient Layouts
                </h3>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-sm">
                  Interfaces that adapt in real-time to the user's surrounding
                  environment and emotional state.
                </p>
                <button className="flex items-center gap-4 text-pink-400 font-bold hover:gap-6 transition-all">
                  Read Whitepaper <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LabsFooter />
    </div>
  );
}
