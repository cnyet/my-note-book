import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Palette, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Zap, 
  MousePointer2, 
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  Send,
  Camera,
  Bot,
  Wand2,
  Code2,
  Globe,
  FlaskConical,
  Terminal,
  Activity,
  Search,
  Box,
  BrainCircuit,
  Radio,
  Share2,
  CpuIcon,
  ShieldCheck,
  History,
  Mail,
  ZapOff,
  Star,
  Zap as ZapIcon,
  ChevronRight,
  Plus,
  Lock,
  Fingerprint,
  EyeOff
} from 'lucide-react';
import { geminiService } from './services/geminiService';
import { ChatMessage } from './types';

// Types for navigation
type ViewType = 'home' | 'agents' | 'tools' | 'labs' | 'blogs';

// --- Shared Components ---

const Logo = ({ onClick }: { onClick: () => void }) => (
  <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-80 blur-[2px]"></div>
      <div className="absolute inset-0 bg-slate-950 rounded-xl flex items-center justify-center border border-white/20">
        <div className="w-4 h-4 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-sm rotate-45 group-hover:scale-110 transition-transform"></div>
      </div>
    </div>
    <span className="font-black text-2xl tracking-tighter text-white">MyNoteBook</span>
  </div>
);

const Navbar = ({ currentView, setView }: { currentView: ViewType, setView: (v: ViewType) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks: { name: string, id: ViewType }[] = [
    { name: 'Home', id: 'home' },
    { name: 'Agents', id: 'agents' },
    { name: 'Tools', id: 'tools' },
    { name: 'Labs', id: 'labs' },
    { name: 'Blogs', id: 'blogs' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-center">
      <div className="w-full max-w-6xl glass rounded-full px-8 py-3 flex items-center justify-between border-white/10 shadow-2xl">
        <Logo onClick={() => setView('home')} />
        
        <div className="hidden lg:flex items-center gap-8 font-semibold text-[13px] uppercase tracking-widest">
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => { setView(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`transition-colors duration-300 relative py-1 ${currentView === link.id ? 'text-white font-black' : 'text-slate-400 hover:text-white'}`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button className="text-slate-400 hover:text-white font-bold text-sm transition-colors">
            Sign in
          </button>
          <button className="bg-white/10 hover:bg-white text-white hover:text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm transition-all border border-white/10 active:scale-95">
            Dashboard
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-24 left-6 right-6 glass rounded-[32px] p-8 flex flex-col gap-6 md:hidden border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => { setView(link.id); setIsOpen(false); window.scrollTo(0, 0); }}
              className={`text-xl font-bold text-left ${currentView === link.id ? 'text-indigo-400' : 'text-slate-200 hover:text-indigo-400'}`}
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
             <button className="w-full text-slate-400 font-bold py-2">Sign in</button>
             <button className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20">
               Dashboard
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const SectionHeader = ({ title, subtitle, tag, centered = false }: { title: string, subtitle: string, tag?: string, centered?: boolean }) => (
  <div className={`max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ${centered ? 'mx-auto text-center' : ''}`}>
    {tag && (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6`}>
        {tag}
      </div>
    )}
    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white" dangerouslySetInnerHTML={{ __html: title }}></h2>
    <p className={`text-slate-400 text-xl md:text-2xl font-medium leading-relaxed ${centered ? 'mx-auto' : ''} max-w-2xl`}>{subtitle}</p>
  </div>
);

// --- Unique View Footers ---

const AgentsFooter = () => (
  <footer className="mt-40 border-t border-white/10 py-16 px-6 glass rounded-t-[60px]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="text-left">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Expand Your Workforce</h3>
        <p className="text-slate-500 font-medium">MyNoteBook Agents are updated weekly with new capabilities.</p>
      </div>
      <div className="flex gap-4">
        <button className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">Join as Agent</button>
        <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">Marketplace API</button>
      </div>
    </div>
  </footer>
);

const ToolsFooter = () => (
  <footer className="mt-40 py-20 bg-slate-900/50 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
      <div className="space-y-4">
        <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">Development</h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors">CLI Documentation</li>
          <li className="hover:text-white cursor-pointer transition-colors">SDK Reference</li>
          <li className="hover:text-white cursor-pointer transition-colors">GitHub Repository</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h4 className="font-bold text-purple-400 uppercase tracking-widest text-[10px]">Tokens</h4>
        <ul className="space-y-2 text-slate-500 font-medium">
          <li className="hover:text-white cursor-pointer transition-colors">Tailwind Config</li>
          <li className="hover:text-white cursor-pointer transition-colors">Figma Plugin</li>
          <li className="hover:text-white cursor-pointer transition-colors">Asset Manager</li>
        </ul>
      </div>
      <div className="col-span-2 flex justify-end items-center gap-4">
        <span className="text-slate-500 font-bold">Latest v2.4.12:</span>
        <code className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs border border-emerald-500/20">Stable Build</code>
      </div>
    </div>
  </footer>
);

const LabsFooter = () => (
  <footer className="mt-40 py-32 bg-black flex flex-col items-center justify-center text-center">
    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-8 animate-pulse">
      <FlaskConical size={20} className="text-white/40" />
    </div>
    <h3 className="text-white text-xl font-bold tracking-widest uppercase mb-4">Stay Curious</h3>
    <p className="text-slate-600 max-w-sm">Labs projects are experimental. Users assume all responsibility for implementation in production.</p>
    <div className="mt-12 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">Proprietary Research Unit</div>
  </footer>
);

const BlogsFooter = () => (
  <footer className="mt-40 py-24 px-6 glass border-t border-indigo-500/20">
    <div className="max-w-4xl mx-auto text-center space-y-10">
      <h2 className="text-4xl md:text-6xl font-black text-white leading-none">The Morning Brief.</h2>
      <p className="text-slate-400 text-lg font-medium">Join 25,000+ design engineers who receive our bi-weekly breakdown of the AI landscape.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <input type="email" placeholder="email@address.com" className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white w-full sm:max-w-xs focus:outline-none focus:border-indigo-500/50" />
        <button className="px-10 py-5 rounded-2xl bg-white text-black font-black hover:bg-indigo-50 transition-all">Subscribe Now</button>
      </div>
    </div>
  </footer>
);

// --- Page Views ---

const HomeView = () => {
  return (
    <div className="animate-in fade-in duration-1000 space-y-40">
      {/* Hero Section */}
      <section className="text-center relative pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Intelligent Workflow Suite
        </div>
        <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85] text-white">
          Build Beyond <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Imagination
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          The ultimate notebook for the AI era. Orchestrate specialized agents and high-performance tools in one unified workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="w-full sm:w-auto bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-white/5">
            Launch Notebook <Zap size={22} className="fill-current" />
          </button>
          <button className="w-full sm:w-auto glass px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3">
            Explore Ecosystem <MousePointer2 size={22} />
          </button>
        </div>

        <div className="mt-24 relative px-4">
          <div className="max-w-6xl mx-auto glass rounded-[48px] p-3 border-white/10 shadow-3xl glow group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 z-10 pointer-events-none"></div>
             <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000" 
              alt="App Interface" 
              className="rounded-[40px] w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Feature: Performance Core */}
      <section className="relative py-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              Engineered for Speed
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">Zero Lag. <br/>Infinite Flow.</h2>
            <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-lg">
              Our proprietary rendering engine processes billions of design tokens per second. Experience a fluid workspace that responds as fast as you think.
            </p>
            <div className="flex flex-wrap gap-10 pt-4">
              <div className="flex flex-col">
                <span className="text-5xl font-black text-white">0.02ms</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Input Latency</span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl font-black text-white">120Hz</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Native Refresh</span>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
            <div className="relative glass aspect-square rounded-[80px] border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
               <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute w-64 h-64 border-[1px] border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute w-80 h-80 border-[1px] border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute w-96 h-96 border-[1px] border-pink-500/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                  <div className="relative bg-slate-900 w-32 h-32 rounded-[40px] flex items-center justify-center border border-white/20 shadow-2xl z-20 group-hover:scale-110 transition-transform">
                    <CpuIcon size={48} className="text-indigo-400" />
                  </div>
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-pulse blur-[1px]"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Partner Marquee */}
      <section className="py-20 overflow-hidden">
        <div className="text-center mb-16">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Integrated with Industry Leaders</p>
        </div>
        <div className="flex gap-20 animate-[marquee_30s_linear_infinite] whitespace-nowrap items-center">
          {['Stripe', 'Figma', 'Linear', 'Github', 'OpenAI', 'Google'].map((name, idx) => (
            <div key={idx} className="flex items-center gap-4 text-slate-600 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-50 hover:opacity-100 px-10">
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                 <Box size={20} />
               </div>
               <span className="text-3xl font-black tracking-tight">{name}</span>
            </div>
          ))}
          {['Stripe', 'Figma', 'Linear', 'Github', 'OpenAI', 'Google'].map((name, idx) => (
            <div key={idx + 6} className="flex items-center gap-4 text-slate-600 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-50 hover:opacity-100 px-10">
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                 <Box size={20} />
               </div>
               <span className="text-3xl font-black tracking-tight">{name}</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* NEW SECTION: Security & Privacy */}
      <section className="py-20 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto glass rounded-[80px] p-16 md:p-32 border-white/5 flex flex-col lg:flex-row items-center gap-20 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px]"></div>
            <div className="lg:w-1/2 space-y-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Lock size={28} />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Your Data. <br/>Isolated.</h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                Security isn't a feature; it's our foundation. Every notebook instance runs in a strictly isolated sandbox with end-to-end encryption by default.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: <ShieldCheck size={18} />, text: "SOC2 Type II Certified Infrastructure" },
                  { icon: <Fingerprint size={18} />, text: "Biometric & MFA Hardware Support" },
                  { icon: <EyeOff size={18} />, text: "Zero-Knowledge Data Residency" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-300 font-bold">
                    <span className="text-indigo-500">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 flex justify-center relative">
               <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse"></div>
                  <div className="relative h-full w-full bg-slate-950/80 rounded-[60px] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-3xl">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                     <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-[bounce_3s_infinite]">
                        <ShieldCheck size={48} />
                     </div>
                     <div className="mt-10 grid grid-cols-3 gap-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-12 h-1.5 rounded-full bg-white/10"></div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Interactive Process Section */}
      <section className="py-20">
        <SectionHeader 
          centered
          tag="Methodology"
          title="Designed to <br/>Evolve."
          subtitle="A cycle of continuous improvement driven by feedback and autonomous learning."
        />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
          {[
            { step: "01", name: "Inception", desc: "AI scans your intent and drafts core concepts." },
            { step: "02", name: "Iteration", desc: "Rapid prototyping across all devices instantly." },
            { step: "03", name: "Validation", desc: "Agents perform accessibility and user audits." },
            { step: "04", name: "Deployment", desc: "Production-ready assets synced to your git." }
          ].map((item, idx) => (
            <div key={idx} className="relative glass p-10 rounded-[40px] border-white/5 group hover:bg-indigo-600 transition-all duration-500 overflow-hidden">
              <span className="text-5xl font-black text-white/5 absolute top-4 right-4 group-hover:text-white/20 transition-colors">{item.step}</span>
              <h4 className="text-2xl font-black text-white mb-4 group-hover:translate-x-2 transition-transform">{item.name}</h4>
              <p className="text-slate-500 font-medium group-hover:text-indigo-100 transition-colors leading-relaxed">{item.desc}</p>
              <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 transition-transform">
                <ChevronRight className="text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AgentsView = () => (
  <div className="animate-in fade-in slide-in-from-right-8 duration-700 py-10 min-h-[60vh]">
    <SectionHeader 
      centered
      tag="Personnel"
      title="Autonomous <br/>Design Agents."
      subtitle="The world's most capable design workforce. Hire AI specialists for every part of your creative stack."
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { 
          name: "Archon", 
          role: "System Architect", 
          icon: <Box className="text-indigo-400" />, 
          status: "Available",
          capabilities: ["Component Logic", "Documentation", "Token Strategy"]
        },
        { 
          name: "Lexa", 
          role: "UX Researcher", 
          icon: <Search className="text-purple-400" />, 
          status: "Online",
          capabilities: ["User Journeys", "Competitor Analysis", "Accessibility"]
        },
        { 
          name: "Koda", 
          role: "Motion Engineer", 
          icon: <Activity className="text-pink-400" />, 
          status: "Occupied",
          capabilities: ["Framing", "Easing Optimization", "Lottie Export"]
        },
        { 
          name: "Vira", 
          role: "Brand Alchemist", 
          icon: <Palette className="text-orange-400" />, 
          status: "Online",
          capabilities: ["Moodboards", "Color Science", "Logo Evolution"]
        },
        { 
          name: "Nova", 
          role: "Data Visualization", 
          icon: <Globe className="text-cyan-400" />, 
          status: "Ready",
          capabilities: ["Interactive Charts", "Complex Datasets", "SVG Generation"]
        },
        { 
          name: "Sudo", 
          role: "Design Engineer", 
          icon: <Code2 className="text-emerald-400" />, 
          status: "Idle",
          capabilities: ["React Prototype", "Storybook Sync", "CSS-in-JS"]
        }
      ].map((agent) => (
        <div key={agent.name} className="glass p-8 rounded-[40px] border-white/5 group hover:border-indigo-500/40 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-indigo-500/10">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500 transition-all">
              {agent.icon}
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              agent.status === 'Online' || agent.status === 'Available' || agent.status === 'Ready'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            }`}>
              {agent.status}
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-1">{agent.name}</h3>
          <p className="text-indigo-400 font-bold text-sm mb-6 uppercase tracking-wider">{agent.role}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {agent.capabilities.map(cap => (
              <span key={cap} className="text-[10px] font-bold text-slate-500 border border-white/10 px-2 py-1 rounded-lg">
                {cap}
              </span>
            ))}
          </div>
          <div className="mt-auto">
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white hover:text-slate-950 transition-all">
              Consult Agent
            </button>
          </div>
        </div>
      ))}
    </div>
    <AgentsFooter />
  </div>
);

const ToolsView = () => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-10 min-h-[60vh]">
    <SectionHeader 
      centered
      tag="Toolkit"
      title="The Pro-Grade <br/>Utility Stack."
      subtitle="Powerful modules designed to integrate seamlessly into your design environment."
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
      <div className="glass p-12 rounded-[50px] border-white/5 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/30">
          <Terminal size={32} />
        </div>
        <h3 className="text-4xl font-black text-white mb-6">MyNoteBook CLI</h3>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          The industry's first design-system-as-code CLI. Sync tokens, components, and assets across your entire repo with a single command.
        </p>
        <div className="bg-black/50 p-6 rounded-2xl font-mono text-sm text-indigo-300 border border-white/5 mb-8">
          <span className="text-slate-500">$</span> mynotebook sync --all --force
        </div>
        <button className="flex items-center gap-3 text-indigo-400 font-bold hover:text-white transition-colors">
          View Documentation <ArrowRight size={18} />
        </button>
      </div>
      
      <div className="glass p-12 rounded-[50px] border-white/5 group hover:border-purple-500/30 transition-all">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/30">
          <Layers size={32} />
        </div>
        <h3 className="text-4xl font-black text-white mb-6">Component Studio</h3>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          A visual playground to build high-fidelity React components using AI-assisted layout and styling. Real-time code output.
        </p>
        <button className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all">
          Open Studio
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { name: "Visual Diff", icon: <Layout />, desc: "Find layout regressions" },
        { name: "Flow Audit", icon: <Activity />, desc: "Map user journeys" },
        { name: "Asset Baker", icon: <Cpu />, desc: "Optimize images" },
        { name: "Type Genius", icon: <Wand2 />, desc: "AI typography" },
      ].map((tool, i) => (
        <div key={i} className="glass p-8 rounded-[32px] border-white/5 hover:bg-white/5 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 mb-6">
            {tool.icon}
          </div>
          <h4 className="font-bold text-white mb-2">{tool.name}</h4>
          <p className="text-slate-500 text-xs">{tool.desc}</p>
        </div>
      ))}
    </div>
    <ToolsFooter />
  </div>
);

const LabsView = () => (
  <div className="animate-in fade-in slide-in-from-top-8 duration-700 py-10 min-h-[60vh]">
    <SectionHeader 
      centered
      tag="Experimental"
      title="The Future <br/>Canvas."
      subtitle="Where we break boundaries. MyNoteBook Labs is our research wing for emerging interfaces."
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative group overflow-hidden rounded-[60px] glass p-16 border-white/10 hover:border-cyan-500/30 transition-all h-[600px] flex flex-col justify-end">
        <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:opacity-100 transition-all duration-1000">
          <BrainCircuit size={300} className="text-cyan-500" />
        </div>
        <div className="relative z-10">
          <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest w-fit mb-6">
            Project: Synapse
          </div>
          <h3 className="text-5xl font-black text-white mb-6">Neural Design Sync</h3>
          <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-sm">
            Draft interfaces at the speed of thought using our next-gen brain-computer interface mapping.
          </p>
          <button className="flex items-center gap-4 text-cyan-400 font-bold hover:gap-6 transition-all">
            Join Waitlist <ArrowRight />
          </button>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[60px] glass p-16 border-white/10 hover:border-pink-500/30 transition-all h-[600px] flex flex-col justify-end">
        <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:opacity-100 transition-all duration-1000">
          <Radio size={300} className="text-pink-500" />
        </div>
        <div className="relative z-10">
          <div className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-black text-pink-400 uppercase tracking-widest w-fit mb-6">
            Project: Echo
          </div>
          <h3 className="text-5xl font-black text-white mb-6">Ambient Layouts</h3>
          <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-sm">
            Interfaces that adapt in real-time to the user's surrounding environment and emotional state.
          </p>
          <button className="flex items-center gap-4 text-pink-400 font-bold hover:gap-6 transition-all">
            Read Whitepaper <ArrowRight />
          </button>
        </div>
      </div>
    </div>
    <LabsFooter />
  </div>
);

const BlogsView = () => (
  <div className="animate-in fade-in duration-700 py-10 min-h-[60vh]">
    <SectionHeader 
      centered
      tag="Editorial"
      title="Insights & <br/>Breakthroughs."
      subtitle="The latest thoughts from our design leads on AI, creativity, and the future of engineering."
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {[
        {
          title: "The Death of the Static Handoff.",
          author: "Julian Thorne",
          date: "Oct 12, 2024",
          category: "Philosophy",
          image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Fine-tuning Gemini 3 for Visual Critique.",
          author: "Sarah Chen",
          date: "Oct 05, 2024",
          category: "Technical",
          image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Why Color Science is the Next Frontier.",
          author: "Marcus Voss",
          date: "Sep 28, 2024",
          category: "Design",
          image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
        },
        {
          title: "Scaling Design Systems with AI Agents.",
          author: "Elara Moon",
          date: "Sep 15, 2024",
          category: "Case Study",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000"
        }
      ].map((post, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="overflow-hidden rounded-[40px] mb-8 glass border-white/5 aspect-video">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{post.date}</span>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight mb-6 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                {post.author[0]}
              </div>
              <span className="text-sm font-bold text-slate-400">{post.author}</span>
            </div>
            <Share2 size={16} className="text-slate-600 hover:text-white transition-colors" />
          </div>
        </div>
      ))}
    </div>
    <BlogsFooter />
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const feedback = await geminiService.generateDesignFeedback(input);
    setMessages(prev => [...prev, { role: 'model' as const, text: feedback }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen relative selection:bg-indigo-500 selection:text-white bg-[#020617]">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-blob animation-delay-2000"></div>
      </div>

      <Navbar currentView={view} setView={setView} />

      <main className="pt-40 px-6 pb-20 max-w-7xl mx-auto">
        {view === 'home' && <HomeView />}
        {view === 'agents' && <AgentsView />}
        {view === 'tools' && <ToolsView />}
        {view === 'labs' && <LabsView />}
        {view === 'blogs' && <BlogsView />}

        {/* Global AI Chat (Persistent on Home) */}
        {view === 'home' && (
          <section className="mt-32 glass rounded-[60px] p-8 md:p-20 border-white/10 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="text-left">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-white">Ask IQ Assistant.</h2>
                <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
                  Our Gemini-powered assistant is available across the platform to help you build faster and smarter.
                </p>
              </div>

              <div className="bg-slate-950/80 rounded-[40px] border border-white/10 h-[450px] flex flex-col shadow-2xl relative">
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                      <p className="text-lg font-bold text-slate-400 italic">"How can I improve my typography hierarchy?"</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                        m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-bl-none flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-300"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="relative flex items-center">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Enter design prompt..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                    <button onClick={handleSend} className="absolute right-3 p-3 bg-indigo-500 text-white rounded-xl">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner (Home only) */}
        {view === 'home' && (
          <section className="mt-32 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[60px] p-16 md:p-32 text-center relative overflow-hidden group shadow-3xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-white leading-[0.9]">Ready to <br />Transform?</h2>
              <button className="bg-white text-slate-950 px-12 py-6 rounded-[24px] font-black text-2xl hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-black/20">
                Start Free Trial
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Standard Footer (Only for Home) */}
      {view === 'home' && (
        <footer className="border-t border-white/10 py-24 px-6 bg-slate-950/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-16">
            <div className="col-span-1 md:col-span-2">
              <Logo onClick={() => setView('home')} />
              <p className="text-slate-500 text-lg leading-relaxed mt-8 mb-10 max-w-sm">
                The world's first AI-native notebook for modern creative teams and engineers.
              </p>
              <div className="flex items-center gap-6 text-slate-400">
                <Twitter size={24} className="hover:text-white cursor-pointer transition-colors" />
                <Github size={24} className="hover:text-white cursor-pointer transition-colors" />
                <Linkedin size={24} className="hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">Product</h4>
              <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
                {['Home', 'Agents', 'Tools', 'Labs', 'Blogs'].map(l => (
                  <li key={l} className="hover:text-white cursor-pointer transition-colors" onClick={() => { setView(l.toLowerCase() as ViewType); window.scrollTo(0, 0); }}>{l}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">Ecosystem</h4>
              <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
                <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-white cursor-pointer transition-colors">Showcase</li>
                <li className="hover:text-white cursor-pointer transition-colors">Status</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">Studio</h4>
              <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-white cursor-pointer transition-colors">Legal</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">© 2024 MyNoteBook Studio. Built with Intelligence.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;