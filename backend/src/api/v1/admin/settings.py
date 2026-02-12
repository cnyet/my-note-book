# backend/src/api/v1/admin/settings.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, validator
from datetime import datetime

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


# Mock settings
mock_settings = {
    "general": {
        "site_title": "MyNoteBook",
        "site_description": "Your intelligent workspace for notes, AI agents, and creative tools",
        "logo_url": "/images/logo.png",
        "items_per_page": 10,
    },
    "security": {
        "session_timeout": 30,  # 30 minutes
        "max_login_attempts": 5,
        "ip_whitelist": "127.0.0.1,192.168.1.100",
    },
    "data": {
        "enable_auto_backup": True,
        "backup_retention_days": 30,
        "log_retention_days": 7,
    },
    "updated_at": datetime(2025, 2, 1, 12, 0, 0),
}


@router.get("", response_model=SettingsResponse)
def get_settings():
    """Get all system settings"""
    return mock_settings


@router.put("", response_model=SettingsResponse)
def update_settings(settings_update: SettingsUpdate):
    """Update system settings (supports partial updates)"""
    update_data = settings_update.model_dump(exclude_unset=True)
    
    # Update each section
    if update_data.get("general"):
        mock_settings["general"].update(update_data["general"])
    if update_data.get("security"):
        mock_settings["security"].update(update_data["security"])
    if update_data.get("data"):
        mock_settings["data"].update(update_data["data"])
    
    mock_settings["updated_at"] = datetime.now()
    
    return mock_settings


@router.post("/backup")
def create_backup():
    """Trigger a manual database backup"""
    return {"message": "Backup triggered successfully", "timestamp": datetime.now().isoformat()}


@router.post("/cleanup/cache")
def clear_cache():
    """Clear application cache"""
    return {"message": "Cache cleared successfully", "timestamp": datetime.now().isoformat()}


@router.post("/cleanup/logs")
def clear_logs():
    """Clear old log files based on retention settings"""
    return {"message": "Logs cleaned up successfully", "timestamp": datetime.now().isoformat()}
