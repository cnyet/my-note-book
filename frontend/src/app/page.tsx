'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, Zap, Sparkles, Terminal, Shield } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Typewriter } from '@/components/ui/Typewriter'

const AdvancedParticles = dynamic(() => import('@/components/home/AdvancedParticles').then(mod => mod.AdvancedParticles), {
  ssr: false
})

const SLOGANS = ["Command AI Agents.", "Automate Complexity.", "Own the Future."]

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white flex items-center overflow-hidden">
      {/* Cinematic Background Dynamcis */}
      <AdvancedParticles />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[1000px] h-[1000px] bg-[#00f2ff]/5 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[#bc13fe]/5 blur-[160px] rounded-full" />
      </div>

      <main className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-[#00f2ff]" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#00f2ff] glow-cyan">
                 Neural Node Active
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-9xl font-bold tracking-[-0.05em] leading-[0.85] font-outfit"
              >
                GENESIS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30 italic">
                  OS.V2.0
                </span>
              </motion.h1>

              <div className="h-10">
                <div className="text-xl md:text-3xl font-mono text-[#00f2ff]/80">
                  <Typewriter texts={SLOGANS} />
                </div>
              </div>
            </div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="flex flex-wrap items-center gap-8"
            >
              <Link 
                href="/agents"
                className="group relative px-12 py-5 bg-[#00f2ff] text-[#0a0a0f] font-black text-xs uppercase tracking-[0.3em] rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                   Initialize Bridge <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link 
                href="/labs"
                className="px-10 py-5 glass-standard rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center gap-3"
              >
                Lab Prototypes <Sparkles className="w-4 h-4 text-[#bc13fe]" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Visual Component */}
          <div className="hidden lg:block lg:col-span-4 relative">
             <motion.div
               animate={{ 
                 rotate: 360,
                 scale: [1, 1.05, 1]
               }}
               transition={{ 
                 rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                 scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
               }}
               className="w-80 h-80 rounded-full border border-[#00f2ff]/20 relative flex items-center justify-center p-8"
             >
                <div className="absolute inset-0 border border-white/5 rounded-full rotate-45" />
                <div className="absolute inset-4 border border-[#bc13fe]/20 rounded-full -rotate-12" />
                <Bot className="w-24 h-24 text-[#00f2ff] glow-cyan" />
                
                {/* Orbital dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff]" />
                <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-[#bc13fe] rounded-full shadow-[0_0_10px_#bc13fe]" />
             </motion.div>
          </div>
        </div>

        {/* Status Bar Overlays */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
           <StatusItem label="Active Nodes" value="2,841" icon={Terminal} />
           <StatusItem label="Sync Frequency" value="8.4 GHz" icon={Zap} />
           <StatusItem label="Identity Verified" value="Level 4" icon={Shield} />
        </div>
      </main>

      <style jsx global>{`
        @keyframes flow {
          0% { transform: translateY(-100vh) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(-45deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function StatusItem({ label, value, icon: Icon }: { label: string, value: string, icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-6 group">
       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:bg-[#00f2ff]/10 group-hover:text-[#00f2ff]">
          <Icon className="w-5 h-5 opacity-40 group-hover:opacity-100" />
       </div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{label}</p>
          <p className="text-xl font-mono font-bold tracking-tight">{value}</p>
       </div>
    </div>
  )
}