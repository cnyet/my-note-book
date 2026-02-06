#!/usr/bin/env bash
# 代码检查和格式化
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔍 运行代码检查..."

# 后端 Lint
echo "🐍 检查 Python 代码..."
cd backend
if [ -d "venv" ]; then
  source venv/bin/activate
elif [ -d ".venv" ]; then
  source .venv/bin/activate
else
  echo "⚠️  Warning: Virtual environment not found. Skipping backend lint."
  VENV_EXISTS=false
fi

if [ "${VENV_EXISTS:-true}" = true ]; then
  ruff check src/ tests/ --fix
  ruff format src/ tests/
  mypy src/ --strict
fi
cd ..

# 前端 Lint
echo "⚛️  检查 TypeScript/React 代码..."
cd frontend
npm run lint
npm run format
cd ..

echo "✅ 代码检查完成！"
