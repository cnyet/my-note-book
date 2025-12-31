"""
Unit tests for ReviewSecretary agent.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from agents.review_secretary import ReviewSecretary


class TestReviewSecretaryInit:
    """Test ReviewSecretary initialization."""

    def test_init_with_config(self, mock_config_dict):
        """Test initialization with config dictionary."""
        secretary = ReviewSecretary(config=mock_config_dict)

        assert secretary.config == mock_config_dict
        assert secretary.llm_client is not None
        assert secretary.file_manager is not None

    def test_reflection_dimensions_initialized(self, mock_config_dict):
        """Test reflection dimensions are initialized."""
        secretary = ReviewSecretary(config=mock_config_dict)

        assert 'work' in secretary.reflection_dimensions
        assert 'personal' in secretary.reflection_dimensions
        assert 'health' in secretary.reflection_dimensions
        assert 'relationships' in secretary.reflection_dimensions
        assert 'gratitude' in secretary.reflection_dimensions


class TestReviewSecretaryDataCollection:
    """Test data collection from logs."""

    @patch('os.path.exists')
    def test_collect_today_data_no_files(
        self, mock_exists, mock_config_dict
    ):
        """Test collecting data when no files exist."""
        mock_exists.return_value = False

        secretary = ReviewSecretary(config=mock_config_dict)
        data = secretary._collect_today_data()

        assert 'date' in data
        assert 'files' in data
        assert 'summary' in data
        assert len(data['files']) == 0

    @patch('os.path.exists')
    @patch('builtins.open', create=True)
    def test_collect_today_data_with_files(
        self, mock_open, mock_exists, mock_config_dict
    ):
        """Test collecting data with existing files."""
        mock_exists.return_value = True
        mock_open.return_value.__enter__.return_value.read.return_value = "测试内容"

        secretary = ReviewSecretary(config=mock_config_dict)
        data = secretary._collect_today_data()

        assert 'files' in data
        assert 'summary' in data


class TestReviewSecretaryExtraction:
    """Test data extraction from logs."""

    def test_extract_work_summary(self, mock_config_dict):
        """Test extracting work summary."""
        secretary = ReviewSecretary(config=mock_config_dict)

        content = """# 今日工作
## 高优先级
- [x] 完成项目文档
- [ ] 代码审查

## 中优先级
- [x] 团队会议
"""
        result = secretary._extract_work_summary(content)

        assert 'tasks_completed' in result
        assert 'tasks_pending' in result
        assert len(result['tasks_completed']) >= 1

    def test_extract_life_summary(self, mock_config_dict):
        """Test extracting life summary."""
        secretary = ReviewSecretary(config=mock_config_dict)

        content = """# 今日生活
运动30分钟
早餐：全麦面包
午餐：鸡胸肉
晚餐：蔬菜沙拉
饮水2000ml
"""
        result = secretary._extract_life_summary(content)

        assert 'exercise_completed' in result
        assert 'meals' in result
        assert 'water_intake' in result
        assert result['exercise_completed'] is True

    def test_extract_news_summary(self, mock_config_dict):
        """Test extracting news summary."""
        secretary = ReviewSecretary(config=mock_config_dict)

        content = """# 新闻简报
### AI技术突破
### 新的编程语言发布
"""
        result = secretary._extract_news_summary(content)

        assert 'headlines' in result
        assert 'topics' in result
        assert len(result['headlines']) >= 1

    def test_extract_outfit_summary(self, mock_config_dict):
        """Test extracting outfit summary."""
        secretary = ReviewSecretary(config=mock_config_dict)

        content = """# 今日穿搭
天气：22°C
温度适宜
上装：衬衫
下装：休闲裤
鞋履：皮鞋
"""
        result = secretary._extract_outfit_summary(content)

        assert 'main_outfit' in result
        assert 'weather_considered' in result
        assert result['weather_considered'] is True


class TestReviewSecretaryReflection:
    """Test reflection generation."""

    def test_generate_reflection(self, mock_config_dict):
        """Test generating reflection with LLM."""
        secretary = ReviewSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日复盘\n\n深度反思'
        }

        today_data = {
            'date': '2024-01-01',
            'files': {},
            'summary': {}
        }

        result = secretary._generate_reflection(today_data)

        assert '今日复盘' in result
        secretary.llm_client.send_message.assert_called_once()

    def test_generate_reflection_llm_failure(self, mock_config_dict):
        """Test fallback when LLM fails."""
        secretary = ReviewSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = None

        today_data = {
            'date': '2024-01-01',
            'files': {},
            'summary': {}
        }

        result = secretary._generate_reflection(today_data)

        assert '今日复盘' in result

    def test_prepare_reflection_context(self, mock_config_dict):
        """Test reflection context preparation."""
        secretary = ReviewSecretary(config=mock_config_dict)

        today_data = {
            'date': '2024-01-01',
            'files': {},
            'summary': {
                'work': {
                    'tasks_completed': ['任务1', '任务2'],
                    'tasks_pending': ['任务3'],
                    'highlights': ['完成重要项目'],
                    'challenges': []
                }
            }
        }

        result = secretary._prepare_reflection_context(today_data)

        assert '复盘' in result
        assert '任务1' in result or '已完成' in result


class TestReviewSecretaryBasicReflection:
    """Test basic reflection generation."""

    def test_generate_basic_reflection(self, mock_config_dict):
        """Test generating basic reflection without LLM."""
        secretary = ReviewSecretary(config=mock_config_dict)

        today_data = {
            'date': '2024-01-01',
            'files': {},
            'summary': {
                'work': {
                    'tasks_completed': ['任务1'],
                    'tasks_pending': ['任务2'],
                    'highlights': [],
                    'challenges': []
                },
                'life': {
                    'exercise_completed': True,
                    'meals': ['早餐', '午餐'],
                    'water_intake': 1800,
                    'health_tips': []
                }
            }
        }

        result = secretary._generate_basic_reflection(today_data)

        assert '今日复盘' in result
        assert '工作完成情况' in result
        assert '生活管理' in result


class TestReviewSecretaryInsights:
    """Test insights generation."""

    def test_generate_insights_with_work(self, mock_config_dict):
        """Test generating insights with work data."""
        secretary = ReviewSecretary(config=mock_config_dict)

        reflections = {}
        today_data = {
            'summary': {
                'work': {
                    'tasks_completed': ['任务1', '任务2'],
                    'tasks_pending': ['任务3', '任务4', '任务5', '任务6']
                }
            }
        }

        result = secretary._generate_insights(reflections, today_data)

        assert isinstance(result, str)
        assert len(result) > 0

    def test_generate_insights_with_health(self, mock_config_dict):
        """Test generating insights with health data."""
        secretary = ReviewSecretary(config=mock_config_dict)

        reflections = {}
        today_data = {
            'summary': {
                'life': {
                    'exercise_completed': False,
                    'water_intake': 1000
                }
            }
        }

        result = secretary._generate_insights(reflections, today_data)

        assert isinstance(result, str)


class TestReviewSecretarySave:
    """Test saving reviews."""

    def test_save_review(self, mock_config_dict, tmp_path):
        """Test saving review to file."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = ReviewSecretary(config=mock_config_dict)
        review = "# 今日复盘\n\n测试内容"

        secretary._save_review(review)

        # Check file was created
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日复盘.md"
        assert expected_file.exists()


class TestReviewSecretaryRun:
    """Test review secretary execution."""

    def test_run_success(self, mock_config_dict, tmp_path):
        """Test successful run."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = ReviewSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日复盘\n\n完整反思'
        }

        with patch('os.path.exists', return_value=False):
            result = secretary.run(save_to_file=True, interactive=False)

        assert '今日复盘' in result
        assert '完整反思' in result

    def test_run_without_saving(self, mock_config_dict):
        """Test run without saving to file."""
        secretary = ReviewSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '复盘内容'
        }

        with patch('os.path.exists', return_value=False):
            result = secretary.run(save_to_file=False, interactive=False)

        assert '复盘内容' in result

    def test_run_with_error(self, mock_config_dict):
        """Test run with error handling."""
        secretary = ReviewSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.side_effect = Exception("LLM Error")

        with patch('os.path.exists', return_value=False):
            result = secretary.run(save_to_file=False, interactive=False)

        assert '❌' in result or 'Failed' in result


class TestReviewSecretaryWeeklySummary:
    """Test weekly summary generation."""

    def test_get_weekly_summary(self, mock_config_dict):
        """Test getting weekly summary."""
        secretary = ReviewSecretary(config=mock_config_dict)

        summary = secretary.get_weekly_summary()

        assert '本周回顾' in summary
        assert '数据概览' in summary
        assert '本周亮点' in summary


class TestReviewSecretaryIntegration:
    """Integration tests for ReviewSecretary."""

    def test_full_workflow(self, mock_config_dict, tmp_path):
        """Test full workflow with mocked components."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = ReviewSecretary(config=mock_config_dict)

        # Mock LLM client
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日复盘\n\n完整的反思内容'
        }

        with patch('os.path.exists', return_value=False):
            result = secretary.run(save_to_file=True, interactive=False)

        assert '今日复盘' in result
        assert '完整的反思内容' in result

        # Check file was created
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日复盘.md"
        assert expected_file.exists()
