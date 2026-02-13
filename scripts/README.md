# Scripts 目录结构

本项目脚本采用扁平化结构，所有脚本均位于 `scripts/` 根目录下，便于快速访问和维护。

## 目录结构

```
scripts/
├── README.md         # 本文档
├── build.sh          # 生产构建 (Frontend + Backend)
├── clean.sh          # 清理项目 (Stop processes, remove cache/logs)
├── deploy.sh         # 部署脚本 (Docker/Production)
├── lint.sh           # 代码检查 (Lint + Format + Type Check)
├── setup.sh          # 环境初始化 (Install dependencies, DB migration)
├── start-dev.sh      # 启动开发服务器 (Start Frontend + Backend)
└── test.sh           # 运行测试 (Unit Tests)
```

## 使用说明

### 核心命令

```bash
# 1. 初始化项目 (首次运行或依赖变更时)
./scripts/setup.sh

# 2. 启动开发服务器
./scripts/start-dev.sh

# 3. 代码检查与格式化 (提交前必跑)
./scripts/lint.sh

# 4. 运行测试
./scripts/test.sh

# 5. 清理环境 (解决奇怪的缓存/端口问题)
./scripts/clean.sh

# 6. 构建生产版本
./scripts/build.sh

# 7. 部署
./scripts/deploy.sh
```

## 脚本规范

所有脚本均遵循以下规范：

- **执行位置无关**: 可以在项目任意目录下执行，脚本会自动定位项目根目录。
- **错误处理**: 启用 `set -euo pipefail`，遇到错误立即停止。
- **日志管理**: 运行日志统一输出到 `logs/` 目录。
- **环境检查**: 自动检查 `.env` 等必要配置。

---

**最后更新**: 2026年2月11日
