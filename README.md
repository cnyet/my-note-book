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

### 技术栈 (Tech Stack)

**前端**
- Next.js 15.5 (App Router)
- React 19.1
- TypeScript
- Tailwind CSS 4
- Shadcn/UI

**后端**
- Python 3.11+
- FastAPI
- SQLAlchemy 2.0
- Pydantic v2
- WebSocket

**其他**
- JWT 认证
- OpenSpec (规范驱动开发)
- Model Context Protocol (MCP)

## 🚀 快速开始

### 前置要求

```bash
- Node.js >= 18
- Python >= 3.11
- uv (推荐) 或 pip
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
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs
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
```

## 📁 项目结构

```
work-agents/
├── backend/              # FastAPI 后端
│   ├── src/
│   │   ├── api/          # API 路由
│   │   ├── models/       # 数据库模型
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # 业务逻辑
│   │   └── main.py       # 应用入口
│   ├── tests/            # 后端测试
│   ├── .env.example      # 环境变量示例
│   └── requirements.txt  # Python 依赖
├── frontend/             # Next.js 前端
│   ├── src/
│   │   ├── app/          # App Router 页面
│   │   ├── components/   # React 组件
│   │   ├── lib/          # 工具函数
│   │   └── styles/       # 样式文件
│   ├── public/           # 静态资源
│   └── package.json      # Node 依赖
├── scripts/              # 项目脚本
│   ├── setup.sh          # 环境初始化
│   ├── start-dev.sh      # 启动开发服务器
│   ├── build.sh          # 构建生产版本
│   ├── test.sh           # 运行测试
│   ├── lint.sh           # 代码检查
│   └── clean.sh          # 清理项目
├── docs/                 # 项目文档
│   ├── api/              # API 文档
│   ├── architecture/     # 架构设计
│   ├── database/         # 数据库设计
│   ├── guides/           # 开发指南 (Master Path)
│   └── requirement.md    # 需求文档
├── openspec/             # OpenSpec 规范
│   ├── project.md        # 项目上下文
│   ├── specs/            # 核心规范 (Single Source of Truth)
│   └── changes/          # 变更提案
├── .sisyphus/            # Sisyphus 工作流配置
│   └── notepads/         # AI 团队知识库
├── logs/                 # 运行日志
└── discuss/              # 评审讨论
```

## 🔄 Agentic 工作流

本项目采用先进的 AI 多智能体协作开发模式：

### Prometheus/Sisyphus/OpenSpec 协议
- **Prometheus**: 智能体规划与任务分解
- **Sisyphus**: 自主执行与状态管理
- **OpenSpec**: 规范驱动开发协议

该协议确保了 AI 智能体能够高效协作完成复杂开发任务。

## 📚 文档

详细文档请查看以下结构：

- **项目上下文**: [openspec/project.md](openspec/project.md)
- **开发指南**: [docs/guides/README.md](docs/guides/README.md) (主路径 Master Path)
- **AI 标准**: [openspec/AGENTS.md](openspec/AGENTS.md)
- **API 文档**: [docs/api/](docs/api/)
- **数据库设计**: [docs/database/](docs/database/)
- **架构设计**: [docs/architecture/](docs/architecture/)

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
ALLOWED_ORIGINS=http://localhost:3000

# WebSocket
WEBSOCKET_HOST=0.0.0.0
WEBSOCKET_PORT=8001

# 应用配置
APP_ENV=development
```

### Frontend (.env.local)

```env
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# WebSocket 地址
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8001/ws

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
```

## 📝 开发规范

请严格遵守 [AGENTS.md](openspec/AGENTS.md) 中定义的开发规范：

- 文件规模限制
- 代码复杂度控制
- 命名规范
- Git 提交规范
- 架构设计原则
- OpenSpec 规范驱动开发

## 🤝 贡献

欢迎提交 Pull Request！请确保：

1. 代码通过 `./scripts/lint.sh` 检查
2. 所有测试通过 `./scripts/test.sh`
3. 遵循项目的 OpenSpec 规范
4. 遵循 AGENTS.md 中定义的开发规范

## 📄 许可证

[MIT License](LICENSE)

---

**Build High-Quality Software!** 🚀
