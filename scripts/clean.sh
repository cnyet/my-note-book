#!/bin/bash
# AI Life Assistant - 清理构建文件脚本
# 用途: 清理临时文件、缓存和构建产物

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧹 AI Life Assistant - 清理构建文件"
echo "=================================="

# 解析参数
CLEAN_TYPE=${1:-"build"}  # 默认清理构建文件

case $CLEAN_TYPE in
    "build")
        echo "🗑️  清理构建文件..."
        
        # Python构建文件
        echo "  - Python缓存..."
        find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
        find . -type f -name "*.pyc" -delete 2>/dev/null || true
        find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
        find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
        find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
        
        # Frontend构建文件
        if [ -d "frontend" ]; then
            echo "  - Frontend构建..."
            rm -rf frontend/.next 2>/dev/null || true
            rm -rf frontend/out 2>/dev/null || true
            rm -rf frontend/dist 2>/dev/null || true
        fi
        
        # 测试覆盖率文件
        echo "  - 测试覆盖率..."
        rm -rf htmlcov/ .coverage coverage.xml 2>/dev/null || true
        
        echo "✅ 构建文件清理完成"
        ;;
    
    "deps")
        echo "🗑️  清理依赖文件..."
        
        # Backend依赖
        if [ -d "backend/.venv" ]; then
            echo "  - Backend虚拟环境..."
            rm -rf backend/.venv
            echo "✅ Backend虚拟环境已删除"
        fi
        
        # Frontend依赖
        if [ -d "frontend/node_modules" ]; then
            echo "  - Frontend依赖 (node_modules)..."
            rm -rf frontend/node_modules
            echo "✅ Frontend依赖已删除"
        fi
        
        echo "✅ 依赖文件清理完成"
        ;;
    
    "logs")
        echo "🗑️  清理日志文件..."
        rm -rf logs/*.log 2>/dev/null || true
        echo "✅ 日志文件已清理"
        ;;
    
    "all")
        ./scripts/clean.sh build
        ./scripts/clean.sh logs
        echo ""
        echo "💡 提示: 依赖文件可通过 './scripts/clean.sh deps' 清理"
        ;;
    
    *)
        echo "用法: ./scripts/clean.sh [build|deps|logs|all]"
        exit 1
        ;;
esac

echo "=================================="
echo "✅ 清理完成！"
echo "=================================="
