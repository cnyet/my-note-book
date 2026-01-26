# Antigravity (Sisyphus) 代理与工具指南

本手册详细介绍了 Antigravity (Sisyphus) 在本项目中可调用的各类代理、技能及 MCP 工具，旨在帮助开发者更高效地利用这些资源。

## 🤖 专门代理 (Specialized Agents)

这些代理通过 `Task` 或 `call_omo_agent` 工具调用，适用于需要深度分析或多步执行的任务。

| 代理名称 | 类型 | 主要职责 |
| :--- | :--- | :--- |
| **explore** | 研究/搜索 | Contextual grep。查找代码模式、结构、依赖关系及特定实现。 |
| **librarian** | 参考/文档 | 外部知识专家。查阅官方文档、开源库实现、最佳实践及 OSS 示例。 |
| **oracle** | 架构/决策 | 高级技术顾问。负责架构评审、复杂问题排查、代码重构决策及性能优化建议。 |
| **frontend-ui-ux-engineer** | 前端开发 | UI/UX 专家。处理样式 (CSS/Tailwind)、布局、动画及响应式设计等视觉任务。 |
| **document-writer** | 文档编写 | 编写 README、API 文档、系统架构指南及用户手册。 |
| **multimodal-looker** | 媒体分析 | 分析图片、PDF、流程图等媒体文件，提取结构化信息。 |
| **build / plan / general** | 通用/构建 | 执行基础构建命令、任务规划及通用逻辑处理。 |

## 🛠️ 技能 (Skills)

技能是预定义的高级工作流，可通过 `skill` 工具或斜杠命令触发。

*   **Playwright (`/playwright`)**: 提供浏览器自动化能力。用于网页抓取、端到端测试、自动化验证及截取快照。
*   **Conversation Accuracy (`/conversation-accuracy-skill`)**: 优化长对话体验。通过四层内存架构管理上下文，确保复杂任务中的意图准确性。

## 📝 OpenSpec 工作流

专用于管理项目变更、规格说明和任务同步的指令集。

*   **`/openspec-proposal`**: 发起新功能的架构提案与验证。
*   **`/openspec-apply`**: 将已批准的提案应用到代码库，并保持任务同步。
*   **`/openspec-archive`**: 完成并归档已部署的变更。

## ⚙️ 核心工具能力 (MCP & Tools)

直接可调用的底层原子工具。

### 浏览器与网页
*   `chrome-devtools_*`: 全套浏览器控制工具（点击、表单填充、性能分析、截图等）。
*   `websearch_web_search_exa`: 基于 Exa AI 的实时全网搜索。
*   `fetch_fetch`: 抓取网页内容并转换为 Markdown。

### 开发者辅助
*   `lsp_*`: 利用 Language Server Protocol 进行代码诊断、符号跳转、重命名及快速修复。
*   `ast_grep_*`: 基于抽象语法树 (AST) 的语义级代码搜索与批量重写。
*   `grep_app_searchGitHub`: 在 GitHub 公共代码库中检索真实的生产级代码示例。
*   `context7_*`: 精准查询特定库/框架的最新文档。

## 💡 使用建议

1.  **优先使用技能**: 如果任务匹配 `playwright` 或 `conversation-accuracy`，应优先通过 `skill` 调用。
2.  **并行执行**: 搜索和调研类任务（如 `explore` 和 `librarian`）建议作为后台任务并行启动，以节省等待时间。
3.  **咨询 Oracle**: 在涉及重大架构调整或连续修复失败时，务必先咨询 `oracle` 的意见。
4.  **UI 委派**: 视觉类的前端修改（如修改配色或边距）应委派给 `frontend-ui-ux-engineer`。

---
*分类：开发手册*
*更新日期：2026-01-23*
