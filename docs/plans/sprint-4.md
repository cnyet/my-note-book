# Sprint 4 规划：AI Assistant Agent

> **版本**: v1.0
> **日期**: 2026-03-02
> **状态**: 待开始
> **预计周期**: 7-10 天

---

## 1. 概述

### 1.1 目标

开发一个通用的 AI 助手智能体，支持：
- 多轮对话和上下文理解
- 多种 AI 模型后端（Ollama、Anthropic、OpenAI）
- 对话历史持久化和检索
- 实时响应用户查询

### 1.2 范围

| 包含 | 不包含 |
|------|--------|
| AI 模型适配器层 | WebSocket 实时推送（留到 Sprint 5） |
| 对话会话管理 | 多智能体协作（留到 Sprint 6） |
| 聊天界面（Admin 后台） | 移动端优化（留到后续迭代） |
| 模型切换和配置 | 语音输入/输出 |

### 1.3 成功标准

- [ ] AI 助手能接收和响应用户查询
- [ ] 支持至少 2 种 AI 模型（Ollama + Anthropic）
- [ ] 对话历史正确保存和恢复
- [ ] 聊天界面响应时间 < 3 秒
- [ ] 通过 ≥ 20 个单元和集成测试

---

## 2. 技术架构

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Chat Page   │  │  Model Select │  │  History UI  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                         │                                     │
│                    API Calls                                  │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              AI Assistant Agent                      │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │    │
│  │  │  Adapter   │  │  Adapter   │  │  Adapter   │    │    │
│  │  │  Ollama    │  │  Anthropic │  │  OpenAI    │    │    │
│  │  └────────────┘  └────────────┘  └────────────┘    │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         Conversation Manager                 │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                     │
│                    SQLAlchemy                                 │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database (SQLite)                       │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ conversations    │  │ messages         │                 │
│  │ - id             │  │ - id             │                 │
│  │ - user_id        │  │ - conversation_id│                 │
│  │ - model          │  │ - role           │                 │
│  │ - created_at     │  │ - content        │                 │
│  └──────────────────┘  │ - created_at     │                 │
│                        └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 数据模型

```python
# 对话表
class Conversation:
    id: str           # 主键
    user_id: str      # 用户 ID（支持多用户）
    title: str        # 对话标题（自动生成的摘要）
    model: str        # 使用的模型
    created_at: datetime
    updated_at: datetime

# 消息表
class Message:
    id: str           # 主键
    conversation_id: str  # 外键
    role: str         # user / assistant / system
    content: str      # 消息内容
    token_count: int  # Token 消耗
    created_at: datetime
```

### 2.3 AI 适配器接口

```python
# 统一接口定义
class AIAdapter(Protocol):
    async def chat(self, messages: list[dict]) -> str:
        """发送消息并获取响应"""
        pass

    async def stream(self, messages: list[dict]) -> AsyncGenerator[str, None]:
        """流式响应"""
        pass

    def is_available(self) -> bool:
        """检查服务是否可用"""
        pass
```

---

## 3. 实施计划

### Phase 1: AI 模型适配器层（2 天）

#### 任务 1.1: 定义统一接口
- [ ] 创建 `backend/src/agents/assistant/adapters/base.py`
- [ ] 定义 `AIAdapter` 抽象基类
- [ ] 定义消息格式和数据类型

#### 任务 1.2: Ollama 适配器
- [ ] 创建 `backend/src/agents/assistant/adapters/ollama.py`
- [ ] 实现 `chat()` 方法调用 Ollama API
- [ ] 实现 `is_available()` 检查服务状态
- [ ] 添加超时和错误处理

#### 任务 1.3: Anthropic 适配器
- [ ] 创建 `backend/src/agents/assistant/adapters/anthropic.py`
- [ ] 实现 `chat()` 方法调用 Claude API
- [ ] 支持流式响应（可选）
- [ ] 添加 Token 计数

#### 任务 1.4: OpenAI 适配器（可选）
- [ ] 创建 `backend/src/agents/assistant/adapters/openai.py`
- [ ] 实现 `chat()` 方法调用 GPT API

**验收标准**:
- 所有适配器实现统一接口
- 能够切换不同模型并获取响应
- 单元测试覆盖所有适配器

---

### Phase 2: 对话管理（2 天）

#### 任务 2.1: 数据库模型
- [ ] 创建 `backend/src/models/conversation.py`
- [ ] 创建 `backend/src/models/message.py`
- [ ] 添加数据库迁移脚本

#### 任务 2.2: 对话管理器
- [ ] 创建 `backend/src/agents/assistant/conversation_manager.py`
- [ ] 实现创建/获取对话
- [ ] 实现添加消息
- [ ] 实现获取对话历史

#### 任务 2.3: 上下文窗口管理
- [ ] 实现消息截断逻辑（保留最近 N 条）
- [ ] 实现对话摘要（用于长对话压缩）
- [ ] 添加 Token 计数和限制检查

**验收标准**:
- 对话能够正确创建和检索
- 消息历史按时间顺序排列
- 上下文窗口正确截断

---

### Phase 3: AI Assistant Agent（2 天）

#### 任务 3.1: Agent 主类
- [ ] 创建 `backend/src/agents/assistant/agent.py`
- [ ] 实现 `chat(conversation_id, message)` 方法
- [ ] 实现对话历史加载
- [ ] 实现响应生成和存储

#### 任务 3.2: API 路由
- [ ] 创建 `backend/src/api/v1/assistant.py`
- [ ] `POST /api/v1/assistant/chat` - 发送消息
- [ ] `GET /api/v1/assistant/conversations` - 获取对话列表
- [ ] `GET /api/v1/assistant/conversations/{id}` - 获取对话详情
- [ ] `DELETE /api/v1/assistant/conversations/{id}` - 删除对话

#### 任务 3.3: 模型配置
- [ ] 添加模型选择 API
- [ ] 添加模型配置保存到用户设置

**验收标准**:
- API 能正确接收消息并返回响应
- 对话历史正确保存和检索
- 能够切换不同模型

---

### Phase 4: 前端界面（3 天）

#### 任务 4.1: 聊天组件
- [ ] 创建 `frontend/src/components/assistant/ChatWindow.tsx`
- [ ] 创建 `frontend/src/components/assistant/MessageBubble.tsx`
- [ ] 创建 `frontend/src/components/assistant/TypingIndicator.tsx`
- [ ] 实现消息滚动和加载状态

#### 任务 4.2: 对话列表
- [ ] 创建 `frontend/src/components/assistant/ConversationList.tsx`
- [ ] 实现新建对话
- [ ] 实现切换对话
- [ ] 实现删除对话

#### 任务 4.3: 模型选择
- [ ] 创建 `frontend/src/components/assistant/ModelSelector.tsx`
- [ ] 实现模型切换
- [ ] 显示模型状态（可用/不可用）

#### 任务 4.4: 聊天页面
- [ ] 创建 `frontend/src/app/(admin)/assistant/chat/page.tsx`
- [ ] 集成所有组件
- [ ] 添加错误处理和重试逻辑
- [ ] 添加加载 Skeleton

**验收标准**:
- 界面符合 Genesis 设计风格
- 消息发送和接收流畅
- 响应时间 < 3 秒

---

### Phase 5: 测试与集成（2 天）

#### 任务 5.1: 单元测试
- [ ] 测试 AI 适配器（每个适配器 3-5 个测试）
- [ ] 测试对话管理器（5-8 个测试）
- [ ] 测试 Agent 主类（3-5 个测试）

#### 任务 5.2: 集成测试
- [ ] 测试 API 端点（8-10 个测试）
- [ ] 测试数据库操作
- [ ] 测试模型切换

#### 任务 5.3: 端到端验证
- [ ] 验证完整聊天流程
- [ ] 验证错误场景处理
- [ ] 性能测试和优化

**验收标准**:
- ≥ 20 个测试全部通过
- 代码覆盖率 ≥ 80%
- 无严重 Bug

---

## 4. 风险评估

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| AI API 不可用 | 高 | 中 | 支持多模型回退机制 |
| Token 超限 | 中 | 高 | 实现智能截断和摘要 |
| 响应延迟 | 中 | 中 | 添加超时和加载提示 |
| 上下文丢失 | 高 | 低 | 定期保存到数据库 |

---

## 5. 文件结构

```
backend/src/
├── agents/
│   └── assistant/
│       ├── __init__.py
│       ├── agent.py              # AI Assistant Agent 主类
│       ├── conversation_manager.py
│       └── adapters/
│           ├── __init__.py
│           ├── base.py           # 统一接口
│           ├── ollama.py
│           ├── anthropic.py
│           └── openai.py
├── api/v1/
│   └── assistant.py              # API 路由
└── models/
    ├── conversation.py
    └── message.py

frontend/src/
├── app/(admin)/assistant/chat/
│   └── page.tsx
├── components/assistant/
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   ├── TypingIndicator.tsx
│   ├── ConversationList.tsx
│   └── ModelSelector.tsx
└── hooks/
    └── use-assistant.ts
```

---

## 6. 依赖项

### 后端依赖
```
anthropic>=0.18.0      # Claude API
openai>=1.0.0          # OpenAI API (可选)
tiktoken>=0.5.0        # Token 计数
```

### 前端依赖
```
@tanstack/react-query  # 已安装
framer-motion          # 动画效果
```

---

## 7. 时间估算

| Phase | 预计天数 | 依赖 |
|-------|----------|------|
| Phase 1: 适配器层 | 2 天 | 无 |
| Phase 2: 对话管理 | 2 天 | Phase 1 |
| Phase 3: Agent 核心 | 2 天 | Phase 2 |
| Phase 4: 前端界面 | 3 天 | Phase 3 |
| Phase 5: 测试集成 | 2 天 | Phase 4 |
| **总计** | **11 天** | - |

**缓冲时间**: 2-3 天（处理意外问题）

**预计完成**: 10-14 个工作日

---

## 8. 后续迭代

### Sprint 5: 实时通信
- WebSocket 实时响应
- 打字指示器
- 在线状态同步

### Sprint 6: 多智能体协作
- AI Assistant 调用 News Agent
- 跨智能体任务分配
- 统一上下文管理

### 未来功能
- 语音输入/输出
- 文件上传和分析
- 多模态支持
- 移动端优化

---

**文档结束**
