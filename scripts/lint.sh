#!/bin/bash
# AI Life Assistant - 代码检查脚本
# 用途: 运行代码质量检查和格式化

set -e

echo "🔍 AI Life Assistant - 代码检查"
echo "=================================="

# 激活虚拟环境
if [ ! -d "venv" ]; then
    echo "❌ 错误: 虚拟环境不存在"
    echo "请先运行: ./scripts/setup.sh"
    exit 1
fi

source venv/bin/activate

# 解析参数
TARGET=${1:-"all"}  # 默认检查所有
FIX=${2:-"no"}      # 默认不自动修复

# 创建日志目录
mkdir -p logs/lint

echo "📋 检查目标: $TARGET"
echo "🔧 自动修复: $FIX"
echo ""

# Python代码检查
check_python() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🐍 Python代码检查"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 检查工具是否安装
    TOOLS_MISSING=0
    
    if ! command -v flake8 &> /dev/null; then
        echo "⚠️  flake8未安装，正在安装..."
        uv pip install flake8
    fi
    
    if ! command -v black &> /dev/null; then
        echo "⚠️  black未安装，正在安装..."
        uv pip install black
    fi
    
    if ! command -v mypy &> /dev/null; then
        echo "⚠️  mypy未安装，正在安装..."
        uv pip install mypy
    fi
    
    # 1. Flake8检查
    echo ""
    echo "📋 运行Flake8检查..."
    if flake8 main.py agents/ utils/ api/ \
        --max-line-length=300 \
        --ignore=E501,W503 \
        --exclude=venv,__pycache__,.git \
        | tee logs/lint/flake8.log; then
        echo "✅ Flake8检查通过"
    else
        echo "⚠️  Flake8发现问题，请查看: logs/lint/flake8.log"
    fi
    
    # 2. Black格式化
    echo ""
    echo "📋 运行Black格式检查..."
    if [ "$FIX" = "yes" ]; then
        echo "🔧 自动格式化代码..."
        black main.py agents/ utils/ api/ \
            --line-length=300 \
            --exclude='/(venv|__pycache__|\.git)/' \
            | tee logs/lint/black.log
        echo "✅ 代码已格式化"
    else
        if black main.py agents/ utils/ api/ \
            --check \
            --line-length=300 \
            --exclude='/(venv|__pycache__|\.git)/' \
            | tee logs/lint/black.log; then
            echo "✅ Black格式检查通过"
        else
            echo "⚠️  代码格式需要调整"
            echo "💡 运行 './scripts/lint.sh python yes' 自动格式化"
        fi
    fi
    
    # 3. MyPy类型检查
    echo ""
    echo "📋 运行MyPy类型检查..."
    if mypy main.py agents/ utils/ api/ \
        --ignore-missing-imports \
        --no-strict-optional \
        | tee logs/lint/mypy.log; then
        echo "✅ MyPy类型检查通过"
    else
        echo "⚠️  MyPy发现类型问题，请查看: logs/lint/mypy.log"
    fi
    
    # 4. 文件规模检查
    echo ""
    echo "📋 检查文件规模（≤300行）..."
    OVERSIZED_FILES=0
    while IFS= read -r file; do
        LINES=$(wc -l < "$file")
        if [ $LINES -gt 300 ]; then
            echo "⚠️  $file: $LINES 行（超过300行限制）"
            OVERSIZED_FILES=$((OVERSIZED_FILES + 1))
        fi
    done < <(find . -name "*.py" -not -path "./venv/*" -not -path "./__pycache__/*")
    
    if [ $OVERSIZED_FILES -eq 0 ]; then
        echo "✅ 所有文件符合规模要求"
    else
        echo "⚠️  发现 $OVERSIZED_FILES 个超标文件"
    fi
    
    echo ""
    echo "✅ Python代码检查完成"
}

# Web应用代码检查
check_web() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 Web应用代码检查"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ ! -d "web-app" ]; then
        echo "⚠️  web-app目录不存在，跳过检查"
        return
    fi
    
    cd web-app
    
    # 1. ESLint检查
    echo ""
    echo "📋 运行ESLint检查..."
    if [ "$FIX" = "yes" ]; then
        echo "🔧 自动修复ESLint问题..."
        npm run lint -- --fix | tee ../logs/lint/eslint.log || true
        echo "✅ ESLint问题已修复"
    else
        if npm run lint | tee ../logs/lint/eslint.log; then
            echo "✅ ESLint检查通过"
        else
            echo "⚠️  ESLint发现问题"
            echo "💡 运行 './scripts/lint.sh web yes' 自动修复"
        fi
    fi
    
    # 2. TypeScript类型检查
    echo ""
    echo "📋 运行TypeScript类型检查..."
    if npx tsc --noEmit | tee ../logs/lint/typescript.log; then
        echo "✅ TypeScript类型检查通过"
    else
        echo "⚠️  TypeScript发现类型错误，请查看: logs/lint/typescript.log"
    fi
    
    # 3. 文件规模检查
    echo ""
    echo "📋 检查文件规模（≤300行）..."
    OVERSIZED_FILES=0
    while IFS= read -r file; do
        LINES=$(wc -l < "$file")
        if [ $LINES -gt 300 ]; then
            echo "⚠️  $file: $LINES 行（超过300行限制）"
            OVERSIZED_FILES=$((OVERSIZED_FILES + 1))
        fi
    done < <(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null)
    
    if [ $OVERSIZED_FILES -eq 0 ]; then
        echo "✅ 所有文件符合规模要求"
    else
        echo "⚠️  发现 $OVERSIZED_FILES 个超标文件"
    fi
    
    cd ..
    echo ""
    echo "✅ Web应用代码检查完成"
}

# 执行检查
case $TARGET in
    "python")
        check_python
        ;;
    
    "web")
        check_web
        ;;
    
    "all")
        check_python
        echo ""
        check_web
        ;;
    
    *)
        echo "❌ 错误: 未知目标 '$TARGET'"
        echo ""
        echo "用法: ./scripts/lint.sh [目标] [修复]"
        echo ""
        echo "可用目标:"
        echo "  python - 检查Python代码"
        echo "  web    - 检查Web应用代码"
        echo "  all    - 检查所有代码（默认）"
        echo ""
        echo "修复选项:"
        echo "  yes - 自动修复可修复的问题"
        echo "  no  - 仅检查不修复（默认）"
        echo ""
        echo "示例:"
        echo "  ./scripts/lint.sh python"
        echo "  ./scripts/lint.sh all yes"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "✅ 代码检查完成！"
echo "📝 检查日志已保存到: logs/lint/"
echo "=================================="
