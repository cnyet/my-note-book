"""
Tests for the AI Assistant Agent.

This module contains unit and integration tests for the AI Assistant functionality.
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..models.conversation import Conversation
from ..models.message import Message
from ..agents.assistant.agent import AIAssistantAgent
from ..agents.assistant.adapters.base import MessageRole
from ..agents.assistant.async_conversation_manager import AsyncConversationManager


@pytest.fixture
def mock_ai_adapter():
    """Mock AI adapter for testing."""
    adapter = AsyncMock()
    adapter.chat.return_value = "Test response"
    adapter.is_available.return_value = True
    adapter.is_configured.return_value = True
    adapter.model = "test-model"
    return adapter


@pytest.fixture
def mock_database_url():
    """Mock database URL for testing."""
    return "sqlite+aiosqlite:///:memory:"


@pytest.mark.asyncio
async def test_create_conversation(mock_ai_adapter, mock_database_url):
    """Test creating a new conversation."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    user_id = "test-user"
    model = "test-model"

    conversation_id = await agent.create_conversation(user_id, model)

    assert conversation_id is not None
    assert isinstance(conversation_id, str)


@pytest.mark.asyncio
async def test_chat_functionality(mock_ai_adapter, mock_database_url):
    """Test the chat functionality."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation_id = await agent.create_conversation(user_id, "test-model")

    # Test sending a message
    message = "Hello, AI!"
    response = await agent.chat(conversation_id, message, user_id)

    # Verify the response
    assert response == "Test response"

    # Verify the adapter's chat method was called
    assert mock_ai_adapter.chat.called


@pytest.mark.asyncio
async def test_get_conversation_history(mock_ai_adapter, mock_database_url):
    """Test getting conversation history."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    # Create a conversation and add a message
    user_id = "test-user"
    conversation_id = await agent.create_conversation(user_id, "test-model")
    await agent.chat(conversation_id, "Hello", user_id)

    # Get the conversation history
    history = await agent.get_conversation_history(conversation_id)

    # Verify history contains messages
    assert isinstance(history, list)
    assert len(history) >= 2  # At least user message and AI response


@pytest.mark.asyncio
async def test_get_user_conversations(mock_ai_adapter, mock_database_url):
    """Test getting user's conversations."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    user_id = "test-user"

    # Create multiple conversations
    await agent.create_conversation(user_id, "test-model")
    await agent.create_conversation(user_id, "test-model")

    # Get user's conversations
    conversations = await agent.get_user_conversations(user_id)

    # Verify conversations are returned
    assert isinstance(conversations, list)
    assert len(conversations) >= 2


@pytest.mark.asyncio
async def test_delete_conversation(mock_ai_adapter, mock_database_url):
    """Test deleting a conversation."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    user_id = "test-user"
    conversation_id = await agent.create_conversation(user_id, "test-model")

    # Verify conversation exists
    history = await agent.get_conversation_history(conversation_id)
    assert history is not None

    # Delete the conversation
    success = await agent.delete_conversation(conversation_id, user_id)

    assert success is True

    # Verify conversation no longer exists
    history = await agent.get_conversation_history(conversation_id)
    assert history == []


@pytest.mark.asyncio
async def test_delete_conversation_unauthorized(mock_ai_adapter, mock_database_url):
    """Test that a user cannot delete another user's conversation."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    user1_id = "test-user-1"
    user2_id = "test-user-2"
    conversation_id = await agent.create_conversation(user1_id, "test-model")

    # User2 should not be able to delete user1's conversation
    success = await agent.delete_conversation(conversation_id, user2_id)

    assert success is False


@pytest.mark.asyncio
async def test_is_service_available(mock_ai_adapter, mock_database_url):
    """Test checking if the service is available."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    available = await agent.is_service_available()

    assert available is True
    assert mock_ai_adapter.is_available.called


@pytest.mark.asyncio
async def test_is_service_configured(mock_ai_adapter, mock_database_url):
    """Test checking if the service is configured."""
    agent = AIAssistantAgent(mock_ai_adapter, mock_database_url)

    configured = await agent.is_service_configured()

    assert configured is True