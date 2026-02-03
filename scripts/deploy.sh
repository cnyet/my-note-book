#!/usr/bin/env bash
# 项目自动化部署脚本
set -euo pipefail

echo "🚀 Starting deployment for work-agents..."

# 1. Pull latest code (if in git repo)
if [ -d ".git" ]; then
  echo "📥 Pulling latest changes..."
  git pull origin main
fi

# 2. Build and restart containers using Docker Compose
echo "📦 Building and starting containers..."
docker-compose up -d --build

# 3. Running database migrations (optional if handled by entrypoint)
echo "🔄 Running backend migrations..."
docker-compose exec -T backend alembic upgrade head

# 4. Status check
echo "✅ Deployment complete! System status:"
docker-compose ps

echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000/docs"
