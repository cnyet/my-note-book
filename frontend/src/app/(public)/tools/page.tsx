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
  ArrowRightLeft,
  FileText,
  Image as ImageIcon,
  Code,
  Globe,
  Type,
  Scan,
  Keyboard,
  Crop,
  Video,
  AudioWaveform,
  File,
  Lock,
  Mail,
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
  { id: "all", label: "All", icon: Layers },
  { id: "cli", label: "CLI Tools", icon: Terminal },
  { id: "design", label: "Design Tools", icon: Palette },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-0 flex flex-col">
      {/* Content Area - Constrained Width */}
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
                <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer">
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
                        <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer">
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
      </div>

      {/* Footer Links - Online Tools Navigation (Categorized Layout) */}
      <FooterLinks
        categories={[
          {
            title: "Tool Suites",
            links: [
              { href: "https://www.jyshare.com/", label: "JyShare", icon: <Globe className="w-4 h-4" /> },
              { href: "https://tool.lu/", label: "Tool.lu", icon: <Code className="w-4 h-4" /> },
              { href: "https://123.juzi.cn/", label: "123 Tools", icon: <Keyboard className="w-4 h-4" /> },
              { href: "https://tools.qtool.cn/", label: "QTool", icon: <Globe className="w-4 h-4" /> },
              { href: "https://toolkit.xinan.me/", label: "Frontend Toolkit", icon: <Code className="w-4 h-4" /> },
              { href: "https://www.matools.com/", label: "MaTools", icon: <Keyboard className="w-4 h-4" /> },
              { href: "https://www.toolnb.com/", label: "ToolNB", icon: <Globe className="w-4 h-4" /> },
            ],
          },
          {
            title: "File Conversion",
            links: [
              { href: "https://convertio.co/", label: "Convertio", icon: <ArrowRightLeft className="w-4 h-4" /> },
              { href: "https://www.online-convert.com/", label: "Online Convert", icon: <ArrowRightLeft className="w-4 h-4" /> },
              { href: "https://cloudconvert.com/", label: "CloudConvert", icon: <ArrowRightLeft className="w-4 h-4" /> },
              { href: "https://www.ilovepdf.com/", label: "iLovePDF", icon: <FileText className="w-4 h-4" /> },
              { href: "https://smallpdf.com/", label: "Smallpdf", icon: <FileText className="w-4 h-4" /> },
              { href: "https://pdf2go.com/", label: "PDF2Go", icon: <File className="w-4 h-4" /> },
              { href: "https://www.pdf24.org/", label: "PDF24", icon: <File className="w-4 h-4" /> },
            ],
          },
          {
            title: "Image Tools",
            links: [
              { href: "https://tinypng.com/", label: "TinyPNG", icon: <ImageIcon className="w-4 h-4" /> },
              { href: "https://remove.bg/", label: "Remove.bg", icon: <ImageIcon className="w-4 h-4" /> },
              { href: "https://compressor.io/", label: "Compressor", icon: <ImageIcon className="w-4 h-4" /> },
              { href: "https://squoosh.app/", label: "Squoosh", icon: <ImageIcon className="w-4 h-4" /> },
              { href: "https://www.iloveimg.com/", label: "iLoveIMG", icon: <ImageIcon className="w-4 h-4" /> },
            ],
          },
          {
            title: "Video & Audio",
            links: [
              { href: "https://www.convertio.co/video-converter/", label: "Video Converter", icon: <Video className="w-4 h-4" /> },
              { href: "https://www.audio-convert.com/", label: "Audio Convert", icon: <AudioWaveform className="w-4 h-4" /> },
              { href: "https://mp3cut.net/", label: "MP3 Cut", icon: <AudioWaveform className="w-4 h-4" /> },
              { href: "https://www.123apps.com/", label: "123Apps", icon: <Video className="w-4 h-4" /> },
            ],
          },
          {
            title: "Dev Tools",
            links: [
              { href: "https://carbon.now.sh/", label: "Carbon", icon: <Code className="w-4 h-4" /> },
              { href: "https://figma.com", label: "Figma", icon: <Palette className="w-4 h-4" /> },
              { href: "https://vercel.com", label: "Vercel", icon: <Globe className="w-4 h-4" /> },
              { href: "https://cli.dev", label: "CLI Tools", icon: <Terminal className="w-4 h-4" /> },
              { href: "https://regex101.com/", label: "Regex101", icon: <Code className="w-4 h-4" /> },
              { href: "https://jsonlint.com/", label: "JSON Lint", icon: <Code className="w-4 h-4" /> },
              { href: "https://www.base64encode.org/", label: "Base64", icon: <Lock className="w-4 h-4" /> },
            ],
          },
          {
            title: "Typography",
            links: [
              { href: "https://fonts.google.com/", label: "Google Fonts", icon: <Type className="w-4 h-4" /> },
              { href: "https://www.fontsquirrel.com/", label: "Font Squirrel", icon: <Type className="w-4 h-4" /> },
              { href: "https://www.dafont.com/", label: "DaFont", icon: <Type className="w-4 h-4" /> },
            ],
          },
          {
            title: "Utilities",
            links: [
              { href: "https://www.browserstack.com/", label: "BrowserStack", icon: <Globe className="w-4 h-4" /> },
              { href: "https://gtmetrix.com/", label: "GTmetrix", icon: <Activity className="w-4 h-4" /> },
              { href: "https://pagespeed.web.dev/", label: "PageSpeed", icon: <Activity className="w-4 h-4" /> },
            ],
          },
        ]}
      />
    </div>
  );
}
