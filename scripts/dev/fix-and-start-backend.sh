#!/bin/bash
# 修复并启动后端服务

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔧 修复并启动后端服务...${NC}"
echo ""

# 停止所有现有的后端进程
echo -e "${YELLOW}停止现有后端进程...${NC}"
pkill -f "uvicorn.*api.server" 2>/dev/null || true
pkill -f "uvicorn.*src.api.server" 2>/dev/null || true
sleep 2

# 激活虚拟环境
echo -e "${YELLOW}激活虚拟环境...${NC}"
source venv/bin/activate

# 进入 api 目录并启动服务
echo -e "${YELLOW}启动后端服务...${NC}"
cd api
uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 等待服务启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 5

# 检查服务状态
if curl -s http://localhost:8000/api/status > /dev/null 2>&1; then
    echo ""
    echo -e "${GREEN}✓ 后端服务启动成功！${NC}"
    echo -e "${GREEN}  地址: http://localhost:8000${NC}"
    echo -e "${GREEN}  API文档: http://localhost:8000/docs${NC}"
    echo -e "${GREEN}  PID: $BACKEND_PID${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ 后端服务启动失败${NC}"
    echo -e "${YELLOW}  请检查日志: tail -f logs/backend.log${NC}"
    echo ""
    exit 1
fi
