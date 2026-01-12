#!/bin/bash
# AI Life Assistant - 运行测试脚本
# 用途: 运行所有测试套件

set -e

# 颜色定义
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 AI Life Assistant - 运行测试"
echo "=================================="

# 解析参数
TARGET=${1:-"all"}

case $TARGET in
    "backend")
        echo -e "${BLUE}🐍 运行后端测试...${NC}"
        if [ -d "backend" ]; then
            cd backend
            if [ ! -d ".venv" ]; then
                echo -e "${RED}❌ 错误: backend/.venv 不存在${NC}"
                exit 1
            fi
            .venv/bin/pytest tests/ -v
            cd ..
        fi
        ;;
    
    "frontend")
        echo -e "${BLUE}🌐 运行前端测试...${NC}"
        if [ -d "frontend" ]; then
            cd frontend
            npm test || echo "⚠️ 前端测试未配置或失败"
            cd ..
        fi
        ;;
    
    "all")
        ./scripts/test.sh backend
        ./scripts/test.sh frontend
        ;;
    
    *)
        echo "用法: ./scripts/test.sh [backend|frontend|all]"
        exit 1
        ;;
esac

echo "=================================="
echo -e "${GREEN}✅ 测试运行结束${NC}"
echo "=================================="
