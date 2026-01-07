# 使用示例

## 快速启动示例

### 场景 1: 首次使用

```bash
# 克隆项目后首次启动
cd ai-life-assistant

# 一键启动（会自动安装所有依赖）
./quick-start.sh
```

**输出示例**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI Life Assistant - 快速启动
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ 检查环境...
✓ 虚拟环境已存在
✓ 前端依赖已安装
✓ 创建 logs 目录

ℹ 启动后端服务...
ℹ 等待后端服务启动...
✓ 后端服务启动成功 (PID: 12345)
✓ 后端地址: http://localhost:8000
✓ API文档: http://localhost:8000/docs

ℹ 启动前端服务...
ℹ 等待前端服务启动...
✓ 前端服务启动成功 (PID: 12346)
✓ 前端地址: http://localhost:3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 服务状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ● 后端服务: http://localhost:8000
  ● 前端服务: http://localhost:3000
  ● API文档:  http://localhost:8000/docs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 可用账户
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  邮箱: dahong@example.com
  密码: password123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 提示
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • 查看后端日志: tail -f logs/backend.log
  • 查看前端日志: tail -f logs/frontend.log
  • 停止服务: 按 Ctrl+C

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ 服务正在运行中... (按 Ctrl+C 停止)
```

### 场景 2: 日常使用

```bash
# 启动服务
./quick-start.sh

# 在浏览器中打开
open http://localhost:3000

# 使用完毕后停止
# 按 Ctrl+C 或运行:
./stop-services.sh
```

### 场景 3: 查看日志

```bash
# 启动服务
./quick-start.sh

# 在另一个终端窗口查看日志
tail -f logs/backend.log   # 后端日志
tail -f logs/frontend.log  # 前端日志
```

### 场景 4: 故障排查

```bash
# 如果启动失败，检查端口占用
lsof -i :3000
lsof -i :8000

# 停止占用端口的进程
./stop-services.sh

# 重新启动
./quick-start.sh
```

## 停止服务示例

### 方法 1: 使用 Ctrl+C

```bash
# 在 quick-start.sh 运行的终端按 Ctrl+C
^C

ℹ 正在停止服务...
✓ 后端服务已停止
✓ 前端服务已停止

✓ 所有服务已停止，再见！👋
```

### 方法 2: 使用停止脚本

```bash
./stop-services.sh
```

**输出示例**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 停止 AI Life Assistant 服务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ 查找后端服务进程...
ℹ 停止后端服务 (PIDs: 12345)...
✓ 后端服务已停止

ℹ 查找前端服务进程...
ℹ 停止前端服务 (PIDs: 12346)...
✓ 前端服务已停止

✓ 所有服务已停止！
```

## 常见使用场景

### 开发调试

```bash
# 启动服务
./quick-start.sh

# 在另一个终端查看实时日志
tail -f logs/backend.log

# 修改代码后，服务会自动重载（热重载）
# 无需手动重启
```

### 演示展示

```bash
# 快速启动
./quick-start.sh

# 等待服务启动（约5秒）
# 打开浏览器访问 http://localhost:3000

# 演示完毕后停止
./stop-services.sh
```

### 测试验证

```bash
# 启动服务
./quick-start.sh

# 运行测试
curl http://localhost:8000/api/status
curl http://localhost:3000

# 停止服务
./stop-services.sh
```

## 高级用法

### 自定义启动

如果需要更多控制，可以使用原有的 start-dev.sh：

```bash
# 仅启动后端
./scripts/start-dev.sh api

# 仅启动前端
cd web-app && npm run dev

# 使用 tmux 分屏
./scripts/start-dev.sh full
```

### 后台运行

```bash
# 启动服务
./quick-start.sh

# 服务已在后台运行，可以关闭终端
# 查看进程
ps aux | grep -E "uvicorn|next dev"

# 停止服务
./stop-services.sh
```

### 日志管理

```bash
# 清空日志
> logs/backend.log
> logs/frontend.log

# 查看日志大小
du -h logs/

# 压缩旧日志
gzip logs/backend.log.old
gzip logs/frontend.log.old
```

## 集成到工作流

### 添加到 shell 别名

```bash
# 在 ~/.zshrc 或 ~/.bashrc 中添加
alias ailife-start="cd ~/path/to/ai-life-assistant && ./quick-start.sh"
alias ailife-stop="cd ~/path/to/ai-life-assistant && ./stop-services.sh"

# 使用
ailife-start  # 启动
ailife-stop   # 停止
```

### 开机自启动

```bash
# macOS (使用 launchd)
# 创建 ~/Library/LaunchAgents/com.ailife.plist

# Linux (使用 systemd)
# 创建 /etc/systemd/system/ailife.service
```

### CI/CD 集成

```yaml
# GitHub Actions 示例
- name: Start services
  run: ./quick-start.sh

- name: Run tests
  run: npm test

- name: Stop services
  run: ./stop-services.sh
```

## 性能监控

### 查看资源占用

```bash
# 查看进程资源占用
ps aux | grep -E "uvicorn|next dev"

# 查看端口监听
netstat -an | grep -E "3000|8000"

# 查看日志大小
du -h logs/
```

### 性能优化

```bash
# 使用 pnpm 代替 npm（更快）
npm install -g pnpm

# 脚本会自动检测并使用 pnpm
./quick-start.sh
```

## 故障排查示例

### 问题 1: 端口被占用

```bash
# 症状
Error: Port 3000 is already in use

# 解决
./stop-services.sh
./quick-start.sh
```

### 问题 2: 依赖安装失败

```bash
# 症状
Error: Failed to install dependencies

# 解决
rm -rf venv web-app/node_modules
./quick-start.sh
```

### 问题 3: 服务启动失败

```bash
# 症状
⚠ 后端服务可能未完全启动

# 排查
tail -f logs/backend.log  # 查看错误信息
cat logs/frontend.log     # 查看前端日志

# 常见原因
# 1. API 密钥未配置
# 2. 数据库未初始化
# 3. 端口被占用
```

## 最佳实践

### 1. 定期清理日志

```bash
# 每周清理一次
> logs/backend.log
> logs/frontend.log
```

### 2. 监控服务状态

```bash
# 定期检查服务是否正常
curl -s http://localhost:8000/api/status
curl -s http://localhost:3000
```

### 3. 备份配置

```bash
# 备份重要配置
cp config/config.ini config/config.ini.backup
```

### 4. 使用版本控制

```bash
# 确保脚本在版本控制中
git add quick-start.sh stop-services.sh
git commit -m "Add quick start scripts"
```

## 总结

quick-start.sh 脚本提供了最简单的启动方式：

- ✅ 一键启动所有服务
- ✅ 自动检查和安装依赖
- ✅ 健康检查确保成功
- ✅ 优雅退出自动清理
- ✅ 彩色输出美观易读

适合各种使用场景，从开发调试到生产部署都能胜任！

---

**提示**: 更多详细信息请参考 [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)
