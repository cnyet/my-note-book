// frontend/src/components/news/NewsCard.tsx
"use client";

import { Calendar, ExternalLink, Tag } from "lucide-react";
import type { NewsArticle } from "@/lib/api/news";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  return (
    <article
      className={`group cursor-pointer glass rounded-[40px] overflow-hidden border-white/5 transition-all duration-300 hover:border-indigo-500/30 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-20">📰</div>
          </div>
        )}
        {featured && (
          <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black uppercase tracking-widest backdrop-blur-md">
            Featured
          </div>
        )}
        {article.category && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
            {article.category}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-slate-500 text-xs font-medium uppercase tracking-wider">
          {article.source_name && (
            <span className="text-indigo-400">{article.source_name}</span>
          )}
          {article.published_at && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(article.published_at).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>

        <h3
          className={`font-black text-white group-hover:text-indigo-400 transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}
        >
          {article.title}
        </h3>

        {article.summary && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {article.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            阅读全文
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
