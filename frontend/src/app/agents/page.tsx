'use client'

import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Bot, MessageSquare, Info } from 'lucide-react'
import { useState } from 'react'

const AGENTS = [
  { id: 1, name: 'PROMETHEUS', role: 'Planner', desc: 'High-level strategy and task decomposition.', status: 'Active' },
  { id: 2, name: 'SISYPHUS', role: 'Implementer', desc: 'Autonomous code generation and execution.', status: 'Busy' },
  { id: 3, name: 'HEPHAESTUS', role: 'Architect', desc: 'System design and complex backend logic.', status: 'Standby' },
  { id: 4, name: 'CONTEXT GUARDIAN', role: 'Librarian', desc: 'Context retrieval and memory management.', status: 'Active' },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">AGENT HUB</h1>
            <p className="text-[#94a3b8] mt-2 text-sm uppercase tracking-widest">Neural Link Established</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input 
                placeholder="Search neural patterns..."
                className="bg-[#11111a] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#00f2ff] outline-none w-full md:w-64"
              />
            </div>
            <button className="p-2 bg-[#11111a] border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-[#94a3b8]" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-4 space-y-4">
            {AGENTS.map((agent) => (
              <motion.button
                key={agent.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  selectedAgent.id === agent.id 
                    ? 'bg-[#00f2ff]/5 border-[#00f2ff]/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]' 
                    : 'bg-[#11111a] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedAgent.id === agent.id ? 'bg-[#00f2ff] text-[#0a0a0f]' : 'bg-white/5 text-[#94a3b8]'
                  }`}>
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-widest">{agent.name}</h3>
                    <p className="text-xs text-[#94a3b8] mt-1">{agent.role}</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'Active' ? 'bg-[#00ffa3] animate-pulse' : 
                      agent.status === 'Busy' ? 'bg-[#bc13fe]' : 'bg-[#94a3b8]'
                    }`} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Agent Detail / Viewport */}
          <div className="lg:col-span-8 bg-[#11111a] rounded-3xl border border-white/5 overflow-hidden flex flex-col relative">
            {/* Glass Header */}
            <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-[#00f2ff]" />
                <span className="font-bold tracking-widest text-sm">{selectedAgent.name} {'//'} INTERFACE</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><MessageSquare className="w-4 h-4 text-[#94a3b8]" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Info className="w-4 h-4 text-[#94a3b8]" /></button>
              </div>
            </div>

            {/* Main Interface Content */}
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
              <motion.div
                key={selectedAgent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00f2ff] to-[#bc13fe] p-[2px]"
              >
                <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">{selectedAgent.name}</h2>
              <p className="max-w-md text-[#94a3b8] leading-relaxed">
                {selectedAgent.desc} Established neural link via Orchestration Protocol v2.0. Ready for deployment.
              </p>
              <button className="mt-8 px-10 py-3 bg-white text-[#0a0a0f] font-bold rounded-xl hover:bg-[#00f2ff] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                INITIALIZE COMMAND
              </button>
            </div>

            {/* Animated Bottom Scanline */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00f2ff]/30">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent shadow-[0_0_10px_#00f2ff]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
