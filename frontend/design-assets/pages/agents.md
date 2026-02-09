# Agents 页面设计文档

**对应设计稿**:
- 桌面版: `agents-desktop.png`
- 移动版: `agents-mobile.png`

**页面路由**: `/agents`

**页面定位**: 核心功能页，集成 LobeChat AI对话 + 5个内部智能体工作台

---

## 整体布局架构

```
┌─────────────────────────────────────────────────────────────┐
│  Tab导航栏 (LobeChat | News | Outfit | Task | Life | Review) │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌─────────────────────────┐  │
│  │                          │  │  News Agent    [全息图]  │  │
│  │   LobeChat               │  │  [描述文字]              │  │
│  │   ┌──────────────────┐   │  │  [能力指标条]            │  │
│  │   │ 消息气泡区域      │   │  │  [状态标签]              │  │
│  │   │ - 用户消息(右)    │   │  ├─────────────────────────┤  │
│  │   │ - AI回复(左)      │   │  │  Outfit Agent  [全息图]  │  │
│  │   │ - 知识图谱可视化  │   │  │  [穿搭图片/占位图]       │  │
│  │   └──────────────────┘   │  │  [生成中加载动画]        │  │
│  │   [输入框] [发送按钮]     │  │  [状态标签]              │  │
│  │                          │  ├─────────────────────────┤  │
│  └──────────────────────────┘  │  ...其他Agent卡片       │  │
│         (桌面版占50%)          │       (桌面版占50%)      │  │
└─────────────────────────────────────────────────────────────┘
```

---

## 视觉设计规范

| 元素 | 桌面版 (≥1024px) | 移动版 (<768px) |
|------|------------------|-----------------|
| **整体布局** | 左右分栏 (LobeChat左50% + Agent网格右50%) | 垂直堆叠 (Tab切换或全屏列表) |
| **背景** | 深渊黑 + 电路板纹理 | 深渊黑 + 电路板纹理 |
| **Tab栏** | 顶部水平Tab (LobeChat + 5个Agent) | 顶部导航栏 (Agents/Projects/Tasks/Tools/Settings) |
| **卡片** | 2×3网格，全屏全息图背景 | 垂直列表，图标+状态+描述 |

---

## LobeChat 集成

### 集成方式
- **技术方案**: iframe 嵌入
- **来源**: 本地Docker部署的 LobeChat 服务
- **地址**: `http://localhost:3210`
- **通信**: postMessage API 实现跨域数据交换

### 布局位置
- **桌面版**: 左侧50%区域，固定高度
- **移动版**: 独立Tab页，全屏显示

### 功能配置
- 完整聊天界面 (消息列表、输入框、发送按钮)
- 知识图谱可视化 (底部小窗)
- 调用5个智能体能力 (可选开关 A/B/C):
  - A) 实时调用，不落库
  - B) 调用后写入当日记录
  - C) 两者都需要
- 对话历史保存15天
- 支持清空某天/全部历史

### iframe 配置
```tsx
<iframe
  src="http://localhost:3210"
  width="100%"
  height="100%"
  allow="microphone; camera"
  sandbox="allow-same-origin allow-scripts allow-popups"
/>
```

---

## 5个智能体卡片设计

### 卡片通用结构

```
┌─────────────────────────────┐
│  [全屏全息图背景]            │
│                             │
│  Agent名称                   │
│  描述文字                    │
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │High │ │Mid  │ │Low  │   │
│  │ 70% │ │ 20% │ │ 10% │   │
│  └─────┘ └─────┘ └─────┘   │
│                             │
│  [状态: Online]              │
└─────────────────────────────┘
```

### Agent配色方案

| Agent | 主题色 | 用途 | 图标 |
|-------|--------|------|------|
| News Agent | 青色 (#00f2ff) | AI资讯 | NewspaperIcon |
| Outfit Agent | 蓝色 (#3b82f6) | 穿搭推荐 | ShirtIcon |
| Task Agent | 绿色 (#10b981) | 任务管理 | CheckCircleIcon |
| Life Agent | 粉色 (#ec4899) | 健康生活 | HeartIcon |
| Review Agent | 橙色 (#f59e0b) | 每日复盘 | ChartBarIcon |

---

## Outfit Agent 特殊交互

### 触发时机
- **条件**: 用户首次进入 Agents 页面
- **判断**: 当日未生成过穿搭建议

### 生成流程
```
用户进入 Agents 页面
       ↓
检查今日是否已生成
       ↓
未生成 → 显示加载动画 → 调用Ollama API
       ↓
生成中 (5-30秒)
       ↓
成功 → 显示文字建议 + 插画图片
失败 → 显示固定静态占位图
```

### 加载状态
- 骨架屏或旋转Spinner
- 文字提示: "正在为您生成今日穿搭..."

### 失败处理
- 显示固定静态占位图 (预设图片路径: `/images/outfit-placeholder.png`)
- 提供 [重新生成] 按钮

---

## Task Agent 交互

### 待办事项展示
- 列表形式展示今日待办 (最多10条)
- 每条任务包含: 复选框 + 标题 + 优先级标签

### 完成操作
- 点击复选框标记完成
- 完成后任务变灰 (opacity: 0.5, text-decoration: line-through)
- 支持展开查看任务详情

### 数据同步
- 完成状态实时同步到后端
- 影响 Review Agent 的复盘数据

---

## 移动版适配

### 布局变化
- 垂直列表展示5个Agent卡片
- 每个卡片: 图标(左) + 信息(中) + 按钮(右)

### 状态指示
- **Online**: 绿色圆点
- **Busy**: 黄色圆点
- **Idle**: 灰色圆点
- **Training**: 紫色圆点

### 底部导航
- Home | Agents | Notifications | Profile
- Agents图标带 `OnlinePulse` 指示器

---

## Genesis 组件使用清单

| 组件 | 位置 | 用途 |
|------|------|------|
| `OnlinePulse` | 状态标签 | 实时在线状态 |
| `GlassCard` | Agent卡片 | 玻璃态容器+霓虹边框 |
| `NeonButton` | 操作按钮 | Deploy/Chat等 |
| `GradientText` | Agent名称 | 可选渐变效果 |
| `ParticleBg` | 可选背景 | 动态粒子效果 |

---

## 状态管理 (Redux)

### Slice设计

```typescript
// agentSlice
{
  agents: {
    news: { data, loading, error, lastUpdated },
    outfit: { data, loading, error, generating },
    task: { data, loading, error, tasks[] },
    life: { data, loading, error },
    review: { data, loading, error }
  },
  lobeChat: {
    enabled: boolean,
    iframeReady: boolean,
    config: { mode: 'A' | 'B' | 'C' }
  }
}
```

---

## 技术实现要点

### 数据获取
- 使用 TanStack Query (React Query) 管理服务端状态
- 使用 Redux 管理客户端状态

### iframe通信
```typescript
// 向LobeChat发送消息
iframeRef.current.contentWindow.postMessage({
  type: 'CALL_AGENT',
  agent: 'outfit',
  payload: { date: '2026-02-09' }
}, 'http://localhost:3210');

// 接收LobeChat消息
window.addEventListener('message', (e) => {
  if (e.origin === 'http://localhost:3210') {
    // 处理消息
  }
});
```

### 响应式实现
```tsx
// 桌面版: 左右分栏
<div className="grid grid-cols-2 gap-6">
  <LobeChatPanel />
  <AgentGrid />
</div>

// 移动版: Tab切换或垂直列表
<div className="flex flex-col">
  {agents.map(agent => <AgentCard key={agent.id} {...agent} />)}
</div>
```

---

## 相关文档

- [设计规范](../genesis-design-system.md)
- [Home页面](./home.md)
- [LobeChat部署指南](../../../docs/deployment/lobechat.md)
- [API集成指南](../../../docs/api/frontend-integration-guide.md)
