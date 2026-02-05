# work-agents 架构设计文档

## 1. 系统架构概览

 ```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                             │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  前台网站 (Next.js) │         │  管理后台 (Next.js) │          │
│  │  - Home           │         │  - Agents 管理    │          │
│  │  - Agents         │         │  - Blog 管理      │          │
│  │  - Tools          │         │  - Tools 管理     │          │
│  │  - Labs           │         │  - Labs 管理      │          │
│  │  - Blog           │         │  - Settings       │          │
│  └──────────────────┘         └──────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                        API 网关层                             │
│                   Next.js API Routes                          │
│                   (可选中间层/代理)                           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    消息与编排层                               │
│              WebSocket Server + Orchestration Engine          │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  WebSocket      │  │  Agent          │                   │
│  │  Server         │  │  Orchestration  │                   │
│  │  (实时通信)      │  │  Engine        │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      业务逻辑层                               │
│                     FastAPI Backend                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ Auth Service│  │ CRUD Service│  │ File Service│             │
│  └────────────┘  └────────────┘  └────────────┘             │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据访问层                               │
│                   SQLAlchemy ORM                              │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据存储层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   SQLite DB   │  │ 本地文件存储   │  │ 内存缓存 (PY) │       │
│  │(work_agents.db)│  │(/public/ups) │  │ (Polling)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
 ```

## 2. 技术栈详解

### 2.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.4 | React 框架，SSR/SSG |
| React | 19 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 样式框架 (Genesis Tokens) |
| Shadcn/UI | latest | 基础组件库 |
| Framer Motion | 6.x+ | 物理动效/磁力交互/Glitch |
| TanStack Query | 5.x | 数据获取和轮询 (Polling) |
| Zustand | 4.x | 状态管理 |
| React Hook Form | 7.x | 表单管理 |
| Zod | 3.x | Schema 验证 |

### 2.3 AI 增强技术栈
*本项目深度集成 AI 协作流程*

| 技术 | 用途 |
|------|------|
| **OpenSpec** | 规范驱动开发 (Spec-driven Development) |
| **MCP** | Model Context Protocol (Fetch/Search 集成) |
| **Prometheus** | 规划代理 (Task Scaffolding) |
| **Sisyphus** | 执行代理 (Code/Doc Implementation) |

### 2.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.11+ | 编程语言 |
| FastAPI | 0.109+ | Web 框架 |
| SQLAlchemy | 2.0+ | ORM |
| Alembic | 1.13+ | 数据库迁移 |
| Pydantic | 2.5+ | 数据验证 |
| python-jose | 3.3+ | JWT 处理 |
| passlib | 1.7+ | 密码加密 |
| pytest | 7.4+ | 测试框架 |

## 3. 目录结构设计

根据 `GEMINI.md` 标准及 `Genesis` 版迭代需求，系统目录结构设计如下。

### 3.0 项目全局目录

```
.
├── backend/            # FastAPI 后端项目
├── frontend/           # Next.js 前端项目 (Genesis Edition)
├── docs/               # 项目文档资产
│   ├── adr/            # 架构决策记录
│   ├── implement/      # 实施计划与任务跟踪
│   ├── design/         # UI/UX 与技术规范
│   └── guides/         # 开发与环境指南
├── openspec/           # Spec-driven 开发规范中心
│   ├── specs/          # 现状 (Single Source of Truth)
│   ├── changes/        # 功能提案 (Proposals)
│   └── project.md      # 项目全局上下文
├── scripts/            # 全入口运营/运维脚本 (REQUIRED)
├── logs/               # 运行日志 (No-sensitive, gitignored)
├── .sisyphus/          # 执行代理工作状态 (Opaque)
└── .agent/             # AI 助手私有配置
```

### 3.1 后端目录结构 (backend/)

```
backend/
├── alembic/                # 数据库迁移记录 (DB Schema v1.2)
├── data/                   # 数据库与持久化层 (REQUIRED)
│   └── work_agents.db      # SQLite 主数据库文件
├── src/                    # 核心源码目录
│   ├── api/                # 接口路由层
│   │   ├── v1/             # 基础业务 API (Auth, Home, Agents...)
│   │   │   ├── admin/      # 管理后端专用接口 (CRUD)
│   │   │   │   ├── agents.py
│   │   │   │   ├── blog.py
│   │   │   │   ├── tools.py
│   │   │   │   ├── labs.py
│   │   │   │   └── media.py
│   │   │   └── __init__.py
│   │   └── deps.py         # 依赖注入 (DB Session, Auth)
│   ├── core/               # 核心系统配置
│   │   ├── config.py       # Pydantic Settings
│   │   ├── security.py     # JWT & Hashing
│   │   └── database.py     # SQLAlchemy Engine/Session
│   ├── models/             # 数据库 ORM 模型
│   │   ├── user.py
│   │   ├── agent.py
│   │   ├── blog_post.py
│   │   ├── tag.py
│   │   ├── tool.py
│   │   ├── category.py
│   │   └── lab.py
│   ├── schemas/            # Pydantic 数据模型 (DTOs)
│   ├── services/           # 业务逻辑服务层 (File, Auth, CRUD)
│   ├── utils/              # 通用工具函数
│   └── main.py             # FastAPI 应用入口
├── tests/                  # 自动化测试 (pytest)
├── .env.example            # 环境变量模板
├── pyproject.toml          # 项目元数据
└── requirements.txt        # 依赖包列表
```

### 3.2 前端目录结构 (frontend/)

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (frontend)/         # 前台游乐园 (Home, Agents, Tools, Labs, Blog)
│   ├── (dashboard)/        # 管理中枢 (Dashboard, Admin CRUD, Settings)
│   ├── auth/               # 认证流程 (Login/Register)
│   ├── layout.tsx          # 根布局 (Genesis Theme)
│   └── globals.css         /* Tailwind 4 & Genesis Variables */
├── components/             # React 组件库
│   ├── ui/                 # Shadcn/UI 基础组件
│   ├── layout/             # Navbar, Footer, Sidebar
│   └── features/           # 页面级功能组件 (ParticleBg, OnlinePulse)
├── lib/                    # 核心库 (API Client, Utils)
├── hooks/                  # 自定义 React Hooks
├── store/                  # 状态管理 (Zustand)
└── types/                  # TypeScript 类型定义
public/                     # 静态资源与持久化存储
└── uploads/                # 用户上传的媒体文件 (相对路径引用)
next.config.ts              # Next.js 配置文件
tailwind.config.ts          # Genesis 设计令牌配置
```

## 4. 数据流设计

### 4.1 认证流程

```
┌──────────┐     1. 登录请求      ┌──────────┐
│          │ ──────────────────→ │          │
│  前端     │                     │  后端     │
│  (Next.js)│ ←────────────────── │ (FastAPI)│
│          │  2. 返回 JWT Token   │          │
└──────────┘                     └──────────┘
     │                                 ↑
     │ 3. 存储 Token                   │
     │ (LocalStorage/Cookie)           │
     ↓                                 │
  后续请求                             │
     │ 4. 携带 Token                   │
     │ (Authorization Header)          │
     └─────────────────────────────────┘
```

### 4.2 CRUD 数据流

```
┌──────┐     ┌──────┐     ┌────────┐     ┌──────┐
│ UI   │ ──→ │ API  │ ──→ │ Service│ ──→ │ Model│
│ Layer│ ←── │ Route│ ←── │ Layer  │ ←── │ (DB) │
└──────┘     └──────┘     └────────┘     └──────┘
  前端         后端         业务逻辑       数据库
```

## 5. API 设计原则

### 5.1 RESTful 规范

- **资源命名**: 使用名词复数 (`/agents`, `/blogs`)
- **HTTP 方法**: GET (查询), POST (创建), PUT (更新), DELETE (删除)
- **状态码**: 200 (成功), 201 (创建), 400 (错误), 401 (未登录), 403 (无权限), 404 (不存在)

### 5.2 统一响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [ ... ]
  }
}
```

## 6. 安全设计

### 6.1 认证方案

 - **JWT Token**: 短期访问令牌 (30分钟)
 - **Refresh Token**: 长期刷新令牌 (7天)
 - **密码加密**: bcrypt 加密存储

### 6.2 身份传播 (Identity Propagation)

 - **跨 Agent 身份同步**: 基于 JWT 的统一身份协议，支持在多 Agent 间传递身份上下文
 - **统一认证凭证**: 用户身份通过 Orchestration Engine 在不同服务间传递
 - **会话一致性**: 维护用户在多个 Agent 间的会话连续性

### 6.2 权限控制

- **RBAC**: 基于角色的访问控制
- **角色等级**: admin > editor > viewer
- **API 守卫**: 装饰器/中间件校验权限

### 6.3 数据安全

- **速率限制 (Rate Limiting)**:
  - 登录接口: 同一 IP 限制 10 次/分钟。
  - 全局 API: 限制 100 次/分钟。
- **SQL 注入**: 使用 SQLAlchemy 参数化查询。
- **XSS 防护**: Content Security Policy (CSP) + 前端转义。
- **CSRF 防护**: SameSite Cookie 策略。

## 7. 性能优化策略

### 7.1 前端优化

- **代码分割**: Next.js 自动代码分割
- **懒加载**: 图片和组件懒加载
- **缓存策略**: TanStack Query 缓存
- **CDN**: 静态资源 CDN 加速

### 7.2 后端优化

 - **并发处理**: 对于 SQLite 写操作，使用 FastAPI/SQLAlchemy 串行化队列。
 - **数据库索引**: 针对 `slug`, `category_id`, `published_at` 建立索引。
 - **实时通信优化**: Labs 在线人数组件使用 WebSocket 实现实时双向通信，替代传统轮询机制。
 - **WebSocket 服务**: 维护客户端连接池，处理实时消息广播与状态更新。
 - **缓存层**: 应用层内存缓存热点数据 (如 Tools/Agents 列表)。

## 8. 部署架构

```
┌────────────────────────────────────────────────────────┐
│                     Nginx (反向代理)                     │
│                         :80/:443                         │
└─────────────┬───────────────────────┬──────────────────┘
              │                       │
              ↓                       ↓
    ┌─────────────────┐    ┌─────────────────┐
    │   Next.js App   │    │  FastAPI App    │
    │   (Port 3001)   │    │  (Port 8001)    │
    └────────┬────────┘    └────────┬────────┘
             │                      │
             ↓                      ↓
    ┌────────────────────────────────────────┐
    │              持久化存储层                │
    │  - backend/data/work_agents.db (SQLite)│
    │  - frontend/public/uploads (Media)     │
    └────────────────────────────────────────┘
```

## 9. 设计系统集成 (Genesis Integration)

- **核心配方**: Abyss (#0a0a0f) + Electric Cyan (#00f2ff) + Neon Purple (#bc13fe)。
- **动效标准**: 
  - 统一使用 `Spring` 物理引擎（stiffness: 100, damping: 20）。
  - Agent 跳转集成 `AgentBridge` 扫描线动效。
- **性能红线**: 首屏 LCP < 1.5s，API 响应 P95 < 200ms。

---

**文档版本**: v0.2.0 (Aligned with PRD v1.2)  
**最后更新**: 2026-02-02
