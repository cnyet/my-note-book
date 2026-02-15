"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { Activity, Box, Code2, Globe, Palette, Search } from "lucide-react";

const AgentsFooter = () => (
  <footer className="mt-20 border-t border-white/10 py-12 px-6 backdrop-blur-md bg-white/5 rounded-t-[60px]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="text-left">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
          Expand Your Workforce
        </h3>
        <p className="text-slate-500 font-medium">
          MyNoteBook Agents are updated weekly with new capabilities.
        </p>
      </div>
      <div className="flex gap-4">
        <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">
          Join as Agent
        </button>
        <button className="px-8 py-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
          Marketplace API
        </button>
      </div>
    </div>
  </footer>
);

export default function AgentsPage() {
  const agents = [
    {
      name: "Archon",
      role: "System Architect",
      icon: <Box className="text-indigo-400" />,
      status: "Available",
      capabilities: ["Component Logic", "Documentation", "Token Strategy"],
    },
    {
      name: "Lexa",
      role: "UX Researcher",
      icon: <Search className="text-purple-400" />,
      status: "Online",
      capabilities: ["User Journeys", "Competitor Analysis", "Accessibility"],
    },
    {
      name: "Koda",
      role: "Motion Engineer",
      icon: <Activity className="text-pink-400" />,
      status: "Occupied",
      capabilities: ["Framing", "Easing Optimization", "Lottie Export"],
    },
    {
      name: "Vira",
      role: "Brand Alchemist",
      icon: <Palette className="text-orange-400" />,
      status: "Online",
      capabilities: ["Moodboards", "Color Science", "Logo Evolution"],
    },
    {
      name: "Nova",
      role: "Data Visualization",
      icon: <Globe className="text-cyan-400" />,
      status: "Ready",
      capabilities: [
        "Interactive Charts",
        "Complex Datasets",
        "SVG Generation",
      ],
    },
    {
      name: "Sudo",
      role: "Design Engineer",
      icon: <Code2 className="text-emerald-400" />,
      status: "Idle",
      capabilities: ["React Prototype", "Storybook Sync", "CSS-in-JS"],
    },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 pb-0">
      <div className="animate-in fade-in slide-in-from-right-8 duration-700 max-w-7xl mx-auto">
        <SectionHeader
          centered
          tag="Personnel"
          title="Autonomous <br/>Design Agents."
          subtitle="The world's most capable design workforce. Hire AI specialists for every part of your creative stack."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="backdrop-blur-md bg-white/5 p-8 rounded-[40px] border border-white/5 group hover:border-indigo-500/40 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-all">
                  {agent.icon}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    agent.status === "Online" ||
                    agent.status === "Available" ||
                    agent.status === "Ready"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  }`}
                >
                  {agent.status}
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">
                {agent.name}
              </h3>
              <p className="text-indigo-400 font-bold text-sm mb-6 uppercase tracking-wider">
                {agent.role}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-[10px] font-bold text-slate-500 border border-white/10 px-2 py-1 rounded-lg"
                  >
                    {cap}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white hover:text-slate-950 transition-all">
                  Consult Agent
                </button>
              </div>
            </div>
          ))}
        </div>
        <AgentsFooter />
      </div>
    </div>
  );
}
