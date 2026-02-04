from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.sql import func
from src.core.database import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    category = Column(String)
    tags = Column(String)
    rating = Column(Float, default=0.0)
    is_featured = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    creator = Column(String)
    endpoint = Column(String)  # Orchestration endpoint
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
