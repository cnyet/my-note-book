"""Blogs API routes."""

from fastapi import APIRouter


router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("/")
async def get_blogs():
    """Get all blogs."""
    return {"message": "Get all blogs"}


@router.get("/{blog_id}")
async def get_blog(blog_id: int):
    """Get blog by ID."""
    return {"message": f"Get blog {blog_id}"}


@router.post("/")
async def create_blog():
    """Create a new blog."""
    return {"message": "Create blog"}
