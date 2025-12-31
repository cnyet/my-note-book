#!/bin/bash
# AI Life Assistant - 停止服务脚本
# 停止所有运行中的前后端服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🛑 停止 AI Life Assistant 服务${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 停止后端服务
print_info "查找后端服务进程..."
BACKEND_PIDS=$(pgrep -f "uvicorn.*server:app" || true)

if [ -z "$BACKEND_PIDS" ]; then
    print_warning "未找到运行中的后端服务"
else
    print_info "停止后端服务 (PIDs: $BACKEND_PIDS)..."
    echo "$BACKEND_PIDS" | xargs kill 2>/dev/null || true
    sleep 1
    print_success "后端服务已停止"
fi

# 停止前端服务
print_info "查找前端服务进程..."
FRONTEND_PIDS=$(pgrep -f "next dev" || true)

if [ -z "$FRONTEND_PIDS" ]; then
    print_warning "未找到运行中的前端服务"
else
    print_info "停止前端服务 (PIDs: $FRONTEND_PIDS)..."
    echo "$FRONTEND_PIDS" | xargs kill 2>/dev/null || true
    sleep 1
    print_success "前端服务已停止"
fi

# 停止 Node.js 相关进程（如果有残留）
NODE_PIDS=$(pgrep -f "node.*web-app" || true)
if [ ! -z "$NODE_PIDS" ]; then
    print_info "清理残留的 Node.js 进程..."
    echo "$NODE_PIDS" | xargs kill 2>/dev/null || true
fi

echo ""
print_success "所有服务已停止！"
echo ""
