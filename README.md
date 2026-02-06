# work-agents

现代 AI 多智能体编排平台 (Modern AI Multi-Agent Orchestration Platform)

## 🎯 项目概述

**work-agents** 是一个现代 AI 多智能体编排平台，专为极客社区设计，支持智能体间协作与通信、实时状态同步和统一身份认证。平台通过编排协议实现智能体间的无缝协作，提供实时通信能力、持久化内存管理和基于 JWT 的身份传播。

### 核心功能 (Core Features)

- 🤖 **Agent Orchestration**: 多智能体协作核心引擎，支持跨智能体消息传递与上下文共享
- 🔗 **Orchestration Protocol**: 标准化的跨智能体通信协议，确保不同智能体间的互操作性
- ⚡ **Real-time Updates**: WebSocket 服务提供实时双向通信，支持在线状态更新和实时数据流
- 🔐 **Identity Propagation**: 基于 JWT 的统一身份认证协议，实现跨智能体和服务的身份同步
- 🔄 **Agent Message Bus**: 实现多智能体间的异步消息机制，支持事件流处理
- 💾 **Persistent Memory**: 智能体状态与长期记忆持久化存储，支持上下文连续性
- 📊 **Observability**: 提供执行追踪、日志记录和监控仪表板，支持人类监督和反馈

## 🚀 快速开始

### 前置要求

| 工具    | 版本    | 用途     |
| ------- | ------- | -------- |
| Node.js | >= 18   | 前端开发 |
| Python  | >= 3.11 | 后端开发 |
| Git     | 任意    | 版本控制 |

### 安装步骤

#### 1. 克隆项目

```bash
git clone <repository-url>
cd work-agents
```

#### 2. 安装依赖

**macOS:**

```bash
# 使用 Homebrew
brew install node python@3.11

# 推荐：安装 uv（更快的 Python 包管理器）
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Ubuntu/Debian:**

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python
sudo apt-get install python3.11 python3.11-venv python3.11-pip
```

**Windows:**

- 下载安装 Node.js: https://nodejs.org/
- 下载安装 Python: https://python.org/

#### 3. 初始化项目

```bash
# 执行初始化脚本
chmod +x scripts/maintenance/*.sh
./scripts/maintenance/setup.sh
```

脚本会自动完成：

- ✅ 创建 Python 虚拟环境
- ✅ 安装后端依赖
- ✅ 运行数据库迁移
- ✅ 安装前端依赖

#### 4. 配置环境变量

```bash
# 后端配置（必需）
cp backend/.env.example backend/.env
# 编辑 backend/.env，设置 SECRET_KEY（至少32位随机字符串）

# 前端配置（通常无需修改）
cp frontend/.env.example frontend/.env.local
```

#### 5. 启动开发服务器

```bash
# 一键启动前后端
./scripts/maintenance/start-dev.sh

# 或手动启动
# 终端1 - 后端
cd backend && source .venv/bin/activate && uvicorn src.main:app --reload --port 8001

# 终端2 - 前端
cd frontend && npm run dev
```

**访问地址:**

- 🌐 前端: http://localhost:3001
- 🔌 后端 API: http://localhost:8001
- 📚 API 文档: http://localhost:8001/docs

### 验证安装

```bash
# 健康检查
curl http://localhost:8001/health

# 运行测试
./scripts/test/test.sh
```

### 常见问题

**启动失败怎么办？**

```bash
# 清理端口和缓存
./scripts/maintenance/clean.sh

# 然后重新启动
./scripts/maintenance/start-dev.sh
```

**端口被占用？**

```bash
# 查看占用端口的进程
lsof -ti:8001  # 后端端口
lsof -ti:3001  # 前端端口

# 终止进程
kill -9 $(lsof -ti:8001)
```

**Python 包安装失败？**

```bash
# 升级 pip
cd backend && pip install --upgrade pip

# 或使用 uv（推荐）
uv pip install -r requirements.txt
```

**Node 模块问题？**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**查看日志？**

```bash
# 后端日志
tail -f logs/backend.log

# 前端日志
tail -f logs/frontend.log
```

### 其他命令

```bash
# 代码检查
./scripts/maintenance/lint.sh

# 运行测试
./scripts/test/test.sh

# 构建生产版本
./scripts/build/build.sh

# 清理项目
./scripts/maintenance/clean.sh

# 部署到生产环境
./scripts/deploy/deploy.sh
```

## 📁 项目结构

```
work-agents/
├── .agent/                # Agent 配置文件
├── .claude/               # Claude AI 工具配置
├── .opencode/             # OpenCode 配置文件
├── .sisyphus/             # Sisyphus 工作流配置
│   └── notepads/          # AI 团队知识库
├── ai-configs/            # AI 工具配置统一入口
├── backend/               # FastAPI 后端服务
│   ├── src/               # 后端源代码
│   ├── tests/             # 后端测试文件
│   ├── data/              # 数据库文件
│   └── requirements.txt   # Python 依赖
├── frontend/              # Next.js 前端应用
│   ├── src/               # 前端源代码
│   └── package.json       # Node.js 依赖
├── docs/                  # 项目文档
│   ├── design/            # 设计文档 (架构、API、数据库、前端)
│   ├── development/       # 开发指南 (环境、工作流)
│   └── planning/          # 项目规划 (需求、路线图)
├── openspec/              # OpenSpec 规范文件
├── scripts/               # 项目自动化脚本
│   ├── build/             # 构建脚本
│   ├── test/              # 测试脚本
│   ├── deploy/            # 部署脚本
│   └── maintenance/       # 维护脚本
├── tests/                 # 集成测试和端到端测试
└── logs/                  # 运行日志
```

## 🛠️ 技术栈

### 前端

- Next.js 15.5 (App Router) - 现代 React 框架
- React 19.1 - UI 库
- TypeScript 5.x - 静态类型检查
- Tailwind CSS 4.x - 样式框架
- Shadcn/UI - 基础组件库
- Framer Motion 6.x+ - 交互动效
- TanStack Query 5.x - 数据获取和缓存
- Zustand 4.x - 状态管理
- React Hook Form 7.x - 表单管理
- Zod 3.x - Schema 验证

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

- **项目上下文**: [openspec/project.md](openspec/project.md)
- **开发指南**: [docs/development/README.md](docs/development/README.md)
- **AI 标准**: [openspec/AGENTS.md](openspec/AGENTS.md)
- **架构设计**: [docs/design/architecture.md](docs/design/architecture.md)
- **API 设计**: [docs/design/api-design.md](docs/design/api-design.md)
- **数据库设计**: [docs/design/database-schema.md](docs/design/database-schema.md)
- **前端规范**: [docs/design/frontend-guide.md](docs/design/frontend-guide.md)
- **产品需求**: [docs/planning/requirements.md](docs/planning/requirements.md)
- **项目路线图**: [docs/planning/roadmap.md](docs/planning/roadmap.md)

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
**最后更新**: 2026年2月6日
