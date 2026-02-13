# 产品需求文档 (PRD) - MyNoteBook

> **版本**: v1.1
> **状态**: 实施中 (Implementation)
> **最后更新**: 2026-02-09
> **设计系统**: Genesis Design System v2.0

## 1. 项目概述

### 1.1 产品愿景

打造一个极致酷炫（Cyberpunk Style）、高度自动化且体验流畅的现代 AI 多智能体编排平台。它不仅是开发者的生产力工具，更是展示前端美学与 AI 技术融合的“极客橱窗”。

### 1.2 核心价值

- **视觉震撼**：基于 Genesis 设计系统，提供深渊黑、霓虹色、玻璃拟态的深度沉浸体验。要求 100% 像素级还原设计稿。
- **感知敏捷**：毫秒级的交互反馈，通过 Framer Motion 实现物理感知的动效。
- **编排可视化**：直观展示 LobeChat 与自研智能体（News, Task, Review, Life, Outfit）的协作状态。

### 1.3 开发与验收标准 (Mandatory)

- **设计引导**: AI 助理在编写 UI 代码前，**必须执行** `ui-ux-pro-max-skill` 以获取像素级设计指导，确保对 Genesis 设计系统的理解对齐。
- **编码规范**: 所有 React/Next.js 代码编写必须遵循 `react-best-practices` 技能标准，确保性能优化、架构合理。
- **视觉验证**: 每个页面开发完成后，必须进行视觉对比（Visual Regression Check）。AI 需对比代码运行效果与 `design-assets` 中的原设计图，并给出 **UI 还原度分数 (0-100)**。得分低于 95 分需修正。

---

## 2. 前端架构与设计系统

### 2.1 技术栈 (Tech Stack)

- **框架**: Next.js 15.5 (App Router)
- **核心**: React 19.1 (Server Components 优先)
- **样式**: Tailwind CSS 3.x (配置驱动)
- **组件库**: Shadcn/UI + 定制化 `v-ui` (Genesis 专用组件)
- **动效**: Framer Motion 6.x+
- **状态管理**: TanStack Query (服务端) + Zustand (客户端)
- **通信**: WebSocket (实时状态更新)

### 2.2 Genesis 设计系统规范

- **色彩 (Colors)**:
  - `Abyss Black (#0a0a0f)`: 主背景，象征深渊与专注。
  - `Cyber-Cyan (#00f2ff)`: 核心强调色，带 `primary-glow` 效果。
  - `Neon-Purple (#bc13fe)`: 次要强调色，用于 AI 及高级功能。
  - 辅助色：成功绿 (#00ff88)、错误红 (#ff3366)。
- **质感 (Texture)**:
  - **玻璃拟态 (Glassmorphism)**: `backdrop-blur-xl` + 3% 白色半透明边框。
  - **全息投影 (Holographic)**: 关键 Agent 卡片使用全息纹理背景。
- **字体 (Typography)**:
  - 标题: `Outfit` (现代几何感)。
  - 正文: `Inter` (极高可读性)。
  - 代码: `JetBrains Mono`。

---

## 3. 页面功能需求详情 (WEB 前台)

### 3.0 全局公共组件与状态

- **页头 (Header)**:
  - **Logo**: 位于左侧，链接至 Home。
  - **导航菜单**: 居中显示 Home, Agents, Tools, Labs, Blog。当前页面需有 Neon-Cyan 下划线高亮。
  - **动态认证 UI**:
    - 访客状态：显示 `[Sign In]` `[Sign Up]` 霓虹按钮。
    - 已登录状态：显示用户头像，点击展开下拉菜单（Dashboard, Profile, Logout）。
- **页脚 (Footer)**:
  - 桌面版：多列链接 (Product, Resources, Company, Legal) + Newsletter 订阅。
  - 移动版：底部固定 Tab 导航 (Home, Agents, Flows, Docs, Profile)。
- **全局状态**:
  - **加载态**: 顶部进度条 (Top Loader) + 各模块 Skeleton 骨架屏。
  - **主题规范 (Web 前台)**: **强制深色模式 (Strict Dark Mode)**。基于 Genesis Design System 的 Cyberpunk 风格，不提供浅色模式切换，确保护眼与沉浸感。
  - **实时通信**: 需显示全局 WebSocket 连接状态灯。

### 3.1 Home (品牌着陆页)

- **设计资产**:
  - 设计图: `frontend/design-assets/pages/home-desktop.png`, `home-mobile.png`
  - 设计提示词/逻辑: `frontend/design-assets/pages/home.md`
- **核心组件**: `ParticleBg` (Canvas 粒子背景), `GradientText` (渐变文字)。
- **Hero 区**:
  - 标题: "Orchestrate Your Workflow. Empower Your Agents."
  - 动效: 标题渐入 (fadeInUp) + 霓虹按钮 (NeonButton) 悬停光晕。
  - 插图: 3D 等距 Agent 协作场景。
- **功能区块**:
  - **How It Works**: 3 步玻璃态卡片，带渐变连接线。
  - **Key Features**: 6 宫格网格，悬停展示 `cyberGlow` 发光边框。
  - **Agent Showcase**: 横向滚动卡片流。

### 3.2 Agents (智能体工作台)

- **设计资产**:
  - 设计图: `frontend/design-assets/pages/agents-desktop.png`, `agents-mobile.png`
  - 设计提示词/逻辑: `frontend/design-assets/pages/agents.md`
- **布局**: 桌面端 50:50 镜像分栏。
- **LobeChat 集成**:
  - 左侧 iframe 嵌入 LobeChat 服务。
  - 支持 postMessage 跨域通信，同步 UI 状态。
- **智能体矩阵 (Right Panel)**:
  - 2×3 网格展示 5 个 Agent (News, Outfit, Task, Life, Review)。
  - **卡片设计**: 全息图背景 + `OnlinePulse` 状态灯。
  - **Outfit Agent 特殊逻辑**: 首次加载展示生成中动画，成功后展示文字建议 + 插图。
  - **Task Agent 交互**: 列表内直接勾选任务，同步实时复核进度。

### 3.3 Tools (极客工具箱)

- **设计资产**:
  - 设计图: `frontend/design-assets/pages/tools-desktop.png`, `tools-mobile.png`
  - 设计提示词/逻辑: `frontend/design-assets/pages/tools.md`
- **布局**: 桌面 2×2 网格卡片 / 移动端垂直列表。
- **分类系统**: 侧边/顶部标签筛选 (Dev, Auto, Intel, Creative)。
- **视觉表现**:
  - 背景: 电路板图案 (Circuit Texture)。
  - 按钮: 四色主题 (Cyan/Pink/Blue/Purple) 霓虹按钮。

### 3.4 Labs (实验性实验室)

- **设计资产**:
  - 设计图: `frontend/design-assets/pages/labs-desktop.png`, `labs-mobile.png`
  - 设计提示词/逻辑: `frontend/design-assets/pages/labs.md`
- **视觉风格**: Glitch Art (故障艺术) 驱动。
- **核心特效**: 扫描线 (Scanlines)、文字抖动 (Glitch Text)、细微数据流背景。
- **交互流程**:
  - 左侧项目列表 -> 中央项目预览 (支持 iframe 运行实验项目，如贪吃蛇) -> 右侧详细参数。
  - 状态灯: `Experimental` (紫色), `Preview` (蓝色)。

### 3.5 Blog (技术内容)

- **设计资产**:
  - 设计图: `frontend/design-assets/pages/blog-desktop.png`, `blog-mobile.png`
  - 设计提示词/逻辑: `frontend/design-assets/pages/blog.md`
- **阅读优化**: 采用衬线字体 (Serif) 标题 + 间距优化。
- **功能**:
  - **TOC 导航**: 桌面端右侧固定，随滚动自动高亮。
  - **代码块**: `Prism` 语法高亮 + 复制功能。
  - **互动**: 移动端底部粘性互动条 (Like/Share/Bookmark)。

---

## 4. 全局体验与适配

### 4.1 动效规格

- **入场动画**: 0.6s `ease-out`, `y: 30 -> 0`。
- **组件交互**: 按钮按下 `scale: 0.95`, 悬停 `box-shadow` 放大 40px。
- **状态切换**: 玻璃态卡片在 Hover 时提升 2% 透明度。

### 4.2 响应式适配

- **断点**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`。
- **策略**:
  - 导航变底部 Tab 栏。
  - 复杂分栏变单列堆叠。
  - 移除不必要的背景粒子以优化移动端性能。

---

## 5. MVP 交付标准 (Acceptance Criteria)

1. **视觉还原度**: 100% 像素级匹配 `design-assets` 中的高保真设计稿。
2. **UI 还原度评分**: 经过对比验证，最终得分必须 ≥ 95 分。
3. **代码质量**: 通过 `react-best-practices` 审计，关键性能指标对齐。
4. **性能基准**: LCP (最大容量渲染) < 1.5s，FCP < 0.8s。
5. **实时性**: Agent 状态灯必须通过 WebSocket 实时反映后端状态。
6. **适配性**: 在最新 Chrome, Safari, Edge 移动版与桌面版均展现正常，无错位或遮挡。

---

## 6. 管理后台需求 (Admin Dashboard)

### 6.1 视觉与交互规范

- **设计语言**: 现代科技感仪表盘。侧边栏保持 Genesis 深色系。
- **主题切换 (管理后台)**: **支持双端切换 (Adaptive Theme)**。内容区支持极简浅色与极速深色模式的一键切换，状态通过 `localStorage` 持久化，满足不同办公环境下的长效操作需求。
- **布局**: 固定左侧导航栏 + 顶部响应式面包屑 + 滚动内容区。

### 6.2 核心模块详情

- **Dashboard (概览)**:
  - 集成可视化图表 (ECharts/Recharts)，展示 7 日内智能体活跃度、访客流量、系统资源占用。
- **Agent Matrix (智能体管理)**:
  - 列表展示所有智能体。
  - 配置页：支持修改 Prompt 模板、模型选择 (Gemini/GPT-4)、调用限额、WebSocket 优先级。
- **Content Management (内容管理)**:
  - **Blog**: 提供表格视图，支持发布状态切换、置顶排序。
  - **Editor**: 集成 Tiptap 或 React-Mde，支持图片拖拽上传与 Markdown 实时双屏预览。
- **Labs & Tools (条目管理)**:
  - 支持分类拖拽排序、状态切换 (Experimental/Live)。
- **Profile & Systems (配置)**:
  - 用户信息管理 (密码修改、API Token 生成)。
  - 系统设置：全局代理配置、日志保留策略、静态资产清理。

---

**附录**:

- [设计规范参考docs/design/frontend-guide.md](../design/frontend-guide.md)
- [页面资产目录frontend/design-assets/](../../frontend/design-assets/)
