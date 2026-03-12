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

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = activeCategory === "all"
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-0">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Hero Section */}
        <ScrollReveal direction="up">
          <div className="text-center mb-24">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Pro-Grade <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Utility Stack
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Powerful modules designed to integrate seamlessly into your design environment
            </p>

            {/* Dynamic Stats Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
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
          /* All tools */
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
          /* Filtered tools by category */
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

        {/* Footer Links */}
        <FooterLinks
          title="Related Tools & Resources"
          links={[
            { href: "https://www.jyshare.com/", label: "JyShare", description: "在线工具集合" },
            { href: "https://n8n.io", label: "n8n", description: "工作流自动化" },
            { href: "https://zapier.com", label: "Zapier", description: "应用集成" },
            { href: "https://make.com", label: "Make", description: "可视化自动化" },
            { href: "https://figma.com", label: "Figma", description: "设计协作" },
            { href: "https://vercel.com", label: "Vercel", description: "前端部署" },
          ]}
        />
      </div>
    </div>
  );
}
