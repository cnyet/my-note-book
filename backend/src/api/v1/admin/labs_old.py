# backend/src/api/v1/admin/labs.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()


class LabStatus(str):
    """Lab status types"""
    EXPERIMENTAL = "Experimental"
    PREVIEW = "Preview"
    ARCHIVED = "Archived"


class LabBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$")
    status: str = Field(default="Experimental", pattern=r"^(Experimental|Preview|Archived)$")
    description: Optional[str] = Field(None, max_length=1000)
    demo_url: Optional[str] = None
    media_urls: List[str] = Field(default_factory=list)
    online_count: int = Field(default=0, ge=0)


class LabCreate(LabBase):
    pass


class LabUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$")
    status: Optional[str] = Field(None, pattern=r"^(Experimental|Preview|Archived)$")
    description: Optional[str] = Field(None, max_length=1000)
    demo_url: Optional[str] = None
    media_urls: Optional[List[str]] = None
    online_count: Optional[int] = Field(None, ge=0)


class LabResponse(LabBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Mock data
mock_labs = [
    {
        "id": 1,
        "name": "AI Chat Playground",
        "slug": "ai-chat-playground",
        "status": "Preview",
        "description": "Interactive playground for testing different AI models with real-time conversation",
        "demo_url": "https://demo.example.com/ai-chat",
        "media_urls": ["/images/labs/ai-chat-1.jpg", "/images/labs/ai-chat-2.jpg"],
        "online_count": 42,
        "created_at": datetime(2025, 1, 10, 9, 0, 0),
        "updated_at": datetime(2025, 2, 1, 15, 30, 0),
    },
    {
        "id": 2,
        "name": "Code Generation Lab",
        "slug": "code-generation-lab",
        "status": "Experimental",
        "description": "Experiment with AI-powered code generation and refactoring tools",
        "demo_url": "https://demo.example.com/code-gen",
        "media_urls": ["/images/labs/code-gen.jpg"],
        "online_count": 18,
        "created_at": datetime(2025, 1, 15, 14, 0, 0),
        "updated_at": None,
    },
    {
        "id": 3,
        "name": "Data Visualization Studio",
        "slug": "data-viz-studio",
        "status": "Archived",
        "description": "Create interactive charts and visualizations from your data",
        "demo_url": None,
        "media_urls": [],
        "online_count": 0,
        "created_at": datetime(2024, 12, 1, 10, 0, 0),
        "updated_at": datetime(2025, 1, 20, 12, 0, 0),
    },
    {
        "id": 4,
        "name": "Multi-Agent Orchestrator",
        "slug": "multi-agent-orchestrator",
        "status": "Experimental",
        "description": "Coordinate multiple AI agents working together on complex tasks",
        "demo_url": "https://demo.example.com/agents",
        "media_urls": ["/images/labs/agents-1.jpg", "/images/labs/agents-2.jpg", "/images/labs/agents-3.jpg"],
        "online_count": 7,
        "created_at": datetime(2025, 2, 1, 8, 0, 0),
        "updated_at": None,
    },
]


@router.get("", response_model=List[LabResponse])
def list_labs(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List all labs with optional filtering"""
    labs = mock_labs.copy()
    
    if status:
        labs = [l for l in labs if l["status"] == status]
    
    # Sort by created_at desc
    labs.sort(key=lambda x: x["created_at"], reverse=True)
    
    return labs[skip : skip + limit]


@router.get("/statuses")
def get_statuses():
    """Get all lab statuses"""
    return ["Experimental", "Preview", "Archived"]


@router.get("/{lab_id}", response_model=LabResponse)
def get_lab(lab_id: int):
    """Get a specific lab by ID"""
    lab = next((l for l in mock_labs if l["id"] == lab_id), None)
    if not lab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lab not found"
        )
    return lab


@router.post("", response_model=LabResponse, status_code=status.HTTP_201_CREATED)
def create_lab(lab: LabCreate):
    """Create a new lab"""
    # Check for duplicate slug
    if any(l["slug"] == lab.slug for l in mock_labs):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Lab with slug '{lab.slug}' already exists"
        )
    
    new_id = max(l["id"] for l in mock_labs) + 1 if mock_labs else 1
    
    new_lab = {
        "id": new_id,
        **lab.model_dump(),
        "created_at": datetime.now(),
        "updated_at": None,
    }
    
    mock_labs.append(new_lab)
    return new_lab


@router.put("/{lab_id}", response_model=LabResponse)
def update_lab(lab_id: int, lab_update: LabUpdate):
    """Update a lab"""
    lab_index = next((i for i, l in enumerate(mock_labs) if l["id"] == lab_id), None)
    if lab_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lab not found"
        )
    
    # Check for duplicate slug if updating slug
    if lab_update.slug:
        existing = next((l for l in mock_labs if l["slug"] == lab_update.slug and l["id"] != lab_id), None)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lab with slug '{lab_update.slug}' already exists"
            )
    
    # Update only provided fields
    update_data = lab_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        mock_labs[lab_index][field] = value
    
    mock_labs[lab_index]["updated_at"] = datetime.now()
    
    return mock_labs[lab_index]


@router.delete("/{lab_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lab(lab_id: int):
    """Delete a lab"""
    lab_index = next((i for i, l in enumerate(mock_labs) if l["id"] == lab_id), None)
    if lab_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lab not found"
        )
    
    mock_labs.pop(lab_index)
    return None


@router.post("/{lab_id}/status", response_model=LabResponse)
def update_lab_status(lab_id: int, status: str):
    """Update lab status (convenience endpoint)"""
    if status not in ["Experimental", "Preview", "Archived"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    lab_index = next((i for i, l in enumerate(mock_labs) if l["id"] == lab_id), None)
    if lab_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lab not found"
        )
    
    mock_labs[lab_index]["status"] = status
    mock_labs[lab_index]["updated_at"] = datetime.now()
    
    return mock_labs[lab_index]
