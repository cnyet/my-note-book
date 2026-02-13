# backend/src/api/v1/admin/labs.py
"""Labs API - 使用数据库操作的完整 CRUD 功能"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from ....models import Lab
from ....services.crud import get_crud_service
from ....core.database import get_db

router = APIRouter()
lab_service = get_crud_service(Lab)


class LabStatus(str):
    """实验室状态类型"""
    EXPERIMENTAL = "Experimental"
    PREVIEW = "Preview"
    ARCHIVED = "Archived"


class LabBase(BaseModel):
    """实验室基础模型"""
    name: str = Field(..., min_length=1, max_length=100, description="实验室名称")
    slug: str = Field(..., min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$", description="URL 友好的唯一标识符")
    status: str = Field(default="Experimental", pattern=r"^(Experimental|Preview|Archived)$", description="状态: Experimental, Preview, Archived")
    description: Optional[str] = Field(None, max_length=1000, description="实验室描述")
    demo_url: Optional[str] = Field(None, description="演示链接")
    media_urls: List[str] = Field(default_factory=list, description="媒体 URL 列表")
    online_count: int = Field(default=0, ge=0, description="在线用户数")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        valid_statuses = ["Experimental", "Preview", "Archived"]
        if v not in valid_statuses:
            raise ValueError(f"无效的状态。有效值为: {', '.join(valid_statuses)}")
        return v


class LabCreate(LabBase):
    """创建实验室的请求模型"""
    pass


class LabUpdate(BaseModel):
    """更新实验室的请求模型（所有字段可选）"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="实验室名称")
    slug: Optional[str] = Field(None, min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$", description="URL 友好的唯一标识符")
    status: Optional[str] = Field(None, pattern=r"^(Experimental|Preview|Archived)$", description="状态: Experimental, Preview, Archived")
    description: Optional[str] = Field(None, max_length=1000, description="实验室描述")
    demo_url: Optional[str] = Field(None, description="演示链接")
    media_urls: Optional[List[str]] = Field(None, description="媒体 URL 列表")
    online_count: Optional[int] = Field(None, ge=0, description="在线用户数")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            valid_statuses = ["Experimental", "Preview", "Archived"]
            if v not in valid_statuses:
                raise ValueError(f"无效的状态。有效值为: {', '.join(valid_statuses)}")
        return v


class LabResponse(LabBase):
    """实验室响应模型"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[LabResponse])
def list_labs(
    status: Optional[str] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    获取所有实验室列表，支持筛选和分页

    - **status**: 按状态筛选 (Experimental, Preview, Archived)
    - **skip**: 跳过前 N 条记录（分页用）
    - **limit**: 返回最多 N 条记录
    """
    filters = {}
    if status:
        filters["status"] = status

    result = lab_service.get_all(
        db,
        filters=filters,
        skip=skip,
        limit=limit,
        order_by="created_at",
        order_desc=True
    )
    return result


@router.get("/statuses", response_model=List[str])
def get_statuses():
    """获取所有实验室状态类型"""
    return ["Experimental", "Preview", "Archived"]


@router.get("/stats/summary")
def get_labs_summary(db: AsyncSession = Depends(get_db)):
    """
    获取实验室统计摘要

    返回各状态实验室的数量统计
    """
    # 获取所有实验室
    all_labs = lab_service.get_all(db, limit=1000)

    # 按状态统计
    status_stats = {}
    for status_type in ["Experimental", "Preview", "Archived"]:
        status_stats[status_type] = len([l for l in all_labs if l.status == status_type])

    # 计算总在线用户数
    total_online = sum(l.online_count for l in all_labs)

    return {
        "total": len(all_labs),
        "by_status": status_stats,
        "total_online_users": total_online
    }


@router.get("/{lab_id}", response_model=LabResponse)
def get_lab(
    lab_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    根据 ID 获取特定实验室

    - **lab_id**: 实验室 ID
    """
    lab = lab_service.get_by_id(db, lab_id)
    if not lab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"实验室 (ID: {lab_id}) 不存在"
        )
    return lab


@router.post("", response_model=LabResponse, status_code=status.HTTP_201_CREATED)
def create_lab(
    lab: LabCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    创建新实验室

    - **name**: 实验室名称（必填）
    - **slug**: URL 唯一标识符（必填，全小写字母、数字、连字符）
    - **status**: 状态（默认: Experimental）
    - **description**: 实验室描述
    - **demo_url**: 演示链接
    - **media_urls**: 媒体 URL 列表
    - **online_count**: 在线用户数（默认: 0）
    """
    # 检查 slug 是否已存在
    existing = lab_service.get_all(db, filters={"slug": lab.slug}, limit=1)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"实验室标识符 '{lab.slug}' 已存在"
        )

    # 创建实验室
    new_lab = lab_service.create(db, lab.model_dump())
    return new_lab


@router.put("/{lab_id}", response_model=LabResponse)
def update_lab(
    lab_id: int,
    lab_update: LabUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    更新实验室信息

    只更新提供的字段，未提供的字段保持不变
    """
    # 检查实验室是否存在
    lab = lab_service.get_by_id(db, lab_id)
    if not lab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"实验室 (ID: {lab_id}) 不存在"
        )

    # 如果更新 slug，检查新 slug 是否已被其他实验室使用
    if lab_update.slug:
        existing = lab_service.get_all(db, filters={"slug": lab_update.slug}, limit=1)
        if existing and existing[0].id != lab_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"实验室标识符 '{lab_update.slug}' 已被其他实验室使用"
            )

    # 获取更新数据（排除未设置的字段）
    update_data = lab_update.model_dump(exclude_unset=True)

    # 更新实验室
    updated_lab = lab_service.update(db, lab_id, update_data)
    return updated_lab


@router.delete("/{lab_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab(
    lab_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    删除实验室

    - **lab_id**: 要删除的实验室 ID
    """
    # 检查实验室是否存在
    lab = lab_service.get_by_id(db, lab_id)
    if not lab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"实验室 (ID: {lab_id}) 不存在"
        )

    lab_service.delete(db, lab_id)
    return None


@router.post("/{lab_id}/status", response_model=LabResponse)
def update_lab_status(
    lab_id: int,
    new_status: str,
    db: AsyncSession = Depends(get_db)
):
    """
    更新实验室状态

    - **lab_id**: 实验室 ID
    - **new_status**: 新状态 (Experimental, Preview, Archived)
    """
    valid_statuses = ["Experimental", "Preview", "Archived"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"无效的状态。有效值为: {', '.join(valid_statuses)}"
        )

    # 检查实验室是否存在
    lab = lab_service.get_by_id(db, lab_id)
    if not lab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"实验室 (ID: {lab_id}) 不存在"
        )

    # 更新状态
    updated_lab = lab_service.update(db, lab_id, {"status": new_status})
    return updated_lab


@router.patch("/{lab_id}/online", response_model=LabResponse)
def increment_online_count(
    lab_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    增加实验室在线用户数

    - **lab_id**: 实验室 ID
    """
    lab = lab_service.get_by_id(db, lab_id)
    if not lab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"实验室 (ID: {lab_id}) 不存在"
        )

    # 增加在线计数
    updated_lab = lab_service.update(db, lab_id, {"online_count": lab.online_count + 1})
    return updated_lab
