"""
Unit tests for OutfitSecretary agent.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from agents.outfit_secretary import OutfitSecretary


class TestOutfitSecretaryInit:
    """Test OutfitSecretary initialization."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_init_with_config(self, mock_weather_client_class, mock_config_dict):
        """Test initialization with config dictionary."""
        secretary = OutfitSecretary(config=mock_config_dict)

        assert secretary.config == mock_config_dict
        assert secretary.llm_client is not None
        assert secretary.file_manager is not None
        assert secretary.weather_client is not None

    @patch('agents.outfit_secretary.WeatherClient')
    def test_user_preferences_initialized(self, mock_weather_client_class, mock_config_dict):
        """Test user preferences are initialized."""
        secretary = OutfitSecretary(config=mock_config_dict)

        assert 'style' in secretary.user_preferences
        assert 'preferred_colors' in secretary.user_preferences
        assert secretary.user_preferences['style'] == 'business_casual'


class TestOutfitSecretaryWeather:
    """Test weather data retrieval."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_get_weather_data_success(self, mock_weather_client_class, mock_config_dict):
        """Test successful weather data retrieval."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.return_value = {
            'success': True,
            'current': {
                'temp': 22,
                'condition': 'Sunny',
                'humidity': 60,
                'wind_speed': 5
            },
            'forecast': [
                {
                    'temp_max': 25,
                    'temp_min': 18,
                    'condition': 'Sunny'
                }
            ]
        }

        weather_data = secretary._get_weather_data()

        assert weather_data is not None
        assert weather_data['temperature'] == 22
        assert weather_data['condition'] == 'Sunny'
        assert 'forecast_today' in weather_data

    @patch('agents.outfit_secretary.WeatherClient')
    def test_get_weather_data_failure_fallback(self, mock_weather_client_class, mock_config_dict):
        """Test fallback when weather API fails."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.return_value = {
            'success': False
        }

        weather_data = secretary._get_weather_data()

        assert weather_data is not None
        assert weather_data['temperature'] == 22  # Default
        assert weather_data['condition'] == 'Partly Cloudy'  # Default

    @patch('agents.outfit_secretary.WeatherClient')
    def test_get_weather_data_no_forecast(self, mock_weather_client_class, mock_config_dict):
        """Test weather data without forecast."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.return_value = {
            'success': True,
            'current': {
                'temp': 20,
                'condition': 'Cloudy',
                'humidity': 70,
                'wind_speed': 10
            },
            'forecast': []
        }

        weather_data = secretary._get_weather_data()

        assert weather_data is not None
        assert weather_data['temperature'] == 20


class TestOutfitSecretaryRecommendation:
    """Test outfit recommendation generation."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_generate_outfit_recommendation(self, mock_weather_client_class, mock_config_dict):
        """Test generating outfit recommendation with LLM."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日穿搭建议\n\n商务休闲装'
        }

        weather_data = {
            'temperature': 22,
            'condition': 'Sunny',
            'humidity': 60,
            'wind_speed': 5
        }

        result = secretary._generate_outfit_recommendation(weather_data)

        assert '今日穿搭建议' in result
        secretary.llm_client.send_message.assert_called_once()

    @patch('agents.outfit_secretary.WeatherClient')
    def test_generate_outfit_recommendation_llm_failure(
        self, mock_weather_client_class, mock_config_dict
    ):
        """Test fallback when LLM fails."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = None

        weather_data = {'temperature': 22, 'condition': 'Sunny'}
        result = secretary._generate_outfit_recommendation(weather_data)

        assert '今日穿搭建议' in result
        assert '商务休闲' in result

    @patch('agents.outfit_secretary.WeatherClient')
    def test_prepare_llm_context(self, mock_weather_client_class, mock_config_dict):
        """Test LLM context preparation."""
        secretary = OutfitSecretary(config=mock_config_dict)

        weather_data = {
            'temperature': 22,
            'condition': 'Sunny',
            'humidity': 60,
            'wind_speed': 5,
            'forecast_today': {
                'max_temp': 25,
                'min_temp': 18,
                'condition': 'Sunny'
            }
        }

        context = secretary._prepare_llm_context(weather_data)

        assert '大洪' in context
        assert '22' in context
        assert 'Sunny' in context
        assert '商务休闲' in context


class TestOutfitSecretaryBasicRecommendation:
    """Test basic recommendation generation."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_generate_basic_recommendation(self, mock_weather_client_class, mock_config_dict):
        """Test generating basic recommendation without LLM."""
        secretary = OutfitSecretary(config=mock_config_dict)

        weather_data = {
            'temperature': 22,
            'condition': 'Sunny'
        }

        result = secretary._generate_basic_recommendation(weather_data)

        assert '今日穿搭建议' in result
        assert '22' in result
        assert 'Sunny' in result
        assert '上装' in result
        assert '下装' in result
        assert '鞋履' in result


class TestOutfitSecretarySave:
    """Test saving recommendations."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_save_recommendation(self, mock_weather_client_class, mock_config_dict, tmp_path):
        """Test saving recommendation to file."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = OutfitSecretary(config=mock_config_dict)
        recommendation = "# 今日穿搭\n\n测试内容"

        secretary._save_recommendation(recommendation)

        # Check file was created
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日穿搭.md"
        assert expected_file.exists()


class TestOutfitSecretaryRun:
    """Test outfit secretary execution."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_run_success(self, mock_weather_client_class, mock_config_dict, tmp_path):
        """Test successful run."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.return_value = {
            'success': True,
            'current': {'temp': 22, 'condition': 'Sunny', 'humidity': 60, 'wind_speed': 5},
            'forecast': []
        }
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日穿搭建议\n\n商务休闲装'
        }

        result = secretary.run(save_to_file=True)

        assert '今日穿搭建议' in result
        assert '商务休闲装' in result

    @patch('agents.outfit_secretary.WeatherClient')
    def test_run_without_saving(self, mock_weather_client_class, mock_config_dict):
        """Test run without saving to file."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.return_value = {
            'success': True,
            'current': {'temp': 22, 'condition': 'Sunny', 'humidity': 60, 'wind_speed': 5},
            'forecast': []
        }
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '穿搭建议'
        }

        result = secretary.run(save_to_file=False)

        assert '穿搭建议' in result

    @patch('agents.outfit_secretary.WeatherClient')
    def test_run_with_error(self, mock_weather_client_class, mock_config_dict):
        """Test run with error handling."""
        secretary = OutfitSecretary(config=mock_config_dict)
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.side_effect = Exception("API Error")

        result = secretary.run(save_to_file=False)

        assert '❌' in result or 'Failed' in result


class TestOutfitSecretaryStyleGuide:
    """Test style guide generation."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_get_style_guide(self, mock_weather_client_class, mock_config_dict):
        """Test getting style guide."""
        secretary = OutfitSecretary(config=mock_config_dict)

        guide = secretary.get_style_guide()

        assert '穿搭指南' in guide
        assert '商务休闲' in guide
        assert '色彩搭配' in guide
        assert '必备单品' in guide


class TestOutfitSecretaryIntegration:
    """Integration tests for OutfitSecretary."""

    @patch('agents.outfit_secretary.WeatherClient')
    def test_full_workflow(self, mock_weather_client_class, mock_config_dict, tmp_path):
        """Test full workflow with mocked components."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = OutfitSecretary(config=mock_config_dict)

        # Mock weather client
        secretary.weather_client = Mock()
        secretary.weather_client.get_weather.return_value = {
            'success': True,
            'current': {
                'temp': 22,
                'condition': 'Sunny',
                'humidity': 60,
                'wind_speed': 5
            },
            'forecast': [
                {
                    'temp_max': 25,
                    'temp_min': 18,
                    'condition': 'Sunny'
                }
            ]
        }

        # Mock LLM client
        secretary.llm_client = Mock()
        secretary.llm_client.send_message.return_value = {
            'content': '# 今日穿搭建议\n\n完整的穿搭方案'
        }

        result = secretary.run(save_to_file=True)

        assert '今日穿搭建议' in result
        assert '完整的穿搭方案' in result

        # Check file was created
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "今日穿搭.md"
        assert expected_file.exists()
