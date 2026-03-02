"""
Conversation Manager for the AI Assistant.

This module handles conversation creation, retrieval, and management.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine, desc
from ..models.conversation import Conversation as ConversationModel
from ..models.message import Message as MessageModel
from .adapters.base import Message as MessageData, MessageRole
from datetime import datetime
import tiktoken


class ConversationManager:
    """
    Manages conversations and messages for the AI Assistant.
    """

    def __init__(self, database_url: str, max_context_tokens: int = 4000):
        """
        Initialize the conversation manager.

        Args:
            database_url: URL for the database connection
            max_context_tokens: Maximum number of tokens allowed in the context window
        """
        self.engine = create_engine(database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.max_context_tokens = max_context_tokens

    def create_conversation(self, user_id: str, model: str, initial_title: str = None) -> ConversationModel:
        """
        Create a new conversation.

        Args:
            user_id: The ID of the user creating the conversation
            model: The AI model to use for this conversation
            initial_title: Optional initial title for the conversation

        Returns:
            The created Conversation model
        """
        db = self.SessionLocal()
        try:
            conversation = ConversationModel(
                user_id=user_id,
                model=model,
                title=initial_title
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            return conversation
        finally:
            db.close()

    def get_conversation(self, conversation_id: str) -> Optional[ConversationModel]:
        """
        Retrieve a conversation by ID.

        Args:
            conversation_id: The ID of the conversation to retrieve

        Returns:
            The Conversation model or None if not found
        """
        db = self.SessionLocal()
        try:
            return db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()
        finally:
            db.close()

    def get_user_conversations(self, user_id: str, limit: int = 50) -> List[ConversationModel]:
        """
        Retrieve all conversations for a user.

        Args:
            user_id: The ID of the user
            limit: Maximum number of conversations to return

        Returns:
            List of Conversation models
        """
        db = self.SessionLocal()
        try:
            return (
                db.query(ConversationModel)
                .filter(ConversationModel.user_id == user_id)
                .order_by(desc(ConversationModel.updated_at))
                .limit(limit)
                .all()
            )
        finally:
            db.close()

    def add_message(self, conversation_id: str, role: MessageRole, content: str) -> MessageModel:
        """
        Add a message to a conversation.

        Args:
            conversation_id: The ID of the conversation
            role: The role of the message sender
            content: The content of the message

        Returns:
            The created Message model
        """
        db = self.SessionLocal()
        try:
            # Count tokens in the message
            token_count = self._count_tokens(content)

            message = MessageModel(
                conversation_id=conversation_id,
                role=role.value,  # Convert enum to string
                content=content,
                token_count=token_count
            )
            db.add(message)

            # Update the conversation's updated_at timestamp
            conversation = db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()
            if conversation and not conversation.title:
                # Set the title to the first 50 characters of the first message if not already set
                if len(content) <= 50:
                    conversation.title = content
                else:
                    conversation.title = content[:50] + "..."

            db.commit()
            db.refresh(message)
            return message
        finally:
            db.close()

    def get_conversation_messages(self, conversation_id: str, limit: int = 100) -> List[MessageModel]:
        """
        Retrieve all messages in a conversation.

        Args:
            conversation_id: The ID of the conversation
            limit: Maximum number of messages to return (most recent first)

        Returns:
            List of Message models
        """
        db = self.SessionLocal()
        try:
            return (
                db.query(MessageModel)
                .filter(MessageModel.conversation_id == conversation_id)
                .order_by(MessageModel.created_at.asc())  # Order chronologically
                .limit(limit)
                .all()
            )
        finally:
            db.close()

    def update_conversation_title(self, conversation_id: str, title: str):
        """
        Update the title of a conversation.

        Args:
            conversation_id: The ID of the conversation
            title: The new title
        """
        db = self.SessionLocal()
        try:
            conversation = db.query(ConversationModel).filter(ConversationModel.id == conversation_id).first()
            if conversation:
                conversation.title = title
                db.commit()
        finally:
            db.close()

    def delete_conversation(self, conversation_id: str) -> bool:
        """
        Delete a conversation and all its messages.

        Args:
            conversation_id: The ID of the conversation to delete

        Returns:
            True if the conversation was deleted, False otherwise
        """
        db = self.SessionLocal()
        try:
            # Delete all messages associated with the conversation first
            db.query(MessageModel).filter(MessageModel.conversation_id == conversation_id).delete()

            # Then delete the conversation itself
            result = db.query(ConversationModel).filter(ConversationModel.id == conversation_id).delete()
            db.commit()

            return result > 0
        finally:
            db.close()

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

    def get_conversation_context(self, conversation_id: str, max_messages: int = 10) -> List[Dict[str, str]]:
        """
        Get the most recent messages from a conversation for context.

        Args:
            conversation_id: The ID of the conversation
            max_messages: Maximum number of recent messages to return

        Returns:
            List of message dictionaries in the format {'role': str, 'content': str}
        """
        messages = self.get_conversation_messages(conversation_id, limit=max_messages)

        # Convert to the format expected by AI adapters
        return [
            {
                "role": msg.role,
                "content": msg.content
            }
            for msg in messages
        ]

    def get_token_limited_context(self, conversation_id: str, max_tokens: int = None) -> List[Dict[str, str]]:
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

        all_messages = self.get_conversation_messages(conversation_id, limit=1000)  # Get up to 1000 messages
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

    def summarize_conversation(self, conversation_id: str, ai_adapter, max_summary_length: int = 200) -> str:
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
        all_messages = self.get_conversation_messages(conversation_id, limit=1000)

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
            summary = ai_adapter.chat([{
                "role": "user",
                "content": prompt
            }])

            return summary
        except Exception as e:
            # Fallback: return a basic summary
            first_few_words = all_messages[0].content[:50] if all_messages else "Empty conversation"
            return f"Conversation starting with: {first_few_words}..."