#!/bin/bash
# AI Life Assistant - 项目初始化脚本
# 用途: 首次安装项目依赖和配置环境

set -e  # 遇到错误立即退出

echo "🚀 AI Life Assistant - 项目初始化"
echo "=================================="

# 检查Python版本
echo "📋 检查Python版本..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ 错误: 需要Python 3.8+，当前版本: $PYTHON_VERSION"
    exit 1
fi
echo "✅ Python版本: $PYTHON_VERSION"

# 检查uv是否安装
echo ""
echo "📋 检查uv包管理器..."
if ! command -v uv &> /dev/null; then
    echo "⚠️  uv未安装，正在安装..."
    echo "请访问: https://docs.astral.sh/uv/getting-started/installation/"
    echo "或运行: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi
echo "✅ uv已安装: $(uv --version)"

# 创建虚拟环境
echo ""
echo "📦 创建Python虚拟环境..."
if [ ! -d "venv" ]; then
    uv venv venv
    echo "✅ 虚拟环境创建成功"
else
    echo "✅ 虚拟环境已存在"
fi

# 激活虚拟环境并安装依赖
echo ""
echo "📦 安装项目依赖..."
source venv/bin/activate
uv pip install -r requirements.txt
echo "✅ 依赖安装完成"

# 创建必要的目录
echo ""
echo "📁 创建项目目录..."
mkdir -p data/daily_logs
mkdir -p data/vector_db
mkdir -p data/knowledge_base
mkdir -p logs
mkdir -p tests
echo "✅ 目录创建完成"

# 检查配置文件
echo ""
echo "⚙️  检查配置文件..."
if [ ! -f "config/config.ini" ]; then
    echo "❌ 错误: config/config.ini 不存在"
    echo "请复制 demo_config.ini 并配置API密钥"
    exit 1
fi

# 检查API密钥配置
if grep -q "YOUR_.*_API_KEY_HERE" config/config.ini; then
    echo "⚠️  警告: 检测到未配置的API密钥"
    echo "请编辑 config/config.ini 配置以下内容:"
    echo "  - LLM API密钥 (GLM或Claude)"
    echo "  - 天气API密钥 (可选)"
fi

# Web应用依赖安装（如果存在）
if [ -d "web-app" ]; then
    echo ""
    echo "📦 安装Web应用依赖..."
    cd web-app
    if [ -f "package.json" ]; then
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v npm &> /dev/null; then
            npm install
        else
            echo "⚠️  警告: 未找到npm或pnpm，跳过Web应用依赖安装"
        fi
    fi
    cd ..
    echo "✅ Web应用依赖安装完成"
fi

echo ""
echo "=================================="
echo "✅ 项目初始化完成！"
echo ""
echo "📝 下一步:"
echo "  1. 配置API密钥: 编辑 config/config.ini"
echo "  2. 运行测试: ./scripts/test.sh"
echo "  3. 启动开发: ./scripts/start-dev.sh"
echo ""
echo "📖 更多信息请查看: README.md 和 QUICKSTART.md"
echo "=================================="
