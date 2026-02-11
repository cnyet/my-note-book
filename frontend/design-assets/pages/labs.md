# Labs 页面实现提示词 (Optimized)

## 任务目标 (Objective)

作为一名资深前端工程师，你的任务是实现 My-Note-Book 的“未来实验室”页面。这是一个展示前沿探索、实验性交互和科幻概念的页面，视觉设计需要更加激进且充满未来感。

## 核心上下文 (Context)

- **页面定位**: 实验项目展示、白皮书发布与概念预览。
- **设计风格**: Lumina Labs (具有强烈色彩对比和超大视觉元素的科幻风格)。
- **视觉主题**: “The Future Canvas” (未来画布)。

## 页面架构与区块 (Structure)

### 1. 标题头 (Section Header)

- **标签**: "Experimental" (实验性)。
- **主标题**: "The Future Canvas."。
- **副标题**: 描述这是打破边界、研究新兴界面的学术与技术基地。

### 2. 核心实验项目 (Core Projects)

- **布局**: 2列超大垂直卡片 (高度约 600px)。
- **项目 A: Synapse (Neural Design Sync)**:
  - 视觉: 青色 (`Cyan`) 主色调。
  - 特效: 背景嵌入一个巨大的 `BrainCircuit` 浅色图标 (Opacity 10%)，悬停时亮度提升。
  - 功能: 脑机接口设计预览，带 "Join Waitlist" 按钮。
- **项目 B: Echo (Ambient Layouts)**:
  - 视觉: 粉色 (`Pink`) 主色调。
  - 特效: 背景嵌入一个巨大的 `Radio` 雷达图标。
  - 功能: 环境自适应布局研究，带 "Read Whitepaper" 按钮。

### 3. 页脚 (Labs Footer)

- **内容**: 极简设计，中心化对齐。
- **视觉**: 旋转或脉动状态的 `FlaskConical` (烧瓶) 图标。
- **声明**: "Proprietary Research Unit" (专用研究单位)。

## 视觉细节规范 (Specs)

- **动效**: 强调深度感，卡片内的图标应有微弱的位移差 (Parallax effect) 效果。
- **色彩**: 使用高对比度的霓虹青和霓虹粉，打破主站的蓝紫调性。
- **动画**: 采用从顶部落下的 `slide-in-from-top` 效果。

## 交付要求 (Deliverables)

卡片在悬停时应有显著的缩放和色彩扩散效果。在移动端，两张大卡片需垂直排列。
