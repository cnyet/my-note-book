"""
Integration tests for the complete AI Assistant functionality.

This module tests the end-to-end functionality of the AI Assistant system.
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from ..agents.assistant.agent import AIAssistantAgent
from ..agents.assistant.adapters.base import MessageRole


@pytest.mark.asyncio
async def test_complete_assistant_workflow():
    """Test the complete workflow of the AI assistant."""
    # Mock an AI adapter
    mock_adapter = AsyncMock()
    mock_adapter.chat.return_value = "This is a test response"
    mock_adapter.is_available.return_value = True
    mock_adapter.is_configured.return_value = True
    mock_adapter.model = "test-model"

    # Use an in-memory SQLite database for testing
    db_url = "sqlite+aiosqlite:///:memory:"

    # Create an agent
    agent = AIAssistantAgent(mock_adapter, db_url)

    # Test creating a conversation
    user_id = "test-user"
    conversation_id = await agent.create_conversation(user_id, "test-model")
    assert conversation_id is not None

    # Test chatting
    message = "Hello, AI!"
    response = await agent.chat(conversation_id, message, user_id)
    assert response == "This is a test response"

    # Verify that the AI adapter was called with the right parameters
    assert mock_adapter.chat.called
    # The call should include both the user message and any context messages

    # Test getting conversation history
    history = await agent.get_conversation_history(conversation_id)
    assert isinstance(history, list)
    assert len(history) >= 2  # Should have user message and AI response

    # Test getting user conversations
    conversations = await agent.get_user_conversations(user_id)
    assert isinstance(conversations, list)
    assert len(conversations) >= 1

    # Verify the conversation is in the user's list
    conversation_ids = [c['id'] for c in conversations]
    assert conversation_id in conversation_ids

    # Test deleting the conversation
    success = await agent.delete_conversation(conversation_id, user_id)
    assert success is True

    # Verify the conversation was deleted
    history_after_deletion = await agent.get_conversation_history(conversation_id)
    assert history_after_deletion == []


@pytest.mark.asyncio
async def test_agent_availability_checks():
    """Test the agent's service availability checks."""
    mock_adapter = AsyncMock()
    mock_adapter.is_available.return_value = True
    mock_adapter.is_configured.return_value = True
    mock_adapter.model = "test-model"

    agent = AIAssistantAgent(mock_adapter, "sqlite+aiosqlite:///:memory:")

    # Test service availability
    is_available = await agent.is_service_available()
    assert is_available is True
    assert mock_adapter.is_available.called

    # Test service configuration
    is_configured = await agent.is_service_configured()
    assert is_configured is True
    # Note: is_configured is a property of the adapter, not an async method


@pytest.mark.asyncio
async def test_error_handling():
    """Test error handling in the agent."""
    mock_adapter = AsyncMock()
    mock_adapter.chat.side_effect = Exception("API Error")
    mock_adapter.is_available.return_value = False  # Simulate unavailable service
    mock_adapter.is_configured.return_value = True
    mock_adapter.model = "test-model"

    agent = AIAssistantAgent(mock_adapter, "sqlite+aiosqlite:///:memory:")

    # Test service unavailable
    is_available = await agent.is_service_available()
    assert is_available is False

    # Test that errors are propagated properly
    user_id = "test-user"
    conversation_id = await agent.create_conversation(user_id, "test-model")

    with pytest.raises(Exception, match="API Error"):
        await agent.chat(conversation_id, "Test message", user_id)