# OpenSpec 规范驱动开发指南

> OpenSpec 规范驱动开发系统的核心概念和使用指南

## 概述

`openspec/` 是 **OpenSpec 规范驱动开发系统**的专用目录，用于管理项目规范、变更提案和实现追踪。它强调"规范即真相"（Specs are Truth），通过结构化的提案-实现-归档流程，确保项目变更可追溯、可验证。

## 目录结构

```
openspec/
├── project.md              # 项目约定和惯例
├── specs/                  # 当前规范（已实现的真相）
│   └── [capability]/
│       ├── spec.md         # 需求和场景
│       └── design.md       # 技术模式
├── changes/                # 变更提案（待实现）
│   ├── [change-name]/
│   │   ├── proposal.md     # 为什么、改什么、影响
│   │   ├── tasks.md        # 实现清单
│   │   ├── design.md       # 技术决策（可选）
│   │   └── specs/          # 规范增量
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 已完成的变更
│       └── YYYY-MM-DD-[change-name]/
```

---

## 核心概念

### 1. Specs（规范） - 已实现的真相

**作用**: 定义系统"是什么"以及"如何工作"。

**特点**:
- 是系统的单一事实来源
- 包含需求（Requirements）和场景（Scenarios）
- 部署后从 `changes/` 移动到 `specs/`

**示例**:
```markdown
# spec: user-auth

## ADDED Requirements
### Requirement: User Login
用户必须提供有效的凭据才能访问系统。

#### Scenario: Valid credentials
- **WHEN** 用户提供有效的邮箱和密码
- **THEN** 系统返回 JWT Token
```

---

### 2. Changes（变更） - 待实现的提案

**作用**: 记录系统"应该变成什么样"。

**触发条件**:
- 添加新功能
- 破坏性变更（API、Schema）
- 架构或模式变更
- 性能优化（改变行为）
- 安全模式更新

**跳过条件**:
- Bug 修复（恢复预期行为）
- 拼写、格式、注释修改
- 非破坏性依赖更新
- 配置变更
- 现有行为的测试

---

### 3. 三阶段工作流

```
Stage 1: 创建变更
    ↓
Stage 2: 实现变更
    ↓
Stage 3: 归档变更
```

---

## Agent 关系

### 相关 Agent

| Agent | 角色 | 与 OpenSpec 的关系 |
|-------|------|-------------------|
| **所有 AI Assistant** | 开发者 | 使用 OpenSpec 进行规范驱动开发 |
| **Prometheus** | 规划者 | 可创建变更提案 |
| **Momus** | 审核者 | 审核变更提案的完整性 |
| **Atlas** | 协调者 | 协调变更实现流程 |
| **Sisyphus** | 执行者 | 按 tasks.md 实现具体任务 |

### 触发词

当用户提到以下关键词时，AI 应使用 OpenSpec:

| 关键词组合 | 示例 |
|-----------|------|
| proposal + create/plan/make | "Help me create a change proposal" |
| change + create/plan | "Help me plan a change" |
| spec + create | "I want to create a spec proposal" |

---

## 快速开始

### 常用 CLI 命令

```bash
# 查看活动变更
openspec list

# 查看规范列表
openspec list --specs

# 显示详情
openspec show [item]

# 验证变更
openspec validate [change-id] --strict

# 归档变更（部署后）
openspec archive <change-id> --yes
```

---

## Stage 1: 创建变更

### 步骤 1: 理解上下文

```bash
# 阅读项目约定
cat openspec/project.md

# 查看现有规范
openspec list --specs

# 查看活动变更
openspec list
```

### 步骤 2: 创建变更 ID

规则:
- kebab-case（短横线命名）
- 动词开头（add-, update-, remove-, refactor-）
- 唯一

示例:
```bash
add-user-authentication
update-payment-flow
refactor-database-layer
```

### 步骤 3: 创建提案结构

```
openspec/changes/[change-id]/
├── proposal.md     # 必填：为什么、改什么、影响
├── tasks.md        # 必填：实现清单
├── design.md       # 可选：复杂决策
└── specs/          # 必填：规范增量
    └── [capability]/
        └── spec.md
```

### 步骤 4: 编写 proposal.md

```markdown
# Change: 添加用户认证

## Why
当前系统缺少用户认证功能，需要支持 JWT 登录。

## What Changes
- 添加用户注册 API
- 添加用户登录 API
- 添加 JWT Token 生成

## Impact
- 受影响的规范: `user-auth`
- 受影响的代码: `backend/auth/`, `frontend/auth/`
```

### 步骤 5: 编写 spec deltas

```markdown
## ADDED Requirements
### Requirement: User Registration
用户可以通过邮箱和密码注册账户。

#### Scenario: Valid registration
- **WHEN** 用户提供有效的邮箱和密码
- **THEN** 创建用户账户并返回成功

## MODIFIED Requirements
### Requirement: User Login
[完整的修改后需求内容]
```

### 步骤 6: 验证

```bash
openspec validate [change-id] --strict
```

---

## Stage 2: 实现变更

### 实现步骤

1. **阅读 proposal.md** - 理解目标
2. **阅读 design.md**（如果存在）- 审查技术决策
3. **阅读 tasks.md** - 获取实现清单
4. **按顺序实现** - 逐一完成任务
5. **确认完成** - 确保所有任务完成后更新状态

### tasks.md 格式

```markdown
## 1. Implementation
- [ ] 1.1 创建数据库 schema
- [ ] 1.2 实现注册 API
- [ ] 1.3 实现登录 API

## 2. Testing
- [ ] 2.1 编写单元测试
- [ ] 2.2 编写集成测试

## 3. Documentation
- [ ] 3.1 更新 API 文档
```

**重要**: 完成后将所有 `- [ ]` 改为 `- [x]`，反映真实状态。

---

## Stage 3: 归档变更

部署后，创建单独的 PR 进行归档：

```bash
# 归档变更
openspec archive <change-id> --yes

# 如果仅工具变更，跳过 spec 更新
openspec archive <change-id> --skip-specs --yes

# 验证归档
openspec validate --strict
```

归档位置:
```
openspec/changes/archive/YYYY-MM-DD-[change-name]/
```

---

## 规范文件格式

### 关键：场景格式

**正确**（使用 `####` 标题）:
```markdown
#### Scenario: User login success
- **WHEN** 用户提供有效凭据
- **THEN** 返回 JWT Token
```

**错误**:
```markdown
- **Scenario: User login**      ❌
**Scenario**: User login         ❌
### Scenario: User login         ❌
```

每个需求必须有至少一个场景。

### 需求措辞

- 使用 SHALL/MUST 表示规范性要求
- 避免 should/may（除非有意非规范）

### 增量操作

| 操作 | 说明 | 示例 |
|------|------|------|
| `## ADDED Requirements` | 新增能力 | 添加新功能 |
| `## MODIFIED Requirements` | 变更行为 | 修改现有功能 |
| `## REMOVED Requirements` | 移除功能 | 废弃旧功能 |
| `## RENAMED Requirements` | 重命名 | 名称变更 |

---

## 决策树

```
新的请求？
├─ Bug 修复恢复规范行为？→ 直接修复
├─ 拼写/格式/注释？→ 直接修复
├─ 新功能/能力？→ 创建提案
├─ 破坏性变更？→ 创建提案
├─ 架构变更？→ 创建提案
└─ 不清晰？→ 创建提案（更安全）
```

---

## 最佳实践

### 1. 保持简单

- 默认 <100 行新代码
- 单文件实现直到证明不足
- 无明确理由不使用框架
- 选择无聊但成熟的方案

### 2. 复杂度触发条件

仅在以下情况添加复杂度:
- 性能数据显示当前方案太慢
- 明确的规模需求（>1000 用户）
- 多个已证实的用例需要抽象

### 3. 清晰的引用

- 使用 `file.ts:42` 格式引用代码位置
- 引用规范为 `specs/auth/spec.md`
- 链接相关变更和 PR

### 4. 能力命名

- 使用动词-名词: `user-auth`, `payment-capture`
- 每个能力单一目的
- 10 分钟可理解规则
- 如果描述需要 "AND" 则拆分

---

## 故障排除

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| "Change must have at least one delta" | `specs/` 目录为空 | 创建规范增量文件 |
| "Requirement must have at least one scenario" | 场景格式错误 | 使用 `#### Scenario:` |
| 静默场景解析失败 | 格式不精确 | 使用 `openspec show [change] --json --deltas-only` |

### 验证技巧

```bash
# 使用 strict 模式进行全面检查
openspec validate [change] --strict

# 调试增量解析
openspec show [change] --json | jq '.deltas'

# 检查特定需求
openspec show [spec] --json -r 1
```

---

## 快速参考

### 阶段指示器

| 目录 | 状态 |
|------|------|
| `changes/` | 提议中，未构建 |
| `specs/` | 已构建，已部署 |
| `archive/` | 已完成 |

### 文件用途

| 文件 | 用途 |
|------|------|
| `proposal.md` | 为什么、改什么 |
| `tasks.md` | 实现步骤 |
| `design.md` | 技术决策 |
| `spec.md` | 需求和行为 |

### CLI 速查

```bash
openspec list              # 有什么在进行？
openspec show [item]       # 查看详情
openspec validate --strict # 是否正确？
openspec archive <change-id> --yes  # 标记完成
```

---

## 与 Sisyphus 的关系

| 系统 | 目的 | 触发条件 |
|------|------|----------|
| **Sisyphus** | 任务执行和知识累积 | 日常开发任务 |
| **OpenSpec** | 规范管理和变更追踪 | 新功能、架构变更 |

**集成方式**:
1. OpenSpec 定义"做什么"（规范）
2. Sisyphus 执行"怎么做"（实现）
3. 完成后从 OpenSpec `changes/` 移动到 `specs/`

---

## 相关文档

- [Sisyphus 工作流指南](./sisyphus-workflow.md)
- [项目实施计划](../implement/implement-plan.md)
- [架构设计](../design/architecture.md)
- [数据库设计](../design/database-schema.md)

---

## 外部文档
- [OpenSpec](https://github.com/Fission-AI/OpenSpec)

**最后更新**: 2026-01-31
