#!/usr/bin/env bash
# 项目自动化部署脚本 - Genesis Final Implementation Edition
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 INITIALIZING DEPLOYMENT: WORK AGENTS"

# 1. Pull latest code (if in git repo)
if [ -d ".git" ]; then
  echo "📥 Pulling latest changes..."
  # git pull origin main || echo "⚠️ Pull failed, continuing with local code"
fi

# 2. Check dependencies
command -v docker >/dev/null 2>&1 || { echo >&2 "❌ Error: Docker is not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo >&2 "❌ Error: Docker Compose is not installed. Aborting."; exit 1; }

# 3. Build and restart containers
echo "📦 Building and starting containers (Wave 1: Building Images)..."
docker-compose build

echo "🔄 Running backend migrations (Wave 2: Data Schema)..."
docker-compose run --rm backend alembic upgrade head

echo "🔥 Launching services (Wave 3: Full Orchestration)..."
docker-compose up -d

# 4. Status check
echo "🩺 Performing health checks..."
sleep 5
STATUS=$(curl -s http://localhost/health | grep -o "healthy" || echo "unhealthy")

if [ "$STATUS" == "healthy" ]; then
    echo "✅ DEPLOYMENT SUCCESSFUL: System is online at http://localhost"
    docker-compose ps
else
    echo "❌ DEPLOYMENT FAILED: Health check returned $STATUS"
    docker-compose logs backend
    exit 1
fi
