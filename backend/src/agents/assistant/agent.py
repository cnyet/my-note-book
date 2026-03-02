"""
AI Assistant Agent.

This module implements the main AI Assistant agent that handles conversation
management and AI model interaction.
"""
from typing import Dict, Any, Optional
from .adapters.base import AIAdapter, MessageRole
from .async_conversation_manager import AsyncConversationManager


class AIAssistantAgent:
    """
    Main AI Assistant Agent that orchestrates conversation management and AI interactions.
    """

    def __init__(self, ai_adapter: AIAdapter, database_url: str):
        """
        Initialize the AI Assistant Agent.

        Args:
            ai_adapter: The AI adapter to use for model interactions
            database_url: URL for the database connection
        """
        self.ai_adapter = ai_adapter
        self.conversation_manager = AsyncConversationManager(database_url)

    async def chat(self, conversation_id: str, message: str, user_id: str = None) -> str:
        """
        Process a chat message in a conversation.

        Args:
            conversation_id: The ID of the conversation
            message: The message content from the user
            user_id: Optional user ID for authorization checks

        Returns:
            The AI's response to the message
        """
        # First, verify the conversation exists (and potentially verify user access)
        conversation = await self.conversation_manager.get_conversation(conversation_id)
        if not conversation:
            # If conversation doesn't exist, create a new one
            # This assumes we have model info, but in practice, we might want to pass this as well
            # For now, we'll use the model from the adapter
            conversation = await self.conversation_manager.create_conversation(
                user_id=user_id or "anonymous",
                model=getattr(self.ai_adapter, 'model', 'unknown')
            )
            conversation_id = conversation.id

        # Add user message to conversation
        await self.conversation_manager.add_message(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=message
        )

        # Get conversation context with token limit
        context = await self.conversation_manager.get_token_limited_context(conversation_id)

        # Get response from AI
        response = await self.ai_adapter.chat(context)

        # Add AI response to conversation
        await self.conversation_manager.add_message(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=response
        )

        return response

    async def create_conversation(self, user_id: str, model: str = None, initial_title: str = None) -> str:
        """
        Create a new conversation.

        Args:
            user_id: The ID of the user creating the conversation
            model: The AI model to use for this conversation
            initial_title: Optional initial title for the conversation

        Returns:
            The ID of the created conversation
        """
        # Use the adapter's model if none is provided
        if not model:
            model = getattr(self.ai_adapter, 'model', 'unknown')

        conversation = await self.conversation_manager.create_conversation(
            user_id=user_id,
            model=model,
            initial_title=initial_title
        )
        return conversation.id

    async def get_conversation_history(self, conversation_id: str) -> list:
        """
        Get the full history of a conversation.

        Args:
            conversation_id: The ID of the conversation

        Returns:
            List of messages in the conversation
        """
        messages = await self.conversation_manager.get_conversation_messages(conversation_id)
        return [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at.isoformat() if msg.created_at else None
            }
            for msg in messages
        ]

    async def get_user_conversations(self, user_id: str, limit: int = 50) -> list:
        """
        Get all conversations for a user.

        Args:
            user_id: The ID of the user
            limit: Maximum number of conversations to return

        Returns:
            List of conversation summaries
        """
        conversations = await self.conversation_manager.get_user_conversations(user_id, limit)
        return [
            {
                "id": conv.id,
                "title": conv.title,
                "model": conv.model,
                "created_at": conv.created_at.isoformat() if conv.created_at else None,
                "updated_at": conv.updated_at.isoformat() if conv.updated_at else None
            }
            for conv in conversations
        ]

    async def delete_conversation(self, conversation_id: str, user_id: str = None) -> bool:
        """
        Delete a conversation.

        Args:
            conversation_id: The ID of the conversation to delete
            user_id: User ID for authorization checks

        Returns:
            True if the conversation was deleted, False otherwise
        """
        # Verify that the user owns the conversation before deletion
        conversation = await self.conversation_manager.get_conversation(conversation_id)
        if not conversation or (user_id and conversation.user_id != user_id):
            return False  # User doesn't own this conversation or it doesn't exist

        return await self.conversation_manager.delete_conversation(conversation_id)

    async def switch_model(self, new_ai_adapter: AIAdapter):
        """
        Switch to a different AI model adapter.

        Args:
            new_ai_adapter: The new AI adapter to use
        """
        self.ai_adapter = new_ai_adapter

    async def is_service_available(self) -> bool:
        """
        Check if the AI service is available.

        Returns:
            True if the service is available, False otherwise
        """
        return await self.ai_adapter.is_available()

    async def is_service_configured(self) -> bool:
        """
        Check if the AI service is properly configured.

        Returns:
            True if the service is configured, False otherwise
        """
        return self.ai_adapter.is_configured()