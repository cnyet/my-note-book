# Project Context: Work Agents

## Purpose

多智能体编排平台，支持智能体间协作、实时状态同步和 JWT 身份认证。

- **核心需求**: [docs/planning/PRD.md](../docs/planning/PRD.md)
- **核心规范**: [openspec/specs/](./specs/) (唯一真相源)

## Tech Stack

| 层级 | 技术 |
|------|------|
| Frontend | Next.js 15.5, React 19, TypeScript 5, TailwindCSS 3.x, Framer Motion |
| Backend | FastAPI (Python 3.11+), SQLAlchemy 2.0, Pydantic v2 |
| Real-time | WebSocket Server |
| Database | SQLite (开发) → PostgreSQL (生产) |
| Auth | JWT 身份传播 |

## Core Capabilities

- **Agent Orchestration Engine**: 跨智能体消息传递和上下文共享
- **Agent Lifecycle**: `OnSpawn` → `OnIdle` → `OnTerminate`
- **WebSocket Server**: 实时双向通信，在线状态更新
- **Agent Memory**: 状态和长期记忆持久化
- **Agent Message Bus**: 异步消息机制，事件流处理

## Constraints

| 类型 | 约束 |
|------|------|
| Resilience | Agent-to-Agent 请求必须 30s 超时 |
| Performance | API 响应 ≤200ms, LCP <1.5s |
| Security | 禁止提交 .env 或密钥 |
| UI/UX | 遵循 Genesis Design System v2.0, 视觉还原度 ≥95 分 |

## Data Persistence

- **Database**: `backend/data/my_note_book.db`
- **Agent Memories**: 数据库表持久化
- **Agent Messages**: 跨智能体通信日志

## External Dependencies

- **LLM**: Google Gemini 1.5 Pro/Flash
- **MCP**: Fetch, Google Search, GitHub
- **LobeChat**: postMessage/WebSocket 集成

## Conventions

- **Workflow**: OpenSpec 规范驱动 (Proposal → Implementation → Archive)
- **Frontend**: 能力/特性驱动组织，100% 像素级还原
- **Backend**: Service-Schema-Model 分离，依赖注入
