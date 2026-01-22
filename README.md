# AI 生活助理团队 (v2.0-rc1) 🤖

专为大洪打造的个人生活助理 AI 系统，现已全面升级为 v2.0 智能协同版本。

## 🌟 v2.0 核心升级

- **🤖 智能编排 (Orchestration)**: 引入 `Chief of Staff` 总管代理，实现 5 大秘书协同作战，不再是孤立脚本。
- **🧠 长期记忆 (Memory)**: 基于 RAG 的轻量级语义检索，助理现在能“记住”过去几个月的历史信息。
- **🔄 数据同步 (Data Sync)**: Markdown 日志与 SQLite 数据库自动同步，兼顾可读性与检索效率。
- **📱 现代化交互 (UX)**: 支持 PWA (可安装至手机)、SSE 实时进度推送、环境变量安全驱动。

## ⚡ 快速启动

### 一键启动（推荐）

```bash
./scripts/start-dev.sh
```

**访问地址：**
- 后端 API: http://localhost:8000
- 前端 Web: http://localhost:3000

---

## 🎯 秘书团队

| 秘书 | 职责 | v2.0 特性 |
|------|------|----------|
| 📰 **新闻秘书** | AI/科技动态 | 支持历史新闻溯源与关联 |
| 💼 **工作秘书** | 任务与计划 | 自动同步待办至数据库 |
| 👔 **穿搭秘书** | 天气与着装 | 支持突发天气自动预警 |
| 🌱 **生活秘书** | 健康与作息 | 结构化存储健康指标 |
| 🌙 **复盘秘书** | 反思与洞察 | 自动提取并更新用户偏好 |

---

## 📁 目录结构

```
ai-life-assistant/
├── backend/              # 🐍 Python v2.0 核心 (FastAPI + BaseAgent)
├── frontend/             # ⚛️ Next.js 16 + PWA 支持
├── data/                 # 💾 统一存储 (Logs + SQLite)
├── docs/                 # 📚 完善的 v2.0 文档体系
└── scripts/              # 🛠️ 自动化运维脚本
```

---

## 🛠️ 技术栈

- **后端**: Python 3.12+, FastAPI, SQLAlchemy, BaseAgent (v2.0 ABC)
- **前端**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **AI**: Claude 3.5 Sonnet / GLM-4
- **存储**: SQLite (Structured) + Markdown (Human-readable)

---

## ✅ 项目进度

- **Phase 1-3 (架构与智能)**: 100% ✅
- **Phase 4 (现代化交互)**: 100% ✅
- **v2.0 Stable (发布准备)**: 进行中... 🚧

详情请参阅: [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | [CHANGELOG.md](docs/CHANGELOG.md)

---
项目作者: 大洪  
最后更新: 2026-01-21
