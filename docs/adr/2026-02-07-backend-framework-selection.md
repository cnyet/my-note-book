# ADR-001: 后端框架选择决策

**日期**: 2026-02-07
**状态**: 已采纳
**决策者**: 架构师

---

## 背景

在准备MVP开发时，发现PRD-02.md指定使用 **Node.js/Express**，而 architecture.md 设计为 **FastAPI (Python)**。这造成了技术栈冲突，需要做出明确决策。

## 考虑的选项

### 选项A: Node.js/Express (TypeScript)
- **优点**: JavaScript全栈，PRD原始意图
- **缺点**: 需要重写完整的Architecture文档；AI生态适配成本高

### 选项B: FastAPI (Python 3.11+)
- **优点**: Architecture文档已完整；Python AI生态成熟；Pydantic原生类型验证
- **缺点**: 与PRD原始描述不一致

## 决策

**采用选项B: FastAPI (Python 3.11+)**

## 理由

1. **文档成本**: Architecture文档包含完整的目录结构、依赖注入设计、安全方案，重写成本>3天
2. **AI集成**: 5个智能体都依赖Ollama，Python的LangChain/Ollama集成更成熟
3. **类型安全**: Pydantic v2提供声明式验证，比Express+Joi更简洁
4. **性能**: FastAPI原生异步，性能不弱于Express

## 影响

### 需要更新的文档
- ✅ PRD-02.md 第246-257行 (技术栈表格)
- ✅ roadmap-02.md 第15行 (技术栈描述)
- ✅ roadmap-02.md 第54行 (状态管理)
- ✅ roadmap-02.md 第89-91行 (定时任务)

### 新增文档
- ✅ `database-schema-supplement.md` - 补充9张数据表
- ✅ `api-design-supplement.md` - 补充智能体业务API

## 相关决策

- **状态管理**: 由Redux改为Zustand (更轻量，适合个人项目)
- **定时任务**: 由node-schedule改为APScheduler (Python生态)
- **组件库命名**: 统一为 `v-ui`

---

**批准**: 架构师 ✅
