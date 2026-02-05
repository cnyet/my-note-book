'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, BookOpen, Terminal } from 'lucide-react'
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
  readingTime = '8 MIN READ',
  index = 0,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full glass-standard rounded-[2.5rem] overflow-hidden hover:border-[#bc13fe]/30 transition-all duration-500 shadow-2xl"
    >
      {/* Cinematic Glitch Overlay (Visible on Hover) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#bc13fe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Image / Icon Placeholder Container */}
      <div className="h-56 bg-[#0d0d14] relative overflow-hidden flex items-center justify-center border-b border-white/5">
         <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <Terminal className="w-full h-full p-16 text-[#bc13fe]" />
         </div>
         <BookOpen className="w-16 h-16 text-[#bc13fe] opacity-20 group-hover:opacity-60 transition-all group-hover:scale-110" />
         
         <div className="absolute top-8 left-8">
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-[#bc13fe] border border-[#bc13fe]/30 uppercase tracking-[0.2em]">
               {category || 'Log'}
            </span>
         </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 p-10 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mb-6">
           <span className="flex items-center gap-2">
             <Calendar className="w-3.5 h-3.5 text-[#bc13fe]" /> {date}
           </span>
           <span className="w-1 h-1 rounded-full bg-white/10" />
           <span className="flex items-center gap-2">
             <Clock className="w-3.5 h-3.5 text-[#bc13fe]" /> {readingTime}
           </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#bc13fe] transition-colors leading-tight font-outfit uppercase tracking-tight">
          {title}
        </h3>

        <p className="text-sm text-[#94a3b8] mb-10 line-clamp-3 leading-relaxed font-light italic opacity-60 group-hover:opacity-100 transition-opacity">
          &quot;{summary}&quot;
        </p>

        <div className="mt-auto">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-[#bc13fe] transition-all group/link"
          >
            Access Data Stream
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-2" />
          </Link>
        </div>
      </div>

      {/* Scanline finishing touch */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
    </motion.div>
  )
})

export default BlogCard
