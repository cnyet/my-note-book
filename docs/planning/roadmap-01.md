# work-agents 项目路线图 (Roadmap)

> **版本**: v1.0
> **状态**: 执行中
> **最后更新**: 2026-02-06
> **目标**: 3周交付可使用的MVP产品

---

## 项目总览

**产品目标**: 个人智能体工作流编排平台
**交付时间**: 3周（21天）
**交付标准**: 可日常使用，可Docker部署
**开发模式**: 敏捷冲刺，每日可用版本

---

## Phase 1: 基础架构 + News Agent (Week 1)

**目标**: 搭建技术基础，实现第一个自动化智能体

### Day 1-2: 项目基础架构搭建

**任务清单**:

- [ ] 初始化Next.js 15项目（App Router）
- [ ] 配置Tailwind CSS 4 + Genesis Design System
- [ ] 安装Shadcn/UI基础组件
- [ ] 配置Framer Motion
- [ ] 创建项目目录结构
- [ ] 编写基础组件（GenesisCard, GlowButton, GradientText）

**Day 2里程碑**:

```
✅ 可以运行项目，看到Genesis风格的页面
✅ 组件库包含：Card, Button, Input, Header
```

**关键配置**:

```typescript
// tailwind.config.ts
colors: {
  abyss: '#0a0a0f',
  void: '#111118',
  surface: '#1a1a24',
  primary: '#00f2ff',
  accent: '#bc13fe',
}
```

---

### Day 3-4: 用户认证系统

**任务清单**:

- [ ] 搭建FastAPI后端基础
- [ ] 配置SQLite数据库
- [ ] 实现JWT认证（登录/注册/刷新）
- [ ] 前端登录/注册页面
- [ ] 全局认证状态管理（Zustand）

**Day 4里程碑**:

```
✅ 可以注册/登录账号
✅ 登录后显示用户信息
✅ 未登录无法访问受保护页面
```

**API端点**:

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

---

### Day 5-7: News Agent实现

**任务清单**:

- [ ] 选择爬虫方案（Playwright）
- [ ] 实现数据源解析器（机器之心、36氪、AI Base作为备用）
- [ ] 实现新闻摘要生成（调用Ollama本地模型）
- [ ] 创建定时任务调度（每天9:00自动执行）
- [ ] 前端News展示组件
- [ ] 数据库保存新闻数据（15天过期）

**Day 7里程碑（Week 1结束）**:

```
✅ 打开首页看到今日AI资讯
✅ 新闻自动爬取、摘要、展示
✅ 可以点击阅读全文
✅ Week 1目标完成：第一个智能体可用
```

**News Agent架构**:

```python
class NewsAgent:
    def __init__(self):
        self.sources = [
            RSSSource("机器之心", "https://..."),
            RSSSource("36氪", "https://..."),
            AISource("AI Base", "https://www.aibase.com/zh/news/"),
        ]

    async def run(self):
        articles = []
        for source in self.sources:
            try:
                data = await source.fetch()
                summary = await self.summarize(data)  # Ollama
                articles.append(summary)
            except:
                continue
        return articles
```

---

## Phase 2: Task Agent + Review Agent闭环 (Week 2)

**目标**: 实现任务管理和每日复盘的核心闭环

### Day 8-9: Task Agent - 表单功能

**任务清单**:

- [ ] 设计Task问卷表单（5个问题，详见MVP-SCOPE.md）
- [ ] 实现表单页面
- [ ] 后端Task生成逻辑（调用Ollama分析表单）
- [ ] 任务数据库存储（简化版，使用JSON字段）
- [ ] 任务展示组件（卡片/列表）

**Day 9里程碑**:

```
✅ 可以填写今日任务问卷
✅ 提交后AI生成今日待办
✅ 在页面看到生成的任务列表
```

**Task问卷设计**:

```typescript
const taskQuestions = [
  { id: "priority", question: "今天最重要的3件事是什么？", type: "textarea" },
  { id: "meetings", question: "今天有哪些会议/约会？", type: "textarea" },
  {
    id: "energy",
    question: "今天的精力状态如何？",
    type: "select",
    options: ["高", "中", "低"],
  },
  { id: "deadline", question: "今天有哪些截止日期？", type: "textarea" },
  { id: "focus", question: "今天需要特别关注什么？", type: "textarea", optional: true },
];
```

---

### Day 10-11: Review Agent - 数据汇总

**任务清单**:

- [ ] 读取当日Task数据
- [ ] 实现复盘报告生成逻辑（调用Ollama）
- [ ] Review页面设计
- [ ] 数据可视化（简单的统计图表）
- [ ] 用户偏好提取和保存（永久存储）

**Day 11里程碑**:

```
✅ 晚上可以查看今日复盘
✅ 看到任务完成情况统计
✅ 系统提取的工作偏好已保存
```

---

### Day 12-14: Home页仪表板整合

**任务清单**:

- [ ] Home页布局设计（4卡片仪表板）
- [ ] 集成News展示卡片
- [ ] 集成Task快速入口
- [ ] 集成Review预览
- [ ] 添加"开始今日工作流"按钮
- [ ] 响应式适配

**Day 14里程碑（Week 2结束）**:

```
✅ 首页显示今日完整工作流状态
✅ 可以一键开始工作流
✅ 移动端正常显示
✅ Week 2目标完成：核心闭环可用
```

**Home页布局**:

```jsx
<DailyDashboard>
  <NewsCard data={todayNews} />
  <QuickActionCard onClick={() => navigateToTask()} label="填写今日任务" />
  <TaskPreviewCard tasks={todayTasks} />
  <ReviewPreviewCard onClick={() => navigateToReview()} />
  <WorkflowStatusIndicator status={workflowStatus} />
</DailyDashboard>
```

---

## Phase 3: 工作流编排 + 优化 + 部署 (Week 3)

**目标**: 实现自动化编排，提升用户体验，完成MVP交付

### Day 15-17: 基础工作流编排

**任务清单**:

- [ ] 设计简化版工作流引擎（顺序执行）
- [ ] 实现工作流状态机
- [ ] 工作流可视化（简单的状态指示器）
- [ ] 自动执行News（早上9点）
- [ ] Task → Review数据流打通
- [ ] Dashboard管理后台基础功能

**Day 17里程碑**:

```
✅ 工作流自动触发News
✅ 完成Task后数据自动流向Review
✅ 可以看到工作流执行状态
✅ Dashboard可以查看基础数据
```

**MVP工作流定义**:

```typescript
interface Workflow {
  id: string;
  status: "idle" | "running" | "waiting" | "completed";
  steps: WorkflowStep[];
  currentStep: number;
}

const mvpDailyWorkflow: Workflow = {
  steps: [
    { agent: "news", trigger: "schedule", time: "09:00" },
    { agent: "task", trigger: "user_input" },
    { agent: "review", trigger: "user_click" },
  ],
};
```

**注意**: MVP排除Outfit和Life Agent，仅实现News→Task→Review核心闭环。

---

### Day 18-19: UI动效优化

**任务清单**:

- [ ] 添加卡片辉光动效
- [ ] 实现入场动画
- [ ] 添加加载状态（骨架屏）
- [ ] 工作流执行动画（脉冲效果）
- [ ] 错误状态处理

**Day 19里程碑**:

```
✅ 所有页面都有流畅动效
✅ 加载状态优雅
✅ 交互反馈明确
```

---

### Day 20-21: 测试 + Docker部署 + 文档

**任务清单**:

- [ ] 端到端测试（关键流程：News→Task→Review）
- [ ] 性能优化（LCP < 1.5s, API P95 < 200ms）
- [ ] 创建Docker配置（前端+后端+数据库）
- [ ] 编写部署文档
- [ ] 编写README文档（项目介绍、快速开始）
- [ ] Bug修复

**Day 21里程碑（MVP完成）**:

```
✅ 产品可以日常使用
✅ 可以Docker一键部署
✅ 有完整的部署和使用文档
✅ MVP完成，进入日常使用阶段
```

---

## MVP范围总结

### ✅ MVP包含（3周交付）

- **核心功能**: 用户认证 + News Agent + Task Agent + Review Agent
- **前端页面**: Home、Agents（静态）、Task、Review、Login/Register、Dashboard
- **管理后台**: Dashboard基础展示、用户管理
- **技术特性**: API驱动、JWT认证、数据持久化、Docker部署

### ❌ MVP排除（移至Phase 4）

- **智能体**: Outfit Agent、Life Agent
- **功能**: LobeChat集成、Tools、Labs、Blog完整版
- **技术**: WebSocket实时通信、Redis缓存、高级编排引擎

> **详细定义**: 详见 [MVP-SCOPE.md](./MVP-SCOPE.md)

---

## 风险预案

### 风险1: News爬取失败

**预案**:

- Day 7前准备好AI Base作为备用源
- 如果爬取都不行，改为手动输入链接让AI总结

### 风险2: Ollama调用延迟高

**预案**:

- 添加"正在思考..."加载状态
- 考虑使用流式输出提升体验

### 风险3: 进度落后

**预案**:

- Week 2优先保证Task+Review闭环（核心功能）
- Week 3工作流编排可以简化（只做顺序执行，状态指示器简化）
- UI动效可以降级（基础过渡效果即可）

---

## 每日检查清单

每天结束时确认：

- [ ] 代码可以运行，没有明显Bug
- [ ] 主要功能可用
- [ ] 代码已提交Git
- [ ] 当日里程碑达成

---

## 后续规划（Phase 4+）

### Phase 4: 体验增强（约2-3周）

- Outfit Agent完整实现（天气API + Nano Banana图片生成）
- Life Agent完整实现（健康记录 + AI建议）
- 工作流可视化升级（节点图，类似n8n）
- LobeChat集成（WebSocket实时通信）

### Phase 5: 功能完善（约3-4周）

- Tools完整功能（分类、搜索、CRUD）
- Labs完整功能（在线计数器、WebSocket实时更新）
- Blog完整功能（富文本编辑、标签、搜索）
- 可观测性Dashboard（监控、日志、告警）
- 移动端优化

### Phase 6: 扩展功能（长期规划）

- 多用户支持（RBAC、SSO）
- 社区功能（评论、点赞、分享）
- 高级编排（条件分支、循环、并行）
- 第三方集成（GitHub、Notion、Google Calendar）
- 性能优化（Redis缓存、CDN、负载均衡）

---

## 参考文档

- **产品需求**: [PRD-01.md](./PRD-01.md)
- **需求访谈**: [QA.md](./QA.md)
- **架构设计**: [../design/architecture.md](../design/architecture.md)
- **API设计**: [../design/api-design.md](../design/api-design.md)

---

**文档结束**

> 本路线图是执行计划，实际开发过程中会根据进度动态调整。
> 每周结束时更新进度状态。
