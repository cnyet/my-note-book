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
- [ ] 按钮、卡片、输入框、导航栏、页脚
- [ ] 响应式布局容器
- [ ] 主题切换组件

#### 3.2 首页 (Home)
- [ ] Hero区域实现 (动态渐变、打字机效果)
- [ ] 品牌价值展示
- [ ] 核心功能入口

#### 3.3 Agents页面
- [ ] Agent列表展示
- [ ] Tab切换逻辑实现
- [ ] Agent详情卡片
- [ ] LobeChat集成方案实现

#### 3.4 Tools页面
- [ ] 工具列表带搜索和分类
- [ ] 工具详情/外链跳转逻辑
- [ ] 分类标签过滤

#### 3.5 Labs页面
- [ ] 实验产品展示卡片
- [ ] 媒体预览 (图片/视频)
- [ ] 体验状态标识

#### 3.6 Blog页面
- [ ] 博客列表页实(分页、标签、搜索)
- [ ] 博客详情页实现 (Markdown渲染)
- [ ] 代码高亮集成

**阶段交付物**：
- ✅ 5个完整的公开前台页面
- ✅ 响应式设计与交互效果
- ✅ 真实API数据联调

---

### 阶段四：后台管理系统开发 (预计5-7天)

#### 4.1 管理后台基础架构
- [ ] 后台布局 (Sidebar + Header)
- [ ] 移动端适配处理
- [ ] 仪表盘概览页面

#### 4.2 Agents管理
- [ ] 列表展示与搜索
- [ ] 新增/编辑Agent表单
- [ ] 删除Agent

#### 4.3 博客管理
- [ ] 文章列表管理
- [ ] Markdown高级编辑器集成 (富文本/预览)
- [ ] 标签和分类管理
- [ ] 发布/草稿状态控制

#### 4.4 工具与实验室管理
- [ ] Tools列表与CRUD
- [ ] Labs列表与CRUD
- [ ] 分类树状管理

#### 4.5 系统设置
- [ ] 基础配置修改
- [ ] 账户信息维护 (修改密码等)

**阶段交付物**：
- ✅ 完整的管理后台系统
- ✅ 全量CRUD功能验证
- ✅ 内容管理闭环

---

### 阶段五：性能优化与部署 (预计3-5天)

#### 5.1 性能与体验优化
- [ ] 数据库查询优化 (索引、Eager Loading)
- [ ] 前端图片优化与静态生成 (SSG/ISR)
- [ ] 接口请求缓存 (React Query)
- [ ] 添加加载状态与骨架屏
- [ ] 动画性能调优

#### 5.2 安全性增强
- [ ] 文件上传安全校验
- [ ] 频率限制 (Rate Limiting)
- [ ] 敏感操作审计日志
- [ ] 依赖漏洞扫描与修复

#### 5.3 部署环境搭建
- [ ] 编写Dockerfles与Docker Compose
- [ ] 配置反向代理 (Nginx)
- [ ] 配置CI/CD流水线 (GitHub Actions)
- [ ] SSL证书申请与配置

**阶段交付物**：
- ✅ 生产就绪的应用系统
- ✅ 部署文档与运维手册
- ✅ 性能测试报告

---

**计划版本**: Draft
**更新日期**: 2026-01-30
