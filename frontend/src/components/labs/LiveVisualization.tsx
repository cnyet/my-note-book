'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const LiveVisualization: React.FC = () => {
  const [data, setData] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev, Math.random() * 100]
        if (newData.length > 20) return newData.slice(1)
        return newData
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-32 flex items-end gap-1 px-4 py-6 glass-standard rounded-2xl overflow-hidden relative group">
      <div className="absolute top-2 left-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Neural Pulse Stream</div>
      {data.map((val, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${val}%` }}
          className="flex-1 bg-gradient-to-t from-[#bc13fe] to-[#00f2ff] rounded-t-sm opacity-40 group-hover:opacity-80 transition-opacity"
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(188,19,254,0.1),transparent)] pointer-events-none" />
    </div>
  )
}
