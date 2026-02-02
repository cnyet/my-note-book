# Sisyphus 工作流指南 (UltraWork Edition)

> [!IMPORTANT]
> **AI 助手行为准则**: 当你参与本项目开发时，请务必以 **Sisyphus (Team Leader)** 的身份审视全局，并严格遵守 `.sisyphus/` 协议。在开始任何非平凡任务前，请先调用 `ulw` 模式思维：并行探索、深度执行、闭合验证。

> **归属**: OhMyOpenCode x Work-Agents  
> **核心咒语**: `ultrawork` (或 `ulw`) —— 不懈执行，直到 100% 完成。

## 概述

`.sisyphus/` 不仅仅是一个目录，它是智能体的“推石记录仪”。本指南参考了 `OhMyOpenCode` 的核心哲学：**给智能体优秀的工具和可靠的队友，它们就能产出与人类无异的顶级代码。**

## 目录结构

```
.sisyphus/
├── plans/           # 📋 实施计划 (基于 OpenSpec 拆解，只读)
├── notepads/        # 📝 记忆资产 (learnings, decisions, fixes)
└── drafts/          # 📄 临时草稿 (方案预演)
    ├── planning.md
    └── research.md
```

---

## 目录详解

### 1. plans/ - 实施计划

**作用**: 存放官方项目计划，包含任务清单、阶段划分、验收标准。

**特点**:
- **神圣不可侵犯**: 只读文件，Agent 不可修改
- **Orchestrator 专属**: 只有 Atlas（协调者）有权更新
- **单一来源**: 所有任务以计划为准

## 阶段 1: 基础设施搭建

- [ ] 初始化 Next.js 项目
- [ ] 配置 TypeScript
- [ ] 安装 Shadcn/UI

**验收标准**:
- [ ] http://localhost:3000 可访问
- [ ] 无编译错误
```

---

### 2. notepads/ - 学习笔记

**作用**: 累积跨会话的知识、经验、决策，避免重复踩坑。

**特点**:
- **追加写入**: 永远只添加，不覆盖
- **跨会话共享**: 关闭再打开，知识仍在
- **分类清晰**: learnings、issues、decisions、problems

**4 种笔记类型**:

| 文件 | 内容 | 示例 |
|------|------|------|
| `learnings.md` | 成功的模式和方法 | "使用 Shadcn/UI 后包体积减少 80%" |
| `issues.md` | 遇到的问题和解决方案 | "Phase 2 发现 OAuth 配置缺失，已补充" |
| `decisions.md` | 架构决策和理由 | "选择 Shadcn/UI 而非 Bootstrap 5，因为..." |
| `problems.md` | 待解决的技术债务 | "WebSocket 计数器尚未实现，需 Phase 6 处理" |

**格式规范**:
```markdown
## [TIMESTAMP] Task: {task-id}
{content}
```

---

### 3. drafts/ - 草稿目录

**作用**: 存放探索性、临时性的思考内容。

**特点**:
- 随时可创建、删除
- 供 Prometheus（规划者）使用
- 验证后可移动到 plans/ 或删除

---

## Agent 关系图

### Agent 角色矩阵

### 4.1 智能体特遣队 (The Squad)

| Agent | 代号 | 核心哲学与模型映射 | 职责 |
|-------|------|-------------------|------|
| **Sisyphus** | **主智能体** | **Opus 4.5 High** | 团队领袖，受 TODO 列表约束，不推完“巨石”决不停止。 |
| **Hephaestus** | **工匠** | **GPT 5.2 Codex Medium** | 自主深度工作者。目标导向，行动前深入探索，拒绝 AI 垃圾代码。 |
| **Oracle** | **先知** | **GPT 5.2 Medium** | 高智商战略支援。当 Sisyphus 陷入循环或遇到设计瓶颈时提供决策。 |
| **Frontend Eng** | **界面官** | **Gemini 3 Pro** | 专项处理 UI/UX，实现 Genesis 级动效与响应式布局。 |
| **Librarian** | **馆长** | **Sonnet 4.5** | 源码探索与文档解析。通过并行后台任务保持主智能体上下文精简。 |
| **Explorer** | **探路者** | **Haiku 4.5** | 上下文感知的快速 Grep，为团队绘制代码库地图。 |

---

### 4.2 核心工作流：UltraWork (ULW)

1. **并行映射 (Mapping)**: Sisyphus 不会直接读取所有文件以节省上下文。他派遣 **Explorer** 和 **Librarian** 并行开启后台任务，为团队绘制“代码地图”。
2. **深度执行 (Deep Action)**: **Hephaestus** 接收“目标”而非“指令”。他执行行动前深度探索，并在写代码前进行现有模式匹配，确保风格一致。
3. **策略破局 (Strategic Support)**: 若 Sisyphus 陷入死循环或技术瓶颈，系统自动召唤 **Oracle** 进行高维架构审计。
4. **TODO 闭环**: 所有任务必须受 TODO 列表强制约束。在获得验证证据证明 100% 完成前，智能体严禁标记任务为已完成。

---

### 4.4 逻辑流 (Mermaid Context)

```mermaid
graph TD
    A[OpenSpec Change] -->|领航| B(Sisyphus: 制定计划)
    B -->|并行驱动| C[Librarian/Explorer: 绘制地图]
    C -->|任务下发| D(Hephaestus: 自主开发)
    D -->|UI/UX 委派| E(Frontend Eng: 视觉实现)
    E -->|自检| F[scripts/lint.sh]
    F -->|验证| G[scripts/test.sh]
    G -->|冲突/瓶颈| H{Oracle: 战略审计}
    
### 4.5 官方使用提示

# Sisyphus (Team Leader) 启动规划

1. 通过 Explorer 扫描全局目录结构。
2. 派遣 Librarian 读取相关的 OpenSpec 规范。
3. 在 .sisyphus/plans/ 创建任务清单。
4. 委派具体任务给 Hephaestus 或 Frontend Eng。

> 1. Sisyphus 不会浪费时间自己寻找文件；他保持主智能体的上下文精简。相反，他向更快、更便宜的模型并行发起后台任务，让它们为他绘制地图。
> 2. Sisyphus 利用 LSP 进行重构；这更确定性、更安全、更精准。
> 3. 当繁重的工作需要 UI 时，Sisyphus 直接将前端任务委派给 Gemini 3 Pro。
> 4. 如果 Sisyphus 陷入循环或碰壁，他不会继续撞墙——他会召唤 GPT 5.2 进行高智商战略支援。
> 5. 在处理复杂的开源框架时？Sisyphus 生成子智能体实时消化原始源代码和文档。他拥有完整的上下文感知。
> 6. 当 Sisyphus 处理注释时，他要么证明它们存在的必要性，要么删除它们。他保持你的代码库整洁。
> 7. Sisyphus 受他的 TODO 列表约束。如果他没有完成开始的工作，系统会强制他回到"推石头"模式。你的任务会被完成，句号。
> 8. 老实说，甚至不用费心读文档。只需写你的提示。包含 'ultrawork' 关键词。Sisyphus 会分析结构，收集上下文，挖掘外部源代码，然后持续推进直到工作 100% 完成。
> 9. 其实，打 'ultrawork' 太费劲了。只需打 'ulw'。就 ulw。喝杯咖啡。你的工作完成了。
> 10. 需要查找什么？它会搜索官方文档、你的整个代码库历史和公共 GitHub 实现——不仅使用 grep，还使用内置的 LSP 工具和 AST-Grep。 
> 11. 在委派给 LLM 时不用担心上下文管理。我已经处理好了。 - OhMyOpenCode 积极利用多个智能体来减轻上下文负担。 - 你的智能体现在是开发团队负责人。你是 AI 经理。
> 12. 它不会停止，直到工作完成。不想深入研究这个项目？没问题。只需输入 'ultrathink'。

---

#### 5.1 上下文与效率
- **减重执行**: 优先派遣后台子智能体（Librarian/Explorer）消化文档和源码，禁止主智能体加载大文件，保持上下文窗口精简。
- **LSP 优先**: 重构代码时必须利用内置 LSP 工具和 AST-Grep，确保变更的确定性和安全性。
- **按需委派**: 繁重的前端任务直接委派给 **Frontend Eng (Gemini 3 Pro)**，架构争议由 **Oracle (GPT 5.2)** 裁决。

#### 5.2 代码质量
- **注释清道夫**: 任何新增注释必须证明其必要性，否则予以删除。目标是产出与顶级人类工程师无法区分的代码。
- **强制自检**: 提交前必运行 `scripts/lint.sh` 和 `scripts/test.sh`。任何未通过静态检查的代码严禁提交。

#### 5.3 故障排查
- **禁止撞墙**: 连续失败 3 次或陷入逻辑循环时，必须触发 `ultrathink` 指令或召唤 **Oracle**。
- **多源搜索**: 查找技术细节时必须覆盖：官方文档、项目历史、公共 GitHub 实现。

---

## 6. 核心协作原则

### 1. Plans 是神圣的

```
✅ 可以: 读取 plans/ 理解任务
❌ 禁止: 修改 plans/ 文件
✅ 只能: Orchestrator (Atlas) 有权更新计划
```

**原因**:
- 避免多人修改导致冲突
- 保证计划的一致性
- 明确责任归属

---

### 2. Notepads 是累积的

```
✅ 正确: 追加新内容到 notepad
❌ 错误: 覆盖已有内容
✅ 正确: 多个 agent 共同维护
```

**原因**:
- 保留历史记录，便于追溯
- 跨会话知识共享
- 避免重复踩坑

---

### 3. Drafts 是临时的

```
✅ 可以: 创建 drafts/ 探索思路
✅ 可以: 删除不再需要的草稿
✅ 可以: 验证后将草稿移动到 plans/
```

**原因**:
- 保持工作区整洁
- 区分已完成和探索中的内容
- 快速迭代，不被临时思路干扰

---

## 使用示例

### 示例 1: 制定任务清单

```markdown
# Sisyphus (Team Leader) 启动规划

1. 通过 Explorer 扫描全局目录结构。
2. 派遣 Librarian 读取相关的 OpenSpec 规范。
3. 在 .sisyphus/plans/ 创建任务清单。
4. 委派具体任务给 Hephaestus 或 Frontend Eng。
```

---

### 示例 2: 记录学习到的经验

```markdown
# Sisyphus 完成任务后追加

## 2026-01-31 Task: setup-nextjs
- 发现 Shadcn/UI 安装需要先配置 Tailwind
- 解决方案: 先运行 npx tailwindcss init
```

---

#### 示例 3: UI 专项委派
```markdown
# Sisyphus 委派任务
- 任务: 实现 Genesis 级高亮按钮。
- 执行者: Frontend Eng (Gemini 3 Pro)。
- 参考: docs/design/ui-ux-spec.md。
```

## 7. 最佳实践 (Best Practices)

### 1. 保持 notepads 更新

```bash
# 完成任务后
echo "## [TIMESTAMP] Task: $TASK_ID" >> learnings.md
echo "- 成功模式: ..." >> learnings.md
```

---

### 2. 及时记录问题

```bash
# 遇到阻塞时
echo "## [TIMESTAMP] Issue: $ISSUE" >> issues.md
echo "- 问题描述: ..." >> issues.md
echo "- 临时方案: ..." >> issues.md
```

---

## 常见问题

### Q1: 普通智能体可以修改 plans/ 吗？

**不可以**。Plans 是只读的，只有 **Sisyphus (Team Leader)** 有权根据 OpenSpec 的变更来更新任务状态或计划内容。其他智能体只负责读取并执行。

---

### Q2: Notepads 会无限增长吗？

理论上会。建议定期归档：
- 将已完成任务的记录移到单独的归档文件
- 定期清理过时的信息

---

### Q3: 如何处理多个 agent 同时写入 notepad？

Notepads 设计为追加写入，不同 agent 写入不同区块，不会冲突。但建议在写入前先阅读已有内容，避免重复。

---

### Q4: Drafts 和 Notepads 有什么区别？

| 特性 | Drafts | Notepads |
|------|--------|----------|
| 目的 | 方案预演 / 临时探索 | 核心成功经验 / 决策记录 |
| 生命周期 | 临时，验证后即删 | 永久，跨会话累积 |
| 访问 | 仅 Sisyphus / Hephaestus | 全体特遣队成员 |
| 格式 | 自由草稿 | 结构化时间戳格式 |

---

## 相关文档

- [项目全局上下文](../../openspec/project.md)
- [架构设计](../design/architecture.md)
- [UI/UX 规范](../design/ui-ux-spec.md)
- [环境运维指南](./setup-guide.md)

---

## 外部文档
- [OhMyOpenCode](https://github.com/code-yeongyu/oh-my-opencode)

**最后更新**: 2026-02-02 (Genesis v1.2 Alignment)
