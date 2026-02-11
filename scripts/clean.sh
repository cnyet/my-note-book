#!/usr/bin/env bash
# 清理项目（停止服务、删除临时文件）
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧹 清理项目..."

# 停止运行的服务
if [ -f "logs/pids.txt" ]; then
  echo "🛑 停止已知开发进程..."
  while read -r line; do
    PID=$(echo "$line" | cut -d: -f2 | xargs)
    if ps -p "$PID" > /dev/null 2>&1; then
      kill "$PID" && echo "已停止进程 $PID"
    fi
  done < logs/pids.txt
  rm logs/pids.txt
fi

# 强制清理端口占用 (8001, 3001)
kill_port() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    local pids=$(lsof -t -i :"$port")
    if [ -n "$pids" ]; then
      echo "🔥 强制释放端口 $port (PIDs: $pids)..."
      for pid in $pids; do
        kill -9 "$pid" > /dev/null 2>&1 || true
      done
    fi
  fi
}

kill_port 8001
kill_port 3001

# 清理缓存和构建产物
echo "🗑️  删除缓存和构建产物..."
rm -rf backend/__pycache__
rm -rf backend/.pytest_cache
rm -rf backend/htmlcov
rm -rf backend/.mypy_cache
rm -rf backend/.ruff_cache
rm -rf frontend/.next
rm -rf frontend/node_modules/.cache

# 默认自动清理日志
REPLY="y"

if [[ ${REPLY:-n} =~ ^[Yy]$ ]]; then
  rm -rf logs/*.log
  echo "✅ 日志已清理"
fi

echo "✅ 清理完成！"
