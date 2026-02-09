# 项目实施路线图 (Roadmap) - Work Agents

> **版本**: v1.1
> **状态**: 实施中
> **基于文档**: [PRD v1.1](./PRD.md)
> **最后更新**: 2026-02-09

## 🟢 阶段 1: 基础设施与 UI 核心引擎 (Week 1)

**目标**: 构建符合 Genesis 规范的基础底座。

- [x] **1.1 全局设计令牌配置**
  - 配置 `tailwind.config.js`：注入 Abyss Black, Cyber-Cyan, Neon-Purple 等颜色令牌。
  - 设置字体栈：Outfit (Heading) & Inter (Body)。
- [x] **1.2 核心组件库 (v-ui) 构建**
  - [x] `GlassCard`: 玻璃拟态基础容器。
  - [x] `NeonButton`: 多色霓虹按钮，带交互辉光。
  - [x] `ParticleBg`: Hero 区粒子背景引擎。
  - [x] `OnlinePulse`: 实时状态动态灯。
- [x] **1.3 全局 Layout (WEB 前台)**
  - 实现 **Strict Dark Mode** 布局。
  - 完成 `Header` (含动态认证 UI 占位) 与 `Footer` (含移动端 Tab)。
- **验证点**: 运行 `lint` 脚本，确保所有基础组件符合 `react-best-practices`。

## 🔵 阶段 2: 核心页面开发 - Web 前台 (Week 2-3)

**目标**: 100% 像素级还原前台各个关键页面。

- [x] **2.1 Home (品牌着陆页)**
  - 实现 Hero 区 3D 协作场景与 fadeInUp 动效。
  - **验证**: 与 `home-desktop.png` 对比，UI 还原度评分 ≥ 95。
- [x] **2.2 Agents (智能体工作台)**
  - 实现 50:50 镜像分栏布局。
  - 集成 LobeChat iframe 并测试 postMessage 通信。
  - **验证**: 与 `agents-desktop.png` 对比，UI 还原度评分 ≥ 95。
- [x] **2.3 Tools & Labs (极客工具集与实验室)**
  - 实现电路板纹理背景 (Tools) 与 Glitch 故障艺术特效 (Labs)。
  - **验证**: UI 还原度评分 ≥ 95。
- [x] **2.4 Blog (文章展示)**
  - 实现阅读优化排版与桌面端 TOC 目录。

## 🟡 阶段 3: 后端引擎与实时协作 (Week 4)

**目标**: 实现智能体逻辑与 WebSocket 状态同步。

- [ ] **3.1 核心智能体逻辑实现**
  - News Agent: 定时爬取与摘要输出。
  - Outfit Agent: 实时穿搭生成流水线。
  - Task/Life/Review 智能体核心算法。
- [ ] **3.2 WebSocket 通讯总线**
  - 实现后端状态向前端 `OnlinePulse` 组件的实时推送。
- [ ] **3.3 数据库加密与持久化**
  - 实现 Life Agent 健康数据的 AES 加密存储。

## 🟠 阶段 4: 管理后台与内容生产 (Week 5)

**目标**: 完成高效的内容与系统管理工具。

- [ ] **4.1 Admin Layout 构建**
  - 实现侧边栏导航与 **Adaptive Theme** (支持深/浅色切换)。
- [ ] **4.2 内容管理系统**
  - 实现 Blog 列表管理与 Markdown 实时预览编辑器。
- [ ] **4.3 Agent 配置中心**
  - 实现智能体 Prompt、模型与参数的在线热配置。

## 🔴 阶段 5: 优化、验证与交付 (Week 6)

**目标**: 性能达标与最终验收。

- [ ] **5.1 性能深度优化**
  - 确保 LCP < 1.5s，执行 WebP 图片转换。
- [ ] **5.2 全量视觉回归自审**
  - 调用 `ui-ux-pro-max-skill` 对所有页面进行最终打分。
- [ ] **5.3 生产环境部署方案**
  - 整理 Docker Compose 生产环境配置。

---

**备注**:

- 每个 UI 模块开发均紧随 `ui-ux-pro-max-skill` 的设计对齐。
- 所有代码提交前必须执行 `react-best-practices` 审计。
