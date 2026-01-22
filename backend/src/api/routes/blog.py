"""
Blog API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from api.database import get_db
from api.services.blog_service import BlogService
from api.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostResponse
from api.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/api/blog", tags=["blog"])


@router.get("/posts", response_model=List[BlogPostResponse])
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all blog posts with optional filtering and paginated search
    """
    blog_service = BlogService(db)
    
    if search:
        posts = blog_service.search_posts(search, skip, limit)
    else:
        posts = blog_service.get_all_posts(skip, limit, category)
    
    return posts


@router.get("/posts/{post_id}", response_model=BlogPostResponse)
async def get_post(post_id: int, db: Session = Depends(get_db)):
    """
    Get a specific blog post by ID
    """
    blog_service = BlogService(db)
    post = blog_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="文章未找到")
    return post


@router.post("/posts", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new blog post
    """
    blog_service = BlogService(db)
    post = blog_service.create_post(post_data, current_user.id)
    return post


@router.put("/posts/{post_id}", response_model=BlogPostResponse)
async def update_post(
    post_id: int,
    update_data: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a blog post with specific error status codes
    """
    blog_service = BlogService(db)
    try:
        post = blog_service.update_post(post_id, update_data, current_user.id)
        if not post:
            raise HTTPException(status_code=404, detail="文章未找到")
        return post
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a blog post with specific error status codes
    """
    blog_service = BlogService(db)
    try:
        success = blog_service.delete_post(post_id, current_user.id)
        if not success:
            raise HTTPException(status_code=404, detail="文章未找到")
        return None
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
