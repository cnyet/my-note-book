"use client";

import { motion } from "framer-motion";
import { Card } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Calendar, Clock, User, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlogPostProps {
  title: string;
  subtitle?: string;
  author: string;
  publishDate: string;
  readTime?: string;
  views?: number;
  coverImage?: string;
  content: string;
}

export default function BlogPost({
  title,
  subtitle,
  author = "Admin",
  publishDate,
  readTime = "5 min read",
  views = 0,
  coverImage,
  content,
}: BlogPostProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-duralux-bg-page to-white dark:from-[#1a1a2e] dark:to-[#16213e]"
    >
      {/* Back Button */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#1a1a2e]/80 border-b border-duralux-border-light dark:border-duralux-border-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-duralux-text-muted hover:text-duralux-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-[400px] object-cover opacity-20 dark:opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-[#1a1a2e]/50 dark:to-[#1a1a2e]" />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-4 leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg text-duralux-text-muted dark:text-duralux-text-dark-secondary mb-8 max-w-2xl">
                {subtitle}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-duralux-text-muted">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={publishDate}>
                  {new Date(publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
              {views !== undefined && views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <Card
          className="rounded-2xl shadow-duralux-card dark:shadow-duralux-card-dark border-0 overflow-hidden"
          styles={{
            body: { padding: "0" },
          }}
        >
          {/* Prose Container - Optimized for Reading */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="px-8 py-12">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      {...props}
                      className="text-3xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mt-12 mb-6"
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      {...props}
                      className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mt-10 mb-5 pb-2 border-b border-duralux-border-light dark:border-duralux-border-dark"
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      {...props}
                      className="text-xl font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mt-8 mb-4"
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary leading-relaxed mb-6"
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-disc list-inside space-y-2 mb-6 text-duralux-text-secondary dark:text-duralux-text-dark-secondary"
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal list-inside space-y-2 mb-6 text-duralux-text-secondary dark:text-duralux-text-dark-secondary"
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li {...props} className="pl-2" />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-duralux-primary pl-6 py-4 my-8 bg-duralux-primary-transparent/50 dark:bg-duralux-primary-transparent/20 rounded-r-lg italic text-duralux-text-secondary dark:text-duralux-text-dark-secondary"
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      {...props}
                      className="block p-4 rounded-lg bg-duralux-bg-page dark:bg-duralux-bg-dark-card overflow-x-auto text-sm font-mono"
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      {...props}
                      className="my-6 rounded-lg bg-duralux-bg-page dark:bg-duralux-bg-dark-card overflow-x-auto"
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table
                        {...props}
                        className="min-w-full border border-duralux-border-light dark:border-duralux-border-dark rounded-lg overflow-hidden"
                      />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      {...props}
                      className="px-4 py-3 text-left font-semibold bg-duralux-bg-page dark:bg-duralux-bg-dark-card text-duralux-text-primary dark:text-duralux-text-dark-primary border-b border-duralux-border-light dark:border-duralux-border-dark"
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      {...props}
                      className="px-4 py-3 text-duralux-text-secondary dark:text-duralux-text-dark-secondary border-b border-duralux-border-light dark:border-duralux-border-dark last:border-b-0"
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-duralux-primary hover:text-duralux-primary-dark underline decoration-duralux-primary/30 hover:decoration-duralux-primary transition-colors"
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr
                      {...props}
                      className="my-12 border-duralux-border-light dark:border-duralux-border-dark"
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-xl shadow-lg my-8 max-w-full"
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </Card>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="rounded-2xl shadow-duralux-card dark:shadow-duralux-card-dark border-0">
            <h3 className="text-lg font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-4">
              Share this article
            </h3>
            <div className="flex items-center justify-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-duralux-bg-page dark:bg-duralux-bg-dark-card hover:bg-duralux-primary hover:text-white transition-colors text-sm font-medium">
                Twitter
              </button>
              <button className="px-4 py-2 rounded-lg bg-duralux-bg-page dark:bg-duralux-bg-dark-card hover:bg-duralux-primary hover:text-white transition-colors text-sm font-medium">
                LinkedIn
              </button>
              <button className="px-4 py-2 rounded-lg bg-duralux-bg-page dark:bg-duralux-bg-dark-card hover:bg-duralux-primary hover:text-white transition-colors text-sm font-medium">
                Copy Link
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.article>
  );
}
