'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface BlogCardProps {
  title: string
  slug: string
  summary: string
  category?: string
  date: string
  readingTime?: string
  index?: number
}

const BlogCard = memo(function BlogCard({
  title,
  slug,
  summary,
  category,
  date,
  readingTime = '5 min read',
  index = 0,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full bg-[#11111a]/40 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden hover:border-[#00f2ff]/30 transition-all shadow-xl hover:shadow-[0_0_40px_rgba(0,242,255,0.1)]"
    >
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f2ff] px-2 py-1 rounded bg-[#00f2ff]/10 border border-[#00f2ff]/20">
              {category}
            </span>
          )}
          <div className="flex items-center gap-3 text-[11px] text-[#94a3b8] font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {readingTime}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00f2ff] transition-colors leading-tight font-[family-name:var(--font-outfit)]">
          {title}
        </h3>

        <p className="text-sm text-[#94a3b8] mb-6 line-clamp-3 leading-relaxed flex-1 italic">
          {summary}
        </p>

        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-white group/link transition-all"
        >
          READ LOG
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-[#00f2ff] group-hover/link:text-[#0a0a0f] transition-all">
            <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_4px,3px_100%] opacity-10" />
    </motion.div>
  )
})

export default BlogCard
