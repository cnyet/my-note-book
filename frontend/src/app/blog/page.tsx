"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { GradientText } from "@/components/v-ui/GradientText";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    id: 1,
    slug: "future-of-ai-automation",
    title: "The Future of AI in Workflow Automation",
    excerpt:
      "Exploring how autonomous multi-agent systems are revolutionizing the modern development landscape.",
    author: "Dr. A. Chen",
    date: "Feb 09, 2026",
    readTime: "8 min read",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    slug: "orchestrating-agent-teams",
    title: "Orchestrating Complex Agent Teams with Genesis v2.0",
    excerpt:
      "A deep dive into the coordination patterns and protocols required for large-scale agent deployments.",
    author: "Z. Matrix",
    date: "Feb 07, 2026",
    readTime: "12 min read",
    category: "Technical",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc46386c635?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    slug: "building-holographic-uis",
    title: "Building Holographic UIs for AI Workspaces",
    excerpt:
      "Design principles for creating immersive, data-dense interfaces that don't overwhelm the user.",
    author: "V. Neon",
    date: "Feb 05, 2026",
    readTime: "6 min read",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 bg-void relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <GradientText as="h1" className="text-5xl md:text-7xl font-bold">
            Project Log
          </GradientText>
          <p className="text-xl text-text-secondary font-body">
            Technical insights, architectural decisions, and the occasional
            transmission from the future.
          </p>
        </div>

        {/* Featured / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <GlassCard className="h-full flex flex-col group border-white/5 hover:border-primary/20 transition-all overflow-hidden p-0">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-void/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <h2 className="text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-text-secondary font-body text-sm line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted uppercase">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-accent" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
