"use client";

import { ArrowRight, BrainCircuit, Radio, FlaskConical, Telescope, Sparkles, Atom } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, createStaggerAnimation } from "@/components/ui/ScrollReveal";
import { FooterLinks } from "@/components/ui/FooterLinks";

interface LabProject {
  name: string;
  icon: React.ReactNode;
  desc: string;
  status: string;
  color: string;
  borderColor: string;
  iconColor: string;
  bgColor: string;
}

const projects: LabProject[] = [
  {
    name: "Project Synapse",
    icon: <BrainCircuit className="w-8 h-8" />,
    desc: "脑机接口设计工具，将思维模式直接转换为布局 tokens",
    status: "Alpha",
    color: "from-cyan-500/20 to-cyan-600/10",
    borderColor: "group-hover:border-cyan-500/40",
    iconColor: "group-hover:text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    name: "Ambient Layouts",
    icon: <Radio className="w-8 h-8" />,
    desc: "界面自适应用户周围环境和情绪状态的实时响应系统",
    status: "Beta",
    color: "from-pink-500/20 to-pink-600/10",
    borderColor: "group-hover:border-pink-500/40",
    iconColor: "group-hover:text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    name: "Neural Interfaces",
    icon: <FlaskConical className="w-8 h-8" />,
    desc: "探索下一代人机交互范式的神经接口技术",
    status: "Research",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "group-hover:border-purple-500/40",
    iconColor: "group-hover:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Quantum UI",
    icon: <Atom className="w-8 h-8" />,
    desc: "基于量子计算概念的并行状态界面设计",
    status: "Concept",
    color: "from-indigo-500/20 to-indigo-600/10",
    borderColor: "group-hover:border-indigo-500/40",
    iconColor: "group-hover:text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    name: "Holo Display",
    icon: <Telescope className="w-8 h-8" />,
    desc: "全息显示技术的 Web 界面适配方案",
    status: "Research",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "group-hover:border-emerald-500/40",
    iconColor: "group-hover:text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    name: "AI Co-Pilot",
    icon: <Sparkles className="w-8 h-8" />,
    desc: "AI 辅助设计决策的智能推荐引擎",
    status: "Beta",
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "group-hover:border-orange-500/40",
    iconColor: "group-hover:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
];

const statusColorMap: Record<string, string> = {
  Alpha: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Beta: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Research: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Concept: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function LabsPage() {
  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-0">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Hero Section */}
        <ScrollReveal direction="up">
          <div className="text-center mb-32">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight whitespace-nowrap mb-10">
              The Future <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Canvas
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Where we break boundaries. MyNoteBook Labs is our research wing for emerging interfaces.
            </p>

            {/* Dynamic Stats Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-16 relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8"
            >
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black text-cyan-400">6+</div>
                  <div className="text-sm text-slate-400 mt-1">实验项目</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-400">4</div>
                  <div className="text-sm text-slate-400 mt-1">研究领域</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-pink-400">24/7</div>
                  <div className="text-sm text-slate-400 mt-1">持续探索</div>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Projects Grid - 3 columns on desktop, square cards */}
        <motion.div
          variants={createStaggerAnimation(0.08).container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={createStaggerAnimation(0.08).item}>
              <div
                className={`group relative backdrop-blur-md bg-gradient-to-br ${project.color}
                  p-6 rounded-3xl border border-white/5 ${project.borderColor}
                  transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer
                  aspect-square flex flex-col`}
              >
                {/* Background Icon */}
                <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="w-40 h-40">
                    {project.icon}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    statusColorMap[project.status] || ""
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl ${project.bgColor} border border-white/10
                  flex items-center justify-center mb-5 ${project.iconColor} transition-colors`}>
                  {project.icon}
                </div>

                {/* Content */}
                <div className="mt-auto space-y-3">
                  <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  <ArrowRight className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Links */}
        <FooterLinks
          title="Related Research & Resources"
          links={[
            { href: "https://openai.com/research", label: "OpenAI Research", description: "AI 研究" },
            { href: "https://deepmind.google/", label: "DeepMind", description: "AI 研究实验室" },
            { href: "https://www.microsoft.com/en-us/research/", label: "Microsoft Research", description: "微软研究院" },
            { href: "https://research.google/", label: "Google Research", description: "谷歌研究" },
            { href: "https://www.nature.com/", label: "Nature", description: "科学期刊" },
            { href: "https://arxiv.org/", label: "arXiv", description: "论文预印本" },
          ]}
        />
      </div>
    </div>
  );
}
