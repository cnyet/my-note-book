"use client";

import { motion } from "framer-motion";
import { User, ArrowRight, Eye, Calendar, Grid3x3, List, Filter } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/admin-api";
import { useState, useMemo } from "react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  status: string;
  published_at: string;
  created_at: string;
  author_id: number;
  views?: number;
  tags: { tag_name: string }[];
}

type ViewMode = "grid" | "list";

export default function BlogListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: async () => {
      const response = await apiClient.get<BlogPost[]>("/admin/blog?status=published");
      return response.data || [];
    },
  });

  // Extract all unique tags
  const allTags = useMemo(() => {
    if (!posts) return [];
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag.tag_name));
    });
    return ["all", ...Array.from(tags)];
  }, [posts]);

  // Filter posts by selected tag
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (selectedTag === "all") return posts;
    return posts.filter((post) =>
      post.tags?.some((tag) => tag.tag_name === selectedTag)
    );
  }, [posts, selectedTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  return (
    <div className="min-h-screen pt-24 pb-0">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Insights & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Breakthroughs
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            The latest thoughts from our design leads on AI, creativity, and the future of engineering.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          {/* Tag Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-2">
              {allTags.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? "bg-indigo-500 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tag === "all" ? "全部" : tag}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Posts Content */}
        <div className="relative pb-32">
          {isLoading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-4"
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={viewMode === "grid"
                    ? "rounded-2xl aspect-video bg-slate-800/50"
                    : "rounded-2xl h-32 bg-slate-800/50"
                  }
                />
              ))}
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <User className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No articles found</h3>
              <p className="text-slate-400 font-medium">
                Try selecting a different tag
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-4"
              }
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className={`group cursor-pointer ${
                    viewMode === "list"
                      ? "flex gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                      : ""
                  }`}
                >
                  <Link href={`/blog/${post.slug}`} className={viewMode === "list" ? "flex gap-6" : ""}>
                    {/* Cover Image */}
                    {viewMode === "grid" && (
                      <div className="overflow-hidden rounded-2xl mb-6 glass border border-white/10 aspect-video relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <User className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                          {post.tags?.[0]?.tag_name || "Article"}
                        </div>
                      </div>
                    )}

                    {viewMode === "list" && (
                      <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 glass border border-white/10 relative">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-white/20" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className={`flex-1 ${viewMode === "grid" ? "space-y-4" : "flex flex-col justify-center"}`}>
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {viewMode === "list" && post.tags?.[0] && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-indigo-400">{post.tags[0].tag_name}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={`font-black text-white group-hover:text-indigo-400 transition-colors leading-tight ${
                        viewMode === "grid" ? "text-2xl line-clamp-2" : "text-3xl line-clamp-2"
                      }`}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className={`text-slate-400 leading-relaxed ${
                        viewMode === "grid" ? "text-sm line-clamp-3" : "text-base line-clamp-2"
                      }`}>
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:gap-3 transition-all">
                          <span>Read Article</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Eye className="w-3 h-3" />
                          <span>{post.views?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
