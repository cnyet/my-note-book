# Scripts 使用说明

本目录包含项目的所有管理脚本，遵循 `GEMINI.md` 规范要求。

## 📋 必备脚本列表

### 1. [setup.sh](setup.sh) - 项目初始化
**用途**: 首次安装项目依赖和配置环境。

```bash
./scripts/setup.sh
```

**主要功能**:
- ✅ 检查 Python 及 uv 环境
- ✅ 初始化后端虚拟环境及依赖
- ✅ 初始化前端依赖 (pnpm/npm)
- ✅ 创建必要目录及环境文件

---

### 2. [start-dev.sh](start-dev.sh) - 开发启动
**用途**: 一键启动后端 (Python/Uvicorn) 和前端 (Next.js/React) 开发服务。同时支持按 `Ctrl+C` 自动停止服务并清理端口。

```bash
./scripts/start-dev.sh
```

**主要功能**:
- ✅ 后台并行启动前后端服务
- ✅ 自动清理遗留端口占用
- ✅ 实时日志写入 `logs/`
- ✅ 监听 Ctrl+C 一键停止服务并释放端口 8000/3000

---

### 3. [build.sh](build.sh) - 项目构建
**用途**: 构建生产版本。

```bash
./scripts/build.sh [backend|frontend|all]
```

---

### 4. [test.sh](test.sh) - 运行测试
**用途**: 运行后端 pytest 及前端测试。

```bash
./scripts/test.sh [backend|frontend|all]
```

**注意**: 后端测试覆盖率要求 ≥ 80%。

---

### 5. [lint.sh](lint.sh) - 代码检查
**用途**: 运行代码质量检查（flake8, eslint 等）。

```bash
./scripts/lint.sh [backend|frontend|all]
```

---

### 6. [clean.sh](clean.sh) - 清理文件
**用途**: 清理临时文件、缓存、日志及依赖。

```bash
./scripts/clean.sh [build|deps|logs|all]
```

---

## 🔄 典型工作流

1. **首次使用**: `./scripts/setup.sh` -> 配置 `.env` -> `./scripts/start-dev.sh`
2. **日常开发**: `./scripts/start-dev.sh` -> 修改代码 -> 自动热更新
3. **提交代码前**: `./scripts/lint.sh` -> `./scripts/test.sh` -> `./scripts/build.sh`
4. **清理环境**: `./scripts/clean.sh build`

---

## 📊 规范遵守

- **目录限制**: 脚本统一存放于 `/scripts`
- **入口规范**: 禁止直接运行 `npm`, `uv`, `python` 等命令，统一通过脚本调用
- **日志管理**: 所有运行日志输出至 `/logs`
- **环境隔离**: 后端使用 `.venv` (uv)，前端使用独立的 `node_modules`

---

**遵守规范，质量第一！** 🚀
