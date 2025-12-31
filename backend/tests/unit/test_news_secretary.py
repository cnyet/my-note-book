"""
Unit tests for NewsSecretary agent.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from agents.news_secretary import NewsSecretary


class TestNewsSecretaryInit:
    """Test NewsSecretary initialization."""

    def test_init_with_config_dict(self, mock_config_dict):
        """Test initialization with config dictionary."""
        secretary = NewsSecretary(config_dict=mock_config_dict)

        assert secretary.config_dict == mock_config_dict
        assert secretary.config is None
        assert secretary.llm is not None
        assert secretary.file_manager is not None

    def test_init_with_config_path(self, tmp_path, sample_config_file):
        """Test initialization with config file path."""
        config_path = tmp_path / "config.ini"
        config_path.write_text(sample_config_file)

        secretary = NewsSecretary(config_path=str(config_path))

        assert secretary.config is not None
        assert secretary.llm is not None
        assert secretary.file_manager is not None

    def test_sources_from_config(self, mock_config_dict):
        """Test news sources loaded from config."""
        mock_config_dict['news'] = {
            'sources': 'https://example.com/ai\nhttps://example.com/tech',
            'articles_per_summary': '5'
        }

        secretary = NewsSecretary(config_dict=mock_config_dict)

        assert len(secretary.sources) == 2
        assert 'https://example.com/ai' in secretary.sources

    def test_default_sources(self, mock_config_dict):
        """Test default sources when not in config."""
        # Remove news config to trigger defaults
        config_without_news = mock_config_dict.copy()
        if 'news' in config_without_news:
            del config_without_news['news']
        
        secretary = NewsSecretary(config_dict=config_without_news)

        assert len(secretary.sources) > 0
        assert any('techcrunch' in s.lower() for s in secretary.sources)

    def test_articles_per_summary_config(self, mock_config_dict):
        """Test articles_per_summary from config."""
        mock_config_dict['news'] = {'articles_per_summary': '10'}

        secretary = NewsSecretary(config_dict=mock_config_dict)

        assert secretary.articles_per_summary == 10


class TestNewsSecretaryFetching:
    """Test news fetching methods."""

    @patch('agents.news_secretary.requests.get')
    @patch('agents.news_secretary.BeautifulSoup')
    def test_fetch_techcrunch_success(
        self, mock_bs, mock_get, mock_config_dict
    ):
        """Test successful TechCrunch news fetching."""
        # Mock response
        mock_response = Mock()
        mock_response.content = b'<html></html>'
        mock_get.return_value = mock_response

        # Mock BeautifulSoup
        mock_article = Mock()
        mock_title = Mock()
        mock_title.text.strip.return_value = "AI Breakthrough"
        mock_link = Mock()
        mock_link.get.return_value = "https://example.com/article"
        mock_content = Mock()
        mock_content.text.strip.return_value = "Article content"

        mock_article.find.side_effect = [
            mock_title, mock_content
        ]
        mock_article.find.return_value = mock_link

        mock_soup = Mock()
        mock_soup.find_all.return_value = [mock_article]
        mock_bs.return_value = mock_soup

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.fetch_techcrunch_ai()

        assert isinstance(result, str)
        mock_get.assert_called_once()

    @patch('agents.news_secretary.requests.get')
    def test_fetch_techcrunch_error(self, mock_get, mock_config_dict):
        """Test TechCrunch fetching with error."""
        mock_get.side_effect = Exception("Network error")

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.fetch_techcrunch_ai()

        assert result == ""

    @patch('agents.news_secretary.requests.get')
    def test_fetch_the_verge_success(self, mock_get, mock_config_dict):
        """Test successful The Verge news fetching."""
        mock_response = Mock()
        mock_response.content = b'<html></html>'
        mock_get.return_value = mock_response

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.fetch_the_verge_ai()

        assert isinstance(result, str)

    @patch('agents.news_secretary.requests.get')
    def test_fetch_mit_news_success(self, mock_get, mock_config_dict):
        """Test successful MIT Tech Review fetching."""
        mock_response = Mock()
        mock_response.content = b'<html></html>'
        mock_get.return_value = mock_response

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.fetch_mit_news()

        assert isinstance(result, str)


class TestNewsSecretaryCollect:
    """Test news collection."""

    @patch.object(NewsSecretary, 'fetch_techcrunch_ai')
    @patch.object(NewsSecretary, 'fetch_the_verge_ai')
    @patch.object(NewsSecretary, 'fetch_mit_news')
    def test_collect_news_all_sources(
        self, mock_mit, mock_verge, mock_tc, mock_config_dict
    ):
        """Test collecting news from all sources."""
        mock_tc.return_value = "TechCrunch news"
        mock_verge.return_value = "Verge news"
        mock_mit.return_value = "MIT news"

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.collect_news()

        assert "TechCrunch" in result
        assert "Verge" in result
        assert "MIT" in result
        mock_tc.assert_called_once()
        mock_verge.assert_called_once()
        mock_mit.assert_called_once()

    @patch.object(NewsSecretary, 'fetch_techcrunch_ai')
    @patch.object(NewsSecretary, 'fetch_the_verge_ai')
    @patch.object(NewsSecretary, 'fetch_mit_news')
    def test_collect_news_partial_failure(
        self, mock_mit, mock_verge, mock_tc, mock_config_dict
    ):
        """Test collecting news with some sources failing."""
        mock_tc.return_value = "TechCrunch news"
        mock_verge.return_value = ""  # Failed
        mock_mit.return_value = "MIT news"

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.collect_news()

        assert "TechCrunch" in result
        assert "MIT" in result
        assert result != ""


class TestNewsSecretarySummary:
    """Test news summary generation."""

    def test_generate_news_summary(self, mock_config_dict, mock_llm_response):
        """Test generating news summary with LLM."""
        secretary = NewsSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "AI News Summary"

        raw_news = "**Article 1**\nContent 1\n**Article 2**\nContent 2"
        result = secretary.generate_news_summary(raw_news)

        assert result == "AI News Summary"
        secretary.llm.simple_chat.assert_called_once()
        call_args = secretary.llm.simple_chat.call_args
        assert call_args[1]['user_message'] == raw_news
        assert call_args[1]['max_tokens'] == 4000
        assert call_args[1]['temperature'] == 0.3

    def test_generate_news_summary_with_system_prompt(
        self, mock_config_dict
    ):
        """Test summary generation includes proper system prompt."""
        secretary = NewsSecretary(config_dict=mock_config_dict)
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "Summary"

        secretary.generate_news_summary("Raw news")

        call_args = secretary.llm.simple_chat.call_args
        system_prompt = call_args[1]['system_prompt']
        assert '大洪' in system_prompt
        assert 'AI' in system_prompt or 'ai' in system_prompt.lower()


class TestNewsSecretaryExecute:
    """Test news secretary execution."""

    @patch.object(NewsSecretary, 'collect_news')
    @patch.object(NewsSecretary, 'generate_news_summary')
    def test_execute_success(
        self, mock_summary, mock_collect, mock_config_dict, tmp_path
    ):
        """Test successful execution."""
        mock_collect.return_value = "Raw news"
        mock_summary.return_value = "News summary"

        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.execute(save_to_file=True)

        assert "新闻简报" in result
        assert "News summary" in result
        mock_collect.assert_called_once()
        mock_summary.assert_called_once_with("Raw news")

    @patch.object(NewsSecretary, 'collect_news')
    def test_execute_no_news_collected(
        self, mock_collect, mock_config_dict
    ):
        """Test execution when no news is collected."""
        mock_collect.return_value = ""

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.execute(save_to_file=False)

        assert result == ""

    @patch.object(NewsSecretary, 'collect_news')
    @patch.object(NewsSecretary, 'generate_news_summary')
    def test_execute_summary_generation_fails(
        self, mock_summary, mock_collect, mock_config_dict
    ):
        """Test execution when summary generation fails."""
        mock_collect.return_value = "Raw news"
        mock_summary.return_value = ""

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.execute(save_to_file=False)

        assert result == ""

    @patch.object(NewsSecretary, 'collect_news')
    @patch.object(NewsSecretary, 'generate_news_summary')
    def test_execute_without_saving(
        self, mock_summary, mock_collect, mock_config_dict
    ):
        """Test execution without saving to file."""
        mock_collect.return_value = "Raw news"
        mock_summary.return_value = "Summary"

        secretary = NewsSecretary(config_dict=mock_config_dict)
        result = secretary.execute(save_to_file=False)

        assert "Summary" in result
        assert "新闻简报" in result

    def test_run_alias(self, mock_config_dict):
        """Test that run() is an alias for execute()."""
        secretary = NewsSecretary(config_dict=mock_config_dict)
        secretary.execute = Mock(return_value="Result")

        result = secretary.run(save_to_file=False)

        assert result == "Result"
        secretary.execute.assert_called_once_with(save_to_file=False)


class TestNewsSecretaryIntegration:
    """Integration tests for NewsSecretary."""

    def test_full_workflow_mock(self, mock_config_dict, tmp_path):
        """Test full workflow with mocked components."""
        mock_config_dict['data']['base_dir'] = str(tmp_path)

        secretary = NewsSecretary(config_dict=mock_config_dict)

        # Mock all external dependencies
        secretary.fetch_techcrunch_ai = Mock(return_value="TC news")
        secretary.fetch_the_verge_ai = Mock(return_value="Verge news")
        secretary.fetch_mit_news = Mock(return_value="MIT news")
        secretary.llm = Mock()
        secretary.llm.simple_chat.return_value = "Generated summary"

        result = secretary.execute(save_to_file=True)

        assert "Generated summary" in result
        assert "新闻简报" in result

        # Check file was created (FileManager creates in data/daily_logs)
        today = datetime.now().strftime("%Y-%m-%d")
        expected_file = tmp_path / "data" / "daily_logs" / today / "新闻简报.md"
        assert expected_file.exists()
