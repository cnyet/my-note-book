# 项目最初的设想草稿

> **‼️重要提示：只读，不要修改，作为参考和历史记录**

## 目标

开发一个仅供个人使用的智能化工作台，实现多智能体、AI对话、常用工具管理、试验探索性产品展示、博客文章管理等功能。

### 1. 前端系统

#### WEB前台

- 页头包含 LOGO (`frontend/design-assets/logo.png`)、导航栏（Home、Agents、Tools、Labs、 Blogs）
- 右侧动态认证界面：访客显示 [sign in] [sign up]；已登录用户显示头像下拉菜单（Dashboard、Profile、Logout）
- 全局加载状态：进度条和骨架屏
- 完全响应式设计（移动端、平板、桌面端）
- 深色/浅色主题切换，支持 localStorage 持久化
- 页面风格参考 `https://clawdbotai.co` 设计
- 前端页面设计规范 `docs/design/front-guide.md`
- 前端页面设计稿 `frontend/design-assets/pages/`

- **Home**: 简洁大方，背景动效，有鼠标交互，使用 `home-desktop.png` 作为参考，参考 `https://clawdbotai.co` 风格
- **Agents**: LobeChat AI对话和 5 个内部智能体展示，显示图标、名称、描述和交互入口，使用 `agents-desktop.png` 作为参考
- **Tools**: 分类网格/列表，支持搜索和分类筛选，使用 `tools-desktop.png` 作为参考
- **Labs**: 卡片式布局，包含名称、状态标签（实验性/预览版）、描述和体验链接；使用 `labs-desktop.png` 作为参考
- **Blog**: 文章列表，支持标签/日期筛选和全局搜索；详情页带"编辑"链接指向管理系统，使用 `blog-desktop.png` 作为参考

**LobeChat AI对话**

- 集成 LobeChat AI对话到 Agents 页面，作为基础AI对话功能

**5 个内部智能体**

- News Agent：每日整理全网最新的AI资讯
- Outfit Agent：根据天气和日程安排，推荐每日穿搭，并生成穿搭图片
- Task Agent：根据用户提供的问答表单，生成今日待办事项
- Life Agent：结构化存储健康指标，生成今日饮食、运动建议
- Review Agent：今日复盘，反思与洞察，总结今日工作，自动提取并更新用户偏好

#### 管理后台

- 现代、高科技仪表板界面（使用 `ui-ux-pro-max` 设计原则）
- 深色侧边栏导航：仪表板、智能体、工具、实验室、博客、个人资料、设置
- 内容展示区默认为浅色，可切换深色
- 仪表板：可视化指标和分析图表
- 智能体：智能体配置完整 CRUD
- 博客：表格视图，显示标题、摘要、日期、状态和操作（编辑、删除）；富文本编辑器支持 Markdown 预览
- 工具/实验室：条目管理界面，支持排序和分类
- 个人资料：用户信息管理和密码修改
- 设置：全局系统配置选项

### 2. 后端系统

**认证层:**

- 基于 JWT 的认证，支持刷新令牌
- 受保护的 `/admin/*` 路由
- 速率限制实现（例如，每 IP 每分钟 100 请求）
- 会话管理和登出功能

**数据库结构:**

- 数据库设计文档： `docs/design/database-design.md`
- SQLite 数据库位置：`backend/data/my_note_book.db`
- 数据表：users、agents、blogs、tools、labs，具有适当的关联关系
- 热点数据缓存层
- 预置数据（5 个智能体、3 篇博客、3 个工具、3 个实验室）

**API 端点:**

- API 文档：`docs/design/api-design.md`
- RESTful API 满足所有前端数据需求（Dashboard、Agents、Tools、Blogs、Labs）
- 图片上传目录：`backend/data/uploads/`
- 管理后台完整 CRUD 操作
- 图片和媒体文件上传端点
- 大数据集分页支持
- 结构化错误响应和 HTTP 状态码

### 3. 基础设施与部署

- Docker 容器化，分离前端/后端/数据库服务
- 自动化 CI/CD 流水线集成测试
- 环境特定配置（开发/预发布/生产）
- 数据库迁移策略支持 schema 更新

---

**文档版本**: v1.0
**最后更新**: 2026-02-06
**状态**: 待确认
