// frontend/src/components/news/NewsList.tsx
/**
 * NewsList Component
 *
 * 新闻列表展示组件
 */

"use client";

import { useNewsList } from "@/hooks/use-news";
import { Newspaper, ExternalLink, Clock, User } from "lucide-react";

export function NewsList() {
  const { data, isLoading, error } = useNewsList(1, 20);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-white/10 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                <div className="h-4 w-full bg-white/10 rounded"></div>
                <div className="h-4 w-2/3 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-400 text-lg font-medium">加载新闻失败</div>
        <div className="text-slate-500 text-sm mt-2">请稍后重试</div>
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <Newspaper className="text-slate-600" size={40} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">暂无新闻</h3>
        <p className="text-slate-500 font-medium">
          点击上方"立即刷新"按钮获取最新新闻
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.articles.map((article) => (
        <article
          key={article.id}
          className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* 封面图片 */}
            {article.image_url ? (
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full md:w-48 h-32 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Newspaper className="text-indigo-400" size={32} />
              </div>
            )}

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              {/* 标题 */}
              <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {article.title}
              </h2>

              {/* 摘要 */}
              {article.summary && (
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {article.summary}
                </p>
              )}

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                {/* 来源 */}
                {article.source_name && (
                  <span className="inline-flex items-center gap-1.5">
                    <Newspaper size={12} />
                    {article.source_name}
                  </span>
                )}

                {/* 作者 */}
                {article.author && (
                  <span className="inline-flex items-center gap-1.5">
                    <User size={12} />
                    {article.author}
                  </span>
                )}

                {/* 发布时间 */}
                {article.published_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} />
                    {formatDate(article.published_at)}
                  </span>
                )}
              </div>
            </div>

            {/* 外链按钮 */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500 hover:border-indigo-500 transition-all group-hover:scale-110"
            >
              <ExternalLink size={18} className="text-white" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN");
}
