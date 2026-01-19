"""Database models for semantic memory (vector embeddings)."""
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from api.database import Base

class SemanticMemory(Base):
    """Store classifies memories with vector placeholders."""
    __tablename__ = "semantic_memories"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_type = Column(String(50), nullable=False, index=True)
    category = Column(String(50), index=True) # user_preferences, important_decisions, etc.
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON) # Additional context
    # Vector column would be added here if using sqlite-vss or handled by external store
    created_at = Column(DateTime(timezone=True), server_default=func.now())
