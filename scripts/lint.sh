#!/usr/bin/env bash
# 代码检查和格式化
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔍 运行代码检查..."

# 后端 Lint
echo "🐍 检查 Python 代码..."
cd backend
if [ -d "venv" ]; then
  source venv/bin/activate
elif [ -d ".venv" ]; then
  source .venv/bin/activate
fi
ruff check src/ tests/ --fix || echo "⚠️ Ruff check failed"
ruff format src/ tests/ || echo "⚠️ Ruff format failed"
mypy src/ --strict || echo "⚠️ MyPy check failed"
cd ..

# 前端 Lint
echo "⚛️  检查 TypeScript/React 代码..."
cd frontend
npm run lint
npm run format
cd ..

echo "✅ 代码检查完成！"
