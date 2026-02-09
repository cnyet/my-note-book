# Home 页面设计文档

**对应设计稿**:
- 桌面版: `home-desktop.png`
- 移动版: `home-mobile.png`

**页面路由**: `/`

**页面定位**: 品牌着陆页，展示平台核心价值和5个智能体能力

---

## 视觉设计规范 (Genesis Design System)

| 元素 | 桌面版 (≥1024px) | 移动版 (<768px) |
|------|------------------|-----------------|
| **整体布局** | 多区块垂直流式布局 | 单栏堆叠布局 |
| **背景** | 深渊黑(#0a0a0f) + 霓虹蓝/紫粒子动效 | 深渊黑 + 简化粒子效果 |
| **导航栏** | 玻璃态(GlassCard)，Logo左/导航中/CTA右 | 顶部Logo + 用户信息 |
| **Hero区** | 大标题(渐变文字) + 副标题 + 双CTA + 3D插图 | 简化标题 + 双按钮 |
| **Footer** | 多列链接 + Newsletter | 简化链接 + 底部Tab导航 |

---

## 核心功能区块详解

### 1. Hero Section

**视觉元素**:
- **主标题**: "Orchestrate Your Workflow. Empower Your Agents."
  - 字体: 大号无衬线，渐变色彩 (cyber-cyan → cyber-purple)
  - 组件: `GradientText`
- **副标题**: 平台价值描述，灰色次级文字
- **CTA按钮组**:
  - [Deploy Your First Agent] - `NeonButton` 主样式 (cyan)
  - [Explore the Platform] - `NeonButton` 描边样式
- **Hero插图**: 3D等距风格多Agent协作场景
  - 实现: 静态PNG或Lottie动画
  - 位置: 右侧或下方 (响应式)

**动效要求**:
- 背景: `ParticleBg` Canvas粒子动效 (霓虹蓝/紫色)
- 入场: 标题 fadeInUp + 按钮 stagger延迟

---

### 2. How Work-Agents Works

**布局**: 3步骤卡片水平排列 (桌面) / 垂直排列 (移动)

**步骤内容**:
1. **Define Tasks** - 图标 + 描述
2. **Train Agents** - 图标 + 描述
3. **Execute & Scale** - 图标 + 描述

**视觉设计**:
- 卡片: `GlassCard` 玻璃态效果
- 连接线: 带箭头的渐变线 (步骤间指引)
- 序号: 霓虹圆形徽章

---

### 3. Key Features

**布局**: 6宫格 (桌面 3×2) / 2列 (移动)

**功能项** (每个包含图标+标题+描述):
- Autonomous Operation
- Multi-Agent Collaboration
- Secure Sandbox
- Real-time Monitoring
- API Integration
- Customizable Models

**视觉设计**:
- 图标: Lucide icons + `cyberGlow` 发光效果
- 卡片: 极简风格，悬停时显示霓虹边框

---

### 4. Agent Showcase

**布局**: 横向滚动卡片列表

**示例Agents**:
- DevOps Assistant
- Content Creator
- Customer Support Bot

**卡片内容**:
- Agent图标
- 名称
- 简短描述
- [View Profile] 链接

---

### 5. Join the Developer Community

**内容**:
- Discord邀请链接
- GitHub仓库链接
- 开发者论坛预览

---

### 6. Footer

**桌面版**:
- 多列链接: Product / Resources / Company / Legal
- Newsletter订阅表单
- 社交媒体图标

**移动版**:
- 简化链接
- 底部固定Tab导航: Home | Agents | Flows | Docs | Profile

---

## 响应式适配策略

### 断点定义

```css
/* Tailwind 断点 */
sm: 640px   /* 大屏手机 */
md: 768px   /* 平板 */
lg: 1024px  /* 小桌面 */
xl: 1280px  /* 大桌面 */
```

### 关键适配点

| 元素 | 桌面 | 平板 | 手机 |
|------|------|------|------|
| Hero区 | 左右分栏 | 上下堆叠 | 上下堆叠，简化 |
| 功能网格 | 3×2 | 2×3 | 1×6 |
| 导航 | 水平导航 | 水平导航 | 底部Tab |
| Agent展示 | 横向滚动 | 横向滚动 | 垂直列表 |

---

## Genesis 组件使用清单

| 组件 | 位置 | 用途 |
|------|------|------|
| `ParticleBg` | Hero背景 | 霓虹粒子动效 |
| `GradientText` | Hero标题 | cyan→purple渐变 |
| `GlassCard` | 功能卡片 | 玻璃态容器 |
| `NeonButton` | CTA按钮 | 霓虹发光效果 |
| `OnlinePulse` | 导航栏 | 平台在线状态 |

---

## 动画规格

| 动画 | 触发 | 参数 |
|------|------|------|
| fadeInUp | 滚动进入视口 | duration: 0.6s, y: 30→0 |
| stagger | 列表加载 | delay: 0.1s/item |
| hover:scale | 鼠标悬停 | scale: 1.02, duration: 0.2s |
| cyberGlow | 持续循环 | 2s infinite |

---

## 主题切换

- **管理方案**: Redux + next-themes
- **持久化**: localStorage
- **切换位置**: 导航栏右侧
- **模式**: 深色(默认) / 浅色

---

## 相关文档

- [设计规范](../genesis-design-system.md)
- [Agents页面](./agents.md)
- [API集成指南](../../../docs/api/frontend-integration-guide.md)
