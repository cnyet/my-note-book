<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Life Assistant - 专为大洪打造的个人生活助理系统，通过 5 个专业 AI 秘书提供全方位生活支持。

**当前状态**: Phase 1 & 2 ✅ 已完成，Phase 3 Web 应用开发中（约30%）

## Project Structure

```
ai-life-assistant/
├── backend/              # 🐍 Python 后端
│   ├── src/
│   │   ├── agents/       # 5个AI秘书
│   │   ├── api/          # FastAPI 服务
│   │   ├── cli/          # CLI 入口
│   │   ├── core/         # 核心工具
│   │   ├── integrations/ # 外部集成（LLM/天气）
│   │   └── utils/        # 工具函数
│   ├── tests/            # 测试套件
│   ├── config/           # 配置文件
│   └── alembic/          # 数据库迁移
│
├── frontend/             # ⚛️ Next.js 前端
│   └── src/
│       ├── app/          # 路由页面
│       └── components/   # React 组件
│
├── data/                 # 💾 应用数据
│   └── daily_logs/       # 按日期存储的日志
│
├── docs/                 # 📚 文档
│   ├── getting-started/  # 快速开始指南
│   └── guides/           # 使用指南
│
├── scripts/              # 🛠️ 开发脚本
│   └── dev/              # 开发环境脚本
│
└── [配置文件]
    ├── CLAUDE.md         # AI 助手指南
    ├── README.md         # 项目文档
    ├── rules.md          # 开发规范
    └── .env              # 环境变量
```

## Quick Start

```bash
# 一键启动所有服务
./scripts/dev/start-all.sh

# 访问地址
# 前端: http://localhost:3000
# 后端API: http://localhost:8000

# 默认登录
# 邮箱: dahong@example.com
# 密码: password123
```

## Key Commands

### Backend
```bash
cd backend
pip install -r requirements/base.txt
python -m src.cli.main              # CLI 模式
python -m src.api.server            # API 服务
pytest                              # 运行测试
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev                            # 开发服务器
pnpm build                          # 构建
```

### CLI Agent Commands
```bash
cd backend
python -m src.cli.main --step news      # 新闻秘书
python -m src.cli.main --step work      # 工作秘书
python -m src.cli.main --step outfit    # 穿搭秘书
python -m src.cli.main --step life      # 生活秘书
python -m src.cli.main --step review    # 复盘秘书
```

## Tech Stack

### Backend
- **LLM**: Anthropic Claude / 智谱GLM
- **API**: FastAPI + Uvicorn
- **DB**: SQLite + SQLAlchemy + Alembic
- **Test**: pytest

### Frontend
- **Framework**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + Radix UI + Framer Motion

## Development Guidelines

### File Limits
- Python: ≤ 300 lines/file
- TypeScript: ≤ 300 lines/file
- Functions: ≤ 50 lines, ≤ 5 params

### Code Style
- 中文: 注释、业务逻辑
- 英文: 变量名、技术注释

## AI Assistance & Local Skills

本项目包含自定义的 AI 辅助技能（Local Skills），用于指导 AI 助手执行高标准的特定任务。

### 如何使用本地技能
- **存储位置**: `.opencode/skills/{skill-name}/SKILL.md`
- **激活机制**: 当用户提到某个技能名称（如 `ui-ux-pro-max-skill`）时，AI 助手**必须优先**读取对应的 `SKILL.md` 文件，并将其中的指令内化为当前任务的最高优先级规范。
- **避免报错**: 严禁使用系统工具 `skill [name=...]` 来调用这些本地技能，应直接使用 `read` 工具获取其内容。

### 核心本地技能列表
1. **ui-ux-pro-max-skill**: 高级 UI/UX 工程规范（Framer Motion 动画、Tailwind 4 最佳实践、像素级还原）。
2. **conversation-accuracy-skill**: 对话准确性治理规范（分层记忆架构、滑动窗口管理、动态 Token 分配）。
