# 端口占用问题解决方案

## 问题描述

在开发过程中，如果后端或前端服务异常退出（例如通过 Ctrl+C 强制终止），可能会导致端口 8000 或 3000 被旧进程占用。下次启动时会遇到 "Address already in use" 错误。

## 解决方案

### 自动化解决（推荐）

我们已经在 `scripts/start-dev.sh` 中添加了自动端口清理功能。现在每次启动服务时，脚本会：

1. **自动检测**端口 8000 和 3000 是否被占用
2. **自动清理**占用端口的旧进程
3. **显示提示**告知用户清理操作

**使用方法：**
```bash
./scripts/start-dev.sh
```

脚本会自动处理端口占用问题，无需手动干预。

### 手动解决

如果需要手动清理端口，可以使用以下命令：

#### 查找占用端口的进程
```bash
# 查找占用 8000 端口的进程
lsof -ti:8000

# 查找占用 3000 端口的进程
lsof -ti:3000
```

#### 杀掉占用端口的进程
```bash
# 清理 8000 端口
lsof -ti:8000 | xargs kill -9

# 清理 3000 端口
lsof -ti:3000 | xargs kill -9

# 或者一次性清理两个端口
lsof -ti:8000,3000 | xargs kill -9
```

## 预防措施

### 1. 使用正确的停止方式

**推荐：** 使用 Ctrl+C 停止 `start-dev.sh` 脚本
- 脚本会捕获退出信号并优雅地清理所有进程

**不推荐：** 直接关闭终端窗口
- 可能导致后台进程继续运行

### 2. 检查后台进程

定期检查是否有遗留的后台进程：

```bash
# 查看所有 Python 进程
ps aux | grep python

# 查看所有 Node 进程
ps aux | grep node
```

### 3. 使用专用的停止脚本

如果需要单独停止服务，可以创建 `scripts/stop-dev.sh`：

```bash
#!/bin/bash
# 停止所有开发服务

echo "正在停止服务..."

# 停止后端
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# 停止前端
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "✓ 所有服务已停止"
```

## 技术细节

### cleanup_ports 函数

```bash
cleanup_ports() {
    print_info "检查端口占用情况..."
    
    # 检查并清理 8000 端口
    if lsof -ti:8000 > /dev/null 2>&1; then
        print_warning "端口 8000 被占用，正在清理..."
        lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "端口 8000 已释放"
    fi
    
    # 检查并清理 3000 端口
    if lsof -ti:3000 > /dev/null 2>&1; then
        print_warning "端口 3000 被占用，正在清理..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "端口 3000 已释放"
    fi
}
```

**工作原理：**
1. `lsof -ti:PORT` - 列出占用指定端口的进程 ID
2. `xargs kill -9` - 强制终止这些进程
3. `2>/dev/null || true` - 忽略错误（如果端口未被占用）

### 信号捕获

脚本使用 `trap` 命令捕获退出信号：

```bash
trap cleanup SIGINT SIGTERM EXIT
```

当用户按下 Ctrl+C 时，会触发 `cleanup` 函数，优雅地停止所有服务。

## 常见问题

### Q: 为什么使用 `kill -9`？
A: `-9` 是 SIGKILL 信号，强制终止进程。虽然不够优雅，但能确保端口被释放。

### Q: 会不会误杀其他进程？
A: 不会。脚本只针对占用 8000 和 3000 端口的进程，这两个端口是项目专用的开发端口。

### Q: 如果端口被其他应用占用怎么办？
A: 脚本会提示并清理。如果是重要应用，建议修改项目配置使用其他端口。

## 相关文件

- `scripts/start-dev.sh` - 启动脚本（包含自动清理功能）
- `logs/backend.log` - 后端日志
- `logs/frontend.log` - 前端日志

## 更新日志

- **2026-01-19**: 添加自动端口清理功能，解决端口占用问题
