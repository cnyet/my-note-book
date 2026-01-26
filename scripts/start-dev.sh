#!/bin/bash
# AI Life Assistant - 快速启动脚本
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
    
    # 清理端口
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    echo ""
    print_success "所有服务已停止，再见！👋"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM EXIT

# 清理占用的端口
cleanup_ports() {
    print_info "检查端口占用情况..."
    
    # 检查并清理 8000 端口
    if lsof -ti:8000 > /dev/null 2>&1; then
        print_warning "端口 8000 被占用，正在清理..."
        lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "端口 8000 已释放"
    fi
    
    # 检查并清理 3000 端口
    if lsof -ti:3000 > /dev/null 2>&1; then
        print_warning "端口 3000 被占用，正在清理..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "端口 3000 已释放"
    fi
}

# 检查必要的目录和文件以及外部依赖（Docker, Ollama）
check_prerequisites() {
    print_info "检查环境..."
    
    # 后端检查
    if [ ! -d "backend" ]; then
        print_error "backend 目录不存在"
        exit 1
    fi

    if [ ! -d "backend/.venv" ]; then
        print_warning "backend/.venv 不存在，请运行 ./scripts/setup.sh"
        exit 1
    fi
    
    # 前端检查
    if [ ! -d "frontend" ]; then
        print_error "frontend 目录不存在"
        exit 1
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        print_warning "前端依赖未安装，请运行 ./scripts/setup.sh"
        exit 1
    fi

    # Docker 检查
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_warning "Docker 守护进程未启动，尝试启动 Docker..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open --background -a Docker
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo systemctl start docker
        fi
        
        # 等待 Docker 启动
        print_info "等待 Docker 启动 (最多 30 秒)..."
        for i in {1..30}; do
            if docker info &> /dev/null; then
                print_success "Docker 已启动"
                break
            fi
            sleep 1
            if [ $i -eq 30 ]; then
                print_error "无法启动 Docker，请手动启动 Docker 后重试"
                exit 1
            fi
        done
    fi

    # Ollama 检查
    if ! lsof -i :11434 > /dev/null 2>&1; then
        print_warning "Ollama 未运行，尝试启动 Ollama..."
        if command -v ollama &> /dev/null; then
            nohup ollama serve > logs/ollama.log 2>&1 &
            print_info "等待 Ollama 服务就绪..."
            for i in {1..10}; do
                if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
                    print_success "Ollama 已启动"
                    break
                fi
                sleep 1
            done
        else
            print_error "未找到 ollama 命令，请先安装 Ollama"
            exit 1
        fi
    else
        print_success "Ollama 正在运行"
    fi

    # 启动 LobeChat 容器
    if [ -f "docker-compose.yml" ]; then
        print_info "启动 LobeChat 容器..."
        if docker compose up -d; then
            print_success "LobeChat 容器已启动"
        else
            print_error "无法启动 LobeChat 容器"
        fi
    fi
    
    # 日志目录
    if [ ! -d "logs" ]; then
        mkdir -p logs
    fi
}

start_backend() {
    print_info "启动后端服务..."
    
    cd backend
    # 使用 .venv 中的 python 运行 uvicorn
    nohup .venv/bin/python -m uvicorn src.api.server:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    print_info "等待后端服务启动..."
    sleep 3
    
    if curl -s http://localhost:8000/api/status > /dev/null 2>&1; then
        print_success "后端服务启动成功 (PID: $BACKEND_PID)"
    else
        print_warning "后端服务可能未完全启动，请检查 logs/backend.log"
    fi
}

start_frontend() {
    print_info "启动前端服务..."
    
    cd frontend
    if command -v pnpm &> /dev/null; then
        nohup pnpm dev > ../logs/frontend.log 2>&1 &
    else
        nohup npm run dev > ../logs/frontend.log 2>&1 &
    fi
    FRONTEND_PID=$!
    cd ..
    
    print_info "等待前端服务启动..."
    sleep 5
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "前端服务启动成功 (PID: $FRONTEND_PID)"
    else
        print_warning "前端服务可能未完全启动，请检查 logs/frontend.log"
    fi
}

show_status() {
    echo ""
    echo -e "  后端地址: ${GREEN}http://localhost:8000${NC}"
    echo -e "  前端地址: ${GREEN}http://localhost:3000${NC}"
    echo -e "  API文档 : ${GREEN}http://localhost:8000/docs${NC}"
    echo ""
    print_info "查看日志: tail -f logs/backend.log 或 logs/frontend.log"
    print_info "停止服务: 按 Ctrl+C"
}

main() {
    print_header
    cleanup_ports
    check_prerequisites
    start_backend
    start_frontend
    show_status
    
    # 保持运行
    while true; do sleep 1; done
}

main
