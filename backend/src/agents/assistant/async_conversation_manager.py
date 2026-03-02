"""
Async Conversation Manager for the AI Assistant.

This module handles conversation creation, retrieval, and management using async SQLAlchemy.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, desc, delete
from ..models.conversation import Conversation as ConversationModel
from ..models.message import Message as MessageModel
from .adapters.base import Message as MessageData, MessageRole
from datetime import datetime
import tiktoken
import logging
import uuid


logger = logging.getLogger(__name__)


class AsyncConversationManager:
    """
    Asynchronously manages conversations and messages for the AI Assistant.
    """

    def __init__(self, database_url: str, max_context_tokens: int = 4000):
        """
        Initialize the conversation manager.

        Args:
            database_url: URL for the database connection
            max_context_tokens: Maximum number of tokens allowed in the context window
        """
        self.engine = create_async_engine(database_url)
        self.max_context_tokens = max_context_tokens

    async def create_conversation(self, user_id: str, model: str, initial_title: str = None) -> ConversationModel:
        """
        Create a new conversation.

        Args:
            user_id: The ID of the user creating the conversation
            model: The AI model to use for this conversation
            initial_title: Optional initial title for the conversation

        Returns:
            The created Conversation model
        """
        async with AsyncSession(self.engine) as session:
            try:
                conversation = ConversationModel(
                    user_id=user_id,
                    model=model,
                    title=initial_title
                )
                session.add(conversation)
                await session.commit()
                await session.refresh(conversation)
                return conversation
            except Exception as e:
                logger.error(f"Error creating conversation: {str(e)}")
                await session.rollback()
                raise

    async def get_conversation(self, conversation_id: str) -> Optional[ConversationModel]:
        """
        Retrieve a conversation by ID.

        Args:
            conversation_id: The ID of the conversation to retrieve

        Returns:
            The Conversation model or None if not found
        """
        async with AsyncSession(self.engine) as session:
            try:
                result = await session.execute(
                    select(ConversationModel).filter(ConversationModel.id == conversation_id)
                )
                return result.scalar_one_or_none()
            except Exception as e:
                logger.error(f"Error retrieving conversation {conversation_id}: {str(e)}")
                return None

    async def get_user_conversations(self, user_id: str, limit: int = 50) -> List[ConversationModel]:
        """
        Retrieve all conversations for a user.

        Args:
            user_id: The ID of the user
            limit: Maximum number of conversations to return

        Returns:
            List of Conversation models
        """
        async with AsyncSession(self.engine) as session:
            try:
                result = await session.execute(
                    select(ConversationModel)
                    .filter(ConversationModel.user_id == user_id)
                    .order_by(desc(ConversationModel.updated_at))
                    .limit(limit)
                )
                return result.scalars().all()
            except Exception as e:
                logger.error(f"Error retrieving conversations for user {user_id}: {str(e)}")
                return []

    async def add_message(self, conversation_id: str, role: MessageRole, content: str) -> MessageModel:
        """
        Add a message to a conversation.

        Args:
            conversation_id: The ID of the conversation
            role: The role of the message sender
            content: The content of the message

        Returns:
            The created Message model
        """
        async with AsyncSession(self.engine) as session:
            try:
                # Count tokens in the message
                token_count = self._count_tokens(content)

                message = MessageModel(
                    conversation_id=conversation_id,
                    role=role.value,  # Convert enum to string
                    content=content,
                    token_count=token_count
                )
                session.add(message)

                # Update the conversation's updated_at timestamp by fetching and updating
                conversation_result = await session.execute(
                    select(ConversationModel).filter(ConversationModel.id == conversation_id)
                )
                conversation = conversation_result.scalar_one_or_none()

                if conversation and not conversation.title:
                    # Set the title to the first 50 characters of the first message if not already set
                    if len(content) <= 50:
                        conversation.title = content
                    else:
                        conversation.title = content[:50] + "..."

                await session.commit()
                await session.refresh(message)
                return message
            except Exception as e:
                logger.error(f"Error adding message to conversation {conversation_id}: {str(e)}")
                await session.rollback()
                raise

    async def get_conversation_messages(self, conversation_id: str, limit: int = 100) -> List[MessageModel]:
        """
        Retrieve all messages in a conversation.

        Args:
            conversation_id: The ID of the conversation
            limit: Maximum number of messages to return (most recent first)

        Returns:
            List of Message models
        """
        async with AsyncSession(self.engine) as session:
            try:
                result = await session.execute(
                    select(MessageModel)
                    .filter(MessageModel.conversation_id == conversation_id)
                    .order_by(MessageModel.created_at.asc())  # Order chronologically
                    .limit(limit)
                )
                return result.scalars().all()
            except Exception as e:
                logger.error(f"Error retrieving messages for conversation {conversation_id}: {str(e)}")
                return []

    async def update_conversation_title(self, conversation_id: str, title: str):
        """
        Update the title of a conversation.

        Args:
            conversation_id: The ID of the conversation
            title: The new title
        """
        async with AsyncSession(self.engine) as session:
            try:
                result = await session.execute(
                    select(ConversationModel).filter(ConversationModel.id == conversation_id)
                )
                conversation = result.scalar_one_or_none()
                if conversation:
                    conversation.title = title
                    await session.commit()
            except Exception as e:
                logger.error(f"Error updating conversation title {conversation_id}: {str(e)}")
                await session.rollback()

    async def delete_conversation(self, conversation_id: str) -> bool:
        """
        Delete a conversation and all its messages.

        Args:
            conversation_id: The ID of the conversation to delete

        Returns:
            True if the conversation was deleted, False otherwise
        """
        async with AsyncSession(self.engine) as session:
            try:
                # Delete all messages associated with the conversation first
                await session.execute(
                    delete(MessageModel).filter(MessageModel.conversation_id == conversation_id)
                )

                # Then delete the conversation itself
                result = await session.execute(
                    delete(ConversationModel).filter(ConversationModel.id == conversation_id)
                )
                await session.commit()

                return result.rowcount > 0
            except Exception as e:
                logger.error(f"Error deleting conversation {conversation_id}: {str(e)}")
                await session.rollback()
                return False

    def _count_tokens(self, text: str) -> int:
        """
        Count the number of tokens in a text string.

        Args:
            text: The text to count tokens for

        Returns:
            Number of tokens in the text
        """
        try:
            # Use tiktoken to count tokens
            encoder = tiktoken.encoding_for_model("gpt-4")  # Use a common encoding
            return len(encoder.encode(text))
        except Exception:
            # Fallback: rough estimation (about 4 chars per token on average)
            return max(1, len(text) // 4)

    async def get_conversation_context(self, conversation_id: str, max_messages: int = 10) -> List[Dict[str, str]]:
        """
        Get the most recent messages from a conversation for context.

        Args:
            conversation_id: The ID of the conversation
            max_messages: Maximum number of recent messages to return

        Returns:
            List of message dictionaries in the format {'role': str, 'content': str}
        """
        messages = await self.get_conversation_messages(conversation_id, limit=max_messages)

        # Convert to the format expected by AI adapters
        return [
            {
                "role": msg.role,
                "content": msg.content
            }
            for msg in messages
        ]

    async def get_token_limited_context(self, conversation_id: str, max_tokens: int = None) -> List[Dict[str, str]]:
        """
        Get conversation context with token limit enforcement.

        Args:
            conversation_id: The ID of the conversation
            max_tokens: Maximum number of tokens to include (defaults to self.max_context_tokens)

        Returns:
            List of message dictionaries in the format {'role': str, 'content': str}
        """
        if max_tokens is None:
            max_tokens = self.max_context_tokens

        # Get all messages in the conversation
        all_messages = await self.get_conversation_messages(conversation_id, limit=1000)  # Get up to 1000 messages
        context_messages = []
        total_tokens = 0

        # Process messages in reverse chronological order (newest first)
        for message in reversed(all_messages):
            message_tokens = message.token_count or self._count_tokens(message.content)

            # Check if adding this message would exceed the token limit
            if total_tokens + message_tokens > max_tokens:
                # If this is the first message (newest), we have to include it anyway
                if len(context_messages) == 0:
                    context_messages.append({
                        "role": message.role,
                        "content": message.content
                    })
                    break
                else:
                    # Otherwise, stop adding messages
                    break

            # Add the message to context (at the beginning to maintain chronological order)
            context_messages.insert(0, {
                "role": message.role,
                "content": message.content
            })
            total_tokens += message_tokens

        return context_messages

    async def summarize_conversation(self, conversation_id: str, ai_adapter, max_summary_length: int = 200) -> str:
        """
        Generate a summary of the conversation using the AI adapter.

        Args:
            conversation_id: The ID of the conversation to summarize
            ai_adapter: An AI adapter to use for summarization
            max_summary_length: Maximum length of the summary in words

        Returns:
            A summary of the conversation
        """
        # Get all messages in the conversation
        all_messages = await self.get_conversation_messages(conversation_id, limit=1000)

        # Build the conversation text to summarize
        conversation_text = "\n".join([
            f"[{msg.role.upper()}]: {msg.content}"
            for msg in all_messages
        ])

        if not conversation_text.strip():
            return "Empty conversation"

        # Create a prompt for the AI to summarize
        prompt = f"""
        Please provide a concise summary of the following conversation.
        Limit the summary to approximately {max_summary_length} words.

        Conversation:
        {conversation_text[:4000]}  # Limit input to avoid exceeding token limits
        """

        try:
            summary = await ai_adapter.chat([{
                "role": "user",
                "content": prompt
            }])

            return summary
        except Exception as e:
            logger.error(f"Error summarizing conversation {conversation_id}: {str(e)}")
            # Fallback: return a basic summary
            first_few_words = all_messages[0].content[:50] if all_messages else "Empty conversation"
            return f"Conversation starting with: {first_few_words}..."

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.engine.dispose()