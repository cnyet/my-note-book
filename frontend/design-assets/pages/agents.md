# Agents 页面实现提示词 (Optimized)

## 任务目标 (Objective)

作为一名资深前端工程师，你的任务是实现 My-Note-Book 的“智能体人力市场”页面。该页面需要展示平台强大的 AI 劳动力，并赋予每个智能体鲜明的个性化视觉特征。

## 核心上下文 (Context)

- **页面定位**: 智能体展示、能力索引与招聘入口。
- **设计风格**: 延续 Lumina Design Studio 的深色模式 (#020617) 与玻璃拟态。
- **视觉主题**: “Autonomous Design Agents” (自主设计智能体)。

## 页面架构与区块 (Structure)

### 1. 标题头 (Section Header)

- **标签**: "Personnel" (人员/人事)。
- **主标题**: "Autonomous Design Agents."。
- **副标题**: 描述这是全球最强大的设计劳动力群体，提供全方位的创意支持。

### 2. 智能体矩阵 (Agent Grid)

- **布局**: 3列网格 (桌面) / 2列 (平板) / 1列 (手机)。
- **智能体信息卡片**:
  - **Archon (System Architect)**: 靛蓝色主题，擅长组件逻辑与 Token 策略。
  - **Lexa (UX Researcher)**: 紫色主题，擅长用户旅程与无障碍分析。
  - **Koda (Motion Engineer)**: 粉色主题，擅长动效与 Lottie 导出。
  - **Vira (Brand Alchemist)**: 橙色主题，擅长配色与 Logo 演化。
  - **Nova (Data Visualization)**: 青色主题，擅长复杂数据交互与 SVG。
  - **Sudo (Design Engineer)**: 翠绿色主题，擅长 React 原型与 CSS-in-JS。
- **卡片组成元素**:
  - **图标容器**: 带颜色的发光背景，匹配智能体主题色。
  - **状态标签**: 显示 "Available", "Online", "Ready" 或 "Occupied"，带呼吸灯效果。
  - **能力标签 (Capabilities)**: 底部显示多个小标签 (Tag)。
  - **交互按钮**: "Consult Agent" (咨询智能体)。

### 3. 页脚 (Agents Footer)

- **内容**: 引人注目的 CTA，如 "Expand Your Workforce" (扩张你的团队)。
- **按钮**: "Join as Agent" 和 "Marketplace API"。

## 视觉细节规范 (Specs)

- **卡片动效**: 悬停时边框颜色加深，阴影产生发光效果 (`shadow-indigo-500/10`)。
- **入场动画**: 采用从右侧滑入的 `slide-in-from-right` 结合透明度渐变。
- **玻璃感**: 维持 `glass` 类样式，边框厚度 1px，透明度极低。

## 交付要求 (Deliverables)

代码需支持灵活的智能体配置数组。确保在不同屏幕尺寸下的网格对齐与间距一致。
