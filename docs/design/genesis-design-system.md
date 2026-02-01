# Work-Agents Design System: GENESIS Edition

> **Theme**: Geek Mastery | **Aesthetics**: Modern, Dark-First, Futuristic
> **Assets**: [frontend/design-assets/pages/](./../frontend/design-assets/pages/)

---

## 🎨 1. Core Visual System

### 1.1 Color Palette
| Token | HEX | CSS Variable | Usage |
| :--- | :--- | :--- | :--- |
| **Abyss** | `#0a0a0f` | `--bg-p` | Primary dark background. |
| **Slate** | `#11111a` | `--bg-s` | Card and section background. |
| **Cyan** | `#00f2ff` | `--primary` | Primary action color, link highlights. |
| **Purple** | `#bc13fe` | `--accent` | Secondary action color, gradient stop. |
| **White** | `#f8f8f8` | `--text-p` | High contrast primary text. |
| **Grey** | `#94a3b8` | `--text-s` | Muted secondary text. |

### 1.2 Typography
- **Primary Typeface**: `Inter` (Sans-serif) for clean UI and body text.
- **Header Typeface**: `Outfit` (Bold) for high-impact headlines.
- **Technical Typeface**: `JetBrains Mono` for code blocks and data metrics.

---

## 🧱 2. Design Tokens

### 2.1 Elevation & Surface
- **Glassmorphism**: 
  - `background: rgba(255, 255, 255, 0.03)`
  - `backdrop-filter: blur(24px)`
  - `border: 1px solid rgba(255, 255, 255, 0.1)`
- **Glow (Cyan)**: `box-shadow: 0 0 20px rgba(0, 242, 255, 0.3)`
- **Glow (Purple)**: `box-shadow: 0 0 20px rgba(188, 19, 254, 0.3)`

### 2.2 Corner Radius
- **SM**: `4px` (Inputs, Small tags)
- **MD**: `8px` (Standard buttons, Small cards)
- **LG**: `16px` (Main cards, Modals)
- **XL**: `24px` (Hero sections, Large containers)

---

## 📱 3. Page Layouts & Specifications

### 3.1 Home (The Gateway)
- **Hero**: Particle field animation (cyan/purple mix). Overlapping typography.
- **Nav**: Fixed glassmorphism bar top. 
- **CTA**: Center-aligned magnetic button with RGB split effect.

### 3.2 Agents (Orchestration Hub)
- **Navigation**: Sidebar tabs with glowing active state indicators.
- **Cards**: Portal-style entrance for LobeChat. Multi-state badges for agents (Online, Busy, Syncing).

### 3.3 Tools (Developer Portal)
- **Search**: Single line technical interface (JetBrains Mono font in input).
- **Grid**: Compact density to allow quick scanning of technical resources.

### 3.4 Labs (Incubator)
- **Glitch Art**: Headlines feature subtle CSS glitch animations on hover.
- **Scanlines**: Light opacity horizontal scanlines overlay to give a 'terminal CRT' feel.

### 3.5 Blog (Technical Docs)
- **Hierarchy**: Left margin gutter for navigation, right sidebar for TOC.
- **Code Blocks**: Terminal-style window decorations (red/yellow/green dots).

---

## 🚀 4. Implementation Guidelines
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4.
- **Components**: Shadcn/UI (Heavily customized with Genesis tokens).
- **Motion**: Framer Motion for particle systems and spring-based transitions.
