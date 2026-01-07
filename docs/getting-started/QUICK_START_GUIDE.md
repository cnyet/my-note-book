# 🚀 AI Life Assistant - 快速启动指南

## 一键启动

### 启动所有服务

```bash
./quick-start.sh
```

这个脚本会自动：
1. ✅ 检查并创建虚拟环境（如果不存在）
2. ✅ 安装 Python 依赖（如果需要）
3. ✅ 安装前端依赖（如果需要）
4. ✅ 启动后端 API 服务器 (端口 8000)
5. ✅ 启动前端开发服务器 (端口 3000)
6. ✅ 显示服务状态和访问地址

### 停止所有服务

```bash
./stop-services.sh
```

或者在 `quick-start.sh` 运行时按 `Ctrl+C`

## 服务地址

启动成功后，可以访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| 🎨 前端应用 | http://localhost:3000 | Web 界面 |
| 🔧 后端 API | http://localhost:8000 | API 服务 |
| 📚 API 文档 | http://localhost:8000/docs | Swagger 文档 |

## 默认账户

| 字段 | 值 |
|------|-----|
| 邮箱 | `dahong@example.com` |
| 密码 | `password123` |

## 查看日志

### 实时查看后端日志
```bash
tail -f logs/backend.log
```

### 实时查看前端日志
```bash
tail -f logs/frontend.log
```

### 查看所有日志
```bash
# 后端日志
cat logs/backend.log

# 前端日志
cat logs/frontend.log
```

## 常见问题

### 1. 端口被占用

**问题**: 提示端口 3000 或 8000 已被占用

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000  # 前端
lsof -i :8000  # 后端

# 停止进程
kill -9 <PID>

# 或使用停止脚本
./stop-services.sh
```

### 2. 虚拟环境问题

**问题**: Python 依赖安装失败

**解决方案**:
```bash
# 删除现有虚拟环境
rm -rf venv

# 重新运行启动脚本（会自动创建）
./quick-start.sh
```

### 3. 前端依赖问题

**问题**: 前端启动失败

**解决方案**:
```bash
# 删除 node_modules
rm -rf web-app/node_modules

# 重新安装
cd web-app
npm install
# 或使用 pnpm
pnpm install

cd ..
./quick-start.sh
```

### 4. 数据库问题

**问题**: 后端启动失败，提示数据库错误

**解决方案**:
```bash
# 检查数据库文件
ls -la data/

# 如果需要重置数据库
cd api
source ../venv/bin/activate
alembic upgrade head
cd ..
```

## 手动启动（高级）

如果需要分别启动服务：

### 仅启动后端
```bash
source venv/bin/activate
cd api
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### 仅启动前端
```bash
cd web-app
npm run dev
# 或
pnpm dev
```

## 开发模式

### 使用 tmux 分屏（推荐）

如果安装了 tmux，可以使用分屏模式：

```bash
./scripts/start-dev.sh full
```

这会在 tmux 中创建两个窗格，分别显示前后端日志。

### tmux 快捷键

- `Ctrl+B` 然后按 `%` - 垂直分屏
- `Ctrl+B` 然后按 `"` - 水平分屏
- `Ctrl+B` 然后按方向键 - 切换窗格
- `Ctrl+B` 然后按 `d` - 分离会话
- `tmux attach -t ailife` - 重新连接会话

## 生产部署

生产环境部署请参考：

1. 构建前端：
```bash
cd web-app
npm run build
npm start
```

2. 启动后端（使用 gunicorn）：
```bash
source venv/bin/activate
cd api
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 系统要求

- **Python**: 3.8+
- **Node.js**: 18+
- **操作系统**: macOS, Linux, Windows (WSL)
- **内存**: 至少 2GB
- **磁盘**: 至少 500MB

## 脚本说明

### quick-start.sh

一键启动脚本，包含以下功能：

- ✅ 自动检查环境
- ✅ 自动安装依赖
- ✅ 后台启动服务
- ✅ 健康检查
- ✅ 彩色输出
- ✅ 优雅退出
- ✅ 日志记录

### stop-services.sh

停止服务脚本，包含以下功能：

- ✅ 查找所有相关进程
- ✅ 优雅停止服务
- ✅ 清理残留进程
- ✅ 状态反馈

## 性能优化

### 使用 pnpm（推荐）

pnpm 比 npm 更快，占用空间更小：

```bash
# 安装 pnpm
npm install -g pnpm

# 脚本会自动检测并使用 pnpm
./quick-start.sh
```

### 使用 Python 虚拟环境缓存

```bash
# 使用 pip 缓存加速安装
pip install --cache-dir ~/.cache/pip -r requirements.txt
```

## 故障排查

### 检查服务状态

```bash
# 检查后端
curl http://localhost:8000/api/status

# 检查前端
curl http://localhost:3000
```

### 查看进程

```bash
# 查看所有相关进程
ps aux | grep -E "uvicorn|next dev"

# 查看端口占用
netstat -an | grep -E "3000|8000"
```

### 清理日志

```bash
# 清空日志文件
> logs/backend.log
> logs/frontend.log

# 或删除日志文件
rm logs/*.log
```

## 更新依赖

### 更新 Python 依赖

```bash
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

### 更新前端依赖

```bash
cd web-app
npm update
# 或
pnpm update
```

## 贡献指南

如果你想改进启动脚本：

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 支持

如有问题，请：

1. 查看日志文件
2. 检查 GitHub Issues
3. 提交新的 Issue

---

**最后更新**: 2025-12-31
**版本**: 1.0.0
