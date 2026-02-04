# OpenCode 工作流与命令系统指南

> **核心哲学**: 命令驱动交互 (Command-Driven), 专家代理协作 (Agent Integration), 工作流闭环 (Workflow Loop).

## 1. 概述

OpenCode 提供了一套完整的**工作流与命令系统**，用于简化重复任务、标准化工序并精准调度 AI 代理。通过斜杠命令（Slash Commands），我们可以快速触发复杂的自动化流程。本指南涵盖了内置命令、自定义命令定义以及针对本项目的 OpenSpec 专用工作流。

---

## 2. 内置命令 (Built-in Commands)

这些是 OpenCode 环境自带的工具性命令，用于会话管理和环境配置：

| 命令 | 用途 | 说明 |
| :--- | :--- | :--- |
| `/init` | 初始化 `AGENTS.md` | 在当前目录生成或更新层次化知识库 |
| `/help` | 显示帮助信息 | 查看所有可用命令和快捷键 |
| `/new` | 开启新会话 | 清除当前对话上下文，保留系统提示词 |
| `/sessions` | 会话管理 | 列出并切换历史会话 (`/resume`, `/continue`) |
| `/compact` | 压缩会话 | 总结当前对话，减少 Token 消耗 (`/summarize`) |
| `/export` | 导出对话 | 将当前会话导出为 Markdown 文件 |
| `/models` | 模型列表 | 查看和切换当前可用的 LLM 模型 |
| `/theme` | 切换主题 | 修改 TUI 界面视觉风格 |

---

## 3. 自定义命令定义 (Custom Commands)

开发者可以通过在项目 `.opencode/command/` 目录下创建 Markdown 文件来定义自定义流程。

### 3.1 目录规范
- **项目级**: `./.opencode/command/*.md` (当前项目生效)
- **全局级**: `~/.config/opencode/commands/*.md` (所有项目生效)

### 3.2 定义模板 (Markdown)

```markdown
---
description: 命令的简短描述（显示在补全列表中）
agent: build                  # 指定执行代理 (build, plan, oracle 等)
model: anthropic/claude-3-5   # 可选：覆盖默认模型
subtask: true                 # 可选：强制开启子任务模式
---

<UserRequest>
  $ARGUMENTS                  # 接收用户输入的参数
</UserRequest>

**Guardrails**
- 约束条件 1
- 约束条件 2

**Steps**
1. 步骤 1: 读取 $1 (第一个参数)
2. 步骤 2: 执行具体逻辑
```

### 3.3 参数与占位符
- `$ARGUMENTS`: 捕获命令后的所有输入字符串。
- `$1, $2, ...`: 按空格分割的参数索引。
- `!command`: 在 Prompt 中嵌入 shell 命令的输出 (e.g., `!ls src`)。
- `@filename`: 显式在 Prompt 中包含特定文件内容。

---

## 4. OpenSpec 专用工作流 (Project Specific)

针对本项目 **OpenSpec** 规范驱动开发流程，定义了以下核心工作流命令：

| 命令 | 关联 Agent | 阶段 | 核心任务 |
| :--- | :--- | :--- | :--- |
| **`/openspec-proposal`** | Prometheus | Stage 1 | 构建变更提案 (Why, What, Tasks, Specs) |
| **`/openspec-apply`** | Sisyphus | Stage 2 | 实现变更任务，同步更新 `tasks.md` |
| **`/openspec-archive`** | Atlas | Stage 3 | 验证并归档已完成变更，合并至主 Specs |

### 4.1 详细工作流

#### `/openspec-proposal`
- **目的**: 快速脚手架化新提案。
- **输入**: `/openspec-proposal [功能描述]`
- **动作**: 自动创建 `openspec/changes/[id]/` 结构，生成 `proposal.md` 和 `tasks.md` 初始内容。

#### `/openspec-apply`
- **目的**: 严格遵循规范实现。
- **输入**: `/openspec-apply [change-id]`
- **动作**: 读取规范背景，逐项执行 `tasks.md`，并在完成后自动标记复选框。

#### `/openspec-archive`
- **目的**: 结算与记忆固化。
- **输入**: `/openspec-archive [change-id]`
- **动作**: 运行 `openspec archive` CLI，清理变更目录，更新全局真相。

---

## 5. Agent 协同矩阵 (Orchestration)

命令通过配置 `agent` 字段来确定其拥有的权限和专业度：

| 代理类型 | 适用命令场景 | 权限级别 |
| :--- | :--- | :--- |
| **Prometheus** | 规划、提案、需求分析 | 写入 `openspec/changes/` |
| **Sisyphus** | 编码实现、Debug、测试 | 全局文件修改、Shell 执行 |
| **Oracle** | 架构咨询、疑难审计 | **只读**、深度推理 |
| **Atlas** | 归档、流程流转、状态维护 | 文件移动、Git 操作 |

---

## 6. 最佳实践 (Best Practices)

### 对于人工开发者 (Human)
1. **动词优先**: 命名自定义命令时，使用 `add-xxx`, `check-xxx`, `fix-xxx` 风格。
2. **组合拳**: 使用内置命令准备环境（如 `/new`），然后使用自定义命令执行工序。
3. **显式上下文**: 如果命令需要操作特定文件，在参数中加上 `@filename`。

### 对于 AI 开发者 (AI/Subagent)
1. **自动识别**: 当用户描述的任务符合 OpenSpec 触发条件时，应主动建议或使用 `/openspec-proposal`。
2. **状态闭环**: 在通过命令执行任务时，必须实时更新 `tasks.md` 等追踪文件。
3. **验证驱动**: 在命令的最后一步，始终包含 `lsp_diagnostics` 或测试运行。

---

## 7. 相关文档

- [Sisyphus 工作流指南](./sisyphus-workflow.md)
- [OpenSpec 工作流指南](./openspec-workflow.md)
- [项目实施计划](../implement/implement-plan.md)
- [架构设计](../design/architecture.md)

---

## 外部链接

- [OpenCode 文档](https://opencode.ai/docs)

**最后更新**: 2026-02-04
