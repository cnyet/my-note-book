// frontend/src/components/news/NewsStats.tsx
/**
 * NewsStats Component
 *
 * 显示新闻统计信息的卡片组件
 */

"use client";

import { useNewsStats } from "@/hooks/use-news";
import { FileText, Newspaper, CheckCircle, Sparkles } from "lucide-react";

export function NewsStats() {
  const { data: stats, isLoading } = useNewsStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse"
          >
            <div className="h-8 w-8 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
            <div className="h-8 w-16 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: <Newspaper className="text-blue-400" size={28} />,
      label: "活跃新闻源",
      value: stats?.active_sources || 0,
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <FileText className="text-purple-400" size={28} />,
      label: "总文章数",
      value: stats?.total_articles || 0,
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <CheckCircle className="text-green-400" size={28} />,
      label: "已摘要文章",
      value: stats?.summarized_articles || 0,
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: <Sparkles className="text-yellow-400" size={28} />,
      label: "精选文章",
      value: stats?.featured_articles || 0,
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`backdrop-blur-md bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 border border-white/10 group hover:scale-105 transition-transform duration-300`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
