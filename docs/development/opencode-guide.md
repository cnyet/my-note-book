# OpenCode 实用指南：命令驱动的工作流与 Sisyphus Squad 协作

> **核心哲学**: 命令驱动交互 (Command-Driven), Sisyphus Squad 代理协作 (Squad Integration), UltraWork 自主执行 (Autonomous Execution), 工作流闭环 (Workflow Loop).

## 1. 概述

OpenCode 是一套现代化的**工作流与命令系统**，旨在简化重复任务、标准化工序并精准调度 AI 代理。通过斜杠命令（Slash Commands），我们可以快速触发复杂的自动化流程。本指南涵盖 OpenCode 的核心功能、现代命令系统、自定义扩展以及与 Sisyphus Squad 的集成协作，支持 UltraWork 自主开发模式。

## 2. 核心哲学

OpenCode 的设计围绕四个核心概念：

### 2.1 命令驱动交互 (Command-Driven Interaction)
- 使用标准化的斜杠命令 `/command` 来触发复杂操作
- 命令抽象了底层复杂性，提供简洁的接口
- 支持参数传递和上下文感知操作

### 2.2 Sisyphus Squad 专家代理协作 (Squad Agent Integration)
- 为不同任务类型提供专业的 Sisyphus Squad 代理
- 代理具有不同的专业能力和权限级别
- 代理可以协同工作完成复杂任务

### 2.3 UltraWork 自主执行 (Autonomous Execution)
- 支持长时间自主执行直到任务完成
- 内置质量保证和验证机制
- 记忆累积和知识沉淀功能

### 2.4 工作流闭环 (Workflow Loop)
- 自动管理工作从开始到完成的整个生命周期
- 包含握手、计划、执行、验证、归档等阶段
- 确保工作质量和可追溯性

## 3. 现代命令系统

OpenCode 提供了一系列内置命令和现代工作流程命令，用于会话管理、环境配置和工作流控制：

### 3.1 会话管理命令

| 命令 | 用途 | 说明 |
| :--- | :--- | :--- |
| `/init` | 初始化环境 | 在当前目录生成或更新配置文件 |
| `/help` | 显示帮助信息 | 查看所有可用命令和快捷键 |
| `/new` | 开启新会话 | 清除当前对话上下文，保留系统提示词 |
| `/sessions` | 会话管理 | 列出并切换历史会话 (`/resume`, `/continue`) |
| `/compact` | 压缩会话 | 总结当前对话，减少 Token 消耗 (`/summarize`) |
| `/export` | 导出对话 | 将当前会话导出为 Markdown 文件 |

### 3.2 现代工作流命令

| 命令 | 用途 | 说明 |
| :--- | :--- | :--- |
| `/ulw-loop` | 超工作循环 | 启动持续自主开发直到完成 |
| `/ulw` | 超工作模式 | 无停止的自主执行 |
| `/ultrathink` | 深度思考 | 高级规划和策略制定 |
| `/analyze` | 深度分析 | 对目标元素进行全面分析 |
| `/investigate` | 调查 | 深入调查问题原因 |

### 3.3 OpenSpec 集成命令

| 命令 | 用途 | 说明 |
| :--- | :--- | :--- |
| `/openspec-proposal` | 创建提案 | 启动规范驱动开发流程 |
| `/openspec-apply` | 应用变更 | 实施 OpenSpec 提案 |
| `/openspec-archive` | 归档变更 | 归档完成的 OpenSpec 变更 |
| `/opsx:new` | 新变更 | 快速创建新变更提案 |
| `/opsx:ff` | 快速前进 | 一键创建所有规格工件 |
| `/opsx:apply` | 应用变更 | 执行变更实现过程 |
| `/opsx:archive` | 归档变更 | 完成并归档变更 |
| `/opsx:validate` | 验证 | 严格验证变更质量 |

### 3.4 Sisyphus Squad 管理命令

| 命令 | 用途 | 说明 |
| :--- | :--- | :--- |
| `/ralph-loop` | Ralph 循环 | 启动自引用开发循环直到完成 |
| `/cancel-ralph` | 取消 Ralph | 停止活跃的 Ralph 循环 |
| `/stop-continuation` | 停止延续 | 停止所有延续机制 |

### 3.5 环境与配置命令

| 命令 | 用途 | 说明 |
| :--- | :--- | :--- |
| `/models` | 模型列表 | 查看和切换当前可用的 LLM 模型 |
| `/theme` | 切换主题 | 修改 TUI 界面视觉风格 |

## 4. 自定义命令定义

开发者可以通过在项目中创建配置文件来定义自定义命令。

### 4.1 目录规范

- **项目级**: `./.opencode/commands/*.md` (当前项目生效)
- **全局级**: `~/.config/opencode/commands/*.md` (所有项目生效)

### 4.2 定义模板 (Markdown)

```markdown
---
description: 命令的简短描述（显示在补全列表中）
agent: build                  # 指定执行代理 (build, plan, oracle 等)
model: anthropic/claude-3-5   # 可选：覆盖默认模型
subtask: true                 # 可选：强制开启子任务模式
timeout: 300                  # 可选：命令超时时间（秒）
---

<UserRequest>
  $ARGUMENTS                  # 接收用户输入的参数
</UserRequest>

**Guardrails**
- 约束条件 1
- 约束条件 2

**Steps**
1. 步骤 1: 读取 $1 (第一个参数)
2. 步骤 2: 执行具体逻辑
3. 步骤 3: 验证结果
```

### 4.3 参数与占位符

- `$ARGUMENTS`: 捕获命令后的所有输入字符串
- `$1, $2, ...`: 按空格分割的参数索引
- `!command`: 在 Prompt 中嵌入 shell 命令的输出 (e.g., `!ls src`)
- `@filename`: 显式在 Prompt 中包含特定文件内容
- `#section`: 引用特定文档章节

## 5. Sisyphus Squad 代理协作模式

OpenCode 集成了现代 Sisyphus Squad 的专业代理协作系统，每个代理在 5-phase workflow 中扮演特定角色：

### 5.1 Sisyphus Squad 代理类型与权限矩阵

| 代理类型 | 主要职能 | 权限级别 | 典型用途 | 5-Phase Role |
| :--- | :--- | :--- | :--- | :--- |
| **Sisyphus** | 任务协调、状态管理、握手 | 全局协调、状态维护 | 握手协调、状态跟踪、归档 | Handshake (Phase 1) & Archive (Phase 5) |
| **Prometheus** | 规划与方案生成 | 写入 `openspec/changes/` | 规划、提案、需求分析 | Plan (Phase 2) |
| **Hephaestus** | 逻辑执行与实现 | 全局文件修改、Shell 执行 | 编码实现、Debug、测试 | Execute (Phase 3) |
| **Oracle** | 架构咨询、质量审核 | **只读**、深度推理 | 架构咨询、疑难审计、验证 | Verify (Phase 4) |
| **Atlas** | 知识整合、上下文管理 | 文件搜索、信息检索 | 上下文分析、信息检索 | Support (All Phases) |
| **build** | 通用构建与实现 | 读写文件、执行 Shell 命令 | 代码生成、文件修改、构建任务 | General Purpose |
| **plan** | 规划与分析 | 只读权限、深度分析 | 任务分解、架构分析、风险评估 | General Purpose |
| **general** | 通用任务 | 中等权限级别 | 多步任务执行、跨文件操作 | General Purpose |

### 5.2 Sisyphus Squad 选择指南

选择合适的代理类型取决于任务特性：

**使用 `Sisyphus` 代理当:**
- 需要任务协调和状态管理
- 进行握手过程和意图澄清
- 执行归档和总结操作

**使用 `Prometheus` 代理当:**
- 创建规划和方案
- 生成 OpenSpec 工件
- 进行需求分析和范围定义

**使用 `Hephaestus` 代理当:**
- 需要修改代码或配置文件
- 执行构建或测试命令
- 实现具体的业务逻辑

**使用 `Oracle` 代理当:**
- 需要架构级别的建议
- 解决复杂的逻辑问题
- 进行质量审核和验证

**使用 `Atlas` 代理当:**
- 需要上下文分析
- 进行信息检索
- 执行知识整合任务

**使用 `build` 代理当:**
- 需要通用的代码构建任务
- 执行文件操作

**使用 `plan` 代理当:**
- 需要分析但无需修改文件

**使用 `general` 代理当:**
- 执行混合类型的多步骤任务

## 6. UltraWork 方法论集成

现代 OpenCode 完全集成了 UltraWork 方法论，提供自主开发能力：

### 6.1 UltraWork 核心原则

- **Self-Managing**: AI agents independently coordinate and execute
- **Continuous**: Loops continue until 100% completion
- **Quality-Assured**: Built-in validation at each step
- **Memory-Preserving**: Knowledge accumulated in `.sisyphus/notepads/`

### 6.2 并行任务执行

OpenCode 支持并行执行多个独立任务：

```bash
# 并行执行多个命令
/delegate_task category="visual-engineering" prompt="设计 UI 组件"
/delegate_task category="ultrabrain" prompt="解决复杂算法问题"
/delegate_task category="quick" prompt="修复简单错误"
```

### 6.3 工作流自动化

通过组合命令可以创建复杂的工作流，支持 Sisyphus 5-phase workflow：

1. **握手阶段**: 使用 `/ralph-loop` 或 Sisyphus 开始握手
2. **规划阶段**: 使用 `/openspec-proposal` 创建规范
3. **执行阶段**: 使用 `/ulw-loop` 或 `/openspec-apply` 实现
4. **验证阶段**: 使用 `/validate` 或 Oracle 代理验证
5. **归档阶段**: 使用 `/openspec-archive` 归档完成

## 7. 最佳实践

### 7.1 对于人类用户 (Human Users)

1. **明确意图**: 在使用命令时尽可能提供清晰的参数和上下文
2. **组合使用**: 合理搭配内置命令以提高效率
3. **命名规范**: 为自定义命令使用清晰、一致的命名约定
4. **文档化**: 为复杂的自定义命令编写使用说明
5. **UltraWork 优先**: 对于复杂任务，优先使用 `/ulw-loop` 或 `/openspec-*` 命令获得自主执行能力

### 7.2 对于 AI 代理 (AI Agents)

1. **Sisyphus Squad Integration**: 启动适当的 Sisyphus Squad 代理来处理不同类型的任务
2. **Phase Awareness**: 理解当前处于 5-phase workflow 的哪个阶段并相应行动
3. **上下文感知**: 始终考虑当前项目和会话上下文
4. **逐步验证**: 在执行重要操作前先验证假设
5. **状态汇报**: 定期汇报工作进度和遇到的问题
6. **错误恢复**: 具备处理失败并尝试替代方案的能力
7. **Memory Preservation**: 将重要的学习保存到 `.sisyphus/notepads/` 以保持会话连续性

### 7.3 通用最佳实践

1. **渐进式复杂度**: 从简单命令开始，逐步使用复杂功能
2. **参数化**: 尽可能使用参数而非硬编码值
3. **可重用性**: 设计可重用的自定义命令
4. **安全性**: 验证输入参数，防止意外操作
5. **质量保证**: 在命令执行结束时包含 `lsp_diagnostics` 或测试验证

## 8. 常见用例

### 8.1 代码审查工作流
```bash
# 1. 初始化审查任务
/new
# 2. 加载待审查代码
@src/main.ts
# 3. 执行审查（使用 Oracle 代理）
/oracle prompt="审查这段代码的安全性和性能"
# 4. 导出结果
/export
```

### 8.2 OpenSpec 驱动的功能开发流程
```bash
# 1. 创建功能提案（使用 Prometheus）
/openspec-proposal "为用户管理添加软删除功能"
# 2. 实现功能（使用 Hephaestus）
/openspec-apply [change-id]
# 3. 启动自主执行循环
/ulw-loop
# 4. 验证实现
/openspec-archive [change-id]
```

### 8.3 UltraWork 自主开发流程
```bash
# 1. 启动自主开发循环
/ulw-loop
# 2. AI 代理将自主完成整个开发任务
# 3. 任务完成后返回 <promise>DONE</promise>
```

### 8.4 文档生成
```bash
# 生成 API 文档
/delegate_task category="quick" prompt="基于代码生成 TypeScript 接口文档" @src/api/types.ts
# 导出为不同格式
/export --format=markdown
```

## 9. 故障排除

### 9.1 常见问题

**命令未识别**: 确保使用正确的语法 `/command`，检查拼写
**权限不足**: 检查代理类型是否具有执行所需操作的权限
**参数错误**: 验证提供的参数是否符合命令要求
**Squad Communication Error**: 确保 Sisyphus Squad 代理正常运行

### 9.2 调试技巧

- 使用 `/help` 查看命令帮助
- 检查 `.opencode` 配置目录中的日志
- 尝试使用更简单的命令确认环境正常
- 检查 `.sisyphus/notepads/` 中的持久化记忆

## 10. 扩展与定制

### 10.1 自定义 Sisyphus Squad 代理类型
可以通过配置文件扩展新的 Sisyphus Squad 代理类型，定义其权限和行为模式。

### 10.2 集成外部工具
支持通过插件系统集成外部开发工具和 CI/CD 流程。

### 10.3 自动化脚本
可编写自动化脚本来批量执行 OpenCode 命令序列，支持 Sisyphus 5-phase workflow。

## 11. 参考资源

- [Sisyphus 工作流指南](./sisyphus-guide.md)
- [OpenSpec 工作流指南](./openspec-guide.md)
- [OpenCode 官方文档](https://opencode.ai/docs)
- 社区论坛和支持渠道
- 示例项目和最佳实践案例
- 命令索引和 API 参考

---

**最后更新**: 2026-02-05