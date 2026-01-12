#!/bin/bash
# AI Life Assistant - 项目初始化脚本
# 用途: 首次安装项目依赖和配置环境

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🚀 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

echo "=================================="
echo "🤖 AI Life Assistant - 项目初始化"
echo "=================================="

# 1. 检查 Python 和 uv
print_step "检查 Python 环境..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 python3${NC}"
    exit 1
fi

if ! command -v uv &> /dev/null; then
    print_info "uv 未安装，正在安装..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
fi
print_success "Python 和 uv 环境就绪"

# 2. 初始化后端
if [ -d "backend" ]; then
    print_step "初始化后端 (backend)..."
    cd backend
    if [ ! -d ".venv" ]; then
        uv venv .venv
    fi
    source .venv/bin/activate
    
    if [ -f "requirements/base.txt" ]; then
        uv pip install -r requirements/base.txt
    elif [ -f "requirements.txt" ]; then
        uv pip install -r requirements.txt
    fi
    
    # 初始化环境文件
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
        print_info "已创建 backend/.env，请记得配置"
    fi
    cd ..
    print_success "后端初始化完成"
fi

# 3. 初始化前端
if [ -d "frontend" ]; then
    print_step "初始化前端 (frontend)..."
    cd frontend
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        print_info "未找到 pnpm 或 npm，跳过前端依赖安装"
    fi
    cd ..
    print_success "前端初始化完成"
fi

# 4. 创建必要目录
print_step "创建公共目录..."
mkdir -p logs data/daily_logs tests
print_success "目录创建完成"

# 5. 配置根目录环境文件
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    print_success "已创建根目录 .env"
fi

echo "=================================="
print_success "项目初始化完成！"
echo ""
echo -e "📝 ${BLUE}下一步:${NC}"
echo "  1. 配置 .env 文件 (根目录和 backend 目录)"
echo "  2. 启动开发环境: ./scripts/start-dev.sh"
echo "=================================="
