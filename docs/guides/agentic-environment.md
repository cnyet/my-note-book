# 开发环境全面分析报告

**分析时间**: 2026-01-31
**分析范围**: Skills、Agents、MCP、开发规范与约束

---

## 1. 可用的 Skills

### 1.1 核心用户级 Skill

**conversation-accuracy-skill** (必须掌握)
- 位置: ~/.claude/skills/conversation-accuracy-skill/
- 功能: 四层记忆架构优化长对话准确性
- 触发条件: 对话超过10轮，或用户提及"之前说过"、"总结"等关键词

四层记忆架构:
1. 短期滑动窗口 - 当前对话上下文
2. 中期摘要 - 对话要点总结
3. 长期语义检索 - 历史信息语义索引
4. 系统编排 - 协调各层记忆

### 1.2 OpenCode 内置 Skills

| Skill | 用途 | 触发场景 |
|-------|------|---------|---------|
| `playwright` | 浏览器自动化 | 任何浏览器相关任务 |
| `frontend-ui-ux` | 前端UI/UX设计开发 | 界面开发、样式、动画 |
| `git-master` | Git 操作 | commit、rebase、squash、blame、bisect |
| `dev-browser` | 浏览器自动化（持久状态） | 导航网站、填写表单、截图、数据抓取 |
| `conversation-accuracy-skill` | 长对话记忆优化 | 对话超过10轮或用户要求总结 |

### 1.3 市场级 Skills (18个可用)

文档处理类:
- `pdf` - PDF创建、编辑、表单填写
- `docx` - Word文档创建、编辑
- `pptx` - PowerPoint演示文稿
- `xlsx` - Excel电子表格
- `doc-coauthoring` - 协作文档编写

设计与创意类:
- `algorithmic-art` - p5.js生成艺术
- `brand-guidelines` - 品牌标准应用
- `theme-factory` - 主题创建
- `canvas-design` - Canvas设计
- `frontend-design` - 前端UI/UX设计

开发与集成类:
- `skill-creator` - 创建新技能
- `mcp-builder` - 构建MCP服务器
- `web-artifacts-builder` - Web应用创建
- `webapp-testing` - Web应用测试

沟通类:
- `internal-comms` - 内部沟通文档
- `slack-gif-creator` - Slack动画GIF

### 1.4 Skill 调用示例

```typescript
delegate_task(
  category="visual-engineering",
  load_skills=["playwright", "frontend-ui-ux"],
  prompt="Create a new React component with browser testing..."
)

delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="Create a commit with proper conventional format"
)
```

---

## 2. 可用的 Agents 和命令

### 2.1 Agent 调用方式

使用 `delegate_task()` 函数委派任务：

```typescript
delegate_task(
  category="[category]",      // 任务类型（对应 Sisyphus-Junior）
  subagent_type="[agent]",     // 专用 Agent
  load_skills=["skill-1"],     // 技能列表
  run_in_background=false,     // 是否后台运行
  prompt="..."
)
```

**重要**: `category` 和 `subagent_type` 是互斥的，不能同时使用。

### 2.2 可用的 Category（任务类型）

| Category | 用途 | 最佳场景 |
|----------|------|---------|---------|
| `visual-engineering` | 前端/UI/UX | 界面开发、动画、样式、设计 |
| `ultrabrain` | 深度推理 | 复杂架构决策、逻辑分析（仅用于真正困难的任务） |
| `deep` | 自主问题解决 | 目标导向的深度研究、彻底理解问题后行动 |
| `artistry` | 创意任务 | 复杂问题解决、非常规创新方法 |
| `quick` | 简单任务 | 简单修改、单文件更改、拼写修复 |
| `unspecified-low` | 低复杂度 | 不适合其他类别的工作，低难度 |
| `unspecified-high` | 高复杂度 | 不适合其他类别的工作，高难度 |
| `writing` | 写作 | 文档、说明、注释、技术写作 |

### 2.3 可用的 Subagent（专用 Agent）

| Agent | 用途 | 核心能力 |
|-------|------|---------|-------|
| `oracle` | 咨询代理 | 只读咨询、架构决策、技术咨询 |
| `librarian` | 文档代理 | 多仓库分析、远程代码库搜索、官方文档检索、示例查找 |
| `explore` | 探索代理 | 代码库搜索、上下文分析、grep 搜索 |
| `multimodal-looker` | 媒体分析 | PDF/图片/图表解读、需要解释的视觉内容 |
| `prometheus` | 规划代理 | 战略规划、需求分析、工作计划创建 |
| `momus` | 审核代理 | 计划审核、质量验证、一致性检查 |
| `metis` | 风险评估 | 识别漏洞、风险评估、问题发现 |
| `sisyphus-junior` | 执行代理 | 专注任务执行（通过 category 调用） |

### 2.4 可用的 Slash 命令

| Command | 用途 | 说明 |
|---------|------|------|
| `/init-deep` | 初始化知识库 | Initialize hierarchical AGENTS.md knowledge base (builtin) |
| `/ralph-loop` | 自引用开发循环 | Start self-referential development loop until completion (builtin) |
| `/ulw-loop` | UltraWork 循环 | Start ultrawork loop - continues until completion with ultrawork mode (builtin) |
| `/cancel-ralph` | 取消 Ralph 循环 | Cancel active Ralph Loop (builtin) |
| `/refactor` | 智能重构 | Intelligent refactoring command with LSP, AST-grep, architecture analysis, codemap, and TDD verification (builtin) |
| `/start-work` | 启动 Sisyphus 工作 | Start Sisyphus work session from Prometheus plan (builtin) |
| `/openspec-proposal` | OpenSpec 提案 | Scaffold a new OpenSpec change and validate strictly (opencode-project) |
| `/openspec-apply` | OpenSpec 实施 | Implement an approved OpenSpec change and keep tasks in sync (opencode-project) |
| `/openspec-archive` | OpenSpec 归档 | Archive a deployed OpenSpec change and update specs (opencode-project) |
| `/playwright` | 浏览器自动化 | MUST USE for any browser-related tasks. Browser automation via Playwright MCP - verification, browsing, information gathering, web scraping, testing, screenshots, and all browser interactions (builtin) |
| `/frontend-ui-ux` | 前端UI/UX设计 | Designer-turned-developer who crafts stunning UI/UX even without design mockups (builtin) |
| `/git-master` | Git 操作 | MUST USE for ANY git operations. Atomic commits, rebase/squash, history search (blame, bisect, log -S). STRONGLY RECOMMENDED: Use with delegate_task(category='quick', load_skills=['git-master'], ...) to save context. Triggers: 'commit', 'rebase', 'squash', 'who wrote', 'when was X added', 'find the commit that' (builtin) |
| `/dev-browser` | 浏览器自动化 | Browser automation with persistent page state. Use when users ask to navigate websites, fill forms, take screenshots, extract web data, test web apps, or automate browser workflows. Trigger phrases include 'go to [url]', 'click on', 'fill out the form', 'take a screenshot', 'scrape', 'automate', 'test the website', 'log into', or any browser interaction request (builtin) |
| `/conversation-accuracy-skill` | 对话精度优化 | Optimize long-form conversation accuracy using a four-layer memory architecture and dynamic context pruning (user) |

### 2.5 OpenSpec CLI 命令

```bash
# 初始化和更新
openspec init [options] [path]    # 初始化 OpenSpec 项目
openspec update [path]            # 更新 OpenSpec 指令文件

# 查看和列表
openspec list [options]           # 列出项目 (默认为变更). 使用 --specs 列出规格
openspec view                     # 显示交互式仪表板
openspec show [options] [item-name] # 显示变更或规格

# 变更管理
openspec change show [options] [change-name]      # 显示变更提案详情
openspec change validate [options] [change-name]  # 验证变更提案
openspec change list [options]                    # 列出变更（已弃用，改用 openspec list）

# 规格管理
openspec spec show [options] [spec-id]       # 显示指定规格
openspec spec list [options]                 # 列出所有可用规格
openspec spec validate [options] [spec-id]   # 验证规格结构

# 验证和归档
openspec validate [options] [item-name]    # 验证变更和规格
openspec archive [options] [change-name]   # 归档已完成的变更并更新主规格

# 配置和其他功能
openspec config [options]                    # 查看和修改全局 OpenSpec 配置
openspec completion                        # 管理 OpenSpec CLI 的 Shell 补全
openspec status [options]                  # [实验性] 显示变更的状态
openspec instructions [options] [artifact] # [实验性] 输出创建工件的增强指令
openspec templates [options]               # [实验性] 显示所有工件模板路径
openspec schemas [options]                 # [实验性] 列出可用的工作流模式
openspec new                             # [实验性] 创建新项目
openspec artifact-experimental-setup       # [实验性] 为实验性工件工作流设置 Agent 技能
```

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
- 前端: Next.js 15.4, React 19, TypeScript 5+
- 后端: FastAPI, Python 3.11+, SQLAlchemy
- 数据库: SQLite
- 无 MCP 集成

### 3.2 可用的 MCP 工具

| MCP Server | 工具/资源/提示 | 用途 |
|-----------|---------------|------|
| github | 多种工具 | GitHub 操作（PR、Issue、Branch 等） |
| fetch_fetch | 工具 | 互联网内容获取 |
| google_search | 工具 | Google 搜索和 URL 分析 |
| websearch | 工具 | Exa AI 网络搜索 |
| codesearch | 工具 | Exa Code API 代码搜索 |
| chrome-devtools | 多种工具 | Chrome DevTools 浏览器自动化 |
| skill_mcp | 工具 | MCP 服务器操作 |

如果需要添加自定义 MCP 支持，可以使用 `mcp-builder` skill。

---

## 4. 开发规范与约束

### 4.1 核心原则

代码质量:
- 完整可运行 + 错误处理 + 输入验证
- 语义化命名，简洁注释 (解释"为什么")
- 处理边界情况 (null/零/负数/极值)
- 禁止过度工程，保持简单

安全第一:
- 禁止提交密钥/密码到版本控制
- 参数化查询防SQL注入
- 输入验证防XSS
- HTTPS + 环境变量 + 双端验证
- OWASP Top 10 + 安全会话管理

文件组织:
- 特性驱动/领域驱动组织
- kebab-case 文件名
- PascalCase 组件/类
- 关注点分离

### 4.2 语言标准

- 目标: ES2022+/TypeScript 5+
- 模块系统: ES Modules
- 严格模式: TypeScript strict: true
- 推荐特性: 空值合并、可选链、顶层await

### 4.3 命名约定

- 变量/函数: camelCase (userName, isActive)
- 类/接口: PascalCase (UserController)
- 常量: UPPER_SNAKE_CASE (MAX_RETRY)
- 文件名: kebab-case (user-service.ts)
- 组件文件: PascalCase (UserProfile.tsx)

### 4.4 Git规范

- Conventional Commits: feat/fix/docs/refactor/perf/test/ci/build
- 分支策略: main, feature/*, hotfix/*, release/*
- 原子提交 + 清晰分支名

### 4.5 测试策略

- 测试金字塔: 更多单元测试，较少E2E
- 独立测试 + Mock外部依赖

### 4.6 AI Agent 执行协议

AI agents **必须** 遵守执行确认规则：
- 在开始任何计划执行前，等待明确的 "确认/开始" 指令
- 不得在没有明确授权的情况下自行启动任何计划
- 计划执行前必须收到人类操作员或上级系统的明确启动命令

---


## 5. 详细规则文件索引

位置: ~/.claude/rules/

| 文件 | 优先级 | 内容 |
|------|-------|------|
| conversation-accuracy.md | 必读 | AI会话治理与记忆管理 |
| frontend.md | 建议 | JS/TS/React/Vue/CSS/TailwindCSS |
| backend.md | 建议 | Node.js/Python/Go/Java/Rust |
| api.md | 建议 | REST/GraphQL/gRPC/WebSocket |
| database.md | 建议 | SQL/NoSQL/ORM最佳实践 |
| devops.md | 建议 | Docker/K8s/CI/CD/云平台 |

---

## 6. 项目结构约定

```
work-agents/
├── backend/              # FastAPI 后端
│   ├── src/
│   │   ├── api/          # API 路由
│   │   ├── models/       # 数据库模型
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # 业务逻辑
│   │   └── main.py       # 应用入口
│   ├── tests/            # 后端测试
│   ├── .env.example      # 环境变量示例
│   └── requirements.txt  # Python 依赖
├── frontend/             # Next.js 前端
│   ├── src/
│   │   ├── app/          # App Router 页面
│   │   ├── components/   # React 组件
│   │   ├── lib/          # 工具函数
│   │   └── styles/       # 样式文件
│   ├── public/           # 静态资源
│   └── package.json      # Node 依赖
├── scripts/              # 项目脚本
├── docs/                 # 项目文档
│   ├── implement/        # 实施计划
│   ├── design/           # 设计规范
│   └── guides/           # 开发指南
├── .sisyphus/
│   ├── plans/            # 工作计划
│   ├── notepads/         # 运行时笔记
│   └── drafts/           # 草稿文件
└── logs/                 # 运行日志
```

---

## 7. 快速参考

### 启动开发
```bash
./scripts/start-dev.sh
# 前端: http://localhost:3000
# 后端: http://localhost:8000/docs
```

### 常用命令
```bash
./scripts/setup.sh      # 环境初始化
./scripts/lint.sh       # 代码检查
./scripts/test.sh       # 运行测试
./scripts/build.sh      # 构建生产版本
./scripts/clean.sh      # 清理项目
```

### 寻求帮助
- `/oracle` - 技术咨询
- `/prometheus` - 规划咨询
- `/librarian` - 文档查找
- `AGENTS.md` - 项目编码指南
- `docs/guides/` - 开发指南目录

---

**更新日期**: 2026-01-31
