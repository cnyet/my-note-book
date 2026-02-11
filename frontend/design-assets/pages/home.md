# Home 页面实现提示词 (Optimized)

## 任务目标 (Objective)

你作为一名资深前端工程师，任务是实现 My-Note-Book 平台的首页。你要复刻 Lumina Design Studio 的高端美学，打造一个极具视觉冲击力的“AI 时代终极笔记本”着陆页。

## 核心上下文 (Context)

- **项目背景**: My-Note-Book 是一个面向 AI 时代的智能工作流平台。
- **设计风格**: Lumina Design Studio 风格。核心元素包括深色背景 (#020617)、玻璃拟态 (Glassmorphism)、弥散渐变、以及 Bento Grid (便当格) 布局。
- **技术栈**: React (Next.js), Tailwind CSS, Lucide React 动画库 (Framer Motion 或 Vanilla CSS 动画)。

## 页面架构与区块 (Structure)

### 1. 导航栏 (Navbar)

- **样式**: 固定在顶部，全宽但内容居中。采用玻璃态背景 (Glass)，圆角设计。
- **元素**:
  - 左侧: 动态 Logo (带旋转渐变背景)。
  - 中间: 导航链接 (Home, Agents, Tools, Labs, Blogs)，带 Hover 增强效果。
  - 右侧: "Sign in" 链接与 "Dashboard" 按钮 (极简边框或玻璃态)。

### 2. 英雄区 (Hero Section)

- **主标题**: "Build Beyond Imagination"。标题需巨大且具有排版张力。
  - 渐变效果: 从 `indigo-400` 经过 `purple-400` 到 `pink-400` 的线性渐变背景文字。
- **副标题**: 描述平台作为统一工作空间的价值，字号适中，颜色为次级灰色 (`slate-400`)。
- **CTA 按钮**:
  - "Launch Notebook": 主按钮，纯白背景，带发散阴影。
  - "Explore Ecosystem": 玻璃态按钮，边框半透明。
- **主体插图**: 下方展示一个巨大的 3D 界面预览图，置于带阴影和发光效果的玻璃容器中。

### 3. 高性能核心区 (Performance Core)

- **视觉**: 左右分栏布局。
- **左侧**: 强调速度的指标 (如 0.02ms 延迟、120Hz 刷新率)，配合巨大的粗体数字。
- **右侧**: 动态旋转的 CPU 核心图标，周围有类似电子轨道的发光圆环和脉冲粒子动效。

### 4. 数据安全区 (Security & Privacy)

- **样式**: 采用超大圆角的玻璃态容器 (#020617 背景 + 5% 透明度线框)。
- **内容**: 盾牌图标，强调“Data Isolated”和“Zero-Knowledge”等安全特性。

### 5. 方法论 (Methodology)

- **布局**: Bento Grid (2x2 或 1x4 响应式)。
- **步骤**: Inception, Iteration, Validation, Deployment。
- **效果**: 悬停时卡片背景变色 (如变蓝)，图标产生平移或缩放。

### 6. IQ 助手交互区 (AI Chat)

- **功能**: 在页面底部嵌入一个功能齐备的 AI 聊天界面。
- **视觉**: 深色模拟终端风格，带打字机效果，消息气泡区分用户和模型。

## 视觉细节规范 (Specs)

- **背景**: 固定背景使用蓝紫弥散光晕 (`blur-[140px]`)，增加层次感。
- **字体**: 使用极黑且紧凑的无衬线字体 (如 Inter 或系统级黑体)，字间距 (`tracking-tighter`)。
- **动画**:
  - 页面加载时的 `fade-in` 和 `slide-in-from-bottom`。
  - 持续循环的 `marquee` (合作伙伴横幅) 和 `animate-blob` (背景光晕)。

## 交付要求 (Deliverables)

提供高度组件化的代码，确保响应式适配 (移动端自动转换为单栏堆叠)。所有颜色使用 Tailwind 标准色值，图标统一使用 Lucide 库。
