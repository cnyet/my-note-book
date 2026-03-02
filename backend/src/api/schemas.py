"""
Schema definitions for the AI Assistant API.

This module contains Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AssistantChatRequest(BaseModel):
    """
    Schema for chat requests to the AI assistant.
    """
    conversation_id: str
    message: str
    model_type: str = "ollama"  # Default to ollama, can be 'openai', 'anthropic', 'ollama'
    api_key: Optional[str] = None  # Optional API key for services that require it


class AssistantChatResponse(BaseModel):
    """
    Schema for chat responses from the AI assistant.
    """
    response: str
    conversation_id: str


class NewConversationRequest(BaseModel):
    """
    Schema for creating a new conversation.
    """
    model_type: str = "ollama"
    model: Optional[str] = None
    api_key: Optional[str] = None


class ConversationSummary(BaseModel):
    """
    Schema for conversation summaries in the list response.
    """
    id: str
    title: str
    model: str
    created_at: str
    updated_at: str


class ConversationListResponse(BaseModel):
    """
    Schema for the conversation list response.
    """
    conversations: List[ConversationSummary]


class MessageDetail(BaseModel):
    """
    Schema for individual messages in a conversation.
    """
    id: str
    role: str
    content: str
    created_at: str


class ConversationDetailResponse(BaseModel):
    """
    Schema for conversation detail response.
    """
    id: str
    title: str
    model: str
    created_at: str
    updated_at: str
    messages: List[MessageDetail]