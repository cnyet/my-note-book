# Sprint 3: News Agent Implementation

> **版本**: v1.0
> **状态**: 待实施
> **创建日期**: 2026-02-28
> **关联文档**: [Roadmap](../roadmap.md) | [Sprint 2](./sprint-2.md)

---

## 1. 项目概述

### 1.1 核心目标

实现 MyNoteBook 的第一个实际工作的智能体 - **News Agent**，具备新闻爬取和 AI 摘要能力。

| 目标 | 描述 | 优先级 |
|------|------|--------|
| News Crawler | 定时爬取新闻源（RSS/网站） | P0 |
| News Summarizer | AI 生成新闻摘要 | P0 |
| Data Persistence | 新闻数据存储 | P0 |
| Basic UI | 新闻展示界面 | P1 |

### 1.2 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **爬虫** | feedparser + httpx | RSS 解析 + HTTP 请求 |
| **AI 摘要** | OpenAI API / Anthropic API | LLM 文本摘要 |
| **调度** | APScheduler | 定时任务调度 |
| **数据库** | SQLite + SQLAlchemy | 新闻数据持久化 |
| **前端** | Next.js + React Query | 新闻展示 UI |

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   News Sources  │     │   News Agent    │     │   SQLite DB     │
│   (RSS/HTTP)    │ ──→ │  Crawler → LLM  │ ──→ │  (news_articles)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 ↓
                        ┌─────────────────┐
                        │   Frontend UI   │
                        │   /news page    │
                        └─────────────────┘
```

### 2.2 News Agent 生命周期

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ STOPPED  │ ──→ │ STARTING │ ──→ │  IDLE    │ ──→ │  BUSY    │
└──────────┘     └──────────┘     └────┬─────┘     └────┬─────┘
                                       │                │
                                       │  schedule      │  crawling
                                       │←───────────────│
                                       │
                              ┌────────┴────────┐
                              ↓                 ↓
                       ┌──────────┐       ┌──────────┐
                       │ PAUSED   │       │ ERROR    │
                       └──────────┘       └──────────┘
```

### 2.3 数据流

```
┌─────────────┐
│ RSS Feed    │─┐
├─────────────┤ │ crawl          ┌──────────────┐
│ RSS Feed    │─┼───────→ │ NewsCrawler  │
├─────────────┤ │          └──────┬───────┘
│ RSS Feed    │─┘                 │
└─────────────┘                   ↓
                           ┌──────────────┐
                           │ raw_content  │
                           └──────┬───────┘
                                  │
                                  ↓
                           ┌──────────────┐
                           │ LLM Summarizer│
                           └──────┬───────┘
                                  │
                                  ↓
                           ┌──────────────┐
                           │ news_summary │
                           └──────┬───────┘
                                  │
                                  ↓
                           ┌──────────────┐
                           │ SQLite DB    │
                           └──────────────┘
```

---

## 3. 数据库设计

### 3.1 新增表结构

**news_sources** - 新闻源表
```sql
CREATE TABLE news_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT NOT NULL,  -- rss / http
    category TEXT,              -- tech / business / design / etc.
    language TEXT DEFAULT 'zh',
    is_active BOOLEAN DEFAULT TRUE,
    crawl_interval INTEGER DEFAULT 3600,  -- 秒
    last_crawled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**news_articles** - 新闻文章表
```sql
CREATE TABLE news_articles (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    author TEXT,
    published_at TIMESTAMP,
    crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT,                 -- 原始内容
    summary TEXT,                 -- AI 摘要
    summary_model TEXT,           -- 使用的 LLM 模型
    category TEXT,
    tags JSON,                    -- 标签数组
    image_url TEXT,               -- 封面图
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    FOREIGN KEY (source_id) REFERENCES news_sources(id)
);
```

### 3.2 索引设计

```sql
CREATE INDEX idx_news_articles_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_source ON news_articles(source_id);
CREATE INDEX idx_news_articles_featured ON news_articles(is_featured);
```

---

## 4. 后端设计

### 4.1 目录结构

```
backend/src/
├── agents/
│   ├── __init__.py
│   ├── manager.py          # 现有 AgentManager
│   ├── memory.py           # 现有 MemoryStore
│   └── news/
│       ├── __init__.py
│       ├── agent.py        # NewsAgent 主类
│       ├── crawler.py      # 爬虫引擎
│       ├── summarizer.py   # AI 摘要器
│       └── scheduler.py    # 定时调度器
├── models/
│   ├── news_source.py      # NewsSource 模型
│   └── news_article.py     # NewsArticle 模型
└── routes/
    └── news.py             # News API 路由
```

### 4.2 核心类设计

**NewsAgent**
```python
class NewsAgent:
    """新闻智能体 - 协调爬取和摘要流程"""

    def __init__(self, agent_id: str, db: AsyncSession):
        self.agent_id = agent_id
        self.db = db
        self.crawler = NewsCrawler()
        self.summarizer = Summarizer()
        self.scheduler = APScheduler()

    async def start(self) -> None:
        """启动智能体"""

    async def stop(self) -> None:
        """停止智能体"""

    async def crawl_and_summarize(self, source_id: str) -> int:
        """爬取并摘要单个源，返回新增文章数"""
```

**NewsCrawler**
```python
class NewsCrawler:
    """新闻爬虫引擎"""

    async def fetch_rss(self, url: str) -> list[dict]:
        """获取 RSS feed"""

    async def fetch_url(self, url: str) -> str:
        """获取网页内容"""

    def parse_article(self, html: str) -> dict:
        """解析文章元数据"""
```

**Summarizer**
```python
class Summarizer:
    """AI 摘要生成器"""

    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6"):
        self.api_key = api_key
        self.model = model

    async def summarize(self, content: str, max_length: int = 200) -> str:
        """生成摘要"""

    async def batch_summarize(self, articles: list[dict]) -> list[dict]:
        """批量摘要"""
```

### 4.3 API 设计

**新闻相关 API**
```
GET    /api/v1/news                    # 获取新闻列表
GET    /api/v1/news/{id}               # 获取单篇新闻
GET    /api/v1/news/sources            # 获取新闻源列表
POST   /api/v1/news/sources            # 添加新闻源
DELETE /api/v1/news/sources/{id}       # 删除新闻源
POST   /api/v1/news/refresh            # 手动刷新新闻
GET    /api/v1/news/stats              # 获取统计数据
```

---

## 5. 前端设计

### 5.1 新闻页面 (`/news`)

```
┌─────────────────────────────────────────────────────────────┐
│  News Hub                        [🔍 Search]  [Category ▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Featured News                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │                 │  │                 │  │             │ │
│  │   [Image]       │  │   [Image]       │  │   [Image]   │ │
│  │   Title         │  │   Title         │  │   Title     │ │
│  │   Summary...    │  │   Summary...    │  │   Summary.. │ │
│  │   [Read More]   │  │   [Read More]   │  │   [Read]    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Latest News                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ● Tech    Title of news article...     2h ago  [⭐]    ││
│  │ ● Design  Another news item here...    4h ago  [⭐]    ││
│  │ ● Business More news updates...        6h ago  [⭐]    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  [Load More]                                                │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 组件结构

```
frontend/src/
├── components/
│   └── news/
│       ├── NewsList.tsx           # 新闻列表
│       ├── NewsCard.tsx           # 新闻卡片
│       ├── FeaturedCarousel.tsx   # 精选轮播
│       ├── CategoryFilter.tsx     # 分类筛选
│       └── SearchBar.tsx          # 搜索栏
├── pages/
│   └── news/
│       ├── index.tsx              # 新闻主页
│       └── [id].tsx               # 文章详情
├── hooks/
│   └── use-news.ts                # News React Query hooks
└── stores/
    └── news-store.ts              # Zustand 状态 (可选)
```

---

## 6. 实施计划

### 6.1 开发阶段

**Phase 1: 基础设施 (Day 1-2)**
- [ ] 数据库表创建 (news_sources, news_articles)
- [ ] SQLAlchemy 模型定义
- [ ] NewsAgent 基础类
- [ ] 基础爬取功能

**Phase 2: AI 摘要 (Day 2-3)**
- [ ] Summarizer 类实现
- [ ] LLM API 集成
- [ ] Prompt 工程优化
- [ ] 批量处理逻辑

**Phase 3: 定时调度 (Day 3-4)**
- [ ] APScheduler 集成
- [ ] 任务队列管理
- [ ] 错误重试机制
- [ ] 日志记录

**Phase 4: API 开发 (Day 4)**
- [ ] 新闻列表 API
- [ ] 新闻源管理 API
- [ ] 手动刷新 API
- [ ] 统计数据 API

**Phase 5: 前端实现 (Day 5-7)**
- [ ] 新闻页面布局
- [ ] 新闻卡片组件
- [ ] 分类筛选功能
- [ ] 搜索功能
- [ ] 文章详情页

### 6.2 验收标准

| 功能 | 验收标准 |
|------|---------|
| 新闻爬取 | 支持至少 5 个 RSS 源，每小时自动爬取 |
| AI 摘要 | 摘要长度 100-200 字，语义准确 |
| 数据存储 | 文章去重，支持 10000+ 条数据 |
| 定时调度 | 任务可配置，错误自动重试 |
| 前端展示 | 加载时间 < 1s，支持分类筛选 |

### 6.3 性能指标

| 指标 | 目标 |
|------|------|
| 爬取速度 | > 10 源/分钟 |
| 摘要生成 | < 5s/篇 |
| API 响应 | < 200ms |
| 前端 LCP | < 1.5s |

---

## 7. 配置示例

### 7.1 环境变量

```bash
# News Agent 配置
NEWS_AGENT_ENABLED=true
NEWS_CRAWL_INTERVAL=3600  # 1 小时
NEWS_MAX_ARTICLES=10000   # 最大文章数

# LLM 配置
LLM_PROVIDER=anthropic
LLM_MODEL=claude-sonnet-4-6
LLM_API_KEY=your_api_key

# 可选：自定义 Prompt
NEWS_SUMMARY_PROMPT="请为以下新闻生成简洁的中文摘要..."
```

### 7.2 默认新闻源

```json
[
  {"name": "36Kr", "url": "https://36kr.com/feed", "category": "tech"},
  {"name": "Hacker News", "url": "https://news.ycombinator.com/rss", "category": "tech"},
  {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml", "category": "tech"},
  {"name": "少数派", "url": "https://sspai.com/feed", "category": "tech"},
  {"name": "设计志", "url": "https://www.shejizhi.com/feed", "category": "design"}
]
```

---

## 8. 技术债务与后续优化

- [ ] 分布式爬虫（多节点）
- [ ] 智能去重算法（SimHash）
- [ ] 个性化推荐
- [ ] 新闻趋势分析
- [ ] 导出功能（RSS/Newsletter）

---

**文档版本**: v1.0
**最后更新**: 2026-02-28
**状态**: 待实施
