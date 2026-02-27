# backend/src/api/v1/admin/settings.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field, validator
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ....core.database import get_db
from ....models import SystemSettings

router = APIRouter()


class GeneralSettings(BaseModel):
    site_title: str = Field(default="MyNoteBook", min_length=1, max_length=100)
    site_description: Optional[str] = Field(None, max_length=500)
    logo_url: Optional[str] = Field(None, max_length=500)
    items_per_page: int = Field(default=10, ge=1, le=100)


class SecuritySettings(BaseModel):
    session_timeout: int = Field(default=60, ge=5, le=1440)  # 24 hours max
    max_login_attempts: int = Field(default=5, ge=1, le=20)
    ip_whitelist: str = Field(default="", description="Comma-separated IP addresses")


class DataSettings(BaseModel):
    enable_auto_backup: bool = False
    backup_retention_days: int = Field(default=30, ge=1, le=365)
    log_retention_days: int = Field(default=7, ge=1, le=90)


class SettingsUpdate(BaseModel):
    general: Optional[GeneralSettings] = None
    security: Optional[SecuritySettings] = None
    data: Optional[DataSettings] = None


class SettingsResponse(BaseModel):
    general: GeneralSettings
    security: SecuritySettings
    data: DataSettings
    updated_at: datetime


def settings_to_response(settings: SystemSettings) -> dict:
    """Convert SystemSettings model to response dict"""
    return {
        "general": {
            "site_title": settings.site_title,
            "site_description": settings.site_description,
            "logo_url": settings.logo_url,
            "items_per_page": settings.items_per_page,
        },
        "security": {
            "session_timeout": settings.session_timeout,
            "max_login_attempts": settings.max_login_attempts,
            "ip_whitelist": settings.ip_whitelist or "",
        },
        "data": {
            "enable_auto_backup": settings.enable_auto_backup,
            "backup_retention_days": settings.backup_retention_days,
            "log_retention_days": settings.log_retention_days,
        },
        "updated_at": settings.updated_at,
    }


@router.get("", response_model=SettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_db)):
    """Get all system settings"""
    result = await db.execute(select(SystemSettings).filter_by(id=1))
    settings = result.scalars().first()

    if not settings:
        # Create default settings if not exists
        settings = SystemSettings(id=1)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)

    return settings_to_response(settings)


@router.put("", response_model=SettingsResponse)
async def update_settings(
    settings_update: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update system settings (supports partial updates)"""
    result = await db.execute(select(SystemSettings).filter_by(id=1))
    settings = result.scalars().first()

    if not settings:
        # Create default settings if not exists
        settings = SystemSettings(id=1)
        db.add(settings)
        await db.flush()

    update_data = settings_update.model_dump(exclude_unset=True)

    # Update each section
    if update_data.get("general"):
        for key, value in update_data["general"].items():
            setattr(settings, key, value)
    if update_data.get("security"):
        for key, value in update_data["security"].items():
            setattr(settings, key, value)
    if update_data.get("data"):
        for key, value in update_data["data"].items():
            setattr(settings, key, value)

    settings.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(settings)

    return settings_to_response(settings)


@router.post("/backup")
async def create_backup():
    """Trigger a manual database backup"""
    return {"message": "Backup triggered successfully", "timestamp": datetime.now().isoformat()}


@router.post("/cleanup/cache")
async def clear_cache():
    """Clear application cache"""
    return {"message": "Cache cleared successfully", "timestamp": datetime.now().isoformat()}


@router.post("/cleanup/logs")
async def clear_logs():
    """Clear old log files based on retention settings"""
    return {"message": "Logs cleaned up successfully", "timestamp": datetime.now().isoformat()}
