'use client'

import { useQuery } from '@tanstack/react-query'
import { FlaskConical, Users, ExternalLink, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Lab {
  id: number
  name: string
  description: string
  category: string
  status: string
  media: string
  link: string
}

async function fetchLabs(): Promise<Lab[]> {
  const res = await fetch('http://localhost:8000/api/v1/labs')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export default function LabsPage() {
  const [onlineCount, setOnlineCount] = useState(0)
  
  const { data: labs = [], isLoading } = useQuery({
    queryKey: ['labs'],
    queryFn: fetchLabs,
  })

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'online_count') {
        setOnlineCount(data.count)
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bc13fe]/10 border border-[#bc13fe]/20 text-[#bc13fe] text-[10px] font-bold uppercase tracking-widest">
              <FlaskConical className="w-3 h-3" />
              Experimental Zone
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-[family-name:var(--font-outfit)]">
              RESEARCH <span className="text-[#bc13fe]">LABS</span>
            </h1>
            <p className="text-[#94a3b8] italic max-w-xl">
              Incubating the next generation of AI agent capabilities. 
              These prototypes are unstable and may mutate at any time.
            </p>
          </div>

          {/* Live Counter Component */}
          <div className="bg-[#11111a] border border-white/5 p-6 rounded-2xl flex items-center gap-6 backdrop-blur-xl">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#00ffa3]" />
              </div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    "0 0 0px #00ffa3",
                    "0 0 20px #00ffa3",
                    "0 0 0px #00ffa3"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ffa3] rounded-full border-4 border-[#11111a]" 
              />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Live Frequency</p>
              <h4 className="text-2xl font-black text-white">{onlineCount} <span className="text-sm font-normal text-[#94a3b8]/50">NODES</span></h4>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 bg-white/5 animate-pulse rounded-3xl border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labs.map((lab) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#11111a]/40 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden hover:border-[#bc13fe]/30 transition-all flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 relative h-48 md:h-auto bg-[#1a1a24]">
                  {/* Media Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <FlaskConical className="w-20 h-20 text-[#bc13fe]" />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-[#bc13fe] border border-[#bc13fe]/30 uppercase tracking-tighter">
                      {lab.status}
                    </span>
                  </div>
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">{lab.category}</span>
                    <h3 className="text-2xl font-bold text-white mt-2 group-hover:text-[#bc13fe] transition-colors font-[family-name:var(--font-outfit)]">{lab.name}</h3>
                    <p className="text-sm text-[#94a3b8] mt-4 leading-relaxed line-clamp-3 italic">
                      {lab.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <a
                      href={lab.link}
                      className="px-6 py-2 bg-[#bc13fe] text-white text-xs font-bold rounded-lg hover:bg-[#a30ee0] transition-all shadow-[0_0_20px_rgba(188,19,254,0.2)]"
                    >
                      ENTER LAB
                    </a>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                      <Info className="w-4 h-4 text-[#94a3b8]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
