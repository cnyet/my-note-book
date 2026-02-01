# Design Specifications

存放项目设计相关文档，包括架构设计、数据库设计、API设计、UI/UX规范等。

## 目录结构

```
docs/design/
├── architecture.md      # 系统架构设计
├── database-schema.md   # 数据库设计规范
├── api-design.md        # API设计规范
└── ui-ux-spec.md        # UI/UX设计规范

frontend/
└── design-assets/       # AI Skills 生成的 UI 设计资源
    ├── components/      # 组件设计稿
    ├── pages/           # 页面设计稿
    ├── styles/          # 样式规范（配色、字体、图标）
    └── reference/       # 参考资料
```

> **注意**: 设计资源已移至 `frontend/design-assets/`

## 文档索引

| 文档 | 说明 | 关联 |
|------|------|------|
| [architecture.md](./architecture.md) | 系统架构设计 | 技术栈、分层架构、安全设计 |
| [database-schema.md](./database-schema.md) | 数据库设计规范 | 数据实体、索引策略、缓存策略 |
| [api-design.md](./api-design.md) | API设计规范 | RESTful标准、端点设计、认证授权 |
| [ui-ux-spec.md](./ui-ux-spec.md) | UI/UX设计规范 | 设计理念、设计系统、组件规范、页面布局 |

## 快速导航

- **实施计划**: [../implement/implement-plan.md](../implement/implement-plan.md)
- **MVP计划**: [../../.sisyphus/plans/work-agents-mvp.md](../../.sisyphus/plans/work-agents-mvp.md)
- **需求文档**: [../requirement.md](../requirement.md)
