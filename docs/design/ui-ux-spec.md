# Work-Agents UI/UX 设计规范

**版本**: v1.0
**创建时间**: 2026-01-30
**设计灵感**: checkmarx.dev, clawdbotai.co
**设计理念**: 现代科技感、极客风、AI

---

## 1. 设计理念

### 核心风格

**极客美学 (Geek Aesthetic)**
- 简洁的线条和几何形状
- 技术感强烈的视觉元素
- 代码和终端风格的点缀
- 强调功能和效率

**现代感 (Modern)**
- 大胆的排版
- 流畅的动画
- 卡片式布局
- 响应式设计

**深色调优先 (Dark-First)**
- 默认深色主题
- 高对比度强调色
- 舒适的深色阅读体验
- 减少眼睛疲劳

---

## 2. 色彩系统

### 主色调

**CSS变量定义:**
```
--background-primary: #0A0F1C  (深色背景)
--background-secondary: #111827
--background-tertiary: #1F2937
--primary: #3B82F6  (电光蓝)
--primary-hover: #2563EB
--accent-purple: #8B5CF6  (霓虹紫)
--accent-cyan: #06B6D4  (青绿)
```

### 语义色

```
--success: #10B981  (成功绿)
--warning: #F59E0B  (警告橙)
--error: #EF4444  (错误红)
--info: #3B82F6  (信息蓝)
```

### 文字颜色

```
--text-primary: #F8FAFC
--text-secondary: #94A3B8
--text-tertiary: #64748B
```

### 渐变背景

**Hero渐变:**
background: linear-gradient(135deg, #0A0F1C 0%, #1E3A5F 50%, #0A0F1C 100%)

**文字渐变:**
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)
-webkit-background-clip: text
-webkit-text-fill-color: transparent

### 阴影效果

```
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--glow-blue: 0 0 20px rgba(59, 130, 246, 0.3)
```

---

## 3. 字体系统

### 字体族

```
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

### 字号系统

```
--text-xs: 0.75rem   (12px)
--text-sm: 0.875rem  (14px)
--text-base: 1rem    (16px)
--text-lg: 1.125rem  (18px)
--text-xl: 1.25rem   (20px)
--text-2xl: 1.5rem   (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem  (36px)
--text-5xl: 3rem     (48px)
```

### 字重

```
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## 4. 间距系统 (8px网格)

```
--space-1: 0.25rem   (4px)
--space-2: 0.5rem    (8px)
--space-3: 0.75rem   (12px)
--space-4: 1rem      (16px)
--space-6: 1.5rem    (24px)
--space-8: 2rem      (32px)
--space-12: 3rem     (48px)
--space-16: 4rem     (64px)
```

---

## 5. 圆角系统

```
--radius-sm: 0.25rem   (4px)
--radius-md: 0.5rem    (8px)
--radius-lg: 0.75rem   (12px)
--radius-xl: 1rem      (16px)
--radius-full: 9999px  (圆形)
```

---

## 6. 过渡和动画

### 过渡时长

```
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
```

### 缓动函数

```
--ease: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
```

### 常用动画

**淡入:**
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

**上滑淡入:**
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

**脉冲发光:**
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5); }
}

**旋转加载:**
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

---

## 7. 响应式断点

```
--breakpoint-sm: 640px   (手机横屏)
--breakpoint-md: 768px   (平板竖屏)
--breakpoint-lg: 1024px  (平板横屏/笔记本)
--breakpoint-xl: 1280px  (桌面显示器)
```

---

## 8. 组件库选择

### 推荐方案：Shadcn/UI + Tailwind CSS

**选择理由**：
1. 基于Radix UI，无头组件，完全可定制
2. 使用Tailwind CSS，与Next.js生态完美集成
3. 复制粘贴源码，无隐藏依赖
4. 深色模式开箱即用
5. 现代化设计风格，与参考网站契合
6. TypeScript优先

**核心组件清单**：
```
基础组件：
□ Button       按钮（变体：primary/secondary/destructive/ghost）
□ Card         卡片容器
□ Input        输入框
□ Textarea     多行文本
□ Label        标签
□ Badge        标签徽章

布局组件：
□ Container    响应式容器
□ Grid         网格布局
□ Flex         弹性布局
□ ScrollArea   滚动区域

导航组件：
□ Navbar       导航栏
□ Sidebar      侧边栏（后台）
□ Tabs         标签页
□ Breadcrumb   面包屑

数据展示：
□ Table        表格
□ Avatar       头像
□ Progress     进度条
□ Empty        空状态

反馈组件：
□ Toast        提示
□ Dialog       对话框
□ Modal        模态框
□ Skeleton     骨架屏
□ Spinner      加载中

表单组件：
□ Form         表单（含验证）
□ Select       下拉选择
□ Checkbox     复选框
□ Radio        单选框
□ Switch       开关
□ Editor       富文本编辑器（Tiptap）
```

---

## 9. 组件规范

### 11.1 按钮 (Button)

**变体:** primary, secondary, ghost, destructive
**尺寸:** sm, md, lg

**Primary Button:**
- background: var(--primary)
- color: white
- padding: var(--space-2) var(--space-4)
- border-radius: var(--radius-md)
- font-weight: var(--font-medium)
- hover: background: var(--primary-hover) + box-shadow: var(--glow-blue)

**Secondary Button:**
- background: var(--background-tertiary)
- color: var(--text-primary)
- border: 1px solid var(--border)

**Ghost Button:**
- background: transparent
- color: var(--text-secondary)
- hover: background: var(--background-tertiary)

### 11.2 卡片 (Card)

- background: var(--background-secondary)
- border: 1px solid var(--border)
- border-radius: var(--radius-lg)
- padding: var(--space-6)
- hover: transform translateY(-4px) + box-shadow: var(--shadow-lg)

### 11.3 输入框 (Input)

- background: var(--background-tertiary)
- border: 1px solid var(--border)
- border-radius: var(--radius-md)
- padding: var(--space-3) var(--space-4)
- color: var(--text-primary)
- focus: border-color: var(--primary) + box-shadow

### 11.4 导航栏 (Navbar)

- position: fixed, top: 0
- height: 64px
- background: rgba(10, 15, 28, 0.8)
- backdrop-filter: blur(10px)
- border-bottom: 1px solid var(--border)
- padding: 0 var(--space-6)

### 11.5 标签页 (Tabs)

- display: flex, gap: var(--space-1)
- border-bottom: 1px solid var(--border)
- padding: 0 var(--space-4)
- active: color: var(--primary) + border-bottom-color: var(--primary)

### 11.6 徽章 (Badge)

- display: inline-flex
- padding: var(--space-1) var(--space-2)
- font-size: var(--text-xs)
- font-weight: var(--font-medium)
- border-radius: var(--radius-full)

**样式变体:**
- badge-primary: background rgba(59, 130, 246, 0.2), color var(--primary)
- badge-success: background rgba(16, 185, 129, 0.2), color var(--success)
- badge-warning: background rgba(245, 158, 11, 0.2), color var(--warning)

### 11.7 模态框 (Modal)

**Overlay:**
- position: fixed, inset: 0
- background: rgba(0, 0, 0, 0.7)
- backdrop-filter: blur(4px)

**Modal:**
- background: var(--background-secondary)
- border: 1px solid var(--border)
- border-radius: var(--radius-xl)
- max-width: 500px
- width: 90%

### 11.8 表格 (Table)

**Container:**
- overflow-x: auto
- border: 1px solid var(--border)
- border-radius: var(--radius-lg)

**Table:**
- width: 100%
- border-collapse: collapse

**Header:**
- background: var(--background-tertiary)
- font-weight: var(--font-semibold)
- color: var(--text-secondary)

**Row hover:**
- background: var(--background-tertiary)

---

## 10. 页面布局规范

### 13.1 前台页面结构

```
+-----------------------------------------------------------+
|                        Navbar (64px)                       |
+-----------------------------------------------------------+
|                    Page Hero Section                       |
|                  (min-height: 400px)                       |
+-----------------------------------------------------------+
|                    Main Content Area                       |
|                  (max-width: 1280px)                       |
+-----------------------------------------------------------+
|                        Footer                              |
|                    (min-height: 200px)                     |
+-----------------------------------------------------------+
```

### 13.2 后台管理结构

```
+--------+---------------------------------------------------+
|        |                    Header (64px)                   |
| Sidebar+---------------------------------------------------+
| (240px)|                    Main Content                     |
|        |                                                 |
| Dashboard                                              |
| Agents    |                                                 |
| Blog      |                                                 |
| Tools     |                                                 |
| Labs      |                                                 |
| Settings  |                                                 |
+-----------+-------------------------------------------------+
```

### 13.3 卡片网格布局

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 11. 页面设计规范

### 13.1 Home页面

**Hero Section:**
- 高度: min-height 500px
- 背景: hero-gradient 渐变
- 主标题: text-5xl, font-bold, text-gradient
- 副标题: text-xl, text-secondary
- CTA按钮: primary, lg尺寸

**功能特性区:**
- 3列卡片网格
- 每列: 图标 + 标题 + 描述
- 卡片hover效果: 上浮 + 发光

### 13.2 Agents页面

**Tab导航:**
- 顶部固定
- 6个Tab: LobeChat + 5个Agent
- 激活状态: 底部边框高亮

**内容区域:**
- LobeChat: iframe嵌入, 高度 600px
- Agent卡片: 网格布局 (2列)
- 卡片内容: 图标 + 名称 + 描述 + 状态

### 13.3 Tools页面

**筛选器:**
- 分类标签横向排列
- 选中状态: primary背景

**工具卡片:**
- 图标 (左侧)
- 名称和描述 (中间)
- 访问按钮 (右侧)

### 13.4 Labs页面

**产品卡片:**
- 状态标签 (实验性/预览)
- 媒体展示区 (图片/视频)
- 名称和描述
- 体验按钮

### 13.5 Blog页面

**文章列表:**
- 封面图 + 标题 + 摘要 + 标签 + 发布时间
- 悬停卡片效果

**文章详情:**
- 标题: h1, text-4xl
- 正文: max-width 700px, 行高 1.75
- 标签: badge样式

---

## 12. 深色/浅色模式

### CSS变量切换

**默认深色模式:**
```
:root {
  --background-primary: #0A0F1C;
  --text-primary: #F8FAFC;
}
```

**浅色模式:**
```
.light {
  --background-primary: #F8FAFC;
  --background-secondary: #FFFFFF;
  --text-primary: #1E293B;
  --border: #E2E8F0;
}
```

### 主题切换组件

```tsx
// ThemeToggle.tsx
export function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('light')
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button onClick={toggleTheme} className="btn-ghost icon">
      {theme === 'dark' ? 'Moon' : 'Sun'}
    </button>
  )
}
```

### 初始化主题

```tsx
// 在app/layout.tsx中
useEffect(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light')
  }
}, [])
```

---

## 13. 实现优先级

### MVP阶段 (必须实现)

- [x] 基础色彩系统
- [x] 基础字体系统
- [x] 8px间距系统
- [x] 按钮组件 (primary, secondary, ghost)
- [x] 卡片组件
- [x] 输入框组件
- [x] 导航栏组件
- [x] 深色/浅色模式切换
- [x] 响应式布局

### 增强阶段 (推荐实现)

- [ ] 标签页组件
- [ ] 徽章组件
- [ ] 模态框组件
- [ ] 表格组件
- [ ] 过渡动画
- [ ] 悬停效果
- [ ] 加载状态

### 优化阶段 (可选)

- [ ] 页面过渡动画
- [ ] 骨架屏
- [ ] Toast提示
- [ ] 拖拽排序
- [ ] 复杂的交互动画

---

## 14. 代码规范

### CSS变量定义位置

所有CSS变量在 globals.css 中定义，组件样式使用这些变量。

### 使用示例

```css
/* 按钮样式 */
.my-button {
  background: var(--primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  transition: all var(--transition-base) var(--ease);
}

.my-button:hover {
  background: var(--primary-hover);
  box-shadow: var(--glow-blue);
}
```

### 组件目录结构

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── Tabs.tsx
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── theme/
    ├── ThemeProvider.tsx
    └── ThemeToggle.tsx
```

---

## 15. 验证清单

### 基础验证

- [ ] 深色/浅色模式切换正常
- [ ] 所有组件在桌面端显示正常
- [ ] 所有组件在移动端显示正常
- [ ] 响应式断点正常工作
- [ ] 动画过渡流畅

### 页面验证

- [ ] Home页面Hero区域显示正常
- [ ] Agents页面Tab切换正常
- [ ] Tools页面筛选功能正常
- [ ] Labs页面卡片显示正常
- [ ] Blog页面列表和详情正常

### 组件验证

- [ ] 按钮所有变体正常
- [ ] 卡片悬停效果正常
- [ ] 输入框焦点状态正常
- [ ] 导航栏响应式正常
- [ ] 表格滚动正常

---
---

## 1.1 设计灵感

### 灵感来源

**Checkmarx.dev** - 这个网站最初启发我们追求一种独特的极客美学。深夜刷GitHub Trending时看到的那种暗黑模式、动态效果、极客感十足的AI工具聚合网站，让我们意识到：原来AI工具网站也可以这么"酷"。

**视觉碎片整合**：
- **GitHub的极简** - 功能导向，不做多余装饰
- **Notion的优雅** - 干净的排版，舒适的留白
- **Vercel的科技感** - 现代感十足的渐变和光效

**核心灵感来源**：
- 赛博朋克的夜景，但不是霓虹灯泛滥的那种
- 黑客帝国的代码雨，带有深邃的黑色背景
- 霓虹色的高亮，带有科技感的视觉元素

### 设计愿景

**"AI工具的游乐园"** - 这是我们对Work-Agents的核心定位。这个网站不应该只是列出工具，而应该让用户"玩"起来。我们要做**有灵魂的产品，不是枯燥的产品说明书**。

**视觉词汇**：
- 暗黑色系，但不是死黑，带有紫色或蓝色的渐变
- 字体要用等宽字体显示代码片段，主体文字要清晰易读
- 图标要有科技感，最好有微妙的动画
- 极简主义，但不是苹果那种"性冷淡"
- 科技感，但不冷冰冰
- 动态感，但不是到处都在动

---

## 1.2 情感设计

### 核心情感价值

**第一眼的"wow"感** - 让人印象深刻的第一印象。当用户第一次打开网站时，应该感受到一种与众不同的气质。

**仔细看的"巧思"** - 有深度的细节设计。细看之下，有值得品味的设计细节。

**使用时的"流畅感"** - 顺滑的交互体验。每一个操作都应该自然流畅，让用户沉浸其中。

**离开时的"记住它"** - 独特的品牌记忆点。用户离开后，脑海中会留下关于这个网站的独特印象。

### 用户情感体验

**极客归属感** - 为开发者、AI从业者、技术爱好者而设计。极客们看到的第一眼就会感到"这是为我们做的"。

**探索的乐趣** - 发现新工具的惊喜。每一次滚动、点击都应该带来发现新大陆的感觉。

**创造的冲动** - 在Labs中实验、在Blog中分享。看到有趣的工具和实验，会激发用户动手创造的欲望。

**社区连接** - 不是孤立的工具目录，而是有温度的社区。用户能感受到背后有一群热爱技术的同伴。

### 极客精神体现

**理解并掌控工具** - 我们的设计语言要让用户感到他们是工具的主人，而不是被工具束缚。就像Shadcn/UI的设计理念一样：我们不只是使用工具，我们理解并掌控工具。

**理性与美学的平衡** - 既要有技术上的严谨，也要有视觉上的美感。这是极客精神的完美诠释。

---

## 6.1 动态效果详解

### 6.1.1 鼠标视差效果

**实现原则**：
- 视差效果应该是微妙的，不应该喧宾夺主
- 移动端上应该禁用视差效果，避免干扰正常浏览
- 视差响应速度应该足够快，避免明显的延迟感

**实现方式**：
```css
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.layer-back {
  transform: translateZ(-1px) scale(2);
}

.layer-front {
  transform: translateZ(0);
}
```

**适用场景**：
- Hero区域的背景元素
- 页面滚动时的层次感
- 卡片悬浮时的微妙位移

### 6.1.2 按钮粒子效果

**实现原则**：
- 粒子效果应该是即时的，在鼠标进入时立即触发
- 粒子颜色应该与品牌主色调一致
- 粒子数量和扩散范围应该克制，避免过度花哨

**实现方式**：
```css
.btn-particles {
  position: relative;
  overflow: hidden;
}

.btn-particles::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.btn-particles:hover::before {
  transform: translate(-50%, -50%) scale(2);
  opacity: 0.3;
}
```

**适用场景**：
- 主要CTA按钮
- 交互频繁的操作按钮
- 强调品牌色的按钮

### 6.1.3 打字机效果

**实现原则**：
- 打字机效果适用于展示关键信息，如标题、标语
- 打字速度应该适中（约50-80字符/分钟），太快会让人看不清
- 光标闪烁效果应该平滑自然

**实现方式**：
```css
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--primary);
  animation: typing 2s steps(40), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: var(--primary) }
}
```

**适用场景**：
- Hero区域的Slogan
- 工具名称的展示
- 页面加载时的欢迎语

### 6.1.4 呼吸感背景动画

**实现原则**：
- 呼吸效果应该是极其微妙的，只在长时间停留时才能察觉
- 呼吸节奏应该自然，像人呼吸一样（约4-6秒一个周期）
- 呼吸效果不应该影响内容的可读性

**实现方式**：
```css
@keyframes breathe {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.background-breathing {
  animation: breathe 6s ease-in-out infinite;
}
```

**适用场景**：
- Hero区域的渐变背景
- 页面整体的氛围渲染
- 模态框和浮层的背景

### 6.1.5 平滑滚动过渡

**实现原则**：
- 滚动过渡应该平滑，但不应该让人感到"粘滞"
- 滚动行为应该符合用户预期
- 页面跳转时的过渡动画应该一致

**实现方式**：
```css
html {
  scroll-behavior: smooth;
}

.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}
```

### 6.1.6 图标动画

**实现原则**：
- 图标动画应该是微妙的，增强交互反馈
- 动画时长应该短（约150-300ms）
- 相同类型的图标应该有相同的动画模式

**实现方式**：
```css
.icon-hover {
  transition: transform var(--transition-base), color var(--transition-base);
}

.icon-hover:hover {
  transform: rotate(90deg);
}

.icon-bounce {
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

---

## 6.2 动画优先级

### 必须实现的动画（优先级：高）

- **悬停效果** - 按钮、卡片的悬停反馈
- **焦点状态** - 输入框、选择器的焦点高亮
- **加载状态** - 骨架屏、加载动画
- **页面过渡** - 页面切换时的淡入淡出

### 推荐实现的动画（优先级：中）

- **滚动动画** - 元素进入视口时的入场动画
- **视差效果** - Hero区域的背景视差
- **打字机效果** - 关键标题的动态展示
- **呼吸背景** - 氛围渲染的背景动画

### 可选实现的动画（优先级：低）

- **粒子效果** - 按钮的粒子光晕
- **复杂交互动画** - 拖拽排序、复杂手势
- **3D效果** - CSS 3D变换（性能敏感）

---

## 11.1 页面设计指南

### 11.1.1 Home页面设计指南

**情感定位**：
- 第一次接触用户的地方，需要给用户"wow"的第一印象
- 传达"AI工具游乐园"的概念，激发探索欲望
- 展示极客美学，让目标用户产生归属感

**Hero区域设计**：
- **视觉焦点**：大标题使用渐变文字效果，吸引注意力
- **动态效果**：打字机效果展示核心Slogan
- **背景**：使用呼吸感渐变背景，但保持深色基调
- **CTA按钮**：使用粒子效果增强点击反馈
- **响应式**：移动端简化动画效果

**功能特性区设计**：
- **卡片布局**：3列网格，每列展示一个核心价值
- **图标设计**：科技感图标，带有微妙的悬浮动画
- **悬停效果**：卡片上浮+发光效果
- **文字排版**：标题使用加粗显示，描述文字使用清晰的行高

**情感化元素**：
- 在适当位置加入极客相关的彩蛋或小动画
- 使用代码片段装饰，传达极客身份认同
- 整体氛围应该是"欢迎来到游乐园"，而非"欢迎使用工具"

### 11.1.2 Agents页面设计指南

**情感定位**：
- 展示AI助手的"个性"，让用户感受到每个Agent都是独特的
- 传达"AI伙伴"而非"AI工具"的概念
- 激发用户与Agent互动的欲望

**Tab导航设计**：
- **视觉区分**：使用不同的颜色或图标区分不同的Agent
- **动画效果**：Tab切换时使用平滑的过渡效果
- **状态反馈**：当前激活的Tab应该有明显的视觉反馈

**Agent卡片设计**：
- **个性化展示**：每个Agent卡片应该有独特的配色或图标
- **状态指示**：清晰展示Agent的在线状态和专长领域
- **交互反馈**：卡片悬停时显示更多信息
- **背景动画**：Agent卡片可以有极其微妙的呼吸效果

**LobeChat集成区域**：
- **视觉融合**：iframe嵌入区域应该与整体设计风格融合
- **加载状态**：使用骨架屏显示加载过程
- **错误处理**：优雅地处理加载失败的情况

**情感化元素**：
- 每个Agent的描述文案应该有"个性"，而非冰冷的说明
- Agent切换时可以有微妙的过渡动画
- 可以考虑加入Agent的"心情"或"状态"展示

### 11.1.3 Tools页面设计指南

**情感定位**：
- 传达"工具生态系统"的概念，而非静态列表
- 激发用户发现新工具的惊喜感
- 让工具探索成为一种"寻宝"体验

**筛选器设计**：
- **分类标签**：横向排列，选中状态使用主色调高亮
- **动画效果**：标签切换时使用平滑过渡
- **响应式**：移动端改为可滑动的标签栏

**工具卡片设计**：
- **视觉层次**：图标→名称→描述→操作按钮，层次分明
- **悬停效果**：卡片悬停时轻微上浮，边框发光
- **图标设计**：使用科技感图标，可以有微妙的脉冲效果
- **操作按钮**：悬停时显示粒子光晕效果

**搜索体验**：
- **即时反馈**：搜索结果实时更新，带有淡入效果
- **空状态设计**：搜索无结果时显示友好的提示和推荐
- **搜索历史**：记录用户的搜索习惯，但不过度打扰

**情感化元素**：
- 热门工具可以使用"火焰"或"NEW"标签制造稀缺感
- 工具使用次数可以作为一种社交证明
- 可以加入"猜你喜欢"的智能推荐

### 11.1.4 Labs页面设计指南

**情感定位**：
- 传达"创意试验田"的概念，激发实验精神
- 展示"失败也是学习"的态度
- 营造一种"大胆尝试"的氛围

**产品卡片设计**：
- **状态标签**：Live/Beta/Prototype/Experimental，不同状态不同颜色
- **媒体展示**：高质量的产品预览图或视频
- **悬停效果**：卡片悬停时显示更多信息和使用数据
- **交互按钮**："体验"按钮应该有强烈的点击反馈

**氛围营造**：
- **背景效果**：可以使用更实验性的背景，如粒子效果
- **色彩运用**：可以使用更鲜艳的渐变，传达实验精神
- **动画节奏**：整体动画节奏可以更快，传达活跃感

**情感化元素**：
- 展示"失败的项目"作为学习案例，传达"敢于尝试"的精神
- 可以加入用户提交和社区贡献的展示
- 每个实验产品可以有一个"背后的故事"展示区

### 11.1.5 Blog页面设计指南

**情感定位**：
- 传达"AI探索者联盟"内部刊物的概念
- 让阅读成为一种享受，而非信息获取
- 建立社区连接感

**文章列表设计**：
- **封面图**：高质量的AI生成艺术配图
- **标题排版**：大字体、加粗、带有渐变效果
- **摘要展示**：控制字数，使用省略号提示更多内容
- **悬停效果**：文章卡片悬停时封面图有轻微放大效果

**阅读体验**：
- **正文排版**：最佳阅读宽度65-75字符，行高1.75
- **代码高亮**：与整体设计风格一致的代码高亮
- **目录导航**：侧边栏目录，滚动时高亮当前章节
- **阅读进度**：顶部显示阅读进度条

**情感化元素**：
- 文章开头可以加入与内容相关的艺术化引入
- 重要观点可以使用独特的排版突出
- 文章末尾可以加入"延伸阅读"和"讨论邀请"

---

## 16. 避免的样式

### 视觉风格避免

**避免过于花哨的渐变**：
- 渐变应该是微妙的服务于氛围，而非视觉干扰
- 避免在浅色背景上使用强烈渐变
- 避免过多的渐变层叠使用

**避免过多的动画导致分散注意力**：
- 动画应该服务于交互反馈，而非装饰
- 避免同时有多个动画元素在动
- 避免使用过快或过于闪烁的动画

**避免过于"SaaS化"的设计语言**：
- 避免千篇一律的组件样式
- 避免过度依赖第三方组件库的默认样式
- 避免"流水线"式的设计语言

**避免像教科书一样的刻板布局**：
- 避免中规中矩的卡片网格
- 避免对称到无聊的排版
- 避免没有任何惊喜的页面结构

### 交互设计避免

**避免过度设计的动效**：
- 动效应该流畅但不拖沓
- 避免过于复杂的交互动画
- 避免为了炫技而添加的动画

**避免不一致的交互反馈**：
- 相同类型的操作应该有相同的反馈
- 避免某些按钮有悬停效果而有些没有
- 避免视觉反馈与实际操作不符

**避免忽视性能的设计**：
- 避免在移动端使用复杂的动画
- 避免大量的DOM操作影响性能
- 避免使用可能导致卡顿的视觉效果

### 设计原则底线

**永远不要忘记**：
- 可读性是第一位的，任何视觉效果都不能牺牲可读性
- 性能是基础，优雅的动画如果导致卡顿就不优雅了
- 一致性是关键，整个网站的视觉语言应该统一
- 用户体验是目标，所有的设计决策都应该服务于用户体验

---

## 17. 学习与迭代

### 设计系统维护

**定期审视**：
- 每季度审视设计系统的一致性
- 检查是否有过度设计或设计债务
- 收集用户反馈，持续优化

**迭代原则**：
- 小步迭代，避免大改
- 先在小范围验证新设计
- 保持设计语言的连贯性

### 灵感来源

**持续学习**：
- 关注优秀的设计案例
- 研究新兴的设计趋势
- 但不要盲目跟风

**灵感库**：
- 建立本地灵感收集库
- 定期整理和回顾
- 将灵感转化为适合项目的设计

---

## 18. 验证清单（增强版）

### 基础验证

- [ ] 深色/浅色模式切换正常
- [ ] 所有组件在桌面端显示正常
- [ ] 所有组件在移动端显示正常
- [ ] 响应式断点正常工作
- [ ] 动画过渡流畅，无卡顿
- [ ] 可读性不受动画效果影响

### 情感体验验证

- [ ] 用户第一次访问能感受到"wow"感
- [ ] 极客用户能感受到归属感
- [ ] 探索过程有发现的乐趣
- [ ] 离开后能记住网站的特色
- [ ] 没有过于花哨或分散注意力的视觉效果

### 页面验证

- [ ] Home页面Hero区域视觉效果突出
- [ ] Home页面功能特性区卡片有悬停效果
- [ ] Agents页面Tab导航切换流畅
- [ ] Agents页面Agent卡片有"个性"展示
- [ ] Tools页面筛选和搜索体验顺畅
- [ ] Tools页面工具卡片视觉层次清晰
- [ ] Labs页面产品状态标签清晰可辨
- [ ] Labs页面氛围传达"实验"精神
- [ ] Blog文章列表封面图显示正常
- [ ] Blog文章阅读体验舒适

### 组件验证

- [ ] 按钮粒子效果触发正常
- [ ] 打字机效果展示完整
- [ ] 呼吸背景动画流畅
- [ ] 图标悬停动画正确
- [ ] 视差效果响应正常
- [ ] 页面过渡动画正常

---

## 19. 视觉稿参考 (High-Fidelity Mockups)

所有生成的 4K 高保真设计稿均存储于 `frontend/design-assets/pages/` 目录下。

### 19.1 首页 (Home)
- **文件名**: `home-desktop.png`, `home-mobile.png`
- **设计重点**: 
  - Hero 区域强烈的电光蓝与霓虹紫粒子动效。
  - 现代玻璃态 (Glassmorphism) 导航栏。
  - 极简且极客感十足的排版。

### 19.2 Agents 集成页
- **文件名**: `agents-desktop.png`, `agents-mobile.png`
- **设计重点**: 
  - 顶部标签式导航（LobeChat + 5个AI秘书）。
  - 卡片采用全玻璃态模糊，带有霓虹发光边框。
  - 全新的全息图形和状态指示器。

### 19.3 工具页面 (Tools)
- **文件名**: `tools-desktop.png`, `tools-mobile.png`
- **设计重点**: 
  - 极简的分类筛选药丸栏。
  - 严谨的网格布局，背景点缀电路纹理。
  - 鼠标悬停时的卡片脉冲式发光。

### 19.4 实验室页面 (Labs)
- **文件名**: `labs-desktop.png`, `labs-mobile.png`
- **设计重点**: 
  - **故障艺术 (Glitch Art)**: 处理标题和边框。
  - **极简极客风**: 结合酸性绿、电光粉等高饱和度霓虹色。
  - **数字噪点**: 背景包含微妙的扫描线和数字干扰效果。

### 19.5 博客页面 (Blog)
- **文件名**: `blog-desktop.png`, `blog-mobile.png`
- **设计重点**: 
  - **双栏布局**: 左侧主内容，右侧固定 TOC。
  - **代码高亮**: 采用 Tomorrow Night 风格，配合 JetBrains Mono 字体。
  - **内容层次**: 使用优雅的衬线体大标题与无衬线体正文结合。

---

## 20. 设计规范速查 (Design Cheat Sheet)

| 类别 | 规范值 | 说明 |
| :--- | :--- | :--- |
| **主背景** | `#0A0F1C` | 深邃极客黑 |
| **强调蓝** | `#3B82F6` | Electric Blue |
| **强调紫** | `#8B5CF6` | Neon Purple |
| **标题字体** | `Inter` / `JetBrains Mono` | 现代/极客 |
| **代码字体** | `JetBrains Mono` | 极客首选 |
| **圆角** | `8px` / `12px` | 标准现代感 |
| **模糊** | `backdrop-blur(10px)` | 玻璃态核心 |

---
