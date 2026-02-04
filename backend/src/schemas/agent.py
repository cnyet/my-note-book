from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class Tag(TagBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    rating: float = 0.0
    is_featured: bool = False
    is_premium: bool = False
    creator: Optional[str] = None
    endpoint: Optional[str] = None


class AgentCreate(AgentBase):
    pass


class Agent(AgentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
