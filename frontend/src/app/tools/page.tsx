'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ExternalLink, Box, Activity, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const ThreeDCard = dynamic(() => import('@/components/ui/ThreeDCard').then(mod => mod.ThreeDCard), {
  ssr: false
})

interface Tool {
  id: number
  name: string
  description: string
  icon: string
  category: string
  link: string
}

async function fetchTools(): Promise<Tool[]> {
  const res = await fetch('http://localhost:8001/api/v1/tools')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export default function ToolsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  })

  const categories = ['ALL', ...Array.from(new Set(tools.map((t) => t.category)))]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'ALL' || tool.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32 px-6 selection:bg-[#00f2ff]/30 relative overflow-hidden">
      
      <div className="container mx-auto relative z-10">
        <header className="mb-32 space-y-8 max-w-4xl">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-4"
           >
              <Activity className="w-4 h-4 text-[#00f2ff]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f2ff]">Infrastructure // Utility Inventory</span>
           </motion.div>
           <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] font-outfit uppercase">
              Neural <br />
              <span className="text-white/20">Tools</span>
           </h1>
           <p className="text-[#94a3b8] text-xl italic font-light max-w-2xl leading-relaxed">
              High-performance modular blocks for context engineering, <br />
              data synthesis, and autonomous task orchestration.
           </p>
        </header>

        {/* Modular Command Bar */}
        <div className="flex flex-col lg:flex-row gap-8 mb-24 items-center justify-between py-12 border-y border-white/5 relative">
          <div className="relative w-full lg:max-w-2xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00f2ff] transition-colors" />
            <input
              placeholder="Search available modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-6 text-sm font-mono text-white focus:bg-white/[0.06] focus:border-[#00f2ff]/40 outline-none transition-all placeholder:text-white/10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-full text-[9px] font-black tracking-[0.3em] uppercase transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#00f2ff] text-[#0a0a0f] shadow-[0_0_30px_rgba(0,242,255,0.3)]' 
                    : 'glass-standard text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 glass-standard animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool, i) => (
                <ThreeDCard key={tool.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group glass-standard rounded-[3rem] p-10 hover:border-[#00f2ff]/30 transition-all flex flex-col justify-between relative overflow-hidden h-full"
                  >
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#00f2ff] mb-10 group-hover:bg-[#00f2ff] group-hover:text-[#0a0a0f] group-hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all duration-500">
                        <Box className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter font-outfit leading-none">{tool.name}</h3>
                      <p className="text-xs text-[#94a3b8] line-clamp-4 leading-relaxed font-light italic opacity-60 group-hover:opacity-100 transition-opacity">
                        {tool.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10 mt-12 flex items-center justify-between">
                       <a
                         href={tool.link}
                         target="_blank"
                         className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff] hover:underline"
                       >
                         DEPLOY <ExternalLink className="w-3.5 h-3.5" />
                       </a>
                       <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-white/10" />
                          <div className="w-1 h-1 rounded-full bg-white/10" />
                          <div className="w-1 h-1 rounded-full bg-white/10" />
                       </div>
                    </div>
                    
                    {/* Hover Detail: Background Symbol */}
                    <div className="absolute -bottom-6 -right-6 opacity-0 group-hover:opacity-5 transition-all duration-700 pointer-events-none transform group-hover:scale-150">
                       <Layers className="w-48 h-48 text-[#00f2ff]" />
                    </div>
                  </motion.div>
                </ThreeDCard>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Decorative Ambient Gradients */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00f2ff]/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </div>
  )
}
