# Tools 页面设计文档

**对应设计稿**:
- 桌面版: `tools-desktop.png`
- 移动版: `tools-mobile.png`

**页面路由**: `/tools`

**页面定位**: 小工具集合，提供实用计算/转换功能 (计算器、单位转换等)

**MVP状态**: ⏳ MVP后迭代 (Week 5-6)

---

## 视觉设计规范 (Genesis Design System)

| 元素 | 桌面版 (≥1024px) | 移动版 (<768px) |
|------|------------------|-----------------|
| **整体布局** | 2×2网格卡片 | 垂直列表 |
| **背景** | 深渊黑 + 电路板图案 | 赛博朋克城市夜景 |
| **筛选栏** | 横向标签 (All/Development/Automation/Intelligence/Creative) | 两行标签滚动 |
| **卡片** | 霓虹边框 + 图标 + 描述 + 按钮 | 简化卡片 |
| **按钮** | 彩色霓虹 (蓝/粉/青/紫) | 彩色霓虹 |

---

## 核心功能

### 1. 分类筛选

**分类标签**:
- **All** (active) - 全部工具
- **Development** - 开发工具
- **Automation** - 自动化工具
- **Intelligence** - 智能工具
- **Creative** - 创意工具

**视觉设计**:
- 未选中: 透明背景 + 霓虹边框
- 选中: 填充背景色 + 发光效果
- 悬停: 轻微放大 + 亮度提升

---

### 2. 工具卡片网格 (桌面版 2×2)

**示例工具**:

| 工具名称 | 描述 | 按钮 | 主题色 |
|----------|------|------|--------|
| **CodeWeaver** | AI-assisted coding agent | [ACTIVATE] | 青色 |
| **AutoFlow** | Automate repetitive workflows | [DEPLOY] | 粉色 |
| **NeuralMind** | Cognitive data analysis | [ENGAGE] | 蓝色 |
| **Artifex** | Generative creative suite | [LAUNCH] | 紫色 |

**卡片结构**:
```
┌─────────────────────────────┐
│  ┌─────────┐                │
│  │  [图标]  │  工具名称       │
│  │ (发光)  │  描述文字       │
│  └─────────┘                │
│                             │
│  [   ACTIVATE   ]           │
│     (霓虹按钮)               │
└─────────────────────────────┘
```

---

### 3. 工具卡片列表 (移动版)

**示例工具**:

| 工具名称 | 描述 | 按钮 | 主题色 |
|----------|------|------|--------|
| **SynthBrain** | Advanced text generation | [Activate] | 绿色 |
| **CodeWeaver** | AI code assistant | [Use] | 蓝色 |
| **DataDrill** | Data analysis & viz | [Connect] | 橙色 |
| **TimeAnalyst** | Time tracking & analytics | [Open] | 紫色 |

---

## 工具卡片设计规范

### 视觉元素

| 元素 | 规格 |
|------|------|
| **卡片背景** | GlassCard 玻璃态 |
| **边框** | 2px 霓虹色，带发光效果 |
| **图标** | Lucide icons，48px，发光 |
| **工具名称** | 20px，白色，bold |
| **描述** | 14px，灰色(#a0a0b0) |
| **按钮** | NeonButton，全宽 |

### 配色方案

```css
/* 工具主题色 */
--tool-cyan: #00f2ff;      /* CodeWeaver */
--tool-pink: #ff006e;      /* AutoFlow */
--tool-blue: #3b82f6;      /* NeuralMind */
--tool-purple: #bc13fe;    /* Artifex */
--tool-green: #10b981;     /* SynthBrain */
--tool-orange: #f59e0b;    /* DataDrill */
```

---

## 工具示例清单

### 开发工具 (Development)
- **CodeWeaver**: AI代码辅助
- **RegexTester**: 正则表达式测试
- **JSONFormatter**: JSON格式化

### 自动化工具 (Automation)
- **AutoFlow**: 工作流自动化
- **TaskScheduler**: 任务调度器
- **FileRenamer**: 批量文件重命名

### 智能工具 (Intelligence)
- **NeuralMind**: 数据分析
- **TextSummarizer**: 文本摘要
- **SentimentAnalyzer**: 情感分析

### 创意工具 (Creative)
- **Artifex**: 生成式创意套件
- **ColorPalette**: 配色方案生成
- **IconGenerator**: 图标生成器

---

## 背景设计

### 桌面版背景
- 深渊黑底色
- 电路板纹理图案
- 细微的霓虹线条

### 移动版背景
- 赛博朋克城市夜景
- 高楼剪影
- 霓虹灯光效果

---

## Genesis 组件使用清单

| 组件 | 位置 | 定制 |
|------|------|------|
| `GlassCard` | 工具卡片 | 彩色霓虹边框 |
| `NeonButton` | 操作按钮 | 多色主题 |
| `CyberGrid` | 可选背景 | 电路板纹理 |

---

## 响应式适配

### 桌面版 (≥1024px)
- 2×2网格布局
- 卡片较大，信息完整
- 背景电路板纹理

### 平板版 (768px - 1023px)
- 2列网格
- 卡片适中
- 简化背景

### 移动版 (<768px)
- 单列列表
- 卡片紧凑
- 城市夜景背景

---

## 技术实现要点

### 筛选功能

```typescript
// Redux状态管理
const toolsSlice = createSlice({
  name: 'tools',
  initialState: {
    category: 'all', // all | development | automation | intelligence | creative
    tools: [],
    loading: false
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    }
  }
});
```

### 卡片网格布局

```tsx
// 桌面版
<div className="grid grid-cols-2 gap-6">
  {filteredTools.map(tool => (
    <ToolCard key={tool.id} {...tool} />
  ))}
</div>

// 移动版
<div className="flex flex-col gap-4">
  {filteredTools.map(tool => (
    <ToolCardCompact key={tool.id} {...tool} />
  ))}
</div>
```

### 彩色霓虹边框

```tsx
const ToolCard = ({ tool }) => (
  <GlassCard
    className={cn(
      "border-2 transition-all duration-300",
      `border-[${tool.color}] hover:shadow-[0_0_20px_${tool.color}]`
    )}
  >
    {/* 卡片内容 */}
  </GlassCard>
);
```

---

## 工具管理后台

工具的增删改查在 **管理后台** 完成，前台仅展示和运行。

### 工具配置字段
- 名称
- 描述
- 图标
- 分类
- 主题色
- 按钮文字
- iframe入口地址 (如有)

---

## 相关文档

- [设计规范](../genesis-design-system.md)
- [Labs页面](./labs.md)
- [工具开发指南](../../../docs/development/tools-development.md)
