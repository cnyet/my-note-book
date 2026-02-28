// frontend/src/components/news/NewsList.tsx
"use client";

import { useState } from "react";
import { useNewsList } from "@/hooks/use-news";
import { NewsCard } from "./NewsCard";
import { Loader2 } from "lucide-react";

export function NewsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useNewsList({
    page,
    page_size: 12,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-indigo-400" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg font-medium">加载新闻失败</p>
        <p className="text-slate-500 text-sm mt-2">请稍后重试</p>
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg font-medium">暂无新闻</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.articles.map((article, index) => (
          <NewsCard
            key={article.id}
            article={article}
            featured={index === 0 && page === 1}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
        >
          上一页
        </button>
        <span className="px-6 py-3 text-slate-400 font-medium">
          第 {page} 页 / 共 {Math.ceil(data.total / data.page_size)} 页
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data.has_more}
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
