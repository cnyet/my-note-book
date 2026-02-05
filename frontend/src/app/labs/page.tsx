'use client'

import { useQuery } from '@tanstack/react-query'
import { FlaskConical, Users, Info, Terminal, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LiveVisualization } from '@/components/labs/LiveVisualization'

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
  const res = await fetch('http://localhost:8001/api/v1/labs')
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
    const ws = new WebSocket('ws://localhost:8001/ws')
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'online_count') setOnlineCount(data.count)
    }
    return () => ws.close()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32 px-6 overflow-hidden relative selection:bg-[#bc13fe]/30">
      
      <div className="container mx-auto relative z-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32">
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#bc13fe]/10 border border-[#bc13fe]/20 text-[#bc13fe]"
            >
              <FlaskConical className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sub_Sector // Experimental</span>
            </motion.div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] font-outfit uppercase">
              Research <br />
              <span className="text-[#bc13fe] italic">Labs</span>
            </h1>
            <p className="text-[#94a3b8] text-xl max-w-2xl italic font-light leading-relaxed">
               Incubating bleeding-edge autonomous capabilities. <br />
               <span className="text-white/20">Warning: Neural pathways may fluctuate during observation.</span>
            </p>
            <div className="max-w-md">
              <LiveVisualization />
            </div>
          </div>

          {/* Live Node Counter Component */}
          <div className="glass-elevated p-10 rounded-[3rem] flex items-center gap-10 relative overflow-hidden group">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#00f2ff]/40 transition-colors">
                <Users className="w-8 h-8 text-[#00f2ff]" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 bg-[#00f2ff] rounded-full blur-2xl -z-10" 
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ffa3] rounded-full border-4 border-[#0a0a0f] animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Active Nodes</p>
              <h4 className="text-4xl font-black font-mono text-white tracking-tighter flex items-center gap-3">
                <span className="text-[#00f2ff]">[</span> {onlineCount} <span className="text-[#00f2ff]">]</span>
              </h4>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2].map((n) => (
              <div key={n} className="h-96 glass-standard animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {labs.map((lab, i) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative glass-standard rounded-[3.5rem] overflow-hidden hover:border-[#bc13fe]/30 transition-all flex flex-col md:flex-row min-h-[400px]"
              >
                <div className="md:w-2/5 relative bg-[#0d0d14] border-b md:border-b-0 md:border-r border-white/5 overflow-hidden flex items-center justify-center group-hover:bg-[#12121c] transition-colors">
                   <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Terminal className="w-full h-full p-12 text-[#bc13fe]" />
                   </div>
                   <motion.div
                     whileHover={{ scale: 1.1, rotate: 5 }}
                     className="relative z-10"
                   >
                     <FlaskConical className="w-24 h-24 text-[#bc13fe] glow-purple opacity-40 group-hover:opacity-100 transition-all" />
                   </motion.div>
                   <div className="absolute top-8 left-8">
                     <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[9px] font-black text-[#bc13fe] border border-[#bc13fe]/30 uppercase tracking-widest">
                       {lab.status}
                     </span>
                   </div>
                </div>

                <div className="md:w-3/5 p-12 flex flex-col justify-between relative">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Zap className="w-3 h-3 text-[#bc13fe]" />
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{lab.category}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white group-hover:text-[#bc13fe] transition-colors font-outfit uppercase leading-tight tracking-tight">{lab.name}</h3>
                    <p className="text-base text-[#94a3b8] leading-relaxed font-light italic">
                      &quot;{lab.description}&quot;
                    </p>

                  </div>
                  
                  <div className="mt-12 flex items-center gap-4">
                    <a
                      href={lab.link}
                      className="flex-1 text-center py-5 bg-[#bc13fe] text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-[#a30ee0] hover:shadow-[0_20px_40px_rgba(188,19,254,0.3)] transition-all active:scale-95"
                    >
                      Init Prototype
                    </a>
                    <button className="p-5 glass-standard rounded-2xl hover:bg-white/10 transition-all group/info">
                      <Info className="w-5 h-5 text-white/20 group-hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Glitch Overlay Effect on Card */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-tr from-[#bc13fe]/20 via-transparent to-[#00f2ff]/20" />
                <motion.div 
                  initial={false}
                  whileHover={{ 
                    clipPath: [
                      'inset(0 0 0 0)',
                      'inset(10% 0 85% 0)',
                      'inset(40% 0 43% 0)',
                      'inset(70% 0 5% 0)',
                      'inset(0 0 0 0)'
                    ],
                    x: [-2, 2, -1, 1, 0]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
                  className="absolute inset-0 bg-[#bc13fe]/5 mix-blend-overlay pointer-events-none opacity-0 group-hover:opacity-100"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Ambient Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#bc13fe]/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse" />
    </div>
  )
}
