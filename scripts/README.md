# Scripts 使用说明

本目录包含项目的所有管理脚本，遵循 `rules.md` 规范要求。

## 📋 脚本列表

### 1. setup.sh - 项目初始化
**用途**: 首次安装项目依赖和配置环境

```bash
./scripts/setup.sh
```

**功能**:
- ✅ 检查Python版本（≥3.8）
- ✅ 检查uv包管理器
- ✅ 创建.venv虚拟环境
- ✅ 安装Python依赖
- ✅ 安装Web应用依赖
- ✅ 创建必要目录
- ✅ 检查配置文件

**首次使用必须运行此脚本！**

---

### 2. 快速启动（推荐使用根目录脚本）

**一键启动所有服务**:
```bash
# 在项目根目录运行
./quick-start.sh
```

**停止所有服务**:
```bash
./stop-services.sh
```

详细文档请参考: [QUICK_START_GUIDE.md](../QUICK_START_GUIDE.md)

---

### 3. build.sh - 构建项目
**用途**: 构建生产版本

```bash
# 构建所有组件（默认）
./scripts/build.sh
./scripts/build.sh all

# 仅构建Python应用
./scripts/build.sh python

# 仅构建Web应用
./scripts/build.sh web
```

**功能**:
- ✅ 运行类型检查（mypy, tsc）
- ✅ 运行代码检查（flake8, eslint）
- ✅ 构建生产版本
- ✅ 生成构建日志

---

### 4. test.sh - 运行测试
**用途**: 运行测试套件

```bash
# 运行所有测试（默认，带覆盖率）
./scripts/test.sh
./scripts/test.sh all

# 仅运行Python测试
./scripts/test.sh python

# 仅运行Web应用测试
./scripts/test.sh web

# 运行单元测试
./scripts/test.sh unit

# 运行集成测试
./scripts/test.sh integration

# 不生成覆盖率报告
./scripts/test.sh all no
```

**功能**:
- ✅ 运行pytest测试
- ✅ 运行Jest测试（Web）
- ✅ 生成覆盖率报告
- ✅ 检查覆盖率是否≥80%
- ✅ 保存测试日志

**覆盖率报告位置**:
- HTML: `htmlcov/index.html`
- XML: `coverage.xml`
- 日志: `logs/tests/`

---

### 5. lint.sh - 代码检查
**用途**: 运行代码质量检查

```bash
# 检查所有代码（默认）
./scripts/lint.sh
./scripts/lint.sh all

# 仅检查Python代码
./scripts/lint.sh python

# 仅检查Web应用代码
./scripts/lint.sh web

# 自动修复问题
./scripts/lint.sh all yes
./scripts/lint.sh python yes
```

**检查项目**:
- ✅ Flake8代码规范
- ✅ Black代码格式
- ✅ MyPy类型检查
- ✅ ESLint代码规范
- ✅ TypeScript类型检查
- ✅ 文件规模检查（≤300行）

**日志位置**: `logs/lint/`

---

### 6. clean.sh - 清理文件
**用途**: 清理临时文件和构建产物

```bash
# 清理构建文件（默认，无需确认）
./scripts/clean.sh
./scripts/clean.sh build

# 清理依赖文件（需确认）
./scripts/clean.sh deps

# 清理日志文件（需确认）
./scripts/clean.sh logs

# 清理数据文件（需确认）
./scripts/clean.sh data

# 清理所有文件（需确认）
./scripts/clean.sh all
```

**清理内容**:
- `build` - __pycache__, .next, .coverage等
- `deps` - .venv, node_modules
- `logs` - logs/目录下的日志文件
- `data` - data/目录下的生成数据
- `all` - 以上所有

---

## 🔄 典型工作流

### 首次使用
```bash
# 1. 初始化项目
./scripts/setup.sh

# 2. 配置API密钥
vim config/config.ini

# 3. 运行测试
./scripts/test.sh

# 4. 启动服务
./quick-start.sh
```

### 日常开发
```bash
# 1. 启动开发环境
./quick-start.sh

# 2. 开发代码...

# 3. 运行代码检查
./scripts/lint.sh all yes

# 4. 运行测试
./scripts/test.sh

# 5. 停止服务
./stop-services.sh

# 6. 提交代码
git add .
git commit -m "feat: 添加新功能"
```

### 提交前检查
```bash
# 1. 代码检查和自动修复
./scripts/lint.sh all yes

# 2. 运行所有测试
./scripts/test.sh all

# 3. 构建验证
./scripts/build.sh all

# 4. 如果都通过，提交代码
git commit -m "..."
```

### 清理环境
```bash
# 清理构建文件
./scripts/clean.sh build

# 完全清理（重新开始）
./scripts/clean.sh all
./scripts/setup.sh
```

---

## 📊 规范遵守

所有脚本严格遵守 `rules.md` 规范：

### ✅ 脚本管理规范
- 所有操作通过scripts/执行
- 禁止直接使用npm、pip、python等命令
- 脚本失败时提供清晰的错误信息

### ✅ 日志管理规范
- 统一输出到logs/目录
- 日志分级：ERROR、WARN、INFO、DEBUG
- 敏感信息不出现在日志中

### ✅ Python规范
- 使用.venv虚拟环境
- 使用uv包管理器
- 强制类型检查（mypy）
- 代码格式化（black）

### ✅ 测试规范
- 覆盖率≥80%
- 单元测试+集成测试
- 自动生成覆盖率报告

### ✅ 代码质量规范
- 文件≤300行
- 函数≤50行
- 参数≤5个
- 自动检查和提示

---

## 🚨 故障排查

### 问题1: uv未安装
```bash
Error: uv未安装
```
**解决**: 
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 问题2: 权限错误
```bash
Error: Permission denied
```
**解决**:
```bash
chmod +x scripts/*.sh
```

### 问题3: 虚拟环境未激活
```bash
Error: 虚拟环境不存在
```
**解决**:
```bash
./scripts/setup.sh
```

### 问题4: 测试失败
```bash
Error: 测试失败
```
**解决**:
1. 查看日志: `logs/tests/`
2. 修复问题
3. 重新运行: `./scripts/test.sh`

---

## 💡 最佳实践

1. **首次使用必须运行setup.sh**
2. **使用quick-start.sh快速启动服务**
3. **开发前运行lint.sh检查代码**
4. **提交前运行test.sh确保测试通过**
5. **定期运行clean.sh清理临时文件**
6. **使用stop-services.sh停止所有服务**
7. **查看日志文件排查问题**

---

## 📝 更新日志

### 2025-12-31
- ✅ 创建quick-start.sh和stop-services.sh
- ✅ 删除重复的启动脚本
- ✅ 简化启动流程
- ✅ 更新文档

### 2025-12-30
- ✅ 创建所有必需脚本
- ✅ 实现完整的开发工作流
- ✅ 遵守rules.md所有规范
- ✅ 添加详细的使用文档

---

**遵守规范，提升质量！** 🚀
