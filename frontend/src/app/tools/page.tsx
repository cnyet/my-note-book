'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ExternalLink, Box, Globe, Cpu, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tool {
  id: number
  name: string
  description: string
  icon: string
  category: string
  link: string
}

async function fetchTools(): Promise<Tool[]> {
  const res = await fetch('http://localhost:8000/api/v1/tools')
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
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-[family-name:var(--font-outfit)]">
            NEURAL <span className="text-[#00f2ff]">TOOLS</span>
          </h1>
          <p className="text-[#94a3b8] mt-4 max-w-2xl italic">
            Advanced utility modules for multi-agent synchronization and task automation.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-[#00f2ff] outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#00f2ff] text-[#0a0a0f]' 
                    : 'bg-white/5 text-[#94a3b8] hover:bg-white/10'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  layout
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-[#11111a]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-[#00f2ff]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] mb-4 group-hover:scale-110 transition-transform">
                      <Box className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{tool.name}</h3>
                    <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">{tool.description}</p>
                  </div>
                  <a
                    href={tool.link}
                    target="_blank"
                    className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:underline"
                  >
                    ACCESS MODULE <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
