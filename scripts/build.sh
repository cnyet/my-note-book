#!/bin/bash
# AI Life Assistant - 构建项目脚本
# 用途: 构建生产版本

set -e

# 颜色定义
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔨 AI Life Assistant - 构建项目"
echo "=================================="

# 解析参数
TARGET=${1:-"all"}

case $TARGET in
    "backend")
        echo -e "${BLUE}🐍 构建后端 (backend)...${NC}"
        if [ -d "backend" ]; then
            cd backend
            if [ ! -d ".venv" ]; then
                echo -e "${RED}❌ 错误: backend/.venv 不存在，请运行 ./scripts/setup.sh${NC}"
                exit 1
            fi
            # 这里可以执行额外的 python 构建步骤，如编译或检查
            .venv/bin/python --version
            cd ..
            echo -e "${GREEN}✅ 后端检查完成${NC}"
        fi
        ;;
    
    "frontend")
        echo -e "${BLUE}🌐 构建前端 (frontend)...${NC}"
        if [ -d "frontend" ]; then
            cd frontend
            if command -v pnpm &> /dev/null; then
                pnpm build
            else
                npm run build
            fi
            cd ..
            echo -e "${GREEN}✅ 前端构建完成${NC}"
        fi
        ;;
    
    "all")
        ./scripts/build.sh backend
        ./scripts/build.sh frontend
        ;;
    
    *)
        echo "用法: ./scripts/build.sh [backend|frontend|all]"
        exit 1
        ;;
esac

echo "=================================="
echo -e "${GREEN}✅ 构建流程结束${NC}"
echo "=================================="
