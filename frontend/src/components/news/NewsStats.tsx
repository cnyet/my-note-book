// frontend/src/components/news/NewsStats.tsx
"use client";

import { useNewsStats } from "@/hooks/use-news";
import { Database, FileText, Sparkles, Star, RefreshCw } from "lucide-react";

export function NewsStats() {
  const { data, isLoading } = useNewsStats();

  if (isLoading || !data) {
    return null;
  }

  const stats = [
    {
      icon: Database,
      label: "新闻源",
      value: data.active_sources,
      total: data.total_sources,
      color: "text-indigo-400",
    },
    {
      icon: FileText,
      label: "总文章",
      value: data.total_articles,
      color: "text-purple-400",
    },
    {
      icon: Sparkles,
      label: "已摘要",
      value: data.summarized_articles,
      color: "text-cyan-400",
    },
    {
      icon: Star,
      label: "精选",
      value: data.featured_articles,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass rounded-3xl p-6 border-white/5 backdrop-blur-md"
        >
          <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
          <div className="text-3xl font-black text-white">{stat.value}</div>
          <div className="text-sm text-slate-400 font-medium">
            {stat.label}
            {stat.total && (
              <span className="text-slate-600 ml-1">/ {stat.total}</span>
            )}
          </div>
        </div>
      ))}
      {data.last_crawl_time && (
        <div className="glass rounded-3xl p-6 border-white/5 backdrop-blur-md flex flex-col justify-center">
          <RefreshCw className="w-6 h-6 text-green-400 mb-3" />
          <div className="text-sm text-slate-400 font-medium">上次更新</div>
          <div className="text-xs text-slate-500 mt-1">
            {new Date(data.last_crawl_time).toLocaleString("zh-CN")}
          </div>
        </div>
      )}
    </div>
  );
}
