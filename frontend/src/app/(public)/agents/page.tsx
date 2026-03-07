"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import Link from "next/link";
import { useAgents } from "@/hooks/use-agents";
import { Newspaper, CheckSquare, Heart, BookOpen, Shirt, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AgentConfig {
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  iconColor: string;
  role: string;
  description: string;
}

// Agent slug to icon and color mapping
const agentConfig: Record<string, AgentConfig> = {
  news: {
    icon: <Newspaper className="w-6 h-6" />,
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "group-hover:border-blue-500/40",
    iconColor: "group-hover:text-blue-400",
    role: "AI 资讯聚合",
    description: "自动爬取科技新闻，AI 生成摘要",
  },
  task: {
    icon: <CheckSquare className="w-6 h-6" />,
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "group-hover:border-emerald-500/40",
    iconColor: "group-hover:text-emerald-400",
    role: "任务管理",
    description: "智能生成任务，优先级管理",
  },
  life: {
    icon: <Heart className="w-6 h-6" />,
    color: "from-red-500/20 to-red-600/10",
    borderColor: "group-hover:border-red-500/40",
    iconColor: "group-hover:text-red-400",
    role: "健康管理",
    description: "健康数据记录，AI 建议",
  },
  review: {
    icon: <BookOpen className="w-6 h-6" />,
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "group-hover:border-purple-500/40",
    iconColor: "group-hover:text-purple-400",
    role: "每日复盘",
    description: "自动汇总日报，成长追踪",
  },
  outfit: {
    icon: <Shirt className="w-6 h-6" />,
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "group-hover:border-orange-500/40",
    iconColor: "group-hover:text-orange-400",
    role: "穿搭推荐",
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
              color: "from-slate-500/20 to-slate-600/10",
              borderColor: "group-hover:border-slate-500/40",
              iconColor: "group-hover:text-slate-400",
              role: agent.category,
              description: "AI-powered assistant",
            };
            return (
              <motion.div key={agent.id} variants={itemVariants}>
                <Link href={agent.link}>
                  <div
                    className={`group relative backdrop-blur-md bg-gradient-to-br ${config.color}
                      p-5 rounded-2xl border border-white/5 ${config.borderColor}
                      transition-all duration-300 hover:shadow-lg overflow-hidden`}
                  >
                    {/* Status indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${agent.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10
                      flex items-center justify-center mb-4 ${config.iconColor} transition-colors`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {config.role}
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {config.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
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
