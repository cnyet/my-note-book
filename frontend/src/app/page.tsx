"use client";

import { StandardFooter } from "@/components/common/StandardFooter";

import {
  Box,
  ChevronRight,
  CpuIcon,
  EyeOff,
  Fingerprint,
  Github,
  Linkedin,
  Lock,
  MousePointer2,
  ShieldCheck,
  Twitter,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

const Logo = () => (
  <Link href="/" className="flex items-center gap-3 group cursor-pointer">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-80 blur-[2px]"></div>
      <div className="absolute inset-0 bg-slate-950 rounded-xl flex items-center justify-center border border-white/20">
        <div className="w-4 h-4 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-sm rotate-45 group-hover:scale-110 transition-transform"></div>
      </div>
    </div>
    <span className="font-black text-2xl tracking-tighter text-white">
      MyNoteBook
    </span>
  </Link>
);

// --- Shared Components ---

const SectionHeader = ({
  title,
  subtitle,
  tag,
  centered = false,
}: {
  title: string;
  subtitle: string;
  tag?: string;
  centered?: boolean;
}) => (
  <div
    className={`max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ${centered ? "mx-auto text-center" : ""}`}
  >
    {tag && (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6`}
      >
        {tag}
      </div>
    )}
    <h2
      className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white"
      dangerouslySetInnerHTML={{ __html: title }}
    ></h2>
    <p
      className={`text-slate-400 text-xl md:text-2xl font-medium leading-relaxed ${centered ? "mx-auto" : ""} max-w-2xl`}
    >
      {subtitle}
    </p>
  </div>
);

// --- Page Views ---

const HomeView = () => {
  const mounted = useMounted();

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
          The ultimate notebook for the AI era. Orchestrate specialized agents
          and high-performance tools in one unified workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="w-full sm:w-auto bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-white/5">
            Launch Notebook <Zap size={22} className="fill-current" />
          </button>
          <button className="w-full sm:w-auto backdrop-blur-md bg-white/5 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3 text-white">
            Explore Ecosystem <MousePointer2 size={22} />
          </button>
        </div>

        <div className="mt-24 relative px-4">
          <div className="max-w-6xl mx-auto backdrop-blur-md bg-white/5 rounded-[48px] p-3 border border-white/10 shadow-3xl group relative overflow-hidden">
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
      <section className="relative py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              Engineered for Speed
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              Zero Lag. <br />
              Infinite Flow.
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-lg">
              Our proprietary rendering engine processes billions of design
              tokens per second. Experience a fluid workspace that responds as
              fast as you think.
            </p>
            <div className="flex flex-wrap gap-10 pt-4">
              <div className="flex flex-col">
                <span className="text-5xl font-black text-white">0.02ms</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                  Input Latency
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl font-black text-white">120Hz</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                  Native Refresh
                </span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
            <div className="relative backdrop-blur-md bg-white/5 aspect-square rounded-[80px] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute w-64 h-64 border-[1px] border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute w-80 h-80 border-[1px] border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute w-96 h-96 border-[1px] border-pink-500/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="relative bg-slate-900 w-32 h-32 rounded-[40px] flex items-center justify-center border border-white/20 shadow-2xl z-20 group-hover:scale-110 transition-transform">
                  <CpuIcon size={48} className="text-indigo-400" />
                </div>
                {mounted &&
                  [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-pulse blur-[1px]"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Security & Privacy */}
      <section className="py-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 rounded-[80px] p-16 md:p-32 border border-white/5 flex flex-col lg:flex-row items-center gap-20 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px]"></div>
          <div className="lg:w-1/2 space-y-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Lock size={28} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Your Data. <br />
              Isolated.
            </h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Security isn't a feature; it's our foundation. Every notebook
              instance runs in a strictly isolated sandbox with end-to-end
              encryption by default.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: <ShieldCheck size={18} />,
                  text: "SOC2 Type II Certified Infrastructure",
                },
                {
                  icon: <Fingerprint size={18} />,
                  text: "Biometric & MFA Hardware Support",
                },
                {
                  icon: <EyeOff size={18} />,
                  text: "Zero-Knowledge Data Residency",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-300 font-bold"
                >
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
                <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-bounce">
                  <ShieldCheck size={48} />
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-1.5 rounded-full bg-white/10"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-12">
        <SectionHeader
          centered
          tag="Methodology"
          title="Designed to <br/>Evolve."
          subtitle="A cycle of continuous improvement driven by feedback and autonomous learning."
        />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
          {[
            {
              step: "01",
              name: "Inception",
              desc: "AI scans your intent and drafts core concepts.",
            },
            {
              step: "02",
              name: "Iteration",
              desc: "Rapid prototyping across all devices instantly.",
            },
            {
              step: "03",
              name: "Validation",
              desc: "Agents perform accessibility and user audits.",
            },
            {
              step: "04",
              name: "Deployment",
              desc: "Production-ready assets synced to your git.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative backdrop-blur-md bg-white/5 p-10 rounded-[40px] border border-white/5 group hover:bg-indigo-600 transition-all duration-500 overflow-hidden"
            >
              <span className="text-5xl font-black text-white/5 absolute top-4 right-4 group-hover:text-white/20 transition-colors">
                {item.step}
              </span>
              <h4 className="text-2xl font-black text-white mb-4 group-hover:translate-x-2 transition-transform">
                {item.name}
              </h4>
              <p className="text-slate-500 font-medium group-hover:text-indigo-100 transition-colors leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                <ChevronRight className="text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IQ Assistant Chat */}
      <section className="mt-16 backdrop-blur-md bg-white/5 rounded-[60px] p-8 md:p-20 border border-white/10 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-10 text-indigo-400 border border-indigo-500/20">
              <Zap size={32} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-white">
              Ask IQ Assistant.
            </h2>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
              Our Gemini-powered assistant is available across the platform to
              help you build faster and smarter.
            </p>
          </div>

          <div className="bg-slate-950/80 rounded-[40px] border border-white/10 h-[450px] flex flex-col shadow-2xl relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <p className="text-lg font-bold text-slate-400 italic">
                  "How can I improve my typography hierarchy?"
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Enter design prompt..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                />
                <button className="absolute right-3 p-3 bg-indigo-500 text-white rounded-xl">
                  <Box size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-32 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[60px] p-16 md:p-32 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-white leading-[0.9]">
            Ready to <br />
            Transform?
          </h2>
          <button className="bg-white text-slate-950 px-12 py-6 rounded-[24px] font-black text-2xl hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-black/20">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen relative selection:bg-indigo-500 selection:text-white">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
      </div>

      <main className="pt-40 px-6 pb-20 max-w-7xl mx-auto">
        <HomeView />
      </main>

      {/* Standard Footer */}
      <footer className="border-t border-white/10 py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-16">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="text-slate-500 text-lg leading-relaxed mt-8 mb-10 max-w-sm">
              The world&apos;s first AI-native notebook for modern creative
              teams and engineers.
            </p>
            <div className="flex items-center gap-6 text-slate-400">
              <Twitter
                size={24}
                className="hover:text-white cursor-pointer transition-colors"
              />
              <Github
                size={24}
                className="hover:text-white cursor-pointer transition-colors"
              />
              <Linkedin
                size={24}
                className="hover:text-white cursor-pointer transition-colors"
              />
            </div>
          </div>

          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">
              Product
            </h4>
            <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
              {[
                { name: "Home", href: "/" },
                { name: "Agents", href: "/agents" },
                { name: "Tools", href: "/tools" },
                { name: "Labs", href: "/labs" },
                { name: "Blogs", href: "/blog" },
              ].map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">
              Ecosystem
            </h4>
            <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
              <li className="hover:text-white cursor-pointer transition-colors">
                Documentation
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Showcase
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Status
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">
              Studio
            </h4>
            <ul className="space-y-5 text-slate-500 text-[14px] font-bold">
              <li className="hover:text-white cursor-pointer transition-colors">
                Careers
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Contact
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Legal
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <StandardFooter />
    </div>
  );
}
