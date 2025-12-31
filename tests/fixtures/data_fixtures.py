"""
Data fixtures for testing
"""
import pytest
from pathlib import Path


@pytest.fixture
def sample_task_list():
    """示例任务列表"""
    return [
        {'id': 1, 'title': '完成项目文档', 'completed': True, 'priority': 'high'},
        {'id': 2, 'title': '代码审查', 'completed': False, 'priority': 'high'},
        {'id': 3, 'title': '团队会议', 'completed': True, 'priority': 'medium'},
        {'id': 4, 'title': '学习新技术', 'completed': False, 'priority': 'low'},
    ]


@pytest.fixture
def sample_news_items():
    """示例新闻条目"""
    return [
        {
            'title': 'AI技术新突破',
            'summary': '研究人员开发出新的AI模型',
            'url': 'https://example.com/news1',
            'date': '2025-01-15'
        },
        {
            'title': 'Python 3.13发布',
            'summary': 'Python发布新版本，性能提升20%',
            'url': 'https://example.com/news2',
            'date': '2025-01-15'
        }
    ]


@pytest.fixture
def sample_markdown_content():
    """示例Markdown内容"""
    return """# 今日工作计划

## 高优先级任务
- [x] 完成项目文档
- [ ] 代码审查

## 中优先级任务
- [x] 团队会议
- [ ] 更新测试用例

## 低优先级任务
- [ ] 学习新技术
"""


@pytest.fixture
def sample_log_files(tmp_path):
    """创建示例日志文件"""
    log_dir = tmp_path / "daily_logs" / "2025-01-15"
    log_dir.mkdir(parents=True)
    
    files = {
        '新闻简报.md': '# 今日新闻\n\n测试内容',
        '今日工作.md': '# 今日工作\n\n- [x] 任务1',
        '今日生活.md': '# 今日生活\n\n运动完成'
    }
    
    for filename, content in files.items():
        (log_dir / filename).write_text(content, encoding='utf-8')
    
    return log_dir
