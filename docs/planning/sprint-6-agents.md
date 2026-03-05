# Sprint 6: 5 个 Agent 功能实现

**状态**: 进行中
**分支**: `feature/sprint-6-agents`
**开始日期**: 2026-03-05
**优先级**: MVP → News + Task + Review

---

## 📋 需求摘要

### 核心目标
- 记录生活、工作、学习，展示个人开发作品
- 规范化工作流程，减少重复性工作
- 测试 AI 开发能力

### 5 个 Agent 优先级
| Agent | 优先级 | 核心功能 | 独特 Icon |
|-------|--------|----------|----------|
| News Agent | P0 | AI 资讯爬取 + 摘要 | 📰 |
| Task Agent | P0 | 任务管理 | ✅ |
| Life Agent | P0 | 健康数据记录 | 💪 |
| Review Agent | P1 | 每日复盘 | 📝 |
| Outfit Agent | P2 | 穿搭推荐 + 图片生成 | 👔 |

### 工作流设计
```
每天早上 8:00 定时执行：
News+Outfit → Task 表单 → Life 表单 → Review 复盘

失败处理：
- 定时失败则每天第一次打开页面时自动执行 News+Outfit
- 各 Agent 独立运行，一个失败不影响其他
```

---

## 🏗️ 技术架构

### 后端技术栈
- **框架**: FastAPI
- **定时任务**: APScheduler (轻量级，进程内)
- **数据库**: SQLite
- **AI**: Ollama (deepseek-r1 模型)

### 前端技术栈
- **框架**: Next.js 15.5 + React 19.1
- **UI 库**: Tailwind CSS + Framer Motion + Ant Design (管理后台)
- **设计风格**: Duralux (Sprint 5 已完成)

### LobeChat 集成
- **方式**: Iframe 嵌入
- **位置**: Agents 页面右侧面板
- **历史**: 保存 15 天

---

## 🎨 页面设计

### 前台 Agents 列表页（参考 ai-bot.cn）
**布局**: 卡片网格布局
- 每行 3-4 个卡片（响应式）
- 每个卡片包含：Icon、名称、角色、状态徽章、描述、"使用 Agent"按钮
- 右侧 sticky sidebar：LobeChat 面板

### 前台 Agent 详情页（每个 Agent 独立页面）
**通用结构**:
- Header：Agent 名称、Icon、状态
- 功能区域：各 Agent 专属功能
- 侧边栏：历史纪录/快捷操作

### 管理后台 Agents 管理页
**功能**:
- 5 个 Agent 的 CRUD 操作
- 独特 Icon 配置（emoji 或 URL）
- 启动/停止控制
- 状态监控（Online/Offline/Idle）
- 拖拽排序

---

## 📁 任务分解

### Phase 1: News Agent (P0) - 已有基础

#### 后端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 1.1.1 | `agents/news/crawler.py` | ✅ | 新闻爬取 (Google Research, MIT, Hacker News, 机器之心，36 氪，arXiv, Reddit) |
| 1.1.2 | `agents/news/summarizer.py` | ✅ | AI 摘要生成 (Ollama) |
| 1.1.3 | `agents/news/scheduler.py` | ✅ | APScheduler 定时任务 |
| 1.1.4 | `agents/news/agent.py` | ✅ | NewsAgent 主类 |
| 1.1.5 | `api/v1/news.py` | ✅ | REST API 端点 |
| 1.1.6 | `models/news_source.py` | ✅ | 数据库模型 (NewsSource, NewsArticle) |

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 1.2.1 | `app/(public)/agents/page.tsx` | ⏳ | Agents 列表页（Duralux 风格改造） |
| 1.2.2 | `app/(public)/agents/news/page.tsx` | ✅ | News Agent 专属页面 |
| 1.2.3 | `components/news/NewsList.tsx` | ✅ | 新闻列表组件 |
| 1.2.4 | `components/news/NewsCard.tsx` | ✅ | 新闻卡片组件 |
| 1.2.5 | `components/news/NewsStats.tsx` | ✅ | 统计组件 |

---

### Phase 2: Task Agent (P0)

#### 后端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 2.1.1 | `models/task_agent.py` | ⏳ | 数据库模型 (Task, TaskCategory) |
| 2.1.2 | `schemas/task_agent.py` | ⏳ | Pydantic Schemas |
| 2.1.3 | `api/v1/admin/task_agent.py` | ⏳ | REST API 端点 |
| 2.1.4 | `agents/task/agent.py` | ⏳ | TaskAgent 主类 |

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 2.2.1 | `app/(public)/agents/task/page.tsx` | ⏳ | Task Agent 专属页面 |
| 2.2.2 | `components/features/task/TaskForm.tsx` | ⏳ | 问答表单组件 |
| 2.2.3 | `components/features/task/TaskBoard.tsx` | ⏳ | 任务看板 (图表展示) |
| 2.2.4 | `components/features/task/TaskItem.tsx` | ⏳ | 任务项 (完成/修改/删除) |
| 2.2.5 | `components/features/task/TaskCard.tsx` | ⏳ | 任务卡片 |

---

### Phase 3: Life Agent (P0)

#### 后端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 3.1.1 | `models/life_agent.py` | ⏳ | 数据库模型 (HealthMetrics, HealthSuggestion) |
| 3.1.2 | `schemas/life_agent.py` | ⏳ | Pydantic Schemas |
| 3.1.3 | `api/v1/admin/life_agent.py` | ⏳ | REST API 端点 |
| 3.1.4 | `agents/life/agent.py` | ⏳ | LifeAgent 主类 |

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 3.2.1 | `app/(public)/agents/life/page.tsx` | ⏳ | Life Agent 专属页面 |
| 3.2.2 | `components/features/life/HealthForm.tsx` | ⏳ | 健康数据表单 |
| 3.2.3 | `components/features/life/HealthChart.tsx` | ⏳ | 健康数据图表 |
| 3.2.4 | `components/features/life/SuggestionCard.tsx` | ⏳ | AI 建议卡片 |

---

### Phase 4: Review Agent (P1)

#### 后端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 4.1.1 | `models/review_agent.py` | ⏳ | 数据库模型 (DailyReview, UserPreference) |
| 4.1.2 | `schemas/review_agent.py` | ⏳ | Pydantic Schemas |
| 4.1.3 | `api/v1/admin/review_agent.py` | ⏳ | REST API 端点 |
| 4.1.4 | `agents/review/agent.py` | ⏳ | ReviewAgent 主类 |

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 4.2.1 | `app/(public)/agents/review/page.tsx` | ⏳ | Review Agent 专属页面 |
| 4.2.2 | `components/features/review/DailyReview.tsx` | ⏳ | 每日复盘组件 |
| 4.2.3 | `components/features/review/PreferenceEditor.tsx` | ⏳ | 偏好编辑器 |

---

### Phase 5: Outfit Agent (P2)

#### 后端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 5.1.1 | `models/outfit_agent.py` | ⏳ | 数据库模型 (OutfitRecommendation) |
| 5.1.2 | `schemas/outfit_agent.py` | ⏳ | Pydantic Schemas |
| 5.1.3 | `api/v1/admin/outfit_agent.py` | ⏳ | REST API 端点 |
| 5.1.4 | `agents/outfit/agent.py` | ⏳ | OutfitAgent 主类 |
| 5.1.5 | `agents/outfit/weather.py` | ⏳ | 天气 API 集成 |
| 5.1.6 | `agents/outfit/image_gen.py` | ⏳ | 穿搭图片生成 |

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 5.2.1 | `app/(public)/agents/outfit/page.tsx` | ⏳ | Outfit Agent 专属页面 |
| 5.2.2 | `components/features/outfit/OutfitCard.tsx` | ⏳ | 穿搭推荐卡片 |
| 5.2.3 | `components/features/outfit/ImageGallery.tsx` | ⏳ | 穿搭图片展示 |

---

### Phase 6: 公共 Agents 页面改造

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 6.1.1 | `app/(public)/agents/page.tsx` | ⏳ | 改为 Duralux 风格，展示 5 个 Agent + LobeChat |
| 6.1.2 | `components/features/agents/LobeChatPanel.tsx` | ✅ | LobeChat Iframe 嵌入组件 |

---

### Phase 7: 管理后台 Agent 管理

#### 后端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 7.1.1 | `api/v1/admin/agents.py` | ✅ | Agent CRUD API（已有） |
| 7.1.2 | `models/agent.py` | ✅ | Agent 模型（已有） |
| 7.1.3 | `services/agent_manager.py` | ✅ | Agent 生命周期管理（已有） |

#### 前端任务
| 任务 | 文件 | 状态 | 说明 |
|------|------|------|------|
| 7.2.1 | `app/admin/agents/page.tsx` | ✅ | Agents 管理页面（已有） |
| 7.2.2 | `components/admin/AgentCard.tsx` | ✅ | Agent 卡片组件（已有） |
| 7.2.3 | `components/admin/AgentEditor.tsx` | ✅ | Agent 编辑 Modal（已有） |

---

## 🗄️ 数据库模型设计

### News Agent
```python
class NewsSource(Base):
    id: str (PK)
    name: str
    url: str
    source_type: str (rss, api, crawl)
    category: str (ai, tech, academic, community)
    crawl_interval: int (秒)
    is_active: bool
    last_crawled_at: datetime

class NewsArticle(Base):
    id: str (PK)
    source_id: str (FK)
    title: str
    url: str (unique)
    author: str
    published_at: datetime
    content: text
    summary: text
    summary_model: str
    category: str
    tags: JSON
    image_url: str
    crawled_at: datetime
```

### Task Agent
```python
class TaskCategory(Base):
    id: str (PK)
    name: str
    color: str
    icon: str
    sort_order: int

class Task(Base):
    id: str (PK)
    category_id: str (FK)
    title: str
    description: text
    priority: str (low, medium, high)
    status: str (pending, in_progress, done, failed)
    due_date: datetime
    completed_at: datetime
    ai_generated: bool
    raw_input: text
    created_at: datetime
    updated_at: datetime
```

### Life Agent
```python
class HealthMetrics(Base):
    id: str (PK)
    height: int (cm)
    weight: float (kg)
    health_status: str
    exercise_frequency: str
    diet_preference: str
    sleep_hours: float
    water_intake: int (ml)
    notes: text
    created_at: datetime
    updated_at: datetime

class HealthSuggestion(Base):
    id: str (PK)
    metric_id: str (FK)
    diet_suggestion: text
    exercise_suggestion: text
    lifestyle_suggestion: text
    ai_notes: text
    created_at: datetime
```

### Review Agent
```python
class DailyReview(Base):
    id: str (PK)
    review_date: date (unique)
    tasks_completed: int
    tasks_failed: int
    health_data: JSON
    outfit_data: JSON
    news_summary: text
    ai_summary: text
    mood_score: int (1-10)
    highlights: text
    improvements: text
    created_at: datetime

class UserPreference(Base):
    id: str (PK)
    category: str (work, study, health, lifestyle)
    key: str
    value: JSON
    confidence: float
    last_verified: datetime
    created_at: datetime
    updated_at: datetime
```

### Outfit Agent
```python
class OutfitRecommendation(Base):
    id: str (PK)
    recommend_date: date
    weather_data: JSON  # temperature, humidity, condition
    schedule_input: str
    outfit_description: text
    outfit_image_path: str
    outfit_image_url: str
    ai_notes: text
    is_generated: bool
    created_at: datetime
```

---

## 📡 API 设计

### News API (`/api/v1/news`)
```
GET    /news                    # 获取新闻列表（分页、筛选）
GET    /news/stats              # 获取统计信息
POST   /news/refresh            # 手动刷新新闻
GET    /news/sources            # 获取新闻源列表
POST   /news/sources            # 添加新闻源
DELETE /news/sources/:id        # 删除新闻源
POST   /news/sources/:id/toggle # 切换新闻源状态
GET    /news/:article_id        # 获取文章详情
```

### Task API (`/api/v1/admin/task`)
```
GET    /task                    # 获取任务列表（分页、筛选）
GET    /task/:id                # 获取任务详情
POST   /task                    # 创建任务
PUT    /task/:id                # 更新任务
DELETE /task/:id                # 删除任务
POST   /task/:id/complete       # 标记完成
GET    /task/categories         # 获取分类列表
POST   /task/categories         # 创建分类
```

### Life API (`/api/v1/admin/life`)
```
GET    /life                    # 获取健康数据
POST   /life/metrics            # 保存健康指标
POST   /life/suggestions        # 生成 AI 建议
```

### Review API (`/api/v1/admin/review`)
```
GET    /review                  # 获取复盘列表
GET    /review/today            # 获取今日复盘
POST   /review                  # 创建复盘
PUT    /review/:id              # 更新复盘
POST   /review/generate         # 生成每日复盘
GET    /review/preferences      # 获取用户偏好
POST   /review/preferences      # 创建偏好
PUT    /review/preferences/:id  # 更新偏好
```

### Outfit API (`/api/v1/admin/outfit`)
```
GET    /outfit                  # 获取穿搭列表
GET    /outfit/today            # 获取今日穿搭
POST   /outfit                  # 创建穿搭
PUT    /outfit/:id              # 更新穿搭
DELETE /outfit/:id              # 删除穿搭
POST   /outfit/generate         # 生成穿搭
```

---

## ✅ 验收标准

### News Agent
- [ ] 每天早上 8:00 自动爬取新闻
- [ ] 展示 10 条 AI 相关资讯
- [ ] 显示标题、摘要、链接、发布时间、来源
- [ ] 可查看 15 天内历史新闻
- [ ] 爬取失败时自动重试
- [ ] 支持手动刷新

### Task Agent
- [ ] 显示问答表单
- [ ] AI 分析后生成任务
- [ ] 任务可标记完成、修改、删除
- [ ] 支持分类管理
- [ ] 图表形式展示任务统计

### Life Agent
- [ ] 手动填写健康指标表单
- [ ] 字段：身高、体重、健康状况、运动频率、饮食偏好、睡眠、饮水
- [ ] AI 生成饮食和运动建议
- [ ] 数据加密存储
- [ ] 历史记录图表展示

### Review Agent
- [ ] 汇总当日 News+Task+Life+Outfit 数据
- [ ] 提取用户偏好
- [ ] 用户可手动修改偏好
- [ ] 支持查看历史复盘

### Outfit Agent
- [ ] 根据天气和日程推荐穿搭
- [ ] 生成穿搭图片（调用 AI 绘画 API）
- [ ] 用户可重新生成
- [ ] 支持查看历史穿搭

---

## 📅 排期计划

| 阶段 | 内容 | 预计时间 | 提交物 |
|------|------|----------|--------|
| Phase 1 | News Agent 完善 | 2 天 | 数据库模型、API、前端页面 |
| Phase 2 | Task Agent 实现 | 2 天 | 数据库模型、API、前端页面 |
| Phase 3 | Life Agent 实现 | 2 天 | 数据库模型、API、前端页面 |
| Phase 4 | Review Agent 实现 | 1.5 天 | 数据库模型、API、前端页面 |
| Phase 5 | Outfit Agent 实现 | 2 天 | 数据库模型、API、前端页面 |
| Phase 6 | 公共页面改造 | 0.5 天 | Agents 列表页、LobeChat 面板 |
| Phase 7 | 管理后台 | 0.5 天 | 管理后台优化 |
| **总计** | | **10.5 天** | |

---

## 📝 提交历史

| 提交 | 描述 | 日期 |
|------|------|------|
| `feat(sprint-6): add database models for 5 agents` | 创建 Task/Life/Review/Outfit 模型 | - |
| `feat(sprint-6): implement Task Agent API` | Task API + Schema + Agent | - |
| `feat(sprint-6): implement Life Agent API` | Life API + Schema + Agent | - |
| `feat(sprint-6): implement Review Agent API` | Review API + Schema + Agent | - |
| `feat(sprint-6): implement Outfit Agent API` | Outfit API + Schema + Agent | - |
| `feat(sprint-6): register all agent routers` | 注册所有 Agent 路由 | - |
| `feat(sprint-6): update public agents page` | 前台 Agents 列表页 | - |
| `feat(sprint-6): add Task Agent page` | Task 详情页 | - |
| `feat(sprint-6): add Life Agent page` | Life 详情页 | - |
| `feat(sprint-6): add Review Agent page` | Review 详情页 | - |
| `feat(sprint-6): add Outfit Agent page` | Outfit 详情页 | - |
| `test(sprint-6): add backend tests` | 后端单元测试 | - |
| `docs(sprint-6): update documentation` | API 文档 | - |

---

**最后更新**: 2026-03-05
**创建者**: Claude Assistant
