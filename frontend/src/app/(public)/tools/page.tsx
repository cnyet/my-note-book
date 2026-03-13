"use client";

import {
  Activity,
  Cpu,
  Layers,
  Layout,
  Terminal,
  Wand2,
  Palette,
  BarChart3,
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
    iconColor: "text-indigo-400",
    category: "cli",
  },
  {
    name: "Component Studio",
    icon: <Layers className="w-6 h-6" />,
    desc: "可视化 React 组件构建器，AI 辅助布局",
    iconColor: "text-purple-400",
    category: "design",
  },
  {
    name: "Visual Diff",
    icon: <Layout className="w-6 h-6" />,
    desc: "发现布局回归，自动对比差异",
    iconColor: "text-blue-400",
    category: "analytics",
  },
  {
    name: "Flow Audit",
    icon: <Activity className="w-6 h-6" />,
    desc: "映射用户旅程，优化交互流程",
    iconColor: "text-emerald-400",
    category: "analytics",
  },
  {
    name: "Asset Baker",
    icon: <Cpu className="w-6 h-6" />,
    desc: "智能图像优化，WebP 自动转换",
    iconColor: "text-orange-400",
    category: "design",
  },
  {
    name: "Type Genius",
    icon: <Wand2 className="w-6 h-6" />,
    desc: "AI 字体推荐，排版智能匹配",
    iconColor: "text-pink-400",
    category: "design",
  },
];

const categories = [
  { id: "all", label: "全部", icon: Layers },
  { id: "cli", label: "CLI 工具", icon: Terminal },
  { id: "design", label: "设计工具", icon: Palette },
  { id: "analytics", label: "分析工具", icon: BarChart3 },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-0 flex flex-col">
      <div className="max-w-[1400px] mx-auto px-6 flex-1">
        {/* Hero Section */}
        <ScrollReveal direction="up">
          <div className="text-center mb-32">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight whitespace-nowrap mb-10">
              Pro-Grade <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Utility Stack
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Powerful modules designed to integrate seamlessly into your design environment
            </p>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`group px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                        : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                    {category.label}
                  </button>
                );
              })}
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Tools Grid by Category */}
        {activeCategory === "all" ? (
          <motion.div
            variants={createStaggerAnimation(0.1).container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-20 min-h-[600px]"
          >
            {tools.map((tool) => (
              <motion.div key={tool.name} variants={createStaggerAnimation(0.1).item}>
                <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer ">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                    flex items-center justify-center flex-shrink-0 ${tool.iconColor}`}>
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
                    <CategoryIcon className="w-5 h-5 text-indigo-400" />
                    {categoryConfig.label}
                  </h3>
                  <motion.div
                    variants={createStaggerAnimation(0.1).container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
                  >
                    {categoryTools.map((tool) => (
                      <motion.div key={tool.name} variants={createStaggerAnimation(0.1).item}>
                        <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer ">
                          <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                            flex items-center justify-center flex-shrink-0 ${tool.iconColor}`}>
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
          links={[
            { href: "https://www.jyshare.com/", label: "JyShare" },
            { href: "https://tool.lu/", label: "Tool.lu" },
            { href: "https://123.juzi.cn/", label: "123 工具集" },
            { href: "https://cli.dev", label: "CLI Tools" },
            { href: "https://figma.com", label: "Figma" },
            { href: "https://vercel.com", label: "Vercel" },
          ]}
        />
      </div>
    </div>
  );
}
