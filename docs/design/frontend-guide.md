# 前端 UI/UX 设计指导

> My-Note-Book 前端设计系统与开发规范

## 📋 目录

1. [设计系统概述](#设计系统概述)
2. [色彩系统](#色彩系统)
3. [字体规范](#字体规范)
4. [布局原则](#布局原则)
5. [组件规范](#组件规范)
6. [动效设计](#动效设计)
7. [响应式设计](#响应式设计)
8. [可访问性](#可访问性)
9. [最佳实践](#最佳实践)

---

## 设计系统概述

### Genesis Design System (极客赛博 / 未来主义简约)

My-Note-Book 采用 **Genesis Design System** - 专为开发者和 AI 工程师设计的 UI 框架。它融合了**赛博朋克 (Cyberpunk)** 的视觉冲突力与**现代简约主义**的结构感，营造出一个“高科技实验室”般的沉浸式工作空间。

**设计特征 (Design DNA)**:

- **深邃底色 (Deep Foundation)** - 使用 Abyss Black 和 Void 建立高对比度暗色基底。
- **霓虹导视 (Neon Guidance)** - 电光青与霓虹紫的交织，引导视线并区分功能边界。
- **高级玻璃态 (Glassmorphism Pro)** - 具有极其细微边框和内发光的磨砂面。
- **物理动效 (Spring Mechanics)** - 模拟真实物理反馈的弹簧运动引擎。
- **故障美学 (Glitch Tech)** - 适度的视觉抖动，强调 AI 系统的动态运行感。

### 技术栈

| 技术           | 用途                                              |
| -------------- | ------------------------------------------------- |
| Next.js 15.5   | 核心框架 (App Router)                             |
| React 19.1     | UI 库 (Server Components)                         |
| Tailwind CSS 3 | 原子化样式 (Config-driven)                        |
| Shadcn/UI      | 基础组件库                                        |
| v-ui           | 内部 UI 系统 (定制化 Genesis 组件)，基于Shadcn/UI |
| Framer Motion  | 交互动效                                          |
| Lucide React   | 图标系统                                          |

---

## UI 验证流程 (UI Verification Protocol)

为了确保前端实现与设计意图的高度一致，所有 UI 开发必须遵循以下验证流程：

1. **设计资产参考**: 开发者必须首先查阅 `frontend/design-assets/` 目录下的高保真原型和组件设计稿。
2. **规范检查**: 确保使用的颜色、间距和字体严格符合本文档定义的 **Genesis Design System** 令牌。
3. **组件对齐**: 优先使用 `v-ui` 中的预设组件。如果需要新建组件，必须在 `design.md` 中记录其设计逻辑。
4. **Agent 协同校验**: 实施 AI (Sisyphus) 在进入设计阶段前，**必须优先启动** `ui-ux-pro-max-skill` 以获取专业视觉指导。在完成 UI 编写后，应调用 `frontend-ui-ux` 技能进行自查，对比代码与设计稿的视觉偏差。

---

## 内部组件库 (v-ui) 规范

`v-ui` 是本项目的灵魂，所有页面必须优先调用以下高阶组件：

1. **GlassCard**: 磨砂玻璃卡片。
   - `bg-surface/70`, `backdrop-blur-xl`, `border-white/10`。
   - 带有内发光效果 `shadow-glass-border`。

2. **GlitchText**: 故障文字动效。
   - 用于强调 AI 状态、关键标题或 Hover 反馈。
   - 原理：多层文字重叠位移偏移。

3. **NeonButton**: 霓虹发光按钮。
   - 具有 `box-shadow: 0 0 20px var(--primary-glow)`。
   - 悬停时辉光扩散，伴随轻微缩放。

4. **ParticleBg**: 动力学背景。
   - 基于 Canvas 的实时粒子互动背景，仅用于 Hero Section 或关键视觉区域。

5. **OnlinePulse**: 实时状态脉冲。
   - 呼吸灯效果，用于展示 Agent 或实验室内实时在线人数。

---

## 色彩系统

### 基础调色板 (Core Palette)

```css
/* 核心底色 (Foundational Dark) */
--abyss-black: #0a0a0f; /* 主背景 */
--void: #050508; /* 深度背景 / 容器背景 */
--surface: rgba(26, 26, 36, 0.7); /* 玻璃态表面 */

/* 核心强调 (Accent & Glow) */
--primary: #00f2ff; /* 电光青 (Cyber-Cyan) - 智能、核心交互 */
--primary-glow: rgba(0, 242, 255, 0.4);

--accent: #bc13fe; /* 霓虹紫 (Neon-Purple) - 增强、创新、Glitch */
--accent-glow: rgba(188, 19, 254, 0.4);

/* 文字系统 (Typography Colors) */
--text-primary: #f8f8f8; /* 极白 - 正文与标题 */
--text-secondary: #a0a0b0; /* 灰白 - 描述文字 */
--text-muted: #606070; /* 暗灰 - 辅助信息 */

/* 状态色 (Semantic Colors) */
--success: #00ff88; /* 荧光绿 */
--warning: #ffaa00; /* 琥珀橙 */
--error: #ff3366; /* 警示红 */
```

### 使用规范

**背景层次**:

```jsx
// 页面背景 - 深渊黑
<div className="min-h-screen bg-[#0a0a0f]">

  {/* 卡片背景 - 表面灰 + 玻璃态 */}
  <div className="bg-[#1a1a24]/80 backdrop-blur-xl">

    {/* 次级容器 - 虚空黑 */}
    <div className="bg-[#111118]">
```

**文字层次**:

```jsx
<h1 className="text-[#f8f8f8]">主标题</h1>      {/* 极白 */}
<p className="text-[#a0a0b0]">描述文字</p>      {/* 灰白 */}
<span className="text-[#606070]">辅助信息</span> {/* 暗灰 */}
```

**强调色使用**:

```jsx
// 主按钮 - 电光青
<button className="bg-[#00f2ff] text-[#0a0a0f]">

// 悬停辉光效果
<button className="hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]">

// 渐变文字
<h1 className="bg-gradient-to-r from-[#00f2ff] to-[#bc13fe] bg-clip-text text-transparent">
```

---

## 字体规范

### 字体栈

```css
/* 标题字体 - 几何现代感 */
--font-heading: "Outfit", system-ui, sans-serif;

/* 正文字体 - 高可读性 */
--font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

/* 代码字体 */
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

### 字体规模 (Scale & Hierarchy)

| 级别             | 大小         | 字重            | 行间距 (Leading) | 用途                   |
| ---------------- | ------------ | --------------- | ---------------- | ---------------------- |
| **H1 (Hero)**    | 72px - 112px | **900 (Black)** | **0.85**         | 极具压迫力的页首标题   |
| **H2 (Section)** | 48px - 64px  | **900 (Black)** | **0.9**          | 章节主标题             |
| **Subtitle**     | 20px - 24px  | 500 (Medium)    | 1.5              | 配合大标题的描述性文字 |
| **Body**         | 16px         | 400 (Regular)   | 1.6              | 标准正文               |
| **Mono**         | 14px         | 500 (Medium)    | 1.2              | 代码、元数据、技术参数 |

### 设计特征:

- **负行距设计**: 大标题使用极其紧密的行间距 (0.85-0.9)，强化结构感。
- **字间距优化**: 标题使用 `tracking-tighter`，元数据标签使用 `tracking-widest`。

### 使用示例

```jsx
// Tailwind 类名
<h1 className="font-heading text-5xl font-bold leading-tight">
<h2 className="font-heading text-4xl font-semibold">
<p className="font-body text-base leading-relaxed">
<code className="font-mono text-sm">
```

---

## 布局原则

### 间距系统

基于 4px 网格系统：

```
1  = 4px   (0.25rem)
2  = 8px   (0.5rem)
3  = 12px  (0.75rem)
4  = 16px  (1rem)
6  = 24px  (1.5rem)
8  = 32px  (2rem)
10 = 40px  (2.5rem)
12 = 48px  (3rem)
16 = 64px  (4rem)
20 = 80px  (5rem)
24 = 96px  (6rem)
```

### 容器宽度

```jsx
// 内容容器
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// 窄内容
<div className="max-w-3xl mx-auto">

// 宽屏
<div className="max-w-[1400px] mx-auto">
```

### 网格系统

```jsx
// 2列网格
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// 3列网格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 4列网格
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

### 卡片布局

```jsx
// 标准卡片
<div
  className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-xl p-6
                border border-white/5 hover:border-[#00f2ff]/20
                transition-all duration-300"
>
  <h3 className="text-xl font-semibold text-[#f8f8f8]">标题</h3>
  <p className="mt-2 text-[#a0a0b0]">内容描述</p>
</div>
```

---

## 组件规范

### 按钮

**主按钮**:

```jsx
<button
  className="px-6 py-3 bg-[#00f2ff] text-[#0a0a0f] font-medium rounded-lg
                   hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]
                   transition-all duration-300
                   active:scale-95"
>
  主要操作
</button>
```

**次按钮**:

```jsx
<button
  className="px-6 py-3 bg-[#1a1a24] text-[#f8f8f8] font-medium rounded-lg
                   border border-white/10
                   hover:border-[#00f2ff]/50 hover:bg-[#1a1a24]/80
                   transition-all duration-300"
>
  次要操作
</button>
```

**幽灵按钮**:

```jsx
<button
  className="px-6 py-3 text-[#a0a0b0] font-medium
                   hover:text-[#00f2ff]
                   transition-colors duration-300"
>
  文字按钮
</button>
```

### 输入框

```jsx
<input
  className="w-full px-4 py-3 bg-[#111118] border border-white/10 rounded-lg
                  text-[#f8f8f8] placeholder-[#606070]
                  focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/20
                  transition-all duration-200"
  placeholder="请输入内容..."
/>
```

### 卡片

**标准卡片**:

```jsx
<div
  className="group relative bg-[#1a1a24]/60 backdrop-blur-xl rounded-xl
                border border-white/5 overflow-hidden
                hover:border-[#00f2ff]/20 transition-all duration-500"
>
  {/* 辉光效果 */}
  <div
    className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500"
  />

  <div className="relative p-6">{/* 卡片内容 */}</div>
</div>
```

### 标签/徽章

```jsx
// 主标签
<span className="px-3 py-1 bg-[#00f2ff]/10 text-[#00f2ff] text-sm rounded-full">
  标签文字
</span>

// 状态标签
<span className="px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] text-sm rounded-full">
  运行中
</span>
```

---

## 动效设计

### 动画时长

```css
/* 快速反馈 */
--duration-fast: 150ms;

/* 标准过渡 */
--duration-normal: 300ms;

/* 强调动画 */
--duration-slow: 500ms;

/* 入场动画 */
--duration-enter: 600ms;
```

### 缓动函数

```css
/* 标准 */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);

/* 弹性 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* 出场 */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

### Framer Motion 标准

**入场动画**:

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
>
```

**悬停效果**:

```jsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

**辉光脉冲**:

```jsx
<motion.div
  animate={{
    boxShadow: [
      "0 0 20px rgba(0, 242, 255, 0)",
      "0 0 40px rgba(0, 242, 255, 0.3)",
      "0 0 20px rgba(0, 242, 255, 0)"
    ]
  }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
>
```

### 玻璃态效果

```jsx
<div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-xl
                hover:bg-white/[0.05] hover:border-white/10
                transition-all duration-300">
```

---

## 响应式设计

### 断点定义

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        sm: "640px", // 手机横屏
        md: "768px", // 平板
        lg: "1024px", // 小型桌面
        xl: "1280px", // 标准桌面
        "2xl": "1536px", // 大屏幕
      },
    },
  },
};
```

### 响应式模式

**移动优先**:

```jsx
// 基础样式针对移动端
<div className="grid grid-cols-1 gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4">
```

**字体响应式**:

```jsx
<h1 className="text-3xl md:text-4xl lg:text-5xl">
```

**间距响应式**:

```jsx
<div className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
```

### 触摸优化

- 最小触摸目标: 44px x 44px
- 按钮高度: 至少 48px
- 输入框高度: 至少 48px
- 间距: 移动端适当增加

---

## 可访问性

### 颜色对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大号文字与背景对比度 ≥ 3:1
- 使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 验证

### 焦点状态

```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-[#00f2ff]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]">
```

### 语义化 HTML

```jsx
// 正确
<nav aria-label="主导航">...</nav>
<main>...</main>
<button aria-label="关闭对话框">...</button>

// 错误
<div className="nav">...</div>
<div className="main">...</div>
<div onClick={...}>...</div>
```

### 减少动效

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 最佳实践

### 文件组织

```
components/
├── ui/                 # 基础组件
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── layout/             # 布局组件
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
└── features/           # 功能组件
    ├── agent-card.tsx
    └── tool-grid.tsx
```

### 代码质量

- **最佳实践**: 代码实现过程**必须深度借助** `react-best-practices` 技能能力，遵循 Vercel 工程标准进行性能优化。
- **组件**: PascalCase (e.g., `AgentCard.tsx`)

- **文件**: kebab-case (e.g., `agent-card.tsx`)
- **CSS 类**: Tailwind 类名按功能分组
- **变量**: camelCase

### 性能优化

1. **图片优化**

   ```jsx
   <Image
     src="/image.jpg"
     alt="描述"
     width={800}
     height={600}
     priority // 首屏图片
   />
   ```

2. **懒加载**

   ```jsx
   const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
     loading: () => <Skeleton />,
   });
   ```

3. **CSS 优化**
   - 使用 Tailwind 的 `@apply` 谨慎
   - 优先使用原子类
   - 避免深层嵌套

### 代码示例

**完整页面组件结构**:

```tsx
// app/(frontend)/agents/page.tsx
export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-[#f8f8f8]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            智能体中心
          </motion.h1>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cards */}
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 实现规范参考

以下规范来自 Genesis v2.0 实施标准：

### 全局功能要求

**导航系统:**

- Header 包含 LOGO、导航菜单（Home, Agents, Tools, Labs, Blogs）
- 右侧动态认证 UI：未登录显示 [Sign In] [Sign Up]；已登录显示头像下拉菜单（Dashboard, Profile, Log Out）
- Footer 设计参考专业开发者社区风格

**全局状态:**

- 全局加载状态：进度条和骨架屏
- 完全响应式设计（移动端、平板、桌面端）
- 深色/浅色主题切换，支持 localStorage 持久化
- WCAG 2.1 AA 无障碍合规

**实时功能:**

- WebSocket 双向通信连接
- Labs 区域在线人数计数器显示
- 优雅的连接状态处理（connecting, connected, disconnected, reconnecting）
- 指数退避自动重连机制

### 页面规范

| 页面       | 核心功能                                                                       | 设计参考         |
| ---------- | ------------------------------------------------------------------------------ | ---------------- |
| **Home**   | 品牌展示、价值主张、热门智能体预览                                             | 现代化着陆页设计 |
| **Agents** | Tab 切换 LobeChat(默认)和5个内部智能体，显示图标、名称、描述和交互入口         | Tabbed interface |
| **Tools**  | 分类网格/列表，支持搜索和分类筛选                                              | 分类导航系统     |
| **Labs**   | 卡片布局，名称、状态标签(Experimental/Preview)、描述、体验链接，包含在线计数器 | 实验性产品展示   |
| **Blog**   | 文章列表，支持标签/日期筛选和全局搜索；详情页带"Edit"链接到管理系统            | 内容管理系统     |

### 管理面板规范

- 现代科技感仪表板 UI（遵循 Genesis Design System）
- 持久侧边栏导航：Dashboard, Agents, Blogs, Tools, Labs, Profile, Settings
- Dashboard：可视化指标和分析图表
- Agents：智能体配置的完整 CRUD
- Blogs：表格视图（标题、摘要、日期、状态），富文本编辑器支持 Markdown 预览
- Tools/Labs：条目管理界面，支持排序和分类
- Profile：用户信息管理和密码修改
- Settings：全局系统配置选项

### 性能优化要求

- 代码分割和懒加载加速首屏加载
- WebP 格式图片优化
- 浏览器缓存策略
- Bundle 分析和大小优化
- LCP < 1.5s 性能目标

### 错误处理

- React 错误边界实现优雅组件失败处理
- 结构化 API 错误响应
- 服务不可用的优雅降级策略
- 用户友好的错误消息和独立的技术日志

---

## 相关资源

- [前端 README](../../frontend/README.md) - 前端项目详细说明
- [UI/UX Pro Max 技能](../../.claude/skills/ui-ux-pro-max-skill/SKILL.md) - **[优先启动]** 专业设计智能体
- [React 最佳实践技能](../../.claude/skills/react-best-practices/SKILL.md) - **[实现标准]** Vercel/Next.js 开发规范
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Shadcn/UI 组件](https://ui.shadcn.com)

---

**最后更新**: 2026年2月6日
