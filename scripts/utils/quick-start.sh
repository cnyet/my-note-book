#!/bin/bash
# AI Life Assistant - 一键启动脚本
# 快速启动前后端服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
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

print_header() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🤖 AI Life Assistant - 快速启动${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 清理函数
cleanup() {
    echo ""
    print_info "正在停止服务..."
    
    # 停止后端
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null || true
        print_success "后端服务已停止"
    fi
    
    # 停止前端
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "前端服务已停止"
    fi
    
    echo ""
    print_success "所有服务已停止，再见！👋"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM EXIT

# 检查必要的目录和文件
check_prerequisites() {
    print_info "检查环境..."
    
    # 检查虚拟环境
    if [ ! -d "venv" ]; then
        print_error "虚拟环境不存在"
        print_info "正在创建虚拟环境..."
        python3 -m venv venv
        source venv/bin/activate
        print_info "正在安装依赖..."
        if [ -f "backend/requirements/base.txt" ]; then
            pip install -r backend/requirements/base.txt
        elif [ -f "backend/requirements.txt" ]; then
            pip install -r backend/requirements.txt
        else
            print_error "找不到 requirements 文件"
            exit 1
        fi
        print_success "虚拟环境创建完成"
    else
        print_success "虚拟环境已存在"
    fi
    
    # 检查 frontend 目录
    if [ ! -d "frontend" ]; then
        print_error "frontend 目录不存在"
        exit 1
    fi
    
    # 检查 frontend 依赖
    if [ ! -d "frontend/node_modules" ]; then
        print_warning "前端依赖未安装"
        print_info "正在安装前端依赖..."
        cd frontend
        if command -v pnpm &> /dev/null; then
            pnpm install
        else
            npm install
        fi
        cd ..
        print_success "前端依赖安装完成"
    else
        print_success "前端依赖已安装"
    fi
    
    # 检查 logs 目录
    if [ ! -d "logs" ]; then
        mkdir -p logs
        print_success "创建 logs 目录"
    fi
    
    # 检查 backend 目录
    if [ ! -d "backend" ]; then
        print_error "backend 目录不存在"
        exit 1
    fi
}

# 启动后端服务
start_backend() {
    print_info "启动后端服务..."
    
    # 激活虚拟环境
    source venv/bin/activate
    
    # 启动后端（后台运行）
    cd backend/src/api
    nohup uvicorn server:app --reload --host 0.0.0.0 --port 8000 > ../../../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ../../..
    
    # 等待后端启动
    print_info "等待后端服务启动..."
    sleep 3
    
    # 检查后端是否启动成功
    if curl -s http://localhost:8000/api/status > /dev/null 2>&1; then
        print_success "后端服务启动成功 (PID: $BACKEND_PID)"
        print_success "后端地址: ${GREEN}http://localhost:8000${NC}"
        print_success "API文档: ${GREEN}http://localhost:8000/docs${NC}"
    else
        print_warning "后端服务可能未完全启动，请检查日志"
        print_info "日志文件: logs/backend.log"
    fi
}

# 启动前端服务
start_frontend() {
    print_info "启动前端服务..."
    
    cd frontend
    
    # 启动前端（后台运行）
    if command -v pnpm &> /dev/null; then
        nohup pnpm dev > ../logs/frontend.log 2>&1 &
    else
        nohup npm run dev > ../logs/frontend.log 2>&1 &
    fi
    
    FRONTEND_PID=$!
    cd ..
    
    # 等待前端启动
    print_info "等待前端服务启动..."
    sleep 5
    
    # 检查前端是否启动成功
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "前端服务启动成功 (PID: $FRONTEND_PID)"
        print_success "前端地址: ${GREEN}http://localhost:3000${NC}"
    else
        print_warning "前端服务可能未完全启动，请检查日志"
        print_info "日志文件: logs/frontend.log"
    fi
}

# 显示服务状态
show_status() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📊 服务状态${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${GREEN}●${NC} 后端服务: http://localhost:8000"
    echo -e "  ${GREEN}●${NC} 前端服务: http://localhost:3000"
    echo -e "  ${GREEN}●${NC} API文档:  http://localhost:8000/docs"
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📝 可用账户${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  邮箱: ${YELLOW}dahong@example.com${NC}"
    echo -e "  密码: ${YELLOW}password123${NC}"
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}💡 提示${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  • 查看后端日志: ${YELLOW}tail -f logs/backend.log${NC}"
    echo -e "  • 查看前端日志: ${YELLOW}tail -f logs/frontend.log${NC}"
    echo -e "  • 停止服务: 按 ${YELLOW}Ctrl+C${NC}"
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 等待用户中断
wait_for_interrupt() {
    echo ""
    print_info "服务正在运行中... (按 Ctrl+C 停止)"
    echo ""
    
    # 无限循环，等待用户中断
    while true; do
        sleep 1
    done
}

# 主函数
main() {
    print_header
    echo ""
    
    # 检查环境
    check_prerequisites
    echo ""
    
    # 启动后端
    start_backend
    echo ""
    
    # 启动前端
    start_frontend
    
    # 显示状态
    show_status
    
    # 等待用户中断
    wait_for_interrupt
}

# 运行主函数
main
