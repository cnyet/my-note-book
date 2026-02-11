#!/usr/bin/env bash
# 项目环境初始化脚本
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 开始初始化 my-note-book 项目..."

# 检查必要工具
command -v python3 >/dev/null 2>&1 || { echo "❌ 需要安装 Python 3"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ 需要安装 Node.js"; exit 1; }
command -v uv >/dev/null 2>&1 || { echo "⚠️  建议安装 uv: curl -LsSf https://astral.sh/uv/install.sh | sh"; }

# 1. 后端环境设置
echo "📦 设置 Python 后端环境..."
cd backend
if command -v uv >/dev/null 2>&1; then
  uv venv
  source .venv/bin/activate
  uv pip install -r requirements.txt
else
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
fi

echo "🗄️  Syncing database schema and seeding data..."
export PYTHONPATH=${PYTHONPATH:-}:.
alembic upgrade head
python3 src/scripts/seed.py
cd ..

# 2. 前端环境设置
echo "📦 设置 Next.js 前端环境..."
cd frontend
npm install
cd ..

# 3. 环境变量检查
if [ ! -f "backend/.env" ]; then
  echo "⚠️  未发现 backend/.env，请复制 backend/.env.example 并配置"
fi

if [ ! -f "frontend/.env.local" ]; then
  echo "⚠️  未发现 frontend/.env.local，请复制 frontend/.env.example 并配置"
fi

echo "✅ 项目初始化完成！"
echo ""
echo "下一步："
echo "  1. 配置环境变量 (backend/.env, frontend/.env.local)"
echo "  2. 运行开发服务器: ./scripts/maintenance/start-dev.sh"
