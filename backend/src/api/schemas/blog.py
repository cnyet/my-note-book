"""
Pydantic schemas for blog operations
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class BlogPostCreate(BaseModel):
    """Schema for creating a blog post"""
    
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    summary: Optional[str] = Field(None, max_length=1000)
    category: str = Field(..., max_length=100)


class BlogPostUpdate(BaseModel):
    """Schema for updating a blog post"""
    
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, min_length=1)
    summary: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = Field(None, max_length=100)


class BlogPostResponse(BaseModel):
    """Schema for blog post response"""
    
    id: int
    title: str
    content: str
    summary: Optional[str]
    category: str
    created_at: datetime
    updated_at: datetime
    author_id: int
    
    class Config:
        from_attributes = True
