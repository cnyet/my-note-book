"""
Tests for the AI Adapters.

This module contains unit tests for the AI Adapter implementations.
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from ..agents.assistant.adapters.base import AIAdapter, MessageRole
from ..agents.assistant.adapters.ollama import OllamaAdapter
from ..agents.assistant.adapters.anthropic import AnthropicAdapter
from ..agents.assistant.adapters.openai import OpenAIAdapter


class MockAdapter(AIAdapter):
    """Mock adapter for testing the protocol."""

    async def chat(self, messages, **kwargs):
        return "Mock response"

    async def stream(self, messages, **kwargs):
        yield "Mock stream response"

    async def is_available(self):
        return True

    def is_configured(self):
        return True


def test_ai_adapter_protocol():
    """Test that the AIAdapter protocol is properly defined."""
    adapter = MockAdapter()

    # Should be able to call the methods without error
    assert hasattr(adapter, 'chat')
    assert hasattr(adapter, 'stream')
    assert hasattr(adapter, 'is_available')
    assert hasattr(adapter, 'is_configured')


@pytest.mark.asyncio
async def test_ollama_adapter_initialization():
    """Test Ollama adapter initialization."""
    adapter = OllamaAdapter(base_url="http://localhost:11434", model="test-model")

    assert adapter.base_url == "http://localhost:11434"
    assert adapter.model == "test-model"


@pytest.mark.asyncio
async def test_anthropic_adapter_initialization():
    """Test Anthropic adapter initialization."""
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
        adapter = AnthropicAdapter(model="test-model")

        assert adapter.model == "test-model"
        assert adapter.api_key == "test-key"


@pytest.mark.asyncio
async def test_openai_adapter_initialization():
    """Test OpenAI adapter initialization."""
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'test-key'}):
        adapter = OpenAIAdapter(model="test-model")

        assert adapter.model == "test-model"
        assert adapter.api_key == "test-key"


@pytest.mark.asyncio
async def test_ollama_adapter_configured_check():
    """Test Ollama adapter configuration check."""
    adapter = OllamaAdapter(base_url="http://localhost:11434", model="test-model")

    # Ollama doesn't require API key, so it should always be configured if URL and model are set
    assert adapter.is_configured() is True


@pytest.mark.asyncio
async def test_anthropic_adapter_configured_check():
    """Test Anthropic adapter configuration check."""
    # Test with valid API key
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'sk-ant-test-key'}):
        adapter = AnthropicAdapter(model="test-model")
        assert adapter.is_configured() is True

    # Test with invalid API key format
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'invalid-key'}):
        adapter = AnthropicAdapter(model="test-model")
        assert adapter.is_configured() is False


@pytest.mark.asyncio
async def test_openai_adapter_configured_check():
    """Test OpenAI adapter configuration check."""
    # Test with valid API key
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'sk-test-key'}):
        adapter = OpenAIAdapter(model="test-model")
        assert adapter.is_configured() is True

    # Test with invalid API key format
    with patch.dict('os.environ', {'OPENAI_API_KEY': 'invalid-key'}):
        adapter = OpenAIAdapter(model="test-model")
        assert adapter.is_configured() is False