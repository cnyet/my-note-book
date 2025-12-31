#!/bin/bash
# AI Life Assistant - 构建项目脚本
# 用途: 构建生产版本

set -e

echo "🔨 AI Life Assistant - 构建项目"
echo "=================================="

# 激活虚拟环境
if [ ! -d "venv" ]; then
    echo "❌ 错误: 虚拟环境不存在"
    echo "请先运行: ./scripts/setup.sh"
    exit 1
fi

source venv/bin/activate

# 解析参数
TARGET=${1:-"all"}  # 默认构建所有

# 创建构建目录
mkdir -p dist
mkdir -p logs

case $TARGET in
    "python")
        echo "🐍 构建Python应用..."
        echo ""
        
        # 运行类型检查
        echo "📋 运行类型检查..."
        if command -v mypy &> /dev/null; then
            mypy main.py agents/ utils/ --ignore-missing-imports || echo "⚠️  类型检查发现问题"
        else
            echo "⚠️  mypy未安装，跳过类型检查"
        fi
        
        # 运行代码检查
        echo "📋 运行代码检查..."
        if command -v flake8 &> /dev/null; then
            flake8 main.py agents/ utils/ --max-line-length=300 || echo "⚠️  代码检查发现问题"
        else
            echo "⚠️  flake8未安装，跳过代码检查"
        fi
        
        echo "✅ Python应用构建完成"
        ;;
    
    "web")
        echo "🌐 构建Web应用..."
        echo ""
        
        if [ ! -d "web-app" ]; then
            echo "❌ 错误: web-app目录不存在"
            exit 1
        fi
        
        cd web-app
        
        # 安装依赖
        echo "📦 安装依赖..."
        if command -v pnpm &> /dev/null; then
            pnpm install
        else
            npm install
        fi
        
        # 运行类型检查
        echo "📋 运行TypeScript类型检查..."
        npx tsc --noEmit || echo "⚠️  类型检查发现问题"
        
        # 运行Lint
        echo "📋 运行ESLint检查..."
        npm run lint || echo "⚠️  Lint检查发现问题"
        
        # 构建生产版本
        echo "🔨 构建生产版本..."
        npm run build
        
        cd ..
        echo "✅ Web应用构建完成"
        echo "📁 构建输出: web-app/.next/"
        ;;
    
    "all")
        echo "🔨 构建所有组件..."
        echo ""
        
        # 构建Python
        ./scripts/build.sh python
        
        echo ""
        
        # 构建Web
        ./scripts/build.sh web
        
        echo ""
        echo "=================================="
        echo "✅ 所有组件构建完成！"
        echo "=================================="
        ;;
    
    *)
        echo "❌ 错误: 未知目标 '$TARGET'"
        echo ""
        echo "用法: ./scripts/build.sh [目标]"
        echo ""
        echo "可用目标:"
        echo "  python - 构建Python应用"
        echo "  web    - 构建Web应用"
        echo "  all    - 构建所有组件（默认）"
        echo ""
        echo "示例:"
        echo "  ./scripts/build.sh python"
        echo "  ./scripts/build.sh web"
        exit 1
        ;;
esac

# 记录构建信息
BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo ""
echo "📝 构建信息:"
echo "  时间: $BUILD_TIME"
echo "  目标: $TARGET"
echo "  日志: logs/build.log"

# 保存构建日志
{
    echo "=================================="
    echo "构建时间: $BUILD_TIME"
    echo "构建目标: $TARGET"
    echo "构建状态: 成功"
    echo "=================================="
} >> logs/build.log

echo ""
echo "=================================="
echo "✅ 构建完成！"
echo "=================================="
