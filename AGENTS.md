# 逻辑准则

> **Vibe Coding 指南**：本文件是所有开发智能体的核心运行规范。在实现任何智能体相关功能、定义接口或优化 Prompt 前，必须阅读本文件，以确保角色职责不越权、工具调用不冗余、能力增强对齐。

## 🧠 认知架构 (Cognitive Architecture)

### 1. 记忆分层原则

智能体必须严格区分记忆的生命周期，禁止将临时会话数据持久化为长期记忆。

- **短期记忆 (Short-term)**: 仅在当前 `session_id` 内可见，用于维持当前对话上下文，会话结束后立即清理。
- **长期记忆 (Long-term)**: 跨会话持久化，通过 `agent_id` 索引。仅存储核心用户偏好、关键历史决策或领域知识。
- **加密记忆**: 涉及 API 密钥、个人隐私等敏感数据必须标记为 `encrypt=True`，由 `MemoryStore` 使用 AES-256-GCM 处理。

### 2. 角色边界与职责 (Role Boundaries)

智能体在执行任务时应遵循“最小权限原则”，禁止跨越职责边界：

- **通用助理 (Assistant)**: 调度中心 $\rightarrow$ 负责意图识别与任务分发。
- **专项智能体 (Specialists)**: 领域专家 $\rightarrow$ 负责具体业务逻辑（如 Life, Outfit, News, Task, Review）。
- **禁止行为**: 专项智能体不得直接修改全局系统配置，除非通过通用助理的授权。

## 🛠 执行准则 (Execution Guidelines)

### 1. 能力增强对齐 (Skill Alignment)

在实现功能时，必须将 `AGENTS.md` 中定义的高级增强技能（Skills）转化为代码逻辑或 Prompt 约束：

- **长对话场景** $\rightarrow$ 强制调用 `conversation-accuracy-skill` 逻辑。
- **UI 开发场景** $\rightarrow$ 强制对齐 `ui-ux-pro-max` 的视觉标准与 `react-best-practices` 的性能标准。
- **复杂任务分发** $\rightarrow$ 使用 `prompt-optimization` 策略构建子任务指令。

### 2. 通信协议约束

智能体间的交互必须通过标准消息流转，禁止使用非结构化的随意通信：

- `REQUEST` $\rightarrow$ `RESPONSE`: 同步处理链路。
- `EVENT` $\rightarrow$ `BROADCAST`: 异步状态同步。

## 🔐 权限矩阵 (Permission Matrix)

| 权限级别 | 访问范围 | 操作限制 |
| :--- | :--- | :--- |
| **L1: 只读** | 基础 Profile, 静态文档 | 仅限检索，禁止修改 |
| **L2: 读写** | 专项业务数据, 会话记忆 | 仅限所属角色管辖的 Namespace |
| **L3: 管理** | AgentManager, 系统配置 | 仅限通用助理与管理员级别接口 |
