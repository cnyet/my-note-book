#!/bin/bash
# AI Life Assistant - 代码检查脚本
# 用途: 运行代码质量检查

set -e

# 颜色定义
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 AI Life Assistant - 代码检查"
echo "=================================="

# 解析参数
TARGET=${1:-"all"}

case $TARGET in
    "backend")
        echo -e "${BLUE}🐍 检查后端代码...${NC}"
        if [ -d "backend" ]; then
            cd backend
            if [ ! -d ".venv" ]; then
                echo -e "${RED}❌ 错误: backend/.venv 不存在${NC}"
                exit 1
            fi
            # 运行 flake8 或 black 检查
            .venv/bin/python -m flake8 src/ || echo "⚠️ flake8 发现问题"
            cd ..
        fi
        ;;
    
    "frontend")
        echo -e "${BLUE}🌐 检查前端代码...${NC}"
        if [ -d "frontend" ]; then
            cd frontend
            npm run lint || echo "⚠️ eslint 发现问题"
            cd ..
        fi
        ;;
    
    "all")
        ./scripts/lint.sh backend
        ./scripts/lint.sh frontend
        ;;
    
    *)
        echo "用法: ./scripts/lint.sh [backend|frontend|all]"
        exit 1
        ;;
esac

echo "=================================="
echo -e "${GREEN}✅ 代码检查结束${NC}"
echo "=================================="
