# work-agents 后端

基于 FastAPI 的后端服务，提供多智能体平台的核心功能，包括用户认证、数据管理、API 接口和实时通信服务。后端实现了完整的身份验证系统、数据库操作、WebSocket 实时通信和智能体编排功能。

## 🚀 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001

# 访问地址
# - API: http://localhost:8001
# - 文档: http://localhost:8001/docs
# - ReDoc: http://localhost:8001/redoc
```

## 📋 管理脚本

### 1. 创建超级用户
初始化系统管理员账户，用于访问受保护的端点和后台界面：

```bash
python src/scripts/create_superuser.py
```

**默认凭据:**
- **邮箱**: `admin@example.com`
- **密码**: `admin`

> ⚠️ **安全警告**: 首次登录后请立即更改此密码。

### 2. 初始化数据
填充数据库，默认分类、标签和示例智能体：

```bash
python src/scripts/seed.py
```

这将创建：
- 默认智能体（5个）
- 分类和标签数据
- 示例博客文章
- 工具和实验室数据

## 🏗️ 项目结构

```
backend/
├── alembic/                 # 数据库迁移脚本 (使用 Alembic)
│   ├── versions/           # 迁移版本文件
│   └── env.py              # 迁移环境配置
├── alembic.ini             # Alembic 配置文件
├── data/                   # 数据库文件存储 (SQLite)
│   └── work_agents.db      # SQLite 数据库文件
├── requirements.txt        # Python 依赖包列表
├── .env.example           # 环境变量模板
├── src/                   # 源代码目录
│   ├── api/               # API 端点定义 (v1 版本路由)
│   │   ├── v1/           # 基础业务 API (认证、主页、智能体...)
│   │   │   ├── admin/    # 管理后台专用接口 (CRUD)
│   │   │   │   ├── agents.py
│   │   │   │   ├── blog.py
│   │   │   │   ├── tools.py
│   │   │   │   ├── labs.py
│   │   │   │   └── media.py
│   │   │   └── __init__.py
│   │   └── deps.py        # 依赖注入 (数据库会话、认证)
│   ├── core/              # 核心配置模块
│   │   ├── config.py      # Pydantic 设置
│   │   ├── security.py    # JWT 与哈希处理
│   │   ├── database.py    # SQLAlchemy 引擎/会话
│   │   └── websocket.py   # WebSocket 服务配置
│   ├── models/            # SQLAlchemy 数据库模型
│   │   ├── user.py        # 用户模型
│   │   ├── agent.py       # 智能体模型
│   │   ├── blog_post.py   # 博客文章模型
│   │   ├── tag.py         # 标签模型
│   │   ├── tool.py        # 工具模型
│   │   ├── category.py    # 分类模型
│   │   ├── lab.py         # 实验室模型
│   │   ├── agent_message.py  # 智能体消息模型
│   │   └── agent_memory.py   # 智能体记忆模型
│   ├── schemas/           # Pydantic 数据验证模型 (DTOs)
│   ├── services/          # 业务逻辑服务层 (文件、认证、CRUD)
│   │   ├── auth_service.py  # 认证服务
│   │   ├── user_service.py  # 用户服务
│   │   ├── agent_service.py # 智能体服务
│   │   ├── blog_service.py  # 博客服务
│   │   ├── tool_service.py  # 工具服务
│   │   ├── lab_service.py   # 实验室服务
│   │   └── file_service.py  # 文件服务
│   ├── utils/             # 通用工具函数
│   │   ├── helpers.py     # 辅助函数
│   │   └── validators.py  # 验证器
│   └── main.py            # FastAPI 应用入口
├── tests/                 # 自动化测试 (pytest)
└── pyproject.toml        # 项目元数据配置
```

## ⚙️ 数据库

- **引擎**: SQLite (通过 `aiosqlite` 支持异步)
- **ORM**: SQLAlchemy 2.0+
- **位置**: `./data/work_agents.db` (默认)

### 数据库迁移 (Alembic)

```bash
# 应用迁移以更新数据库模式
alembic upgrade head

# 在修改模型后创建新迁移
alembic revision --autogenerate -m "描述更改内容"

# 检查当前版本
alembic current

# 查看历史
alembic history --verbose
```

## 🔐 认证系统

系统采用 JWT (JSON Web Token) 进行身份验证，支持以下功能：
- 用户注册与登录
- 令牌刷新机制
- 基于角色的访问控制 (RBAC)
- OAuth 集成 (GitHub/Google)

## 💬 WebSocket 实时通信

后端提供 WebSocket 服务以支持实时功能：
- 实验室在线人数统计
- 智能体间实时通信
- 状态同步更新

## 🤖 智能体编排

实现智能体编排引擎，支持：
- 跨智能体消息传递
- 上下文共享机制
- 统一身份传播协议
- 智能体记忆管理

## 🌐 环境变量

复制 `.env.example` 到 `.env` 并配置：

```env
# 数据库
DATABASE_URL=sqlite:///./data/work_agents.db

# JWT 认证
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3001

# WebSocket
WEBSOCKET_HOST=0.0.0.0
WEBSOCKET_PORT=8001

# 应用配置
APP_ENV=development
```

## 🛠️ 技术栈

- **框架**: FastAPI
- **数据库**: SQLAlchemy 2.0 + SQLite
- **迁移工具**: Alembic
- **认证**: JWT (python-jose) + bcrypt
- **验证**: Pydantic v2
- **测试**: pytest
- **异步支持**: asyncio

## 🚨 注意事项

- 系统默认使用 SQLite 数据库，适用于开发和小型部署
- 生产环境中建议考虑 PostgreSQL 等更强大的数据库
- 请确保在生产环境中使用强密钥和 HTTPS
- 定期备份数据库以防止数据丢失