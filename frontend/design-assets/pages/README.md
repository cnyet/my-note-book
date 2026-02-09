# 前端页面设计文档

本目录包含所有前端页面的详细设计文档，与对应的设计稿图片配合使用。

## 文档列表

### MVP核心页面

| 页面 | 文档 | 设计稿 | 状态 | 说明 |
|------|------|--------|------|------|
| **Home** | [home.md](./home.md) | `home-desktop.png` / `home-mobile.png` | 🟢 开发中 | 品牌着陆页 |
| **Agents** | [agents.md](./agents.md) | `agents-desktop.png` / `agents-mobile.png` | 🟢 开发中 | 核心功能页，含LobeChat + 5智能体 |

### MVP后迭代页面

| 页面 | 文档 | 设计稿 | 状态 | 说明 |
|------|------|--------|------|------|
| **Labs** | [labs.md](./labs.md) | `labs-desktop.png` / `labs-mobile.png` | ⏳ 迭代1 (Week 5-6) | 实验性项目展示 |
| **Tools** | [tools.md](./tools.md) | `tools-desktop.png` / `tools-mobile.png` | ⏳ 迭代1 (Week 5-6) | 小工具集合 |
| **Blog** | [blog.md](./blog.md) | `blog-desktop.png` / `blog-mobile.png` | ⏳ 迭代2 (Week 7-8) | 技术博客 |

## 设计稿图片

所有设计稿图片位于本目录下：

```
pages/
├── home-desktop.png
├── home-mobile.png
├── agents-desktop.png
├── agents-mobile.png
├── labs-desktop.png
├── labs-mobile.png
├── tools-desktop.png
├── tools-mobile.png
├── blog-desktop.png
└── blog-mobile.png
```

## Genesis Design System

所有页面均遵循 [Genesis Design System](../genesis-design-system.md)：

- 配色：深渊黑背景 + 霓虹青/紫/粉/蓝
- 组件：GlassCard / NeonButton / GradientText / OnlinePulse
- 动效：Framer Motion + CSS Animation
- 响应式：Mobile First，断点 sm/md/lg/xl

## 快速参考

### 通用布局结构

```tsx
// 页面通用结构
export default function Page() {
  return (
    <Layout>
      <Navbar />
      <main className="min-h-screen bg-abyss">
        {/* 页面内容 */}
      </main>
      <Footer />
    </Layout>
  );
}
```

### 响应式断点

```
sm: 640px   - 大屏手机
md: 768px   - 平板
lg: 1024px  - 小桌面
xl: 1280px  - 大桌面
```

### 颜色变量

```css
--bg-abyss: #0a0a0f;
--bg-void: #111118;
--cyber-cyan: #00f2ff;
--cyber-purple: #bc13fe;
--cyber-pink: #ff006e;
```

## 相关文档

- [项目路线图](../../docs/planning/roadmap.md)
- [API集成指南](../../docs/api/frontend-integration-guide.md)
- [开发规范](../../openspec/AGENTS.md)
