# AI 生活助理团队 🤖

专为 大洪 打造的个人生活助理 AI 系统，通过 5 个专业 AI 分身提供全方位生活支持。

> **🎉 项目结构已优化！** (2024-12-31)  
> 后端代码已整合到 `backend/` 目录，前端重命名为 `frontend/`。  
> 详见：[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)

## ⚡ 快速启动

### 一键启动所有服务

```bash
./scripts/dev/start-all.sh
```

这个脚本会自动：
- ✅ 检查并安装所有依赖
- ✅ 启动后端 API 服务器 (http://localhost:8000)
- ✅ 启动前端 Web 应用 (http://localhost:3000)
- ✅ 显示服务状态和访问地址

### 停止服务

```bash
./scripts/dev/stop-all.sh
```

或在运行时按 `Ctrl+C`

### 分别启动

**后端服务**:
```bash
cd backend
python -m src.cli.main
```

**前端服务**:
```bash
cd frontend
npm run dev
```

### 默认登录账户

- **邮箱**: `dahong@example.com`
- **密码**: `password123`

📖 **详细文档**: [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)

---

## 🎯 系统概览

### 5 大核心秘书

1. **📰 新闻秘书** - AI/科技新闻简报
2. **💼 工作秘书** - 任务管理和优先级规划
3. **👔 穿搭秘书** - 基于天气的着装建议
4. **🌱 生活秘书** - 饮食、运动、日程管理
5. **🌙 复盘秘书** - 晚间反思和行为分析

### ✅ 已完成功能

**Phase 1 - 基础秘书 (已完成)**:
- ✅ 新闻秘书 - 抓取并总结 AI/科技新闻
- ✅ 工作秘书 - 交互式收集任务并生成智能 TODO 列表

**Phase 2 - 完整生活管理 (已完成)**:
- ✅ 穿搭秘书 - 天气集成和个性化穿搭推荐
- ✅ 生活秘书 - 健康饮食、运动计划、作息管理
- ✅ 复盘秘书 - 深度晚间反思和成长分析
- ✅ 天气 API 集成 - 支持和风天气、心知天气、OpenWeather
- ✅ 完整的文件管理系统 - 按日期自动归档所有日志

## 🧪 测试

项目包含完整的测试套件，确保代码质量和可靠性。

### 测试统计

- ✅ **220个测试** 全部通过（204单元 + 16集成）
- 📊 **75%代码覆盖率**（核心模块 >85%）
- ✅ **mypy类型检查** 通过
- ✅ **日志系统** 完整测试

### 运行测试

```bash
# 激活虚拟环境
source venv/bin/activate

# 运行所有测试
python -m pytest tests/

# 运行单元测试
python -m pytest tests/unit/

# 运行集成测试
python -m pytest tests/integration/

# 生成覆盖率报告
python -m pytest tests/ --cov=. --cov-report=html
open htmlcov/index.html
```

### 测试文档

详细的测试指南请参考：[tests/TESTING_GUIDE.md](tests/TESTING_GUIDE.md)

包含内容：
- 如何编写单元测试
- 如何使用Fixtures
- 如何使用Mocks
- 集成测试最佳实践
- 测试覆盖率提升技巧

---

## 🌐 Web应用

除了CLI模式，系统还提供了现代化的Web界面！

### 特性

- 📊 **实时仪表盘** - 查看所有秘书状态和统计
- 🎨 **现代化UI** - 基于Next.js + Tailwind CSS
- 🌓 **深色模式** - 支持浅色/深色主题切换
- 📱 **响应式设计** - 完美支持移动端/平板/桌面
- ⚡ **实时更新** - 通过FastAPI后端实时同步
- 🎯 **独立秘书页面** - 每个秘书都有专属页面
- 🔐 **用户认证** - JWT认证，保护个人数据

### 快速启动

```bash
# 一键启动前端+后端
./scripts/start-web.sh

# 访问 Web 界面
open http://localhost:3000

# API 文档
open http://localhost:8000/docs
```

### 认证系统

Web应用包含完整的用户认证系统：

- ✅ 用户注册和登录
- ✅ JWT令牌认证（7天或30天过期）
- ✅ 受保护的Dashboard路由
- ✅ 个人资料管理
- ✅ 会话持久化
- ✅ 安全的密码哈希（bcrypt）

详细文档：[AUTHENTICATION.md](AUTHENTICATION.md)

### 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + Radix UI + Framer Motion
- **后端**: FastAPI + Uvicorn
- **图标**: Lucide React

### Web应用文档

详细文档请参考：[web-app/README.md](web-app/README.md)

---

## 🚀 快速开始

### 1. 配置 API 密钥

编辑 `config/config.ini` 文件：

```ini
[llm]
anthropic_api_key = YOUR_ANTHROPIC_API_KEY_HERE  # 从 https://console.anthropic.com 获取

[weather]  # 可选，用于穿搭秘书
api_key = YOUR_WEATHER_API_KEY_HERE
provider = qweather  # 或 seniverse / openweathermap
city = shanghai
```

**必须配置 Claude API 密钥才能使用！**
天气 API 密钥可选，不配置将使用默认建议。

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 运行系统

#### 交互式菜单（推荐）
```bash
python main.py
```

#### 命令行模式

**运行单个秘书**:
```bash
# 新闻秘书
python main.py --step news

# 工作秘书
python main.py --step work

# 穿搭秘书
python main.py --step outfit

# 生活秘书
python main.py --step life

# 复盘秘书
python main.py --step review
```

**运行流程组合**:
```bash
# 完整早晨流程（新闻+穿搭+工作+生活）
python main.py --step morning

# 全天流程（早晨+晚上复盘）
python main.py --step full
```

**交互模式**:
```bash
# 穿搭秘书交互模式
python main.py --step outfit --interactive

# 生活秘书交互模式
python main.py --step life --interactive

# 复盘秘书交互模式
python main.py --step review --interactive
```

**其他功能**:
```bash
# 查看今天的文件
python main.py --list

# 查看历史记录
python main.py --history
```

## 📁 项目结构

### 当前结构 (Current Structure)

```
ai-life-assistant/
├── 📂 agents/                   # AI 秘书模块
│   ├── news_secretary.py        # 新闻秘书
│   ├── work_secretary.py        # 工作秘书
│   ├── outfit_secretary.py      # 穿搭秘书
│   ├── life_secretary.py        # 生活秘书
│   └── review_secretary.py      # 复盘秘书
│
├── 📂 api/                      # FastAPI 后端服务
│   ├── server.py                # API 服务器入口
│   ├── config.py                # API 配置
│   ├── database.py              # 数据库连接
│   ├── dependencies.py          # 依赖注入
│   ├── auth/                    # 认证模块
│   │   ├── jwt.py               # JWT 令牌处理
│   │   ├── password.py          # 密码哈希
│   │   └── dependencies.py      # 认证依赖
│   ├── middleware/              # 中间件
│   │   ├── cors.py              # CORS 配置
│   │   ├── error_handler.py     # 错误处理
│   │   └── rate_limit.py        # 速率限制
│   ├── models/                  # SQLAlchemy 数据模型
│   │   ├── user.py              # 用户模型
│   │   ├── agent_log.py         # 秘书日志模型
│   │   └── file_record.py       # 文件记录模型
│   ├── repositories/            # 数据访问层
│   │   ├── user_repository.py
│   │   ├── agent_repository.py
│   │   └── file_repository.py
│   ├── routes/                  # API 路由
│   │   ├── auth.py              # 认证路由
│   │   ├── agents.py            # 秘书路由
│   │   ├── dashboard.py         # 仪表盘路由
│   │   └── health.py            # 健康检查
│   ├── schemas/                 # Pydantic 模式
│   │   ├── auth.py              # 认证模式
│   │   ├── agent.py             # 秘书模式
│   │   └── user.py              # 用户模式
│   ├── services/                # 业务逻辑层
│   │   ├── auth_service.py
│   │   ├── agent_service.py
│   │   └── file_service.py
│   └── utils/                   # API 工具函数
│       ├── security.py
│       └── validators.py
│
├── 📂 utils/                    # 共享工具模块
│   ├── llm_client.py            # LLM 客户端（Claude）
│   ├── llm_client_v2.py         # LLM 客户端 V2
│   ├── glm_client.py            # GLM 客户端（智谱AI）
│   ├── file_manager.py          # 文件管理工具
│   ├── weather_api.py           # 天气 API 集成
│   ├── weather_client.py        # 天气客户端
│   ├── logger.py                # 日志工具
│   ├── log_config.py            # 日志配置
│   ├── config_loader.py         # 配置加载器
│   └── models/                  # Pydantic 数据模型
│       ├── config.py            # 配置模型
│       ├── secretary.py         # 秘书模型
│       └── api_response.py      # API 响应模型
│
├── 📂 web-app/                  # Next.js 前端应用
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── (auth)/          # 认证路由组
│   │   │   │   ├── login/       # 登录页面
│   │   │   │   ├── register/    # 注册页面
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/     # 仪表盘路由组
│   │   │   │   ├── page.tsx     # Dashboard 首页
│   │   │   │   ├── news/        # 新闻秘书页面
│   │   │   │   ├── work/        # 工作秘书页面
│   │   │   │   ├── outfit/      # 穿搭秘书页面
│   │   │   │   ├── life/        # 生活秘书页面
│   │   │   │   ├── review/      # 复盘秘书页面
│   │   │   │   ├── settings/    # 设置页面
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx       # 根布局
│   │   │   └── globals.css      # 全局样式
│   │   ├── components/          # React 组件
│   │   │   ├── ui/              # 基础 UI 组件
│   │   │   ├── layout/          # 布局组件
│   │   │   ├── auth/            # 认证组件
│   │   │   ├── dashboard/       # 仪表盘组件
│   │   │   └── work/            # 工作秘书组件
│   │   ├── contexts/            # React 上下文
│   │   │   └── auth-context.tsx
│   │   └── lib/                 # 工具库
│   │       ├── api.ts           # API 客户端
│   │       ├── utils.ts         # 工具函数
│   │       ├── api/             # API 模块
│   │       └── types/           # TypeScript 类型
│   ├── public/                  # 静态资源
│   ├── package.json             # Node 依赖
│   ├── tsconfig.json            # TypeScript 配置
│   ├── tailwind.config.ts       # Tailwind 配置
│   └── next.config.ts           # Next.js 配置
│
├── 📂 tests/                    # 测试套件
│   ├── conftest.py              # Pytest 配置
│   ├── TESTING_GUIDE.md         # 测试指南
│   ├── fixtures/                # 测试 Fixtures
│   │   ├── config_fixtures.py
│   │   ├── data_fixtures.py
│   │   └── secretary_fixtures.py
│   ├── unit/                    # 单元测试
│   │   ├── test_agents/         # 秘书测试
│   │   ├── test_utils/          # 工具测试
│   │   └── test_models/         # 模型测试
│   └── integration/             # 集成测试
│       ├── test_workflows.py
│       └── test_module_collaboration.py
│
├── 📂 alembic/                  # 数据库迁移
│   ├── versions/                # 迁移版本
│   ├── env.py                   # Alembic 环境
│   └── script.py.mako           # 迁移模板
│
├── 📂 config/                   # 配置文件
│   ├── config.ini               # 主配置文件
│   ├── config_glm.ini           # GLM 配置
│   └── aboutme.md               # 用户画像
│
├── 📂 data/                     # 应用数据（.gitignore）
│   ├── daily_logs/              # 按日期存储的日志
│   │   └── YYYY-MM-DD/
│   │       ├── 新闻简报.md
│   │       ├── 今日工作.md
│   │       ├── 今日穿搭.md
│   │       ├── 今日生活.md
│   │       └── 今日复盘.md
│   ├── vector_db/               # ChromaDB 向量数据库
│   ├── knowledge_base/          # 长期知识库
│   └── ai_life_assistant.db     # SQLite 数据库
│
├── 📂 scripts/                  # 开发脚本
│   ├── setup.sh                 # 环境设置
│   ├── quick-start.sh           # 快速启动
│   ├── start_servers.sh         # 启动服务器
│   ├── stop-services.sh         # 停止服务
│   ├── build.sh                 # 构建脚本
│   ├── test.sh                  # 测试脚本
│   ├── lint.sh                  # 代码检查
│   ├── clean.sh                 # 清理脚本
│   └── test_*.py                # 测试工具脚本
│
├── 📂 logs/                     # 日志文件（.gitignore）
│   ├── api-dev.log              # API 开发日志
│   ├── auth_events.log          # 认证事件日志
│   ├── backend.log              # 后端日志
│   ├── frontend.log             # 前端日志
│   └── *.md                     # 开发文档和总结
│
├── 📂 .github/                  # GitHub 配置
│   ├── workflows/               # CI/CD 工作流
│   └── CODEOWNERS               # 代码所有者
│
├── 📂 .kiro/                    # Kiro IDE 配置
│   ├── hooks/                   # Agent 钩子
│   ├── settings/                # IDE 设置
│   ├── specs/                   # 功能规格
│   └── steering/                # 指导规则
│
├── 📄 main.py                   # CLI 主入口
├── 📄 requirements.txt          # Python 依赖
├── 📄 pytest.ini                # Pytest 配置
├── 📄 mypy.ini                  # Mypy 类型检查配置
├── 📄 alembic.ini               # Alembic 配置
├── 📄 docker-compose.yml        # Docker 编排
├── 📄 .env.example              # 环境变量模板
├── 📄 .gitignore                # Git 忽略规则
├── 📄 LICENSE                   # 许可证
├── 📄 README.md                 # 项目文档
├── 📄 QUICK_START_GUIDE.md      # 快速开始指南
├── 📄 WEB_LOGIN_GUIDE.md        # Web 登录指南
└── 📄 构想.md                    # 项目构想

```

### 📊 目录说明

| 目录 | 说明 | 主要内容 |
|------|------|---------|
| `agents/` | AI 秘书核心模块 | 5个秘书的实现代码 |
| `api/` | FastAPI 后端服务 | RESTful API、认证、数据库 |
| `web-app/` | Next.js 前端应用 | 现代化 Web 界面 |
| `utils/` | 共享工具库 | LLM客户端、文件管理、日志 |
| `tests/` | 测试套件 | 单元测试、集成测试 |
| `config/` | 配置文件 | API密钥、用户偏好 |
| `data/` | 应用数据 | 日志、数据库、知识库 |
| `scripts/` | 开发脚本 | 启动、测试、构建工具 |
| `alembic/` | 数据库迁移 | SQLAlchemy 迁移脚本 |
| `logs/` | 系统日志 | 运行日志、开发文档 |

### 🔄 计划中的结构优化

项目正在规划结构优化，将采用更清晰的 monorepo 组织方式：

```
ai-life-assistant/
├── backend/          # 后端应用（整合 agents/ + api/ + utils/）
├── frontend/         # 前端应用（重命名自 web-app/）
├── docs/             # 集中文档
├── scripts/          # 开发脚本
└── config/           # 共享配置
```

详见：`.kiro/specs/project-structure-optimization/`

## 🤖 使用指南

### 新闻秘书 (News Secretary)

自动抓取 AI/科技新闻并生成结构化简报：

- 抓取源：TechCrunch AI、MIT Technology Review、The Verge AI
- 生成包含重要性评分、关键要点的中文总结
- 自动保存到 `data/daily_logs/YYYY-MM-DD/新闻简报.md`

**运行**:
```bash
python main.py --step news
```

### 工作秘书 (Work Secretary)

交互式收集工作信息，生成智能 TODO 列表：

1. **检查昨日任务** - 自动提醒未完成的任务
2. **收集今日信息**:
   - 会议安排
   - 主要工作任务
   - 优先级说明
   - 特殊备注
3. **智能分析** - 使用 LLM 生成优化后的 TODO 列表
   - 高/中/低优先级分类
   - 预估时间
   - 关键要点
   - 时间块建议

**运行**:
```bash
python main.py --step work
```

### 穿搭秘书 (Outfit Secretary)

基于天气和个人偏好的智能穿搭建议：

- **天气集成**：支持多个天气 API（和风天气、心知天气、OpenWeather）
- **个性化建议**：考虑用户风格偏好、职业特点、通勤需求
- **详细搭配**：包含上装、下装、鞋履、配饰建议
- **备选方案**：温度变化和场合变化的调整建议

**运行**:
```bash
# 自动模式
python main.py --step outfit

# 交互模式（可输入特殊需求）
python main.py --step outfit --interactive
```

### 生活秘书 (Life Secretary)

全方位健康管理建议：

- **饮食计划**：三餐营养建议，考虑健康目标
- **运动安排**：个性化运动计划，频率和强度建议
- **作息管理**：基于用户习惯的作息优化
- **健康追踪**：饮水、睡眠、体重等指标提醒
- **实用贴士**：针对技术工作者的健康建议

**运行**:
```bash
# 自动模式
python main.py --step life

# 交互模式（可输入当前状态）
python main.py --step life --interactive
```

### 复盘秘书 (Review Secretary)

晚间深度反思和成长分析：

- **多维度复盘**：工作、个人成长、健康、人际关系、感恩
- **智能洞察**：基于当日日志的 AI 分析和建议
- **成长追踪**：识别行为模式和改进机会
- **明日规划**：基于今日经验的明日重点

**运行**:
```bash
# 自动模式（基于日志自动生成）
python main.py --step review

# 交互模式（引导式深度反思）
python main.py --step review --interactive
```

### 流程组合

**完整早晨流程**（新闻+穿搭+工作+生活）：
```bash
python main.py --step morning
```

**全天流程**（早晨+晚上复盘）：
```bash
python main.py --step full
```

## 📊 完整功能总结

### 已完成的功能

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 新闻秘书 | ✅ | ✅ 自动抓取新闻源<br>✅ LLM 智能总结<br>✅ 保存到日期目录 |
| 工作秘书 | ✅ | ✅ 交互式任务收集<br>✅ 智能 TODO 生成<br>✅ 昨日任务提醒 |
| 穿搭秘书 | ✅ | ✅ 天气 API 集成<br>✅ 个性化穿搭建议<br>✅ 通勤考虑 |
| 生活秘书 | ✅ | ✅ 健康饮食建议<br>✅ 运动计划制定<br>✅ 作息管理 |
| 复盘秘书 | ✅ | ✅ 多维度深度反思<br>✅ AI 洞察分析<br>✅ 成长追踪 |
| 基础框架 | ✅ | ✅ LLM 客户端封装<br>✅ 文件管理工具<br>✅ 配置系统 |
| 主调度器 | ✅ | ✅ 交互式菜单<br>✅ 命令行模式<br>✅ 完整流程调度 |

### 文件输出示例

**新闻简报** (`data/daily_logs/2025-12-05/新闻简报.md`):
```markdown
# 新闻简报 - 2025年12月05日 09:30

## 今日焦点 (3篇)

### 1. [标题]
**来源**: TechCrunch
**链接**: [URL]
**摘要**: ...
**重要度**: ⭐⭐⭐⭐☆ (4/5)
**关键要点**:
• ...
• ...

...
```

**工作规划** (`data/daily_logs/2025-12-05/今日工作.md`):
```markdown
# 今日工作规划 - 2025年12月05日 09:45

### 🚨 高优先级
- [ ] **任务标题** - 描述
  - 优先级: High
  - 预估时间: 2小时
  - 关键点: ...

### 今日工作概览
- 总任务数: 5
- 预估总时间: 6小时
- 推荐时间块: ...
```

## 🎉 项目完成状态

### ✅ Phase 1 & 2 全部完成！

**已实现的功能**：
1. ✅ **新闻秘书** - AI/科技新闻抓取与总结
2. ✅ **工作秘书** - 智能任务管理与 TODO 生成
3. ✅ **穿搭秘书** - 天气集成的个性化穿搭建议
4. ✅ **生活秘书** - 全方位健康管理与生活规划
5. ✅ **复盘秘书** - 深度晚间反思与成长分析

### 🚀 可选增强功能 (Phase 3)

如果希望进一步增强系统，可以考虑：

1. **RAG 知识库深度集成**
   - 使用 ChromaDB 构建长期记忆
   - 个性化建议基于历史数据
   - 跨日行为模式识别

2. **即梦 AI 图像生成**
   - 穿搭搭配可视化
   - 健康餐谱图片生成

3. **飞书/企业微信集成**
   - 消息推送提醒
   - 日程自动同步
   - 团队协作支持

4. **健康设备接入**
   - 智能手环数据同步
   - 体重秤数据集成
   - 睡眠质量监测

## ⚠️ 重要提醒

### API 费用
- Claude API 按 token 计费（目前价格：$3/million input, $15/million output）
- 每次对话约消耗几千 tokens
- 建议监控使用情况

### 数据备份
- 建议定期备份 `data/` 目录
- 关键配置文件（含 API 密钥）需妥善保管

### Git 管理
- `config/secrets.ini`（如创建）应加入 `.gitignore`
- 不要提交 API 密钥到代码仓库

## 🐛 故障排除

### 1. API 密钥错误
```
Error: Invalid API key
```
**解决**: 检查 `config/config.ini` 中的 `api_key` 是否正确

### 2. 网络连接问题
```
Error: Connection timeout
```
**解决**: 检查网络连接，某些新闻源可能需要 VPN

### 3. 权限错误
```
Error: Permission denied
```
**解决**: 确保有权限写入 `data/` 目录

## 📞 联系方式

项目作者: 大洪
项目路径: /Users/yet/ClaudeCode/subAgents
最后更新: 2025-12-05

---

## 🤝 技术栈

- **LLM**: Anthropic Claude / GLM (智谱AI)
- **语言**: Python 3.8+
- **Web**: Requests, BeautifulSoup4, FeedParser
- **配置**: ConfigParser
- **类型系统**: Pydantic 2.0+, mypy
- **日志**: structlog
- **测试**: pytest, pytest-cov, pytest-mock
- **向量DB**: ChromaDB (Phase 2)

## 🎯 核心优势

1. **个人化** - 基于 RAG 知识库的学习和个性化
2. **全生命周期** - 从早晨新闻到晚间复盘，覆盖整天
3. **深度反思** - 不止记录，更引导深度自我觉察
4. **共同成长** - Agent 通过积累经验越来越懂你

---

**祝使用愉快！🚀**
