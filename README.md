# my-note-book

现代 AI 多智能体编排平台 (Modern AI Multi-Agent Orchestration Platform)

## 🎯 项目概述

**my-note-book** 是一个现代 AI 多智能体编排平台，专为极客社区设计，支持智能体间协作与通信、实时状态同步和统一身份认证。平台通过编排协议实现智能体间的无缝协作，提供实时通信能力、持久化内存管理和基于 JWT 的身份传播。

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
cd my-note-book
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
chmod +x scripts/*.sh
./scripts/setup.sh
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
./scripts/start-dev.sh

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
./scripts/test.sh
```

### 常见问题

**启动失败怎么办？**

```bash
# 清理端口和缓存
./scripts/clean.sh

# 然后重新启动
./scripts/start-dev.sh
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
./scripts/lint.sh

# 运行测试
./scripts/test.sh

# 构建生产版本
./scripts/build.sh

# 清理项目
./scripts/clean.sh

# 部署到生产环境
./scripts/deploy.sh
```

## 📁 项目结构

```
my-note-book/
├── backend/               # FastAPI 后端服务
│   ├── src/               # 后端源代码
│   │   ├── agents/        # 智能体模块
│   │   ├── api/           # API 路由
│   │   ├── core/          # 核心配置
│   │   ├── models/        # 数据模型
│   │   ├── schemas/       # Pydantic 模式
│   │   ├── services/      # 业务服务
│   │   └── websocket/     # WebSocket 服务
│   ├── data/              # 数据库文件 (SQLite)
│   ├── tests/             # 后端测试
│   └── requirements.txt   # Python 依赖
├── frontend/              # Next.js 前端应用
│   ├── src/               # 前端源代码
│   │   ├── app/           # 页面路由
│   │   ├── components/    # 组件库
│   │   ├── hooks/         # React Hooks
│   │   └── lib/           # 工具函数
│   ├── design-assets/     # 设计资产
│   ├── public/            # 静态资源
│   └── package.json       # Node.js 依赖
├── docs/                  # 项目文档
│   ├── design/            # 设计文档
│   ├── development/       # 开发指南
│   └── planning/          # Sprint 规划
├── scripts/               # 自动化脚本
├── tests/                 # E2E/集成测试
│   ├── e2e/               # 端到端测试
│   ├── integration/       # 集成测试
│   └── unit/              # 单元测试
└── logs/                  # 运行日志
```

## 📝 开发进度

该项目目前处于 **Active Development (积极开发)** 阶段。

### Sprint 进度

| Sprint | 功能模块 | 状态 |
|--------|----------|------|
| Sprint 1 | 基础架构、核心组件库 | ✅ 完成 |
| Sprint 2 | 前端页面开发 | ✅ 完成 |
| Sprint 3 | News Agent | ✅ 完成 |
| Sprint 4 | AI Assistant Agent | ✅ 完成 |

### 已完成功能

- [x] 基础架构与脚本配置
- [x] 设计规范 (Genesis Design System)
- [x] 核心组件库 (v-ui): GlassCard, GlitchText, NeonButton 等
- [x] 公共页面: Home, Agents, Blog, Tools, Labs
- [x] Admin 后台: Dashboard, Sidebar, 用户认证
- [x] AI Assistant Agent: 多模型支持、对话管理、流式响应

### 进行中

- [ ] Admin CRUD 功能完善
- [ ] WebSocket 实时推送优化

## 🛠️ 技术栈

### 前端

- Next.js 15.5 (App Router)
- React 19.1
- TypeScript 5.x
- Tailwind CSS 3.x
- Shadcn/UI + v-ui
- Framer Motion 6.x+

### 后端

- Python 3.11+
- FastAPI
- SQLAlchemy 2.0
- Pydantic v2
- WebSocket

---

**Build High-Quality Software!** 🚀

**项目状态**: Active Development (积极开发中)
**最后更新**: 2026年3月4日