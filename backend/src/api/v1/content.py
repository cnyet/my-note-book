from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from src.core.database import get_db
from src.models.content import (
    BlogPost as BlogPostModel,
    Tool as ToolModel,
    Lab as LabModel,
)
from src.schemas.content import (
    BlogPost,
    BlogPostCreate,
    Tool,
    ToolCreate,
    Lab,
    LabCreate,
)
from src.api.v1.auth import get_current_user
from src.models.user import User

router = APIRouter()

# --- Blog Posts ---


@router.get("/posts", response_model=List[BlogPost])
def read_posts(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(BlogPostModel)
    if category:
        query = query.filter(BlogPostModel.category == category)
    return query.offset(skip).limit(limit).all()


@router.get("/posts/{slug}", response_model=BlogPost)
def read_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPostModel).filter(BlogPostModel.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/posts", response_model=BlogPost)
def create_post(
    post_in: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if slug exists
    if db.query(BlogPostModel).filter(BlogPostModel.slug == post_in.slug).first():
        raise HTTPException(status_code=400, detail="Slug already exists")

    post_obj = BlogPostModel(**post_in.model_dump(), author_id=current_user.id)
    db.add(post_obj)
    db.commit()
    db.refresh(post_obj)
    return post_obj


# --- Tools ---


@router.get("/tools", response_model=List[Tool])
def read_tools(db: Session = Depends(get_db)):
    return db.query(ToolModel).order_by(ToolModel.sort_order).all()


@router.post("/tools", response_model=Tool)
def create_tool(
    tool_in: ToolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tool_obj = ToolModel(**tool_in.model_dump())
    db.add(tool_obj)
    db.commit()
    db.refresh(tool_obj)
    return tool_obj


# --- Labs ---


@router.get("/labs", response_model=List[Lab])
def read_labs(db: Session = Depends(get_db)):
    return db.query(LabModel).order_by(LabModel.sort_order).all()


@router.post("/labs", response_model=Lab)
def create_lab(
    lab_in: LabCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lab_obj = LabModel(**lab_in.model_dump())
    db.add(lab_obj)
    db.commit()
    db.refresh(lab_obj)
    return lab_obj
