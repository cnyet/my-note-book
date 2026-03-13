# My-Note-Book 项目文档

My-Note-Book 是一个面向极客社区的现代化 AI 多智能体编排平台，支持智能体间协作与通信、实时状态同步和统一身份认证。

## 📁 新文档结构

```
docs/
├── README.md                    # 本文档 - 文档入口
│
├── design/                      # 🎨 设计文档
│   ├── architecture.md         # 系统架构设计
│   ├── api-design.md           # API 接口规范
│   ├── database-schema.md      # 数据库设计
│   └── frontend-guide.md       # 前端 UI/UX 设计规范
│
├── development/                 # 🛠️ 开发指南
│   ├── README.md               # 开发流程概览
│   ├── agentic-environment.md  # 智能体环境配置
│   ├── opencode-guide.md       # OpenCode 实践指南
│   ├── openspec-guide.md       # OpenSpec 工作流
│   └── sisyphus-guide.md       # Sisyphus 工作流
│
└── planning/                    # 📋 项目规划
    ├── README.md               # 项目愿景
    ├── requirements.md         # 产品需求文档
    └── roadmap.md              # 项目路线图
```

## 🚀 快速导航

### 新手上路

1. **[项目根 README](../README.md)** - 快速开始与环境搭建
2. **[development/README.md](development/README.md)** - 开发流程指南

### 了解系统设计

3. **[design/architecture.md](design/architecture.md)** - 系统架构全貌
4. **[design/api-design.md](design/api-design.md)** - API 设计规范
5. **[design/database-schema.md](design/database-schema.md)** - 数据模型设计
6. **[design/frontend-guide.md](design/frontend-guide.md)** - 界面设计规范

### 开始开发

7. **[development/README.md](development/README.md)** - 开发流程指南
8. **[development/openspec-guide.md](development/openspec-guide.md)** - OpenSpec 规范驱动开发

### 了解项目规划

9. **[planning/requirements.md](planning/requirements.md)** - 产品需求
10. **[planning/roadmap.md](planning/roadmap.md)** - 开发路线图

## 📚 核心文档速览

| 文档                                                           | 内容                       | 适合人群         |
| -------------------------------------------------------------- | -------------------------- | ---------------- |
| [design/architecture.md](design/architecture.md)               | 系统架构、技术栈、数据流   | 架构师、后端开发 |
| [design/api-design.md](design/api-design.md)                   | RESTful API 规范、认证机制 | 前后端开发       |
| [planning/requirements.md](planning/requirements.md)           | 功能需求、用户故事         | 产品经理、开发者 |
| [development/openspec-guide.md](development/openspec-guide.md) | 规范驱动开发流程           | 所有开发者       |

## 🔄 与 OpenSpec 的关系

本项目使用 **OpenSpec 规范驱动开发**：

- **openspec/** 目录 - 存放核心规范和变更提案
- **docs/** 目录 - 存放设计文档和开发指南

**协作流程**:

1. `planning/requirements.md` 定义 **WHAT** (需求)
2. `openspec/specs/` 定义 **HOW** (规范) - 单一致真源
3. `docs/design/` 提供 **CONTEXT** (设计上下文)
4. `docs/development/` 指导 **IMPLEMENTATION** (实现)

## 📝 文档贡献指南

### 添加新文档

1. 根据内容选择合适的目录
2. 使用 kebab-case 命名文件
3. 在本文档中添加导航链接
4. 更新目录结构说明

### 文档更新原则

- **设计变更** → 同步更新 `design/` 和 `openspec/`
- **流程变更** → 更新 `development/`
- **需求变更** → 更新 `planning/`

---

**最后更新**: 2026年2月6日
