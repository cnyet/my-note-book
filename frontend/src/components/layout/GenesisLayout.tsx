'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Terminal, Bot, Zap, Activity, BookOpen, Shield } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'NODE_0', href: '/', icon: Zap },
  { label: 'AGENTS', href: '/agents', icon: Bot },
  { label: 'INVENTORY', href: '/tools', icon: Activity },
  { label: 'LABS', href: '/labs', icon: Terminal },
  { label: 'ARCHIVES', href: '/blog', icon: BookOpen },
]

export default function GenesisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <div className="relative min-h-screen selection:bg-[#00f2ff]/30">
      <div className="genesis-noise" />
      
      {/* Universal Command Bar */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00f2ff] flex items-center justify-center shadow-[0_0_15px_#00f2ff] group-hover:scale-110 transition-transform">
                 <Shield className="w-5 h-5 text-[#0a0a0f]" />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.4em] hidden sm:block">Work Agents // V2.0</span>
           </Link>

          <div className="glass-standard px-8 py-3 rounded-full flex items-center gap-8 shadow-2xl">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 group ${
                  pathname === item.href ? 'text-[#00f2ff]' : 'text-white/40 hover:text-white'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${pathname === item.href ? 'glow-cyan' : ''}`} />
                <span className="hidden md:block">{item.label}</span>
                {pathname === item.href && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#00f2ff]" 
                  />
                )}
              </Link>
            ))}
          </div>

          <Link 
            href="/login" 
            className="glass-standard px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00f2ff] hover:text-[#0a0a0f] transition-all"
          >
            Terminal Access
          </Link>
        </div>
      </nav>

      {/* Primary Viewport */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Dynamic Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-[100] px-6 py-4 pointer-events-none">
        <div className="container mx-auto flex items-center justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">
           <div className="flex items-center gap-4">
              <span>Latency: 22ms</span>
              <div className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse" />
              <span>Identity: [ANONYMOUS_SESSION]</span>
           </div>
           <div>
              Genesis OS // All rights reserved
           </div>
        </div>
      </footer>
    </div>
  )
}
