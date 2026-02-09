# work-agents 前端

基于 Next.js 的前端应用，提供现代化的用户体验。前端实现了五个主要功能页面：主页、智能体、工具、实验室和博客，以及完整的后台管理界面。界面采用极客美学设计，具有深色模式、流畅交互动效和技术社区氛围。

## 🛠️ 技术栈

- **框架**: Next.js 15.5 (App Router)
- **UI 组件**: React 19.1, Shadcn/UI
- **样式**: Tailwind CSS 3.x (Config-driven)
- **状态管理**: Zustand 4.x
- **数据获取**: TanStack Query 5.x
- **语言**: TypeScript 5.x
- **动画**: Framer Motion 6.x+
- **表单处理**: React Hook Form 7.x + Zod 3.x
- **编辑器**: Tiptap (用于博客编辑)

## 📚 相关文档

- [前端 UI/UX 设计规范](../docs/design/frontend-guide.md)
- [系统架构设计](../docs/design/architecture.md)
- [API 接口文档](../docs/design/api-design.md)
- [OpenSpec 工作流](../docs/development/openspec-guide.md)

## 🚀 快速开始

```bash
# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install

# 启动开发服务器
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3001](http://localhost:3001) 查看效果。

## 🏗️ 项目结构

```
frontend/
├── src/                  # 源代码目录（项目源码）
├── static/               # 静态资源
│   └── logo.png          # Logo 等静态文件
├── design-assets/        # 设计资产 (UI/UX 设计稿)
│   ├── logo.png
│   └── pages/            # 页面设计稿
│       ├── home-desktop.png
│       ├── home-mobile.png
│       ├── agents-desktop.png
│       ├── agents-mobile.png
│       ├── tools-desktop.png
│       ├── tools-mobile.png
│       ├── labs-desktop.png
│       ├── labs-mobile.png
│       ├── blog-desktop.png
│       └── blog-mobile.png
├── package.json          # Node.js 依赖配置
├── tsconfig.json         # TypeScript 配置
├── eslint.config.mjs     # ESLint 配置
├── .env.example          # 环境变量模板
├── .env.local           # 本地环境变量
└── .gitignore           # Git 忽略配置
```

> **注意**: 当前为项目精简结构，完整源代码将逐步实现。

## 🌐 页面功能

### 前台页面

- **主页 (Home)**: 品牌展示与价值主张传递，包含英雄区、品牌理念展示、热门智能体预览
- **智能体 (Agents)**: AI助手集成与展示，采用 LobeChat 集成与 Orchestration Protocol，支持跨 Agent 消息传递和上下文共享
- **工具 (Tools)**: 工具集合分类展示，支持搜索与筛选、相关工具推荐
- **实验室 (Labs)**: 实验性产品展示，包含实时在线用户计数器、产品状态标识
- **博客 (Blog)**: 技术博客与内容营销，支持 Markdown 渲染、SEO 管理

### 后台管理

- **仪表板**: 统计数据展示与快捷操作入口
- **智能体管理**: 智能体的 CRUD 操作与配置管理
- **博客管理**: 博客文章的富文本编辑与发布管理
- **工具管理**: 工具信息的管理与分类配置
- **实验室管理**: 实验室产品的管理与状态设置
- **用户管理**: 个人信息编辑与密码修改

## 🎨 设计系统 (Genesis Design System)

### 色彩方案

- **背景**: `--bg-abyss` (#0a0a0f) - 深渊黑，网站基石背景色
- **主色**: `--primary` (#00f2ff) - 电光青，用于高亮和信号
- **辅助色**: `--accent` (#bc13fe) - 霓虹紫，用于能量脉冲和辅助动效
- **文字**: `--text-p` (#f8f8f8) - 极白，主标题与长文正文

### 动效标准

- **弹簧动效**: `stiffness: 100, damping: 20` (Framer Motion)
- **玻璃态效果**: `background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px);`

### 字体架构

- **标题**: `Outfit` (Bold) - 英文标题字体，具有几何现代感
- **正文**: `Inter` - 中英文正文，提供顶级可读性
- **代码**: `JetBrains Mono` - 等宽字体，用于代码和状态值

## 🔌 API 集成

前端与后端 API 完全集成，支持：

- JWT 身份验证
- 完整 CRUD 操作
- 实时 WebSocket 通信
- 文件上传功能
- 分页和搜索功能

### API 客户端

使用 TanStack Query 进行数据获取和缓存管理，确保：

- 自动数据同步
- 请求去重
- 错误重试机制
- 加载状态管理

## ⚙️ 环境配置

### 开发环境

```env
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# WebSocket 地址
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8001/ws

# OAuth 配置
NEXT_PUBLIC_GITHUB_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

# 应用配置
NEXT_PUBLIC_APP_NAME=work-agents
```

## 🧪 测试

```bash
# 运行单元测试
npm test
# 或
npm run test:unit

# 运行端到端测试
npm run test:e2e

# 运行组件测试
npm run test:components

# 代码覆盖率
npm run test:coverage
```

## 🔧 构建与部署

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run start

# 运行 Lint 检查
npm run lint

# 运行类型检查
npm run type-check
```

## 📱 响应式设计

- **移动端优先**: 所有组件从 Mobile (375px) 起始设计
- **断点策略**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **触摸优化**: 针对移动设备的交互优化

## 🔒 安全特性

- **XSS 防护**: 内容安全策略 (CSP)
- **认证安全**: JWT token 安全存储与传输
- **输入验证**: 前端与后端双重验证
- **CSRF 保护**: SameSite Cookie 策略

## 🚀 性能优化

- **代码分割**: Next.js 自动代码分割
- **懒加载**: 图片和组件懒加载
- **缓存策略**: TanStack Query 缓存机制
- **图像优化**: Next.js 内置图像优化
- **Bundle 分析**: Webpack bundle 分析与优化

## 🎯 主要功能

- **实时通信**: WebSocket 集成，支持实时更新
- **身份管理**: 完整的 JWT 身份验证流程
- **内容管理**: 富文本编辑器支持，Markdown 渲染
- **搜索引擎优化**: 动态 Meta 标签和结构化数据
- **无障碍访问**: WCAG 2.1 AA 级别兼容性
- **国际化**: 支持多语言 (预留接口)
- **主题切换**: 深色/浅色模式切换

## 🤝 贡献

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 组件遵循单一职责原则
- CSS 类使用 Tailwind 原子类
- API 调用使用统一的错误处理

### 提交规范

- 遵循 Conventional Commits 规范
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

### 代码审查

- 所有 PR 都需要至少一人审查
- 确保代码符合项目规范
- 运行测试并验证功能完整

---

## 📄 许可证

[MIT License](../LICENSE)
