"""
Blog post repository for database operations
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from api.models.blog import BlogPost


class BlogRepository:
    """Repository for blog post operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_post(self, post_data: dict, author_id: int) -> BlogPost:
        """Create a new blog post"""
        try:
            post = BlogPost(**post_data, author_id=author_id)
            self.db.add(post)
            self.db.commit()
            self.db.refresh(post)
            return post
        except Exception:
            self.db.rollback()
            raise
    
    def get_all_posts(self, skip: int = 0, limit: int = 100, category: Optional[str] = None) -> List[BlogPost]:
        """Get all blog posts with optional filtering"""
        query = self.db.query(BlogPost)
        if category:
            query = query.filter(BlogPost.category == category)
        return query.order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_post_by_id(self, post_id: int) -> Optional[BlogPost]:
        """Get a blog post by ID"""
        return self.db.query(BlogPost).filter(BlogPost.id == post_id).first()
    
    def update_post(self, post_id: int, update_data: dict) -> Optional[BlogPost]:
        """Update a blog post"""
        try:
            post = self.get_post_by_id(post_id)
            if not post:
                return None
            for key, value in update_data.items():
                setattr(post, key, value)
            self.db.commit()
            self.db.refresh(post)
            return post
        except Exception:
            self.db.rollback()
            raise
    
    def delete_post(self, post_id: int) -> bool:
        """Delete a blog post"""
        try:
            post = self.get_post_by_id(post_id)
            if not post:
                return False
            self.db.delete(post)
            self.db.commit()
            return True
        except Exception:
            self.db.rollback()
            raise
    
    def search_posts(self, query: str, skip: int = 0, limit: int = 100) -> List[BlogPost]:
        """Search blog posts by title or content with pagination"""
        return self.db.query(BlogPost).filter(
            (BlogPost.title.contains(query)) | (BlogPost.content.contains(query))
        ).order_by(BlogPost.created_at.desc()).offset(skip).limit(limit).all()
