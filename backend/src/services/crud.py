# backend/src/services/crud.py
"""
通用 CRUD 操作服务 (完全异步版)

提供统一的数据库操作接口，适配 FastAPI 的异步 Session。
"""

from typing import TypeVar, Generic, Type, List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

# 类型变量
ModelType = TypeVar("ModelType", bound=object)


class CRUDService(Generic[ModelType]):
    """通用异步 CRUD 服务类"""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_all(
        self,
        session: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        filters: Dict[str, Any] = None,
        order_by: str = None,
        order_desc: bool = False
    ) -> List[ModelType]:
        """获取所有记录（支持分页和过滤）"""
        stmt = select(self.model)

        # 应用过滤条件
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    attr = getattr(self.model, key)
                    if isinstance(value, list):
                        stmt = stmt.where(attr.in_(value))
                    else:
                        stmt = stmt.where(attr == value)

        # 排序
        if order_by and hasattr(self.model, order_by):
            attr = getattr(self.model, order_by)
            if order_desc:
                stmt = stmt.order_by(attr.desc())
            else:
                stmt = stmt.order_by(attr.asc())
        elif hasattr(self.model, "sort_order"):
            stmt = stmt.order_by(self.model.sort_order.asc())
        elif hasattr(self.model, "created_at"):
            stmt = stmt.order_by(self.model.created_at.desc())

        # 添加分页
        stmt = stmt.offset(skip).limit(limit)

        # 执行查询
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(
        self,
        session: AsyncSession,
        id: int
    ) -> Optional[ModelType]:
        """根据 ID 获取记录"""
        stmt = select(self.model).where(getattr(self.model, "id") == id)
        result = await session.execute(stmt)
        return result.scalars().first()

    async def create(
        self,
        session: AsyncSession,
        obj_in_data: Dict[str, Any]
    ) -> ModelType:
        """创建新记录"""
        try:
            obj = self.model(**obj_in_data)
            session.add(obj)
            await session.commit()
            await session.refresh(obj)
            logger.info(f"Created {self.model.__name__} id={getattr(obj, 'id', 'unknown')}")
            return obj
        except Exception as e:
            await session.rollback()
            logger.error(f"Error creating {self.model.__name__}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create {self.model.__name__}: {str(e)}"
            )

    async def update(
        self,
        session: AsyncSession,
        id: int,
        obj_in_data: Dict[str, Any]
    ) -> Optional[ModelType]:
        """更新记录"""
        obj = await self.get_by_id(session, id)
        if not obj:
            return None

        try:
            for key, value in obj_in_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await session.commit()
            await session.refresh(obj)
            logger.info(f"Updated {self.model.__name__} id={id}")
            return obj
        except Exception as e:
            await session.rollback()
            logger.error(f"Error updating {self.model.__name__} id={id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update {self.model.__name__}: {str(e)}"
            )

    async def delete(
        self,
        session: AsyncSession,
        id: int
    ) -> bool:
        """删除记录"""
        obj = await self.get_by_id(session, id)
        if not obj:
            return False

        try:
            await session.delete(obj)
            await session.commit()
            logger.info(f"Deleted {self.model.__name__} id={id}")
            return True
        except Exception as e:
            await session.rollback()
            logger.error(f"Error deleting {self.model.__name__} id={id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete {self.model.__name__}: {str(e)}"
            )

    async def count(self, session: AsyncSession, filters: Dict[str, Any] = None) -> int:
        """统计记录数量"""
        stmt = select(func.count()).select_from(self.model)
        if filters:
             for key, value in filters.items():
                if hasattr(self.model, key):
                    stmt = stmt.where(getattr(self.model, key) == value)

        result = await session.execute(stmt)
        return result.scalar() or 0


# 创建 CRUD 服务实例工厂
def get_crud_service(model: Type[ModelType]) -> CRUDService:
    """获取模型的 CRUD 服务"""
    return CRUDService(model)
