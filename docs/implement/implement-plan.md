# work-agents 项目实施计划（需求跟踪列表）
> 项目需求跟踪列表，实际执行计划请参考 openspec/specs/

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
- **WebSocket 服务**: 实时双向通信、在线用户计数、状态同步
- **Blog 系统**: CRUD操作、富文本编辑、标签分类
- **Tools/Labs 展示**: 列表展示、搜索功能
- **管理后台**: 完整CRUD功能
- **文件上传**: 图片上传、存储

### ❌ 不包含
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

- **State**: ✅ 项目全量实施完成 (Production Ready Prototype)
- **Frontend**: Next.js 15 项目完整实现，包含 5 大 Genesis 风格页面、Tiptap 编辑器、WebSocket 实时计数。
- **Backend**: FastAPI 项目完整实现，包含 JWT/OAuth 认证、CRUD API、Media 服务、异步消息总线。
- **Database**: SQLite 数据库完整迁移，Alembic 迁移系统版本对齐。
- **Documentation**: 所有 OpenSpec 变更提案已归档至主规范。
- **Completed**: 全部阶段 (Phase 0 - 9) 已 100% 交付。
- **Current Focus**: 系统维护与生产环境部署。

---

## 技术架构

### Frontend Stack
- **Framework**: Next.js 15.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/UI
- **State Management**: TanStack Query + Zustand
- **WebSocket Client**: 实时通信、双向数据流、状态同步
- **Forms**: React Hook Form + Zod
- **Editor**: Tiptap

### Backend Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0
- **WebSocket Server**: 实时通信服务、连接管理、消息广播
- **Orchestration Engine**: Agent 间协调与通信协议
- **Database**: SQLite
- **Migration**: Alembic
- **Validation**: Pydantic 2.x
- **Authentication**: python-jose + bcrypt

---

## 详细任务清单

### 📋 AI 执行协议与工作流 (The Squad Workflow)

本项目采用 **UltraWork (ULW)** 自主执行协议，所有 AI Agent 必须遵守以下流程：

#### 1. 任务启动 (Sync & Handshake)
- **OpenSpec 挂载**: 开始任何阶段前，必须运行 `/openspec-apply <change-id>`。
- **环境感知**: 查阅 `docs/guides/agentic-environment.md`。
- **视觉溯源**: 查阅 `frontend/design-assets/` 下的高保真设计稿（P0 优先级）。

#### 2. 深度执行 (Deep Action)
- **实时状态更新**: 在每个原子任务（`- [ ]`）完成后，必须**立即**更新 `implement-plan.md` 对应项为 `- [x]`。
- **职责分配**:
    - 逻辑/架构: 由 **Hephaestus** 执行。
    - UI/UX/动画: 由 **Frontend Eng** 执行。
- **减重执行**: 派遣 **Librarian** 检索背景资料，主 Agent 保持 Context 清洁。

#### 3. 质量闭环 (Verify & Pass)
- **强制自检**: 提交前必运行 `scripts/lint.sh` 和 `scripts/test.sh`。
- **Oracle 审计**: 若连续失败 3 次或遭遇技术瓶颈，必须召唤 **Oracle** 或触发 `/ultrathink`。

#### 4. 归档与结算 (Archive)
- **真相归档**: 阶段完成后运行 `/openspec-archive <change-id>`。
- **记忆固化**: 将踩坑经验和最佳实践追加至 `.sisyphus/notepads/`。
- **进度更新**: 更新本计划的【进度追踪】表格并通知用户。

#### 执行确认规则
AI agents **必须** 在获得人类或 Sisyphus (Lead) 的明确指令（如 "ulw", "开始"）后方可启动代码修改。严禁在未经确认的情况下擅自变更生产代码。

### ✅ 阶段 0: 项目初始化 (1天) - 已完成

 - [x] 创建项目目录结构
 - [x] 配置脚本文件 (scripts/)
 - [x] 创建环境变量模板
 - [x] 创建项目文档框架
 - [x] 初始化 Git 仓库

---

### ✅ 阶段 1: 基础设施搭建 (2-3天) - 已完成

**优先级**: P0 (关键路径)

#### 1.1 前端项目初始化
 - [x] 初始化 Next.js 15 项目 (App Router)
 - [x] 配置 TypeScript (strict 模式)
 - [x] 配置 Tailwind CSS 4
 - [x] 配置 ESLint + Prettier
 - [x] 安装 Shadcn/UI 组件库
 - [x] 配置路径别名 (@/...)
 - [x] 配置 dark/light 主题

#### 1.2 后端项目初始化
 - [x] 初始化 FastAPI 项目
 - [x] 配置 SQLAlchemy ORM
 - [x] 配置 SQLite 数据库
 - [x] 配置 Alembic 迁移工具
 - [x] 设置项目目录结构
 - [x] **创建 Admin 路由聚合与 Media 服务模板** (预留 CRUD 接口)
 - [x] 配置 Ruff + MyPy

#### 1.3 开发环境配置
 - [x] 配置前后端代理 (Next.js rewrites)
 - [x] 配置 CORS 跨域
 - [x] 配置统一日志 system
 - [x] 配置统一异常处理
 - [x] 创建 API 响应封装

**交付物**:
 - ✅ 可运行的前后端项目骨架
 - ✅ 数据库连接和基础模型
 - ✅ 开发环境完整配置
 - ✅ API 响应标准化

**验收标准**:
 - [x] 前端: http://localhost:3001 可访问
 - [x] 后端: http://localhost:8001/docs 可访问
 - [x] 数据库连接成功

---

### ✅ 阶段 2: 认证系统开发 (2-3天) - 已完成

**优先级**: P0 (关键路径)

#### 2.1 数据库模型
 - [x] 创建 users 表
 - [x] 创建数据库迁移

#### 2.2 后端认证 API
 - [x] 用户注册 API
 - [x] 用户登录 API (JWT)
 - [x] **Token 刷新与自愈机制** (防止 UI 闪烁)
 - [x] Token 刷新机制
 - [x] 密码加密存储 (bcrypt)
 - [x] 退出登录

#### 2.3 OAuth 集成
 - [x] GitHub OAuth 配置
 - [x] Google OAuth 配置
 - [x] OAuth callback 处理
 - [x] OAuth 用户信息获取

#### 2.4 前端认证实现
 - [x] 登录页面 UI
 - [x] 注册页面 UI
 - [x] OAuth 登录按钮
 - [x] Token 持久化存储
 - [x] 全局认证状态管理
 - [x] 路由守卫 (保护后台)

#### 2.5 权限控制
 - [x] RBAC 权限中间件
 - [x] API 级别权限校验
 - [x] 前端页面权限控制

**交付物**:
 - ✅ 完整的用户认证流程
 - ✅ JWT Token 管理
 - ✅ OAuth 第三方登录
 - ✅ 权限控制系统

**验收标准**:
 - [x] 用户可以注册/登录
 - [x] Token 自动刷新
 - [x] 未登录用户无法访问管理后台
 - [x] GitHub/Google 登录可用

---

### ✅ 阶段 3: 数据库设计与实现 (2天) - 已完成

**优先级**: P0 (关键路径)

#### 3.1 数据库模型设计
 - [x] 创建 agents 表
 - [x] 创建 articles 表
 - [x] 创建 categories 表
 - [x] 创建 tools 表
 - [x] 创建 labs 表
 - [x] 创建 article_versions 表

#### 3.2 数据访问层
 - [x] 创建 CRUD 基础类
 - [x] 实现关联查询
 - [x] 实现分页查询

#### 3.3 数据初始化
 - [x] 创建 5 个 Agent 模拟数据
 - [x] 创建默认分类数据
 - [x] 创建初始用户 (admin)

**交付物**:
 - ✅ 完整的数据库模型
 - ✅ Alembic 迁移脚本
 - ✅ 基础 CRUD 操作
 - ✅ 初始化数据

**验收标准**:
 - [x] 数据库迁移成功
 - [x] 所有表创建成功
 - [x] 初始化数据正确

---

### ✅ 阶段 4: Home + Agents 页面 (3-4天) - 已完成

**优先级**: P0 (关键路径)

#### 4.1 Home 页面
 - [x] Hero 区域 (大标题 + CTA)
 - [x] **对齐设计稿**: `frontend/design-assets/pages/home-v1.png`
 - [x] 核心价值展示区
 - [x] 功能特性介绍
 - [x] Footer 区域
 - [x] 响应式布局适配
 - [x] **页面过渡动画** (主题切换平滑过渡 ~0.3s)
 - [x] **滚动触发动画** (卡片滑入淡入效果)
 - [x] **Hero 动画效果** (打字机效果、按钮 hover 特效)

#### 4.2 Agents 页面
 - [x] Agents 页面基础布局
 - [x] **对齐设计稿**: `frontend/design-assets/pages/agents-v1.png`
 - [x] LobeChat 集成（通过 Orchestration Protocol 进行跨 Agent 消息传递和上下文共享）
 - [x] 实现 Agent 间通信协议（Orchestration Protocol）
 - [x] 跨 Agent 消息传递机制
 - [x] 统一身份认证 (SSO) 机制
 - [x] Agent 卡片展示区
 - [x] Tab 导航切换
 - [x] 5 个 AI Agent 展示卡片
 - [x] Agent 详情弹窗

**交付物**:
 - ✅ Home 页面完整实现
 - ✅ Agents 页面完整实现
 - ✅ LobeChat 集成 (Orchestration-based)
 - ✅ 响应式设计

**验收标准**:
 - [x] Home 页面设计符合 checkmarx.dev 风格
 - [x] LobeChat 交互正常
 - [x] Agent 卡片可交互
 - [x] 移动端布局正常

---

### ✅ 阶段 5: Blog 系统 (4-5天) - 已完成

**优先级**: P1 (高优先级)

#### 5.1 后端 Blog API
 - [x] Blog 列表 API (分页/搜索/标签过滤)
 - [x] Blog 详情 API
 - [x] Blog 创建 API
 - [x] Blog 更新 API
 - [x] Blog 删除 API
 - [x] 标签管理 API

#### 5.2 前端 Blog 页面
 - [x] Blog 列表页
 - [x] Blog 标签过滤
 - [x] Blog 搜索功能
 - [x] Blog 详情页
 - [x] Markdown 渲染
 - [x] **SEO 优化** (OpenGraph、Sitemap、结构化数据)

#### 5.3 Tiptap 编辑器集成
 - [x] Tiptap 安装配置
 - [x] 基础编辑功能
 - [x] Markdown 快捷键
 - [x] 图片上传
 - [x] 代码块高亮

#### 5.4 Blog 管理
 - [x] Blog CRUD 后台页面
 - [x] 草稿/发布状态切换
 - [x] 文章历史版本

**交付物**:
 - ✅ Blog 完整 CRUD
 - ✅ Tiptap 富文本编辑
 - ✅ Markdown 支持
 - ✅ 标签分类管理

**验收标准**:
 - [x] Blog 可以创建/编辑/发布
 - [x] Tiptap 编辑器正常
 - [x] Markdown 渲染正确
 - [x] 标签过滤可用

---

### ✅ 阶段 6: Tools + Labs 展示 (2-3天) - 已完成

**优先级**: P1 (高优先级)

#### 6.1 Tools 页面
 - [x] Tools 列表页
 - [x] 分类展示
 - [x] 搜索功能
 - [x] Tools 卡片

#### 6.2 Labs 页面
 - [x] Labs 列表页（含 WebSocket 实时在线用户计数器）
 - [x] 产品状态标签
 - [x] Labs 卡片

#### 6.3 后台管理
 - [x] Tools CRUD
 - [x] Labs CRUD
 - [x] 媒体上传

**交付物**:
 - ✅ Tools 展示页面
 - ✅ Labs 展示页面
 - ✅ 后台 Tools/Labs 管理

**验收标准**:
 - [x] Tools 列表可浏览
 - [x] Labs 列表可浏览
 - [x] 后台可管理 Tools/Labs

---

### ✅ 阶段 7: 管理后台 (3-4天) - 已完成

**优先级**: P1 (高优先级)

#### 7.1 Admin Dashboard
 - [x] 仪表盘首页
 - [x] 统计数据展示
 - [x] 快捷操作入口

#### 7.2 用户管理
 - [x] 用户列表
 - [x] 用户详情
 - [x] 用户权限管理

#### 7.3 内容管理
 - [x] Articles 管理
 - [x] Agents 管理
 - [x] Tools 管理
 - [x] Labs 管理

#### 7.4 个人设置
 - [x] 个人信息编辑
 - [x] 密码修改

**交付物**:
 - ✅ 完整 Admin Dashboard
 - ✅ 用户管理
 - ✅ 内容管理
 - ✅ 个人设置

**验收标准**:
 - [x] Admin 可以管理所有内容
 - [x] 用户权限正常
 - [x] 所有 CRUD 操作可用

---

### ✅ 阶段 8: 优化与部署 (2-3天) - 已完成

**优先级**: P2 (中优先级)

#### 8.1 测试
 - [x] 后端 API 测试 (≥80% 覆盖率)
 - [x] 前端组件测试
 - [x] 认证流程测试
 - [x] CRUD 流程测试

#### 8.2 性能优化
 - [x] 数据库查询优化
 - [x] 前端代码分割
 - [x] 图片懒加载

#### 8.3 安全审计
 - [x] SQL 注入防护
 - [x] XSS 防护
 - [x] CSRF 防护

#### 8.4 部署准备
 - [x] 生产环境配置
 - [x] Docker 配置
 - [x] Nginx 配置
 - [x] **生成 `scripts/deploy.sh` 生产环境一键拉起脚本**

---

### ✅ 阶段 9: 系统能力实现 (System Capabilities) - 已完成

#### 9.1 Memory Management
 - [x] 实现 Agent 状态和长期记忆的持久化存储
 - [x] 实现记忆过期与清理机制
 - [x] 实现用户与 Agent 记忆关联

#### 9.2 Observability
 - [x] 实现执行追踪系统
 - [x] 实现日志记录系统
 - [x] 实现监控仪表板

#### 9.3 Identity Propagation
 - [x] 实现基于 JWT 的统一身份认证协议
 - [x] 实现跨 Agent 和服务的身份同步
 - [x] 实现统一会话管理

#### 9.4 Message Bus
 - [x] 实现多 Agent 间异步消息传递机制
 - [x] 实现事件流处理系统
 - [x] 实现消息关联与追踪机制

---

## 📊 进度追踪

| 阶段 | 状态 | 工期 | 任务数 |
|------|------|------|--------|
| 阶段 0 | ✅ 完成 | 1天 | 5 |
| 阶段 1 | ✅ 完成 | 2-3天 | 16 |
| 阶段 2 | ✅ 完成 | 2-3天 | 13 |
| 阶段 3 | ✅ 完成 | 2天 | 10 |
| 阶段 4 | ✅ 完成 | 3-4天 | 21 |
| 阶段 5 | ✅ 完成 | 4-5天 | 22 |
| 阶段 6 | ✅ 完成 | 2-3天 | 10 |
| 阶段 7 | ✅ 完成 | 3-4天 | 12 |
| 阶段 8 | ✅ 完成 | 2-3天 | 10 |
| 阶段 9 | ✅ 完成 | 2-3天 | 12 |
| **合计** | ✅ **100%** | **21-28天** | **131** |

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

1. **归档结算**: 确认所有 OpenSpec 变更已成功合并至主规范文件。
2. **生产验证**: 使用 `scripts/deploy.sh` 在隔离环境测试全量启动。
3. **交付验收**: 交付完整的代码库、设计文档及实施报告。

---

**更新日期**: 2026-02-04
