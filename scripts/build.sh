#!/usr/bin/env bash
# 构建生产版本
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔨 构建 work-agents 生产版本..."

# 构建前端
echo "📦 构建 Next.js..."
cd frontend
npm run build
cd ..

echo "✅ 构建完成！"
echo "   - 前端构建产物: frontend/.next"
echo ""
echo "生产部署："
echo "   - 前端: cd frontend && npm start"
echo "   - 后端: cd backend && uvicorn src.main:app --host 0.0.0.0 --port 8000"
