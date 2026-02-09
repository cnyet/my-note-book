# Labs 页面设计文档

**对应设计稿**:
- 桌面版: `labs-desktop.png`
- 移动版: `labs-mobile.png`

**页面路由**: `/labs`

**页面定位**: 实验性项目展示，展示个人开发的原型项目 (如贪吃蛇)

**MVP状态**: ⏳ MVP后迭代 (Week 5-6)

---

## 视觉设计规范 (Genesis + 故障艺术)

| 元素 | 桌面版 (≥1024px) | 移动版 (<768px) |
|------|------------------|-----------------|
| **整体布局** | 复杂网格 + 中央预览区 | 垂直列表 |
| **背景** | 深渊黑 + 扫描线效果 + Glitch故障艺术 | 深渊黑 + 故障艺术 |
| **标题** | "WORK-AGENTS // LABS" 大字号故障文字 | "WORK-AGENTS LABS" 霓虹发光 |
| **边框** | 霓虹彩色边框 (粉/绿/蓝/橙) | 霓虹彩色边框 |
| **特效** | 扫描线 + Glitch故障 + 数据流 | 简化故障效果 |

---

## 核心功能区块

### 1. 顶部标签栏

**标签项**:
- EXPERIMENTS (默认选中)
- DATA_LOGS
- SYSTEM_STATUS

**视觉设计**:
- 选中状态: 霓虹下划线 + 发光
- 悬停状态: 文字颜色变化

---

### 2. 中央展示区 (桌面版专属)

**三栏布局**:
```
┌──────────────┬─────────────────────┬──────────────┐
│ 项目列表      │   大图预览区         │   项目详情    │
│              │                     │              │
│ ▶ NEURAL-    │  [项目截图/演示]     │  名称:       │
│   SYNTH      │                     │  NEURAL-SYNTH│
│   [EXECUTE]  │                     │              │
│              │                     │  版本: v0.9  │
│ ▶ QUANTUM-   │                     │              │
│   FLOW       │                     │  描述:...    │
│   [EXECUTE]  │                     │              │
│              │                     │  [ACCESS_BETA]│
└──────────────┴─────────────────────┴──────────────┘
```

**左侧项目列表**:
- 项目名称 (大写)
- EXECUTE_TEST 按钮 (绿色霓虹)
- 选中状态: 霓虹边框高亮

**中央预览区**:
- 项目截图或实时演示
- 支持 iframe 嵌入实验项目

**右侧详情区**:
- 项目完整信息
- ACCESS_BETA 按钮 (蓝色霓虹)

---

### 3. LATEST_BUILDS 区域

**布局**: 横向滚动卡片列表

**内容**:
- 最新构建版本展示
- 小卡片形式: 缩略图 + 版本号 + 日期

---

### 4. COMMUNITY_HACKS 区域

**布局**: 网格或横向滚动

**内容**:
- 社区贡献项目展示
- 每项包含: 图标 + 名称 + 描述 + EXECUTE_TEST按钮

---

## 实验项目卡片设计

### 示例项目

| 项目 | 主题色 | 版本 | 描述 |
|------|--------|------|------|
| **Quantum Tasker** | 蓝色 | v0.9 | Optimize with uncertainty |
| **Neural Net Sandbox** | 绿色 | - | Test autonomous flows. Data volatile. |
| **Synthetik Voice** | 橙色 | - | Generative audio prototypes. Unstable. |

### 卡片结构 (移动版)

```
┌─────────────────────────────────┐
│  [图标]  PROJECT_NAME    [状态]  │
│         版本号                   │
│         描述文字                 │
│                    [ACCESS/RUN]  │
└─────────────────────────────────┘
```

---

## 故障艺术特效

### Glitch 效果

```css
.glitch-text {
  animation: glitch 1s linear infinite;
}

@keyframes glitch {
  2%, 64% { transform: translate(2px,0) skew(0deg); }
  4%, 60% { transform: translate(-2px,0) skew(0deg); }
  62% { transform: translate(0,0) skew(5deg); }
}
```

### 扫描线效果

```css
.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2)
  );
  background-size: 100% 4px;
  pointer-events: none;
}
```

### 数据流动画

- 背景细微的数据流线条
- 使用 CSS animation 或 Canvas

---

## iframe 集成实验项目

### 项目示例: 贪吃蛇游戏

```tsx
<div className="lab-preview-frame">
  <iframe
    src="/labs/snake-game/index.html"
    width="100%"
    height="600px"
    sandbox="allow-scripts allow-same-origin"
  />
  <div className="scanlines" />
</div>
```

### 安全考虑
- 使用 sandbox 属性限制权限
- 与主应用隔离
- 不共享敏感数据

---

## Genesis 组件使用清单

| 组件 | 位置 | 定制 |
|------|------|------|
| `GlassCard` | 卡片容器 | 添加霓虹边框 + glitch类 |
| `NeonButton` | 操作按钮 | 多色方案 (绿/蓝/橙) |
| `CyberGrid` | 可选背景 | 电路板纹理增强 |
| `GradientText` | 标题 | 配合glitch动画 |

---

## 响应式适配

### 桌面版 (≥1024px)
- 完整三栏布局
- 所有特效启用
- 横向滚动区域

### 平板版 (768px - 1023px)
- 简化布局
- 保留核心功能
- 减少特效

### 移动版 (<768px)
- 垂直列表
- 单卡片全宽
- 基础故障效果

---

## 技术实现要点

### 故障效果实现

```tsx
// GlitchText组件
const GlitchText = ({ children }) => (
  <span className="relative inline-block">
    <span className="glitch-base">{children}</span>
    <span className="glitch-layer-1" aria-hidden>{children}</span>
    <span className="glitch-layer-2" aria-hidden>{children}</span>
  </span>
);
```

### 扫描线叠加

```tsx
// 全局扫描线层
const Scanlines = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50 opacity-10"
    style={{
      background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)',
      backgroundSize: '100% 4px'
    }}
  />
);
```

---

## 相关文档

- [设计规范](../genesis-design-system.md)
- [Tools页面](./tools.md)
- [实验项目开发指南](../../../docs/development/labs-development.md)
