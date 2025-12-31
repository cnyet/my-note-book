"""
Unit tests for Pydantic models
Tests validation, type checking, and error handling
"""

import pytest
from pydantic import ValidationError
from utils.models.config import (
    LLMConfig, DataConfig, WeatherConfig, UserConfig, AppConfig
)
from utils.models.secretary import (
    TaskSummary, NewsArticle, OutfitSuggestion, 
    HealthData, ReviewData, DailyData
)
from utils.models.api_response import (
    LLMResponse, WeatherResponse, NewsAPIResponse, 
    APIError, HealthAPIResponse
)


class TestLLMConfig:
    """Tests for LLMConfig model"""

    def test_valid_config(self):
        """测试有效配置"""
        config = LLMConfig(
            provider="glm",
            api_key="test-api-key-123",
            model="glm-4"
        )
        assert config.provider == "glm"
        assert config.api_key == "test-api-key-123"
        assert config.model == "glm-4"

    def test_invalid_provider(self):
        """测试无效provider"""
        with pytest.raises(ValidationError) as exc_info:
            LLMConfig(
                provider="invalid",
                api_key="test-key",
                model="test"
            )
        assert "Invalid provider" in str(exc_info.value)

    def test_short_api_key(self):
        """测试过短的API key"""
        with pytest.raises(ValidationError):
            LLMConfig(
                provider="glm",
                api_key="short",
                model="test"
            )

    def test_empty_api_key(self):
        """测试空API key"""
        with pytest.raises(ValidationError):
            LLMConfig(
                provider="glm",
                api_key="",
                model="test"
            )

    def test_whitespace_api_key(self):
        """测试纯空格API key"""
        with pytest.raises(ValidationError):
            LLMConfig(
                provider="glm",
                api_key="          ",
                model="test"
            )

    def test_provider_case_insensitive(self):
        """测试provider大小写不敏感"""
        config = LLMConfig(
            provider="GLM",
            api_key="test-api-key-123",
            model="glm-4"
        )
        assert config.provider == "glm"


class TestDataConfig:
    """Tests for DataConfig model"""

    def test_default_values(self):
        """测试默认值"""
        config = DataConfig()
        assert config.base_dir == "."
        assert config.logs_dir == "data/daily_logs"
        assert config.vector_db_dir == "data/vector_db"

    def test_custom_values(self):
        """测试自定义值"""
        config = DataConfig(
            base_dir="/custom/path",
            logs_dir="/custom/logs"
        )
        assert config.base_dir == "/custom/path"
        assert config.logs_dir == "/custom/logs"

    def test_empty_path(self):
        """测试空路径"""
        with pytest.raises(ValidationError):
            DataConfig(base_dir="")

    def test_whitespace_path(self):
        """测试纯空格路径"""
        with pytest.raises(ValidationError):
            DataConfig(logs_dir="   ")


class TestAppConfig:
    """Tests for AppConfig model"""

    def test_valid_app_config(self):
        """测试有效应用配置"""
        config = AppConfig(
            llm=LLMConfig(
                provider="glm",
                api_key="test-key-12345",
                model="glm-4"
            ),
            data=DataConfig()
        )
        assert config.llm.provider == "glm"
        assert config.data.base_dir == "."

    def test_missing_llm_config(self):
        """测试缺少LLM配置"""
        with pytest.raises(ValidationError):
            AppConfig(data=DataConfig())


class TestTaskSummary:
    """Tests for TaskSummary model"""

    def test_empty_task_summary(self):
        """测试空任务摘要"""
        summary = TaskSummary()
        assert summary.tasks_completed == []
        assert summary.tasks_pending == []
        assert summary.highlights == []

    def test_task_summary_with_data(self):
        """测试带数据的任务摘要"""
        summary = TaskSummary(
            tasks_completed=["Task 1", "Task 2"],
            tasks_pending=["Task 3"],
            highlights=["Achievement 1"]
        )
        assert len(summary.tasks_completed) == 2
        assert len(summary.tasks_pending) == 1

    def test_filters_empty_strings(self):
        """测试过滤空字符串"""
        summary = TaskSummary(
            tasks_completed=["Task 1", "", "  ", "Task 2"],
            highlights=["", "Achievement"]
        )
        assert len(summary.tasks_completed) == 2
        assert len(summary.highlights) == 1


class TestNewsArticle:
    """Tests for NewsArticle model"""

    def test_valid_article(self):
        """测试有效文章"""
        article = NewsArticle(
            title="Test Article",
            summary="Test summary",
            importance=4
        )
        assert article.title == "Test Article"
        assert article.importance == 4

    def test_empty_title(self):
        """测试空标题"""
        with pytest.raises(ValidationError):
            NewsArticle(title="")

    def test_whitespace_title(self):
        """测试纯空格标题"""
        with pytest.raises(ValidationError):
            NewsArticle(title="   ")

    def test_importance_range(self):
        """测试重要性范围"""
        with pytest.raises(ValidationError):
            NewsArticle(title="Test", importance=6)
        
        with pytest.raises(ValidationError):
            NewsArticle(title="Test", importance=0)


class TestHealthData:
    """Tests for HealthData model"""

    def test_valid_health_data(self):
        """测试有效健康数据"""
        data = HealthData(
            water_intake=2000,
            exercise_minutes=30,
            sleep_hours=8.0
        )
        assert data.water_intake == 2000
        assert data.exercise_minutes == 30
        assert data.sleep_hours == 8.0

    def test_negative_values(self):
        """测试负值"""
        with pytest.raises(ValidationError):
            HealthData(water_intake=-100)
        
        with pytest.raises(ValidationError):
            HealthData(exercise_minutes=-30)

    def test_sleep_hours_range(self):
        """测试睡眠时长范围"""
        with pytest.raises(ValidationError):
            HealthData(sleep_hours=25)
        
        with pytest.raises(ValidationError):
            HealthData(sleep_hours=-1)


class TestReviewData:
    """Tests for ReviewData model"""

    def test_valid_review(self):
        """测试有效复盘数据"""
        review = ReviewData(
            date="2024-12-30",
            achievements=["Achievement 1"],
            challenges=["Challenge 1"]
        )
        assert review.date == "2024-12-30"
        assert len(review.achievements) == 1

    def test_invalid_date_format(self):
        """测试无效日期格式"""
        with pytest.raises(ValidationError) as exc_info:
            ReviewData(date="30-12-2024")
        assert "Invalid date format" in str(exc_info.value)
        
        with pytest.raises(ValidationError):
            ReviewData(date="2024/12/30")


class TestDailyData:
    """Tests for DailyData model"""

    def test_valid_daily_data(self):
        """测试有效每日数据"""
        data = DailyData(
            date="2024-12-30",
            work_summary=TaskSummary(
                tasks_completed=["Task 1"]
            )
        )
        assert data.date == "2024-12-30"
        assert data.work_summary.tasks_completed == ["Task 1"]

    def test_invalid_date(self):
        """测试无效日期"""
        with pytest.raises(ValidationError):
            DailyData(date="invalid-date")


class TestLLMResponse:
    """Tests for LLMResponse model"""

    def test_valid_response(self):
        """测试有效响应"""
        response = LLMResponse(
            content="Test response",
            tokens_used=100,
            model="glm-4"
        )
        assert response.content == "Test response"
        assert response.tokens_used == 100

    def test_empty_content(self):
        """测试空内容"""
        with pytest.raises(ValidationError):
            LLMResponse(
                content="",
                tokens_used=0,
                model="test"
            )

    def test_negative_tokens(self):
        """测试负token数"""
        with pytest.raises(ValidationError):
            LLMResponse(
                content="Test",
                tokens_used=-10,
                model="test"
            )


class TestWeatherResponse:
    """Tests for WeatherResponse model"""

    def test_valid_weather(self):
        """测试有效天气数据"""
        weather = WeatherResponse(
            temperature=20.5,
            condition="晴天",
            humidity=60
        )
        assert weather.temperature == 20.5
        assert weather.condition == "晴天"
        assert weather.humidity == 60

    def test_humidity_range(self):
        """测试湿度范围"""
        with pytest.raises(ValidationError):
            WeatherResponse(
                temperature=20,
                condition="晴",
                humidity=101
            )
        
        with pytest.raises(ValidationError):
            WeatherResponse(
                temperature=20,
                condition="晴",
                humidity=-1
            )

    def test_empty_condition(self):
        """测试空天气状况"""
        with pytest.raises(ValidationError):
            WeatherResponse(
                temperature=20,
                condition="",
                humidity=60
            )


class TestAPIError:
    """Tests for APIError model"""

    def test_valid_error(self):
        """测试有效错误"""
        error = APIError(
            error_code="AUTH_FAILED",
            error_message="Authentication failed",
            status_code=401
        )
        assert error.error_code == "AUTH_FAILED"
        assert error.status_code == 401

    def test_invalid_status_code(self):
        """测试无效状态码"""
        with pytest.raises(ValidationError):
            APIError(
                error_code="ERROR",
                error_message="Error",
                status_code=200  # 应该是4xx或5xx
            )

    def test_empty_error_message(self):
        """测试空错误消息"""
        with pytest.raises(ValidationError):
            APIError(
                error_code="ERROR",
                error_message="",
                status_code=500
            )
