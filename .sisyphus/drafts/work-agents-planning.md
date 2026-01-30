# Draft: work-agents Project Planning

## Project Overview
**Work-agents**: 一个极具极客感、现代感的网站，包括前台WEB和管理后台两部分

## Requirements Summary

### Frontend Pages (5 main pages)
- **Home**: 品牌展示、核心价值、简介（深色调、动态效果）
- **Agents**: 集成LobeChat和5个AI秘书的展示（Tab导航切换）
- **Tools**: 工具集合（分类展示、搜索功能）
- **Labs**: 实验产品展示（小游戏、AI Agent原型）
- **Blog**: 博客文章列表（标签分类、搜索、详情页）

### Backend Admin Modules (CRUD required)
- **Agents管理**: 5个子agent数据（名称、图标、描述、服务端点）
- **博客文章管理**: 富文本编辑、Markdown支持、标签分类、草稿/发布状态
- **工具集管理**: 工具信息（名称、描述、图标、分类、链接、排序）
- **实验室产品管理**: 产品信息（名称、描述、状态、媒体、链接、排序）
- **个人账户管理**: 用户信息、密码修改

### UI/UX Requirements
- **参考网站**:
  - https://checkmarx.dev/（深色调、现代感、动态效果）
  - https://clawdbotai.co/
- **主题支持**: 深色模式和浅色模式
- **响应式设计**: 桌面端和移动端
- **后台**: 需要登录认证才能访问

### Backend Requirements
- **REST API**: 统一的请求/响应格式
- **认证授权**: JWT身份认证、基于角色的权限控制
- **数据库设计**: 规范化表结构、优化索引策略
- **性能优化**: 缓存层（Redis）、数据分片/读写分离规划
- **API文档**: OpenAPI/Swagger文档

## Current Project Status
- **State**: 全新项目（空白目录）
- **Existing Files**: Only AGENTS.md (coding guidelines)

## Confirmed Technical Decisions

### Backend Stack
- **Language**: Python
- **Framework**: FastAPI (preferred) or Flask
- **Database**: SQLite (for MVP/smaller scale)
- **Deployment**: Personal/small team deployment

### Integration & Management
- **LobeChat**: Self-hosted deployment (local instance)
- **Content Management**: Pure admin panel access (all content via admin UI)

### Development Approach
- **Timeline**: To be evaluated by AI based on requirements complexity
- **Frontend Stack**: AI to recommend based on analysis

## Active Research Tasks
1. **LobeChat Deployment Research** (bg_3bd185de)
   - Self-hosting methods
   - Integration APIs
   - Tech stack requirements

2. **Next.js + FastAPI Architecture** (bg_1465e039)
   - Integration patterns
   - Authentication approaches
   - Deployment strategies

## Preliminary Technical Assessment

### Recommended Frontend Stack: Next.js 15
**Rationale**:
- Modern React framework with App Router
- Server-side rendering for performance
- API routes for simpler backend endpoints
- Built-in image optimization
- Strong community and future-proof
- Matches checkmarx.dev/clawdbotai.co modern aesthetic capabilities

### Backend Choice Analysis: FastAPI
**Selected**: FastAPI (user preference)
**Why it works with Next.js**:
- Automatic OpenAPI documentation
- Async/await support
- Pydantic validation
- CORS handling built-in
- Easy integration via standard REST API
- WebSocket support for real-time features

### Database Choice: SQLite
**Selected**: SQLite (user preference)
**Pros for this project**:
- Zero configuration
- Perfect for personal/small team deployment
- Supports most SQL features needed
- Easy backups (single file)
- No additional server required
- Scales well for current requirements

**Considerations**:
- Single writer limitation (not critical for admin workflow)
- May need migration to PostgreSQL if scaling up

---

## 3种技术实现方案对比

### 方案A：Next.js + FastAPI + SQLite (推荐)

| 维度 | 评估 | 说明 |
|------|------|------|
| **开发效率** | ⭐⭐⭐⭐⭐ | 前后端分离，Next.js API Routes + FastAPI分工明确 |
| **性能表现** | ⭐⭐⭐⭐ | FastAPI异步高性能，Next.js SSR优化首屏 |
| **可维护性** | ⭐⭐⭐⭐⭐ | 清晰的分层架构，类型安全，文档完善 |
| **团队熟悉度** | ⭐⭐⭐ | 需要同时掌握React和Python，初期学习成本 |
| **长期扩展性** | ⭐⭐⭐⭐ | 可平滑迁移到PostgreSQL，支持水平扩展 |
| **部署复杂度** | ⭐⭐⭐ | 需要2个服务，但都可容器化部署 |
| **成本** | ⭐⭐⭐⭐⭐ | 免费开源，无商业授权费用 |

### 方案B：Next.js全栈 (API Routes) + SQLite

| 维度 | 评估 | 说明 |
|------|------|------|
| **开发效率** | ⭐⭐⭐⭐⭐ | 纯JavaScript/TypeScript，减少上下文切换 |
| **性能表现** | ⭐⭐⭐ | Serverless函数冷启动可能有延迟 |
| **可维护性** | ⭐⭐⭐⭐ | 统一技术栈，但业务逻辑可能臃肿 |
| **团队熟悉度** | ⭐⭐⭐⭐⭐ | 前端团队可直接维护后端 |
| **长期扩展性** | ⭐⭐⭐ | 依赖Vercel等平台，迁移成本高 |
| **部署复杂度** | ⭐⭐⭐⭐⭐ | 单一部署单位，极简运维 |
| **成本** | ⭐⭐⭐ | Vercel免费层有限，超出需付费 |

### 方案C：Vue/Nuxt + Express/Koa + PostgreSQL

| 维度 | 评估 | 说明 |
|------|------|------|
| **开发效率** | ⭐⭐⭐ | 传统分离架构，样板代码较多 |
| **性能表现** | ⭐⭐⭐⭐ | 成熟生态，优化空间大 |
| **可维护性** | ⭐⭐⭐⭐ | 经典MVC分离，团队经验充足 |
| **团队熟悉度** | ⭐⭐⭐⭐⭐ | 最广泛使用的技术栈，人才充足 |
| **长期扩展性** | ⭐⭐⭐⭐⭐ | 适合大规模企业级应用 |
| **部署复杂度** | ⭐⭐⭐ | 需同时运维前后端服务 |
| **成本** | ⭐⭐⭐⭐⭐ | 开源免费，工具链成熟 |

### 方案对比总结

| 指标 | 方案A (Next.js+FastAPI) | 方案B (Next.js全栈) | 方案C (Vue/Nuxt) |
|------|------------------------|---------------------|------------------|
| 开发效率 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 性能 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 可维护性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 学习曲线 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 扩展性 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **总分** | **19** | **20** | **22** |

### 最优方案推荐

**推荐方案：A (Next.js + FastAPI + SQLite)**

**推荐理由**：
1. **AI生态契合**：Python是AI领域的主导语言，自建LobeChat、OpenAI集成、LangChain等更自然
2. **性能与开发效率平衡**：FastAPI的异步性能和自动化文档极大提升后端效率
3. **现代Web标准**：Next.js App Router代表前端最新实践，SSR/SSG灵活运用
4. **用户需求匹配**：Python后端是您明确选择的技术栈
5. **技术前瞻性**：两个框架都有活跃的社区和持续的更新支持

**建议调整**：
- 若团队完全不懂Python → 考虑方案B (Next.js全栈)
- 若需要大规模高并发 → 考虑方案C并升级到PostgreSQL + Redis

---

## 数据库设计规范

### 核心数据实体

```
┌─────────────────────────────────────────────────────────────┐
│                        users                                 │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ username: VARCHAR(50) UNIQUE NOT NULL                        │
│ email: VARCHAR(255) UNIQUE NOT NULL                          │
│ password_hash: VARCHAR(255) NOT NULL                         │
│ role: VARCHAR(20) DEFAULT 'admin'                            │
│ is_active: BOOLEAN DEFAULT TRUE                              │
│ created_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
│ updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        agents                                │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ name: VARCHAR(100) NOT NULL                                  │
│ slug: VARCHAR(100) UNIQUE NOT NULL                           │
│ description: TEXT                                            │
│ icon_url: VARCHAR(500)                                       │
│ api_endpoint: VARCHAR(500)                                   │
│ config: JSON                                                 │
│ sort_order: INTEGER DEFAULT 0                                │
│ is_active: BOOLEAN DEFAULT TRUE                              │
│ created_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
│ updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        blog_posts                            │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ title: VARCHAR(255) NOT NULL                                 │
│ slug: VARCHAR(255) UNIQUE NOT NULL                           │
│ content: TEXT NOT NULL                                       │
│ excerpt: TEXT                                                │
│ cover_image: VARCHAR(500)                                    │
│ status: VARCHAR(20) DEFAULT 'draft'                          │
│ published_at: DATETIME                                       │
│ created_by: INTEGER FOREIGN KEY                              │
│ created_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
│ updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     blog_tags                                │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ name: VARCHAR(50) UNIQUE NOT NULL                            │
│ slug: VARCHAR(50) UNIQUE NOT NULL                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  blog_posts_tags                             │
├─────────────────────────────────────────────────────────────┤
│ post_id: INTEGER FOREIGN KEY                                 │
│ tag_id: INTEGER FOREIGN KEY                                  │
│ PRIMARY KEY (post_id, tag_id)                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        tools                                 │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ name: VARCHAR(100) NOT NULL                                  │
│ slug: VARCHAR(100) UNIQUE NOT NULL                           │
│ description: TEXT                                            │
│ icon_url: VARCHAR(500)                                       │
│ category_id: INTEGER FOREIGN KEY                             │
│ url: VARCHAR(500)                                            │
│ sort_order: INTEGER DEFAULT 0                                │
│ is_active: BOOLEAN DEFAULT TRUE                              │
│ created_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
│ updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      categories                              │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ name: VARCHAR(100) NOT NULL                                  │
│ slug: VARCHAR(100) UNIQUE NOT NULL                           │
│ type: VARCHAR(20) NOT NULL  // tools, labs                  │
│ parent_id: INTEGER FOREIGN KEY                               │
│ sort_order: INTEGER DEFAULT 0                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        labs                                  │
├─────────────────────────────────────────────────────────────┤
│ id: INTEGER PRIMARY KEY                                      │
│ name: VARCHAR(100) NOT NULL                                  │
│ slug: VARCHAR(100) UNIQUE NOT NULL                           │
│ description: TEXT                                            │
│ status: VARCHAR(20) DEFAULT 'experimental'                   │
│ media_url: VARCHAR(500)                                      │
│ demo_url: VARCHAR(500)                                       │
│ category_id: INTEGER FOREIGN KEY                             │
│ sort_order: INTEGER DEFAULT 0                                │
│ is_active: BOOLEAN DEFAULT TRUE                              │
│ created_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
│ updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP               │
└─────────────────────────────────────────────────────────────┘
```

### 索引策略

```sql
-- 用户认证索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 博客全文搜索索引
CREATE VIRTUAL TABLE blog_posts_fts USING fts5(title, content, excerpt);

-- 分类查询优化
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_labs_category ON labs(category_id);

-- 状态筛选索引
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(published_at);

-- 排序优化
CREATE INDEX idx_sort_order ON agents(sort_order);
CREATE INDEX idx_tools_sort ON tools(sort_order);
CREATE INDEX idx_labs_sort ON labs(sort_order);
```

### 缓存策略

| 数据类型 | 缓存策略 | TTL |
|----------|----------|-----|
| 博客列表 | Redis Cache | 5分钟 |
| Agents列表 | Redis Cache | 10分钟 |
| Tools列表 | Redis Cache | 10分钟 |
| Labs列表 | Redis Cache | 10分钟 |
| 用户Session | Redis | 24小时 |
| 热门文章 | Redis Cache | 1小时 |

---

## API设计规范

### RESTful API标准

#### 统一请求格式
```json
{
  "method": "GET|POST|PUT|PATCH|DELETE",
  "path": "/api/v1/{resource}",
  "headers": {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
  }
}
```

#### 统一响应格式
```json
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
    "message": "Invalid input data",
    "details": [ ... ]
  }
}
```

#### HTTP状态码规范

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功获取/更新资源 |
| 201 | Created | 成功创建新资源 |
| 204 | No Content | 成功删除资源 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证或Token过期 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 业务逻辑验证失败 |
| 429 | Too Many Requests | 频率限制 |
| 500 | Internal Server Error | 服务器内部错误 |

### API端点设计

#### 公开端点 (无需认证)

```
GET    /api/v1/home              # 首页数据
GET    /api/v1/agents            # Agents列表
GET    /api/v1/agents/{slug}     # Agent详情
GET    /api/v1/tools             # Tools列表
GET    /api/v1/tools/{slug}      # Tool详情
GET    /api/v1/labs              # Labs列表
GET    /api/v1/labs/{slug}       # Lab详情
GET    /api/v1/blog              # 博客列表
GET    /api/v1/blog/{slug}       # 博客详情
GET    /api/v1/blog/tags         # 博客标签
GET    /api/v1/blog/search       # 博客搜索
```

#### 认证端点 (需要JWT Token)

```
POST   /api/v1/auth/register     # 用户注册
POST   /api/v1/auth/login        # 用户登录
POST   /api/v1/auth/refresh      # 刷新Token
POST   /api/v1/auth/logout       # 退出登录
GET    /api/v1/auth/me           # 获取当前用户
PUT    /api/v1/auth/me           # 更新个人信息
PUT    /api/v1/auth/password     # 修改密码
```

#### 管理端点 (需要Admin角色)

```
# Agents管理
GET    /api/v1/admin/agents      # Agents列表
POST   /api/v1/admin/agents      # 创建Agent
GET    /api/v1/admin/agents/{id} # Agent详情
PUT    /api/v1/admin/agents/{id} # 更新Agent
DELETE /api/v1/admin/agents/{id} # 删除Agent
PATCH  /api/v1/admin/agents/{id}/sort  # 排序

# Blog管理
GET    /api/v1/admin/blog        # 文章列表
POST   /api/v1/admin/blog        # 创建文章
GET    /api/v1/admin/blog/{id}   # 文章详情
PUT    /api/v1/admin/blog/{id}   # 更新文章
DELETE /api/v1/admin/blog/{id}   # 删除文章
PATCH  /api/v1/admin/blog/{id}/status  # 发布/下架
POST   /api/v1/admin/blog/{id}/publish # 立即发布

# Tags管理
GET    /api/v1/admin/tags        # 标签列表
POST   /api/v1/admin/tags        # 创建标签
PUT    /api/v1/admin/tags/{id}   # 更新标签
DELETE /api/v1/admin/tags/{id}   # 删除标签

# Tools管理
GET    /api/v1/admin/tools       # Tools列表
POST   /api/v1/admin/tools       # 创建Tool
GET    /api/v1/admin/tools/{id}  # Tool详情
PUT    /api/v1/admin/tools/{id}  # 更新Tool
DELETE /api/v1/admin/tools/{id}  # 删除Tool

# Labs管理
GET    /api/v1/admin/labs        # Labs列表
POST   /api/v1/admin/labs        # 创建Lab
GET    /api/v1/admin/labs/{id}   # Lab详情
PUT    /api/v1/admin/labs/{id}   # 更新Lab
DELETE /api/v1/admin/labs/{id}   # 删除Lab

# Categories管理
GET    /api/v1/admin/categories  # 分类列表
POST   /api/v1/admin/categories  # 创建分类
PUT    /api/v1/admin/categories/{id}  # 更新分类
DELETE /api/v1/admin/categories/{id}  # 删除分类
```

### 认证与授权

#### JWT Token设计
```python
# Token Payload
{
  "sub": "user_id",
  "username": "admin",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890,
  "type": "access"
}

# Refresh Token Payload
{
  "sub": "user_id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### 权限等级
| 角色 | 权限 |
|------|------|
| admin | 完整的管理员权限 |
| editor | 可编辑内容，不能删除或管理用户 |
| viewer | 只读权限 |

### OpenAPI/Swagger文档

FastAPI自动生成OpenAPI规范，访问：`/api/v1/docs`

```python
# 文档元数据
)
```

---

## UI/UX设计规范

### 设计系统核心

#### 色彩体系

**主色调 (Primary)**
| 色系 | 颜色值 | 用途 |
|------|--------|------|
| 深蓝 | #0A0F1C | 主背景、品牌色 |
| 电光蓝 | #3B82F6 | 主要交互、链接 |
| 霓虹紫 | #8B5CF6 | 强调色、渐变 |
| 青绿 | #06B6D4 | 辅助强调、成功状态 |

**语义色 (Semantic)**
| 用途 | 深色模式 | 浅色模式 |
|------|----------|----------|
| 成功 | #10B981 | #059669 |
| 警告 | #F59E0B | #D97706 |
| 错误 | #EF4444 | #DC2626 |
| 信息 | #3B82F6 | #2563EB |

**文字色 (Typography)**
| 层级 | 深色模式 | 浅色模式 |
|------|----------|----------|
| 主文字 | #F8FAFC | #1E293B |
| 次文字 | #94A3B8 | #64748B |
| 禁用文字 | #64748B | #94A3B8 |
| 反色文字 | #0A0F1C | #FFFFFF |

#### 字体系统

```css
:root {
  /* 字体族 */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* 字号 */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* 字重 */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### 间距系统 (8px网格)

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

#### 圆角与阴影

```css
:root {
  --radius-sm: 0.25rem;      /* 4px */
  --radius-md: 0.5rem;       /* 8px */
  --radius-lg: 0.75rem;      /* 12px */
  --radius-xl: 1rem;         /* 16px */
  --radius-full: 9999px;     /* 圆 */

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### 组件库选择

#### 推荐方案：Shadcn/UI + Tailwind CSS

**选择理由**：
1. 基于Radix UI，无头组件，完全可定制
2. 使用Tailwind CSS，与Next.js生态完美集成
3. 复制粘贴源码，无隐藏依赖
4. 深色模式开箱即用
5. 现代化设计风格，与参考网站契合
6. TypeScript优先

**核心组件需求**：
```
基础组件：
□ Button       按钮（变体：primary/secondary/destructive/ghost）
□ Card         卡片容器
□ Input        输入框
□ Textarea     多行文本
□ Label        标签
□ Badge        标签徽章

布局组件：
□ Container    响应式容器
□ Grid         网格布局
□ Flex         弹性布局
□ ScrollArea   滚动区域

导航组件：
□ Navbar       导航栏
□ Sidebar      侧边栏（后台）
□ Tabs         标签页
□ Breadcrumb   面包屑

数据展示：
□ Table        表格
□ Avatar       头像
□ Progress     进度条
□ Empty        空状态

反馈组件：
□ Toast        提示
□ Dialog       对话框
□ Modal        模态框
□ Skeleton     骨架屏
□ Spinner      加载中

表单组件：
□ Form         表单（含验证）
□ Select       下拉选择
□ Checkbox     复选框
□ Radio        单选框
□ Switch       开关
□ Editor       富文本编辑器（需集成Tiptap）
```

### 页面设计规范

#### 前台页面结构

```
┌─────────────────────────────────────────────────────────────┐
│                        Navbar                                │
│ [Logo] Home | Agents | Tools | Labs | Blog | [Theme Toggle] │
└─────────────────────────────────────────────────────────────┘
│                                                             │
│                      Page Content                           │
│                                                             │
│                      Footer                                 │
│ [Links] [Social] [Copyright]                                │
└─────────────────────────────────────────────────────────────┘
```

#### 后台管理结构

```
┌──────────┬─────────────────────────────────────────────────┐
│          │                    Header                        │
│  Sidebar │              [Page Title] [User Menu]           │
│          ├─────────────────────────────────────────────────┤
│  • Dashboard                                                   │
│  • Agents    │              Main Content Area               │
│  • Blog      │                                             │
│  • Tools     │                                             │
│  • Labs      │                                             │
│  • Settings  │                                             │
│          │                                             │
└──────────┴─────────────────────────────────────────────────┘
```

### 响应式设计断点

```css
/* Tailwind标准断点 */
--breakpoint-sm: 640px;   /* 手机横屏 */
--breakpoint-md: 768px;   /* 平板竖屏 */
--breakpoint-lg: 1024px;  /* 平板横屏/笔记本 */
--breakpoint-xl: 1280px;  /* 桌面显示器 */
--breakpoint-2xl: 1536px; /* 大屏显示器 */
```

### 动效设计

```css
/* 过渡时长 */
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;

/* 缓动函数 */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* 动画关键帧 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
   0 0  box-shadow: 40px rgba(59, 130, 246, 0.5);
  }
}
```

---

## 开发阶段规划

### 阶段一：基础设施搭建 (预计2-3天)

#### 1.1 项目初始化
- [ ] 初始化Next.js 15项目 (App Router)
- [ ] 配置TypeScript strict模式
- [ ] 配置Tailwind CSS
- [ ] 配置ESLint + Prettier
- [ ] 配置路径别名 (@/...)
- [ ] 配置编辑器类型提示

#### 1.2 后端项目搭建
- [ ] 初始化FastAPI项目
- [ ] 配置SQLAlchemy ORM
- [ ] 配置SQLite数据库
- [ ] 配置Alembic数据库迁移
- [ ] 设置项目目录结构
- [ ] 配置环境变量管理

#### 1.3 开发环境配置
- [ ] 配置Docker Compose (可选)
- [ ] 配置开发服务器热重载
- [ ] 配置前后端代理 (Next.js rewrites)
- [ ] 设置Git仓库和分支策略
- [ ] 配置提交规范 (Conventional Commits)

#### 1.4 基础架构代码
- [ ] 创建数据库模型基类
- [ ] 创建API响应封装
- [ ] 配置CORS跨域
- [ ] 配置日志系统
- [ ] 创建统一异常处理

**阶段交付物**：
- ✅ 可运行的前后端项目骨架
- ✅ 数据库连接和基础模型
- ✅ 开发环境完整配置

---

### 阶段二：认证系统开发 (预计2-3天)

#### 2.1 用户认证模块
- [ ] 实现用户注册API
- [ ] 实现用户登录API (JWT)
- [ ] 实现Token刷新机制
- [ ] 实现密码加密存储 (bcrypt)
- [ ] 实现退出登录

#### 2.2 前端认证状态管理
- [ ] 配置NextAuth.js (或自定义Auth Context)
- [ ] 实现登录/注册页面
- [ ] 实现Token持久化存储
- [ ] 实现认证状态全局管理
- [ ] 实现路由守卫 (保护后台)

#### 2.3 权限控制
- [ ] 实现角色枚举 (admin/editor/viewer)
- [ ] 实现RBAC权限中间件
- [ ] 实现API级别权限校验
- [ ] 实现前端页面权限控制

**阶段交付物**：
- ✅ 完整的用户认证流程
- ✅ JWT Token管理
- ✅ 权限控制系统
- ✅ 登录/注册页面

---

### 阶段三：前台页面开发 (预计5-7天)

#### 3.1 基础UI组件开发
- [ ] Button, Card, Input组件
- [ ] Navigation组件 (Navbar)
- [ ] Footer组件
- [ ] Theme Toggle (深色/浅色模式)
- [ ] 响应式布局组件

#### 3.2 Home页面
- [ ] Hero Section (品牌展示)
- [ ] 核心价值展示区
- [ ] 功能特性卡片
- [ ] CTA按钮区
- [ ] 动态背景/动画效果

#### 3.3 Agents页面
- [ ] Tab导航组件
- [ ] LobeChat集成区域
- [ ] 5个AI秘书展示卡片
- [ ] Agent详情展示
- [ ] 切换动画效果

#### 3.4 Tools页面
- [ ] 工具分类筛选
- [ ] 工具卡片网格
- [ ] 搜索功能
- [ ] 分页/加载更多
- [ ] 分类图标设计

#### 3.5 Labs页面
- [ ] 实验产品展示卡片
- [ ] 状态标签 (实验性/预览)
- [ ] 媒体展示 (图片/视频)
- [ ] 体验入口链接
- [ ] 排序功能

#### 3.6 Blog页面
- [ ] 文章列表
- [ ] 标签筛选
- [ ] 日期排序
- [ ] 搜索功能
- [ ] 文章详情页
- [ ] 编辑入口跳转

**阶段交付物**：
- ✅ 5个完整的前台页面
- ✅ 深色/浅色主题切换
- ✅ 响应式设计 (移动端适配)
- ✅ LobeChat集成

---

### 阶段四：后台管理系统开发 (预计5-7天)

#### 4.1 后台基础框架
- [ ] 后台布局组件
- [ ] 侧边栏导航
- [ ] Header用户信息
- [ ] 面包屑导航
- [ ] 响应式后台布局

#### 4.2 Agents管理模块
- [ ] Agents列表页面
- [ ] 创建/编辑表单
- [ ] 图标上传
- [ ] 状态切换
- [ ] 排序功能
- [ ] 删除确认

#### 4.3 Blog管理模块
- [ ] 文章列表 (带筛选)
- [ ] 富文本编辑器集成 (Tiptap)
- [ ] Markdown支持
- [ ] 标签管理
- [ ] 发布/下架功能
- [ ] 草稿保存

#### 4.4 Tools管理模块
- [ ] Tools列表
- [ ] 分类管理
- [ ] 图标上传
- [ ] 链接验证
- [ ] 排序功能

#### 4.5 Labs管理模块
- [ ] Labs列表
- [ ] 媒体上传
- [ ] 状态管理
- [ ] 分类管理
- [ ] 排序功能

#### 4.6 个人账户管理
- [ ] 个人信息查看
- [ ] 密码修改
- [ ] 头像设置

**阶段交付物**：
- ✅ 完整的后台管理系统
- ✅ 所有模块CRUD功能
- ✅ 富文本编辑器
- ✅ 响应式后台UI

---

### 阶段五：API完善与优化 (预计2-3天)

#### 5.1 API文档完善
- [ ] 补充所有API的OpenAPI文档
- [ ] 添加请求/响应示例
- [ ] 配置Swagger UI
- [ ] 配置ReDoc

#### 5.2 性能优化
- [ ] 添加Redis缓存层
- [ ] 实现数据库查询优化
- [ ] 配置API响应压缩
- [ ] 实现图片懒加载

#### 5.3 测试
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] API端点测试
- [ ] 前端组件测试

**阶段交付物**：
- ✅ 完整的API文档
- ✅ 性能优化
- ✅ 测试覆盖

---

### 阶段六：部署与上线 (预计1-2天)

#### 6.1 部署准备
- [ ] 配置生产环境
- [ ] 数据库迁移脚本
- [ ] 构建优化
- [ ] 环境变量配置

#### 6.2 部署执行
- [ ] 前端构建 (Next.js)
- [ ] 后端启动 (FastAPI)
- [ ] Nginx配置
- [ ] HTTPS证书配置

#### 6.3 上线验证
- [ ] 功能测试
- [ ] 性能测试
- [ ] 安全检查
- [ ] 监控配置

**阶段交付物**：
- ✅ 生产环境部署
- ✅ 监控告警
- ✅ 文档交付

---

## 项目时间线总览

| 阶段 | 内容 | 预计工时 |
|------|------|----------|
| 阶段一 | 基础设施搭建 | 2-3天 |
| 阶段二 | 认证系统开发 | 2-3天 |
| 阶段三 | 前台页面开发 | 5-7天 |
| 阶段四 | 后台管理系统 | 5-7天 |
| 阶段五 | API完善与优化 | 2-3天 |
| 阶段六 | 部署与上线 | 1-2天 |
| **合计** | | **17-25天** |

---

## 技术栈总结

### 前端技术栈

| 类别 | 技术 | 版本要求 |
|------|------|----------|
| 框架 | Next.js | 15.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.4+ |
| 组件库 | Shadcn/UI | latest |
| 状态管理 | Zustand / React Context | latest |
| 表单 | React Hook Form | 7.x |
| 验证 | Zod | latest |
| 富文本 | Tiptap | latest |
| HTTP客户端 | Axios / Fetch | latest |
| 日期处理 | date-fns | latest |

### 后端技术栈

| 类别 | 技术 | 版本要求 |
|------|------|----------|
| 框架 | FastAPI | 0.115+ |
| 语言 | Python | 3.11+ |
| ORM | SQLAlchemy | 2.0+ |
| 数据库 | SQLite (开发) / PostgreSQL (生产) | latest |
| 迁移 | Alembic | latest |
| 认证 | Python-Jose | latest |
| 密码 | Bcrypt | latest |
| 文档 | OpenAPI (Swagger) | 3.0 |
| 缓存 | Redis | 7.x |

### 开发工具

| 类别 | 工具 |
|------|------|
| 包管理 | npm / pip |
| 代码规范 | ESLint, Prettier |
| Git Hooks | Husky, lint-staged |
| 容器化 | Docker, Docker Compose |
| 进程管理 | PM2 (后端) |

---

## 原子任务分解清单

### 阶段一：基础设施搭建 (17个任务)

#### 1.1 项目初始化 (7任务)
- [ ] 1.1.1 创建Next.js 15项目 (App Router, TypeScript)
- [ ] 1.1.2 配置Tailwind CSS和深色模式
- [ ] 1.1.3 配置ESLint + Prettier代码规范
- [ ] 1.1.4 配置路径别名 (@/components, @/lib等)
- [ ] 1.1.5 安装并配置Shadcn/UI组件库
- [ ] 1.1.6 配置编辑器类型提示 (.vscode/settings.json)
- [ ] 1.1.7 初始化Git仓库和分支策略

#### 1.2 后端搭建 (6任务)
- [ ] 1.2.1 创建FastAPI项目结构
- [ ] 1.2.2 配置SQLAlchemy ORM和SQLite
- [ ] 1.2.3 配置Alembic数据库迁移工具
- [ ] 1.2.4 创建项目目录结构 (routers, models, schemas, services)
- [ ] 1.2.5 配置环境变量 (.env.example)
- [ ] 1.2.6 创建基础配置文件 (config.py)

#### 1.3 开发环境 (4任务)
- [ ] 1.3.1 配置Docker Compose (可选)
- [ ] 1.3.2 配置Next.js rewrites代理到FastAPI
- [ ] 1.3.3 配置开发服务器热重载
- [ ] 1.3.4 创建开发文档 (README.md)

**阶段一验收标准**：
- ✅ `npm run dev` 和 `uvicorn main:app` 都能正常运行
- ✅ 前后端能正常通信
- ✅ 代码规范检查通过
- ✅ 深色/浅色主题切换正常

---

### 阶段二：认证系统 (16个任务)

#### 2.1 后端认证 (8任务)
- [ ] 2.1.1 实现User数据库模型
- [ ] 2.1.2 实现密码加密 (bcrypt)
- [ ] 2.1.3 实现用户注册API (POST /auth/register)
- [ ] 2.1.4 实现用户登录API (POST /auth/login)
- [ ] 2.1.5 实现JWT Token生成
- [ ] 2.1.6 实现Token刷新API (POST /auth/refresh)
- [ ] 2.1.7 实现认证中间件
- [ ] 2.1.8 实现角色权限枚举和校验

#### 2.2 前端认证 (8任务)
- [ ] 2.2.1 创建Auth Context状态管理
- [ ] 2.2.2 实现登录页面 (UI + 验证)
- [ ] 2.2.3 实现注册页面 (UI + 验证)
- [ ] 2.2.4 实现Token本地存储和刷新
- [ ] 2.2.5 实现路由守卫 (高阶组件)
- [ ] 2.2.6 实现登出功能
- [ ] 2.2.7 实现密码修改功能
- [ ] 2.2.8 测试完整认证流程

**阶段二验收标准**：
- ✅ 用户能注册、登录、登出
- ✅ JWT Token正确生成和刷新
- ✅ 未登录访问后台重定向到登录页
- ✅ 密码加密存储

---

### 阶段三：前台页面开发 (35个任务)

#### 3.1 基础组件 (10任务)
- [ ] 3.1.1 Button组件 (变体: primary, secondary, ghost, link)
- [ ] 3.1.2 Card组件 (可交互、可点击)
- [ ] 3.1.3 Input, Textarea组件
- [ ] 3.1.4 Navbar组件 (Logo, 导航链接, Theme Toggle)
- [ ] 3.1.5 Footer组件
- [ ] 3.1.6 Theme Toggle组件 (深色/浅色切换)
- [ ] 3.1.7 Badge, Alert组件
- [ ] 3.1.8 Skeleton加载组件
- [ ] 3.1.9 Toast提示组件
- [ ] 3.1.10 Modal/Dialog组件

#### 3.2 Home页面 (6任务)
- [ ] 3.2.1 Hero Section (大标题, 副标题, CTA)
- [ ] 3.2.2 动态背景 (渐变/动画)
- [ ] 3.2.3 核心价值展示区
- [ ] 3.2.4 功能特性卡片网格
- [ ] 3.2.5 动画效果 (Framer Motion)
- [ ] 3.2.6 响应式适配

#### 3.3 Agents页面 (6任务)
- [ ] 3.3.1 Tab导航组件
- [ ] 3.3.2 LobeChat iframe嵌入区域
- [ ] 3.3.3 5个AI秘书展示卡片
- [ ] 3.3.4 Agent详情模态框
- [ ] 3.3.5 切换动画效果
- [ ] 3.3.6 响应式布局

#### 3.4 Tools页面 (5任务)
- [ ] 3.4.1 分类筛选器
- [ ] 3.4.2 工具卡片网格布局
- [ ] 3.4.3 搜索功能 (实时搜索)
- [ ] 3.4.4 工具详情页
- [ ] 3.4.5 分类图标设计

#### 3.5 Labs页面 (4任务)
- [ ] 3.5.1 实验产品卡片
- [ ] 3.5.2 状态标签组件
- [ ] 3.5.3 媒体展示区域
- [ ] 3.5.4 体验链接按钮

#### 3.6 Blog页面 (4任务)
- [ ] 3.6.1 文章列表组件
- [ ] 3.6.2 标签和日期筛选
- [ ] 3.6.3 文章详情页
- [ ] 3.6.4 编辑入口按钮 (跳转后台)

**阶段三验收标准**：
- ✅ 所有页面在桌面端和移动端显示正常
- ✅ 深色/浅色模式切换无闪烁
- ✅ 页面加载时间 < 3秒
- ✅ 所有交互动画流畅
- ✅ LobeChat正常嵌入

---

### 阶段四：后台管理系统 (40个任务)

#### 4.1 后台框架 (8任务)
- [ ] 4.1.1 后台布局组件 (Sidebar + Main)
- [ ] 4.1.2 侧边栏导航菜单
- [ ] 4.1.3 Header组件 (用户信息, 退出)
- [ ] 4.1.4 面包屑导航
- [ ] 4.1.5 响应式后台布局
- [ ] 4.1.6 权限菜单过滤
- [ ] 4.1.7 加载状态组件
- [ ] 4.1.8 错误边界处理

#### 4.2 Agents管理 (6任务)
- [ ] 4.2.1 Agents列表页面 (表格)
- [ ] 4.2.2 创建Agent表单
- [ ] 4.2.3 编辑Agent表单
- [ ] 4.2.4 图标上传组件
- [ ] 4.2.5 删除确认对话框
- [ ] 4.2.6 排序功能

#### 4.3 Blog管理 (8任务)
- [ ] 4.3.1 文章列表 (分页, 筛选)
- [ ] 4.3.2 富文本编辑器 (Tiptap集成)
- [ ] 4.3.3 Markdown编辑器切换
- [ ] 4.3.4 文章发布/下架
- [ ] 4.3.5 标签管理 (创建, 编辑)
- [ ] 4.3.6 草稿自动保存
- [ ] 4.3.7 图片上传组件
- [ ] 4.3.8 预览功能

#### 4.4 Tools管理 (6任务)
- [ ] 4.4.1 Tools列表页面
- [ ] 4.4.2 创建/编辑Tool表单
- [ ] 4.4.3 分类下拉选择
- [ ] 4.4.4 链接验证
- [ ] 4.4.5 排序拖拽功能
- [ ] 4.4.6 图标上传

#### 4.5 Labs管理 (6任务)
- [ ] 4.5.1 Labs列表页面
- [ ] 4.5.2 创建/编辑Lab表单
- [ ] 4.5.3 媒体上传组件
- [ ] 4.5.4 状态管理
- [ ] 4.5.5 分类管理
- [ ] 4.5.6 排序功能

#### 4.6 个人设置 (6任务)
- [ ] 4.6.1 个人信息页面
- [ ] 4.6.2 头像上传
- [ ] 4.6.3 密码修改表单
- [ ] 4.6.4 邮箱修改
- [ ] 4.6.5 表单验证
- [ ] 4.6.6 成功/失败提示

**阶段四验收标准**：
- ✅ 所有模块CRUD功能完整
- ✅ 富文本编辑器和Markdown支持
- ✅ 图片/文件上传正常
- ✅ 响应式后台界面
- ✅ 权限控制生效

---

### 阶段五：API与优化 (12个任务)

#### 5.1 API文档 (4任务)
- [ ] 5.1.1 补充所有API的OpenAPI注释
- [ ] 5.1.2 添加请求示例
- [ ] 5.1.3 配置Swagger UI访问
- [ ] 5.1.4 配置ReDoc文档

#### 5.2 性能优化 (5任务)
- [ ] 5.2.1 实现Redis缓存层
- [ ] 5.2.2 API响应压缩
- [ ] 5.2.3 数据库查询优化
- [ ] 5.2.4 Next.js图片优化
- [ ] 5.2.5 代码分割和懒加载

#### 5.3 测试 (3任务)
- [ ] 5.3.1 编写核心单元测试
- [ ] 5.3.2 编写API集成测试
- [ ] 5.3.3 前端组件测试

**阶段五验收标准**：
- ✅ API文档完整可访问
- ✅ Redis缓存正常工作
- ✅ 测试覆盖率 > 70%

---

### 阶段六：部署上线 (8个任务)

#### 6.1 部署准备 (4任务)
- [ ] 6.1.1 生产环境配置文件
- [ ] 6.1.2 数据库迁移脚本
- [ ] 6.1.3 Next.js生产构建
- [ ] 6.1.4 环境变量最终配置

#### 6.2 部署执行 (4任务)
- [ ] 6.2.1 服务器环境搭建
- [ ] 6.2.2 Nginx配置 (反向代理)
- [ ] 6.2.3 HTTPS证书配置
- [ ] 6.2.2进程4 PM配置

**阶段六验收标准**：
- ✅ 网站可公开访问
- ✅ HTTPS正常工作
- ✅ 监控告警配置完成

---

## 任务统计

| 阶段 | 原子任务数 | 主要内容 |
|------|-----------|----------|
| 阶段一 | 17 | 项目初始化、基础架构 |
| 阶段二 | 16 | 认证系统 |
| 阶段三 | 35 | 前台页面开发 |
| 阶段四 | 40 | 后台管理系统 |
| 阶段五 | 12 | API优化和测试 |
| 阶段六 | 8 | 部署上线 |
| **总计** | **128** | |

**平均每天完成**: 5-7个任务 (按17-25天计算)

---

## 最终确认清单

### ✅ 已确认的技术决策

| 类别 | 决策 | 状态 |
|------|------|------|
| 前端框架 | Next.js 15 + React + TypeScript | 推荐 |
| 后端框架 | Python + FastAPI | ✅ 已确认 |
| 数据库 | SQLite | ✅ 已确认 |
| 部署规模 | 个人/小团队项目 | ✅ 已确认 |
| LobeChat | 自建LobeChat | ✅ 已确认 |
| 内容管理 | 纯后台管理界面 | ✅ 已确认 |
| UI组件库 | Shadcn/UI + Tailwind CSS | 推荐 |
| 样式方案 | CSS Variables + Tailwind | 推荐 |

### ❓ 需要您确认的问题

#### 问题1：LobeChat集成深度
目前规划是iframe嵌入Agents页面，您是否需要：
- [ ] A) 简单嵌入iframe即可
- [ ] B) 需要用户认证集成（用户在网站登录后自动登录LobeChat）
- [ ] C) 需要API深度集成（显示在线状态、对话统计等）

#### 问题2：富文本编辑器选择
- [ ] A) Tiptap (推荐，功能强大，React友好)
- [ ] B) Quill (简单易用，但功能较少)
- [ ] C) Monaco Editor (VS Code风格，功能最全)
- [ ] D) 只用Markdown，不需要富文本

#### 问题3：是否需要评论系统？
博客文章是否需要读者评论功能？
- [ ] A) 不需要，保持简洁
- [ ] B) 需要，简单的评论功能
- [ ] C) 需要，完整的评论系统（支持嵌套回复、点赞等）

#### 问题4：图片存储方案
- [ ] A) 本地存储 (static/uploads)
- [ ] B) 云存储 (阿里云OSS / AWS S3)
- [ ] C) 图床服务 (ImgBB等)

#### 问题5：是否需要分析统计？
- [ ] A) 不需要
- [ ] B) 简单统计 (PV/UV)
- [ ] C) 完整分析 (用户行为、转化率等)

---

## 下一步行动

1. **您确认以上问题后**，我将生成最终的工作计划文档
2. **运行 `/start-work`** 开始执行开发任务
3. **按阶段交付**：每个阶段完成后会进行验证

---

## 文档版本

- **版本**: v0.1 (Draft)
- **创建时间**: 2026-01-30
- **状态**: 待用户确认
- **位置**: `.sisyphus/drafts/work-agents-planning.md`

## Design Research Findings

### Reference: checkmarx.dev
**Visual Characteristics**:
- Deep dark blue/black gradient backgrounds
- Large hero typography with gradients
- Video demonstrations and animations
- Clean, high-contrast sections
- Modern card-based layouts
- Smooth scroll animations
- Clear CTAs with gradient buttons

### Reference: clawdbotai.co
**Visual Characteristics**:
- Dark theme by default with light mode toggle
- Minimalist geek aesthetic
- Card-based content grids
- User testimonials carousel
- Strong emphasis on privacy/local control
- Clean navigation and footer

**Common Design Patterns**:
- Dark-first modern aesthetic
- Gradient accents and hover effects
- Responsive layouts
- Clean typography
- Card-based information architecture

## Questions for User
(Will be updated as discussion progresses)