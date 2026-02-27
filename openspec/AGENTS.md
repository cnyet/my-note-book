# OpenSpec 项目规范

> **语言镜像**: AI 必须使用与用户提示相同的语言响应。

> **执行确认**: 计划确认后，必须询问"可以开始执行吗？"并等待用户明确指令"开始执行"。

## 快速清单

| 任务     | 命令                          |
| -------- | ----------------------------- |
| 列出规范 | `openspec spec list --long`   |
| 列出变更 | `openspec list`               |
| 查看详情 | `openspec show <id> --json`   |
| 验证全部 | `openspec validate --strict`  |
| 归档变更 | `openspec archive <id> --yes` |

**核心规则**:

- ID 格式：`verb-hyphen-lowercase` (如 `add-user-auth`)
- 文件：`proposal.md` + `tasks.md` + `design.md`(复杂变更)
- 语法：`SHALL/MUST` 表示需求，`#### Scenario:` 表示验收标准

---

## 三阶段流程

### 1. 提案创建

1. 读取 `openspec/project.md` 和相关 `specs/`
2. 创建 `openspec/changes/<change-id>/`
3. 编写 `proposal.md`(why/what/impact) + `tasks.md`(原子任务)
4. 运行 `openspec validate <id> --strict`
5. **等待用户批准后再执行**

### 2. 实施

- 按 `tasks.md` 顺序执行，不跳过
- 完成后标记 `- [x]`
- 快速通道：Bug 修复和拼写错误可 bypass 提案

### 3. 归档

1. 确认构建/测试通过
2. 运行 `openspec archive <change-id> --yes`
3. 运行 `openspec validate --strict` 验证全局状态

---

## 规范格式规则

### 增量操作类型

| 类型          | 用途     | 归档行为     |
| ------------- | -------- | ------------ |
| `## ADDED`    | 新增能力 | 追加到主规范 |
| `## MODIFIED` | 变更行为 | 替换现有版本 |
| `## REMOVED`  | 删除功能 | 从主规范删除 |

### 场景格式 (强制)

```markdown
#### Scenario: 场景名称

- **GIVEN** [前置条件]
- **WHEN** [操作]
- **THEN** [预期结果]
```

**关键规则**:

- 必须使用 `#### Scenario:` (四级标题，无粗体)
- 必须使用 `SHALL` 或 `MUST` 关键词
- 修改时必须包含完整块 (标题 + 场景)

---

## 通用开发规范

参考 [`~/.claude/CLAUDE.md`] (全局规范)，包含:

- 文件大小限制 (TS/Python ≤300 行，CSS/HTML ≤400 行)
- 函数复杂度 (≤50 行，≤5 参数，≤3 层嵌套)
- 技术栈规范 (FastAPI, Next.js, SQLAlchemy)
- 安全约束 (禁止硬编码密钥，参数化查询)

---

## 技能优先级 (强制)

AI 必须按以下优先级使用能力:

1. **专用技能**: `playwright`, `git-master`, `frontend-ui-ux`, `prompt-optimization`
2. **专用代理**: 使用 `delegate_task()` 委派给 `oracle`, `librarian`, `prometheus`
3. **集成工具**: LSP, AST-grep, WebFetch
4. **直接实现**: 仅当无专用能力时

**成本权衡**: 估计 <5 分钟或极简单逻辑，优先使用 3 或 4。

---

## 断路器协议

| 触发条件              | 响应                       |
| --------------------- | -------------------------- |
| 同一任务连续失败 3 次 | 停止尝试，生成诊断报告     |
| 执行时间超时 2 倍     | 进入待命状态，请求人工干预 |

---

> **核心原则**: 规范是唯一真相，代码是实现细节。保持同步。
