// frontend/src/app/(public)/news/page.tsx
"use client";

import { NewsList } from "@/components/news/NewsList";
import { NewsStats } from "@/components/news/NewsStats";
import { RefreshCw } from "lucide-react";
import { useRefreshNews } from "@/hooks/use-news";
import { useState } from "react";

export default function NewsPage() {
  const { mutate: refresh, isPending } = useRefreshNews();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh(undefined, {
      onSuccess: () => {
        setTimeout(() => setIsRefreshing(false), 500);
      },
      onError: () => {
        setTimeout(() => setIsRefreshing(false), 500);
      },
    });
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Updates
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              News<span className="text-indigo-400">.Hub</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              AI 驱动的新闻聚合与摘要，每日更新科技、设计和商业领域的最新动态
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "刷新中..." : "立即刷新"}
          </button>
        </div>

        {/* Stats */}
        <NewsStats />

        {/* News List */}
        <NewsList />
      </div>
    </div>
  );
}
