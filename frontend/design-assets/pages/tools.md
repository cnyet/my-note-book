# Tools 页面实现提示词 (Optimized)

## 任务目标 (Objective)

作为一名资深前端工程师，你的任务是实现 My-Note-Book 的“专业工具栈”页面。该页面展示供开发者和设计师使用的核心生产力工具，视觉上应体现精密感与专业度。

## 核心上下文 (Context)

- **页面定位**: 工具展示、命令行参考与组件实验室入口。
- **设计风格**: Lumina Professional (侧重于功能性与精密感的玻璃态)。
- **视觉主题**: “The Pro-Grade Utility Stack” (专业级工具堆栈)。

## 页面架构与区块 (Structure)

### 1. 标题头 (Section Header)

- **标签**: "Toolkit" (工具箱)。
- **主标题**: "The Pro-Grade Utility Stack."。
- **副标题**: 强调工具箱与设计环境的无缝集成。

### 2. 旗舰工具区 (Featured Tools)

- **布局**: 2列大卡片。
- **项目 A: MyNoteBook CLI**:
  - 视觉: 靛蓝色主题，带 `Terminal` 图标。
  - 内容: 描述其作为“设计系统即代码”的地位。
  - 核心展示: 一个代码预览窗口，展示命令 `mynotebook sync --all --force`。
- **项目 B: Component Studio**:
  - 视觉: 紫色主题，带 `Layers` 图标。
  - 交互按钮: "Open Studio" (点击打开实验室)。

### 3. 工具矩阵 (Tool Matrix)

- **布局**: 4列紧凑卡片。
- **项目**:
  - **Visual Diff**: 发现布局回归。
  - **Flow Audit**: 映射用户旅程。
  - **Asset Baker**: 优化图像资产。
  - **Type Genius**: AI 字效处理。
- **样式**: 极简玻璃卡片，悬停时背景轻微变白。

### 4. 工具页脚 (Tools Footer)

- **内容**: 包含多列详细链接 (Development, Tokens, Status)。
- **版本标识**: 显示类似 `Latest v2.4.12` 的版本号和 `Stable Build` 标签。

## 视觉细节规范 (Specs)

- **排版**: 使用单口字体 (`font-mono`) 来展示代码片段。
- **动画**: 采用从底部向上弹出的 `slide-in-from-bottom` 动画。
- **边框**: 旗舰工具卡片使用更明显的发光边框 (`border-indigo-500/30`) 以示区分。

## 交付要求 (Deliverables)

确保代码片段的可读性和拷贝按钮的潜在交互。响应式布局在手机端应变为单列。
