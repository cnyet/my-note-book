# AI 生活助理团队 🤖

专为大洪打造的个人生活助理 AI 系统，通过 5 个专业 AI 秘书提供全方位生活支持。

## ⚡ 快速启动

### 一键启动（推荐）

```bash
./scripts/start-dev.sh
```

**特性：**
- ✅ 自动检测并清理端口占用
- ✅ 同时启动后端和前端服务
- ✅ 实时日志输出
- ✅ 优雅退出（Ctrl+C）

**访问地址：**
- 后端 API: http://localhost:8000
- 前端 Web: http://localhost:3000
- API 文档: http://localhost:8000/docs

### 停止服务

```bash
# 方法 1: 在启动终端按 Ctrl+C（推荐）
# 方法 2: 使用停止脚本
./scripts/stop-dev.sh
```

### 故障排除

如果遇到端口占用问题，启动脚本会自动清理。详见：[端口冲突解决方案](docs/troubleshooting/port-conflict.md)

---

## 🎯 核心功能

### 5 大 AI 秘书

| 秘书 | 功能 | 命令 |
|------|------|------|
| 📰 **新闻秘书** | AI/科技新闻简报 | `--step news` |
| 💼 **工作秘书** | 任务管理和 TODO 生成 | `--step work` |
| 👔 **穿搭秘书** | 基于天气的着装建议 | `--step outfit` |
| 🌱 **生活秘书** | 饮食、运动、作息管理 | `--step life` |
| 🌙 **复盘秘书** | 晚间反思和行为分析 | `--step review` |

### CLI 使用

```bash
cd backend

# 运行单个秘书
python -m src.cli.main --step news
python -m src.cli.main --step work
python -m src.cli.main --step outfit
python -m src.cli.main --step life
python -m src.cli.main --step review

# 流程组合
python -m src.cli.main --step morning  # 早晨流程
python -m src.cli.main --step full     # 全天流程

# 交互模式
python -m src.cli.main --step outfit --interactive
```

---

## 📁 项目结构

```
ai-life-assistant/
├── backend/              # 🐍 Python 后端
│   ├── src/
│   │   ├── agents/       # 5个AI秘书
│   │   ├── api/          # FastAPI 服务
│   │   ├── cli/          # CLI 入口
│   │   ├── core/         # 核心工具
│   │   ├── integrations/ # LLM/天气集成
│   │   └── utils/        # 工具函数
│   ├── tests/            # 测试套件
│   ├── config/           # 配置文件
│   └── alembic/          # 数据库迁移
│
├── frontend/             # ⚛️ Next.js 前端
│   └── src/
│       ├── app/          # 路由页面
│       ├── components/   # React 组件
│       └── lib/          # 工具库
│
├── data/                 # 💾 应用数据
│   └── daily_logs/       # 按日期存储的日志
│
├── docs/                 # 📚 文档
│   ├── getting-started/  # 快速开始
│   └── guides/           # 使用指南
│
└── scripts/              # 🛠️ 开发脚本
    └── dev/              # 开发环境脚本
```

---

## 🚀 开发指南

### 后端开发

```bash
cd backend

# 安装依赖
pip install -r requirements/base.txt

# 运行 CLI
python -m src.cli.main

# 运行 API 服务
python -m src.api.server

# 运行测试
pytest
```

### 前端开发

```bash
cd frontend

# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建
pnpm build
```

### 配置

编辑 `backend/config/config.ini`:

```ini
[llm]
anthropic_api_key = YOUR_KEY    # 必需

[weather]                        # 可选
api_key = YOUR_KEY
provider = qweather
city = shanghai
```

---

## 🧪 测试

```bash
cd backend

# 运行所有测试
pytest

# 运行单元测试
pytest tests/unit/

# 运行集成测试
pytest tests/integration/

# 生成覆盖率报告
pytest --cov=src --cov-report=html
```

- ✅ 220+ 测试用例
- 📊 75% 代码覆盖率

---

## 🌐 Web 应用

### 特性

- 📊 实时仪表盘
- 🎨 现代化 UI (Next.js + Tailwind)
- 🌓 深色/浅色主题
- 📱 响应式设计
- 🔐 JWT 认证

### 认证系统

- 用户注册/登录
- JWT 令牌（7天/30天过期）
- 密码哈希 (bcrypt)
- 受保护路由

详细文档: [docs/guides/AUTHENTICATION.md](docs/guides/AUTHENTICATION.md)

---

## 🤝 技术栈

### 后端
- **LLM**: Anthropic Claude / 智谱 GLM
- **API**: FastAPI + Uvicorn
- **数据库**: SQLite + SQLAlchemy + Alembic
- **类型**: Pydantic 2.0+, mypy
- **测试**: pytest

### 前端
- **框架**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + Radix UI + Framer Motion
- **图标**: Lucide React

---

## ✅ 项目状态

### 已完成 (Phase 1 & 2)

- ✅ 5 个 AI 秘书完整实现
- ✅ CLI 交互系统
- ✅ LLM 集成 (Claude + GLM)
- ✅ 天气 API 集成
- ✅ 文件管理系统
- ✅ 完整测试套件

### 进行中 (Phase 3)

- 🚧 Web 应用 (~30%)
- 🚧 认证系统完善
- 🚧 实时数据更新

---

## 📞 联系

项目作者: 大洪  
最后更新: 2025-01-06

---

**祝使用愉快！🚀**
