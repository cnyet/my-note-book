# 文档更新：agentic-environment.md 命令参考

## TL;DR

> **快速总结**: 验证并更新 `docs/guides/agentic-environment.md` 第2节，移除不存在的命令，添加已验证的命令。
> 
> **交付物**: 更新后的第2节内容，准确的命令列表
> 
> **预估工作量**: 简单 (约15分钟)
> **并行执行**: 不适用 (单任务)
> **关键路径**: 验证 → 更新 → 确认

---

## Context

### 原始请求
审查并更新 `docs/guides/agentic-environment.md` 第2节，准确列出 Sisyphus、OpenSpec、OpenCode 和全局可用命令。当前文档包含一些不存在或无法直接调用的命令。

### 调查结果摘要

**已验证的命令**:

OpenSpec CLI:
- `openspec init [path]` - 初始化项目
- `openspec update [path]` - 更新指令文件
- `openspec list` / `openspec list --specs` - 列出变更/规格
- `openspec view` - 交互式仪表板
- `openspec change show [name]` - 显示变更详情
- `openspec change validate [name]` - 验证变更
- `openspec archive [name]` - 归档变更
- `openspec spec list` - 列出规格
- `openspec validate [item-name]` - 验证项目

OpenCode 命令 (在 `.opencode/command/`):
- `/openspec-proposal` - 创建变更提案
- `/openspec-apply` - 实现变更
- `/openspec-archive` - 归档变更

**已移除的不存在命令**:
- `/refactor` - 未找到
- `/start-work` - 未找到
- `/playwright` - 未找到 (可能是 skill，不是命令)
- `/frontend-ui-ux` - 未找到
- `/git-master` - 未找到
- `/dev-browser` - 未找到

---

## Work Objectives

### 核心目标
更新 `docs/guides/agentic-environment.md` 第2节，移除不存在的命令，添加已验证的 OpenSpec CLI 和 OpenCode 命令。

### 具体交付物
- 更新后的第2节内容 (第59-94行)
- 准确的命令语法和描述
- delegate_task 的正确分类和子代理列表

### 完成定义
- [ ] 第2节包含已验证的命令
- [ ] 移除所有未验证的命令
- [ ] delegate_task 参数和类别正确
- [ ] OpenSpec CLI 命令语法准确

### 必须有
- OpenSpec CLI 完整命令列表
- OpenCode Slash 命令列表
- delegate_task 可用参数和类别

### 必须没有 (护栏)
- 虚构的命令
- 无法验证的命令
- 过时的 agent 名称 (如 "build" 应为 "sisyphus-junior")

---

## Verification Strategy

### 测试决策
- **基础设施存在**: 不适用 (文档更新)
- **用户想要测试**: 不适用
- **QA 方法**: 手动验证命令是否存在

### 验证步骤

使用 `openspec --help` 验证所有 OpenSpec CLI 命令:
```bash
openspec --help | grep -E "^\s+[a-z]" | awk '{print $1}'
# 应输出: init, update, list, view, change, archive, spec, validate, show, config, completion, status, instructions, templates, schemas, new, artifact-experimental-setup
```

使用 `ls .opencode/command/` 验证 OpenCode 命令:
```bash
ls .opencode/command/*.md | xargs -I {} basename {} .md | sed 's/openspec-//'
# 应输出: proposal, apply, archive
```

---

## TODOs

> 实现 + 验证 = 一个任务

- [ ] 1. 更新第2节 - Agent类型和命令参考

  **做什么**:
  - 更新 2.1 任务委派 Agents 表格
    - 移除 "build", "plan", "general" agent
    - 添加正确的 categories 和 subagents
    - 添加 delegate_task 函数签名示例
  - 更新 2.2 命令参考
    - 添加 OpenSpec CLI 命令完整列表
    - 添加 OpenCode 命令列表
    - 移除不存在的 /refactor, /start-work 等
  - 保留 2.3 Agent 选择指南

  **不能做**:
  - 不修改其他章节 (第1、3-6节)
  - 不删除整个文档

  **推荐 Agent Profile**:
  > 选择 category + skills 基于任务领域
  - **Category**: `quick`
    - Reason: 文档更新是简单直接的任务
  - **Skills**: 无需特殊技能
    - 不需要 skill: 所有技能都不适用

  **并行化**:
  - **可以并行运行**: 否
  - **并行组**: 顺序执行
  - **阻塞**: 无
  - **被阻塞**: 无 (可以立即开始)

  **参考**:
  - `docs/guides/agentic-environment.md:59-94` - 当前第2节内容
  - `openspec --help` - OpenSpec CLI 命令 (已验证)
  - `ls .opencode/command/` - OpenCode 命令文件

  **验收标准**:
  - [ ] 第2节更新完成 (第59-94行)
  - [ ] 所有命令都有正确的语法
  - [ ] 移除不存在的命令
  - [ ] delegate_task 参数正确

  **证据**:
  - 终端输出保存到 .sisyphus/evidence/
  - 文档 diff 对比

---

## 提交策略

| 任务后 | 消息 | 文件 | 验证 |
|--------|------|------|------|
| 1 | `docs: 更新 agentic-environment.md 命令参考` | docs/guides/agentic-environment.md | 无需验证 |

---

## 成功标准

### 验证命令
```bash
# 检查更新后的文档包含正确的命令
grep -c "openspec init" docs/guides/agentic-environment.md  # 应 > 0
grep -c "/openspec-proposal" docs/guides/agentic-environment.md  # 应 > 0
grep -c "/refactor" docs/guides/agentic-environment.md  # 应 = 0 (已移除)
```

### 最终检查表
- [ ] 所有 OpenSpec CLI 命令已验证并列出
- [ ] 所有 OpenCode 命令已列出
- [ ] delegate_task 参数和类别正确
- [ ] 不存在的命令已移除
- [ ] 其他章节未被修改

---

## 已移除/未验证命令

以下命令在文档中列出但无法验证:
- `/refactor` - 系统未找到
- `/start-work` - 系统未找到
- `/playwright` - 系统未找到 (可能是 skill)
- `/frontend-ui-ux` - 系统未找到
- `/git-master` - 系统未找到
- `/dev-browser` - 系统未找到

这些可能是技能名称或占位符文档，不是可调用的命令。
