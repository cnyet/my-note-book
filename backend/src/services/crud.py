# backend/src/services/crud.py
"""
通用 CRUD 操作服务

提供统一的数据库操作接口，用于替换各 API 中的 mock 数据操作。
"""

from typing import TypeVar, Generic, Type, List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

# 泛型类型
ModelType = TypeVar("ModelType", bound=object)


class CRUDService(Generic[ModelType]):
    """通用 CRUD 服务类"""
    
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    def get_all(
        self,
        session: Session,
        skip: int = 0,
        limit: int = 100,
        filters: Dict[str, Any] = None
    ) -> List[ModelType]:
        """获取所有记录（支持分页和过滤）"""
        query = session.query(self.model)
        
        # 应用过滤条件
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    if isinstance(value, list):
                        query = query.filter(getattr(self.model, key).in_(value))
                    else:
                        query = query.filter(getattr(self.model, key) == value)
        
        # 排序
        if hasattr(self.model, "sort_order"):
            query = query.order_by(getattr(self.model, "sort_order"))
        elif hasattr(self.model, "created_at"):
            query = query.order_by(getattr(self.model, "created_at").desc())
        
        # 分页
        return query.offset(skip).limit(limit).all()
    
    def get_by_id(
        self,
        session: Session,
        id: int,
        raise_not_found: bool = True
    ) -> Optional[ModelType]:
        """根据 ID 获取记录"""
        query = session.query(self.model).filter_by(id=id)
        return query.first()
    
    def create(
        self,
        session: Session,
        **kwargs
    ) -> ModelType:
        """创建新记录"""
        try:
            obj = self.model(**kwargs)
            session.add(obj)
            session.commit()
            session.refresh(obj)
            logger.info(f"Created {self.model.__name__}: {obj}")
            return obj
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating {self.model.__name__}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create {self.model.__name__}"
            )
    
    def update(
        self,
        session: Session,
        id: int,
        **kwargs
    ) -> Optional[ModelType]:
        """更新记录"""
        obj = self.get_by_id(session, id, raise_not_found=False)
        if not obj:
            return None
        
        try:
            for key, value in kwargs.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)
            
            session.commit()
            session.refresh(obj)
            logger.info(f"Updated {self.model.__name__} id={id}: {obj}")
            return obj
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating {self.model.__name__} id={id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update {self.model.__name__}"
            )
    
    def delete(
        self,
        session: Session,
        id: int
    ) -> bool:
        """删除记录"""
        obj = self.get_by_id(session, id, raise_not_found=False)
        if not obj:
            return False
        
        try:
            session.delete(obj)
            session.commit()
            logger.info(f"Deleted {self.model.__name__} id={id}")
            return True
        except Exception as e:
            session.rollback()
            logger.error(f"Error deleting {self.model.__name__} id={id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete {self.model.__name__}"
            )
    
    def count(self, session: Session) -> int:
        """统计记录数量"""
        return session.query(self.model).count()


# 创建 CRUD 服务实例
def get_crud_service(model: Type[ModelType]) -> CRUDService:
    """获取模型的 CRUD 服务"""
    return CRUDService(model)
