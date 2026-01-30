#!/usr/bin/env bash
# 启动开发服务器
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 启动 work-agents 开发服务器..."

# 创建日志目录
mkdir -p logs

# 启动后端服务
echo "📡 启动 FastAPI 后端 (http://localhost:8000)..."
cd backend
source .venv/bin/activate
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID" > ../logs/pids.txt
cd ..

# 启动前端服务
echo "🌐 启动 Next.js 前端 (http://localhost:3000)..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID" >> ../logs/pids.txt
cd ..

echo ""
echo "✅ 开发服务器已启动！"
echo "   - 前端: http://localhost:3000"
echo "   - 后端: http://localhost:8000"
echo "   - API文档: http://localhost:8000/docs"
echo ""
echo "查看日志:"
echo "   - tail -f logs/backend.log"
echo "   - tail -f logs/frontend.log"
echo ""
echo "停止服务器: ./scripts/clean.sh"
