'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, Bot, MessageSquare, Info, Shield, Radio } from 'lucide-react'
import { useState } from 'react'
import { MagneticButton } from '@/components/ui/MagneticButton'

const AGENTS = [
  { id: 1, name: 'PROMETHEUS', role: 'Planner', desc: 'Decomposes complex objectives into atomic execution waves with dependency mapping.', status: 'Active', security: 'Level 5' },
  { id: 2, name: 'SISYPHUS', role: 'Implementer', desc: 'Autonomous code generation and iterative execution with real-time linting.', status: 'Busy', security: 'Level 4' },
  { id: 3, name: 'HEPHAESTUS', role: 'Architect', desc: 'System modeling, database optimization, and high-performance backend logic.', status: 'Standby', security: 'Level 5' },
  { id: 4, name: 'CONTEXT GUARDIAN', role: 'Librarian', desc: 'Retrieval augmented generation and cross-module context preservation.', status: 'Active', security: 'Level 4' },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 px-6">
      <div className="container mx-auto">
        
        {/* Header: Command Center Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-[#00f2ff] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff] glow-cyan font-mono">Channel: Secure_Orch_Bus</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-outfit uppercase leading-[0.85]">
                Agent <br />
                <span className="text-white/20 italic">Hub</span>
             </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-xl">
             <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00f2ff] transition-colors" />
                <input 
                  placeholder="Scan neural registry..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-sm font-mono focus:bg-white/[0.08] focus:border-[#00f2ff]/40 outline-none transition-all placeholder:text-white/20"
                />
             </div>
             <button className="p-5 glass-standard rounded-2xl hover:bg-white/10 transition-all">
                <SlidersHorizontal className="w-5 h-5 text-[#94a3b8]" />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Sidebar: Registry List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 px-2 flex items-center justify-between">
               <span>Agent Registry</span>
               <span className="font-mono">[004/004]</span>
            </div>
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                  selectedAgent.id === agent.id 
                    ? 'bg-white/[0.04] border-[#00f2ff]/30 shadow-2xl' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'
                }`}
              >
                {/* Holographic Overlay & Glitch Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-tr from-[#00f2ff] via-transparent to-[#bc13fe] pointer-events-none" />
                <motion.div 
                  initial={false}
                  whileHover={{ x: [0, -2, 2, -1, 0], y: [0, 1, -1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                />

                <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    selectedAgent.id === agent.id ? 'bg-[#00f2ff] text-[#0a0a0f] shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-white/40 group-hover:bg-white/10'
                  }`}>
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm tracking-widest uppercase transition-colors ${selectedAgent.id === agent.id ? 'text-white' : 'text-white/60'}`}>{agent.name}</h3>
                    <p className="text-[10px] font-mono text-white/30 mt-1 uppercase">{agent.role}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === 'Active' ? 'bg-[#00ffa3] shadow-[0_0_10px_#00ffa3]' : 
                    agent.status === 'Busy' ? 'bg-[#bc13fe]' : 'bg-white/10'
                  }`} />
                </div>
                {selectedAgent.id === agent.id && (
                  <motion.div 
                    layoutId="active-marker"
                    className="absolute left-0 top-1/4 w-[2px] h-1/2 bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Main: Command Terminal */}
          <div className="lg:col-span-8 glass-elevated rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col relative group">
            
            {/* Viewport Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.02]">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black tracking-[0.4em] text-[#00f2ff] uppercase">Terminal Session</span>
                <span className="font-bold text-xs font-mono">{selectedAgent.name} {'//'} v2.0.4</span>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all"><MessageSquare className="w-4 h-4 text-white/40" /></button>
                <button className="p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all"><Info className="w-4 h-4 text-white/40" /></button>
              </div>
            </div>

            {/* Content: Intelligence Integration View */}
            <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedAgent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8 max-w-2xl relative z-10"
                >
                  <div className="relative inline-block mx-auto mb-4">
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2ff] to-[#bc13fe] blur-[40px] opacity-20 animate-pulse" />
                     <div className="w-28 h-28 rounded-full border border-white/10 flex items-center justify-center relative bg-[#0a0a0f]">
                        <Bot className="w-12 h-12 text-[#00f2ff] glow-cyan" />
                     </div>
                  </div>

                  <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter text-white/90">
                    {selectedAgent.name}
                  </h2>
                  <p className="text-[#94a3b8] text-lg font-light leading-relaxed italic">
                    &quot;{selectedAgent.desc}&quot;
                  </p>

                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="p-5 glass-standard rounded-2xl text-left space-y-1 border-white/5">
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Clearance</span>
                       <div className="flex items-center gap-2 font-mono font-bold text-xs text-[#bc13fe]">
                          <Shield className="w-3.5 h-3.5" /> {selectedAgent.security}
                       </div>
                    </div>
                    <div className="p-5 glass-standard rounded-2xl text-left space-y-1 border-white/5">
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Node Status</span>
                       <div className={`flex items-center gap-2 font-mono font-bold text-xs ${
                          selectedAgent.status === 'Active' ? 'text-[#00ffa3]' : 'text-[#bc13fe]'
                       }`}>
                          <div className={`w-2 h-2 rounded-full ${selectedAgent.status === 'Active' ? 'bg-[#00ffa3]' : 'bg-[#bc13fe]'}`} /> {selectedAgent.status.toUpperCase()}
                       </div>
                    </div>
                  </div>

                  <MagneticButton className="mt-8 px-12 py-5 bg-white text-[#0a0a0f] font-black text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-[#00f2ff] transition-all shadow-2xl active:scale-95">
                     Initiate Neural Thread
                  </MagneticButton>
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Grid Background in Viewport */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.02),transparent_70%)] pointer-events-none" />
            </div>

            {/* Bottom Scanline Animation */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent shadow-[0_0_15px_#00f2ff]"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
