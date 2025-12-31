"""
Integration tests for complete workflows.

Tests the morning routine and evening routine workflows to ensure
all secretaries work together correctly.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
import os
import tempfile
from pathlib import Path

from main import LifeAssistant


class TestMorningRoutine:
    """Test morning routine workflow integration."""

    @patch('main.NewsSecretary')
    @patch('main.OutfitSecretary')
    @patch('main.WorkSecretary')
    @patch('main.LifeSecretary')
    @patch('utils.file_manager.FileManager')
    def test_morning_routine_executes_all_phases(
        self,
        mock_fm_class,
        mock_life_class,
        mock_work_class,
        mock_outfit_class,
        mock_news_class,
        tmp_path
    ):
        """Test that morning routine executes all 4 phases in order."""
        # Setup mock file manager
        mock_fm = Mock()
        mock_fm.get_today_dir.return_value = str(tmp_path)
        mock_fm_class.return_value = mock_fm

        # Setup mock secretaries
        mock_news = Mock()
        mock_news.run.return_value = "# News Summary"
        mock_news_class.return_value = mock_news

        mock_outfit = Mock()
        mock_outfit.run.return_value = "# Outfit Recommendation"
        mock_outfit_class.return_value = mock_outfit

        mock_work = Mock()
        mock_work.run.return_value = "# Work Plan"
        mock_work_class.return_value = mock_work

        mock_life = Mock()
        mock_life.run.return_value = "# Life Plan"
        mock_life_class.return_value = mock_life

        # Create config file
        config_path = tmp_path / "config" / "config.ini"
        config_path.parent.mkdir(parents=True, exist_ok=True)
        config_path.write_text("""[llm]
provider = glm
api_key = test_key

[data]
base_dir = {}
""".format(str(tmp_path)))

        # Patch config path
        with patch('main.configparser.ConfigParser.read'):
            # Create assistant and run morning routine
            assistant = LifeAssistant()
            assistant.run_morning_routine()

        # Verify all secretaries were called in order
        mock_news.run.assert_called_once()
        mock_outfit.run.assert_called_once()
        mock_work.run.assert_called_once()
        mock_life.run.assert_called_once()

    @patch('main.NewsSecretary')
    @patch('main.OutfitSecretary')
    @patch('main.WorkSecretary')
    @patch('main.LifeSecretary')
    @patch('utils.file_manager.FileManager')
    def test_morning_routine_continues_on_failure(
        self,
        mock_fm_class,
        mock_life_class,
        mock_work_class,
        mock_outfit_class,
        mock_news_class,
        tmp_path
    ):
        """Test that morning routine continues even if one secretary fails."""
        # Setup mock file manager
        mock_fm = Mock()
        mock_fm.get_today_dir.return_value = str(tmp_path)
        mock_fm_class.return_value = mock_fm

        # Setup mock secretaries - news fails, others succeed
        mock_news = Mock()
        mock_news.run.side_effect = Exception("News API Error")
        mock_news_class.return_value = mock_news

        mock_outfit = Mock()
        mock_outfit.run.return_value = "# Outfit Recommendation"
        mock_outfit_class.return_value = mock_outfit

        mock_work = Mock()
        mock_work.run.return_value = "# Work Plan"
        mock_work_class.return_value = mock_work

        mock_life = Mock()
        mock_life.run.return_value = "# Life Plan"
        mock_life_class.return_value = mock_life

        # Create config
        with patch('main.configparser.ConfigParser.read'):
            # Create assistant and run morning routine
            assistant = LifeAssistant()
            assistant.run_morning_routine()

        # Verify other secretaries still ran despite news failure
        mock_news.run.assert_called_once()
        mock_outfit.run.assert_called_once()
        mock_work.run.assert_called_once()
        mock_life.run.assert_called_once()


class TestEveningRoutine:
    """Test evening routine workflow integration."""

    @patch('main.ReviewSecretary')
    @patch('utils.file_manager.FileManager')
    def test_evening_review_executes(self, mock_fm_class, mock_review_class, tmp_path):
        """Test that evening review executes successfully."""
        # Setup mock file manager
        mock_fm = Mock()
        mock_fm.get_today_dir.return_value = str(tmp_path)
        mock_fm_class.return_value = mock_fm

        # Setup mock secretary
        mock_review = Mock()
        mock_review.run.return_value = "# Daily Review"
        mock_review_class.return_value = mock_review

        # Create config
        with patch('main.configparser.ConfigParser.read'):
            # Create assistant and run review
            assistant = LifeAssistant()
            assistant.run_review_secretary()

        # Verify review was called
        mock_review.run.assert_called_once()


class TestFullDailyRoutine:
    """Test complete daily routine (morning + evening)."""

    @patch('builtins.input', return_value='')  # Auto-continue
    @patch('main.NewsSecretary')
    @patch('main.OutfitSecretary')
    @patch('main.WorkSecretary')
    @patch('main.LifeSecretary')
    @patch('main.ReviewSecretary')
    @patch('utils.file_manager.FileManager')
    def test_full_daily_routine_executes_all_phases(
        self,
        mock_fm_class,
        mock_review_class,
        mock_life_class,
        mock_work_class,
        mock_outfit_class,
        mock_news_class,
        mock_input,
        tmp_path
    ):
        """Test that full daily routine executes morning and evening phases."""
        # Setup mock file manager
        mock_fm = Mock()
        mock_fm.get_today_dir.return_value = str(tmp_path)
        mock_fm_class.return_value = mock_fm

        # Setup all mock secretaries
        mock_news = Mock()
        mock_news.run.return_value = "# News Summary"
        mock_news_class.return_value = mock_news

        mock_outfit = Mock()
        mock_outfit.run.return_value = "# Outfit Recommendation"
        mock_outfit_class.return_value = mock_outfit

        mock_work = Mock()
        mock_work.run.return_value = "# Work Plan"
        mock_work_class.return_value = mock_work

        mock_life = Mock()
        mock_life.run.return_value = "# Life Plan"
        mock_life_class.return_value = mock_life

        mock_review = Mock()
        mock_review.run.return_value = "# Daily Review"
        mock_review_class.return_value = mock_review

        # Create config
        with patch('main.configparser.ConfigParser.read'):
            # Create assistant and run full routine
            assistant = LifeAssistant()
            assistant.run_full_daily_routine()

        # Verify all secretaries were called
        mock_news.run.assert_called_once()
        mock_outfit.run.assert_called_once()
        mock_work.run.assert_called_once()
        mock_life.run.assert_called_once()
        mock_review.run.assert_called_once()

        # Verify input was called (for pause between morning and evening)
        mock_input.assert_called_once()


class TestFileManagement:
    """Test file management integration."""

    @patch('main.NewsSecretary')
    @patch('utils.file_manager.FileManager')
    def test_files_saved_to_correct_directory(self, mock_fm_class, mock_news_class, tmp_path):
        """Test that files are saved to the correct daily directory."""
        # Setup mock file manager
        today = datetime.now().strftime("%Y-%m-%d")
        expected_dir = str(tmp_path / "data" / "daily_logs" / today)
        
        mock_fm = Mock()
        mock_fm.get_today_dir.return_value = expected_dir
        mock_fm_class.return_value = mock_fm

        # Setup mock secretary
        mock_news = Mock()
        mock_news.run.return_value = "# News Summary"
        mock_news_class.return_value = mock_news

        # Create config with tmp_path
        with patch('main.configparser.ConfigParser.read'):
            # Create assistant
            assistant = LifeAssistant()
            
            # Get today's directory
            today_dir = assistant.file_manager.get_today_dir()
            
            # Verify directory structure
            assert today in today_dir

    @patch('utils.file_manager.FileManager')
    def test_list_today_files(self, mock_fm_class, tmp_path):
        """Test listing today's files."""
        # Create some test files
        today = datetime.now().strftime("%Y-%m-%d")
        today_dir = tmp_path / "data" / "daily_logs" / today
        today_dir.mkdir(parents=True, exist_ok=True)
        
        (today_dir / "新闻简报.md").write_text("# News")
        (today_dir / "今日工作.md").write_text("# Work")

        # Setup mock file manager
        mock_fm = Mock()
        mock_fm.get_today_dir.return_value = str(today_dir)
        mock_fm_class.return_value = mock_fm

        # Create config
        with patch('main.configparser.ConfigParser.read'):
            # Create assistant and list files
            assistant = LifeAssistant()
            assistant.list_today_files()

            # Verify files exist
            assert (today_dir / "新闻简报.md").exists()
            assert (today_dir / "今日工作.md").exists()
