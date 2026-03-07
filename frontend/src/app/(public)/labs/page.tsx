"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ArrowRight, BrainCircuit, Radio } from "lucide-react";

const LabsFooter = () => (
  <footer className="mt-20 border-t border-white/10 py-12 backdrop-blur-md bg-white/5 rounded-t-[60px]">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
      <div className="space-y-4">
        <h4 className="font-bold text-cyan-400 uppercase tracking-widest text-[10px]">
          Research
        </h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Project Synapse
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Ambient Layouts
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Neural Interfaces
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <h4 className="font-bold text-pink-400 uppercase tracking-widest text-[10px]">
          Publications
        </h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Whitepapers
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Case Studies
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Technical Docs
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <h4 className="font-bold text-purple-400 uppercase tracking-widest text-[10px]">
          Resources
        </h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            API Reference
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            SDK Downloads
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Community
          </li>
        </ul>
      </div>
      <div className="col-span-2 md:col-span-1 flex justify-end items-center gap-4">
        <span className="text-slate-500 font-bold text-xs">Status:</span>
        <code className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg text-xs border border-cyan-500/20">
          Experimental
        </code>
      </div>
    </div>
  </footer>
);

export default function LabsPage() {
  return (
    <div className="min-h-screen pt-32 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="animate-in fade-in slide-in-from-top-8 duration-700 py-10 min-h-[60vh]">
          <SectionHeader
            centered
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
                  Interfaces that adapt in real-time to the user&apos;s
                  surrounding environment and emotional state.
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
