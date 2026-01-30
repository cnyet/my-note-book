#!/usr/bin/env bash
# 清理项目（停止服务、删除临时文件）
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧹 清理项目..."

# 停止运行的服务
if [ -f "logs/pids.txt" ]; then
  echo "🛑 停止开发服务器..."
  while read -r line; do
    PID=$(echo "$line" | cut -d: -f2 | xargs)
    if ps -p "$PID" > /dev/null 2>&1; then
      kill "$PID" && echo "已停止进程 $PID"
    fi
  done < logs/pids.txt
  rm logs/pids.txt
fi

# 清理缓存和构建产物
echo "🗑️  删除缓存和构建产物..."
rm -rf backend/__pycache__
rm -rf backend/.pytest_cache
rm -rf backend/htmlcov
rm -rf backend/.mypy_cache
rm -rf backend/.ruff_cache
rm -rf frontend/.next
rm -rf frontend/node_modules/.cache

# 清理日志（可选）
read -p "是否清理日志文件？ (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf logs/*.log
  echo "✅ 日志已清理"
fi

echo "✅ 清理完成！"
