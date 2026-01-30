#!/usr/bin/env bash
# 运行测试
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧪 运行测试..."

# 后端测试
echo "🐍 运行 Python 测试..."
cd backend
source .venv/bin/activate
pytest tests/ -v --cov=src --cov-report=html --cov-report=term
cd ..

# 前端测试
echo "⚛️  运行 Next.js 测试..."
cd frontend
npm test
cd ..

echo "✅ 测试完成！"
echo "   - 后端覆盖率报告: backend/htmlcov/index.html"
