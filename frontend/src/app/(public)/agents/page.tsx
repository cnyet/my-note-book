"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { LobeChatPanel } from "@/components/features/agents/LobeChatPanel";
import Link from "next/link";
import { useAgents } from "@/hooks/use-agents";
import { Newspaper, CheckSquare, Heart, BookOpen, Shirt, Loader2 } from "lucide-react";

const AgentsFooter = () => (
  <footer className="mt-20 border-t border-white/10 py-12 px-6 backdrop-blur-md bg-white/5 rounded-t-[60px]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="text-left">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
          AI Personal Assistants
        </h3>
        <p className="text-slate-500 font-medium">
          Your daily workflow automation powered by AI.
        </p>
      </div>
      <div className="flex gap-4">
        <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">
          Learn More
        </button>
        <button className="px-8 py-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
          API Docs
        </button>
      </div>
    </div>
  </footer>
);

// Agent slug to icon and color mapping
const agentConfig: Record<string, { icon: React.ReactNode; color: string; role: string; capabilities: string[] }> = {
  news: {
    icon: <Newspaper className="text-blue-400" />,
    color: "blue",
    role: "AI 资讯聚合",
    capabilities: ["自动爬取", "AI 摘要", "每日更新"],
  },
  task: {
    icon: <CheckSquare className="text-emerald-400" />,
    color: "emerald",
    role: "任务管理",
    capabilities: ["智能生成", "优先级管理", "进度追踪"],
  },
  life: {
    icon: <Heart className="text-red-400" />,
    color: "red",
    role: "健康管理",
    capabilities: ["健康记录", "AI 建议", "数据分析"],
  },
  review: {
    icon: <BookOpen className="text-purple-400" />,
    color: "purple",
    role: "每日复盘",
    capabilities: ["自动汇总", "偏好提取", "成长追踪"],
  },
  outfit: {
    icon: <Shirt className="text-orange-400" />,
    color: "orange",
    role: "穿搭推荐",
    capabilities: ["天气适配", "日程搭配", "AI 生成"],
  },
};

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents();

  const statusColorMap: Record<string, string> = {
    Online: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const colorMap: Record<string, string> = {
    blue: "hover:border-blue-500/40 hover:shadow-blue-500/10 group-hover:bg-blue-500/10",
    emerald: "hover:border-emerald-500/40 hover:shadow-emerald-500/10 group-hover:bg-emerald-500/10",
    red: "hover:border-red-500/40 hover:shadow-red-500/10 group-hover:bg-red-500/10",
    purple: "hover:border-purple-500/40 hover:shadow-purple-500/10 group-hover:bg-purple-500/10",
    orange: "hover:border-orange-500/40 hover:shadow-orange-500/10 group-hover:bg-orange-500/10",
  };

  const iconColorMap: Record<string, string> = {
    blue: "group-hover:text-blue-400",
    emerald: "group-hover:text-emerald-400",
    red: "group-hover:text-red-400",
    purple: "group-hover:text-purple-400",
    orange: "group-hover:text-orange-400",
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
    <div className="min-h-screen pt-32 px-6 pb-0">
      <div className="animate-in fade-in slide-in-from-right-8 duration-700 max-w-[1600px] mx-auto">
        <SectionHeader
          centered
          tag="Sprint 6"
          title="AI Personal <br/>Assistants."
          subtitle="Five intelligent agents to automate your daily workflow. From news curation to health tracking, we've got you covered."
        />

        {/* Split-screen layout: Agent Grid (left) + LobeChat Panel (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left: Agent Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents?.map((agent) => {
                const config = agentConfig[agent.slug] || {
                  icon: <Newspaper className="text-slate-400" />,
                  color: "blue",
                  role: agent.category,
                  capabilities: [],
                };
                return (
                  <div
                    key={agent.id}
                    className={`backdrop-blur-md bg-white/5 p-8 rounded-[40px] border border-white/5 group hover:border-indigo-500/40 transition-all duration-500 flex flex-col h-full shadow-lg ${
                      colorMap[config.color] || ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-all ${
                        iconColorMap[config.color] || ""
                      }`}>
                        {config.icon}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          statusColorMap[agent.is_active ? "Online" : "Offline"] || ""
                        }`}
                      >
                        {agent.is_active ? "Online" : "Offline"}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-indigo-400 font-bold text-sm mb-6 uppercase tracking-wider">
                      {config.role}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {config.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-[10px] font-bold text-slate-500 border border-white/10 px-2 py-1 rounded-lg"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <Link
                        href={agent.link}
                        className="block w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm text-center hover:bg-white hover:text-slate-950 transition-all"
                      >
                        Use Agent
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: LobeChat Panel - Sticky sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 h-[calc(100vh-8rem)]">
              <LobeChatPanel />
            </div>
          </div>
        </div>

        <AgentsFooter />
      </div>
    </div>
  );
}
