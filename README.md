# work-agents

现代 AI 多智能体编排平台 (Modern AI Multi-Agent Orchestration Platform)

## 🎯 项目概述

**work-agents** 是一个现代 AI 多智能体编排平台，专为极客社区设计，支持智能体间协作与通信、实时状态同步和统一身份认证。平台通过编排协议实现智能体间的无缝协作，提供实时通信能力、持久化内存管理和基于 JWT 的身份传播。

Work-Agents 旨在创建一个智能化的工作协作环境，使多个 AI 智能体能够像团队一样协同工作。该平台不仅提供了一个集成的用户界面来管理这些智能体，还通过先进的编排协议确保它们之间的通信、状态同步和身份管理都是无缝的。

### 核心功能 (Core Features)
- 🤖 **Agent Orchestration**: 多智能体协作核心引擎，支持跨智能体消息传递与上下文共享
- 🔗 **Orchestration Protocol**: 标准化的跨智能体通信协议，确保不同智能体间的互操作性
- ⚡ **Real-time Updates**: WebSocket 服务提供实时双向通信，支持在线状态更新和实时数据流
- 🔐 **Identity Propagation**: 基于 JWT 的统一身份认证协议，实现跨智能体和服务的身份同步
- 🔄 **Agent Message Bus**: 实现多智能体间的异步消息机制，支持事件流处理
- 💾 **Persistent Memory**: 智能体状态与长期记忆持久化存储，支持上下文连续性
- 📊 **Observability**: 提供执行追踪、日志记录和监控仪表板，支持人类监督和反馈

### 业务价值 (Business Value)
- **聚合 AI 工具**: 统一管理多种 AI 助手，提供一站式访问体验
- **提升工作效率**: 通过智能体编排，自动化复杂任务流程
- **增强用户体验**: 提供极客美学设计，满足技术用户的审美需求
- **社区连接**: 支持内容分享和互动，构建技术社区

## 🚀 快速开始

### 前置要求

```bash
- Node.js >= 18
- Python >= 3.11
- uv (推荐) 或 pip
- Docker (可选，用于容器化部署)
```

### 安装

```bash
# 1. 克隆项目
git clone <repository-url>
cd work-agents

# 2. 执行环境初始化
chmod +x scripts/*.sh
./scripts/setup.sh

# 3. 配置环境变量
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# 编辑 .env 文件填写必要配置
```

### 开发

```bash
# 启动开发服务器
./scripts/start-dev.sh

# 访问
  - 前端: http://localhost:3001
  - 后端API: http://localhost:8001
  - API文档: http://localhost:8001/docs

```

### 其他命令

```bash
# 代码检查
./scripts/lint.sh

# 运行测试
./scripts/test.sh

# 构建生产版本
./scripts/build.sh

# 清理项目
./scripts/clean.sh

# 部署到生产环境
./scripts/deploy.sh

# 运行单元测试
./scripts/unit-test.sh

# 运行集成测试
./scripts/integration-test.sh
```

## 📁 项目结构

详细项目结构请参见 [docs/project_structure.md](docs/project_structure.md)

```
work-agents/
├── .agent/                 # Agent 配置文件
├── .claude/               # Claude AI 工具配置
├── .opencode/             # OpenCode 配置文件
├── .sisyphus/             # Sisyphus 工作流配置
│   └── notepads/          # AI 团队知识库
├── backend/               # FastAPI 后端服务
│   ├── src/               # 后端源代码
│   │   ├── api/           # API 路由定义 (v1 版本)
│   │   ├── core/          # 核心功能模块
│   │   ├── models/        # SQLAlchemy 数据库模型
│   │   ├── schemas/       # Pydantic 数据验证模型
│   │   ├── services/      # 业务逻辑服务
│   │   └── main.py        # 应用入口文件
│   ├── tests/             # 后端测试文件
│   ├── alembic/           # 数据库迁移工具
│   └── requirements.txt   # Python 依赖包列表
├── frontend/              # Next.js 前端应用
│   ├── src/               # 前端源代码
│   │   ├── app/           # Next.js App Router 页面
│   │   ├── components/    # React 组件库
│   │   ├── hooks/         # 自定义 React Hooks
│   │   ├── lib/           # 工具函数和库
│   │   ├── store/         # 状态管理
│   │   └── types/         # TypeScript 类型定义
│   ├── public/            # 静态资源
│   └── package.json       # Node.js 依赖配置
├── docs/                  # 项目文档
│   ├── api/               # API 文档
│   ├── architecture/      # 架构设计文档
│   ├── database/          # 数据库设计文档
│   ├── design/            # UI/UX 设计文档
│   ├── guides/            # 开发指南
│   ├── adr/               # 架构决策记录
│   └── requirements/      # 需求文档
├── openspec/              # OpenSpec 规范文件
│   ├── project.md         # 项目上下文
│   ├── AGENTS.md          # AI 代理开发规范
│   ├── specs/             # 核心规范 (单一致真源)
│   └── changes/           # 变更提案存档
├── scripts/               # 项目自动化脚本
├── logs/                  # 运行日志
├── discuss/               # 评审讨论文件
├── docker-compose.yml     # Docker 编排配置
├── nginx.conf             # Nginx 配置文件
└── README.md              # 项目主说明文档
```

## 🔄 Agentic 工作流

本项目采用先进的 AI 多智能体协作开发模式：

### Prometheus/Sisyphus/OpenSpec 协议
- **Prometheus**: 智能体规划与任务分解
- **Sisyphus**: 自主执行与状态管理
- **OpenSpec**: 规范驱动开发协议

该协议确保了 AI 智能体能够高效协作完成复杂开发任务。

## 🌐 功能模块

### 前端页面 (5个主要页面)
- **Home**: 品牌展示与价值主张传递
- **Agents**: AI助手集成与展示，采用 LobeChat 集成与 Orchestration Protocol
- **Tools**: 开发工具导航与分类展示
- **Labs**: 实验性产品展示，包含实时在线用户计数器
- **Blog**: 技术博客与内容营销系统

### 后台管理系统
- **认证系统**: 用户注册登录、JWT身份认证、角色权限控制
- **内容管理**: 各模块完整的CRUD操作
- **个人设置**: 个人信息与密码管理

## 🛠️ 技术栈

### 前端
- Next.js 15.5 (App Router) - 现代 React 框架
- React 19.1 - UI 库
- TypeScript - 静态类型检查
- Tailwind CSS 4 - 样式框架
- Shadcn/UI - 基础组件库
- Framer Motion - 交互动效
- TanStack Query - 数据获取和缓存
- Zustand - 状态管理
- React Hook Form - 表单管理
- Zod - Schema 验证

### 后端
- Python 3.11+ - 编程语言
- FastAPI - Web 框架
- SQLAlchemy 2.0 - ORM
- Alembic - 数据库迁移
- Pydantic v2 - 数据验证
- python-jose - JWT 处理
- passlib - 密码加密
- pytest - 测试框架
- WebSocket - 实时通信

### 数据库
- SQLite - 主数据库 (轻量级，单文件)
- SQLAlchemy Async - 异步数据库操作

### 其他
- JWT 认证 - 身份验证
- OpenSpec - 规范驱动开发
- Model Context Protocol (MCP) - 上下文协议
- OAuth (GitHub/Google) - 第三方登录

## 📚 文档

详细文档请查看以下结构：

- **项目上下文**: [openspec/project.md](openspec/project.md)
- **开发指南**: [docs/guides/README.md](docs/guides/README.md) (主路径 Master Path)
- **AI 标准**: [openspec/AGENTS.md](openspec/AGENTS.md)
- **项目结构详解**: [docs/project_structure.md](docs/project_structure.md)
- **API 文档**: [docs/api/api-design.md](docs/api/api-design.md)
- **数据库设计**: [docs/database/database-schema.md](docs/database/database-schema.md)
- **架构设计**: [docs/architecture/architecture.md](docs/architecture/architecture.md)
- **UI/UX 设计**: [docs/design/ui-ux-spec.md](docs/design/ui-ux-spec.md)
- **产品需求**: [docs/requirements/requirement.md](docs/requirements/requirement.md)
- **实施计划**: [docs/requirements/implement-plan.md](docs/requirements/implement-plan.md)

## 🔒 环境变量

### Backend (.env)

```env
# 数据库
DATABASE_URL=sqlite:///./work_agents.db

# JWT 认证
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3001

# WebSocket
WEBSOCKET_HOST=0.0.0.0
WEBSOCKET_PORT=8001

# OAuth (可选)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# 应用配置
APP_ENV=development
```

### Frontend (.env.local)

```env
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# WebSocket 地址
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8001/ws

# OAuth 配置
NEXT_PUBLIC_GITHUB_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

# 其他配置
NEXT_PUBLIC_APP_NAME=work-agents
```

## 🧪 测试

```bash
# 运行所有测试
./scripts/test.sh

# 仅后端测试
cd backend && pytest tests/ -v

# 仅前端测试
cd frontend && npm test

# 运行覆盖率测试
./scripts/coverage.sh

# 运行性能测试
./scripts/performance-test.sh
```

## 🚀 部署

### 本地部署
```bash
# 构建前端
cd frontend && npm run build

# 构建后端
cd backend && pip install -r requirements.txt

# 启动服务
./scripts/start-prod.sh
```

### Docker 部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 环境配置
- **开发环境**: 使用 SQLite，热重载启用
- **测试环境**: 内存数据库，完整测试套件
- **生产环境**: 优化配置，禁用调试模式

## 📝 开发规范

请严格遵守 [AGENTS.md](openspec/AGENTS.md) 中定义的开发规范：

- 文件规模限制
- 代码复杂度控制
- 命名规范
- Git 提交规范
- 架构设计原则
- OpenSpec 规范驱动开发

## 🔐 安全措施

### 认证安全
- JWT 身份认证，密码 bcrypt 加密存储
- OAuth 集成 (GitHub/Google)
- 角色权限控制 (Admin/Editor)

### 速率限制
- 登录接口：同一 IP 限制 10 次/分钟
- API 全局：限制 100 次/分钟

### 其他安全措施
- HTTPS 强制、输入验证、SQL 注入防护
- XSS 防护 (CSP + 前端转义)
- CSRF 防护 (SameSite Cookie 策略)

## 🤝 贡献

欢迎提交 Pull Request！请确保：

1. 代码通过 `./scripts/lint.sh` 检查
2. 所有测试通过 `./scripts/test.sh`
3. 遵循项目的 OpenSpec 规范
4. 遵循 AGENTS.md 中定义的开发规范
5. 提交前运行 `./scripts/test.sh` 确保没有引入回归

### 贡献流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🏗️ 架构特点

### 高性能设计
- 首屏加载 < 1.5s
- API 响应时间 P95 < 200ms
- 支持 500+ 在线用户

### 响应式设计
- Chrome/Edge、Firefox、Safari 最新2个主版本
- 响应式设计（Mobile/Tablet/Desktop/Wide）

### 设计美学
- 暗黑色系，渐变（紫色/蓝色基调）
- 赛博朋克元素，极简主义，科技感
- 微妙视差、按钮悬停光晕、页面滚动平滑过渡

---

**Build High-Quality Software!** 🚀

**项目状态**: Production Ready Prototype (完全实现，可部署)  
**最后更新**: 2026年2月5日