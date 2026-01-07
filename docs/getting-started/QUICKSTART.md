# 🚀 AI生活助理快速启动指南

## 第一步：安装依赖

```bash
pip3 install -r requirements.txt
```

## 第二步：配置 API 密钥

编辑 `config/config.ini`：

```ini
[llm]
anthropic_api_key = sk-ant-xxx  # 替换为你的 Claude API 密钥

[weather]  # 可选，用于穿搭秘书
api_key = YOUR_WEATHER_API_KEY_HERE
provider = qweather  # 或 seniverse / openweathermap
city = shanghai
```

获取 API 密钥：
- Claude API: [https://console.anthropic.com](https://console.anthropic.com)
- 和风天气: [https://dev.qweather.com](https://dev.qweather.com)
- 心知天气: [https://www.seniverse.com](https://www.seniverse.com)

## 第三步：验证安装

```bash
python3 verify_setup.py
```

确保所有检查项都通过。

## 第四步：开始使用

### 方式 1：交互式菜单（推荐）

```bash
python3 main.py
```

菜单选项：
- 1️⃣ 新闻秘书 - 获取 AI/科技新闻简报
- 2️⃣ 工作秘书 - 规划工作任务
- 3️⃣ 穿搭秘书 - 获取天气穿衣建议
- 4️⃣ 生活秘书 - 健康生活管理
- 5️⃣ 复盘秘书 - 晚间深度反思
- 6️⃣ 完整早晨流程 - 一键运行前4个秘书
- 7️⃣ 全天流程 - 早晨+晚上复盘

### 方式 2：命令行模式

**运行单个秘书**：
```bash
# 新闻秘书
python3 main.py --step news

# 工作秘书
python3 main.py --step work

# 穿搭秘书
python3 main.py --step outfit

# 生活秘书
python3 main.py --step life

# 复盘秘书
python3 main.py --step review
```

**运行组合流程**：
```bash
# 完整早晨流程（新闻+穿搭+工作+生活）
python3 main.py --step morning

# 全天流程（早晨+晚上复盘）
python3 main.py --step full
```

**交互模式**（某些秘书支持）：
```bash
# 穿搭秘书交互（可输入特殊场合）
python3 main.py --step outfit --interactive

# 生活秘书交互（可输入当前状态）
python3 main.py --step life --interactive

# 复盘秘书交互（引导式深度反思）
python3 main.py --step review --interactive
```

## 💡 推荐使用流程

### 每日完整流程

**早晨 (09:00)**：
```bash
# 一键完成所有早晨准备
python3 main.py --step morning
```

**白天工作**：
- 查看工作计划：`data/daily_logs/YYYY-MM-DD/今日工作.md`
- 随时查看穿搭建议：`data/daily_logs/YYYY-MM-DD/今日穿搭.md`
- 参考生活管理：`data/daily_logs/YYYY-MM-DD/今日生活.md`

**晚上 (22:00)**：
```bash
# 深度复盘今日
python3 main.py --step review --interactive
```

### 快速使用

**只想了解新闻**：
```bash
python3 main.py --step news
```

**紧急工作规划**：
```bash
python3 main.py --step work
```

**出门前穿搭建议**：
```bash
python3 main.py --step outfit
```

## 📁 查看输出文件

所有输出保存在：`data/daily_logs/YYYY-MM-DD/`

- `新闻简报.md` - AI/科技新闻总结
- `今日工作.md` - 工作计划和 TODO 列表
- `今日穿搭.md` - 个性化穿搭建议
- `今日生活.md` - 健康生活管理计划
- `今日复盘.md` - 深度反思和洞察

**查看今日文件**：
```bash
python3 main.py --list
```

**查看历史记录**：
```bash
python3 main.py --history
```

## 🔧 高级配置

### 个性化设置

编辑 `aboutme.md` 文件，让 AI 更了解你：
- 工作目标和风格
- 个人穿搭偏好
- 健康目标和习惯
- 长期规划

### 天气配置

1. **和风天气（推荐）**：
   - 注册：https://dev.qweather.com
   - 免费额度：1000次/天
   - 配置：`provider = qweather`

2. **心知天气**：
   - 注册：https://www.seniverse.com
   - 免费额度：500次/天
   - 配置：`provider = seniverse`

3. **OpenWeatherMap**：
   - 注册：https://openweathermap.org/api
   - 免费额度：1000次/天
   - 配置：`provider = openweathermap`

## 🔧 故障排查

### 问题 1：Module not found

```bash
Error: No module named 'anthropic'
```

**解决**：
```bash
pip3 install anthropic beautifulsoup4 requests
```

### 问题 2：API Key Error

```
Error: Invalid API key
```

**解决**：检查 `config/config.ini` 中的 API 密钥格式是否正确

### 问题 3：天气 API 失败

```
Warning: Weather API not configured
```

**解决**：
- 天气 API 是可选的，不影响基本功能
- 如需精确穿搭建议，请配置天气 API 密钥

### 问题 4：Permission Denied

```
Error: Permission denied: 'data/…'
```

**解决**：
```bash
chmod -R 755 data/
```

## 📊 功能速览

| 功能 | 命令 | 说明 | 交互模式 |
|-----|------|------|---------|
| 新闻简报 | `python3 main.py --step news` | 抓取 AI/科技新闻并总结 | ❌ |
| 工作规划 | `python3 main.py --step work` | 交互式收集并生成 TODO | ✅ |
| 穿搭建议 | `python3 main.py --step outfit` | 基于天气的穿搭推荐 | ✅ |
| 生活管理 | `python3 main.py --step life` | 饮食运动健康计划 | ✅ |
| 晚间复盘 | `python3 main.py --step review` | 深度反思和成长分析 | ✅ |
| 早晨流程 | `python3 main.py --step morning` | 前4个秘书一键运行 | ❌ |
| 全天流程 | `python3 main.py --step full` | 早晨+晚上完整流程 | ❌ |

## 🎯 典型一天的使用

```bash
# 09:00 - 开始新的一天
python3 main.py --step morning

# 09:30 - 查看今日所有计划
python3 main.py --list

# 12:30 - 午餐时查看生活建议
cat data/daily_logs/$(date +%Y-%m-%d)/今日生活.md

# 18:30 - 下班前检查工作完成情况
cat data/daily_logs/$(date +%Y-%m-%d)/今日工作.md

# 22:00 - 晚间深度复盘
python3 main.py --step review --interactive
```

## 📞 需要帮助？

- 📖 完整文档：`README.md`
- 🔧 开发文档：`CLAUDE.md`
- ⚙️ 配置说明：`config/config.ini`
- 📊 Phase 1 总结：`PHASE1_SUMMARY.md`

## ✨ 项目完成状态

✅ **Phase 1 - 基础秘书**
- 新闻秘书 - AI/科技新闻抓取总结
- 工作秘书 - 智能任务管理规划

✅ **Phase 2 - 完整生活管理**
- 穿搭秘书 - 天气集成穿搭建议
- 生活秘书 - 全方位健康管理
- 复盘秘书 - 深度晚间反思
- 天气 API 集成支持
- 完整文件管理系统

🎉 **所有计划功能已完成！**

---

**🚀 系统已就绪，开始您的 AI 生活助理之旅！**