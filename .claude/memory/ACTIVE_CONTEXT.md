# Active Context

> 最后更新：2026-02-28T12:00:00Z

## 当前项目状态

| 维度 | 状态 |
|------|------|
| 分支 | `main` (已合并 feature/agent-orchestration) |
| 后端 | **Sprint 2 ✅ 完成** - Agent Orchestration Core 已实施 |
| 前端 | 6 个管理页面 + React Query |
| OpenSpec | 3 个变更提案已归档 |
| **Sprint** | **Sprint 2 ✅ 完成** |

## 本会话完成的工作

### 1. 分支合并 ✅
- 手动合并 `feature/agent-orchestration` → `main`
- 提交测试配置和修复

### 2. 前端集成 ✅
- Dashboard 页面集成 AgentLiveStatusCard（后删除）
- 删除不需要的 WebSocket 组件和 Hooks

### 3. 测试套件运行 ✅
- 后端集成测试：2/2 通过
- 前端：无测试文件

### 4. Dashboard 500 错误修复 ✅
- 修复 Agent 模型关系（sessions, memories, sent_messages, received_messages）
- 修复 AgentMemory 和 AgentMessage 模型的 back_populates
- 修复 dashboard.py 使用正确的 status 过滤器

### 5. Tools 页面无限循环修复 ✅
- 将 filteredTools 从 useEffect 改为 useMemo
- 修复 handleDragEnd 函数（删除不存在的 setTools 调用）

### 6. Profile 401 错误修复 ✅
- 添加 JWT token 过期检查（isTokenExpired, hasValidAuth）
- 更新 useAdminAuth hook 自动清除过期 token
- Profile 页面 401 错误自动重定向到登录页

## 待办事项

- [ ] 清理 Sprint 2 WebSocket 相关代码（已删除）
- [ ] 测试覆盖 (单元测试/集成测试)
- [ ] Agent 工作台增强

## 技术栈

- Frontend: Next.js 15.5, React 19, TypeScript 5, TailwindCSS 3.x, React Query, Zustand
- Backend: FastAPI (Python 3.11+), SQLAlchemy 2.0, Pydantic v2, WebSocket
- Database: SQLite (开发) → PostgreSQL (生产)
- Real-time: WebSocket Server, Message Bus
- Encryption: AES-256-GCM
