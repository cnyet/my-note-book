'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, MessageSquare, Box, FlaskConical, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!user) return null

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: Users, label: 'Users' },
    { icon: Box, label: 'Agents' },
    { icon: MessageSquare, label: 'Blog' },
    { icon: FlaskConical, label: 'Labs' },
    { icon: Settings, label: 'Settings' },
  ]

  const stats = [
    { label: 'Active Agents', value: '12', color: '#00f2ff', icon: Box },
    { label: 'Total Users', value: '1,284', color: '#bc13fe', icon: Users },
    { label: 'Blog Posts', value: '45', color: '#00ffa3', icon: MessageSquare },
    { label: 'Memories Stored', value: '15.4k', color: '#ff4d4d', icon: FlaskConical },
  ]

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#11111a] border-r border-white/5 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black text-[#00f2ff] tracking-tighter italic">NEURAL ADMIN</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                item.active ? 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20' : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" />
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">SYSTEM OVERVIEW</h1>
            <p className="text-[#94a3b8] italic text-sm">Synchronized with Node 0-Alpha. Operator: {user.full_name || user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-[#00ffa3]/10 border border-[#00ffa3]/20 rounded-lg text-[#00ffa3] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
              CORE STATUS: OPERATIONAL
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-[#11111a]/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              <div className="relative z-10">
                <p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-black font-[family-name:var(--font-outfit)]" style={{ color: stat.color }}>{stat.value}</p>
                  <stat.icon className="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 blur-[60px] opacity-20" style={{ backgroundColor: stat.color }} />
            </motion.div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-3xl bg-[#11111a]/60 border border-white/5 p-8 relative overflow-hidden backdrop-blur-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-sm tracking-[0.3em] uppercase">Neural Frequency Trace</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-[2px] bg-[#00f2ff]" />
                <span className="text-[10px] font-bold text-[#94a3b8]">LIVE BYTES</span>
              </div>
            </div>
            
            {/* Animated SVG Chart Placeholder */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <motion.path
                  d="M0,100 Q100,50 200,120 T400,80 T600,150 T800,40 T1000,100"
                  fill="none"
                  stroke="#00f2ff"
                  strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M0,100 Q100,50 200,120 T400,80 T600,150 T800,40 T1000,100 V200 H0 Z"
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Scanline */}
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-[#00f2ff]/5 to-transparent pointer-events-none"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-[#11111a]/60 border border-white/5 p-8 backdrop-blur-3xl">
            <h3 className="font-black text-sm tracking-[0.3em] uppercase mb-8">Recent Subsystems</h3>
            <div className="space-y-6">
              {[
                { name: 'Core Engine', status: 'Stable', color: '#00ffa3' },
                { name: 'Auth Node', status: 'Active', color: '#00f2ff' },
                { name: 'Memory Bus', status: 'Busy', color: '#bc13fe' },
                { name: 'Vector Store', status: 'Synced', color: '#00ffa3' },
              ].map((sub) => (
                <div key={sub.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-crosshair">
                  <span className="text-xs font-bold tracking-widest">{sub.name}</span>
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded" style={{ backgroundColor: `${sub.color}20`, color: sub.color }}>{sub.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
