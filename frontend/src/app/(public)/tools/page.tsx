"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import {
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  Layout,
  Terminal,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";

interface ToolCard {
  name: string;
  icon: React.ReactNode;
  desc: string;
  color: string;
  borderColor: string;
  iconColor: string;
}

const tools: ToolCard[] = [
  {
    name: "MyNoteBook CLI",
    icon: <Terminal className="w-6 h-6" />,
    desc: "设计系统即代码，一键同步 tokens 和组件",
    color: "from-indigo-500/20 to-indigo-600/10",
    borderColor: "group-hover:border-indigo-500/40",
    iconColor: "group-hover:text-indigo-400",
  },
  {
    name: "Component Studio",
    icon: <Layers className="w-6 h-6" />,
    desc: "可视化 React 组件构建器，AI 辅助布局",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "group-hover:border-purple-500/40",
    iconColor: "group-hover:text-purple-400",
  },
  {
    name: "Visual Diff",
    icon: <Layout className="w-6 h-6" />,
    desc: "发现布局回归，自动对比差异",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "group-hover:border-blue-500/40",
    iconColor: "group-hover:text-blue-400",
  },
  {
    name: "Flow Audit",
    icon: <Activity className="w-6 h-6" />,
    desc: "映射用户旅程，优化交互流程",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "group-hover:border-emerald-500/40",
    iconColor: "group-hover:text-emerald-400",
  },
  {
    name: "Asset Baker",
    icon: <Cpu className="w-6 h-6" />,
    desc: "智能图像优化，WebP 自动转换",
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "group-hover:border-orange-500/40",
    iconColor: "group-hover:text-orange-400",
  },
  {
    name: "Type Genius",
    icon: <Wand2 className="w-6 h-6" />,
    desc: "AI 字体推荐，排版智能匹配",
    color: "from-pink-500/20 to-pink-600/10",
    borderColor: "group-hover:border-pink-500/40",
    iconColor: "group-hover:text-pink-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-24 pb-0">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Pro-Grade <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Utility Stack
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Powerful modules designed to integrate seamlessly into your design environment
          </p>
        </motion.div>

        {/* Tools Grid - 3 columns on desktop, compact cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
        >
          {tools.map((tool, index) => (
            <motion.div key={tool.name} variants={itemVariants}>
              <div
                className={`group relative backdrop-blur-md bg-gradient-to-br ${tool.color}
                  p-6 rounded-2xl border border-white/5 ${tool.borderColor}
                  transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10
                  flex items-center justify-center mb-5 ${tool.iconColor} transition-colors`}>
                  {tool.icon}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
