# OpenSpec 完整指导手册

> **规范即真相** - OpenSpec 规范驱动开发系统权威指南

---

## 目录

1. [快速开始](#快速开始)
2. [核心概念](#核心概念)
3. [目录结构](#目录结构)
4. [工作流程](#工作流程)
5. [规范格式](#规范格式)
6. [CLI 命令](#cli-命令)
7. [验证机制](#验证机制)
8. [故障排除](#故障排除)

---

## 快速开始

### 什么是 OpenSpec？

OpenSpec 是**规范驱动开发系统**，通过结构化的规范-提案-实现-归档流程，确保项目变更可追溯、可验证。

**核心理念**: *Specs are Truth*（规范即真相）- 代码是实现细节，规范才是唯一真理源。

### 安装与初始化

```bash
# 初始化 OpenSpec 项目
openspec init

# 或使用特定配置
openspec init --config openspec/config.yaml
```

初始化后目录结构：
```
openspec/
├── project.md              # 项目约定
├── specs/                  # 当前规范（已实现的真相）
├── changes/                # 变更提案（待实现）
│   ├── [change-name]/      # 活跃变更
│   └── archive/            # 已归档变更
└── config.yaml             # 项目配置（可选）
```

### 5分钟快速上手

```bash
# 1. 查看当前规范
openspec list --specs

# 2. 创建新变更
openspec create add-user-auth

# 3. 编辑变更内容（proposal.md, specs/, tasks.md）
# ...

# 4. 验证变更
openspec validate add-user-auth --strict

# 5. 归档变更（实现完成后）
openspec archive add-user-auth --yes
```

---

## 核心概念

### 1. Specs（规范）- 已实现的真相

**定义**: 定义系统"是什么"以及"如何工作"。

**特性**:
- 系统的**单一事实来源**
- 包含需求（Requirements）和场景（Scenarios）
- 按领域组织（如 `specs/auth/`, `specs/payments/`）
- 从 `changes/` 归档后进入 `specs/`

**示例结构**:
```
specs/
└── auth/
    ├── spec.md         # 需求和场景
    └── design.md       # 技术实现模式
```

### 2. Changes（变更）- 待实现的提案

**定义**: 记录系统"应该变成什么样"。

#### 何时需要创建变更？

| ✅ 需要变更 | ❌ 不需要变更 |
|-----------|--------------|
| 添加新功能 | Bug 修复（恢复预期行为）|
| 破坏性变更（API、Schema）| 拼写、格式、注释修改 |
| 架构或模式变更 | 非破坏性依赖更新 |
| 性能优化（改变行为）| 配置变更 |
| 安全模式更新 | 现有行为的测试 |

#### 变更工件（Artifacts）

每个变更包含以下工件：

| 工件 | 目的 | 必需 |
|------|------|------|
| `proposal.md` | "为什么"和"是什么" - 意图、范围、方法 | ✅ |
| `specs/` | Delta 规范 - ADDED/MODIFIED/REMOVED | ✅ |
| `tasks.md` | 实现清单 - 带复选框的任务列表 | ✅ |
| `design.md` | "如何做" - 技术决策（可选） | ❌ |

**工件关系**:
```
proposal → specs → design → tasks → implement
   ↑          ↑        ↑                  │
   └──────────┴────────┴──────────────────┘
           随着学习不断更新
```

---

## 目录结构

### 完整目录树

```
openspec/
├── project.md              # 项目上下文和约定
│
├── specs/                  # 【已实现的规范】
│   ├── auth/
│   │   ├── spec.md         # 需求 + 场景
│   │   └── design.md       # 技术模式
│   ├── payments/
│   │   ├── spec.md
│   │   └── design.md
│   └── ...
│
└── changes/                # 【变更提案】
    ├── add-user-auth/      # 活跃变更示例
    │   ├── proposal.md     # 意图和范围
    │   ├── tasks.md        # 实现清单
    │   ├── design.md       # 技术决策（可选）
    │   └── specs/          # 规范增量
    │       └── auth/
    │           └── spec.md # ADDED/MODIFIED/REMOVED
    │
    ├── update-api-v2/      # 另一个活跃变更
    │   └── ...
    │
    └── archive/            # 【已归档变更】
        ├── 2024-01-15-add-user-auth/
        └── 2024-02-01-update-api-v2/
```

### 关键文件详解

#### `project.md`
项目级上下文，包含：
- 项目目的和范围
- 技术栈定义
- 领域上下文
- 项目约定

#### `specs/[capability]/spec.md`
核心规范文件，包含：
- 需求（Requirements）
- 场景（Scenarios）
- 验收标准

#### `specs/[capability]/design.md`
技术设计文档，包含：
- 架构决策
- 技术模式
- 实现指南

---

## 工作流程

### 5阶段工作流

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Handshake  │ -> │    Plan     │ -> │   Execute   │
│  意图澄清    │    │   规范创建   │    │   实现变更   │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              v
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Archive   │ <- │   Verify    │ <- │   Commit    │
│   归档规范   │    │   验证实现   │    │   提交代码   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 阶段详解

#### 阶段1: Handshake（意图澄清）

**目标**: 理解需求，确认是否需要 OpenSpec 流程。

**决策树**:
```
新请求？
├─ Bug 修复？→ 直接修复
├─ 拼写/格式/注释？→ 直接修复
├─ 新功能/变更？→ 启动 OpenSpec
├─ 架构调整？→ 启动 OpenSpec
└─ 不清晰？→ 启动 OpenSpec（更安全）
```

#### 阶段2: Plan（规范创建）

**步骤**:

1. **理解上下文**
   ```bash
   openspec list --specs    # 查看现有规范
   openspec list           # 查看活跃变更
   ```

2. **创建变更 ID**
   - 格式: `kebab-case`
   - 必须以动词开头
   - 示例:
     - ✅ `add-user-authentication`
     - ✅ `update-payment-flow`
     - ✅ `refactor-database-layer`
     - ❌ `user-auth` (缺少动词)
     - ❌ `AddUserAuth` (使用驼峰)

3. **编写 `proposal.md`**
   ```markdown
   # Proposal: Add User Authentication

   ## Intent
   Current system lacks user authentication, 
   requiring JWT login support.

   ## Scope
   - Add user registration API
   - Add user login API
   - Add JWT token generation

   ## Approach
   Use OAuth 2.0 with JWT tokens.
   ```

4. **编写 `specs/spec.md`**（见[规范格式](#规范格式)章节）

5. **编写 `tasks.md`**
   ```markdown
   # Tasks: Add User Authentication

   ## Phase 1: Backend
   - [ ] Create User model
   - [ ] Implement registration endpoint
   - [ ] Implement login endpoint
   - [ ] Add JWT middleware

   ## Phase 2: Frontend
   - [ ] Create login page
   - [ ] Create registration page
   - [ ] Add auth context

   ## Phase 3: Testing
   - [ ] Unit tests for auth service
   - [ ] Integration tests for API
   - [ ] E2E tests for auth flow
   ```

#### 阶段3: Execute（实现变更）

**流程**:
1. 按 `tasks.md` 逐步实现
2. 完成后将 `- [ ]` 改为 `- [x]`
3. 每个任务后进行验证

#### 阶段4: Verify（验证）

```bash
# 验证规范格式
openspec validate [change-id] --strict

# 代码检查
lsp_diagnostics [changed-files]

# 运行测试
npm test  # 或 pytest, cargo test, etc.
```

#### 阶段5: Archive（归档）

```bash
# 归档变更（规范合并到 specs/）
openspec archive [change-id] --yes

# 验证归档后的状态
openspec validate --all
```

**归档时发生的情况**:
1. **ADDED** 要求追加到主规范
2. **MODIFIED** 要求替换现有版本
3. **REMOVED** 要求从主规范删除
4. 变更夹移动到 `changes/archive/`

---

## 规范格式

### Delta Spec 格式

Delta 规范是 OpenSpec 的核心，表示相对于当前规范的变更。

#### 基本结构

```markdown
# Delta for [Capability]

## ADDED Requirements

### Requirement: [Name]
[Requirement description using SHALL/MUST]

#### Scenario: [Scenario name]
- **GIVEN** [precondition]
- **WHEN** [action]
- **THEN** [expected outcome]

## MODIFIED Requirements

### Requirement: [Existing Name]
[Updated description]
(Previously: [old description])

#### Scenario: [Scenario name]
- **GIVEN** [precondition]
- **WHEN** [action]
- **THEN** [expected outcome]

## REMOVED Requirements

### Requirement: [Name]
(Reason for removal)
```

#### 完整示例

```markdown
# Delta for Authentication

## ADDED Requirements

### Requirement: User Registration
The system MUST allow users to register with email and password.

#### Scenario: Valid registration
- **GIVEN** an unauthenticated user
- **WHEN** the user provides valid email and password
- **THEN** an account is created
- **AND** a confirmation email is sent

#### Scenario: Duplicate email
- **GIVEN** an existing user with email "user@example.com"
- **WHEN** a new user tries to register with the same email
- **THEN** the system returns a 409 Conflict error

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- **GIVEN** an authenticated session
- **WHEN** 30 minutes pass without activity
- **THEN** the session is invalidated

## REMOVED Requirements

### Requirement: Guest Mode
(Removing anonymous access in favor of proper authentication)
```

### 语法规则

#### 关键词使用

| 关键词 | 含义 | 示例 |
|--------|------|------|
| **MUST** | 强制性要求 | `The system MUST validate input` |
| **SHALL** | 规范性要求 | `The API SHALL return JSON` |
| **SHOULD** | 推荐性要求 | `The UI SHOULD show loading state` |
| **MAY** | 可选要求 | `The system MAY cache results` |

#### 场景格式

**正确格式**:
```markdown
#### Scenario: User login with valid credentials
- **GIVEN** a registered user exists
- **AND** the user is on the login page
- **WHEN** the user enters valid credentials
- **AND** clicks the login button
- **THEN** the user is redirected to dashboard
- **AND** a session token is created
```

**关键规则**:
- 场景标题使用 `####` (四级标题)
- 使用 **GIVEN/WHEN/THEN/AND** 关键词
- 每个要求至少有一个场景

### 增量操作类型

| 操作 | 使用场景 | 归档行为 |
|------|----------|----------|
| `## ADDED` | 新增能力或功能 | 追加到主规范 |
| `## MODIFIED` | 变更现有行为 | 替换现有版本 |
| `## REMOVED` | 删除旧功能 | 从主规范删除 |
| `## RENAMED` | 重新架构时使用 | 重命名并迁移 |

---

## CLI 命令

### 传统命令（动词优先）

#### 项目管理
```bash
openspec init                           # 初始化项目
openspec init --config config.yaml     # 使用自定义配置
```

#### 列表与查看
```bash
openspec list                          # 列出活跃变更
openspec list --specs                  # 列出现有规范
openspec list --archive               # 列出已归档变更

openspec show [change-id]              # 查看变更详情
openspec show [change-id] --json       # JSON 格式输出
```

#### 创建与编辑
```bash
openspec create [change-id]            # 创建新变更
# 示例
openspec create add-user-authentication
```

#### 验证
```bash
openspec validate [change-id]          # 基本验证
openspec validate [change-id] --strict # 严格验证
openspec validate --all                # 验证所有变更
openspec validate [change-id] --verbose # 详细输出
```

#### 实现与归档
```bash
openspec apply [change-id]             # 开始实现（标记为进行中）
openspec archive [change-id]           # 归档变更
openspec archive [change-id] --yes     # 自动确认
```

#### 交互式工具
```bash
openspec view                          # 启动交互式仪表板
```

### Slash 命令（OhMyOpenCode）

```bash
# OpenSpec 快速命令
/openspec-proposal [change-name]       # 快速创建变更提案
/openspec-apply [change-id]            # 应用变更
/openspec-archive [change-id]          # 归档变更
/openspec-list                         # 列出所有变更

# 扩展命令
/opsx:new [change-id]                  # 创建新变更
/opsx:ff                               # 快速前进（创建所有工件）
/opsx:apply [change-id]                # 应用变更
/opsx:archive [change-id]              # 归档变更
/opsx:validate [change-id]             # 严格验证
```

---

## 验证机制

### 验证层级

#### Level 1: 基本验证
```bash
openspec validate [change-id]
```

检查内容:
- 文件存在性
- 基本格式
- 必需工件完整性

#### Level 2: 严格验证
```bash
openspec validate [change-id] --strict
```

额外检查:
- **格式一致性**: Markdown 标题、列表、代码块格式
- **逻辑完整性**: 场景与要求关联
- **引用连贯性**: 内部引用一致性
- **语法准确性**: BDD 语法（GIVEN/WHEN/THEN）
- **依赖关系**: 无悬空引用

#### Level 3: 全局验证
```bash
openspec validate --all
```

验证所有活跃变更和主规范的兼容性。

### 验证输出示例

```bash
$ openspec validate add-user-auth --strict

✓ Checking proposal.md ... OK
✓ Checking specs/auth/spec.md ... OK
✓ Checking tasks.md ... OK
✓ Validating requirement format ... OK
✓ Checking scenario syntax ... OK
✓ Verifying cross-references ... OK

Validation passed! ✨
```

### 预提交检查清单

在归档前，确保:
- [ ] `openspec validate [change-id] --strict` 通过
- [ ] 所有任务已完成（tasks.md 中全为 `- [x]`）
- [ ] 代码实现通过测试
- [ ] 文档已同步更新

---

## 故障排除

### 常见错误与解决方案

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `"Change must have at least one delta"` | `specs/` 目录为空 | 创建至少一个增量规范文件 |
| `"Requirement must have at least one scenario"` | 缺少场景 | 使用 `#### Scenario:` 格式添加场景 |
| `"Invalid spec format"` | 格式错误 | 运行 `openspec validate [id] --strict` 查看详情 |
| `"Conflicting requirements"` | 规范冲突 | 检查现有规范，解决冲突 |
| `"Target path not found"` | 目录不存在 | 确保 `mkdir -p` 已运行 |
| `"Missing required artifact: proposal.md"` | 缺少必需工件 | 创建缺失的 proposal.md |

### 调试技巧

#### 查看详细验证信息
```bash
openspec validate [change-id] --verbose
```

#### 检查规范结构
```bash
# 查看变更结构
openspec show [change-id] --json

# 查看特定规范
openspec show specs/auth --type spec
```

#### 搜索现有规范
```bash
# 在规范中搜索关键词
rg -n "Requirement:|Scenario:" openspec/specs

# 搜索特定需求
rg -n "user authentication" openspec/
```

### 最佳实践

#### 规范编写
1. **保持简单**: 默认 <100 行新代码，选择成熟方案
2. **清晰引用**: 使用 `file.ts:42` 格式引用代码
3. **能力命名**: 使用动词-名词 (`user-auth`, `payment-capture`)
4. **迭代改进**: 随着学习不断更新工件
5. **场景驱动**: 每个要求至少有一个明确的场景

#### 变更管理
1. **小步快跑**: 每个变更范围要小，易于实现和验证
2. **及时归档**: 实现完成后立即归档，保持 changes/ 整洁
3. **版本控制**: 所有 OpenSpec 文件纳入版本控制
4. **定期审查**: 定期审查 specs/ 确保与代码同步

---

## 参考资源

- [OpenSpec 官方文档](https://github.com/Fission-AI/OpenSpec)
- [项目 OpenSpec 目录](../../openspec/)
- [项目上下文](../../openspec/project.md)
- [AI 代理规范](../../openspec/AGENTS.md)

---

**最后更新**: 2026-02-06
