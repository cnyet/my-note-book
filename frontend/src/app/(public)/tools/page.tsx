"use client";

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
  iconColor: string;
}

const tools: ToolCard[] = [
  {
    name: "MyNoteBook CLI",
    icon: <Terminal className="w-6 h-6" />,
    desc: "设计系统即代码，一键同步 tokens 和组件",
    iconColor: "group-hover:text-indigo-400",
  },
  {
    name: "Component Studio",
    icon: <Layers className="w-6 h-6" />,
    desc: "可视化 React 组件构建器，AI 辅助布局",
    iconColor: "group-hover:text-purple-400",
  },
  {
    name: "Visual Diff",
    icon: <Layout className="w-6 h-6" />,
    desc: "发现布局回归，自动对比差异",
    iconColor: "group-hover:text-blue-400",
  },
  {
    name: "Flow Audit",
    icon: <Activity className="w-6 h-6" />,
    desc: "映射用户旅程，优化交互流程",
    iconColor: "group-hover:text-emerald-400",
  },
  {
    name: "Asset Baker",
    icon: <Cpu className="w-6 h-6" />,
    desc: "智能图像优化，WebP 自动转换",
    iconColor: "group-hover:text-orange-400",
  },
  {
    name: "Type Genius",
    icon: <Wand2 className="w-6 h-6" />,
    desc: "AI 字体推荐，排版智能匹配",
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
                className={`group relative backdrop-blur-md bg-white/5
                  p-4 rounded-xl border border-white/10
                  transition-all duration-300 hover:shadow-lg hover:border-indigo-500/40
                  overflow-hidden flex items-center gap-4 cursor-pointer`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                  flex items-center justify-center flex-shrink-0 ${tool.iconColor} transition-colors`}>
                  {tool.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {tool.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed truncate">
                    {tool.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
