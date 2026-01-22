# 复盘秘书 (Review Secretary) 使用指南

复盘秘书 (`ReviewAgent`) 是每天最后运行的代理。它不仅总结一天的工作，还是连接短期行为与长期记忆的关键桥梁。

## ✨ 功能介绍

*   **全日志聚合**：自动读取当日新闻、工作、穿搭、生活等所有代理的日志。
*   **深度反思**：利用 LLM 进行结构化反思，不仅仅是列出流水账。
*   **偏好提取 (Memory)**：(v2.0 核心) 从你的反思中提取长期偏好，更新用户画像。
*   **策略建议**：为明天提出改进策略。

## 💻 使用方式

通常在每天结束工作时运行：

```bash
cd backend
python -m src.cli.main --step review
```

或者作为晚间流程的一部分：

```bash
python -m src.cli.main --step evening
```

## 🧠 核心逻辑：反思结构

复盘秘书生成的报告遵循特定的思维框架：

1.  **🌟 Highlights (高光时刻)**: 今天做得最好的事情，给予正向反馈。
2.  **🚧 Obstacles (障碍与教训)**: 遇到的困难及原因分析。
3.  **📈 Progress (长期进度)**: 今日工作如何服务于长期目标。
4.  **💡 Strategy (明日策略)**: 基于今天的经验，明天应如何调整。

## 📥 输入数据

复盘秘书会自动扫描以下位置的数据：
*   `data/daily_logs/TODAY/news.md`
*   `data/daily_logs/TODAY/work.md`
*   `data/daily_logs/TODAY/outfit.md`
*   `data/daily_logs/TODAY/life.md`

如果没有找到某项日志，它会提示该部分缺失，但不会中断运行。

## 💾 记忆集成 (Preference Extraction)

这是 v2.0 的一项关键升级。当复盘生成后，系统会调用 `PreferenceExtractor`：

1.  **分析文本**：检查反思内容中是否包含用户的新偏好（例如：“我不喜欢晚上的高强度运动”）。
2.  **结构化存储**：将提取到的偏好保存到系统数据库或更新配置文件。
3.  **闭环应用**：这些偏好将被其他秘书（如生活秘书）在未来的运行中读取。

## 📄 输出示例

```markdown
# 每日复盘与反思 - 2024-XX-XX

## 🌟 Highlights
今天高效完成了 API 文档的重构，利用番茄工作法保持了专注。

## 🚧 Obstacles
下午被突发会议打断，导致原定的代码审查任务推迟。
**Lesson**: 下次应预留 buffer 时间应对突发情况。

## 💡 Strategy for Tomorrow
明天上午优先处理遗留的代码审查，下午开启免打扰模式进行核心开发。
```
