from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    summary: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    status: str = "draft"


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    status: Optional[str] = None


class BlogPost(BlogPostBase):
    id: int
    author_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class ToolBase(BaseModel):
    name: str
    description: str
    icon: Optional[str] = None
    category: Optional[str] = None
    link: Optional[str] = None
    sort_order: int = 0


class ToolCreate(ToolBase):
    pass


class Tool(ToolBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class LabBase(BaseModel):
    name: str
    description: str
    category: Optional[str] = None
    status: Optional[str] = None
    media: Optional[str] = None
    link: Optional[str] = None
    sort_order: int = 0


class LabCreate(LabBase):
    pass


class Lab(LabBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
