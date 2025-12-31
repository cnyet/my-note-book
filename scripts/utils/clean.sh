#!/bin/bash
# AI Life Assistant - 清理构建文件脚本
# 用途: 清理临时文件、缓存和构建产物

set -e

echo "🧹 AI Life Assistant - 清理构建文件"
echo "=================================="

# 解析参数
CLEAN_TYPE=${1:-"build"}  # 默认清理构建文件

case $CLEAN_TYPE in
    "build")
        echo "🗑️  清理构建文件..."
        
        # Python构建文件
        echo "  - Python缓存..."
        find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
        find . -type f -name "*.pyc" -delete 2>/dev/null || true
        find . -type f -name "*.pyo" -delete 2>/dev/null || true
        find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
        rm -rf build/ dist/ *.egg-info 2>/dev/null || true
        
        # Web应用构建文件
        if [ -d "web-app" ]; then
            echo "  - Web应用构建..."
            rm -rf web-app/.next 2>/dev/null || true
            rm -rf web-app/out 2>/dev/null || true
            rm -rf web-app/build 2>/dev/null || true
        fi
        
        # 测试覆盖率文件
        echo "  - 测试覆盖率..."
        rm -rf htmlcov/ .coverage coverage.xml .pytest_cache/ 2>/dev/null || true
        
        # MyPy缓存
        echo "  - MyPy缓存..."
        rm -rf .mypy_cache/ 2>/dev/null || true
        
        echo "✅ 构建文件清理完成"
        ;;
    
    "deps")
        echo "🗑️  清理依赖文件..."
        
        # Python依赖
        echo "  - Python虚拟环境..."
        read -p "⚠️  确认删除venv目录？(y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf venv
            echo "✅ Python虚拟环境已删除"
        else
            echo "⏭️  跳过Python虚拟环境"
        fi
        
        # Web应用依赖
        if [ -d "web-app/node_modules" ]; then
            echo "  - Web应用依赖..."
            read -p "⚠️  确认删除node_modules目录？(y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                rm -rf web-app/node_modules
                echo "✅ Web应用依赖已删除"
            else
                echo "⏭️  跳过Web应用依赖"
            fi
        fi
        
        echo "✅ 依赖文件清理完成"
        ;;
    
    "logs")
        echo "🗑️  清理日志文件..."
        
        read -p "⚠️  确认清理logs目录？(y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # 保留目录结构，只删除文件
            find logs -type f -name "*.log" -delete 2>/dev/null || true
            find logs -type f -name "*.md" ! -name "README.md" -delete 2>/dev/null || true
            echo "✅ 日志文件已清理"
        else
            echo "⏭️  跳过日志清理"
        fi
        ;;
    
    "data")
        echo "🗑️  清理数据文件..."
        
        echo "⚠️  警告: 这将删除所有生成的数据！"
        read -p "确认清理data目录？(y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # 清理daily_logs
            if [ -d "data/daily_logs" ]; then
                rm -rf data/daily_logs/*
                echo "✅ 日志数据已清理"
            fi
            
            # 清理vector_db
            if [ -d "data/vector_db" ]; then
                rm -rf data/vector_db/*
                echo "✅ 向量数据库已清理"
            fi
            
            # 清理knowledge_base
            if [ -d "data/knowledge_base" ]; then
                rm -rf data/knowledge_base/*
                echo "✅ 知识库已清理"
            fi
        else
            echo "⏭️  跳过数据清理"
        fi
        ;;
    
    "all")
        echo "🗑️  清理所有文件..."
        echo ""
        
        # 清理构建文件（不需要确认）
        ./scripts/clean.sh build
        
        echo ""
        
        # 清理依赖（需要确认）
        ./scripts/clean.sh deps
        
        echo ""
        
        # 清理日志（需要确认）
        ./scripts/clean.sh logs
        
        echo ""
        echo "=================================="
        echo "✅ 所有清理完成！"
        echo "=================================="
        ;;
    
    *)
        echo "❌ 错误: 未知清理类型 '$CLEAN_TYPE'"
        echo ""
        echo "用法: ./scripts/clean.sh [类型]"
        echo ""
        echo "可用类型:"
        echo "  build - 清理构建文件和缓存（默认）"
        echo "  deps  - 清理依赖文件（需确认）"
        echo "  logs  - 清理日志文件（需确认）"
        echo "  data  - 清理数据文件（需确认）"
        echo "  all   - 清理所有文件（需确认）"
        echo ""
        echo "示例:"
        echo "  ./scripts/clean.sh build"
        echo "  ./scripts/clean.sh all"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "✅ 清理完成！"
echo "=================================="
