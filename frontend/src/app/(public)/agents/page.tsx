"use client";

import Link from "next/link";
import { useAgents } from "@/hooks/use-agents";
import { Newspaper, CheckSquare, Heart, BookOpen, Shirt, Loader2, Bot, Zap, Brain, MessageSquare, Sparkles, Image, Code, Search, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { FlatCard } from "@/components/ui/FlatCard";
import { ScrollReveal, createStaggerAnimation } from "@/components/ui/ScrollReveal";
import { FooterLinks } from "@/components/ui/FooterLinks";
import { useState } from "react";

const agentCategories = [
  { id: "all", label: "全部", icon: Bot },
  { id: "information", label: "信息处理", icon: Newspaper },
  { id: "productivity", label: "效率提升", icon: Zap },
  { id: "lifestyle", label: "生活健康", icon: Heart },
  { id: "learning", label: "学习成长", icon: Brain },
];

interface AgentConfig {
  icon: React.ReactNode;
  iconColor: string;
  description: string;
}

const agentConfig: Record<string, AgentConfig> = {
  news: {
    icon: <Newspaper className="w-6 h-6" />,
    iconColor: "text-blue-400",
    description: "自动爬取科技新闻，AI 生成摘要",
  },
  task: {
    icon: <CheckSquare className="w-6 h-6" />,
    iconColor: "text-emerald-400",
    description: "智能生成任务，优先级管理",
  },
  life: {
    icon: <Heart className="w-6 h-6" />,
    iconColor: "text-red-400",
    description: "健康数据记录，AI 建议",
  },
  review: {
    icon: <BookOpen className="w-6 h-6" />,
    iconColor: "text-purple-400",
    description: "自动汇总日报，成长追踪",
  },
  outfit: {
    icon: <Shirt className="w-6 h-6" />,
    iconColor: "text-orange-400",
    description: "天气适配，AI 穿搭建议",
  },
};

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents();
  const [activeCategory, setActiveCategory] = useState("all");

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 pb-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          <p className="text-slate-400">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-6 pb-0">
        <div className="max-w-2xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Agents</h2>
          <p className="text-slate-400">Failed to load agents. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-0 flex flex-col">
      {/* 内容区域 - 受限宽度 */}
      <div className="max-w-[1400px] mx-auto px-6 flex-1">
        {/* Hero Section */}
        <ScrollReveal direction="up">
          <div className="text-center mb-32">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight whitespace-nowrap mb-10">
              AI Personal <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Assistants
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Five intelligent agents to automate your daily workflow
            </p>

            {/* Category Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 flex flex-wrap justify-center gap-3"
            >
              {agentCategories.map((category) => {
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

        {/* Agent Grid - 6 columns on desktop, compact cards */}
        <motion.div
          variants={createStaggerAnimation(0.1).container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-20 min-h-[600px]"
        >
          {agents?.map((agent) => {
            const config = agentConfig[agent.slug] || {
              icon: <Newspaper className="w-6 h-6" />,
              iconColor: "text-slate-400",
              description: "AI-powered assistant",
            };
            return (
              <motion.div key={agent.id} variants={createStaggerAnimation(0.1).item}>
                <Link href={agent.link}>
                  <FlatCard className="group p-4 flex items-center gap-4 cursor-pointer">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                      flex items-center justify-center flex-shrink-0 ${config.iconColor}`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                        {agent.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed truncate">
                        {config.description}
                      </p>
                    </div>
                  </FlatCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {!isLoading && agents?.length === 0 && (
          <ScrollReveal direction="up">
            <div className="text-center py-32">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 flex items-center justify-center mx-auto">
                  <Newspaper className="w-12 h-12 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-3">No agents available</h3>
              <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">
                Check back later for new agents
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Footer Links - External AI Navigation (全宽背景) */}
      <FooterLinks
        links={[
          // AI 工具导航
          { href: "https://ai-bot.cn/", label: "AI Bot.cn", icon: <Bot className="w-4 h-4" /> },
          { href: "https://futuretools.io/", label: "FutureTools", icon: <Zap className="w-4 h-4" /> },
          { href: "https://theresanaiforthat.com/", label: "There's An AI", icon: <Sparkles className="w-4 h-4" /> },
          { href: "https://huggingface.co/", label: "Hugging Face", icon: <MessageSquare className="w-4 h-4" /> },
          { href: "https://openai.com/", label: "OpenAI", icon: <Brain className="w-4 h-4" /> },
          { href: "https://anthropic.com/", label: "Anthropic", icon: <BookOpen className="w-4 h-4" /> },
          { href: "https://langchain.com/", label: "LangChain", icon: <Code className="w-4 h-4" /> },
          { href: "https://midjourney.com/", label: "Midjourney", icon: <Image className="w-4 h-4" /> },
          { href: "https://stability.ai/", label: "Stability AI", icon: <Wand2 className="w-4 h-4" /> },
          { href: "https://www.perplexity.ai/", label: "Perplexity", icon: <Search className="w-4 h-4" /> },
        ]}
      />
    </div>
  );
}
