# backend/src/api/v1/admin/blog.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()


class BlogPostStatus(str):
    """Blog post statuses"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    excerpt: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., min_length=1)
    cover_image: Optional[str] = None
    seo_title: Optional[str] = Field(None, max_length=70)
    seo_description: Optional[str] = Field(None, max_length=160)
    tags: List[str] = Field(default_factory=list)
    status: str = Field(default="draft", pattern=r"^(draft|published|archived)$")
    published_at: Optional[datetime] = None


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    slug: Optional[str] = Field(None, min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    excerpt: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    cover_image: Optional[str] = None
    seo_title: Optional[str] = Field(None, max_length=70)
    seo_description: Optional[str] = Field(None, max_length=160)
    tags: Optional[List[str]] = None
    status: Optional[str] = Field(None, pattern=r"^(draft|published|archived)$")
    published_at: Optional[datetime] = None


class BlogPostResponse(BlogPostBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Mock data
mock_posts = [
    {
        "id": 1,
        "title": "Getting Started with AI Agents",
        "slug": "getting-started-with-ai-agents",
        "excerpt": "Learn how to build and deploy AI agents for your applications",
        "content": "# Getting Started with AI Agents\n\nAI agents are autonomous systems that can perform tasks on behalf of users...",
        "cover_image": "/images/blog/ai-agents.jpg",
        "seo_title": "Getting Started with AI Agents - Complete Guide",
        "seo_description": "Learn how to build and deploy AI agents for your applications with this comprehensive guide.",
        "tags": ["AI", "Agents", "Tutorial"],
        "status": "published",
        "published_at": datetime(2025, 1, 20, 10, 0, 0),
        "created_at": datetime(2025, 1, 15, 9, 0, 0),
        "updated_at": datetime(2025, 1, 20, 10, 0, 0),
    },
    {
        "id": 2,
        "title": "Building Modern Web Applications",
        "slug": "building-modern-web-applications",
        "excerpt": "Best practices for building scalable web apps with Next.js and FastAPI",
        "content": "# Building Modern Web Applications\n\nIn this article, we'll explore the best practices...",
        "cover_image": "/images/blog/web-dev.jpg",
        "seo_title": "Building Modern Web Applications - Best Practices",
        "seo_description": "Learn best practices for building scalable web applications with Next.js and FastAPI.",
        "tags": ["Web", "Next.js", "FastAPI"],
        "status": "published",
        "published_at": datetime(2025, 1, 25, 14, 0, 0),
        "created_at": datetime(2025, 1, 22, 11, 0, 0),
        "updated_at": datetime(2025, 1, 25, 14, 0, 0),
    },
    {
        "id": 3,
        "title": "The Future of Developer Tools",
        "slug": "future-of-developer-tools",
        "excerpt": "Exploring emerging trends in developer tooling and productivity",
        "content": "# The Future of Developer Tools\n\nDeveloper tools have evolved significantly...",
        "cover_image": None,
        "seo_title": None,
        "seo_description": None,
        "tags": ["Tools", "Productivity"],
        "status": "draft",
        "published_at": None,
        "created_at": datetime(2025, 2, 1, 16, 0, 0),
        "updated_at": None,
    },
    {
        "id": 4,
        "title": "Mastering TypeScript Generics",
        "slug": "mastering-typescript-generics",
        "excerpt": "Deep dive into TypeScript generics with practical examples",
        "content": "# Mastering TypeScript Generics\n\nGenerics are one of the most powerful features...",
        "cover_image": "/images/blog/typescript.jpg",
        "seo_title": "Mastering TypeScript Generics - Deep Dive",
        "seo_description": "Deep dive into TypeScript generics with practical examples and best practices.",
        "tags": ["TypeScript", "Programming"],
        "status": "draft",
        "published_at": None,
        "created_at": datetime(2025, 2, 5, 13, 0, 0),
        "updated_at": datetime(2025, 2, 8, 10, 30, 0),
    },
]


@router.get("", response_model=List[BlogPostResponse])
def list_posts(
    status: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List all blog posts with optional filtering"""
    posts = mock_posts.copy()
    
    if status:
        posts = [p for p in posts if p["status"] == status]
    
    if tag:
        posts = [p for p in posts if tag in p["tags"]]
    
    if search:
        search_lower = search.lower()
        posts = [
            p for p in posts 
            if search_lower in p["title"].lower() 
            or (p["excerpt"] and search_lower in p["excerpt"].lower())
        ]
    
    # Sort by created_at desc
    posts.sort(key=lambda x: x["created_at"], reverse=True)
    
    return posts[skip : skip + limit]


@router.get("/tags")
def get_all_tags():
    """Get all unique tags"""
    tags = set()
    for post in mock_posts:
        tags.update(post["tags"])
    return sorted(list(tags))


@router.get("/{post_id}", response_model=BlogPostResponse)
def get_post(post_id: int):
    """Get a specific post by ID"""
    post = next((p for p in mock_posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post


@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post: BlogPostCreate):
    """Create a new blog post"""
    # Check for duplicate slug
    if any(p["slug"] == post.slug for p in mock_posts):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Post with slug '{post.slug}' already exists"
        )
    
    new_id = max(p["id"] for p in mock_posts) + 1 if mock_posts else 1
    
    # Auto-generate excerpt if not provided
    excerpt = post.excerpt
    if not excerpt and post.content:
        excerpt = post.content[:200] + "..." if len(post.content) > 200 else post.content
    
    new_post = {
        "id": new_id,
        **post.model_dump(),
        "excerpt": excerpt,
        "created_at": datetime.now(),
        "updated_at": None,
    }
    
    # If published, set published_at
    if post.status == "published" and not new_post["published_at"]:
        new_post["published_at"] = datetime.now()
    
    mock_posts.append(new_post)
    return new_post


@router.put("/{post_id}", response_model=BlogPostResponse)
def update_post(post_id: int, post_update: BlogPostUpdate):
    """Update a blog post"""
    post_index = next((i for i, p in enumerate(mock_posts) if p["id"] == post_id), None)
    if post_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check for duplicate slug if updating slug
    if post_update.slug:
        existing = next((p for p in mock_posts if p["slug"] == post_update.slug and p["id"] != post_id), None)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Post with slug '{post_update.slug}' already exists"
            )
    
    # Update only provided fields
    update_data = post_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        mock_posts[post_index][field] = value
    
    # Handle status change to published
    if post_update.status == "published" and not mock_posts[post_index]["published_at"]:
        mock_posts[post_index]["published_at"] = datetime.now()
    
    mock_posts[post_index]["updated_at"] = datetime.now()
    
    return mock_posts[post_index]


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int):
    """Delete a blog post"""
    post_index = next((i for i, p in enumerate(mock_posts) if p["id"] == post_id), None)
    if post_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    mock_posts.pop(post_index)
    return None


@router.patch("/{post_id}/status", response_model=BlogPostResponse)
def update_post_status(post_id: int, status: str):
    """Update post status (publish/unpublish/archive)"""
    if status not in ["draft", "published", "archived"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    post_index = next((i for i, p in enumerate(mock_posts) if p["id"] == post_id), None)
    if post_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    old_status = mock_posts[post_index]["status"]
    mock_posts[post_index]["status"] = status
    
    # Set published_at when publishing for the first time
    if status == "published" and old_status != "published" and not mock_posts[post_index]["published_at"]:
        mock_posts[post_index]["published_at"] = datetime.now()
    
    mock_posts[post_index]["updated_at"] = datetime.now()
    
    return mock_posts[post_index]


@router.post("/{post_id}/generate-markdown")
def generate_markdown(post_id: int):
    """Generate Markdown file for published post"""
    post = next((p for p in mock_posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    if post["status"] != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only published posts can generate markdown"
        )
    
    # Generate frontmatter
    frontmatter = f"""---
title: {post['title']}
slug: {post['slug']}
date: {post['published_at'].isoformat() if post['published_at'] else ''}
tags: {post['tags']}
cover_image: {post['cover_image'] or ''}
seo_title: {post['seo_title'] or post['title']}
seo_description: {post['seo_description'] or post['excerpt'] or ''}
---

"""
    
    markdown_content = frontmatter + post["content"]
    
    return {
        "filename": f"{post['slug']}.md",
        "content": markdown_content,
        "message": f"Markdown generated for '{post['title']}'"
    }
