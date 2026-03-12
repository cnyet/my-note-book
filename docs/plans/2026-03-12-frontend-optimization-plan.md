# Frontend Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Optimize Home, Agents, Tools, Labs, Blog pages with improved spacing, dynamic effects, and enhanced content display.

**Architecture:**
- Home: Add Stats/Features sections, fix footer spacing, implement n8n-style flowing gradient background and paico-style card animations
- Agents/Tools/Labs/Blog: Increase title spacing, add dynamic banner, implement category filtering (Tools), add footer links

**Tech Stack:** Next.js 15.5 + React 19.1 + Tailwind CSS + Framer Motion

---

## Task 1: Create Shared Components

**Files:**
- Create: `frontend/src/components/ui/StatCard.tsx`
- Create: `frontend/src/components/ui/FeatureCard.tsx`
- Create: `frontend/src/components/ui/FooterLinks.tsx`
- Modify: `frontend/src/app/globals.css` (add gradient animations)

### Step 1: Create StatCard component

```tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "amber" | "purple";
}

const colorMap = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  purple: "from-purple-500 to-purple-600",
};

export function StatCard({ value, label, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-3xl font-black text-white">{value}</div>
          <div className="text-sm text-slate-400">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
```

### Step 2: Create FeatureCard component

```tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="relative backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-indigo-500/30 transition-all">
        <Icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
```

### Step 3: Create FooterLinks component

```tsx
"use client";

import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
  description?: string;
}

interface FooterLinksProps {
  title: string;
  links: FooterLinkProps[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <footer className="border-t border-white/10 pt-16 px-6 mt-20 bg-slate-950/50">
      <div className="max-w-[1400px] mx-auto">
        <h3 className="text-lg font-bold text-white mb-8">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                {link.label}
              </div>
              {link.description && (
                <div className="text-xs text-slate-500 mt-1">{link.description}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

### Step 4: Add gradient animations to globals.css

```css
/* Frontend Optimization - Gradient Animations */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

.animate-shimmer {
  animation: shimmer 3s infinite;
}
```

### Step 5: Commit

```bash
git add frontend/src/components/ui/StatCard.tsx frontend/src/components/ui/FeatureCard.tsx frontend/src/components/ui/FooterLinks.tsx frontend/src/app/globals.css
git commit -m "feat(ui): add StatCard, FeatureCard, FooterLinks components"
```

---

## Task 2: Home Page - Fix Footer Spacing

**Files:**
- Modify: `frontend/src/app/(public)/page.tsx:36-40`

### Step 1: Move footer outside ScrollReveal

**Current:**
```tsx
<ScrollReveal direction="up" delay={0.5}>
  <footer className="mt-16 lg:mt-24">
    <CTABanner />
  </footer>
</ScrollReveal>
```

**Change to:**
```tsx
<ScrollReveal direction="up" delay={0.5}>
  <IQAssistantSection />
</ScrollReveal>

{/* Footer - Independent Section */}
<footer className="mt-32 lg:mt-40">
  <CTABanner />
</footer>
```

### Step 2: Commit

```bash
git add frontend/src/app/\(public\)/page.tsx
git commit -m "fix(home): move footer outside ScrollReveal, fix spacing"
```

---

## Task 3: Home Page - Add Dynamic Background

**Files:**
- Create: `frontend/src/components/ui/FlowingBackground.tsx`
- Modify: `frontend/src/app/(public)/page.tsx`

### Step 1: Create FlowingBackground component

```tsx
"use client";

import { useEffect, useRef } from "react";

export function FlowingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Flowing gradient effect
    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create flowing gradient
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width, canvas.height
      );
      gradient.addColorStop(0, `rgba(99, 102, 241, ${0.1 + Math.sin(time) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(168, 85, 247, ${0.1 + Math.cos(time) * 0.05})`);
      gradient.addColorStop(1, `rgba(236, 72, 153, ${0.1 + Math.sin(time + 1) * 0.05})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.001;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
```

### Step 2: Add to Home page

```tsx
import { FlowingBackground } from "@/components/ui/FlowingBackground";

// In component:
<FlowingBackground />
```

### Step 3: Commit

```bash
git add frontend/src/components/ui/FlowingBackground.tsx frontend/src/app/\(public\)/page.tsx
git commit -m "feat(home): add flowing gradient background"
```

---

## Task 4: Home Page - Add Stats Section

**Files:**
- Modify: `frontend/src/app/(public)/page.tsx`
- Import: `@/components/ui/StatCard`

### Step 1: Add Stats section after Hero

```tsx
import { StatCard } from "@/components/ui/StatCard";
import { Users, Activity, Zap, Cpu } from "lucide-react";

// After Hero section:
<section className="py-20">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <StatCard value="10K+" label="Active Users" icon={Users} color="indigo" />
    <StatCard value="99.9%" label="Uptime" icon={Activity} color="emerald" />
    <StatCard value="50x" label="Efficiency Gain" icon={Zap} color="amber" />
    <StatCard value="24/7" label="AI Processing" icon={Cpu} color="purple" />
  </div>
</section>
```

### Step 2: Commit

```bash
git add frontend/src/app/\(public\)/page.tsx
git commit -m "feat(home): add stats section"
```

---

## Task 5: Home Page - Add Features Section

**Files:**
- Modify: `frontend/src/app/(public)/page.tsx`
- Import: `@/components/ui/FeatureCard`

### Step 1: Add Features section after Stats

```tsx
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Brain, Shield, Lightning, Sparkles } from "lucide-react";

<section className="py-20">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-black text-white mb-4">Powerful Features</h2>
    <p className="text-slate-400">Everything you need to automate your workflow</p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <FeatureCard
      icon={Brain}
      title="AI-Powered"
      description="Intelligent automation powered by advanced AI models"
    />
    <FeatureCard
      icon={Shield}
      title="Secure"
      description="Enterprise-grade security with end-to-end encryption"
    />
    <FeatureCard
      icon={Lightning}
      title="Fast"
      description="Lightning-fast processing with optimized infrastructure"
    />
  </div>
</section>
```

### Step 2: Commit

```bash
git add frontend/src/app/\(public\)/page.tsx
git commit -m "feat(home): add features section"
```

---

## Task 6: Home Page - Add Paico-style Card Animation

**Files:**
- Modify: `frontend/src/components/features/home/Hero.tsx` (or relevant Hero component)

### Step 1: Add floating animation to main card

```tsx
<motion.div
  initial={{ opacity: 0, y: 40, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  whileHover={{ y: -8, scale: 1.02 }}
  className="relative max-w-5xl mx-auto backdrop-blur-md bg-white/5 rounded-[40px] p-2 border border-white/10 shadow-2xl group overflow-hidden"
>
  {/* Border shimmer effect */}
  <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />

  {/* Card content */}
  <div className="relative z-10">
    {/* Hero content */}
  </div>
</motion.div>
```

### Step 2: Commit

```bash
git add frontend/src/components/features/home/Hero.tsx
git commit -m "feat(home): add paico-style card animation"
```

---

## Task 7: Agents Page - Update Title Spacing + Add Flow Diagram

**Files:**
- Modify: `frontend/src/app/(public)/agents/page.tsx:74-86`
- Import: Additional lucide icons

### Step 1: Increase title spacing

Change `mb-16` to `mb-24`:

```tsx
<div className="text-center mb-24">
```

### Step 2: Add flow diagram

```tsx
import { Download, BrainCircuit, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// After the subtitle paragraph:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mt-12 flex items-center justify-center gap-4 text-sm text-slate-500 flex-wrap"
>
  <span className="flex items-center gap-2">
    <Download className="w-4 h-4" /> 数据输入
  </span>
  <ArrowRight className="w-4 h-4 text-indigo-400" />
  <span className="flex items-center gap-2">
    <BrainCircuit className="w-4 h-4" /> AI 处理
  </span>
  <ArrowRight className="w-4 h-4 text-indigo-400" />
  <span className="flex items-center gap-2">
    <CheckCircle className="w-4 h-4" /> 智能输出
  </span>
</motion.div>
```

### Step 3: Commit

```bash
git add frontend/src/app/\(public\)/agents/page.tsx
git commit -m "feat(agents): increase title spacing, add flow diagram"
```

---

## Task 8: Agents Page - Add Footer Links

**Files:**
- Modify: `frontend/src/app/(public)/agents/page.tsx`
- Import: `@/components/ui/FooterLinks`

### Step 1: Add footer at end of page

```tsx
import { FooterLinks } from "@/components/ui/FooterLinks";

// At end of page, before closing div:
<FooterLinks
  title="Related AI Tools & Resources"
  links={[
    { href: "https://n8n.io", label: "n8n", description: "工作流自动化" },
    { href: "https://zapier.com", label: "Zapier", description: "应用集成" },
    { href: "https://make.com", label: "Make", description: "可视化自动化" },
    { href: "https://langchain.com", label: "LangChain", description: "AI 应用框架" },
    { href: "https://huggingface.co", label: "Hugging Face", description: "AI 模型平台" },
    { href: "https://ollama.com", label: "Ollama", description: "本地 AI 模型" },
  ]}
/>
```

### Step 2: Commit

```bash
git add frontend/src/app/\(public\)/agents/page.tsx
git commit -m "feat(agents): add footer links"
```

---

## Task 9: Tools Page - Update Title Spacing + Add Dynamic Banner

**Files:**
- Modify: `frontend/src/app/(public)/tools/page.tsx:67-78`

### Step 1: Increase title spacing

Change `mb-16` to `mb-24`:

```tsx
<div className="text-center mb-24">
```

### Step 2: Add dynamic banner

```tsx
import { motion } from "framer-motion";

// After the subtitle paragraph:
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.2 }}
  className="mt-12 relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-8"
>
  <div className="grid grid-cols-3 gap-8 text-center">
    <div>
      <div className="text-4xl font-black text-indigo-400">6+</div>
      <div className="text-sm text-slate-400 mt-1">专业工具</div>
    </div>
    <div>
      <div className="text-4xl font-black text-purple-400">100%</div>
      <div className="text-sm text-slate-400 mt-1">自动化</div>
    </div>
    <div>
      <div className="text-4xl font-black text-pink-400">24/7</div>
      <div className="text-sm text-slate-400 mt-1">持续运行</div>
    </div>
  </div>
</motion.div>
```

### Step 3: Commit

```bash
git add frontend/src/app/\(public\)/tools/page.tsx
git commit -m "feat(tools): increase title spacing, add dynamic banner"
```

---

## Task 10: Tools Page - Add Category Filtering

**Files:**
- Modify: `frontend/src/app/(public)/tools/page.tsx`

### Step 1: Add state for category filter

```tsx
import { useState } from "react";

const [selectedCategory, setSelectedCategory] = useState<string>("all");
```

### Step 2: Define categories and categorize tools

```tsx
interface ToolCard {
  name: string;
  icon: React.ReactNode;
  desc: string;
  iconColor: string;
  category: string;
}

const tools: ToolCard[] = [
  {
    name: "MyNoteBook CLI",
    icon: <Terminal className="w-6 h-6" />,
    desc: "设计系统即代码，一键同步 tokens 和组件",
    iconColor: "group-hover:text-indigo-400",
    category: "cli",
  },
  // ... add category to all tools
];

const categories = [
  { id: "all", label: "全部" },
  { id: "cli", label: "CLI 工具" },
  { id: "design", label: "设计工具" },
  { id: "analytics", label: "分析工具" },
];

const filteredTools = selectedCategory === "all"
  ? tools
  : tools.filter(tool => tool.category === selectedCategory);
```

### Step 3: Add category filter UI

```tsx
{/* Category Filter */}
<div className="flex flex-wrap gap-2 mb-12 justify-center">
  {categories.map((cat) => (
    <button
      key={cat.id}
      onClick={() => setSelectedCategory(cat.id)}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
        selectedCategory === cat.id
          ? "bg-indigo-500 text-white"
          : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {cat.label}
    </button>
  ))}
</div>
```

### Step 4: Group tools by category (alternative approach)

```tsx
{/* Display by category sections */}
{categories.filter(cat => cat.id !== "all").map((category) => (
  <section key={category.id} className="mb-12">
    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
      {/* Category icon */}
      {category.label}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tools.filter(t => t.category === category.id).map((tool) => (
        // Tool card
      ))}
    </div>
  </section>
))}
```

### Step 5: Commit

```bash
git add frontend/src/app/\(public\)/tools/page.tsx
git commit -m "feat(tools): add category filtering"
```

---

## Task 11: Tools Page - Add Footer Links

**Files:**
- Modify: `frontend/src/app/(public)/tools/page.tsx`
- Import: `@/components/ui/FooterLinks`

### Step 1: Add footer

```tsx
<FooterLinks
  title="Related Design Tools & Resources"
  links={[
    { href: "https://tailwindui.com", label: "Tailwind UI", description: "UI 组件库" },
    { href: "https://shadcn.com", label: "shadcn/ui", description: "组件解决方案" },
    { href: "https://framer.com", label: "Framer", description: "交互设计" },
    { href: "https://vercel.com", label: "Vercel", description: "部署平台" },
    { href: "https://nextjs.org", label: "Next.js", description: "React 框架" },
    { href: "https://www.figma.com", label: "Figma", description: "设计工具" },
  ]}
/>
```

### Step 2: Commit

```bash
git add frontend/src/app/\(public\)/tools/page.tsx
git commit -m "feat(tools): add footer links"
```

---

## Task 12: Labs Page - Same Optimization as Tools

**Files:**
- Modify: `frontend/src/app/(public)/labs/page.tsx`

### Steps (same as Tools page):
1. Increase title spacing (`mb-16` → `mb-24`)
2. Add dynamic banner
3. Add footer links

### Commit

```bash
git add frontend/src/app/\(public\)/labs/page.tsx
git commit -m "feat(labs): increase title spacing, add dynamic banner and footer"
```

---

## Task 13: Blog Page - Same Optimization as Tools

**Files:**
- Modify: `frontend/src/app/(public)/blog/page.tsx`

### Steps (same as Tools page):
1. Increase title spacing (`mb-12` → `mb-24`)
2. Add dynamic banner
3. Add footer links

### Commit

```bash
git add frontend/src/app/\(public\)/blog/page.tsx
git commit -m "feat(blog): increase title spacing, add dynamic banner and footer"
```

---

## Task 14: Final Verification

**Files:** All modified pages

### Step 1: Run TypeScript check

```bash
cd frontend
npm run build
```

Expected: Build passes with no errors

### Step 2: Verify all pages

```bash
# Check each page loads correctly
curl -I http://localhost:3001/
curl -I http://localhost:3001/agents
curl -I http://localhost:3001/tools
curl -I http://localhost:3001/labs
curl -I http://localhost:3001/blog
```

Expected: All return 200 OK

### Step 3: Commit final verification

```bash
git commit --allow-empty -m "chore: verify all pages build successfully"
```

---

## Summary of Tasks

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Create shared components | 4 files |
| 2 | Home: Fix footer spacing | 1 file |
| 3 | Home: Add dynamic background | 2 files |
| 4 | Home: Add stats section | 1 file |
| 5 | Home: Add features section | 1 file |
| 6 | Home: Add card animation | 1 file |
| 7 | Agents: Title + flow diagram | 1 file |
| 8 | Agents: Footer links | 1 file |
| 9 | Tools: Title + dynamic banner | 1 file |
| 10 | Tools: Category filtering | 1 file |
| 11 | Tools: Footer links | 1 file |
| 12 | Labs: Same optimization | 1 file |
| 13 | Blog: Same optimization | 1 file |
| 14 | Final verification | - |

**Total:** ~15 files modified/created

---

## Testing Checklist

- [ ] Home page footer spacing is correct
- [ ] Home page flowing background animates smoothly
- [ ] Home page stats section displays correctly
- [ ] Home page features section displays correctly
- [ ] Home page card has hover animation
- [ ] Agents page title has increased spacing
- [ ] Agents page flow diagram displays
- [ ] Agents page footer links display
- [ ] Tools page title has increased spacing
- [ ] Tools page dynamic banner displays
- [ ] Tools page category filter works
- [ ] Tools page footer links display
- [ ] Labs page optimized
- [ ] Blog page optimized
- [ ] All pages build without errors
- [ ] No console errors in browser
