"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/admin-api";

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

export default function BlogListPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: async () => {
      const response = await apiClient.get<BlogPost[]>("/admin/blog?status=published");
      return response.data || [];
    },
  });

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
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Editorial
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
              Insights &
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Breakthroughs
              </span>
              .
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
              The latest thoughts from our design leads on AI, creativity, and the
              future of engineering.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="relative px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariants} className="space-y-4">
                    <div className="rounded-[40px] aspect-video bg-slate-800/50" />
                    <div className="h-4 w-3/4 bg-slate-800/50 rounded" />
                    <div className="h-8 w-full bg-slate-800/50 rounded" />
                  </motion.div>
                ))
              : posts?.map((post, index) => (
                  <motion.article
                    key={post.id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      {/* Card */}
                      <div className="overflow-hidden rounded-[40px] mb-8 glass border border-white/10 aspect-video relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
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
                        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                          {post.tags?.[0]?.tag_name || "Article"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                          <span>By Admin</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <time>
                            {new Date(post.published_at || post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </time>
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
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

          {/* Empty State */}
          {!isLoading && posts?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <User className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No articles yet</h3>
              <p className="text-slate-400 font-medium">
                Check back later for new content
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="relative border-t border-white/10 py-20 px-6 backdrop-blur-md bg-white/5 rounded-t-[60px] mb-10"
      >
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-none">
            The Morning Brief.
          </h2>
          <p className="text-slate-400 text-lg font-medium">
            Join 25,000+ design engineers who receive our bi-weekly breakdown of the
            AI landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="email@address.com"
              className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white w-full sm:max-w-xs focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button className="px-10 py-5 rounded-2xl bg-white text-black font-black hover:bg-indigo-50 transition-all">
              Subscribe Now
            </button>
          </div>
        </div>
      </motion.footer>

      {/* Custom Styles */}
      <style jsx global>{`
        .glass {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
