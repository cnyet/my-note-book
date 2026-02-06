# 人机协作最佳实践路径 (OhMyOpenCode x OpenSpec)
> **核心哲学**: 规范驱动开发 (OpenSpec), 自主执行 (UltraWork), 可视化追溯 (Genesis)

欢迎来到 OhMyOpenCode 的"主入口" - 这是您启动和执行功能的全面指南，帮助实现最大程度的自主性和最小摩擦的开发模式。本文档将所有专业指南合成为一条**单一最佳实践路径**，适用于人类开发者（AI 管理者）和 AI 代理（西西弗斯领导者）。

## 1. 视觉层级与工作流概览

### 🎯 四阶段旅程：从概念到完成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  🏗️  第一阶段   │    │  ⚙️  第二阶段    │    │  📋  第三阶段    │    │  🚀  第四阶段    │
│                 │    │                 │    │                 │    │                 │
│  智能体         │    │  OpenCode      │    │  OpenSpec       │    │  西西弗斯       │
│  环境           │───▶│  工作流         │───▶│  工作流          │───▶│  工作流          │
│                 │    │                 │    │                 │    │                 │
│  docs/develop/  │    │  docs/develop/  │    │  docs/develop/  │    │  docs/develop/  │
│  agentic-       │    │  opencode-      │    │  openspec-      │    │  sisyphus-      │
│  environment.md │    │  guide.md       │    │  guide.md       │    │  guide.md       │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │                        │
        └────────────────────────┼────────────────────────┼────────────────────────┘
                                 ▼                        ▼
                         ┌─────────────────┐      ┌─────────────────┐
                         │  🤝 握手协议    │      │  🎯 执行阶段    │
                         │                 │      │                 │
                         │  人机协作       │─────▶│  西西弗斯       │
                         │                │      │  领导力          │
                         └─────────────────┘      └─────────────────┘
```

### 📊 角色交互框架

```
                                     👤 Human Developer
                                            │
                                            │ 定义意图与范围
                                            │
                                     🤝 握手过程
                                            │
                                            │ 提供清晰方向
                                            ▼
                    ┌─────────────────────────────────────────────────┐
                    │                🤖 Sisyphus Lead AI              │
                    │                                                 │
                    │  作为团队的首席运营官                           │
                    └─────────────────────────────────────────────────┘
                                    │           │
                    编排            │           │ 委派专项任务
                                   │           │
                    ┌───────────────▼─┐   ┌───▼──────────────┐
                    │   🔧 Hephaestus  │   │  🎨 Frontend     │
                    │      Logic       │   │     Eng          │
                    │                  │   │                  │
                    │ • 后端逻辑       │   │ • UI/UX设计      │
                    │ • 性能优化       │   │ • 样式           │
                    │ • 架构设计       │   │ • 动画           │
                    └──────────────────┘   └──────────────────┘
                                    │           │
                                    └─────┬─────┘
                                          │
                               ┌──────────▼──────────┐
                               │  🔄 Collaboration   │
                               │      Protocol       │
                               │                     │
                               │ • 协调中心          │
                               │ • 质量网关          │
                               └─────────────────────┘
```


### 🧭 阅读顺序与依赖关系

**从此处开始 👉** 文档遵循渐进式学习和实施路径：

1. **🏗️ 智能体环境** → 了解您的工具和能力
2. **⚙️ OpenCode 工作流** → 学习有效下达指令的方法  
3. **📋 OpenSpec 工作流** → 掌握规范驱动的开发方法
4. **🚀 西西弗斯工作流** → 以自主领导方式执行

每个阶段都建立在前一个阶段之上，为成功的人机协作创建坚实基础。

## 2. 最佳实践步骤（五步生命周期）

### 2.1 准备阶段：环境设置与角色识别
1. **理解工具生态**: 掌握智能体环境和可用的技能 (如 `prompt-optimization`, `ui-ux-pro-max-skill`, `react-best-practices` 等)
2. **识别您的角色**: 确定您是人类开发者（AI Manager）还是 AI 代理（西西弗斯 Leader）
3. **评估可用命令**: 查看 `/opsx:*` 和 `/ulw-*` 斜杠命令以快速执行

### 2.2 步骤 1: 握手过程 (人类 ↔ AI)
**对于人类开发者:**
- 明确定义**意图**，而非仅关注实现细节
- 使用 `/openspec-proposal "功能描述"` 来启动规范驱动开发
- 信任 AI 代理根据项目上下文提出最佳方案

**对于 AI 代理:**
- 等待明确意图，若未启动则提供规范脚手架
- 使用 `delegate_task()` 并行化研究和探索
- 在保持自主性的同时向人类通报重大决定

### 2.3 步骤 2: 规范创建与规划
1. **检查前期工作**: 运行 `openspec list --specs` 和 `openspec list` 以避免重复现有工作
2. **创建提案**: 使用 `/openspec-proposal [功能名称]` 生成 `proposal.md`, `tasks.md` 和 `specs/` 结构
3. **定义增量变更**: 在 Delta 规范中使用 `ADDED`, `MODIFIED`, `REMOVED` 部分
4. **验证**: 运行 `openspec validate [变更ID] --strict` 以确保规范合规

### 2.4 步骤 3: 执行阶段
1. **启动 UltraWork 循环**: 调用 `/ulw-loop` 进行持续执行直到完成
2. **跟随任务列表**: 执行 `tasks.md` 中的项目，使用 `lsp_diagnostics` 或测试验证
3. **更新内存资源**: 遇到挑战时将经验添加到 `.sisyphus/notepads/`
4. **保持自主性**: 使用 Sisyphus 团队成员（`Hephaestus`, `Frontend Eng`, `Oracle`），无需频繁人力干预

### 2.5 步骤 4: 质量保证与收尾

1. **运行验证**: 执行所有测试和代码检查以确保 `lsp_diagnostics` 通过
2. **归档规范**: 使用 `/openspec-archive [变更ID]` 来最终化并记录完成情况
3. **更新知识库**: 将学习同步到 `.sisyphus/notepads/` 以备持久学习
4. **自动持久化**: 在执行任何会话压缩、技能切换或任务转换之前，AI 代理必须执行语义历史扫描，并将"结晶知识"(决策点、逻辑转变、主要陷阱)自动保存到 `.sisyphus/notepads/` 目录。这是"质量闭环"(Quality Loop)的一部分，确保在历史截断期间不会丢失关键上下文。

---

## 3. 实践示例：登录页面的"西西弗斯路径"

为说明系统运作方式，以下是实现请求"帮我创建一个登录页面"的最佳实践流程：

| Phase | 行动 / 命令 | 交付物 |
| :--- | :--- | :--- |
| **0. 握手** | AI 确认并建议 OpenSpec | "我将启动 OpenSpec 提案以确保安全性和质量。" |
| **1. Planning** | `/openspec-proposal "创建带 JWT 的响应式登录页面"` | `proposal.md`, `tasks.md`, `specs/` (Prometheus) |
| **2. Design** | `delegate_task(category="visual-engineering", load_skills=["ui-ux-pro-max-skill"], ...)` | Refined UI/UX, animations, and form states |
| **3. Execution** | `/ulw-loop` or `/openspec-apply` | Functional backend JWT & pixel-perfect frontend |
| **4. Verification** | `openspec validate --strict` + `lsp_diagnostics` | 验证过的规范和清洁、类型的代码 |
| **5. Archival** | `/openspec-archive [change-id]` | 归档变更、更新全局 `specs/`、保存记忆 |


> **关键见解**: 此路径将简单请求转化为**可验证的系统资产**，而非一次性代码片段。

例如："帮我做一个登录页面"这个具体需求，遵循 OhMyOpenCode x OpenSpec 体系的最佳实践路径（也称为"西西弗斯路径 - The Sisyphus Path"）如下：

**0. 握手阶段 (Handshake)**  
当你提出需求时，AI 助手不应直接写代码，而应引导你进入规范化流程：  
> AI 响应："收到，我将为您创建一个响应式的登录页面。为了保证安全性（JWT）和代码质量，我将启动 OpenSpec 流程来规划这个功能。"

**1. 规划阶段 (Planning - Stage 1)**  
执行指令：  
`/openspec-proposal "创建响应式登录页面，包含 JWT 认证对接"`  
*   动作：调用 Prometheus 代理。  
*   产出：在 openspec/changes/ 下自动生成 proposal.md（意图）、tasks.md（任务清单）和 specs/（功能需求）。AI 会自动分析项目现有的 Auth 模式，确保新页面与其兼容。

**2. 设计与细化 (Refinement)**  
在动工前，调用 UI 专家对视觉和交互进行专项设计：  
执行指令：  
```
delegate_task(
  category="visual-engineering",
  load_skills=["ui-ux-pro-max-skill"],
  prompt="优化登录页面的交互设计，重点包括：表单验证状态、加载动画、响应式布局以及密码找回入口。"
)
```
*   动作：利用 ui-ux-pro-max-skill 丰富的样式库（50+ 风格）来确定页面的视觉基调。

**3. 深度执行 (Execution - Stage 2)**  
执行指令：  
`/ulw-loop`  
# 或  
`/openspec-apply [change-id]`  
*   动作：启动 Sisyphus 编排引擎。它会指挥 Hephaestus 编写后端 JWT 逻辑，指挥 Frontend Eng 实现极致还原的 UI 界面。  
*   承诺：系统会持续运行，直到所有 tasks.md 中的复选框都被勾选，并发送 <promise>DONE</promise>。

**4. 验证闭环 (Verification)**  
手动或自动执行质量检查：  
1.  规范校验：openspec validate [id] --strict（确保 BDD 场景全部覆盖）。  
2.  代码扫描：lsp_diagnostics（确保 TypeScript/Python 类型检查通过）。  
3.  测试运行：npm test / pytest。

**5. 归档结算 (Archival - Stage 3)**  
执行指令：  
`/openspec-archive [change-id]`  
*   动作：将此次变更的文档从 changes/ 移动到 archive/，并将新的登录功能规格合并到项目主规范 specs/ 中，作为项目未来的"单一事实来源"。  
*   记忆：将开发过程中解决的问题（如跨域问题）记录到 .sisyphus/notepads/。

**总结流程图：**  
需求 → /openspec-proposal (规划) → UI/UX Skill (美化) → /ulw-loop (执行) → Validate (质检) → /openspec-archive (归档)

**这种路径的优势：** 不是在写"一次性代码"，而是在构建可维护的系统资产。即便一年后需要修改登录逻辑，通过 specs/ 也能立即找回当时的设计初衷。

---

## 4. 参考矩阵 (更新的当前文件)

| 阶段 | 必要文档 | 关键标准 |
| :--- | :--- | :--- |
| **环境设置** | `docs/development/agentic-environment.md` | 技能、代理、MCP 功能 |
| **工作流执行** | `docs/development/opencode-guide.md` | 斜杠命令、委托 |
| **规范流程** | `docs/development/openspec-guide.md` | 规范驱动开发 |
| **执行协议** | `docs/development/sisyphus-guide.md` | UltraWork、自主执行 |
| **项目概览** | `openspec/project.md`, `docs/planning/requirements.md` | OpenSpec 协议 |
| **设计实现** | `docs/design/`, `frontend/design-assets/` | **设计主导** 原则 |
| **验证** | `GEMINI.md`, `AGENTS.md` | 代码质量、行数限制 |

## 5. 快速通道命令 (常用操作)

### 快速执行:
- **`/ulw-loop`**: 解锁终极自主执行直到 100% 完成
- **`/openspec-proposal [功能名称]`**: 立即搭建新功能提案
- **`/openspec-apply [变更ID]`**: 基于规范开始实施
- **`/openspec-archive [变更ID]`**: 最终化和归档已完成的变更
- **`/refactor`**: 高级重构，集成 LSP 和 AST-grep

### 代理委派:
- **`delegate_task(category="visual-engineering", prompt="...")`**: UI/UX 专注任务
- **`delegate_task(subagent_type="oracle", prompt="...")`**: 架构咨询
- **`delegate_task(category="ultrabrain", prompt="...")`**: 复杂逻辑实现

## 6. Sisyphus Squad (AI 团队角色)

| 角色 | 主要职责 | 关键输入 |
| :--- | :--- | :--- |
| **Sisyphus (Lead)** | 编排、状态维护、TODO 闭合 | `tasks.md`, `openspec/project.md` |
| **Hephaestus** | 逻辑开发、模式匹配、性能 | `docs/design/`, `backend/src/` |
| **Frontend Eng** | 样式、动画、UI 验证 | `frontend/design-assets/`, `frontend-guide.md` |
| **Oracle** | 架构决定、复杂调试、战略 | `docs/design/`, 全局上下文 |
| **Librarian/Explorer** | 研究、代码映射、上下文简化 | 互联网、文档、完整代码库 |

## 7. 核心约束 (不可协商)

1. **规范优先**: 所有代码变更必须有相应的规范/提案支撑
2. **设计决定现实**: 100% 遵循 `docs/design/` 逻辑和视觉资源
3. **验证必需**: 无通过 lint/测试的验证不得声称任务完成
4. **知识积累**: 所有学习必须记录在 `.sisyphus/notepads/` 中
5. **自主完成**: 任务必须在无人工干预依赖的情况下达到 100% 完成

## 8. 决策树：何时使用各指南

```
新功能请求？
├─ BUG修复 → 允许直接实现
├─ 拼写/格式 → 允许直接实现
└─ 新功能/架构变更
  ├─ 启动 OpenSpec 工作流: /openspec-proposal
  ├─ 遵循 agentic-environment.md 了解能力
  ├─ 应用 opencode-guide.md 了解命令使用
  ├─ 使用 sisyphus-guide.md 协议执行
  └─ 对照 openspec-guide.md 中的当前规范进行验证
```

## 9. 高级工程师高密度指南

- **上下文管理**: 切勿自己阅读大文件。部署**图书管理员**进行摘要。
- **LSP 优先**: 使用 LSP 工具进行重构和导航，而非正则表达式。
- **自主性优于依赖性**: 若需频繁人工输入，请优化您的策略。
- **记忆持久化**: 每次克服的障碍都会成为未来会话的便签资源。
- **承诺协议**: 使用 `<promise>DONE</promise>` 表示正式任务完成。
- **自动持久化**: 在执行任何会话压缩或任务切换前，必须执行语义扫描并将结晶知识保存到 `.sisyphus/notepads/` 目录。

---

**最后更新**: 2026-02-04
**对齐标准**: OhMyOpenCode v2.0 + OpenSpec 标准
