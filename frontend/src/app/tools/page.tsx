"use client";

import { StandardFooter } from "@/components/common/StandardFooter";
import {
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  Layout,
  Terminal,
  Wand2,
} from "lucide-react";

const SectionHeader = ({
  title,
  subtitle,
  tag,
  centered = false,
}: {
  title: string;
  subtitle: string;
  tag?: string;
  centered?: boolean;
}) => (
  <div
    className={`max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ${centered ? "mx-auto text-center" : ""}`}
  >
    {tag && (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6`}
      >
        {tag}
      </div>
    )}
    <h2
      className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white"
      dangerouslySetInnerHTML={{ __html: title }}
    ></h2>
    <p
      className={`text-slate-400 text-xl md:text-2xl font-medium leading-relaxed ${centered ? "mx-auto" : ""} max-w-2xl`}
    >
      {subtitle}
    </p>
  </div>
);

const ToolsFooter = () => (
  <footer className="mt-20 py-12 bg-slate-900/50 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
      <div className="space-y-4">
        <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">
          Development
        </h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            CLI Documentation
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            SDK Reference
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            GitHub Repository
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <h4 className="font-bold text-purple-400 uppercase tracking-widest text-[10px]">
          Tokens
        </h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Tailwind Config
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Figma Plugin
          </li>
          <li className="hover:text-white cursor-pointer transition-colors text-white/60">
            Asset Manager
          </li>
        </ul>
      </div>
      <div className="col-span-2 flex justify-end items-center gap-4">
        <span className="text-slate-500 font-bold">Latest v2.4.12:</span>
        <code className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs border border-emerald-500/20">
          Stable Build
        </code>
      </div>
    </div>
  </footer>
);

export default function ToolsPage() {
  const secondaryTools = [
    { name: "Visual Diff", icon: <Layout />, desc: "Find layout regressions" },
    { name: "Flow Audit", icon: <Activity />, desc: "Map user journeys" },
    { name: "Asset Baker", icon: <Cpu />, desc: "Optimize images" },
    { name: "Type Genius", icon: <Wand2 />, desc: "AI typography" },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 pb-0">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto">
        <SectionHeader
          centered
          tag="Toolkit"
          title="The Pro-Grade <br/>Utility Stack."
          subtitle="Powerful modules designed to integrate seamlessly into your design environment."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="backdrop-blur-md bg-white/5 p-12 rounded-[50px] border border-white/5 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/30">
              <Terminal size={32} />
            </div>
            <h3 className="text-4xl font-black text-white mb-6">
              MyNoteBook CLI
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The industry&apos;s first design-system-as-code CLI. Sync tokens,
              components, and assets across your entire repo with a single
              command.
            </p>
            <div className="bg-black/50 p-6 rounded-2xl font-mono text-sm text-indigo-300 border border-white/5 mb-8">
              <span className="text-slate-500">$</span> mynotebook sync --all
              --force
            </div>
            <button className="flex items-center gap-3 text-indigo-400 font-bold hover:text-white transition-colors">
              View Documentation <ArrowRight size={18} />
            </button>
          </div>

          <div className="backdrop-blur-md bg-white/5 p-12 rounded-[50px] border border-white/5 group hover:border-purple-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/30">
              <Layers size={32} />
            </div>
            <h3 className="text-4xl font-black text-white mb-6">
              Component Studio
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              A visual playground to build high-fidelity React components using
              AI-assisted layout and styling. Real-time code output.
            </p>
            <button className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all">
              Open Studio
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {secondaryTools.map((tool, i) => (
            <div
              key={i}
              className="backdrop-blur-md bg-white/5 p-8 rounded-[32px] border border-white/5 hover:bg-white/5 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 mb-6 group-hover:text-white transition-colors">
                {tool.icon}
              </div>
              <h4 className="font-bold text-white mb-2">{tool.name}</h4>
              <p className="text-slate-500 text-xs">{tool.desc}</p>
            </div>
          ))}
        </div>
        <ToolsFooter />
      </div>
      <StandardFooter />
    </div>
  );
}
