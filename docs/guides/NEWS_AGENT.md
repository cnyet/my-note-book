# 新闻秘书 (News Secretary) 使用指南

新闻秘书 (`NewsAgent`) 负责从权威科技媒体收集最新的 AI 和技术动态，利用大语言模型为你生成简明扼要的中文简报。

## ✨ 功能介绍

*   **多源采集**：自动抓取多个顶级科技源的 RSS Feed。
*   **智能摘要**：使用 LLM 提取核心信息，过滤噪音。
*   **中文简报**：将英文内容翻译并总结为结构化的中文报告。
*   **历史关联**：能够识别并关联之前的相关新闻（v2.0 特性）。

## 💻 使用方式

通过 CLI 运行：

```bash
cd backend
python -m src.cli.main --step news
```

运行成功后，输出结果将自动保存到当日的日志文件中。

## ⚙️ 配置选项

新闻秘书的行为可以在配置文件（通常是 `config/config.ini` 或通过代码默认值）中进行调整：

| 选项 | 说明 | 默认值 |
|------|------|-------|
| `articles_per_summary` | 每次简报包含的新闻条数 | 5 |

## 📡 数据源

目前支持以下高质量科技媒体：

1.  **TechCrunch**: 创业公司与科技行业新闻。
2.  **The Verge**: 消费电子与科技文化。
3.  **MIT Technology Review**: 前沿技术深度报道。

## 📄 输出示例

生成的简报格式如下：

```markdown
## [OpenAI 发布 GPT-5 预览版]
- **Source**: The Verge
- **Summary**: OpenAI 今日突然发布了 GPT-5 的预览版本，据称在推理能力上有显著提升。新模型引入了更长的上下文窗口和多模态原生支持。
- **Link**: https://www.theverge.com/...

## [苹果收购 AI 初创公司]
- **Source**: TechCrunch
...
```

## ❓ 常见问题

**Q: 新闻抓取失败怎么办？**
A: 代理会自动处理网络异常。如果某个源不可用，它会跳过并记录错误日志，不会影响其他源的采集。

**Q: 可以添加新的新闻源吗？**
A: 目前需要修改 `backend/src/agents/news_agent.py` 中的 `sources` 列表来添加新的 RSS 地址。
