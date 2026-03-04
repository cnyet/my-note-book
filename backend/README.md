# my-note-book 后端

基于 FastAPI 的后端服务，提供多智能体平台的核心功能，包括用户认证、数据管理、API 接口、实时通信和智能体编排。

## 🚀 快速开始

```bash
# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001
```

**访问地址:**
- API: http://localhost:8001
- 文档: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## 🏗️ 项目结构

```
backend/
├── src/                        # 源代码
│   ├── agents/                 # 智能体模块
│   │   ├── assistant/         # AI Assistant Agent
│   │   └── news/              # News Agent
│   ├── api/                    # API 路由
│   │   ├── routes/            # 各模块路由
│   │   └── dependencies.py    # 依赖注入
│   ├── core/                   # 核心配置
│   │   ├── config.py          # 环境配置
│   │   ├── security.py        # 安全模块
│   │   └── database.py        # 数据库连接
│   ├── models/                 # SQLAlchemy 模型
│   ├── schemas/                # Pydantic 模式
│   ├── services/               # 业务服务
│   ├── message_bus/            # 消息总线
│   ├── websocket/              # WebSocket 服务
│   ├── scripts/                # 管理脚本
│   └── main.py                 # 应用入口
├── data/                       # 数据库文件
│   └── my_note_book.db        # SQLite 数据库
├── tests/                      # 测试
│   └── assistant/             # Assistant Agent 测试
├── logs/                       # 日志文件
├── .venv/                      # 虚拟环境
├── requirements.txt            # Python 依赖
├── .env                        # 环境变量
└── .env.example                # 环境变量模板
```

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.11+ | 编程语言 |
| FastAPI | 0.115+ | Web 框架 |
| SQLAlchemy | 2.0+ | ORM |
| Pydantic | 2.0+ | 数据验证 |
| python-jose | 3.3+ | JWT 处理 |
| passlib | 1.7+ | 密码加密 |
| httpx | 0.28+ | HTTP 客户端 |
| anthropic | 0.18+ | Claude API |
| openai | 1.0+ | OpenAI API |
| feedparser | 6.0+ | RSS 解析 |
| apscheduler | 3.10+ | 定时任务 |

## 💾 数据库

- **引擎**: SQLite (通过 `aiosqlite` 支持异步)
- **ORM**: SQLAlchemy 2.0+
- **位置**: `./data/my_note_book.db`

## 🔐 认证系统

采用 JWT 身份验证：

- 用户注册与登录
- Token 刷新机制
- 基于角色的访问控制 (RBAC)
- OAuth 集成 (GitHub/Google)

## 🤖 智能体模块

### AI Assistant Agent

位于 `src/agents/assistant/`:
- 多模型支持 (Ollama, Anthropic, OpenAI)
- 对话会话管理
- 流式响应
- 上下文记忆

### News Agent

位于 `src/agents/news/`:
- RSS 源管理
- 自动爬取和摘要
- 定时调度器

## 💬 WebSocket 服务

位于 `src/websocket/`:
- 实验室在线人数统计
- 智能体间实时通信
- 状态同步更新

## 🌐 环境变量

复制 `.env.example` 到 `.env` 并配置：

```env
# 数据库
DATABASE_URL=sqlite+aiosqlite:///./data/my_note_book.db

# JWT 认证
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3001

# AI 模型 (可选)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
```

## 🧪 测试

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest tests/assistant/

# 带覆盖率
pytest --cov=src
```

## 📚 相关文档

- [系统架构设计](../docs/design/architecture.md)
- [API 接口文档](../docs/design/api-design.md)
- [数据库设计](../docs/design/database-schema.md)
- [项目指令](../CLAUDE.md)

---

**最后更新**: 2026年3月4日