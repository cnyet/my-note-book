#!/bin/bash
# AI Life Assistant - 运行测试脚本
# 用途: 运行所有测试套件

set -e

echo "🧪 AI Life Assistant - 运行测试"
echo "=================================="

# 激活虚拟环境
if [ ! -d "venv" ]; then
    echo "❌ 错误: 虚拟环境不存在"
    echo "请先运行: ./scripts/setup.sh"
    exit 1
fi

source venv/bin/activate

# 解析参数
TEST_TYPE=${1:-"all"}  # 默认运行所有测试
COVERAGE=${2:-"yes"}   # 默认生成覆盖率报告

# 创建测试日志目录
mkdir -p logs/tests

case $TEST_TYPE in
    "python")
        echo "🐍 运行Python测试..."
        echo ""
        
        if [ ! -d "tests" ]; then
            echo "⚠️  警告: tests目录不存在，创建示例测试..."
            mkdir -p tests
            echo "# 测试文件将在此目录" > tests/__init__.py
        fi
        
        # 检查pytest是否安装
        if ! command -v pytest &> /dev/null; then
            echo "⚠️  pytest未安装，正在安装..."
            uv pip install pytest pytest-cov pytest-mock
        fi
        
        # 运行测试
        if [ "$COVERAGE" = "yes" ]; then
            echo "📊 运行测试并生成覆盖率报告..."
            pytest tests/ \
                --cov=agents \
                --cov=utils \
                --cov=api \
                --cov-report=html \
                --cov-report=term \
                --cov-report=xml \
                -v \
                | tee logs/tests/python-test.log
            
            echo ""
            echo "📊 覆盖率报告已生成:"
            echo "  HTML: htmlcov/index.html"
            echo "  XML:  coverage.xml"
        else
            pytest tests/ -v | tee logs/tests/python-test.log
        fi
        
        echo "✅ Python测试完成"
        ;;
    
    "web")
        echo "🌐 运行Web应用测试..."
        echo ""
        
        if [ ! -d "web-app" ]; then
            echo "❌ 错误: web-app目录不存在"
            exit 1
        fi
        
        cd web-app
        
        # 检查测试脚本
        if ! grep -q "\"test\"" package.json; then
            echo "⚠️  警告: package.json中未配置test脚本"
            echo "跳过Web测试..."
            cd ..
            return
        fi
        
        # 运行测试
        if [ "$COVERAGE" = "yes" ]; then
            echo "📊 运行测试并生成覆盖率报告..."
            npm run test -- --coverage | tee ../logs/tests/web-test.log
        else
            npm run test | tee ../logs/tests/web-test.log
        fi
        
        cd ..
        echo "✅ Web应用测试完成"
        ;;
    
    "unit")
        echo "🔬 运行单元测试..."
        pytest tests/ -v -m "not integration" | tee logs/tests/unit-test.log
        echo "✅ 单元测试完成"
        ;;
    
    "integration")
        echo "🔗 运行集成测试..."
        pytest tests/ -v -m "integration" | tee logs/tests/integration-test.log
        echo "✅ 集成测试完成"
        ;;
    
    "all")
        echo "🧪 运行所有测试..."
        echo ""
        
        # Python测试
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🐍 Python测试"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        ./scripts/test.sh python $COVERAGE
        
        echo ""
        
        # Web测试
        if [ -d "web-app" ]; then
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "🌐 Web应用测试"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            ./scripts/test.sh web $COVERAGE
        fi
        
        echo ""
        echo "=================================="
        echo "✅ 所有测试完成！"
        echo "=================================="
        ;;
    
    *)
        echo "❌ 错误: 未知测试类型 '$TEST_TYPE'"
        echo ""
        echo "用法: ./scripts/test.sh [类型] [覆盖率]"
        echo ""
        echo "可用类型:"
        echo "  python      - 运行Python测试"
        echo "  web         - 运行Web应用测试"
        echo "  unit        - 仅运行单元测试"
        echo "  integration - 仅运行集成测试"
        echo "  all         - 运行所有测试（默认）"
        echo ""
        echo "覆盖率选项:"
        echo "  yes - 生成覆盖率报告（默认）"
        echo "  no  - 不生成覆盖率报告"
        echo ""
        echo "示例:"
        echo "  ./scripts/test.sh python"
        echo "  ./scripts/test.sh all no"
        exit 1
        ;;
esac

# 检查测试结果
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ 所有测试通过！"
    
    # 检查覆盖率
    if [ "$COVERAGE" = "yes" ] && [ -f "coverage.xml" ]; then
        COVERAGE_PERCENT=$(python3 -c "import xml.etree.ElementTree as ET; tree = ET.parse('coverage.xml'); root = tree.getroot(); print(root.attrib.get('line-rate', '0'))" 2>/dev/null || echo "0")
        COVERAGE_PERCENT=$(python3 -c "print(f'{float('$COVERAGE_PERCENT') * 100:.1f}')" 2>/dev/null || echo "未知")
        
        echo "📊 代码覆盖率: $COVERAGE_PERCENT%"
        
        # 检查是否达到80%要求
        if [ "$COVERAGE_PERCENT" != "未知" ]; then
            COVERAGE_INT=$(echo $COVERAGE_PERCENT | cut -d. -f1)
            if [ $COVERAGE_INT -lt 80 ]; then
                echo "⚠️  警告: 覆盖率低于80%要求"
            else
                echo "✅ 覆盖率达标（≥80%）"
            fi
        fi
    fi
else
    echo ""
    echo "❌ 测试失败！"
    echo "请查看日志: logs/tests/"
    exit 1
fi

echo ""
echo "📝 测试日志已保存到: logs/tests/"
echo "=================================="
