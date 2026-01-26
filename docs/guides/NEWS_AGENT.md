# 新闻秘书 (News Secretary) 使用指南 📰

## 1. 前言：在信息爆炸中保持清醒

`NewsAgent` 的使命是在每天数以万计的科技动态中，为你精准捕捉那些真正影响未来的 AI 和技术变革。在 v2.0 中，它实现了从“文本生成”到“数据资产化”的跨越。

---

## 2. 核心功能

- **📡 结构化采集**：实时订阅 TechCrunch, MIT Tech Review, Hugging Face 等权威 RSS 源。
- **🧠 智能脱水**：LLM 自动过滤噪音，提取核心技术突破。
- **💾 数据库持久化 (v2.0)**：生成的每一条精选新闻都会自动存入数据库 `news_articles` 表，不再产生本地 md 文件。
- **🔗 语义关联**：通过 `VectorMemory` 识别与过往新闻的逻辑关联。

---

## 3. 操作步骤

### 🟢 场景一：Dashboard 一键生成
在 Web 端 Dashboard 点击“生成简报”按钮。
1.  系统后台将触发爬虫抓取最新 RSS。
2.  LLM 完成筛选并解析出结构化条目。
3.  数据实时存入 DB，前端通过 `/api/news?latest=10` 接口即时展示。

### 🔵 场景二：CLI 调试
```bash
cd backend
python -m src.cli.main --step news
```

---

## 4. 数据源配置
定位至 `backend/src/agents/news_agent.py` 中的 `sources` 列表进行修改。

| 预设源 | 专注领域 |
| :--- | :--- |
| TechCrunch AI | 创业与投融资 |
| MIT Tech Review | 学术突破与前沿科研 |
| The Verge AI | 产品、政策与评论 |
| Hugging Face | 开源模型与开发者趋势 |

---

## 5. 结语
`NewsAgent` 旨在为你节省每天浏览网页的 30 分钟，将精力集中在深度的思考与创造上。

---
*分类：用户指南*
*版本：v2.0 (DB-Only)*
*更新日期：2026-01-23*
