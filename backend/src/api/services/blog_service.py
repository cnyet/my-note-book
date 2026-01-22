"""
Blog service - business logic for blog operations
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from api.models.blog import BlogPost
from api.repositories.blog_repository import BlogRepository
from api.schemas.blog import BlogPostCreate, BlogPostUpdate


class BlogService:
    """Service for blog post business logic"""
    
    def __init__(self, db: Session):
        self.db = db
        self.blog_repo = BlogRepository(db)
    
    def create_post(self, post_data: BlogPostCreate, author_id: int) -> BlogPost:
        """Create a new blog post"""
        summary = post_data.summary
        if not summary:
            content_text = post_data.content.strip()
            summary = content_text[:200] + "..." if len(content_text) > 200 else content_text
        
        post_dict = post_data.dict(exclude_unset=True)
        post_dict["summary"] = summary
        
        return self.blog_repo.create_post(post_dict, author_id)
    
    def get_all_posts(self, skip: int = 0, limit: int = 100, category: Optional[str] = None) -> List[BlogPost]:
        """Get all blog posts"""
        return self.blog_repo.get_all_posts(skip, limit, category)
    
    def get_post_by_id(self, post_id: int) -> Optional[BlogPost]:
        """Get a blog post by ID"""
        return self.blog_repo.get_post_by_id(post_id)
    
    def update_post(self, post_id: int, update_data: BlogPostUpdate, author_id: int) -> Optional[BlogPost]:
        """Update a blog post with ownership check"""
        post = self.blog_repo.get_post_by_id(post_id)
        if not post:
            return None
        if post.author_id != author_id:
            raise PermissionError("Unauthorized: Not the author")
        
        update_dict = update_data.dict(exclude_unset=True)
        return self.blog_repo.update_post(post_id, update_dict)
    
    def delete_post(self, post_id: int, author_id: int) -> bool:
        """Delete a blog post with ownership check"""
        post = self.blog_repo.get_post_by_id(post_id)
        if not post:
            return False
        if post.author_id != author_id:
            raise PermissionError("Unauthorized: Not the author")
        
        return self.blog_repo.delete_post(post_id)
    
    def search_posts(self, query: str, skip: int = 0, limit: int = 100) -> List[BlogPost]:
        """Search blog posts by title or content with pagination"""
        return self.blog_repo.search_posts(query, skip, limit)
