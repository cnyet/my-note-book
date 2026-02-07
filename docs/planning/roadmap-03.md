# 项目路线图 (Roadmap) - Work Agents v1.0 MVP

> **版本**: v1.0
> **基准**: PRD-03.md
> **状态**: 待启动
> **预计周期**: 6 周 (Week 1 - Week 6)

## 🎯 总体目标

构建一个高度集成、自动化、美观的个人智能化工作台，实现信息聚合、任务管理、生活记录与自我复盘闭环。

---

## 📅 Week 1: 基础设施与骨架搭建 (Infrastructure)

### 目标：跑通前后端最小化闭环，确立代码规范与数据库设计。

- [ ] **项目初始化**
  - [ ] 初始化 `backend` (FastAPI + Pydantic + APScheduler)。
  - [ ] 初始化 `frontend` (Next.js + Shadcn/ui + TailwindCSS)。
  - [ ] 配置 Docker Compose (Backend, Frontend, LobeChat)。
  - [ ] 设立 `make dev` / `npm run dev` 统一启动命令。

- [ ] **数据库设计与ORM**
  - [ ] 设计 SQLite 表结构 (`users`, `agents`, `tasks`, `life_metrics`, `news`, `reviews`)。
  - [ ] 实现 `Life Agent` 数据字段级加密 (AES/Fernet) 工具类。
  - [ ] 编写 Alembic 迁移脚本。

- [ ] **基础模块实现**
  - [ ] 用户认证 (JWT, Simple Login, Single User Mode)。
  - [ ] 通用响应格式封装 (Response Model)。
  - [ ] 全局异常处理与日志记录 (Loguru)。

---

## 📅 Week 2: 核心智能体开发 (Core Agents)

### 目标：实现 News Agent (爬虫) 和 Task Agent (任务管理)，跑通每日核心数据流。

- [ ] **News Agent (资讯助理)**
  - [ ] 实现爬虫模块 (Requests + BeautifulSoup/Playwright)。
  - [ ] 对接 Google News / Hacker News API。
  - [ ] 实现 APScheduler 定时任务 (每日 8:00)。
  - [ ] 实现 LLM 摘要生成 (调用 OpenAI/DeepSeek API)。
  - [ ] 失败重试与备用源切换逻辑。

- [ ] **Task Agent (任务助理)**
  - [ ] 设计问答表单 Schema (Formly / React Hook Form)。
  - [ ] 实现任务生成逻辑 (LLM Prompt Engineering)。
  - [ ] 实现任务 CRUD 接口 (增删改查, 状态流转)。
  - [ ] 前端任务列表组件开发。

---

## 📅 Week 3: LobeChat 集成与 Review Agent

### 目标：嵌入 LobeChat，实现复盘逻辑，完成“早-中-晚”闭环。

- [ ] **LobeChat 集成**
  - [ ] 部署 LobeChat Docker 镜像。
  - [ ] 前端实现 Iframe 嵌入组件，处理跨域与样式隔离。
  - [ ] 验证 LobeChat 独立对话功能与持久化存储。

- [ ] **Review Agent (复盘助理)**
  - [ ] 实现数据聚合接口 (Fetch Daily Summary from News/Task/Life)。
  - [ ] 编写 Prompt 生成复盘报告。
  - [ ] 实现用户偏好提取与更新逻辑 (`User Profile` Update)。
  - [ ] 前端复盘报告展示页面。

---

## 📅 Week 4: 扩展智能体与功能 (Extension Agents)

### 目标：实现 Life Agent (健康) 和 Outfit Agent (穿搭)，丰富产品维度。

- [ ] **Life Agent (生活助理)**
  - [ ] 实现健康数据录入表单。
  - [ ] 实现后端加密存储与解密读取。
  - [ ] 对接 LLM 生成饮食/运动建议。
  - [ ] 前端健康趋势图表 (Recharts/Chart.js)。

- [ ] **Outfit Agent (穿搭助理)**
  - [ ] 对接公共天气 API (OpenWeatherMap etc.)。
  - [ ] 编写 Prompt 生成穿搭建议文本。
  - [ ] (可选/MVP) 对接绘图 API 生成穿搭图片并保存本地。
  - [ ] 前端穿搭卡片展示。

---

## 📅 Week 5: UI/UX 完善与 Dashboard

### 目标：提升视觉体验，整合 Dashboard，完成 Blog/Tools 模块。

- [ ] **Dashboard (仪表盘)**
  - [ ] 聚合展示各 Agent 关键指标 (任务进度, 健康分, News摘要)。
  - [ ] 实现响应式布局 (Grid -> Stack)。
  - [ ] 添加骨架屏 (Skeleton) 与加载动画。

- [ ] **内容管理 (CMS)**
  - [ ] **Blog**: Markdown 渲染, 列表/详情页, 简单的文件系统CMS。
  - [ ] **Tools/Labs**: 静态配置化展示页 (JSON Config -> UI)。

- [ ] **全局优化**
  - [ ] 统一配色与主题 (Dark/Light Mode 切换)。
  - [ ] 移动端适配调整 (Mobile First Review)。

---

## 📅 Week 6: 测试、部署与交付 (Release)

### 目标：全链路测试，编写文档，最终部署交付。

- [ ] **测试 (Testing)**
  - [ ] 单元测试 (Backend Pytest)。
  - [ ] E2E 测试 (Playwright 模拟完整用户流程: 8:00 News -> Task -> Review)。
  - [ ] 边界测试 (无网环境, API超时, 空数据)。

- [ ] **文档与交付**
  - [ ] 编写 `README.md` (安装部署指南)。
  - [ ] 编写 `API.md` (自动生成 Swagger/Redoc)。
  - [ ] 清理代码，移除敏感 Key (Env Var check)。
  - [ ] 打包最终 Docker Image / 部署脚本。

---

## 🚀 里程碑 (Milestones)

| 阶段             | 预计完成时间 | 交付物                      | 备注         |
| :--------------- | :----------- | :-------------------------- | :----------- |
| **M1: 核心闭环** | Week 2       | News + Task 跑通，环境就绪  | 最小可用版本 |
| **M2: 完整功能** | Week 4       | 所有 Agents + LobeChat 集成 | 功能完备版本 |
| **M3: 正式发布** | Week 6       | UI优化 + 文档 + 稳定部署    | 最终交付版本 |
