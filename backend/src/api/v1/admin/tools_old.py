# backend/src/api/v1/admin/tools.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()


class ToolCategory(str):
    """Tool categories"""
    DEV = "Dev"
    AUTO = "Auto"
    INTEL = "Intel"
    CREATIVE = "Creative"


class ToolBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$")
    category: str = Field(..., description="Category: Dev, Auto, Intel, Creative")
    description: Optional[str] = Field(None, max_length=500)
    icon_url: Optional[str] = None
    link: Optional[str] = None
    status: str = Field(default="active", pattern=r"^(active|inactive)$")
    sort_order: int = Field(default=0)


class ToolCreate(ToolBase):
    pass


class ToolUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=50, pattern=r"^[a-z0-9-]+$")
    category: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)
    icon_url: Optional[str] = None
    link: Optional[str] = None
    status: Optional[str] = Field(None, pattern=r"^(active|inactive)$")
    sort_order: Optional[int] = None


class ToolResponse(ToolBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Mock data
mock_tools = [
    {
        "id": 1,
        "name": "Code Snippet Manager",
        "slug": "code-snippet-manager",
        "category": "Dev",
        "description": "Manage and organize code snippets with syntax highlighting",
        "icon_url": "/icons/snippet.svg",
        "link": "/tools/snippet",
        "status": "active",
        "sort_order": 1,
        "created_at": datetime(2025, 1, 15, 10, 0, 0),
        "updated_at": datetime(2025, 1, 20, 14, 30, 0),
    },
    {
        "id": 2,
        "name": "AI Writing Assistant",
        "slug": "ai-writing-assistant",
        "category": "Creative",
        "description": "AI-powered writing assistant for content creation",
        "icon_url": "/icons/writing.svg",
        "link": "/tools/writing",
        "status": "active",
        "sort_order": 2,
        "created_at": datetime(2025, 1, 16, 9, 0, 0),
        "updated_at": None,
    },
    {
        "id": 3,
        "name": "Auto Task Scheduler",
        "slug": "auto-task-scheduler",
        "category": "Auto",
        "description": "Automate recurring tasks and workflows",
        "icon_url": "/icons/scheduler.svg",
        "link": "/tools/scheduler",
        "status": "inactive",
        "sort_order": 3,
        "created_at": datetime(2025, 1, 17, 11, 0, 0),
        "updated_at": datetime(2025, 1, 25, 16, 0, 0),
    },
    {
        "id": 4,
        "name": "Intelligence Analyzer",
        "slug": "intelligence-analyzer",
        "category": "Intel",
        "description": "Analyze and visualize complex data patterns",
        "icon_url": "/icons/analyzer.svg",
        "link": "/tools/analyzer",
        "status": "active",
        "sort_order": 4,
        "created_at": datetime(2025, 1, 18, 13, 0, 0),
        "updated_at": None,
    },
]


@router.get("", response_model=List[ToolResponse])
def list_tools(
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List all tools with optional filtering"""
    tools = mock_tools.copy()
    
    if category:
        tools = [t for t in tools if t["category"].lower() == category.lower()]
    
    if status:
        tools = [t for t in tools if t["status"] == status]
    
    # Sort by sort_order
    tools.sort(key=lambda x: x["sort_order"])
    
    return tools[skip : skip + limit]


@router.get("/categories")
def get_categories():
    """Get all tool categories"""
    return ["Dev", "Auto", "Intel", "Creative"]


@router.get("/{tool_id}", response_model=ToolResponse)
def get_tool(tool_id: int):
    """Get a specific tool by ID"""
    tool = next((t for t in mock_tools if t["id"] == tool_id), None)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    return tool


@router.post("", response_model=ToolResponse, status_code=status.HTTP_201_CREATED)
def create_tool(tool: ToolCreate):
    """Create a new tool"""
    # Check for duplicate slug
    if any(t["slug"] == tool.slug for t in mock_tools):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tool with slug '{tool.slug}' already exists"
        )
    
    new_id = max(t["id"] for t in mock_tools) + 1 if mock_tools else 1
    
    new_tool = {
        "id": new_id,
        **tool.model_dump(),
        "created_at": datetime.now(),
        "updated_at": None,
    }
    
    mock_tools.append(new_tool)
    return new_tool


@router.put("/{tool_id}", response_model=ToolResponse)
def update_tool(tool_id: int, tool_update: ToolUpdate):
    """Update a tool"""
    tool_index = next((i for i, t in enumerate(mock_tools) if t["id"] == tool_id), None)
    if tool_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    # Check for duplicate slug if updating slug
    if tool_update.slug:
        existing = next((t for t in mock_tools if t["slug"] == tool_update.slug and t["id"] != tool_id), None)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tool with slug '{tool_update.slug}' already exists"
            )
    
    # Update only provided fields
    update_data = tool_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        mock_tools[tool_index][field] = value
    
    mock_tools[tool_index]["updated_at"] = datetime.now()
    
    return mock_tools[tool_index]


@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tool(tool_id: int):
    """Delete a tool"""
    tool_index = next((i for i, t in enumerate(mock_tools) if t["id"] == tool_id), None)
    if tool_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found"
        )
    
    mock_tools.pop(tool_index)
    return None
