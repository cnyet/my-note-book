# 开发环境全面分析报告

**分析时间**: 2026-02-04
**分析范围**: Skills、Agents、MCP、开发规范与约束

---

## 1. 可用的 Skills

### 1.1 核心用户级 Skill

**conversation-accuracy-skill** (必须掌握)
- 功能: 四层记忆架构优化长对话准确性
- 触发条件: 对话超过10轮，或用户提及"之前说过"、"总结"等关键词

**ui-ux-pro-max-skill** (新增)
- 功能: UI/UX设计智能。50种风格、21种配色方案、50种字体搭配、20种图表类型、9种技术栈。支持页面规划、构建、创建、设计、审查、修复、改进、优化、增强、重构等操作
- 触发条件: 涉及UI/UX设计、构建、创建、实现、审查、修复、改进、优化、增强、重构等任务

**react-best-practices** (新增)
- 功能: React和Next.js性能优化指南，来自Vercel工程团队的最佳实践
- 触发条件: 涉及React组件、Next.js页面、数据获取、捆绑包优化或性能改进的任务

**prompt-optimization** (新增)
- 功能: 提示词工程专家。提供清晰度、精确性、上下文提供、结构化、战术技巧、示例模式和高级提示词技术指南，旨在最大化 AI 理解和响应质量。
- 触发条件: 需要编写复杂提示词、优化子代理任务描述、培训团队成员或迭代低质量 AI 响应时。

### 1.2 OpenCode 内置 Skills

| Skill | 用途 | 触发场景 |
|-------|------|---------|
| `playwright` | 浏览器自动化 | 必须用于任何浏览器相关任务、抓取、测试 |
| `frontend-ui-ux` | 前端UI/UX设计开发 | 界面开发、样式、动画、甚至在没有设计稿时创建UI |
| `git-master` | Git 操作 | 必须用于任何 Git 操作：commit、rebase、squash、blame |
| `dev-browser` | 浏览器自动化（持久状态） | 导航网站、填写表单、截图、数据抓取 |

### 1.3 集成工具与能力 (Tools)

除了明确加载的 Skills，AI 还可以直接调用以下能力：
- **LSP**: `lsp_goto_definition`, `lsp_find_references`, `lsp_symbols`, `lsp_diagnostics`
- **AST**: `ast_grep_search`, `ast_grep_replace` (结构化代码修改)
- **Search**: `glob`, `grep`, `google_search`, `webfetch`
- **Multi-modal**: `look_at` (分析 PDF、图片、流程图)

---

## 2. 可用的 Agents 和命令

### 2.1 Agent 层级与分工

本项目采用 **Sisyphus** 编排模式，将 Agent 分为三个层级：

#### A. 核心编排代理 (Orchestration)
负责理解全局意图、拆解任务并调度其他专家。
- **`build` (Default)**: 通用执行者，拥有完整工具权限，负责日常编码。
- **`plan`**: 规划专用，**禁止修改文件**，仅用于产出技术方案。
- **`general`**: 并行研究专家，擅长处理需要同时启动多个子任务的复杂流程。

#### B. 专项领域专家 (Subagents)
在特定领域具备深层知识或特殊能力的专家模型。
- **`oracle`**: **总工程师**。只读专家，负责架构决策、复杂 Debug、安全性与性能审计。
- **`librarian`**: **知识百科**。负责外部文档、远程仓库分析、第三方库最佳实践。
- **`prometheus`**: **战略规划**。负责需求访谈、长远路径规划、任务依赖拆解。
- **`momus`**: **审计法官**。负责方案评审、质量验收、一致性检查。
- **`metis`**: **前置分析**。负责识别需求歧义、挖掘隐藏意图、评估实施风险。

#### C. 高性能工具代理 (Tooling)
针对特定操作优化的轻量级/高性能代理。
- **`explore`**: **代码雷达**。深度洞察代码库结构、发现跨层设计模式、上下文检索。
- **`multimodal-looker`**: **视觉大脑**。解读 PDF、图片、流程图等非文本资产。
- **`sisyphus-junior`**: **原子执行器**。专注于受控环境下的高精度单一任务实现。

### 2.2 任务分类委派 (Category)

通过 `category` 参数委派给经过领域优化的 Sisyphus-Junior 实例：

| Category | 专注领域 | 适用场景 |
|----------|----------|---------|
| `visual-engineering` | 前端/UI/UX | 界面还原、动效、Tailwind 样式、组件封装 |
| `ultrabrain` | 极端逻辑 | 算法优化、并发控制、复杂状态机（高难度专属） |
| `deep` | 自主探索 | 目标导向的深度调研、在信息极少时寻找出路 |
| `artistry` | 创意工程 | 非标准模式解决、打破常规的系统设计 |
| `quick` | 琐碎任务 | 拼写修正、单文件微调、简单重命名 |
| `writing` | 文档工程 | 技术写作、注释生成、README 维护 |

### 2.3 Agent 调用方式


### 2.4 可用的 Slash 命令

| Command | 用途 | 说明 |
|---------|------|------|
| `/init-deep` | 初始化知识库 | Initialize hierarchical AGENTS.md knowledge base (builtin) |
| `/ralph-loop` | 自引用开发循环 | Start self-referential development loop until completion (builtin) |
| `/ulw-loop` | UltraWork 循环 | Start ultrawork loop - continues until completion with ultrawork mode (builtin) |
| `/cancel-ralph` | 取消 Ralph 循环 | Cancel active Ralph Loop (builtin) |
| `/refactor` | 智能重构 | Intelligent refactoring command with LSP, AST-grep, architecture analysis, codemap, and TDD verification (builtin) |
| `/start-work` | 启动 Sisyphus 工作 | Start Sisyphus work session from Prometheus plan (builtin) |
| `/stop-continuation` | 停止延续机制 | Stop all continuation mechanisms (ralph loop, todo continuation, boulder) for this session (builtin) |
| `/openspec-proposal` | OpenSpec 提案 | Scaffold a new OpenSpec change and validate strictly (opencode-project) |
| `/openspec-apply` | OpenSpec 实施 | Implement an approved OpenSpec change and keep tasks in sync (opencode-project) |
| `/openspec-archive` | OpenSpec 归档 | Archive a deployed OpenSpec change and update specs (opencode-project) |
| `/playwright` | 浏览器自动化 | MUST USE for any browser-related tasks. Browser automation via Playwright MCP - verification, browsing, information gathering, web scraping, testing, screenshots, and all browser interactions (builtin) |
| `/frontend-ui-ux` | 前端UI/UX设计 | Designer-turned-developer who crafts stunning UI/UX even without design mockups (builtin) |
| `/git-master` | Git 操作 | MUST USE for ANY git operations. Atomic commits, rebase/squash, history search (blame, bisect, log -S). STRONGLY RECOMMENDED: Use with delegate_task(category='quick', load_skills=['git-master'], ...) to save context. Triggers: 'commit', 'rebase', 'squash', 'who wrote', 'when was X added', 'find the commit that' (builtin) |
| `/dev-browser` | 浏览器自动化 | Browser automation with persistent page state. Use when users ask to navigate websites, fill forms, take screenshots, extract web data, test web apps, or automate browser workflows. Trigger phrases include 'go to [url]', 'click on', 'fill out the form', 'take a screenshot', 'scrape', 'automate', 'test the website', 'log into', or any browser interaction request (builtin) |
| `/conversation-accuracy-skill` | 对话精度优化 | Optimize long-form conversation accuracy using a four-layer memory architecture and dynamic context pruning (user) |

### 2.5 OpenSpec CLI 命令 (Verb-first Style)

对于完整的 OpenSpec CLI 命令参考，请参见 [OpenSpec 工作流指南](./openspec-workflow.md)。

OpenSpec 采用"动词优先"的命令行设计。主要命令包括：

- **项目管理**: `openspec init`, `openspec list`, `openspec validate`
- **变更管理**: `openspec create`, `openspec show`, `openspec archive`
- **工作流**: `openspec apply`, `openspec view`

> **注意**: 之前的 `openspec change ...` 和 `openspec spec ...` 命令已被弃用。

### 2.6 delegate_task 调用示例

```typescript
// 方式一：使用 Category（推荐用于具体任务执行）
delegate_task(
  category="visual-engineering",
  load_skills=["frontend-ui-ux"],
  prompt="Implement the homepage with hero section and animations..."
)

// 方式二：使用 Subagent（用于专门领域任务）
delegate_task(
  subagent_type="oracle",
  load_skills=[],
  prompt="Review the current architecture and suggest improvements..."
)

// 方式三：带后台运行（用于并行探索）
delegate_task(
  subagent_type="librarian",
  load_skills=[],
  run_in_background=true,
  prompt="Find examples of authentication implementation..."
)

// 方式四：带会话继续（用于修复和后续任务）
delegate_task(
  session_id="ses_abc123",
  load_skills=[],
  prompt="Fix the build error: [specific error message]"
)
```

### 2.7 Agent 选择指南

| 场景 | 推荐 Agent/Category | 原因 |
|------|-------------------|------|
| 理解代码库结构 | `explore` | 代码发现和上下文分析 |
| 新功能规划 | `prometheus` | 战略规划和需求访谈 |
| 技术调研 | `librarian` | 外部文档和示例查找 |
| 复杂调试 | `oracle` 或 `ultrabrain` | 高难度架构决策 |
| 计划审核 | `momus` | 计划质量和完整性验证 |
| 风险评估 | `metis` | 识别需求漏洞、风险评估 |
| 媒体分析 | `multimodal-looker` | PDF/图片/图表解读 |
| 前端UI开发 | `visual-engineering` + `frontend-ui-ux` | 界面开发、动画 |
| Git操作 | 任意 + `git-master` | commit、rebase、blame |
| 浏览器测试 | 任意 + `playwright` | 自动化浏览器测试 |
| 简单修改 | `quick` | 单文件更改、拼写修复 |
| 文档编写 | `writing` | 技术文档、注释 |

---

## 3. 可用的 MCP Servers

### 3.1 当前配置

**当前项目: work-agents**

技术栈:
- 前端: Next.js 15.5, React 19, TypeScript 5, Tailwind CSS 4
- 后端: FastAPI >= 0.115, Python 3.11+, SQLAlchemy 2.0
- 数据库: SQLite (aiosqlite)
- 认证: JWT (python-jose, passlib)

### 3.2 可用的 MCP 工具

| MCP Server | 核心功能 |
|-----------|----------|
| `github` | PR/Issue 管理、仓库操作、文件读写 |
| `google_search` | Google 实时搜索、URL 深入分析 |
| `websearch_exa` | Exa AI 结构化网络搜索 |
| `context7` | 最新开源库文档、代码示例、API 参考 |
| `jam` | Jam 故障报告分析（日志、网络、录屏） |
| `grep_app` | GitHub 全球代码高性能搜索 |
| `chrome-devtools` | 浏览器真机调试、性能分析、截屏 |

---

## 4. 开发规范与约束

### 4.1 核心原则

代码质量:
- **完整可运行**: 包含必要的错误处理和输入验证
- **简洁性**: 语义化命名，仅在必要时添加注释（解释"为什么"）
- **健壮性**: 处理边界情况（null/极值/负数）
- **YAGNI**: 禁止过度工程，保持代码简单

安全第一:
- **禁止 Hardcode**: 严禁提交密钥、密码或敏感凭证
- **注入防护**: 使用参数化查询 (SQL) 和输入清洗 (XSS)
- **环境隔离**: 敏感配置使用 `.env` 环境变量

文件组织:
- **Kebab-case**: 文件名使用小写横杠连接 (e.g., `user-service.ts`)
- **PascalCase**: React 组件和类名 (e.g., `UserProfile.tsx`)
- **模块化**: 保持关注点分离，避免巨石文件

### 4.2 语言标准

- **Frontend**: ES2022+ / TypeScript 5 (Strict Mode)
- **Backend**: Python 3.11+ (Type Hints mandatory)

### 4.3 Git 规范

- **Conventional Commits**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`
- **原子提交**: 每个 commit 只做一件事，保持提交历史整洁

### 4.4 AI 执行协议 (Critical)

- **TODO 优先**: 在执行多步骤任务前，必须先创建并更新 TODO 列表。
- **确认机制**: 重大架构变更或破坏性操作需等待明确授权。
- **语言对齐**: 必须使用与用户提问相同的语言（除非特殊要求）。
- **验证闭环**: 任务完成前必须运行 Linter 和相关测试。

---

## 5. 详细规则文件索引

- **全局规范**: `AGENTS.md` (项目根目录)
- **命令与工作流**: `docs/guides/opencode-workflows.md`
- **Claude 规范**: `~/.claude/CLAUDE.md`
- **Gemini 规范**: `~/.gemini/GEMINI.md`

---

**更新日期**: 2026-02-04

