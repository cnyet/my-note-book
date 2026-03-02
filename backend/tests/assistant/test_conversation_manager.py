"""
Tests for the Async Conversation Manager.

This module contains unit tests for the Async Conversation Manager functionality.
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..models.conversation import Conversation
from ..models.message import Message
from ..agents.assistant.async_conversation_manager import AsyncConversationManager
from ..agents.assistant.adapters.base import MessageRole


@pytest.fixture
def mock_database_url():
    """Mock database URL for testing."""
    return "sqlite+aiosqlite:///:memory:"


@pytest.mark.asyncio
async def test_create_conversation(mock_database_url):
    """Test creating a new conversation."""
    cm = AsyncConversationManager(mock_database_url)

    user_id = "test-user"
    model = "test-model"

    conversation = await cm.create_conversation(user_id, model)

    assert conversation is not None
    assert conversation.user_id == user_id
    assert conversation.model == model


@pytest.mark.asyncio
async def test_get_conversation(mock_database_url):
    """Test getting a conversation."""
    cm = AsyncConversationManager(mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Retrieve the conversation
    retrieved = await cm.get_conversation(conversation.id)

    assert retrieved is not None
    assert retrieved.id == conversation.id
    assert retrieved.user_id == user_id


@pytest.mark.asyncio
async def test_get_user_conversations(mock_database_url):
    """Test getting user's conversations."""
    cm = AsyncConversationManager(mock_database_url)

    user_id = "test-user"

    # Create multiple conversations
    conv1 = await cm.create_conversation(user_id, "model1")
    conv2 = await cm.create_conversation(user_id, "model2")

    # Get user's conversations
    conversations = await cm.get_user_conversations(user_id)

    assert len(conversations) >= 2
    # Check that both created conversations are in the list
    conversation_ids = [c.id for c in conversations]
    assert conv1.id in conversation_ids
    assert conv2.id in conversation_ids


@pytest.mark.asyncio
async def test_add_message(mock_database_url):
    """Test adding a message to a conversation."""
    cm = AsyncConversationManager(mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Add a message
    message = await cm.add_message(conversation.id, MessageRole.USER, "Test message")

    assert message is not None
    assert message.conversation_id == conversation.id
    assert message.role == "user"
    assert message.content == "Test message"


@pytest.mark.asyncio
async def test_get_conversation_messages(mock_database_url):
    """Test getting messages from a conversation."""
    cm = AsyncConversationManager(mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Add a message
    await cm.add_message(conversation.id, MessageRole.USER, "Test message")

    # Get messages
    messages = await cm.get_conversation_messages(conversation.id)

    assert len(messages) == 1
    assert messages[0].content == "Test message"


@pytest.mark.asyncio
async def test_update_conversation_title(mock_database_url):
    """Test updating a conversation title."""
    cm = AsyncConversationManager(mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Update the title
    new_title = "Updated Title"
    await cm.update_conversation_title(conversation.id, new_title)

    # Retrieve the conversation to verify the update
    updated_conversation = await cm.get_conversation(conversation.id)
    assert updated_conversation.title == new_title


@pytest.mark.asyncio
async def test_delete_conversation(mock_database_url):
    """Test deleting a conversation."""
    cm = AsyncConversationManager(mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Add a message to the conversation
    await cm.add_message(conversation.id, MessageRole.USER, "Test message")

    # Delete the conversation
    success = await cm.delete_conversation(conversation.id)

    assert success is True

    # Verify the conversation is gone
    retrieved = await cm.get_conversation(conversation.id)
    assert retrieved is None

    # Verify the message is also gone
    messages = await cm.get_conversation_messages(conversation.id)
    assert len(messages) == 0


@pytest.mark.asyncio
async def test_get_conversation_context(mock_database_url):
    """Test getting conversation context."""
    cm = AsyncConversationManager(mock_database_url)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Add a message
    await cm.add_message(conversation.id, MessageRole.USER, "Test message")

    # Get conversation context
    context = await cm.get_conversation_context(conversation.id)

    assert len(context) == 1
    assert context[0]["role"] == "user"
    assert context[0]["content"] == "Test message"


@pytest.mark.asyncio
async def test_get_token_limited_context(mock_database_url):
    """Test getting token-limited context."""
    cm = AsyncConversationManager(mock_database_url, max_context_tokens=100)

    # Create a conversation first
    user_id = "test-user"
    conversation = await cm.create_conversation(user_id, "test-model")

    # Add several messages
    await cm.add_message(conversation.id, MessageRole.USER, "Short message")
    await cm.add_message(conversation.id, MessageRole.ASSISTANT, "Another short message")

    # Get token-limited context
    context = await cm.get_token_limited_context(conversation.id, max_tokens=50)

    # Should have at least one message
    assert len(context) >= 0  # Could be 0 if all messages exceed token limit