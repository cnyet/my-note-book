# OpenSpec 工作流指南

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
└── config.yaml             # 项目配置（可选）
```

## 核心概念

### 1. Specs（规范） - 已实现的真相
**作用**: 定义系统"是什么"以及"如何工作"。
- 是系统的单一事实来源
- 包含需求（Requirements）和场景（Scenarios）
- 部署后从 `changes/` 移动到 `specs/`
- 按域组织（如 `specs/auth/`, `specs/payments/`）

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

### 3. 三阶段工作流

```
Stage 1: 创建变更 (openspec create)
    ↓
Stage 2: 实现变更 (按照 tasks.md) 
    ↓
Stage 3: 归档变更 (openspec archive)
```

**三个关键阶段**:
- **Create Artifacts**: 生成 proposal.md, specs/, design.md, tasks.md
- **Implement Tasks**: AI 开发团队按任务清单实现功能
- **Archive Specs**: 将规范合并到主规格库并归档

## Bootstrap/Init - 项目初始化

如果尚未初始化 OpenSpec，首先创建项目结构：

```bash
# 初始化 OpenSpec 项目（首次使用）
openspec init

# 或者使用特定配置
openspec init --config openspec/config.yaml
```

初始化后，你的项目将拥有以下结构：

- `specs/` - 系统当前行为的源真相
- `changes/` - 存放提议更改的目录
- `config.yaml` - 项目特定的配置选项

## Artifacts 详解

每个变更夹包含多个工件，指导整个开发过程：

| 工件 | 目的 | 用途 |
|------|------|------|
| `proposal.md` | "为什么"和"是什么" | 捕获意图、范围和方法 |
| `specs/` | Delta 规范 | 显示 ADDED/MODIFIED/REMOVED 要求 |
| `design.md` | "如何做" | 技术方法和架构决策 |
| `tasks.md` | 实现清单 | 带复选框的实施清单 |

**工件相互关联**:
```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            随着学习不断更新
```

你可以在实现过程中随时回溯并优化早期工件以获得更多了解。

## Delta Specs - 增量规范详解

Delta 规范是 OpenSpec 的核心概念。它们显示相对于当前规范的变更内容。

### 规范格式

Delta 规范使用部分来表示变更类型：

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### 归档时发生的情况

当你归档变更时：

1. **ADDED** 要求被追加到主规范
2. **MODIFIED** 要求替换现有版本
3. **REMOVED** 要求从主规范中删除

变更夹移动到 `openspec/changes/archive/` 以供审计历史记录。

## Validation Deep-dive - 验证详解

OpenSpec 提供强大的验证功能，确保规范符合标准格式和逻辑要求：

```bash
# 基本验证
openspec validate [change-id]

# 严格验证 - 检查更严格的规则
openspec validate [change-id] --strict

# 验证所有活动变更
openspec validate --all

# 查看验证详情
openspec validate [change-id] --verbose
```

### 严格验证检查的内容

`--strict` 标志启用额外的验证规则：

- **格式一致性**: 确保所有 Markdown 标题、列表和代码块格式正确
- **逻辑完整性**: 验证场景与相应的要求相关联
- **引用连贯性**: 检查规范之间的内部引用是否一致
- **语法准确性**: 验证要求和场景使用正确的 BDD 语法（GIVEN/WHEN/THEN）
- **依赖关系**: 确保移除的需求不会导致其他规范中的悬空引用

## CLI 命令参考

OpenSpec 采用"动词优先"的命令行设计，推荐直接使用顶层动词：

```bash
# 项目管理
openspec init                           # 初始化 OpenSpec 项目

# 查看活动变更
openspec list                          # 列出活动变更
openspec list --specs                  # 列出现有规范
openspec list --archive               # 列出已归档的变更

# 创建和管理变更
openspec create [change-id]           # 创建新变更
openspec create add-user-authentication  # 示例：创建变更

# 查看变更详情
openspec show [change-id/prop]        # 显示变更详情

# 验证变更
openspec validate [change-id]         # 验证变更格式
openspec validate [change-id] --strict # 严格验证
openspec validate --all               # 验证所有变更

# 实现和归档
openspec apply [change-id]            # 开始实现变更
openspec archive [change-id]          # 归档已完成的变更
openspec archive [change-id] --yes    # 自动确认归档

# 交互式工具
openspec view                         # 启动交互式仪表板
```

> **重要提示**: 之前的 `openspec change ...` 和 `openspec spec ...` 命令已被弃用。
> 使用"动词优先"风格的新命令格式。

## 工作流程详解

### Stage 1: 创建变更
1. **理解上下文**
   ```bash
   openspec list --specs    # 查看现有规范
   openspec list           # 查看活动变更
   ```

2. **创建变更 ID** (kebab-case, 动词开头)
   - `add-user-authentication`
   - `update-payment-flow`
   - `refactor-database-layer`

3. **快速创建所有工件** (一次性创建)
   ```bash
   openspec create [change-id]  # 创建变更目录
   openspec fast-forward [change-id]  # 或者简称 opsx:ff
   ```

4. **编写 proposal.md**
   ```markdown
   # Proposal: Add User Authentication

   ## Intent
   Current system lacks user authentication, requiring JWT login support.

   ## Scope
   - Add user registration API
   - Add user login API
   - Add JWT token generation
   - Update user profile management

   ## Approach
   Use OAuth 2.0 with JWT tokens for stateless authentication.
   ```

5. **编写 specs/spec.md** (增量格式)
   ```markdown
   # Delta for Authentication

   ## ADDED Requirements

   ### Requirement: User Registration
   The system MUST allow users to register with email and password.

   #### Scenario: Valid registration
   - GIVEN an unauthenticated user
   - WHEN the user provides valid email and password
   - THEN an account is created and confirmation is sent

   ## MODIFIED Requirements

   ### Requirement: API Access Control
   The system SHALL require authentication for protected endpoints.
   (Previously: Some endpoints were publicly accessible)

   ## REMOVED Requirements

   ### Requirement: Guest Mode
   (Removing anonymous access to core features)
   ```

### Stage 2: 实现变更
按 `tasks.md` 逐步实现，完成后将 `- [ ]` 改为 `- [x]`。

### Stage 3: 归档变更
```bash
# 最终验证
openspec validate [change-id] --strict

# 归档变更（部署后）
openspec archive [change-id] --yes
```

## AI 交互 - Spec-driven 请求处理

当 AI 助手收到 "Spec-driven" 请求时：

### 识别时机
- 用户要求添加新功能
- 用户请求架构或设计变更
- 用户询问 "我们应该..." 或 "如何实现..."

### 正确响应
1. **检查现有变更**: `openspec list` 查看是否有相关变更
2. **创建变更提案**: 如果没有现有变更，启动新的变更流程
3. **引导工件创建**: 帮助用户创建 proposal.md, specs/, design.md, tasks.md
4. **持续更新**: 在实现过程中更新工件以反映新发现

### 与 AI 合作的最佳实践
- **使用指令**: `/opsx:new [change-id]` 创建新变更
- **快速前进**: `/opsx:ff` 一次性创建所有工件
- **实现变更**: `/opsx:apply` 开始实现过程
- **归档变更**: `/opsx:archive` 完成并归档变更

## 规范文件格式

### 场景格式
**正确**（使用 `####` 标题）:
```markdown
#### Scenario: User login success
- **GIVEN** user has valid credentials
- **WHEN** user submits email and password
- **THEN** JWT token is returned
- **AND** session is established
```

每个要求必须有至少一个场景。

### 增量操作
| 操作 | 说明 | 示例 |
|------|------|------|
| `## ADDED Requirements` | 新增能力 | 添加新功能或行为 |
| `## MODIFIED Requirements` | 变更行为 | 修改现有功能 |
| `## REMOVED Requirements` | 移除功能 | 删除旧功能 |
| `## RENAMED Requirements` | 重命名 | 重新架构时使用 |

## 决策树

```
新请求？
├─ Bug 修复？→ 直接修复
├─ 拼写/格式/注释？→ 直接修复
├─ 新功能/变更？→ 创建变更提案
├─ 架构调整？→ 创建变更提案
└─ 不清晰？→ 创建变更提案（更安全）
```

## 与 Sisyphus 的关系

| 系统 | 目的 | 触发条件 |
|------|------|----------|
| **Sisyphus** | 任务执行和知识累积 | 日常开发任务 |
| **OpenSpec** | 规范管理和变更追踪 | 新功能、架构变更 |

**集成方式**:
1. OpenSpec 定义"做什么"（规范）
2. Sisyphus 执行"怎么做"（实现）
3. 完成后从 OpenSpec `changes/` 移动到 `specs/`

## 最佳实践

1. **保持简单**: 默认 <100 行新代码，选择成熟方案
2. **清晰引用**: 使用 `file.ts:42` 格式引用代码
3. **能力命名**: 使用动词-名词 (`user-auth`, `payment-capture`)
4. **迭代改进**: 随着学习不断更新工件
5. **场景驱动**: 每个要求至少有一个明确的场景
6. **渐进验证**: 在每个阶段都进行适当验证

## 故障排除

| 错误 | 解决方案 |
|------|----------|
| "Change must have at least one delta" | 确保 `specs/` 有增量文件 |
| "Requirement must have at least one scenario" | 使用 `#### Scenario:` 格式 |
| "Invalid spec format" | 使用 `openspec validate [change-id] --strict` 检查 |
| "Conflicting requirements" | 检查现有规范是否存在冲突 |

## 高级用法

### 查看和审查变更
```bash
# 查看变更详情
openspec show [change-id]

# 导出变更概要
openspec export [change-id] --format=pdf

# 比较变更
openspec diff [change-1] [change-2]
```

### 交互式工作流
```bash
# 启动可视化界面
openspec view

# 交互式创建变更
openspec create --interactive
```

---

## 相关文档

- [OpenCode 工作流与命令系统](./opencode-workflows.md)
- [Sisyphus 工作流指南](./sisyphus-workflow.md)
- [OpenSpec 官方文档](https://github.com/Fission-AI/OpenSpec)

**最后更新**: 2026-02-04
