# Work-Agents UI/UX 设计规范 (Ultimate & Detailed Genesis v1.2)

**版本**: v1.2 (Genesis Full Edition)
**最后更新**: 2026-02-02
**核心使命**: 打造一个具有“未来感”和“生命力”的极客游乐园。避免任何平庸、死板、传统的 SaaS 界面。
**设计基准**: 
- **灵感网站**: [checkmarx.dev](https://checkmarx.dev/) (极简布局/光影), [clawdbotai.co](https://clawdbotai.co/) (科技感交互)。
- **视觉关键词**: **Abyss (深邃) / Electric (电光) / Glassy (玻璃态) / Kinetic (动力学)。**
- **设计资源**: 所有 AI 生成的组件及页面高保真稿存放于 `frontend/design-assets/`。

---

## 1. 工程实施准则 (Implementation Principles)

为确保 Genesis 视觉在各种终端完美呈现，开发必须遵循：
- **组件基座**: **优先引用 Shadcn/UI 组件库**，基于 Radix UI 的无障碍标准进行 Genesis 风格重塑。
- **样式逻辑**: 统一使用 **Tailwind CSS 4.x** 与 Next.js 15.4 生态。严禁使用 CSS Modules 或 Styled-components 等降低协作效率的方案。
- **视觉溯源**: AI Agent 在执行任何 UI 任务前，**必须同步检索** `frontend/design-assets/` 下的相关设计稿，确保物理还原度。
- **性能约束**: 所有自定义动效（Framer Motion）必须进行 Tree Shaking 优化，首屏 LCP 必须小于 1.5s。

## 2. 设计系统 (Design Tokens)

### 2.1 色彩底座 (Color Engine)
*严禁使用任何系统默认蓝色，所有色彩必须基于以下 Tokens。*

| 分类 | Token 名 | HEX | 语义与用途 |
| :--- | :--- | :--- | :--- |
| **背景** | `--bg-abyss` | `#0a0a0f` | **深渊黑** - 网站唯一的基石背景色 |
| | `--bg-slate` | `#11111a` | **石板黑** - 容器、卡片的基础背景 |
| | `--bg-surface` | `#1a1a24` | **浮层黑** - 下拉菜单、弹窗表面 |
| **霓虹** | `--primary` | `#00f2ff` | **电光青** - 主品牌色，用于高亮和信号 |
| | `--accent` | `#bc13fe` | **霓虹紫** - 辅助强调色，用于能量脉冲和辅助动效 |
| **状态** | `--success` | `#00ffa3` | **极光绿** - 成功状态 |
| | `--error` | `#ff4d4d` | **电光红** - 错误/危险 |
| **文字** | `--text-p` | `#f8f8f8` | **极白** - 主标题与长文正文 |
| | `--text-s` | `#94a3b8` | **酷灰蓝** - 描述文本、次要信息 |

### 1.2 物理级玻璃态 (Glassmorphism)
玻璃效果通过 `Backdrop Blur` 和 `Layering` 协同实现：
- **Standard Glass**: `background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08);`
- **Elevated Glass**: `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);`

### 1.3 字体架构 (Typography)
- **Header (标题)**: `Outfit` (Bold) - 用于 Hero 标题、模块大标题。具有强烈的几何现代感。
- **Body (正文)**: `Inter` - 用于长文阅读和描述，提供顶级可读性。
- **Mono (极客系统)**: `JetBrains Mono` - 用于代码、Labs 状态值、在线人数计数及所有纯技术参数。

---

## 2. 页面详细蓝图 (Page Blueprints)

### 2.1 Home: "The Cyber Portal"
- **Hero 视觉**: 中心大标题采用 `text-transparent bg-clip-text bg-gradient-to-r from-cyan to-purple`。
- **背景动力学**: 后台渲染一层薄薄的“电荷粒子流”，粒子以极低的速度（0.2px/s）向右上角漂移。
- **Slogan**: 使用 `Typewriter` 动效，循环展示：`Command AI Agents.` -> `Automate Complexity.` -> `Own the Future.` (间隔 3s)。

### 2.2 Agents: "Intelligence Integration"
- **Tab 导航**: 
  - 激活状态：文字变为 `Cyan`，下方显示一条宽度 60% 的 Cyan 线条，线条下方带有一个 R:20px 的半圆形发光投影。
  - 切换动效：Tab 切换时，内容区域采用 `slide-up` + `fade-in` 组合（Framer Motion: `y: [10, 0], opacity: [0, 1]`）。
- **LobeChat 门户**: iframe 外壳必须是 `rounded-2xl`，边缘带有 `1px solid var(--border-bright)`，底部可以有一层微弱的紫色背光。

### 2.3 Labs: "Experimental Zone"
- **Online Counter**: 组件显示为 `[ ● 542 AGENTS ONLINE ]`。`●` 具有脉冲效果（Cyan/Purple 循环发光），字体强制使用 `JetBrains Mono`。
- **Glitch 卡片**: 卡片在 hover 时，图片亮度提升 20%，且产生非常短暂（50ms）的“杂讯干扰”滤镜效果。

### 2.4 Blog: "The Deep Read"
- **内容排版**: 正文行高 `1.8`，段落间离 `1.5rem`。
- **TOC 指示器**: 粘性定位在右侧。当前活跃章节左侧出现一个 “Scanline” 指示器（一根不断上下滑动的 2px 高 Cyan 线）。
- **代码块**: 采用 `Tomorrow Night` 暗色主题，面板右上角带有一个半透明的 “JetBrains Mono” 风格标签表示语言。

---

## 3. 组件级核心交互 (Component Specs)

### 3.1 磁力磁感按钮 (Magnetic Interaction)
- **吸附范围**: 鼠标进入按钮 20px 边界时。
- **位移逻辑**: 按钮重心向鼠标坐标偏移 10%，内部文字/图标向鼠标坐标偏移 15%，模拟磁铁吸附感。

### 3.2 正在链接动效 (Agent Bridge)
当用户从项目跳转至外部 Agent (LobeChat) 时，触发桥接层：
- **视觉**: 全黑 Abyss 背景。
- **动效**: 屏幕中央显示一条 Cyan 色的水平扫描线，从顶部快速滑到底部，重复 3 次。
- **文字**: 底下显示 `ESTABLISHING NEURAL LINK...` (JetBrains Mono)。

### 3.3 全局 Skeleton (骨架屏)
- 严禁使用灰色骨架。使用 `bg-slate/30` 的玻璃态卡片，内部带有 `animate-pulse` 的 Cyan/Purple 掩膜（Mask）。

---

## 4. 后台管理规范 (Admin Geek Standard)

### 4.1 高效布局
- **侧边栏 (Sidebar)**: 固定宽度 240px，背景为 `Abyss`。当前项左侧带有 `4px` 宽的 Purple 呼吸条。
- **表单体验**: 使用 `Floating Label` 交互。输入框 Focus 时，边框产生 `Glow Cyan` 效果。

### 4.2 特色功能 UI
- **SEO 预览**: 在编辑页下方实时展示 Google 结果预览（Blue Title, Green Link, Grey Text），模拟真实的搜索结果。
- **媒体管理**: 上传成功后，路径不仅仅是文字，要放进一个 `Code` 样式的容器中，点击即复制路径。

---

## 5. 开发验收红线 (The ACID Test)

| 场景 | ✅ 极客做法 (Genesis) | ❌ 禁止做法 (Banned) |
| :--- | :--- | :--- |
| **滚动条** | 隐藏，或自定义为 4px 宽的半透明 Cyan 条 | 系统默认浏览器滚动条 |
| **投影** | 使用 `Filter: drop-shadow` 产生的光晕 (Glow) | 传统的模糊灰黑色阴影 |
| **圆角** | 12px (Standard) / 24px (Large) | 直角或 4px/6px 这种老旧圆角 |
| **对话框** | `Backdrop-blur-2xl` 全屏覆盖 + 居中浮窗 | 传统的白色/淡灰色实底对话框 |
| **加载反馈** | 自定义扫描线或旋转的霓虹星环 | 传统的 Spinner 或直线进度条 |

---

## 6. 技术映射建议 (Code Reference)

```typescript
// AI 在实现时请参考此动效参数
export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1
};

export const GLITCH_ANIMATION = {
  scale: [1, 1.01, 1],
  x: [0, -2, 2, 0],
  transition: { duration: 0.1 }
};
```

---
 
 ## 7. 响应式布局标准 (Responsive Standards)
 
 - **移动端优先**: 所有组件必须从 `Mobile (375px)` 起始设计。
 - **断点策略**: 
   - `sm (640px)`: 移除复杂的粒子背景（改为静态渐变以节省性能）。
   - `md (768px)`: 开启磁力按钮交互。
   - `lg (1024px)`: 启用 `Elevated Glass` 级深度阴影与全量光效。
 - **交互降级**: 触屏设备上，**磁力吸附 (Magnetic)** 自动失效，改为 `Scale-95` 的点击反馈。
 
 ---
 **提示**: 开发时若遇到审美决策冲突，优先保证“极客感”和“光效”。严禁使用任何 `bg-blue-500` 等标准 UI 库默认色值。
