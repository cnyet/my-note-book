# Active Context

> 最后更新：2026-02-27T08:00:00Z

## 当前项目状态

| 维度 | 状态 |
|------|------|
| 分支 | `feature/agent-orchestration` |
| 后端 | **Sprint 2 ✅ 完成** - Agent Orchestration Core 已实施 |
| 前端 | 6 个管理页面 + React Query + **WebSocket Hooks** |
| OpenSpec | 3 个变更提案已归档 |
| **Sprint** | **Sprint 2 ✅ 完成** |

## Sprint 2 完成摘要

### Phase 1: Infrastructure ✅
- 数据库表：agent_sessions, agent_memory, agent_messages, ws_connections
- AgentManager：spawn/terminate/status 生命周期管理
- REST API：/spawn, /terminate, /status, /sessions

### Phase 2: WebSocket Communication ✅
- ConnectionHub：连接管理、广播、订阅
- WebSocket 端点：/ws/agents, /ws/chat/{agent_id}
- 前端 Hooks：useAgentWebSocket, useAgentChat

### Phase 3: Message Bus ✅
- MessageBus：publish/subscribe 模式
- 消息持久化与异步处理

### Phase 4: Memory Store ✅
- MemoryStore：short_term/long_term/context 存储
- AES-256-GCM 加密支持
- 自动过期清理

## 最近提交

```
dc304b0 feat(agent-orchestration): implement Sprint 2 Agent Orchestration Core
b680d69 docs: update memory and add sprint-2 design document
```

## 待办事项

- [ ] 测试覆盖 (单元测试/集成测试)
- [ ] 前端页面集成 WebSocket 状态
- [ ] Dashboard 实时状态卡片
- [ ] Agent 工作台增强

## 技术栈

- Frontend: Next.js 15.5, React 19, TypeScript 5, TailwindCSS 3.x, React Query, Zustand
- Backend: FastAPI (Python 3.11+), SQLAlchemy 2.0, Pydantic v2, WebSocket
- Database: SQLite (开发) → PostgreSQL (生产)
- Real-time: WebSocket Server, Message Bus
- Encryption: AES-256-GCM
