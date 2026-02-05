# 架构优化建议

## 1. 前端部分

### 1.1 修改页面（UI设计规范：docs/design/ui-ux-spec.md）
- 首页导航栏依次显示：LOGO, Home, Agents, Blog, Tools, Labs
- 首页右上角显示：Sign In, Sign Up
- 现在首页主体展示的内太过简单，需要重新设计，可以参考 https://clawdbotai.co/zh
- LOGO ICON： [frontend/design-assets/logo.png](frontend/design-assets/logo.png)
- 首页UI设计稿： [frontend/design-assets/home-desktop.png](frontend/design-assets/home-desktop.png)
- Agents 页面UI设计稿： [frontend/design-assets/agents-desktop.png](frontend/design-assets/agents-desktop.png)
- Blog 页面UI设计稿： [frontend/design-assets/blog-desktop.png](frontend/design-assets/blog-desktop.png)
- Tools 页面UI设计稿： [frontend/design-assets/tools-desktop.png](frontend/design-assets/tools-desktop.png)
- Labs 页面UI设计稿： [frontend/design-assets/labs-desktop.png](frontend/design-assets/labs-desktop.png)

### 1.2 前台页面显示效果要求
- 页面顶部显示登录用户的头像，点击头像出现下拉菜单，包含：dashboard、个人中心、退出登录
- 点击dashboard，跳转到后台管理系统dashboard页面
- 点击个人中心，跳转到后台管理系统个人中心页面
- 点击退出登录，退出登录
- 后台管理系统需要登录才能访问
- 页面加载时，需要有骨架屏效果、需要有加载动画、需要有加载进度条
- 支持响应式布局，在手机、平板、电脑上都有良好的显示效果
- 支持暗色/亮色模式切换
- 首页底部显示内容参考：https://checkmarx.dev/
- Agents 页面实现可交互的Tab导航栏，用于在不同助手间切换，默认展示LobeChat。每个助手展示区域应包含其图标、名称、简介及核心交互入口。
- Tools 页面分类展示已有的工具集合。每个工具应有清晰的图标、名称、简短描述和访问链接。支持按类别筛选或搜索工具
- Labs 页面用于展示处于实验阶段的产品，例如小游戏、AI Agent原型等。每个实验产品应有吸引人的展示卡片，包含项目名称、状态（如“实验性”、“预览”）、简要说明和体验入口。
- Blog 页面展示博客文章列表，支持按标签、日期分类和全文搜索。列表页显示文章标题、摘要、发布时间和标签。点击文章进入详情页。提供“编辑”入口，点击后跳转至后台管理的博客编辑界面。
 
### 1.3 后台管理系统页面
- 调用 ui-ux-pro-max-skill 设计一款现代的，充满科技感的管理后台页面
- 左侧导航栏依次显示：Dashboard、Agents管理、博客管理、工具管理、实验室管理、个人中心、系统设置
- Dashboard页面已图表形式的展示不同模块的概览信息
- Agents管理页面，默认展示 LobeChat和5个agent的列表
- 5个agents说明：
  - NewsAgent：新闻助手，用于获取和分析新闻
  - TaskAgent：日常任务助手，用于处理日常任务
  - OutfitAgent：穿搭助手，用于提供穿搭建议
  - LifeAgent：生活助手，用于提供生活建议
  - reviewAgent：今日复盘助手，用于总结今日工作
- 博客管理页面，默认展示博客列表，包括：标题、摘要、发布时间、状态、操作（编辑、删除）
  - 博客管理编辑页面有富文本编辑器，支持Markdown预览
- 工具管理页面，管理tools页面的展示信息。可管理工具的名称、描述、图标、分类、链接地址和排序
- 实验室管理页面，管理labs页面的产品展示。可管理实验产品的名称、描述、状态、展示图片/视频、体验链接和排序。
- 个人中心页面，管理个人信息，修改密码等
- 系统设置页面，管理系统设置，包括：系统名称、系统描述、系统图标等

## 2. 后端部分

### 2.1 数据库设计（docs/design/database-schema.md）
- 数据库预设默认数据（数据库文件：backend/data/work_agents.db）：
  - 5个agents：NewsAgent、TaskAgent、OutfitAgent、LifeAgent、reviewAgent
  - 3篇博客， 例如：
    - 标题：AI Agent 的崛起：从自动化到智能协作
    - 摘要：AI Agent 正在改变我们的工作方式，从自动化到智能协作，AI Agent 正在改变我们的工作方式
    - 发布时间：2022-01-01
    - 状态：已发布
    - 内容：AI Agent 正在改变我们的工作方式，从自动化到智能协作，AI Agent 正在改变我们的工作方式
  - 3个工具， 例如：
    - 名称：LobeChat
    - 描述：LobeChat 是一个开源的 AI 聊天客户端，支持多种 AI 模型
    - 分类：AI 聊天
    - 链接：https://github.com/lobehub/lobe-chat
    - 排序：1
  - 3个实验室产品， 例如：
    - 名称：贪吃蛇小游戏
    - 描述：贪吃蛇小游戏，
    - 排序：1

## 3. 前后端动态数据交互（docs/design/api-design.md）
- 相关页面的数据需从后端接口获取
- 前端页面需要有加载动画、加载进度条、骨架屏效果
- 项目架构设计文档：docs/design/architecture.md