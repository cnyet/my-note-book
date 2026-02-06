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

> **注意**: 管理脚本将在项目完整初始化后可用。

### 1. 创建超级用户
初始化系统管理员账户：

```bash
# python src/scripts/create_superuser.py
```

### 2. 初始化数据
填充数据库，创建默认数据：

```bash
# python src/scripts/seed.py
```

## 🏗️ 项目结构

```
backend/
├── alembic/                # 数据库迁移脚本
├── data/                   # 数据库文件存储
│   └── work_agents.db      # SQLite 数据库文件
├── .venv/                  # Python 虚拟环境
├── src/                    # 源代码目录
├── requirements.txt        # Python 依赖包列表
├── .env                    # 环境变量配置
└── .env.example            # 环境变量模板
```

> **注意**: 当前为项目精简结构，完整源代码将逐步实现。

## ⚙️ 数据库

- **引擎**: SQLite (通过 `aiosqlite` 支持异步)
- **ORM**: SQLAlchemy 2.0+
- **位置**: `./data/work_agents.db` (默认)

### 数据库迁移 (Alembic)

> **注意**: 迁移配置将在项目完整初始化后可用。

```bash
# 应用迁移以更新数据库模式（需配置 alembic.ini）
# alembic upgrade head

# 在修改模型后创建新迁移
# alembic revision --autogenerate -m "描述更改内容"
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

- **框架**: FastAPI 0.109+
- **数据库**: SQLAlchemy 2.0+ + SQLite
- **迁移工具**: Alembic 1.13+
- **认证**: JWT (python-jose 3.3+) + bcrypt
- **验证**: Pydantic 2.5+
- **测试**: pytest 7.4+
- **异步支持**: asyncio

## 📚 相关文档

- [系统架构设计](../docs/design/architecture.md)
- [API 接口文档](../docs/design/api-design.md)
- [数据库设计](../docs/design/database-schema.md)
- [OpenSpec 工作流](../docs/development/openspec-guide.md)

## 🚨 注意事项

- 系统默认使用 SQLite 数据库，适用于开发和小型部署
- 生产环境中建议考虑 PostgreSQL 等更强大的数据库
- 请确保在生产环境中使用强密钥和 HTTPS
- 定期备份数据库以防止数据丢失
