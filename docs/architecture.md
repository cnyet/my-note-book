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
│  │   SQLite DB   │  │ 文件存储 (本地) │  │ Redis (可选)  │       │
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
| Tailwind CSS | 4.x | 样式框架 |
| Shadcn/UI | latest | 组件库 |
| TanStack Query | 5.x | 数据获取和缓存 |
| Zustand | 4.x | 状态管理 |
| React Hook Form | 7.x | 表单管理 |
| Zod | 3.x | Schema 验证 |

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

### 3.1 后端目录结构

```
backend/
├── src/
│   ├── api/                    # API 路由层
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # 认证相关路由
│   │   │   ├── agents.py       # Agents API
│   │   │   ├── blog.py         # Blog API
│   │   │   ├── tools.py        # Tools API
│   │   │   └── labs.py         # Labs API
│   │   └── deps.py             # 依赖注入
│   ├── core/                   # 核心配置
│   │   ├── __init__.py
│   │   ├── config.py           # 配置管理
│   │   ├── security.py         # 安全相关
│   │   └── database.py         # 数据库连接
│   ├── models/                 # 数据库模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── agent.py
│   │   ├── blog.py
│   │   ├── tool.py
│   │   └── lab.py
│   ├── schemas/                # Pydantic Schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── agent.py
│   │   ├── blog.py
│   │   ├── tool.py
│   │   └── lab.py
│   ├── services/               # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── crud_service.py
│   │   └── file_service.py
│   ├── utils/                  # 工具函数
│   │   ├── __init__.py
│   │   └── helpers.py
│   └── main.py                 # 应用入口
├── tests/                      # 测试
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_api/
├── alembic/                    # 数据库迁移
│   └── versions/
├── uploads/                    # 文件上传目录
├── .env.example
├── requirements.txt
└── pyproject.toml
```

### 3.2 前端目录结构

```
frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── (frontend)/         # 前台路由组
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── agents/
│   │   │   ├── tools/
│   │   │   ├── labs/
│   │   │   └── blog/
│   │   ├── (dashboard)/        # 后台路由组
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── agents/
│   │   │   │   ├── blog/
│   │   │   │   ├── tools/
│   │   │   │   └── labs/
│   │   │   └── settings/
│   │   ├── auth/               # 认证页面
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── layout.tsx          # 根布局
│   │   └── globals.css
│   ├── components/             # React 组件
│   │   ├── ui/                 # Shadcn UI 组件
│   │   ├── layout/             # 布局组件
│   │   ├── features/           # 功能组件
│   │   └── shared/             # 共享组件
│   ├── lib/                    # 工具库
│   │   ├── api.ts              # API 客户端
│   │   ├── utils.ts            # 工具函数
│   │   └── hooks/              # 自定义 Hooks
│   ├── store/                  # 状态管理
│   │   └── auth.ts
│   ├── types/                  # TypeScript 类型
│   │   └── index.ts
│   └── styles/                 # 样式文件
├── public/                     # 静态资源
│   ├── images/
│   └── icons/
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
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

### 6.2 权限控制

- **RBAC**: 基于角色的访问控制
- **角色等级**: admin > editor > viewer
- **API 守卫**: 装饰器/中间件校验权限

### 6.3 数据安全

- **SQL 注入**: 使用 ORM 参数化查询
- **XSS 防护**: 前端输入转义
- **CSRF 防护**: SameSite Cookie
- **环境变量**: 敏感信息不硬编码

## 7. 性能优化策略

### 7.1 前端优化

- **代码分割**: Next.js 自动代码分割
- **懒加载**: 图片和组件懒加载
- **缓存策略**: TanStack Query 缓存
- **CDN**: 静态资源 CDN 加速

### 7.2 后端优化

- **数据库索引**: 关键字段建立索引
- **连接池**: SQLAlchemy 连接池
- **异步处理**: FastAPI 异步路由
- **缓存层**: Redis 缓存热数据 (可选)

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
    │   (Port 3000)   │    │  (Port 8000)    │
    └─────────────────┘    └────────┬────────┘
                                    │
                                    ↓
                           ┌─────────────────┐
                           │   SQLite DB     │
                           │  (work_agents.db)│
                           └─────────────────┘
```

---

**文档版本**: v0.1.0  
**最后更新**: 2026-01-30
