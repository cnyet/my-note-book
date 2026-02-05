# work-agents 项目结构详解

## 📋 项目概述

**work-agents** 是一个现代 AI 多智能体编排平台，专为极客社区设计，支持智能体间协作与通信、实时状态同步和统一身份认证。

- **前端技术栈**: Next.js 15.5, React 19.1, TypeScript, Tailwind CSS 4, Shadcn/UI
- **后端技术栈**: Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2, WebSocket
- **认证协议**: JWT 认证，基于身份传播协议
- **开发协议**: OpenSpec 规范驱动开发

## 🏗️ 详细目录结构

```
work-agents/
├── .agent/                 # Agent 配置文件
│   └── ...
├── .claude/               # Claude AI 工具配置
│   └── ...
├── .opencode/             # OpenCode 配置文件
│   ├── command/           # 命令配置
│   ├── bun.lock           # Bun 依赖锁定文件
│   └── package.json       # OpenCode 包配置
├── .sisyphus/             # Sisyphus 工作流配置
│   └── notepads/          # AI 团队知识库
├── backend/               # FastAPI 后端服务
│   ├── src/               # 后端源代码
│   │   ├── api/           # API 路由定义 (v1 版本)
│   │   │   └── v1/        # API 版本 1
│   │   │       ├── auth.py    # 身份认证相关路由
│   │   │       ├── content.py # 内容管理相关路由
│   │   │       └── media.py   # 媒体文件相关路由
│   │   ├── core/          # 核心功能模块
│   │   │   ├── config.py     # 应用配置
│   │   │   ├── database.py   # 数据库配置
│   │   │   ├── logging.py    # 日志系统
│   │   │   ├── message_bus.py # 消息总线
│   │   │   ├── security.py   # 安全相关
│   │   │   └── websocket.py  # WebSocket 服务
│   │   ├── models/        # SQLAlchemy 数据库模型
│   │   │   ├── agent.py      # 智能体模型
│   │   │   ├── category.py   # 分类模型
│   │   │   ├── content.py    # 内容模型
│   │   │   ├── memory.py     # 记忆模型
│   │   │   ├── tag.py        # 标签模型
│   │   │   └── user.py       # 用户模型
│   │   ├── schemas/       # Pydantic 数据验证模型
│   │   │   ├── agent.py      # 智能体数据验证
│   │   │   ├── content.py    # 内容数据验证
│   │   │   └── user.py       # 用户数据验证
│   │   ├── services/      # 业务逻辑服务
│   │   │   ├── media.py      # 媒体服务
│   │   │   └── memory.py     # 记忆服务
│   │   ├── scripts/       # 脚本文件
│   │   └── main.py        # 应用入口文件
│   ├── tests/             # 后端测试文件
│   ├── alembic/           # 数据库迁移工具
│   ├── alembic.ini        # Alembic 配置文件
│   ├── requirements.txt   # Python 依赖包列表
│   ├── .env               # 环境变量配置
│   ├── .env.example       # 环境变量示例
│   └── README.md          # 后端说明文档
├── frontend/              # Next.js 前端应用
│   ├── src/               # 前端源代码
│   │   ├── app/           # Next.js App Router 页面
│   │   │   ├── (auth)/      # 认证相关页面
│   │   │   ├── admin/       # 管理员页面
│   │   │   ├── agents/      # 智能体页面
│   │   │   ├── auth/        # 认证页面
│   │   │   ├── blog/        # 博客页面
│   │   │   ├── labs/        # 实验室页面
│   │   │   ├── tools/       # 工具页面
│   │   │   ├── globals.css  # 全局样式
│   │   │   ├── layout.tsx   # 布局组件
│   │   │   └── page.tsx     # 主页组件
│   │   ├── components/    # React 组件库
│   │   ├── hooks/         # 自定义 React Hooks
│   │   ├── lib/           # 工具函数库
│   │   ├── store/         # 状态管理
│   │   ├── test/          # 前端测试
│   │   └── types/         # TypeScript 类型定义
│   ├── public/            # 静态资源
│   ├── design-assets/     # 设计资产
│   ├── node_modules/      # NPM 依赖
│   ├── package.json       # Node.js 依赖配置
│   ├── package-lock.json  # 依赖锁定文件
│   ├── .env.example       # 前端环境变量示例
│   ├── .env.local         # 本地环境变量
│   └── README.md          # 前端说明文档
├── docs/                  # 项目文档
│   ├── api/               # API 文档
│   ├── architecture/      # 架构设计文档
│   ├── database/          # 数据库设计文档
│   ├── guides/            # 开发指南
│   ├── adr/               # 架构决策记录
│   ├── design/            # 设计文档
│   ├── implement/         # 实现计划
│   ├── ideas-draft.md     # 创意草案
│   ├── requirement.md     # 需求文档
│   └── README.md          # 文档入口
├── openspec/              # OpenSpec 规范文件
│   ├── project.md         # 项目上下文
│   ├── AGENTS.md          # AI 代理开发规范
│   ├── specs/             # 核心规范 (单一致真源)
│   │   ├── admin-deep/      # 深度管理规范
│   │   ├── blog-system/     # 博客系统规范
│   │   ├── content-management/ # 内容管理规范
│   │   ├── core-models/     # 核心模型规范
│   │   ├── ecosystem/       # 生态系统规范
│   │   ├── identity-auth/   # 身份认证规范
│   │   ├── media-service/   # 媒体服务规范
│   │   ├── observability/   # 可观测性规范
│   │   ├── orchestration-platform/ # 编排平台规范
│   │   └── ui-system/       # UI 系统规范
│   └── changes/           # 变更提案存档
│       └── archive/         # 存档的变更提案
├── scripts/               # 项目自动化脚本
│   ├── build.sh           # 构建生产版本
│   ├── clean.sh           # 清理项目
│   ├── deploy.sh          # 部署脚本
│   ├── lint.sh            # 代码检查
│   ├── setup.sh           # 环境设置
│   ├── start-dev.sh       # 启动开发服务器
│   ├── test.sh            # 运行测试
│   └── ...                # 其他脚本
├── logs/                  # 运行日志
├── discuss/               # 评审讨论文件
├── .editorconfig          # 编辑器配置
├── .gitignore             # Git 忽略文件配置
├── .git/                  # Git 版本控制系统
├── AGENTS.md              # AI 代理开发规范
├── CLAUDE.md              # Claude 配置文件
├── docker-compose.yml     # Docker 编排配置
├── nginx.conf             # Nginx 配置文件
├── package.json           # 顶层包配置
├── package-lock.json      # 顶层依赖锁定文件
├── README.md              # 项目主说明文档
├── LICENSE                # 许可证文件
└── ...
```

## 🧩 核心模块解析

### 1. 后端 (backend/)
- **API 层**: 使用 FastAPI 构建 RESTful API，支持版本化
- **模型层**: SQLAlchemy ORM 模型，支持 Agent、User、Content、Memory 等实体
- **业务逻辑**: 服务层封装处理业务规则和数据操作
- **认证系统**: JWT token 认证，支持身份传播
- **WebSocket**: 实现实时通信功能
- **数据库**: 支持 SQLite，默认配置

### 2. 前端 (frontend/)
- **框架**: Next.js 15.5 App Router 结构
- **组件**: 基于 Shadcn/UI 的现代化 UI 组件
- **状态管理**: 使用 Zustand 进行状态管理
- **数据获取**: 使用 TanStack Query 进行数据缓存和管理
- **类型安全**: 完整的 TypeScript 支持

### 3. 编排系统 (Orchestration Layer)
- **消息总线**: Agent Message Bus 实现多智能体间异步消息机制
- **身份传播**: 基于 JWT 的统一身份认证协议
- **实时通信**: WebSocket 支持实时双向通信
- **智能体记忆**: 持久化内存管理系统

### 4. 开发工作流 (Development Workflow)
- **OpenSpec**: 规范驱动开发，确保变更可追溯
- **Sisyphus**: 自主执行与状态管理工作流
- **Prometheus**: 智能体规划与任务分解
- **文档完备**: 从需求到实现的完整文档链路

## 🚀 运行方式

### 开发模式
```bash
# 设置环境
./scripts/setup.sh

# 启动开发服务器
./scripts/start-dev.sh

# 访问
# - 前端: http://localhost:3001
# - 后端API: http://localhost:8001
# - API文档: http://localhost:8001/docs
```

### 测试与构建
```bash
# 代码检查
./scripts/lint.sh

# 运行测试
./scripts/test.sh

# 构建生产版本
./scripts/build.sh
```

## 💡 技术亮点

1. **AI 多智能体编排**: 支持多个智能体协作与通信
2. **实时状态同步**: WebSocket 实现实时数据流
3. **统一身份认证**: JWT 基于身份传播协议
4. **持久化记忆**: 智能体状态与长期记忆管理
5. **标准化通信**: 跨智能体通信协议
6. **现代化技术栈**: 最新的前端后端技术组合

## 🔧 维护说明

- **代码规范**: 遵循 AGENTS.md 和 OpenSpec 规范
- **文件大小限制**: 动态语言最大 300 行，静态文件最大 400 行
- **逻辑复杂度**: 函数最多 50 行，参数最多 5 个，嵌套不超过 3 层
- **安全准则**: 零硬编码，强制服务端验证，错误日志记录到 logs/ 目录
