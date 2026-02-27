# Sprint 2: Agent Orchestration Core 设计文档

> **版本**: v1.0
> **状态**: 待实施
> **创建日期**: 2026-02-27
> **关联文档**: [Roadmap](../roadmap.md) | [Project Context](../../openspec/project.md) | [Sprint 1](./sprint-1.md)

---

## 1. 项目概述与技术栈

### 1.1 项目概述

构建 MyNoteBook 的核心智能体编排能力，实现多智能体协作、实时状态同步和跨智能体消息传递。这是项目从"静态展示"迈向"动态智能体平台"的关键一步。

### 1.2 核心目标

| 目标 | 描述 | 优先级 |
|------|------|--------|
| Agent Lifecycle | 智能体生命周期管理 (Spawn → Idle → Terminate) | P0 |
| WebSocket Server | 实时双向通信，状态同步 | P0 |
| Message Bus | 异步消息机制，事件驱动 | P0 |
| Agent Memory | 状态持久化与记忆存储 | P1 |

### 1.3 核心技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **WebSocket** | FastAPI WebSocket + python-socketio | 实时双向通信 |
| **消息队列** | asyncio.Queue + Redis (可选) | 异步消息处理 |
| **状态管理** | In-Memory + SQLite 持久化 | 智能体状态同步 |
| **前端状态** | Zustand + React Query | 前端状态 + 服务端缓存 |
| **加密** | cryptography (AES-256-GCM) | 敏感数据加密 |

### 1.4 路由结构

```
WebSocket:     ws://localhost:8001/ws/agents          # 智能体状态流
WebSocket:     ws://localhost:8001/ws/chat/{agent_id} # 智能体聊天
REST API:      /api/v1/agents/{id}/spawn              # 启动智能体
REST API:      /api/v1/agents/{id}/terminate          # 终止智能体
REST API:      /api/v1/agents/{id}/message            # 发送消息
REST API:      /api/v1/agents/{id}/memory             # 获取记忆
```

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    前端 (Next.js)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Zustand Store│  │ React Query  │  │ WebSocket    │      │
│  │ (Agent State)│  │ (Server State)│ │ (Real-time)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
           ↓ HTTP/REST                ↓ WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI 后端                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Agent Manager│  │ Message Bus  │  │ WebSocket Hub│      │
│  │ (Lifecycle)  │  │ (Events)     │  │ (Broadcast)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Memory Store │  │ Agent Workers│                        │
│  │ (Persistence)│  │ (Background) │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│                    SQLite 数据库                             │
│  agents | agent_memory | agent_messages | agent_sessions    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 智能体生命周期

```
          ┌──────────┐
          │  SPAWNED │ ← 启动 (用户触发/定时任务)
          └────┬─────┘
               │
               ↓
          ┌──────────┐
          │  IDLE    │ ← 等待任务
          └────┬─────┘
               │
        ┌──────┴──────┐
        ↓             ↓
   ┌──────────┐  ┌──────────┐
   │  BUSY    │  │  ERROR   │
   │ (处理中)  │  │ (异常)   │
   └────┬─────┘  └────┬─────┘
        │             │
        └──────┬──────┘
               ↓
          ┌──────────┐
          │TERMINATED│ ← 终止 (用户触发/超时/异常)
          └──────────┘
```

### 2.3 消息流架构

```
┌─────────┐    publish     ┌─────────────┐    dispatch    ┌─────────┐
│ Agent A │ ─────────────→ │ Message Bus │ ─────────────→ │ Agent B │
└─────────┘                └─────────────┘                └─────────┘
     ↑                           │                             │
     │                           ↓ store                       │
     │                    ┌─────────────┐                      │
     └────────────────────│   SQLite    │←─────────────────────┘
           query history  └─────────────┘    query history
```

---

## 3. 数据库设计

### 3.1 新增表结构

**agent_sessions** - 智能体会话表
```sql
CREATE TABLE agent_sessions (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',  -- spawned/idle/busy/error/terminated
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    error_message TEXT,
    metadata JSON,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);
```

**agent_memory** - 智能体记忆表
```sql
CREATE TABLE agent_memory (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL,
    session_id TEXT,
    memory_type TEXT NOT NULL,  -- short_term/long_term/context
    key TEXT NOT NULL,
    value TEXT,  -- JSON 或加密数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    FOREIGN KEY (session_id) REFERENCES agent_sessions(id)
);
```

**agent_messages** - 跨智能体消息表
```sql
CREATE TABLE agent_messages (
    id TEXT PRIMARY KEY,
    from_agent_id TEXT NOT NULL,
    to_agent_id TEXT NOT NULL,
    message_type TEXT NOT NULL,  -- request/response/event/broadcast
    payload JSON NOT NULL,
    status TEXT DEFAULT 'pending',  -- pending/delivered/processed/failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (from_agent_id) REFERENCES agents(id),
    FOREIGN KEY (to_agent_id) REFERENCES agents(id)
);
```

**ws_connections** - WebSocket 连接表
```sql
CREATE TABLE ws_connections (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    user_id TEXT,
    agent_id TEXT,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ping TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 3.2 加密字段策略

| 字段 | 加密 | 说明 |
|------|------|------|
| agent_memory.value | 可选 (AES-256-GCM) | 敏感记忆数据加密 |
| agent_messages.payload | 否 | 消息内容不加密，便于调试 |
| ws_connections.metadata | 否 | 连接元数据 |

---

## 4. API 设计

### 4.1 REST API

**智能体生命周期**
```
POST   /api/v1/agents/{id}/spawn        # 启动智能体
POST   /api/v1/agents/{id}/terminate    # 终止智能体
GET    /api/v1/agents/{id}/status       # 获取状态
GET    /api/v1/agents/{id}/sessions     # 获取会话历史
```

**智能体通信**
```
POST   /api/v1/agents/{id}/message      # 发送消息到智能体
GET    /api/v1/agents/{id}/messages     # 获取消息历史
POST   /api/v1/agents/broadcast         # 广播消息到所有智能体
```

**智能体记忆**
```
GET    /api/v1/agents/{id}/memory       # 获取记忆
POST   /api/v1/agents/{id}/memory       # 存储记忆
DELETE /api/v1/agents/{id}/memory/{key} # 删除记忆
```

### 4.2 WebSocket 协议

**连接端点**
```
ws://localhost:8001/ws/agents                # 全局智能体状态流
ws://localhost:8001/ws/chat/{agent_id}       # 与特定智能体聊天
```

**消息格式**
```typescript
// 客户端 → 服务端
interface ClientMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping' | 'command';
  agent_id?: string;
  payload?: any;
}

// 服务端 → 客户端
interface ServerMessage {
  type: 'status' | 'message' | 'error' | 'pong';
  agent_id?: string;
  data: any;
  timestamp: string;
}
```

**状态更新事件**
```typescript
interface AgentStatusEvent {
  type: 'status';
  agent_id: string;
  old_status: AgentStatus;
  new_status: AgentStatus;
  timestamp: string;
}
```

---

## 5. 前端状态管理

### 5.1 Zustand Store 设计

```typescript
// stores/agent-store.ts
interface AgentState {
  // 状态
  agents: Map<string, Agent>;
  sessions: Map<string, AgentSession>;
  wsConnected: boolean;

  // 操作
  spawnAgent: (id: string) => Promise<void>;
  terminateAgent: (id: string) => Promise<void>;
  sendMessage: (id: string, message: string) => Promise<void>;

  // WebSocket 事件处理
  onStatusUpdate: (event: AgentStatusEvent) => void;
  onMessageReceived: (message: AgentMessage) => void;
}
```

### 5.2 React Query 集成

```typescript
// hooks/use-agent.ts
export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => fetchAgent(id),
    staleTime: 30000,
  });
}

export function useAgentMessages(id: string) {
  return useQuery({
    queryKey: ['agent', id, 'messages'],
    queryFn: () => fetchAgentMessages(id),
    refetchInterval: 5000, // 每 5 秒刷新
  });
}
```

### 5.3 WebSocket Hook

```typescript
// hooks/use-agent-websocket.ts
export function useAgentWebSocket() {
  const [status, setStatus] = useState<WSStatus>('disconnected');
  const updateAgentStatus = useAgentStore(s => s.onStatusUpdate);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8001/ws/agents');

    ws.onopen = () => setStatus('connected');
    ws.onclose = () => setStatus('disconnected');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'status') {
        updateAgentStatus(message);
      }
    };

    return () => ws.close();
  }, [updateAgentStatus]);

  return { status };
}
```

---

## 6. 页面设计

### 6.1 智能体工作台增强 (`/agents`)

**现有页面增强**:
- 实时状态指示器 (OnlinePulse 集成 WebSocket)
- 智能体控制面板 (启动/停止/重启)
- 消息发送界面

**新增组件**:
```
┌─────────────────────────────────────────────────────────┐
│  Agent Control Panel                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ Spawn   │  │Terminate│  │ Restart │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
├─────────────────────────────────────────────────────────┤
│  Agent Status: ● IDLE    Session: sess_abc123          │
│  Uptime: 2h 34m    Messages: 156                       │
├─────────────────────────────────────────────────────────┤
│  Message Log (Real-time)                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [14:32:15] Agent.News → Agent.Task: fetch_rss   │   │
│  │ [14:32:18] Agent.Task → Agent.News: rss_data    │   │
│  │ [14:32:20] Agent.News: processing complete      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Dashboard 增强 (`/admin`)

**新增实时卡片**:
```
┌─────────────────────────────────────┐
│  Active Agents: 5/8                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │ ● │ │ ● │ │ ● │ │ ● │ │ ○ │    │
│  └───┘ └───┘ └───┘ └───┘ └───┘    │
│  Real-time via WebSocket            │
└─────────────────────────────────────┘
```

### 6.3 后台智能体管理增强 (`/admin/agents`)

**新增操作**:
- 一键启动/停止
- 会话历史查看
- 记忆查看/清理
- 消息日志

---

## 7. 后端服务设计

### 7.1 目录结构

```
backend/src/
├── agents/
│   ├── __init__.py
│   ├── manager.py          # AgentManager - 生命周期管理
│   ├── worker.py           # AgentWorker - 后台任务执行
│   ├── memory.py           # MemoryStore - 记忆存储
│   └── registry.py         # AgentRegistry - 智能体注册表
├── websocket/
│   ├── __init__.py
│   ├── hub.py              # ConnectionHub - 连接管理
│   ├── handlers.py         # 消息处理器
│   └── protocol.py         # 协议定义
├── message_bus/
│   ├── __init__.py
│   ├── bus.py              # MessageBus - 消息总线
│   ├── events.py           # 事件定义
│   └── subscription.py     # 订阅管理
└── models/
    ├── agent_session.py
    ├── agent_memory.py
    └── agent_message.py
```

### 7.2 核心类设计

**AgentManager**
```python
class AgentManager:
    """智能体生命周期管理"""

    async def spawn(self, agent_id: str) -> AgentSession:
        """启动智能体"""

    async def terminate(self, agent_id: str) -> None:
        """终止智能体"""

    async def get_status(self, agent_id: str) -> AgentStatus:
        """获取状态"""

    async def send_message(self, agent_id: str, message: dict) -> None:
        """发送消息"""
```

**ConnectionHub**
```python
class ConnectionHub:
    """WebSocket 连接管理"""

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        """注册连接"""

    async def disconnect(self, client_id: str) -> None:
        """断开连接"""

    async def broadcast(self, message: dict) -> None:
        """广播消息"""

    async def send_to(self, client_id: str, message: dict) -> None:
        """发送到特定客户端"""
```

**MessageBus**
```python
class MessageBus:
    """异步消息总线"""

    async def publish(self, topic: str, message: dict) -> None:
        """发布消息"""

    async def subscribe(self, topic: str, handler: Callable) -> None:
        """订阅主题"""

    async def unsubscribe(self, topic: str) -> None:
        """取消订阅"""
```

### 7.3 错误处理

| 错误码 | 描述 | HTTP 状态 |
|--------|------|-----------|
| AGENT_NOT_FOUND | 智能体不存在 | 404 |
| AGENT_ALREADY_SPAWNED | 智能体已启动 | 409 |
| AGENT_NOT_SPAWNED | 智能体未启动 | 400 |
| SESSION_EXPIRED | 会话已过期 | 410 |
| WS_CONNECTION_FAILED | WebSocket 连接失败 | 503 |
| MESSAGE_TIMEOUT | 消息超时 (30s) | 504 |

---

## 8. 安全考虑

### 8.1 认证与授权

- WebSocket 连接需要 JWT Token 验证
- 智能体操作需要管理员权限
- 消息总线需要 topic 级别权限控制

### 8.2 数据加密

```python
# 敏感记忆数据加密
class MemoryStore:
    def __init__(self, encryption_key: bytes):
        self.cipher = AESGCM(encryption_key)

    async def store(self, agent_id: str, key: str, value: Any, encrypt: bool = False):
        if encrypt:
            value = self.cipher.encrypt(nonce, json.dumps(value).encode(), None)
        # 存储到数据库
```

### 8.3 速率限制

| 端点 | 限制 | 窗口 |
|------|------|------|
| `/ws/agents` | 10 连接 | per user |
| `/api/v1/agents/{id}/message` | 100 请求 | per minute |
| `/api/v1/agents/{id}/spawn` | 10 请求 | per minute |

---

## 9. 实施计划

### 9.1 开发阶段

**Phase 1: 基础设施 (Week 1)**
- 数据库表创建 (agent_sessions, agent_memory, agent_messages)
- AgentManager 核心类
- 基础生命周期 API (spawn/terminate/status)

**Phase 2: WebSocket 通信 (Week 2)**
- ConnectionHub 实现
- WebSocket 端点 (/ws/agents, /ws/chat/{agent_id})
- 前端 WebSocket Hook
- 实时状态更新

**Phase 3: 消息总线 (Week 3)**
- MessageBus 实现
- 跨智能体消息 API
- 消息持久化
- 前端消息界面

**Phase 4: 记忆系统与优化 (Week 4)**
- MemoryStore 实现
- 记忆加密
- 性能优化
- 测试覆盖

### 9.2 验收标准

| 功能 | 验收标准 |
|------|---------|
| Agent Lifecycle | 启动/终止/状态查询正常工作 |
| WebSocket | 连接稳定，断线重连，状态实时更新 |
| Message Bus | 消息可靠传递，30s 超时 |
| Memory | 记忆存取正常，加密数据可解密 |

### 9.3 性能指标

| 指标 | 目标 |
|------|------|
| WebSocket 延迟 | < 100ms |
| 消息吞吐量 | > 1000 msg/s |
| 并发连接 | > 100 |
| API 响应时间 | < 200ms |

---

## 10. 技术债务与后续优化

- Redis 消息队列（高并发场景）
- 智能体插件系统
- 分布式智能体部署
- 监控与告警系统
- E2E 测试覆盖

---

**文档版本**: v1.0
**最后更新**: 2026-02-27
**状态**: 待实施

**依赖**: Sprint 1 (后台管理系统) ✅ 已完成