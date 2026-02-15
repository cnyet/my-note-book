"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ChevronRight } from "lucide-react";

export const MethodologySection = () => {
  return (
    <section className="py-12">
      <SectionHeader
        centered
        tag="Methodology"
        title="Designed to <br/>Evolve."
        subtitle="A cycle of continuous improvement driven by feedback and autonomous learning."
      />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
        {[
          {
            step: "01",
            name: "Inception",
            desc: "AI scans your intent and drafts core concepts.",
          },
          {
            step: "02",
            name: "Iteration",
            desc: "Rapid prototyping across all devices instantly.",
          },
          {
            step: "03",
            name: "Validation",
            desc: "Agents perform accessibility and user audits.",
          },
          {
            step: "04",
            name: "Deployment",
            desc: "Production-ready assets synced to your git.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="relative backdrop-blur-md bg-white/5 p-10 rounded-[40px] border border-white/5 group hover:bg-indigo-600 transition-all duration-500 overflow-hidden"
          >
            <span className="text-5xl font-black text-white/5 absolute top-4 right-4 group-hover:text-white/20 transition-colors">
              {item.step}
            </span>
            <h4 className="text-2xl font-black text-white mb-4 group-hover:translate-x-2 transition-transform">
              {item.name}
            </h4>
            <p className="text-slate-500 font-medium group-hover:text-indigo-100 transition-colors leading-relaxed">
              {item.desc}
            </p>
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
              <ChevronRight className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
