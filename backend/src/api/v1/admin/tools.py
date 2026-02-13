# backend/src/api/v1/admin/tools.py
"""Tools API - 使用数据库操作的完整 CRUD 功能"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from ....models import Tool
from ....services.crud import get_crud_service
from ....core.database import get_db

router = APIRouter()
tool_service = get_crud_service(Tool)


class ToolCategory(str):
    """工具分类"""
    DEV = "Dev"
    AUTO = "Auto"
    INTEL = "Intel"
    CREATIVE = "Creative"


class ToolBase(BaseModel):
    """工具基础模型"""
    name: str = Field(..., min_length=1, max_length=100, description="工具名称")
    slug: str = Field(..., min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$", description="URL 友好的唯一标识符")
    category: str = Field(..., description="分类: Dev, Auto, Intel, Creative")
    description: Optional[str] = Field(None, max_length=500, description="工具描述")
    icon_url: Optional[str] = Field(None, description="图标 URL")
    link: Optional[str] = Field(None, description="工具链接")
    status: str = Field(default="active", pattern=r"^(active|inactive)$", description="状态: active 或 inactive")
    sort_order: int = Field(default=0, description="排序顺序，数字越小越靠前")

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        valid_categories = ["Dev", "Auto", "Intel", "Creative"]
        if v not in valid_categories:
            raise ValueError(f"无效的分类。有效值为: {', '.join(valid_categories)}")
        return v


class ToolCreate(ToolBase):
    """创建工具的请求模型"""
    pass


class ToolUpdate(BaseModel):
    """更新工具的请求模型（所有字段可选）"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="工具名称")
    slug: Optional[str] = Field(None, min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$", description="URL 友好的唯一标识符")
    category: Optional[str] = Field(None, description="分类: Dev, Auto, Intel, Creative")
    description: Optional[str] = Field(None, max_length=500, description="工具描述")
    icon_url: Optional[str] = Field(None, description="图标 URL")
    link: Optional[str] = Field(None, description="工具链接")
    status: Optional[str] = Field(None, pattern=r"^(active|inactive)$", description="状态: active 或 inactive")
    sort_order: Optional[int] = Field(None, description="排序顺序")

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        if v is not None:
            valid_categories = ["Dev", "Auto", "Intel", "Creative"]
            if v not in valid_categories:
                raise ValueError(f"无效的分类。有效值为: {', '.join(valid_categories)}")
        return v


class ToolResponse(ToolBase):
    """工具响应模型"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[ToolResponse])
def list_tools(
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Field(0, ge=0, description="跳过的记录数"),
    limit: int = Field(100, ge=1, le=100, description="返回的记录数"),
    db: AsyncSession = Depends(get_db)
):
    """
    获取所有工具列表，支持筛选和分页

    - **category**: 按分类筛选 (Dev, Auto, Intel, Creative)
    - **status**: 按状态筛选 (active, inactive)
    - **skip**: 跳过前 N 条记录（分页用）
    - **limit**: 返回最多 N 条记录
    """
    filters = {}
    if category:
        filters["category"] = category
    if status:
        filters["status"] = status

    result = tool_service.get_all(
        db,
        filters=filters,
        skip=skip,
        limit=limit,
        order_by="sort_order"
    )
    return result


@router.get("/categories", response_model=List[str])
def get_categories():
    """获取所有工具分类"""
    return ["Dev", "Auto", "Intel", "Creative"]


@router.get("/stats/summary")
def get_tools_summary(db: AsyncSession = Depends(get_db)):
    """
    获取工具统计摘要

    返回各类别工具的数量统计
    """
    from sqlalchemy import func

    # 获取所有工具
    all_tools = tool_service.get_all(db, limit=1000)

    # 按类别统计
    category_stats = {}
    for category in ["Dev", "Auto", "Intel", "Creative"]:
        category_stats[category] = len([t for t in all_tools if t.category == category])

    # 按状态统计
    active_count = len([t for t in all_tools if t.status == "active"])
    inactive_count = len([t for t in all_tools if t.status == "inactive"])

    return {
        "total": len(all_tools),
        "active": active_count,
        "inactive": inactive_count,
        "by_category": category_stats
    }


@router.get("/{tool_id}", response_model=ToolResponse)
def get_tool(
    tool_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    根据 ID 获取特定工具

    - **tool_id**: 工具 ID
    """
    tool = tool_service.get_by_id(db, tool_id)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"工具 (ID: {tool_id}) 不存在"
        )
    return tool


@router.post("", response_model=ToolResponse, status_code=status.HTTP_201_CREATED)
def create_tool(
    tool: ToolCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    创建新工具

    - **name**: 工具名称（必填）
    - **slug**: URL 唯一标识符（必填，全小写字母、数字、连字符）
    - **category**: 分类（必填）
    - **description**: 工具描述
    - **icon_url**: 图标 URL
    - **link**: 工具链接
    - **status**: 状态（默认: active）
    - **sort_order**: 排序顺序（默认: 0）
    """
    # 检查 slug 是否已存在
    existing = tool_service.get_all(db, filters={"slug": tool.slug}, limit=1)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"工具标识符 '{tool.slug}' 已存在"
        )

    # 创建工具
    new_tool = tool_service.create(db, tool.model_dump())
    return new_tool


@router.put("/{tool_id}", response_model=ToolResponse)
def update_tool(
    tool_id: int,
    tool_update: ToolUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    更新工具信息

    只更新提供的字段，未提供的字段保持不变
    """
    # 检查工具是否存在
    tool = tool_service.get_by_id(db, tool_id)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"工具 (ID: {tool_id}) 不存在"
        )

    # 如果更新 slug，检查新 slug 是否已被其他工具使用
    if tool_update.slug:
        existing = tool_service.get_all(db, filters={"slug": tool_update.slug}, limit=1)
        if existing and existing[0].id != tool_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"工具标识符 '{tool_update.slug}' 已被其他工具使用"
            )

    # 获取更新数据（排除未设置的字段）
    update_data = tool_update.model_dump(exclude_unset=True)

    # 更新工具
    updated_tool = tool_service.update(db, tool_id, update_data)
    return updated_tool


@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tool(
    tool_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    删除工具

    - **tool_id**: 要删除的工具 ID
    """
    # 检查工具是否存在
    tool = tool_service.get_by_id(db, tool_id)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"工具 (ID: {tool_id}) 不存在"
        )

    tool_service.delete(db, tool_id)
    return None


@router.patch("/{tool_id}/status", response_model=ToolResponse)
def toggle_tool_status(
    tool_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    切换工具状态（active <-> inactive）

    - **tool_id**: 工具 ID
    """
    tool = tool_service.get_by_id(db, tool_id)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"工具 (ID: {tool_id}) 不存在"
        )

    new_status = "inactive" if tool.status == "active" else "active"
    updated_tool = tool_service.update(db, tool_id, {"status": new_status})
    return updated_tool
