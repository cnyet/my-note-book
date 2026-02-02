# Project Context: Work Agents

## Purpose
Work Agents 是一个基于 AI Agent 的自动化工作流平台，旨在通过多 Agent 协作（如 Prometheus, Sisyphus 等）实现复杂任务的自动化执行、代码生成与系统维护。

- **核心需求**: [docs/requirement.md](../docs/requirement.md) (定义的 WHAT)

## Tech Stack
- **Frontend**: Next.js 15.4 (App Router), React 19, TypeScript 5+, TailwindCSS/Standard CSS.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy, Pydantic v2.
- **Database**: SQLite (Local Development).
- **AI Tools**: OpenSpec (Spec-driven development), MCP (Model Context Protocol).

## Domain Context (领域上下文)
- **Agent**: 具有独立工具集和目标的智能单元。
- **Prometheus (规划者)**: 负责将用户模糊需求转化为 `tasks.md` 中的标准任务。
- **Sisyphus (执行者)**: 负责根据任务清单，利用各种 Skills 产出代码或文档。
- **Database (数据库)**: 采用 SQLite，文件位于 `backend/data/work_agents.db`。
- **Storage (存储)**: 所有媒体文件存储于 `frontend/public/uploads` 下。

## Project Conventions

### Implementation Order
- **Design Dominance**: Implementation **MUST** strictly adhere to the specifications defined in `docs/design/` (Architecture, Database Schema, UI/UX Spec). Any divergence requires a formal OpenSpec proposal.

### Code Style
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/classes, `kebab-case` for files.
- **Limits**: Files ≤ 300 lines (Dynamic) / 400 lines (Static). Folder size ≤ 8 files.
- **Boolean**: Prefix with `is/has/can`.

### Architecture Patterns
- **Frontend**: Capability-based or Feature-driven organization. Server Components by default.
- **Backend**: Service-Schema-Model separation. Dependency Injection for DB sessions.
- **Workflow**: Spec-driven development via OpenSpec (Proposal -> Implementation -> Archive).

### Testing Strategy
- **Priority**: Unit Tests > Integration Tests > E2E (Playwright).
- **Requirement**: Every new feature MUST have corresponding test cases in its OpenSpec proposal.

### Git Workflow
- **Commit**: Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `ci`, `build`).
- **Standard**: Atomic commits, no hardcoded secrets.

## Project Structure (项目结构约定)
```
work-agents/
├── backend/              # FastAPI 后端
│   ├── alembic/          # 数据库迁移记录
│   ├── data/             # 持久化数据 (SQLite)
│   ├── src/              # 核心源码
│   │   ├── api/          # 路由 (v1, admin)
│   │   ├── core/         # 配置与安全
│   │   ├── models/       # 数据库模型
│   │   ├── schemas/      # 数据规范
│   │   ├── services/     # 业务逻辑
│   │   └── main.py       # 应用入口
│   ├── tests/            # 后端测试
│   ├── .env.example      # 环境示例
│   └── requirements.txt  # Python 依赖
├── frontend/             # Next.js 前端
│   ├── src/
│   │   ├── app/          # App Router 页面
│   │   ├── components/   # React 组件
│   │   ├── lib/          # 工具函数
│   │   └── styles/       # 样式文件
│   ├── public/           # 静态资源
│   └── package.json      # Node 依赖
├── scripts/              # 项目脚本 (一切操作的唯一入口)
├── docs/                 # 项目文档
│   ├── adr/              # 架构决策记录
│   ├── implement/        # 实施计划
│   ├── design/           # 设计规范
│   └── guides/           # 开发指南
├── openspec/             # Spec-driven 开发规范
│   ├── specs/            # 现状 (Truth)
│   ├── changes/          # 提案 (Proposals)
│   └── project.md        # 本文档
├── logs/                 # 运行日志
├── .sisyphus/            # 执行代理状态
└── .agent/               # 助手私有配置
```

## Data & Persistence (数据与持久化)
- **Database**: SQLite 文件位于 `backend/data/work_agents.db`。
- **Static Assets**: 前端上传的文件存储于 `frontend/public/uploads`。

## External Dependencies (外部依赖)
- **LLM Provider**: 默认使用 Google Gemini 3 Flash。
- **MCP Integration**: 必须配置 Fetch 和 Google Search MCP 以保证 AI 具备外部信息获取能力。

## Quick Reference (快速参考)

### 启动开发
```bash
./scripts/start-dev.sh
# 前端: http://localhost:3000
# 后端: http://localhost:8000/docs
```

### 常用命令
- `./scripts/setup.sh`: 环境初始化
- `./scripts/lint.sh`: 代码检查
- `./scripts/test.sh`: 运行测试
- `./scripts/build.sh`: 构建生产版本
- `./scripts/clean.sh`: 清理项目

### 寻求帮助
- `/oracle` - 技术咨询
- `/prometheus` - 规划咨询
- `/librarian` - 文档查找
- `AGENTS.md` - 项目编码指南
- `docs/guides/` - 开发指南目录

## Important Constraints
- **Secrets**: 严禁将 .env 或任何敏感密钥提交至仓库。
- **Entry**: 严禁直接执行包管理命令，必须通过 `scripts/` 下的脚本。
- **Response**: API 响应目标延迟 ≤ 200ms。
