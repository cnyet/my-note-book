# my-note-book 前端

基于 Next.js 的前端应用，提供现代化的用户体验。前端实现了五个主要功能页面：主页、智能体、工具、实验室和博客，以及完整的后台管理界面和 AI 助手。界面采用 Genesis Design System（极客赛博美学），具有深色模式、流畅交互动效和技术社区氛围。

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.5 | 核心框架 (App Router) |
| React | 19.1 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式框架 |
| Shadcn/UI | latest | 基础组件库 |
| Framer Motion | 6.x+ | 物理动效 |
| TanStack Query | 5.x | 数据获取 |
| Zustand | 4.x | 状态管理 |
| React Hook Form | 7.x | 表单管理 |
| Zod | 3.x | Schema 验证 |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3001 查看效果。

## 🏗️ 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # 公共页面 (Home, Agents, Blog, Tools, Labs)
│   │   ├── admin/             # 管理后台 (Dashboard, Agents, Blog, Tools, Labs)
│   │   ├── (admin)/assistant/ # AI 助手页面
│   │   ├── login/             # 登录页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   └── providers.tsx      # 全局 Provider
│   ├── components/
│   │   ├── ui/                # Shadcn/UI 基础组件
│   │   ├── v-ui/              # Genesis 定制组件 (GlassCard, GlitchText 等)
│   │   ├── features/          # 功能组件 (Home, Agents, Blog)
│   │   ├── admin/             # 后台专用组件
│   │   ├── assistant/         # AI 助手组件
│   │   └── common/            # 通用组件
│   ├── hooks/                  # 自定义 Hooks
│   └── lib/                    # 工具函数与 API 客户端
├── public/                     # 静态资源
├── design-assets/              # 设计资产 (页面设计稿)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.mjs
```

## 🌐 页面功能

### 前台页面 (Public)

| 页面 | 路由 | 功能 |
|------|------|------|
| 主页 | `/` | 品牌展示、Hero 区域、功能特性 |
| 智能体 | `/agents` | AI 助手列表、LobeChat 集成 |
| 博客 | `/blog` | 技术博客、Markdown 渲染 |
| 工具 | `/tools` | 工具集合、分类展示 |
| 实验室 | `/labs` | 实验性产品展示 |

### 后台管理 (Admin)

| 页面 | 路由 | 功能 |
|------|------|------|
| 仪表板 | `/admin` | 统计数据、快捷操作 |
| 智能体管理 | `/admin/agents` | 智能体 CRUD |
| 博客管理 | `/admin/blog` | 文章编辑、发布 |
| 工具管理 | `/admin/tools` | 工具信息管理 |
| 实验室管理 | `/admin/labs` | 产品状态管理 |
| AI 助手 | `/assistant` | 多模型对话助手 |

## 🎨 Genesis Design System

### 色彩方案

| 名称 | 变量 | 用途 |
|------|------|------|
| 深渊黑 | `--bg-abyss` (#0a0a0f) | 网站基底背景 |
| 电光青 | `--primary` (#00f2ff) | 高亮、信号 |
| 霓虹紫 | `--accent` (#bc13fe) | 能量脉冲、辅助动效 |
| 极白 | `--text-p` (#f8f8f8) | 主标题、正文 |

### v-ui 组件库

位于 `src/components/v-ui/`:

| 组件 | 用途 |
|------|------|
| GlassCard | 磨砂玻璃卡片 |
| GlitchText | 故障文字动效 |
| NeonButton | 霓虹发光按钮 |
| GradientText | 渐变文字 |
| OnlinePulse | 实时状态脉冲 |

### 动效标准

```tsx
// 标准悬停效果
<motion.div whileHover={{ y: -6, scale: 1.02 }} />

// 弹簧动画配置
transition={{ type: "spring", stiffness: 100, damping: 20 }}
```

## 🔌 API 集成

前端通过 Next.js rewrite 代理后端 API：

```javascript
// next.config.mjs
async rewrites() {
  return [
    { source: '/api/v1/:path*', destination: 'http://localhost:8001/api/v1/:path*' }
  ]
}
```

### API 客户端

使用 TanStack Query 进行数据管理：

- 自动数据同步
- 请求去重
- 错误重试
- 加载状态管理

## ⚙️ 环境配置

```env
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

# WebSocket 地址
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8001/ws
```

## 🧪 测试

```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 构建生产版本
npm run build
```

## 📚 相关文档

- [前端设计规范](../docs/design/frontend-guide.md)
- [系统架构设计](../docs/design/architecture.md)
- [API 接口文档](../docs/design/api-design.md)
- [项目指令](../CLAUDE.md)

---

**最后更新**: 2026年3月4日