# Active Context

> 最后更新：2026-03-04T13:15:00Z

## ✅ 本次会话：项目结构清理与文档更新

### 完成的任务

| 任务 | 状态 | 详情 |
|------|------|------|
| 删除多余文件 | ✅ | backend/venv, __pycache__, .ruff_cache, design-templates/ |
| 更新 CLAUDE.md | ✅ | 添加项目级 AI 指令、开发工作流、技能使用表 |
| 更新 README.md | ✅ | Sprint 1-4 进度表、项目结构更新 |
| 更新 frontend/README.md | ✅ | 目录结构、v-ui 组件、页面路由 |
| 更新 backend/README.md | ✅ | 智能体模块、技术栈、移除 alembic 引用 |
| 更新 docs/planning/README.md | ✅ | Sprint 进度表 |
| 更新 docs/development/README.md | ✅ | 技能使用指南 |
| Git 提交 | ✅ | a600a61 chore: clean up project structure and update documentation |

### 删除的文件/目录

- `.agent/workflows/` - openspec 工作流
- `openspec/` - specs, changes archive
- `AGENTS.md`, `SPRINT-3-COMPLETION-REPORT.md`
- `docs/adr/`, `docs/plans/`, `docs/reports/`
- `docs/planning/PRD.md`, `roadmap.md`
- `frontend/design-assets/templates/` - 旧 Lumina 项目
- `backend/venv` - 重复虚拟环境

## Sprint 进度

| Sprint | 状态 | 功能 |
|--------|------|------|
| Sprint 1 | ✅ | 基础架构、核心组件库 |
| Sprint 2 | ✅ | 前端页面开发 |
| Sprint 3 | ✅ | News Agent |
| Sprint 4 | ✅ | AI Assistant Agent |

## 当前任务

- **进行中**: 无
- **阻塞点**: 无
- **下一步**: 等待新任务分配

## 技术栈

- **Frontend**: Next.js 15.5, React 19.1, Tailwind 3.x, Framer Motion
- **Backend**: FastAPI, SQLAlchemy 2.0, Python 3.11+
- **AI**: Ollama, Anthropic, OpenAI (多模型支持)

## 重要配置

- 前端端口：3001
- 后端端口：8001
- API 代理：Next.js rewrite `/api/v1/*` → `http://localhost:8001/api/v1/*`

## 规范文档层级

1. **全局级**: `~/.claude/CLAUDE.md`
2. **项目级**: `./CLAUDE.md`, `.claude/memory/*.md`
3. **设计规范**: `docs/design/*.md`
4. **开发指南**: `docs/development/*.md`
5. **模块级**: `frontend/README.md`, `backend/README.md`