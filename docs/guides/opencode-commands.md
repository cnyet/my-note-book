# OpenCode 命令系统指南

> OpenCode CLI 命令配置及其与 Agent 系统的集成

## 概述

`.opencode/` 是 **OpenCode 命令系统**的专用目录，用于定义 AI Assistant 的快捷命令（slash commands）。它与 Agent 系统协同工作，提供标准化的操作流程入口。

## 目录结构

```
.opencode/
└── command/
    ├── openspec-proposal.md   # 创建 OpenSpec 变更提案
    ├── openspec-apply.md      # 实现 OpenSpec 变更
    └── openspec-archive.md    # 归档 OpenSpec 变更
```

---

## 命令类型

### 1. `/openspec-proposal` - 创建变更提案

**描述**: Scaffold a new OpenSpec change and validate strictly.

**触发条件**: 用户需要创建新功能提案、架构变更、破坏性变更。

**工作流**:
1. 审查当前上下文（`openspec/project.md`, `openspec list`）
2. 选择唯一的 `change-id`
3. 创建 `proposal.md`, `tasks.md`, `design.md`
4. 编写规范增量（spec deltas）
5. 验证并修复问题

**相关 Agent**:
- **Prometheus** - 创建提案
- **Momus** - 审核提案
- **Oracle** - 提供技术建议

---

### 2. `/openspec-apply` - 实现变更

**描述**: Implement an approved OpenSpec change and keep tasks in sync.

**触发条件**: 用户需要实现已批准的变更提案。

**工作流**:
1. 读取 `changes/<id>/proposal.md`, `design.md`, `tasks.md`
2. 按顺序实现任务
3. 确认每个任务完成
4. 更新任务状态为 `- [x]`

**相关 Agent**:
- **Sisyphus** - 执行实现
- **Atlas** - 协调执行流程

---

### 3. `/openspec-archive` - 归档变更

**描述**: Archive a deployed OpenSpec change and update specs.

**触发条件**: 变更已部署，需要归档到 `changes/archive/`。

**工作流**:
1. 确认要归档的变更 ID
2. 验证变更状态
3. 运行 `openspec archive <id> --yes`
4. 验证规格更新
5. 确认归档成功

**相关 Agent**:
- **Atlas** - 协调归档流程
- **Sisyphus** - 执行归档

---

## 与 Agent 的集成

### 集成矩阵

| OpenCode 命令 | 主要 Agent | 辅助 Agent | 工作流阶段 |
|--------------|-----------|-----------|-----------|
| `/openspec-proposal` | Prometheus | Momus, Oracle | Stage 1 |
| `/openspec-apply` | Sisyphus | Atlas | Stage 2 |
| `/openspec-archive` | Atlas | Sisyphus | Stage 3 |

---

### 工作流程图

```
用户输入
    │
    ↓
┌─────────────────────────────────────────┐
│          .opencode/command/             │
│  /openspec-proposal → 创建提案          │
│  /openspec-apply    → 实现变更          │
│  /openspec-archive  → 归档变更          │
└─────────────────────────────────────────┘
    │
    ↓
┌─────────────────────────────────────────┐
│            Agent 系统                    │
│  Prometheus → 规划者（创建提案）         │
│  Momus      → 审核者（审查提案）         │
│  Oracle     → 顾问（技术建议）           │
│  Sisyphus   → 执行者（实现任务）         │
│  Atlas      → 协调者（流程管理）         │
└─────────────────────────────────────────┘
    │
    ↓
┌─────────────────────────────────────────┐
│            OpenSpec 系统                 │
│  changes/ → 提案存储                     │
│  specs/   → 规范存储                     │
│  archive/ → 归档存储                     │
└─────────────────────────────────────────┘
```

---

## 使用示例

### 示例 1: 创建新功能提案

```bash
# 用户输入
/openspec-proposal 添加用户认证功能
```

**执行流程**:
1. 系统读取 `.opencode/command/openspec-proposal.md`
2. 调用 Prometheus 创建提案
3. 生成 `openspec/changes/add-user-auth/proposal.md`
4. 生成 `openspec/changes/add-user-auth/tasks.md`
5. 验证提案格式
6. 等待 Momus 审核

---

### 示例 2: 实现已批准的提案

```bash
# 用户输入
/openspec-apply add-user-auth
```

**执行流程**:
1. 系统读取 `.opencode/command/openspec-apply.md`
2. 调用 Sisyphus 实现变更
3. 按 `tasks.md` 顺序执行任务
4. 更新任务状态
5. 验证实现完整性

---

### 示例 3: 归档完成的变更

```bash
# 用户输入
/openspec-archive add-user-auth
```

**执行流程**:
1. 系统读取 `.opencode/command/openspec-archive.md`
2. 调用 Atlas 协调归档
3. 运行 `openspec archive add-user-auth --yes`
4. 移动到 `changes/archive/`
5. 更新 `specs/`
6. 验证归档结果

---

## 核心原则

### 1. 命令驱动

每个命令定义了一个标准化的操作流程，确保一致性。

**命令模板结构**:
```markdown
---
description: [命令描述]
---
<UserRequest>
  $ARGUMENTS
</UserRequest>
<!-- OPENSPEC:START -->
**Guardrails**
- 约束条件 1
- 约束条件 2

**Steps**
1. 步骤 1
2. 步骤 2

**Reference**
- 参考信息
<!-- OPENSPEC:END -->
```

---

### 2. Agent 协同

| 命令 | Agent 角色 | 职责 |
|------|-----------|------|
| proposal | Prometheus | 创建提案文档 |
| apply | Sisyphus | 执行实现任务 |
| archive | Atlas | 管理归档流程 |

---

### 3. 上下文传递

命令通过以下方式传递上下文:
- `<UserRequest>` - 用户原始请求
- `$ARGUMENTS` - 命令参数
- `<!-- OPENSPEC:START/END -->` - 嵌入的指令

---

## 与 Sisyphus 的关系

| 系统 | 目的 | 触发方式 |
|------|------|----------|
| **OpenCode** | 命令入口 | Slash commands (`/command`) |
| **Sisyphus** | 任务执行 | `delegate_task()` |

**集成方式**:
1. 用户通过 `/openspec-*` 命令触发
2. OpenCode 调用对应的 Agent
3. Agent 执行具体任务
4. 结果返回给用户

---

## 与 OpenSpec 的关系

| 系统 | 目录 | 核心文件 |
|------|------|----------|
| **OpenCode** | `.opencode/command/` | `*.md` 命令定义 |
| **OpenSpec** | `openspec/` | `proposal.md`, `tasks.md`, `specs/` |

**数据流**:
```
.opencode/command/*.md
    ↓
openspec/changes/[change-id]/
    ↓
openspec/specs/
```

---

## 最佳实践

### 1. 统一使用命令

对于 OpenSpec 相关操作，始终使用对应的命令：
- 创建提案 → `/openspec-proposal`
- 实现变更 → `/openspec-apply`
- 归档变更 → `/openspec-archive`

---

### 2. 遵循约束条件

每个命令都有 `Guardrails` 部分，定义了约束条件：
- Favor straightforward, minimal implementations
- Keep changes tightly scoped
- Reference documentation when needed

---

### 3. 顺序执行

遵循命令定义的步骤顺序：
1. 读取上下文
2. 创建/修改文件
3. 验证结果
4. 更新状态

---

## 常见问题

### Q1: OpenCode 和 Agent 有什么区别？

| 维度 | OpenCode | Agent |
|------|----------|-------|
| **作用** | 定义命令入口 | 执行具体任务 |
| **位置** | `.opencode/command/` | `delegate_task()` 调用 |
| **触发** | Slash command | Orchestrator 协调 |

**关系**: OpenCode 定义"怎么做"，Agent 执行"做什么"。

---

### Q2: 可以自定义命令吗？

可以。在 `.opencode/command/` 下添加新的 `.md` 文件即可。

**模板**:
```markdown
---
description: [命令描述]
---
<UserRequest>
  $ARGUMENTS
</UserRequest>
**Guardrails**
- 约束条件

**Steps**
1. 步骤

**Reference**
- 参考信息
```

---

### Q3: 命令执行失败怎么办？

1. 检查命令参数是否正确
2. 验证目标文件是否存在
3. 运行 `openspec validate --strict`
4. 查看错误信息并修复

---

## 快速参考

### 可用命令

| 命令 | 用途 | Agent |
|------|------|-------|
| `/openspec-proposal` | 创建变更提案 | Prometheus |
| `/openspec-apply` | 实现变更 | Sisyphus |
| `/openspec-archive` | 归档变更 | Atlas |

### 相关目录

| 目录 | 用途 |
|------|------|
| `.opencode/command/` | 命令定义 |
| `openspec/changes/` | 变更提案 |
| `openspec/specs/` | 规范定义 |
| `.sisyphus/plans/` | 实施计划 |

### CLI 速查

```bash
# 查看活动变更
openspec list

# 验证变更
openspec validate --strict

# 归档变更
openspec archive <id> --yes
```

---

## 相关文档

- [Sisyphus 工作流指南](./sisyphus-workflow.md)
- [OpenSpec 工作流指南](./openspec-workflow.md)
- [项目实施计划](../implement/implement-plan.md)
- [架构设计](../design/architecture.md)

---

## 外部文档
- [OpenCode](https://github.com/anomalyco/opencode)
- [OpenCode Docs](https://opencode.ai/docs/)

**最后更新**: 2026-01-31
