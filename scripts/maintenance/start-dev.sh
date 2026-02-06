#!/usr/bin/env bash
# 启动开发服务器
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 启动 work-agents 开发服务器..."

# 执行清理工作
echo "🧹 Running cleanup..."
./scripts/maintenance/clean.sh -y

# 寻找可用端口的函数
find_available_port() {
    local port=$1
    while lsof -i :"$port" >/dev/null 2>&1; do
        echo "⚠️  Port $port is still occupied. Trying next one..."
        port=$((port + 1))
    done
    echo "$port"
}

# 确定后端和前端端口
BACKEND_PORT=$(find_available_port 8001)
FRONTEND_PORT=$(find_available_port 3001)

echo "🚀 Starting work-agents development cluster..."
echo "📍 Backend selected port: $BACKEND_PORT"
echo "📍 Frontend selected port: $FRONTEND_PORT"

# 创建日志目录
mkdir -p logs

# 启动后端服务
echo "📡 启动 FastAPI 后端..."
cd backend
if [ -d "venv" ]; then
  source venv/bin/activate
elif [ -d ".venv" ]; then
  source .venv/bin/activate
else
  echo "❌ Error: Virtual environment not found. Run ./scripts/setup.sh first."
  exit 1
fi
uvicorn src.main:app --reload --host 0.0.0.0 --port "$BACKEND_PORT" > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID" > ../logs/pids.txt
cd ..

# 启动前端服务
echo "🌐 启动 Next.js 前端..."
cd frontend
# 注入后端地址环境变量，适配动态端口
NEXT_PUBLIC_API_URL="http://localhost:$BACKEND_PORT/api/v1" npm run dev -- -p "$FRONTEND_PORT" > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID" >> ../logs/pids.txt
cd ..

echo ""
echo "✅ 开发服务器已启动！"
echo "   - 前端: http://localhost:$FRONTEND_PORT"
echo "   - 后端: http://localhost:$BACKEND_PORT"
echo "   - API文档: http://localhost:$BACKEND_PORT/docs"
echo ""
echo "查看日志:"
echo "   - tail -f logs/backend.log"
echo "   - tail -f logs/frontend.log"
echo ""
echo "停止服务器: ./scripts/maintenance/clean.sh"
