"use client";

import { motion } from "framer-motion";
import { Card } from "antd";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "2028-global-intelligence-crisis",
    title: "THE 2028 GLOBAL INTELLIGENCE CRISIS",
    subtitle: "人类智能稀缺性的终结 — AI 看涨背后的经济风险",
    excerpt: "现代经济史一直以一个根本假设为前提：人类智能是稀缺投入。现在，我们正在经历这种溢价的终结。",
    author: "CitriniResearch",
    publishDate: "2026-02-22",
    readTime: "15 min read",
    category: "Technology",
  },
];

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-duralux-bg-page to-white dark:from-[#1a1a2e] dark:to-[#16213e]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-duralux-primary/10 to-duralux-info/10 dark:from-duralux-primary/5 dark:to-duralux-info/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-duralux-primary text-white mb-6">
              Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-4">
              Latest Insights
            </h1>
            <p className="text-lg text-duralux-text-muted dark:text-duralux-text-dark-secondary max-w-2xl mx-auto">
              Exploring the intersection of AI, technology, and society
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-full rounded-2xl shadow-duralux-card dark:shadow-duralux-card-dark border-0 hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                styles={{
                  body: { padding: "0" },
                }}
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Category Tag */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-duralux-primary-transparent text-duralux-primary mb-4">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-3 line-clamp-2 group-hover:text-duralux-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm text-duralux-text-muted dark:text-duralux-text-dark-secondary mb-4 line-clamp-1">
                      {post.subtitle}
                    </p>

                    {/* Excerpt */}
                    <p className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-duralux-text-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(post.publishDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-2 text-duralux-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {BLOG_POSTS.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-duralux-bg-page dark:bg-duralux-bg-dark-card flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-duralux-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
              No posts yet
            </h3>
            <p className="text-duralux-text-muted dark:text-duralux-text-dark-secondary">
              Check back later for new content
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
