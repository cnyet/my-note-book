# Active Context

> 最后更新：2026-02-27T05:00:00Z

## 当前项目状态

| 维度 | 状态 |
|------|------|
| 分支 | main (与远程同步) |
| 后端 | SystemSettings + APIToken 数据持久化完成 |
| 前端 | 6 个管理页面已实现 + React Query 集成 |
| OpenSpec | 3 个变更提案已归档 |

## 最近提交

```
05e8940 chore(openspec): Archive completed impl-frontend-pages proposal
0687882 chore: Remove unused local skill files
bb2c104 docs: Simplify AGENTS.md and OpenSpec documentation
bf9a0d5 feat(backend): Replace mock data with database persistence
```

## 待办事项

- [ ] 下一步开发计划待定（Agent 编排/管理后台完善/认证安全）

## 技术栈

- Frontend: Next.js 15.5, React 19, TypeScript 5, TailwindCSS 3.x, React Query
- Backend: FastAPI (Python 3.11+), SQLAlchemy 2.0, Pydantic v2
- Database: SQLite (开发) → PostgreSQL (生产)
