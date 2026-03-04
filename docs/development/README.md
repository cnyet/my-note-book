# 开发指南

本目录包含项目开发相关的工作流指南和技术文档。

## 📁 文档索引

| 文档 | 用途 |
|------|------|
| [agentic-environment.md](agentic-environment.md) | AI 智能体环境配置 |
| [opencode-guide.md](opencode-guide.md) | OpenCode 工作流指南 |
| [openspec-guide.md](openspec-guide.md) | OpenSpec 规范驱动开发 |
| [sisyphus-guide.md](sisyphus-guide.md) | Sisyphus 自主执行协议 |

## 🎯 AI 开发工作流

### 必须使用的技能

| 场景 | 技能 | 触发方式 |
|------|------|---------|
| 开始开发 | `superpowers:brainstorming` | 功能开发前必须调用 |
| UI/UX 开发 | `ui-ux-pro-max:ui-ux-pro-max` | UI 相关任务 |
| Bug 修复 | `superpowers:systematic-debugging` | 遇到 Bug 时 |
| React 代码 | `react-best-practices` | React/Next.js 代码审查 |
| 功能实现 | `superpowers:test-driven-development` | TDD 开发流程 |
| 完成验证 | `superpowers:verification-before-completion` | 提交前验证 |

### 核心约束

1. **技能优先**: 符合技能触发条件时必须先调用 Skill
2. **设计对齐**: UI 开发必须参考 `frontend/design-assets/pages/*.md`
3. **验证后提交**: 代码变更后必须运行测试验证
4. **先读后改**: 编辑文件前必须先 Read 文件内容

## 📚 相关资源

- [设计文档](../design/) - 系统架构、API、数据库设计
- [规划文档](../planning/) - Sprint 规划
- [项目指令](../../CLAUDE.md) - 项目级开发规范

---

**最后更新**: 2026年3月4日