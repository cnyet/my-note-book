# my-note-book 项目指令

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
- **NeonButton** - 霓虹发光按钮
- **ParticleBg** - Canvas 粒子背景
- **OnlinePulse** - 实时状态脉冲

### 卡片设计标准

```tsx
// 标准卡片悬停效果
<motion.div
  whileHover={{ y: -6, scale: 1.02 }}
  className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900"
/>

// 状态徽章
<span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
  Active
</span>

// 渐变按钮
<button className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
```

## 📁 目录结构规范

```
frontend/src/
├── app/                    # 页面路由 (App Router)
│   ├── (public)/          # 公开页面
│   ├── admin/             # 管理后台
│   └── (admin)/assistant/ # AI 助手
├── components/
│   ├── ui/                # Shadcn/UI 基础组件
│   ├── v-ui/              # Genesis 定制组件
│   ├── features/          # 功能组件
│   └── admin/             # 后台专用组件
├── hooks/                  # 自定义 Hooks
└── lib/                    # 工具函数

backend/src/
├── agents/                 # 智能体实现
├── api/                    # API 路由
├── core/                   # 核心配置
├── models/                 # SQLAlchemy 模型
├── schemas/                # Pydantic 模式
├── services/               # 业务服务
└── websocket/              # WebSocket 服务
```

## 🔧 开发工作流

### 必须使用的技能

| 场景 | 技能 | 用途 |
|-----|------|-----|
| 开始任何开发 | `superpowers:brainstorming` | 需求分析与方案设计 |
| UI/UX 开发 | `ui-ux-pro-max:ui-ux-pro-max` | 设计指导与验证 |
| React 代码审查 | `react-best-practices` | 性能优化检查 |
| Bug 修复 | `superpowers:systematic-debugging` | 系统化调试流程 |
| 功能实现 | `superpowers:test-driven-development` | TDD 开发流程 |
| 完成工作 | `superpowers:verification-before-completion` | 验证后提交 |

### 分支命名

```
feature/sprint-N-功能名    # 新功能
fix/问题描述              # Bug 修复
refactor/重构描述         # 重构
```

### 提交规范

```
feat: 新功能描述
fix: 修复问题描述
docs: 文档更新
refactor: 重构描述
style: 代码格式调整
test: 测试相关
```

## ⚡ 常用命令

```bash
# 启动开发环境
./scripts/start-dev.sh

# 或手动启动
cd backend && source .venv/bin/activate && uvicorn src.main:app --reload --port 8001
cd frontend && npm run dev

# 运行测试
./scripts/test.sh

# 代码检查
./scripts/lint.sh

# 清理项目
./scripts/clean.sh
```

## 🚨 常见问题处理

### 端口被占用

```bash
lsof -ti:8001 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Python 包问题

```bash
cd backend
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Node 模块问题

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 AI 行为约束

### 必须遵守

1. **先读后改**: 编辑文件前必须先 Read 文件内容
2. **技能优先**: 符合技能触发条件时必须先调用 Skill
3. **设计对齐**: UI 开发必须参考 `frontend/design-assets/pages/*.md`
4. **组件复用**: 优先使用 v-ui 和 Shadcn/UI 组件
5. **验证后提交**: 代码变更后必须运行测试验证

### 禁止行为

1. ❌ 跳过 brainstorming 直接开发
2. ❌ 创建与 v-ui 功能重复的组件
3. ❌ 忽略 TypeScript 类型错误
4. ❌ 提交未经测试的代码
5. ❌ 修改 `.env` 文件（只读）

## 📚 重要文件索引

| 文件 | 用途 |
|-----|------|
| `docs/design/frontend-guide.md` | 前端设计系统规范 |
| `docs/design/architecture.md` | 系统架构文档 |
| `docs/design/api-design.md` | API 设计规范 |
| `docs/planning/sprint-*.md` | Sprint 规划文档 |
| `.claude/memory/ACTIVE_CONTEXT.md` | 当前开发上下文 |
| `.claude/memory/session-summary.md` | 会话历史摘要 |

---

**最后更新**: 2026-03-04
**维护者**: AI Assistant (Claude)