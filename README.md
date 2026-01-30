# work-agents

一个极具极客感、现代感的网站项目，包括前台展示和管理后台。

## 🎯 项目概述

**work-agents** 是一个全栈Web应用，集成了AI Agent展示、工具集合、实验室产品和博客功能。

### 核心功能
- 🤖 **Agents**: 集成 LobeChat 和 5 个 AI 秘书展示
- 🛠️ **Tools**: 工具集合展示（分类、搜索）
- 🧪 **Labs**: 实验产品展示（小游戏、AI Agent 原型）
- 📝 **Blog**: 博客系统（Markdown支持、标签分类）
- 🔐 **Admin**: 完整的后台管理系统

### 技术栈

**前端**
- Next.js 15.4 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/UI

**后端**
- Python 3.11+
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

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
│   └── database/         # 数据库设计
├── logs/                 # 运行日志
└── discuss/              # 评审讨论
```

## 📚 文档

详细文档请查看 `docs/` 目录：

- [API 文档](docs/api/)
- [数据库设计](docs/database/)
- [架构设计](docs/architecture/)
- [开发规范](AGENTS.md)

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

# 应用配置
APP_ENV=development
```

### Frontend (.env.local)

```env
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

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

请严格遵守 [GEMINI.md](AGENTS.md) 中定义的开发规范：

- 文件规模限制
- 代码复杂度控制
- 命名规范
- Git 提交规范
- 架构设计原则

## 🤝 贡献

欢迎提交 Pull Request！请确保：

1. 代码通过 `./scripts/lint.sh` 检查
2. 所有测试通过 `./scripts/test.sh`
3. 遵循项目的代码规范

## 📄 许可证

[MIT License](LICENSE)

---

**Build High-Quality Software!** 🚀
