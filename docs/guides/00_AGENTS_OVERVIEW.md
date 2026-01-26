# AI 秘书团队概览

AI Life Assistant v2.0 包含五个专门的 AI 代理（Agents），它们协同工作，为你提供全方位的个人助理服务。这些代理通过 `Chief of Staff`（总管）进行编排，实现了全链路数据互通与持久化存储。

## 🤖 秘书团队成员

| 代理名称 | 标识 | 主要职责 | 交互方式 |
|---------|------|---------|---------|
| **新闻秘书** | `NewsAgent` | 收集并总结 AI 与科技新闻，结构化存储文章 | Web/自动 |
| **工作秘书** | `WorkAgent` | 管理每日任务、优先级和计划，同步历史进度 | Web/交互 |
| **穿搭秘书** | `OutfitAgent` | 基于天气和场合推荐着装，结合历史偏好 | Web/自动 |
| **生活秘书** | `LifeAgent` | 健康追踪（饮食、运动、作息），支持多模态输入 | Web/交互 |
| **复盘秘书** | `ReviewAgent` | 每日总结、反思与长期偏好提取 | Web/自动 |

## 🚀 快速开始

所有的代理都可以通过 Web Dashboard 或统一的 CLI 入口进行调用：

```bash
# 进入后端目录
cd backend

# 运行特定代理 (v2.0 强制进入数据库)
python -m src.cli.main --step news
python -m src.cli.main --step work --interactive
```

或者使用编排好的流程：

```bash
# 早间流程 (News -> Outfit -> Life -> Work)
python -m src.cli.main --step morning

# 晚间流程 (Review)
python -m src.cli.main --step evening
```

## 🔄 协同工作原理

1.  **纯数据库驱动**：v2.0 移除了本地 Markdown 文件保存。所有生成的数据直接存入 SQLite 数据库的 `content_index` 及专用结构化表中。
2.  **上下文感知**：
    *   **工作秘书**：直接从数据库读取**昨日**未完成任务条目。
    *   **复盘秘书**：从数据库聚合**今日**所有秘书生成的结构化数据进行综合分析。
    *   **生活秘书**：读取数据库中的**历史健康指标**趋势，动态调整今日建议。
3.  **矢量记忆 (RAG)**：系统集成 `VectorMemory`，基于 ChromaDB 或语义检索学习你的长期生活习惯。

## 📚 详细指南

*   [新闻秘书指南](./NEWS_AGENT.md)
*   [工作秘书指南](./WORK_AGENT.md)
*   [穿搭秘书指南](./OUTFIT_AGENT.md)
*   [生活秘书指南](./LIFE_AGENT.md)
*   [复盘秘书指南](./REVIEW_AGENT.md)
*   [AI 代理与工具指南 (Sisyphus)](./AGENT_TOOLS_GUIDE.md)
