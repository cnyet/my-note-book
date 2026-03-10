"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import Link from "next/link";
import { useAgents } from "@/hooks/use-agents";
import { Newspaper, CheckSquare, Heart, BookOpen, Shirt, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AgentConfig {
  icon: React.ReactNode;
  iconColor: string;
  description: string;
}

// Agent slug to icon and color mapping
const agentConfig: Record<string, AgentConfig> = {
  news: {
    icon: <Newspaper className="w-6 h-6" />,
    iconColor: "group-hover:text-blue-400",
    description: "自动爬取科技新闻，AI 生成摘要",
  },
  task: {
    icon: <CheckSquare className="w-6 h-6" />,
    iconColor: "group-hover:text-emerald-400",
    description: "智能生成任务，优先级管理",
  },
  life: {
    icon: <Heart className="w-6 h-6" />,
    iconColor: "group-hover:text-red-400",
    description: "健康数据记录，AI 建议",
  },
  review: {
    icon: <BookOpen className="w-6 h-6" />,
    iconColor: "group-hover:text-purple-400",
    description: "自动汇总日报，成长追踪",
  },
  outfit: {
    icon: <Shirt className="w-6 h-6" />,
    iconColor: "group-hover:text-orange-400",
    description: "天气适配，AI 穿搭建议",
  },
};

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents();

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
            AI Personal <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Assistants
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Five intelligent agents to automate your daily workflow
          </p>
        </motion.div>

        {/* Agent Grid - 5 columns on desktop, compact cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-20"
        >
          {agents?.map((agent, index) => {
            const config = agentConfig[agent.slug] || {
              icon: <Newspaper className="w-6 h-6" />,
              iconColor: "group-hover:text-slate-400",
              description: "AI-powered assistant",
            };
            return (
              <motion.div key={agent.id} variants={itemVariants}>
                <Link href={agent.link}>
                  <div
                    className={`group relative backdrop-blur-md bg-white/5
                      p-4 rounded-xl border border-white/10
                      transition-all duration-300 hover:shadow-lg hover:border-indigo-500/40
                      overflow-hidden flex items-center gap-4`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                      flex items-center justify-center flex-shrink-0 ${config.iconColor} transition-colors`}>
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

                    {/* Arrow indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {!isLoading && agents?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
              <Newspaper className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No agents available</h3>
            <p className="text-slate-400 font-medium">Check back later for new agents</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
