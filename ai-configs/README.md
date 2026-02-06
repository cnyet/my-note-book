# AI 工具配置中心

本目录集中管理所有 AI 辅助开发工具的配置，作为项目的 AI 工具统一入口。

## 目录结构

```
ai-configs/
├── README.md              # 本文档
├── agent/                 # Agent 工作流配置
│   └── workflows/         # 工作流定义
├── claude/                # Claude AI 配置
│   └── skills/           # Claude Skills
├── opencode/              # OpenCode 配置
│   └── command/          # OpenCode 命令定义
└── sisyphus/              # Sisyphus 工作流配置
    └── notepads/         # AI 团队知识库
```

## 历史背景

原本 AI 工具配置分散在项目根目录的隐藏目录中：
- `.agent/` → 现在 `ai-configs/agent/`
- `.claude/` → 现在 `ai-configs/claude/`
- `.opencode/` → 现在 `ai-configs/opencode/`
- `.sisyphus/` → 现在 `ai-configs/sisyphus/`

迁移到 `ai-configs/` 的目的是：
1. **降低认知负担** - 新开发者能直观看到所有 AI 配置
2. **便于管理** - 统一位置，方便 CI/CD 和备份
3. **提高可发现性** - 不再被隐藏目录忽略

## 各工具说明

### Agent 配置 (`agent/`)
通用 Agent 工作流定义，跨平台使用。

### Claude 配置 (`claude/`)
Claude Code 特定的配置：
- `skills/` - Claude Skills 定义
  - `ui-ux-pro-max-skill/` - UI/UX 设计智能技能
  - `react-best-practices/` - React 最佳实践技能

### OpenCode 配置 (`opencode/`)
OpenCode 平台特定的配置：
- `command/` - 自定义命令定义
- `package.json` - OpenCode 扩展配置

### Sisyphus 配置 (`sisyphus/`)
Sisyphus 工作流引擎配置：
- `notepads/` - AI 团队共享知识库

## 迁移指南

如需从旧位置迁移配置：

```bash
# 1. 备份现有配置
cp -r .agent ai-configs/agent
cp -r .claude ai-configs/claude
cp -r .opencode ai-configs/opencode
cp -r .sisyphus ai-configs/sisyphus

# 2. 更新引用路径
# 在项目文件中搜索旧路径并更新

# 3. 验证配置
# 确保各 AI 工具能正确读取新位置的配置
```

## 最佳实践

1. **版本控制** - 所有配置应纳入版本控制
2. **文档化** - 每个子目录应有 README 说明
3. **环境隔离** - 区分开发/生产环境的配置
4. **敏感信息** - 不要将 API keys 等敏感信息提交到仓库

## 参考链接

- [Claude Code 文档](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
- [OpenCode 文档](https://docs.opencode.ai)
- [Sisyphus 工作流](.sisyphus/README.md)
