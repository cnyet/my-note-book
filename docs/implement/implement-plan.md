# work-agents 项目实施计划

> **Plan B 平衡方案** | 工期: 21-28天 | 任务数: 107项

## 📋 项目总览

**项目名称**: work-agents
**技术栈**: Next.js 15 + FastAPI + SQLite + Shadcn/UI
**预计总工期**: 21-28天
**团队规模**: 1-2 人

---

## 范围

### ✅ 包含
- **全部5个页面**: Home, Agents, Tools, Labs, Blog
- **用户认证**: 注册/登录/JWT + OAuth (GitHub/Google)
- **Blog 系统**: CRUD操作、富文本编辑、标签分类
- **Tools/Labs 展示**: 列表展示、搜索功能
- **管理后台**: 完整CRUD功能
- **文件上传**: 图片上传、存储

### ❌ 不包含
- WebSocket 实时计数器
- Lab 游戏/高级交互功能
- Blog 评论系统
- 高级数据分析

---

## 与需求文档的差异

| 项目 | 需求文档 | 本文档 | 说明 |
|------|----------|--------|------|
| 后端技术 | Node.js + Fastify | Python FastAPI | 用户明确选择Python |
| 数据库 | PostgreSQL + Redis | SQLite | 简化部署，MVP优先 |
| ORM | Prisma | SQLAlchemy | 匹配Python技术栈 |
| 邮箱服务 | 包含验证流程 | 不包含 | 简化功能 |
| 首批数据 | 假设已ready | 需创建模拟数据 | 明确需要初始化数据 |

---

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
- **参考网站**: https://checkmarx.dev/（深色调、现代感、动态效果）
- **主题支持**: 深色模式和浅色模式
- **响应式设计**: 桌面端和移动端
- **后台**: 需要登录认证才能访问
- **组件库**: Shadcn/UI

### Backend Requirements
- **REST API**: 统一的请求/响应格式
- **认证授权**: JWT身份认证、基于角色的权限控制
- **数据库设计**: 规范化表结构、优化索引策略
- **API文档**: OpenAPI/Swagger文档

---

## 当前项目状态

- **State**: 早期开发阶段（基础设施已搭建）
- **Frontend**: Next.js 15 项目已初始化，包含基本布局和主题切换功能
- **Backend**: FastAPI 项目已初始化，数据库连接已配置，用户模型已创建
- **Database**: SQLite 数据库已配置，Alembic 迁移系统已就绪
- **Documentation**: 实施计划和架构文档已完成
- **Completed**: 阶段 0（项目初始化）已完成
- **Current Focus**: 准备开始阶段 1（基础设施搭建）

---

## 技术架构

### Frontend Stack
- **Framework**: Next.js 15.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/UI
- **State Management**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod
- **Editor**: Tiptap

### Backend Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0
- **Database**: SQLite
- **Migration**: Alembic
- **Validation**: Pydantic 2.x
- **Authentication**: python-jose + bcrypt

---

## 详细任务清单

### 📋 工作流程说明

在每个开发阶段完成后，必须执行以下验证步骤：

1. **@oracle**: 代码审查 (Code review)
2. **@momus**: 需求与实现验证 (Requirements and implementation verification)
3. **@librarian**: 更新相关文档 (Update relevant documentation - progress and status)
4. **@general**: 总结执行任务结果 (Summarize execution results)
5. 等待下一个任务指令 (Wait for next task command)

> **English Version**: After each development phase is completed, the following steps **MUST** be executed:
> 
> 1. **@oracle**: Code review
> 2. **@momus**: Requirements and implementation verification
> 3. **@librarian**: Update relevant documentation (progress and status)
> 4. **@general**: Summarize execution results
> 5. Wait for next task command

#### 执行确认规则 (Execution Confirmation Rule)

在开发计划经过审查和批准后，AI agents **必须** 等待明确的 "确认/开始" 执行指令才能继续推进。AI agents **不得** 擅自行动或在没有确认的情况下开始执行。

> **English Version**: After a development plan is reviewed and approved, AI agents **MUST** wait for an explicit "confirm/start" execution command before proceeding. AI agents **MUST NOT** act unilaterally or start execution without confirmation.

### ✅ 阶段 0: 项目初始化 (1天) - 已完成

 - [x] 创建项目目录结构
 - [x] 配置脚本文件 (scripts/)
 - [x] 创建环境变量模板
 - [x] 创建项目文档框架
 - [x] 初始化 Git 仓库

---

### 🔵 阶段 1: 基础设施搭建 (2-3天)

**优先级**: P0 (关键路径)

#### 1.1 前端项目初始化
- [ ] 初始化 Next.js 15 项目 (App Router)
- [ ] 配置 TypeScript (strict 模式)
- [ ] 配置 Tailwind CSS 4
- [ ] 配置 ESLint + Prettier
- [ ] 安装 Shadcn/UI 组件库
- [ ] 配置路径别名 (@/...)
- [ ] 配置 dark/light 主题

#### 1.2 后端项目初始化
- [ ] 初始化 FastAPI 项目
- [ ] 配置 SQLAlchemy ORM
- [ ] 配置 SQLite 数据库
- [ ] 配置 Alembic 迁移工具
- [ ] 设置项目目录结构
- [ ] 配置 Ruff + MyPy

#### 1.3 开发环境配置
- [ ] 配置前后端代理 (Next.js rewrites)
- [ ] 配置 CORS 跨域
- [ ] 配置统一日志系统
- [ ] 配置统一异常处理
- [ ] 创建 API 响应封装

**交付物**:
- ✅ 可运行的前后端项目骨架
- ✅ 数据库连接和基础模型
- ✅ 开发环境完整配置
- ✅ API 响应标准化

**验收标准**:
- [ ] 前端: http://localhost:3000 可访问
- [ ] 后端: http://localhost:8000/docs 可访问
- [ ] 数据库连接成功

---

### 🔵 阶段 2: 认证系统开发 (2-3天)

**优先级**: P0 (关键路径)

#### 2.1 数据库模型
- [ ] 创建 users 表
- [ ] 创建数据库迁移

#### 2.2 后端认证 API
- [ ] 用户注册 API
- [ ] 用户登录 API (JWT)
- [ ] Token 刷新机制
- [ ] 密码加密存储 (bcrypt)
- [ ] 退出登录

#### 2.3 OAuth 集成
- [ ] GitHub OAuth 配置
- [ ] Google OAuth 配置
- [ ] OAuth callback 处理
- [ ] OAuth 用户信息获取

#### 2.4 前端认证实现
- [ ] 登录页面 UI
- [ ] 注册页面 UI
- [ ] OAuth 登录按钮
- [ ] Token 持久化存储
- [ ] 全局认证状态管理
- [ ] 路由守卫 (保护后台)

#### 2.5 权限控制
- [ ] RBAC 权限中间件
- [ ] API 级别权限校验
- [ ] 前端页面权限控制

**交付物**:
- ✅ 完整的用户认证流程
- ✅ JWT Token 管理
- ✅ OAuth 第三方登录
- ✅ 权限控制系统

**验收标准**:
- [ ] 用户可以注册/登录
- [ ] Token 自动刷新
- [ ] 未登录用户无法访问管理后台
- [ ] GitHub/Google 登录可用

---

### 🔵 阶段 3: 数据库设计与实现 (2天)

**优先级**: P0 (关键路径)

#### 3.1 数据库模型设计
- [ ] 创建 agents 表
- [ ] 创建 articles 表
- [ ] 创建 categories 表
- [ ] 创建 tools 表
- [ ] 创建 labs 表
- [ ] 创建 article_versions 表

#### 3.2 数据访问层
- [ ] 创建 CRUD 基础类
- [ ] 实现关联查询
- [ ] 实现分页查询

#### 3.3 数据初始化
- [ ] 创建 5 个 Agent 模拟数据
- [ ] 创建默认分类数据
- [ ] 创建初始用户 (admin)

**交付物**:
- ✅ 完整的数据库模型
- ✅ Alembic 迁移脚本
- ✅ 基础 CRUD 操作
- ✅ 初始化数据

**验收标准**:
- [ ] 数据库迁移成功
- [ ] 所有表创建成功
- [ ] 初始化数据正确

---

### 🔵 阶段 4: Home + Agents 页面 (3-4天)

**优先级**: P0 (关键路径)

#### 4.1 Home 页面
- [ ] Hero 区域 (大标题 + CTA)
- [ ] 核心价值展示区
- [ ] 功能特性介绍
- [ ] Footer 区域
- [ ] 响应式布局适配
- [ ] **页面过渡动画** (主题切换平滑过渡 ~0.3s)
- [ ] **滚动触发动画** (卡片滑入淡入效果)
- [ ] **Hero 动画效果** (打字机效果、按钮 hover 特效)

#### 4.2 Agents 页面
- [ ] LobeChat iframe 集成
- [ ] Agent 卡片展示区
- [ ] Tab 导航切换
- [ ] 5 个 AI Agent 展示卡片
- [ ] Agent 详情弹窗

**交付物**:
- ✅ Home 页面完整实现
- ✅ Agents 页面完整实现
- ✅ LobeChat 集成
- ✅ 响应式设计

**验收标准**:
- [ ] Home 页面设计符合 checkmarx.dev 风格
- [ ] LobeChat iframe 正常显示
- [ ] Agent 卡片可交互
- [ ] 移动端布局正常

---

### 🔵 阶段 5: Blog 系统 (4-5天)

**优先级**: P1 (高优先级)

#### 5.1 后端 Blog API
- [ ] Blog 列表 API (分页/搜索/标签过滤)
- [ ] Blog 详情 API
- [ ] Blog 创建 API
- [ ] Blog 更新 API
- [ ] Blog 删除 API
- [ ] 标签管理 API

#### 5.2 前端 Blog 页面
- [ ] Blog 列表页
- [ ] Blog 标签过滤
- [ ] Blog 搜索功能
- [ ] Blog 详情页
- [ ] Markdown 渲染
- [ ] **SEO 优化** (OpenGraph、Sitemap、结构化数据)

#### 5.3 Tiptap 编辑器集成
- [ ] Tiptap 安装配置
- [ ] 基础编辑功能
- [ ] Markdown 快捷键
- [ ] 图片上传
- [ ] 代码块高亮

#### 5.4 Blog 管理
- [ ] Blog CRUD 后台页面
- [ ] 草稿/发布状态切换
- [ ] 文章历史版本

**交付物**:
- ✅ Blog 完整 CRUD
- ✅ Tiptap 富文本编辑
- ✅ Markdown 支持
- ✅ 标签分类管理

**验收标准**:
- [ ] Blog 可以创建/编辑/发布
- [ ] Tiptap 编辑器正常
- [ ] Markdown 渲染正确
- [ ] 标签过滤可用

---

### 🟡 阶段 6: Tools + Labs 展示 (2-3天)

**优先级**: P1 (高优先级)

#### 6.1 Tools 页面
- [ ] Tools 列表页
- [ ] 分类展示
- [ ] 搜索功能
- [ ] Tools 卡片

#### 6.2 Labs 页面
- [ ] Labs 列表页
- [ ] 产品状态标签
- [ ] Labs 卡片

#### 6.3 后台管理
- [ ] Tools CRUD
- [ ] Labs CRUD
- [ ] 媒体上传

**交付物**:
- ✅ Tools 展示页面
- ✅ Labs 展示页面
- ✅ 后台 Tools/Labs 管理

**验收标准**:
- [ ] Tools 列表可浏览
- [ ] Labs 列表可浏览
- [ ] 后台可管理 Tools/Labs

---

### 🟡 阶段 7: 管理后台 (3-4天)

**优先级**: P1 (高优先级)

#### 7.1 Admin Dashboard
- [ ] 仪表盘首页
- [ ] 统计数据展示
- [ ] 快捷操作入口

#### 7.2 用户管理
- [ ] 用户列表
- [ ] 用户详情
- [ ] 用户权限管理

#### 7.3 内容管理
- [ ] Articles 管理
- [ ] Agents 管理
- [ ] Tools 管理
- [ ] Labs 管理

#### 7.4 个人设置
- [ ] 个人信息编辑
- [ ] 密码修改

**交付物**:
- ✅ 完整 Admin Dashboard
- ✅ 用户管理
- ✅ 内容管理
- ✅ 个人设置

**验收标准**:
- [ ] Admin 可以管理所有内容
- [ ] 用户权限正常
- [ ] 所有 CRUD 操作可用

---

### 🟡 阶段 8: 优化与部署 (2-3天)

**优先级**: P2 (中优先级)

#### 8.1 测试
- [ ] 后端 API 测试 (≥80% 覆盖率)
- [ ] 前端组件测试
- [ ] 认证流程测试
- [ ] CRUD 流程测试

#### 8.2 性能优化
- [ ] 数据库查询优化
- [ ] 前端代码分割
- [ ] 图片懒加载

#### 8.3 安全审计
- [ ] SQL 注入防护
- [ ] XSS 防护
- [ ] CSRF 防护

#### 8.4 部署准备
- [ ] 生产环境配置
- [ ] Docker 配置
- [ ] Nginx 配置

**交付物**:
- ✅ 测试覆盖率报告
- ✅ 性能优化
- ✅ 安全审计
- ✅ 部署配置

---

## 📊 进度追踪

| 阶段 | 状态 | 工期 | 任务数 |
|------|------|------|--------|
| 阶段 0 | ✅ 完成 | 1天 | 5 |
| 阶段 1 | 🔄 进行中 | 2-3天 | 16 |
| 阶段 2 | ⏸️ 待开始 | 2-3天 | 13 |
| 阶段 3 | ⏸️ 待开始 | 2天 | 10 |
| 阶段 4 | ⏸️ 待开始 | 3-4天 | 18 |
| 阶段 5 | ⏸️ 待开始 | 4-5天 | 22 |
| 阶段 6 | ⏸️ 待开始 | 2-3天 | 10 |
| 阶段 7 | ⏸️ 待开始 | 3-4天 | 12 |
| 阶段 8 | ⏸️ 待开始 | 2-3天 | 10 |
| **合计** | | **21-28天** | **116** |

---

## 设计文档引用

| 类型 | 路径 | 内容 |
|------|------|------|
| **UI 设计资源** | [../frontend/design-assets/](../frontend/design-assets/) | AI Skills 生成的组件/页面设计稿 |
| **架构设计** | [../design/architecture.md](../design/architecture.md) | 系统架构、技术栈、分层设计 |
| **数据库设计** | [../design/database-schema.md](../design/database-schema.md) | 数据实体、索引策略 |
| **API设计** | [../design/api-design.md](../design/api-design.md) | RESTful规范、端点设计 |
| **UI/UX设计** | [../design/ui-ux-spec.md](../design/ui-ux-spec.md) | 设计系统、组件规范 |
| **Agentic 环境配置** | [../guides/agentic-environment.md](../guides/agentic-environment.md) | 开发环境中的 Agents、Skills、MCP 服务器与开发规范 |

---

## 🎯 下一步行动

1. **立即执行**: 完成阶段 1（基础设施搭建）- 后端API和前端基础功能
2. **本周目标**: 完成阶段 1-2（认证系统开发）
3. **下周计划**: 开始阶段 3-4（数据库设计与首页开发）

---

**更新日期**: 2026-02-01
