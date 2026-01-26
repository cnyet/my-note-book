# AI Life Assistant v2.0 使用示例

## 🚀 快速启动

### 场景 1: 首次部署与启动
```bash
# 克隆项目后
cd ai-life-assistant

# 执行一键启动脚本 (会自动处理前端构建、后端虚拟环境及数据库初始化)
./quick-start.sh
```

### 场景 2: 每日晨间流水线 (Morning Flow)
系统会自动串联：新闻抓取 -> 穿搭建议 -> 生活健康计划 -> 工作任务同步。

**Web 端操作：**
1. 访问 `http://localhost:3000` 登录。
2. 点击 Dashboard 顶部的 **"Run Synergetic Pipeline"**。
3. 在实时监控面板观察各 Agent 的执行进度。

**CLI 命令行操作：**
```bash
cd backend
python3 -m src.cli.main --step morning
```

## 💬 AI 对话交互

### 场景 3: 沉浸式对话空间
1. 点击页面右下角的蓝色气泡 ICON 唤起对话。
2. 在输入框上方点击 **“穿搭秘书”** 按钮。
3. 输入：`“今天下午要去参加技术沙龙，帮我微调一下早上的穿搭建议。”`
4. AI 将基于早上的天气数据和你的补充需求给出即时回复。

## 📊 数据管理与统计

### 场景 4: 查看健康与工作趋势
1. 每日运行 Agent 后，数据会自动持久化至 SQLite。
2. Dashboard 的 **"Activity Insights"** 会展示最近 7 天的工作完成率。
3. **"Agent Activity Distribution"** 展示 5 大秘书对你生活的辅助比例。

## 🛠️ 后端维护与调试

### 场景 5: 直接检查数据库
由于 v2.0 已移除本地 Markdown 文件，如需直接核对数据：
```bash
# 查看今日生成的所有 Agent 索引
sqlite3 data/ai_life_assistant.db "SELECT agent_type, content_date FROM content_index WHERE content_date = date('now');"

# 查看抓取的最新新闻条目
sqlite3 data/ai_life_assistant.db "SELECT title, source FROM news_articles ORDER BY created_at DESC LIMIT 5;"
```

---
*分类：用户指南*
*版本：v2.0 (DB-Only)*
*更新日期：2026-01-23*
