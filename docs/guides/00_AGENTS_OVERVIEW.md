# AI 秘书团队概览

AI Life Assistant v2.0 包含五个专门的 AI 代理（Agents），它们协同工作，为你提供全方位的个人助理服务。这些代理通过 `Chief of Staff`（总管）进行编排，也可以单独运行。

## 🤖 秘书团队成员

| 代理名称 | 标识 | 主要职责 | 交互方式 |
|---------|------|---------|---------|
| **新闻秘书** | `NewsAgent` | 收集并总结 AI 与科技新闻 | 自动运行 |
| **工作秘书** | `WorkAgent` | 管理每日任务、优先级和计划 | 交互式/自动 |
| **穿搭秘书** | `OutfitAgent` | 基于天气和场合推荐着装 | 独立脚本/交互 |
| **生活秘书** | `LifeAgent` | 健康追踪、饮食与作息建议 | 独立脚本/交互 |
| **复盘秘书** | `ReviewAgent` | 每日总结、反思与偏好提取 | 自动运行 |

## 🚀 快速开始

所有的代理都可以通过统一的 CLI 入口进行调用：

```bash
# 进入后端目录
cd backend

# 运行特定代理
python -m src.cli.main --step news
python -m src.cli.main --step work --interactive
python -m src.cli.main --step review
```

或者使用编排好的流程：

```bash
# 早间流程 (News -> Outfit -> Life -> Work)
python -m src.cli.main --step morning

# 晚间流程 (Review)
python -m src.cli.main --step evening

# 全天模拟
python -m src.cli.main --step full
```

## 🔄 协同工作原理

1.  **数据共享**：所有代理生成的日志都会保存在 `data/daily_logs/YYYY-MM-DD/` 目录下。
2.  **上下文感知**：
    *   **工作秘书**会读取**昨日**未完成的任务。
    *   **复盘秘书**会读取**今日**所有其他秘书生成的日志进行综合分析。
    *   **生活秘书**会读取**昨日**的健康数据（睡眠、运动）来调整今日建议。
3.  **记忆系统**：系统包含长期记忆模块，能够随着时间的推移学习你的偏好。

## 📚 详细指南

请参阅各代理的详细使用说明：

*   [新闻秘书指南](./NEWS_AGENT.md)
*   [工作秘书指南](./WORK_AGENT.md)
*   [穿搭秘书指南](./OUTFIT_AGENT.md)
*   [生活秘书指南](./LIFE_AGENT.md)
*   [复盘秘书指南](./REVIEW_AGENT.md)
