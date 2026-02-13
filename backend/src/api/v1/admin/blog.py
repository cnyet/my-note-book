# backend/src/api/v1/admin/blog.py
"""Blog API - 使用数据库操作的完整 CRUD 功能"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ....models import BlogPost, PostTag
from ....services.crud import get_crud_service
from ....core.database import get_db

router = APIRouter()
blog_service = get_crud_service(BlogPost)


class BlogPostStatus(str):
    """博客文章状态"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class BlogPostBase(BaseModel):
    """博客文章基础模型"""
    title: str = Field(..., min_length=1, max_length=200, description="文章标题")
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$", description="URL 友好的唯一标识符")
    excerpt: Optional[str] = Field(None, max_length=500, description="文章摘要")
    content: str = Field(..., min_length=1, description="文章内容（Markdown 格式）")
    cover_image: Optional[str] = Field(None, description="封面图片 URL")
    seo_title: Optional[str] = Field(None, max_length=70, description="SEO 标题")
    seo_description: Optional[str] = Field(None, max_length=160, description="SEO 描述")
    tags: List[str] = Field(default_factory=list, description="标签列表")
    status: str = Field(default="draft", pattern=r"^(draft|published|archived)$", description="状态: draft, published, archived")
    published_at: Optional[datetime] = Field(None, description="发布时间")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        valid_statuses = ["draft", "published", "archived"]
        if v not in valid_statuses:
            raise ValueError(f"无效的状态。有效值为: {', '.join(valid_statuses)}")
        return v


class BlogPostCreate(BlogPostBase):
    """创建博客文章的请求模型"""
    pass


class BlogPostUpdate(BaseModel):
    """更新博客文章的请求模型（所有字段可选）"""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="文章标题")
    slug: Optional[str] = Field(None, min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$", description="URL 友好的唯一标识符")
    excerpt: Optional[str] = Field(None, max_length=500, description="文章摘要")
    content: Optional[str] = Field(None, min_length=1, description="文章内容（Markdown 格式）")
    cover_image: Optional[str] = Field(None, description="封面图片 URL")
    seo_title: Optional[str] = Field(None, max_length=70, description="SEO 标题")
    seo_description: Optional[str] = Field(None, max_length=160, description="SEO 描述")
    tags: Optional[List[str]] = Field(None, description="标签列表")
    status: Optional[str] = Field(None, pattern=r"^(draft|published|archived)$", description="状态: draft, published, archived")
    published_at: Optional[datetime] = Field(None, description="发布时间")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            valid_statuses = ["draft", "published", "archived"]
            if v not in valid_statuses:
                raise ValueError(f"无效的状态。有效值为: {', '.join(valid_statuses)}")
        return v


class BlogPostResponse(BlogPostBase):
    """博客文章响应模型"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


async def _update_post_tags(db: AsyncSession, post_id: int, tags: List[str]):
    """更新文章标签"""
    # 删除现有标签
    await db.execute(
        select(PostTag).where(PostTag.post_id == post_id)
    )
    existing_tags = (await db.execute(
        select(PostTag).where(PostTag.post_id == post_id)
    )).scalars().all()

    for tag in existing_tags:
        await db.delete(tag)

    # 添加新标签
    for tag_name in tags:
        tag = PostTag(post_id=post_id, tag_name=tag_name)
        db.add(tag)

    await db.commit()


@router.get("", response_model=List[BlogPostResponse])
def list_posts(
    status: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Field(0, ge=0, description="跳过的记录数"),
    limit: int = Field(100, ge=1, le=100, description="返回的记录数"),
    db: AsyncSession = Depends(get_db)
):
    """
    获取所有博客文章列表，支持筛选、搜索和分页

    - **status**: 按状态筛选 (draft, published, archived)
    - **tag**: 按标签筛选
    - **search**: 在标题和摘要中搜索
    - **skip**: 跳过前 N 条记录（分页用）
    - **limit**: 返回最多 N 条记录
    """
    filters = {}
    if status:
        filters["status"] = status

    result = blog_service.get_all(
        db,
        filters=filters,
        skip=skip,
        limit=limit,
        order_by="created_at",
        order_desc=True
    )

    # 标签筛选
    if tag:
        result = [p for p in result if tag in p.tags]

    # 搜索筛选
    if search:
        search_lower = search.lower()
        result = [
            p for p in result
            if search_lower in p.title.lower()
            or (p.excerpt and search_lower in p.excerpt.lower())
        ]

    return result


@router.get("/tags", response_model=List[str])
async def get_all_tags(db: AsyncSession = Depends(get_db)):
    """
    获取所有唯一标签

    返回已使用过的所有标签，按字母顺序排列
    """
    # 获取所有标签
    result = await db.execute(
        select(PostTag.tag_name).distinct().order_by(PostTag.tag_name)
    )
    tags = [row[0] for row in result]
    return tags


@router.get("/stats/summary")
def get_blog_summary(db: AsyncSession = Depends(get_db)):
    """
    获取博客统计摘要

    返回各状态文章的数量统计
    """
    # 获取所有文章
    all_posts = blog_service.get_all(db, limit=1000)

    # 按状态统计
    status_stats = {}
    for status_type in ["draft", "published", "archived"]:
        status_stats[status_type] = len([p for p in all_posts if p.status == status_type])

    # 获取所有标签
    all_tags = set()
    for post in all_posts:
        all_tags.update(post.tags)

    return {
        "total": len(all_posts),
        "by_status": status_stats,
        "total_tags": len(all_tags)
    }


@router.get("/{post_id}", response_model=BlogPostResponse)
def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    根据 ID 获取特定博客文章

    - **post_id**: 文章 ID
    """
    post = blog_service.get_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"博客文章 (ID: {post_id}) 不存在"
        )
    return post


@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: BlogPostCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    创建新博客文章

    - **title**: 文章标题（必填）
    - **slug**: URL 唯一标识符（必填，全小写字母、数字、连字符）
    - **content**: 文章内容（必填，Markdown 格式）
    - **excerpt**: 文章摘要（可选，自动从内容生成）
    - **cover_image**: 封面图片 URL
    - **seo_title**: SEO 标题
    - **seo_description**: SEO 描述
    - **tags**: 标签列表
    - **status**: 状态（默认: draft）
    - **published_at**: 发布时间（发布时自动设置）
    """
    # 检查 slug 是否已存在
    existing = blog_service.get_all(db, filters={"slug": post.slug}, limit=1)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"文章标识符 '{post.slug}' 已存在"
        )

    # 自动生成摘要（如果未提供）
    excerpt = post.excerpt
    if not excerpt and post.content:
        excerpt = post.content[:200] + "..." if len(post.content) > 200 else post.content

    # 准备文章数据
    post_data = post.model_dump()
    post_data["excerpt"] = excerpt

    # 如果状态是 published 且未设置发布时间，自动设置
    if post.status == "published" and not post_data.get("published_at"):
        post_data["published_at"] = datetime.now()

    # 创建文章
    new_post = blog_service.create(db, post_data)

    # 添加标签
    if post.tags:
        await _update_post_tags(db, new_post.id, post.tags)

    # 刷新文章以获取标签
    await db.refresh(new_post)

    return new_post


@router.put("/{post_id}", response_model=BlogPostResponse)
async def update_post(
    post_id: int,
    post_update: BlogPostUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    更新博客文章信息

    只更新提供的字段，未提供的字段保持不变
    """
    # 检查文章是否存在
    post = blog_service.get_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"博客文章 (ID: {post_id}) 不存在"
        )

    # 如果更新 slug，检查新 slug 是否已被其他文章使用
    if post_update.slug:
        existing = blog_service.get_all(db, filters={"slug": post_update.slug}, limit=1)
        if existing and existing[0].id != post_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"文章标识符 '{post_update.slug}' 已被其他文章使用"
            )

    # 获取更新数据（排除未设置的字段）
    update_data = post_update.model_dump(exclude_unset=True)

    # 处理状态变更为 published 的情况
    if post_update.status == "published" and not post.published_at:
        update_data["published_at"] = datetime.now()

    # 如果提供了 excerpt，使用它；否则如果更新了 content，自动生成 excerpt
    if "excerpt" not in update_data and "content" in update_data and update_data["content"]:
        content = update_data["content"]
        update_data["excerpt"] = content[:200] + "..." if len(content) > 200 else content

    # 更新文章
    updated_post = blog_service.update(db, post_id, update_data)

    # 更新标签（如果提供）
    if post_update.tags is not None:
        await _update_post_tags(db, post_id, post_update.tags)

    # 刷新文章以获取标签
    await db.refresh(updated_post)

    return updated_post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    删除博客文章

    - **post_id**: 要删除的文章 ID
    """
    # 检查文章是否存在
    post = blog_service.get_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"博客文章 (ID: {post_id}) 不存在"
        )

    # 删除关联的标签
    await db.execute(
        select(PostTag).where(PostTag.post_id == post_id)
    )
    existing_tags = (await db.execute(
        select(PostTag).where(PostTag.post_id == post_id)
    )).scalars().all()

    for tag in existing_tags:
        await db.delete(tag)

    # 删除文章
    blog_service.delete(db, post_id)

    await db.commit()
    return None


@router.patch("/{post_id}/status", response_model=BlogPostResponse)
def update_post_status(
    post_id: int,
    new_status: str,
    db: AsyncSession = Depends(get_db)
):
    """
    更新博客文章状态

    - **post_id**: 文章 ID
    - **new_status**: 新状态 (draft, published, archived)
    """
    valid_statuses = ["draft", "published", "archived"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"无效的状态。有效值为: {', '.join(valid_statuses)}"
        )

    # 检查文章是否存在
    post = blog_service.get_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"博客文章 (ID: {post_id}) 不存在"
        )

    # 准备更新数据
    update_data = {"status": new_status}

    # 首次发布时设置发布时间
    if new_status == "published" and not post.published_at:
        update_data["published_at"] = datetime.now()

    # 更新状态
    updated_post = blog_service.update(db, post_id, update_data)
    return updated_post


@router.post("/{post_id}/generate-markdown")
def generate_markdown(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    为已发布的文章生成 Markdown 文件

    返回带有 frontmatter 的完整 Markdown 内容
    """
    # 检查文章是否存在
    post = blog_service.get_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"博客文章 (ID: {post_id}) 不存在"
        )

    # 只允许已发布的文章生成 Markdown
    if post.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只有已发布的文章才能生成 Markdown 文件"
        )

    # 生成 frontmatter
    frontmatter = f"""---
title: {post.title}
slug: {post.slug}
date: {post.published_at.isoformat() if post.published_at else ''}
tags: {', '.join(post.tags)}
cover_image: {post.cover_image or ''}
seo_title: {post.seo_title or post.title}
seo_description: {post.seo_description or post.excerpt or ''}
---

"""

    markdown_content = frontmatter + post.content

    return {
        "filename": f"{post.slug}.md",
        "content": markdown_content,
        "message": f"已为 '{post.title}' 生成 Markdown 文件"
    }
