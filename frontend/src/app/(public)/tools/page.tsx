"use client";

import {
  Activity,
  ArrowRight,
  Cpu,
  Layers,
  Layout,
  Terminal,
  Wand2,
  Palette,
  BarChart3,
  Code,
  Image,
  Type,
  Zap,
  Settings,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { FlatCard } from "@/components/ui/FlatCard";
import { ScrollReveal, createStaggerAnimation } from "@/components/ui/ScrollReveal";
import { FooterLinks } from "@/components/ui/FooterLinks";
import { useState } from "react";

interface ToolCard {
  name: string;
  icon: React.ReactNode;
  desc: string;
  iconColor: string;
  category: "cli" | "design" | "analytics";
}

const tools: ToolCard[] = [
  {
    name: "MyNoteBook CLI",
    icon: <Terminal className="w-6 h-6" />,
    desc: "设计系统即代码，一键同步 tokens 和组件",
    iconColor: "group-hover:text-indigo-400",
    category: "cli",
  },
  {
    name: "Component Studio",
    icon: <Layers className="w-6 h-6" />,
    desc: "可视化 React 组件构建器，AI 辅助布局",
    iconColor: "group-hover:text-purple-400",
    category: "design",
  },
  {
    name: "Visual Diff",
    icon: <Layout className="w-6 h-6" />,
    desc: "发现布局回归，自动对比差异",
    iconColor: "group-hover:text-blue-400",
    category: "analytics",
  },
  {
    name: "Flow Audit",
    icon: <Activity className="w-6 h-6" />,
    desc: "映射用户旅程，优化交互流程",
    iconColor: "group-hover:text-emerald-400",
    category: "analytics",
  },
  {
    name: "Asset Baker",
    icon: <Cpu className="w-6 h-6" />,
    desc: "智能图像优化，WebP 自动转换",
    iconColor: "group-hover:text-orange-400",
    category: "design",
  },
  {
    name: "Type Genius",
    icon: <Wand2 className="w-6 h-6" />,
    desc: "AI 字体推荐，排版智能匹配",
    iconColor: "group-hover:text-pink-400",
    category: "design",
  },
];

const categories = [
  { id: "all", label: "全部", icon: Layers },
  { id: "cli", label: "CLI 工具", icon: Terminal },
  { id: "design", label: "设计工具", icon: Palette },
  { id: "analytics", label: "分析工具", icon: BarChart3 },
];

// Tool workflow steps
const workflowSteps = [
  { icon: Code, label: "代码集成", color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-400/30" },
  { icon: Settings, label: "配置参数", color: "text-purple-400", bg: "from-purple-500/20 to-pink-500/20", border: "border-purple-400/30" },
  { icon: Zap, label: "自动处理", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20", border: "border-amber-400/30" },
  { icon: CheckCircle, label: "输出结果", color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-400/30" },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");


  return (
    <div className="min-h-screen pt-24 pb-0">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Hero Section */}
        <ScrollReveal direction="up">
          <div className="text-center mb-32">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
              Pro-Grade <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Utility Stack
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Powerful modules designed to integrate seamlessly into your design environment
            </p>

            {/* Dynamic Tool Workflow Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8 backdrop-blur-xl">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease_infinite]" />
                
                {/* Workflow steps */}
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {workflowSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.label} className="flex items-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.08, 1],
                            y: [0, -8, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: index * 0.3 
                          }}
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.bg} border ${step.border} flex items-center justify-center`}
                        >
                          <Icon className={`w-9 h-9 ${step.color}`} />
                        </motion.div>
                        <span className={`absolute mt-24 text-sm font-medium ${step.color} whitespace-nowrap`}>
                          {step.label}
                        </span>
                        {index < workflowSteps.length - 1 && (
                          <motion.div
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.5 }}
                            className="w-12 h-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 mx-2"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom status indicators */}
                <div className="relative z-10 flex items-center justify-center gap-8 mt-16 pt-8 border-t border-white/5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5 text-indigo-400" />
                  </motion.div>
                  <span className="text-sm text-slate-400">实时同步</span>
                  <div className="w-1 h-1 rounded-full bg-slate-600" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 text-amber-400" />
                  </motion.div>
                  <span className="text-sm text-slate-400">自动执行</span>
                  <div className="w-1 h-1 rounded-full bg-slate-600" />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <span className="text-sm text-slate-400">质量验证</span>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Stats Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8"
            >
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black text-indigo-400">6+</div>
                  <div className="text-sm text-slate-400 mt-1">专业工具</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-400">100%</div>
                  <div className="text-sm text-slate-400 mt-1">自动化</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-pink-400">24/7</div>
                  <div className="text-sm text-slate-400 mt-1">持续运行</div>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Tools Grid by Category */}
        {activeCategory === "all" ? (

          <motion.div
            variants={createStaggerAnimation(0.1).container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
          >
            {tools.map((tool) => (
              <motion.div key={tool.name} variants={createStaggerAnimation(0.1).item}>
                <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                    flex items-center justify-center flex-shrink-0 ${tool.iconColor} transition-colors`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                      {tool.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed truncate">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                  </div>
                </FlatCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (

          <>
            {["cli", "design", "analytics"].map((categoryId) => {
              if (activeCategory !== "all" && activeCategory !== categoryId) return null;
              const categoryConfig = categories.find(c => c.id === categoryId);
              if (!categoryConfig) return null;

              const categoryTools = tools.filter(t => t.category === categoryId);
              const CategoryIcon = categoryConfig.icon;

              return (
                <section key={categoryId} className="mb-12">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <CategoryIcon className="w-6 h-6 text-indigo-400" />
                    {categoryConfig.label}
                  </h3>
                  <motion.div
                    variants={createStaggerAnimation(0.1).container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {categoryTools.map((tool) => (
                      <motion.div key={tool.name} variants={createStaggerAnimation(0.1).item}>
                        <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer">
                          <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                            flex items-center justify-center flex-shrink-0 ${tool.iconColor} transition-colors`}>
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {tool.name}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed truncate">
                              {tool.desc}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <ArrowRight className="w-5 h-5 text-indigo-400" />
                          </div>
                        </FlatCard>
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              );
            })}
          </>
        )}

        {/* Footer Links - Extended tool resources */}
        <FooterLinks
          title="Related Tools & Resources"
          links={[
            { href: "https://www.jyshare.com/", label: "JyShare", description: "在线工具集合" },
            { href: "https://tool.lu/", label: "Tool.lu", description: "在线工具大全" },
            { href: "https://123.juzi.cn/", label: "123 工具集", description: "实用工具导航" },
            { href: "https://cli.dev", label: "CLI Tools", description: "命令行工具" },
            { href: "https://figma.com", label: "Figma", description: "设计协作" },
            { href: "https://vercel.com", label: "Vercel", description: "前端部署" },
          ]}
        />
      </div>
    </div>
  );
}

// Add RefreshCw icon import
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}
