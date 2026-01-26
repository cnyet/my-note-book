# 工作秘书 (Work Secretary) 使用指南 💼

## 1. 前言：从碎片到秩序

在繁杂的项目开发中，`WorkAgent` 是你的“数字管家”。在 v2.0 架构下，它实现了任务的原子化管理，彻底告别了依靠扫描 Markdown 文件获取进度的历史。

---

## 2. 核心功能

- **原子化任务同步 (DB Sync)**：直接从数据库 `work_tasks` 表读取未完成任务，状态实时同步。
- **🤖 AI 优先级分级**：利用 LLM 根据任务描述自动标记 🚨 High, ⚡ Medium, 📝 Low 优先级。
- **🚀 多模态运行**：支持 Web 端实时更新、静默后台生成与 CLI 深度交互。

---

## 3. 操作步骤

### 🟢 场景一：早间计划生成 (Web)
1.  登录 Dashboard，点击“运行流水线”。
2.  `WorkAgent` 会读取昨日库中的存量任务，并结合今日目标生成计划。
3.  生成的任务直接出现在 Dashboard 的“Activity Insights”中。

### 🔵 场景二：新需求录入 (CLI 交互)
```bash
python -m src.cli.main --step work --interactive
```
按照提示输入新任务，AI 会自动完成分级并存入数据库。

---

## 4. 数据一致性说明
系统不再读取 `data/daily_logs` 下的 md 文件。
- **修改任务**：请通过 API 或数据库管理工具操作 `work_tasks` 表。
- **状态标记**：Web 端勾选任务后，后端会立即更新 `is_completed` 字段。

---

## 5. 最佳实践
- **描述清晰**：录入新任务时包含动词（如“修复”、“重构”），有助于 AI 更准确评估。
- **利用图表**：通过 Dashboard 观察“Work Completion Trend”来调整工作负荷。

---
*分类：用户指南*
*版本：v2.0 (DB-Only)*
*更新日期：2026-01-23*
