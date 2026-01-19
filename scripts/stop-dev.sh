#!/bin/bash
# AI Life Assistant - 停止开发服务脚本
# 用于快速停止所有开发服务并清理端口

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo ""
print_info "正在停止所有开发服务..."
echo ""

# 检查并停止后端服务（端口 8000）
if lsof -ti:8000 > /dev/null 2>&1; then
    print_warning "发现后端服务正在运行（端口 8000）"
    BACKEND_PIDS=$(lsof -ti:8000)
    echo "  进程 ID: $BACKEND_PIDS"
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 1
    print_success "后端服务已停止"
else
    print_info "后端服务未运行"
fi

echo ""

# 检查并停止前端服务（端口 3000）
if lsof -ti:3000 > /dev/null 2>&1; then
    print_warning "发现前端服务正在运行（端口 3000）"
    FRONTEND_PIDS=$(lsof -ti:3000)
    echo "  进程 ID: $FRONTEND_PIDS"
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 1
    print_success "前端服务已停止"
else
    print_info "前端服务未运行"
fi

echo ""
print_success "所有服务已停止！"
echo ""
