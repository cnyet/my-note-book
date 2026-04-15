# 工程规范

> AI 助手必须遵循的项目级指令，确保开发一致性和代码质量。

## 🎯 项目概述

**my-note-book** 是一个现代 AI 多智能体编排平台，采用前后端分离架构：

- **前端**: Next.js 15.5 + React 19.1 + Tailwind CSS 3.x
- **后端**: FastAPI + SQLAlchemy 2.0 + Python 3.11+

当前开发阶段: **Active Development** (Sprint 1-4 已完成)

## 🏗️ 核心架构

```
前端 (localhost:3001) ──API──→ 后端 (localhost:8001)
    │                              │
    ├── /api/v1/* ──────────rewrite────────→ FastAPI
    ├── App Router                  ├── agents/ (智能体模块)
    ├── components/v-ui/            ├── api/ (REST 端点)
    └── design-assets/              └── websocket/
```

**重要端口配置**:

- 前端开发: 3001
- 后端 API: 8001
- API 代理: `/api/v1/*` → `http://localhost:8001/api/v1/*`

## 🎨 UI/UX 设计规范

### Genesis Design System

项目采用 **Genesis Design System** (极客赛博/未来主义简约风格)：

| 特征 | 实现方式 |
|-----|---------|
| 深邃底色 | Abyss Black / Void 高对比度暗色 |
| 霓虹导视 | 电光青 + 霓虹紫 |
| 玻璃态 | `bg-surface/70`, `backdrop-blur-xl`, `border-white/10` |
| 物理动效 | Framer Motion 弹簧动画 |
| 故障美学 | GlitchText 组件 |

### v-ui 组件库 (优先使用)

位于 `frontend/src/components/v-ui/`:
- **GlassCard** - 磨砂玻璃卡片
- **GlitchText** - 故障文字动效
- **GradientText** - 渐变文字
- **NeonButton** - 霓虹发光按钮
- **ParticleBg** - Canvas 粒子背景
- **OnlinePulse** - 实时状态脉冲

详细设计令牌、组件示例和视觉规范统一参考 `docs/design/frontend-guide.md`。

## 🔧 开发工作流

除本文件明确声明的项目特有约束外，通用规范默认遵循 `~/.claude/CLAUDE.md`。

### 标准工作流
`superpowers:brainstorming` (设计) $\rightarrow$ **`docs/plans/implementation_plan.md` (具体计划)** $\rightarrow$ `superpowers:test-driven-development` (实现) $\rightarrow$ `superpowers:verification-before-completion` (提交)。

**强制要求**：凡涉及 $\ge 3$ 个文件或核心逻辑变更的任务，必须在 `docs/plans/` 下创建具体实现计划。在 `verification` 阶段必须对照 Plan 完成项，禁止脱离计划的随意实现。

### 关键技能触发
- **UI/UX**: 使用 `ui-ux-pro-max:ui-ux-pro-max` 指导设计，`frontend-design` 实现界面。
- **质量保证**: 审查 React 代码使用 `react-best-practices`，Bug 修复使用 `superpowers:systematic-debugging`。

### 分支与提交
- **分支**: `feature/sprint-N-功能名`, `fix/问题描述`, `refactor/重构描述`。
- **提交**: 遵循 Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `style`, `test`)。

运行命令与环境初始化参考 `README.md` 与 `docs/development/README.md`。

## 📝 AI 行为约束

### 配置优先级
`CLAUDE.local.md` $\rightarrow$ `CLAUDE.md` $\rightarrow$ 全局 `~/.claude/CLAUDE.md`。

### 核心原则
1. **先读后改，验证提交**：编辑前必须 Read，提交前必须通过测试验证。
2. **设计对齐与复用**：UI 开发参考 `frontend/design-assets/`，优先复用 `v-ui` 和 Shadcn/UI。
3. **智能体对齐**：涉及智能体功能开发、接口调用或 Prompt 优化时，必须首先读取 `AGENTS.md`。
4. **显式约束引用 (Anti-Drift)**：在实现 UI 或 Agent 逻辑时，必须在响应中**明确引用**所依据的 `DESIGN.md` 或 `AGENTS.md` 具体条款（例如：“应用 DESIGN.md §3.6 的玻璃态效果”），严禁凭感觉实现。
5. **严禁跳过流程**：禁止跳过 brainstorming 直接开发或忽略 TS 类型错误。
6. **环境安全**：`.env` 文件为只读，禁止修改。

## 📚 重要文件索引

| 文件 | 用途 |
|-----|------|
| `docs/design/frontend-guide.md` | 前端设计系统规范 |
| `docs/design/architecture.md` | 系统架构文档 |
| `docs/design/api-design.md` | API 设计规范 |
| `docs/design/database-schema.md` | 数据库模式定义 |

---

**最后更新**: 2026-03-04
**维护者**: AI Assistant (Claude)
