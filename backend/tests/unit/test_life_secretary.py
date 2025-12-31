"""
Unit tests for LifeSecretary agent.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timedelta
from agents.life_secretary import LifeSecretary


class TestLifeSecretaryInit:
    """Test LifeSecretary initialization."""

    def test_init_with_config(self, mock_config_dict):
        """Test initialization with config dictionary."""
        secretary = LifeSecretary(config=mock_config_dict)

        assert secretary.config == mock_config_dict
        assert secretary.llm_client is not None
        assert secretary.file_manager is not None

    def test_user_profile_initialized(self, mock_config_dict):
        """Test user profile is initialized."""
        secretary = LifeSecretary(config=mock_config_dict)

        assert 'name' in secretary.user_profile
        assert 'health_goals' in secretary.user_profile
        assert 'daily_routine' in secretary.user_profile
        assert secretary.user_profile['name'] == '大洪'


class TestLifeSecretaryContext:
    """Test context gathering."""

    def test_get_life_context(self, mock_config_dict):
        """Test getting life context."""
        secretary = LifeSecretary(config=mock_config_dict)

        context = secretary._get_life_context()

        assert 'date' in context
        assert 'day_of_week' in context
        assert 'user_profile' in context
        assert 'recent_logs' in context
        assert 'health_metrics' in context

    def test_get_health_metrics(self, mock_config_dict):
        """Test getting health metrics."""
        secretary = LifeSecretary(config=mock_config_dict)

        metrics = secretary._get_health_metrics()

        assert isinstance(metrics, dict)
        assert 'weight' in metrics
        assert 'body_fat' in metrics


class TestLifeSecretaryExtraction:
    """Test data extraction from logs."""

    def test_extract_exercise_info_completed(self, mock_config_dict):
        """Test extracting completed exercise info."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = "今天运动了30分钟"
        result = secretary._extract_exercise_info(content)

        assert result['completed'] is True
        assert result['duration'] == 30

    def test_extract_exercise_info_not_completed(self, mock_config_dict):
        """Test extracting when no exercise."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = "今天休息了一整天"
        result = secretary._extract_exercise_info(content)

        assert result['completed'] is False

    def test_extract_exercise_info_hours(self, mock_config_dict):
        """Test extracting exercise in hours."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = "锻炼了2小时"
        result = secretary._extract_exercise_info(content)

        assert result['completed'] is True
        assert result['duration'] == 120

    def test_extract_meal_info(self, mock_config_dict):
        """Test extracting meal information."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = """早餐
全麦面包
午餐
鸡胸肉
晚餐
蔬菜沙拉"""
        result = secretary._extract_meal_info(content)

        assert len(result) >= 1

    def test_extract_sleep_info(self, mock_config_dict):
        """Test extracting sleep information."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = "睡眠8小时，质量很好"
        result = secretary._extract_sleep_info(content)

        assert result['hours'] == 8.0
        assert result['quality'] == '很好'

    def test_extract_water_info(self, mock_config_dict):
        """Test extracting water intake."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = "饮水2000ml"
        result = secretary._extract_water_info(content)

        assert result == 2000

    def test_extract_water_info_no_data(self, mock_config_dict):
        """Test extracting water when no data."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = "今天的记录"
        result = secretary._extract_water_info(content)

        assert result == 0

    def test_extract_notes(self, mock_config_dict):
        """Test extracting notes."""
        secretary = LifeSecretary(config=mock_config_dict)

        content = """备注：记得多喝水
注意：早点休息
提醒：明天有会议"""
        result = secretary._extract_notes(content)

        assert len(result) >= 1


class TestLifeSecretaryPlanGeneration:
    """Test life plan generation."""

    def test_generate_life_plan(self, mock_config_dict):
        """Test generating life plan with LLM."""
        secretary = LifeSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日生活管理\n\n饮食计划'
        }

        context = {
            'date': '2024-01-01',
            'day_of_week': 'Monday',
            'user_profile': secretary.user_profile,
            'recent_logs': [],
            'health_metrics': {}
        }

        result = secretary._generate_life_plan(context)

        assert '今日生活管理' in result
        secretary.llm_client.send_message.assert_called_once()

    def test_generate_life_plan_llm_failure(self, mock_config_dict):
        """Test fallback when LLM fails."""
        secretary = LifeSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = None

        context = {
            'date': '2024-01-01',
            'day_of_week': 'Monday',
            'user_profile': secretary.user_profile,
            'recent_logs': [],
            'health_metrics': {}
        }

        result = secretary._generate_life_plan(context)

        assert '今日生活管理' in result
        assert '饮食计划' in result

    def test_prepare_llm_context(self, mock_config_dict):
        """Test LLM context preparation."""
        secretary = LifeSecretary(config=mock_config_dict)

        context = {
            'date': '2024-01-01',
            'day_of_week': 'Monday',
            'user_profile': secretary.user_profile,
            'recent_logs': [],
            'health_metrics': {}
        }

        result = secretary._prepare_llm_context(context)

        assert '大洪' in result
        assert '37' in result
        assert '技术专家' in result


class TestLifeSecretaryBasicPlan:
    """Test basic plan generation."""

    def test_generate_basic_plan_weekday(self, mock_config_dict):
        """Test generating basic plan for weekday."""
        secretary = LifeSecretary(config=mock_config_dict)

        context = {
            'date': '2024-01-01',
            'day_of_week': 'Monday',
            'user_profile': secretary.user_profile,
            'recent_logs': [],
            'health_metrics': {}
        }

        result = secretary._generate_basic_plan(context)

        assert '今日生活管理' in result
        assert '饮食计划' in result
        assert '运动安排' in result
        assert '作息建议' in result

    def test_generate_basic_plan_weekend(self, mock_config_dict):
        """Test generating basic plan for weekend."""
        secretary = LifeSecretary(config=mock_config_dict)

        context = {
            'date': '2024-01-06',
            'day_of_week': 'Saturday',
            'user_profile': secretary.user_profile,
            'recent_logs': [],
            'health_metrics': {}
        }

        result = secretary._generate_basic_plan(context)

        assert '今日生活管理' in result
        assert '休息' in result or '轻度活动' in result


class TestLifeSecretarySave:
    """Test saving plans."""

    def test_save_plan(self, mock_config_dict, tmp_path):
        """Test saving plan to file."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = LifeSecretary(config=mock_config_dict)
        plan = "# 今日生活管理\n\n测试内容"

        secretary._save_plan(plan)

        # Check file was created
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日生活.md"
        assert expected_file.exists()


class TestLifeSecretaryRun:
    """Test life secretary execution."""

    def test_run_success(self, mock_config_dict, tmp_path):
        """Test successful run."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = LifeSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日生活管理\n\n完整计划'
        }

        result = secretary.run(save_to_file=True)

        assert '今日生活管理' in result
        assert '完整计划' in result

    def test_run_without_saving(self, mock_config_dict):
        """Test run without saving to file."""
        secretary = LifeSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '生活计划'
        }

        result = secretary.run(save_to_file=False)

        assert '生活计划' in result

    def test_run_with_error(self, mock_config_dict):
        """Test run with error handling."""
        secretary = LifeSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.side_effect = Exception("LLM Error")

        result = secretary.run(save_to_file=False)

        assert '❌' in result or 'Failed' in result


class TestLifeSecretaryHealthSummary:
    """Test health summary generation."""

    def test_get_health_summary_no_logs(self, mock_config_dict):
        """Test health summary with no logs."""
        secretary = LifeSecretary(config=mock_config_dict)

        summary = secretary.get_health_summary()

        assert '健康生活周报' in summary
        assert '运动情况' in summary
        assert '睡眠质量' in summary

    @patch('os.path.exists')
    @patch('builtins.open', create=True)
    def test_get_health_summary_with_logs(
        self, mock_open, mock_exists, mock_config_dict
    ):
        """Test health summary with existing logs."""
        mock_exists.return_value = True
        mock_open.return_value.__enter__.return_value.read.return_value = """
# 今日生活管理
运动30分钟
睡眠8小时，质量很好
饮水2000ml
"""

        secretary = LifeSecretary(config=mock_config_dict)
        summary = secretary.get_health_summary()

        assert '健康生活周报' in summary


class TestLifeSecretaryIntegration:
    """Integration tests for LifeSecretary."""

    def test_full_workflow(self, mock_config_dict, tmp_path):
        """Test full workflow with mocked components."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = LifeSecretary(config=mock_config_dict)

        # Mock LLM client
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日生活管理\n\n完整的生活计划'
        }

        result = secretary.run(save_to_file=True)

        assert '今日生活管理' in result
        assert '完整的生活计划' in result

        # Check file was created
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日生活.md"
        assert expected_file.exists()
