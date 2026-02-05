'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TOCItem {
  id: string
  text: string
  level: number
}

export const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [items, setItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Basic regex to find h2 and h3 tags in HTML content
    const headingRegex = /<(h[23]) id="([^"]+)">([^<]+)<\/\1>/g
    const foundItems: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      foundItems.push({
        level: parseInt(match[1][1]),
        id: match[2],
        text: match[3]
      })
    }
    setItems(foundItems)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    foundItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [content])

  if (items.length === 0) return null

  return (
    <aside className="hidden xl:block absolute left-full ml-12 top-0 h-full">
      <div className="sticky top-40 w-64 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-4 bg-[#bc13fe] shadow-[0_0_10px_#bc13fe]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Log Navigation</span>
        </div>
        
        <nav className="space-y-1 relative">
          {/* Scanline Indicator */}
          <div className="absolute left-0 top-0 w-[1px] h-full bg-white/5" />
          
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-2 text-[11px] uppercase tracking-widest transition-all relative pl-6 ${
                activeId === item.id ? 'text-[#00f2ff] font-bold' : 'text-white/30 hover:text-white/60'
              } ${item.level === 3 ? 'ml-4' : ''}`}
            >
              {activeId === item.id && (
                <motion.div
                  layoutId="toc-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]"
                />
              )}
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
