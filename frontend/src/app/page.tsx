'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, Zap, Globe, Cpu } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background Particle Flow (Simplified implementation with SVG/CSS for speed) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_70%)]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight font-[family-name:var(--font-outfit)]">
              THE NEXT GEN OF{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#bc13fe]">
                AGENTIC POWER
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto"
          >
            Orchestrate multiple AI agents seamlessly. Automate complexity.
            Own the future with our high-fidelity multi-agent platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/agents"
              className="group relative px-8 py-4 bg-[#00f2ff] text-[#0a0a0f] font-bold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                DEPLOY AGENTS <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/labs"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
            >
              EXPLORE LABS
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'NEURAL LINK',
              desc: 'Seamless real-time synchronization between disparate AI agents.',
              icon: Zap,
              color: '#00f2ff',
            },
            {
              title: 'DYNAMIC ORCHESTRATION',
              desc: 'Advanced protocol-driven communication for complex task solving.',
              icon: Cpu,
              color: '#bc13fe',
            },
            {
              title: 'SECURE PERSISTENCE',
              desc: 'Long-term memory management with identity-aware isolation.',
              icon: Bot,
              color: '#00ffa3',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-[#11111a] border border-white/5 backdrop-blur-lg hover:border-white/10 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-outfit)]">{feature.title}</h3>
              <p className="text-[#94a3b8] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
