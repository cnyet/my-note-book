"""API routes for secretary content."""
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List, Optional
import hashlib

from api.database import get_db
from api.repositories.file_repository import FileRepository, FileNotFoundError, FileReadError
from api.utils.markdown_parser import MarkdownParser
from api.schemas.secretary import (
    WorkResponse, WorkTask, ActionResponse, ErrorResponse
)

router = APIRouter(prefix="/api", tags=["secretary"])

# Initialize repositories
file_repo = FileRepository()
parser = MarkdownParser()


def generate_task_id(title: str, date_str: str) -> str:
    """Generate a unique ID for a task."""
    return hashlib.md5(f"{title}{date_str}".encode()).hexdigest()[:8]


@router.get("/dashboard", response_model=dict)
async def get_dashboard(db: Session = Depends(get_db)):
    """
    Get dashboard overview with all secretary statuses.
    """
    today = date.today()
    
    # Check each secretary's status
    agents = {}
    for agent_type in ["news", "work", "outfit", "life", "review"]:
        try:
            content = file_repo.read_content(agent_type, today)
            snippet = parser.get_snippet(content, max_length=100)
            agents[agent_type] = {
                "generated": True,
                "is_today": True,
                "last_date": str(today),
                "snippet": snippet
            }
        except FileNotFoundError:
            # Try to find the most recent date
            try:
                dates = file_repo.list_available_dates(agent_type)
                last_date = max(dates) if dates else None
                agents[agent_type] = {
                    "generated": False,
                    "is_today": False,
                    "last_date": str(last_date) if last_date else None,
                    "snippet": None
                }
            except:
                agents[agent_type] = {
                    "generated": False,
                    "is_today": False,
                    "last_date": None,
                    "snippet": None
                }
    
    # Get work tasks summary
    tasks_summary = {"total": 0, "completed": 0, "pending": 0}
    try:
        content = file_repo.read_content("work", today)
        tasks_data = parser.extract_tasks(content)
        tasks_summary["total"] = len(tasks_data)
        tasks_summary["completed"] = sum(1 for t in tasks_data if t.get("completed", False))
        tasks_summary["pending"] = tasks_summary["total"] - tasks_summary["completed"]
    except:
        pass
    
    return {
        "today_dir": str(today),
        "agents": agents,
        "tasks_summary": tasks_summary,
        "weather_summary": "18°C 多云",
        "health_summary": "良好"
    }


@router.get("/work", response_model=WorkResponse)
async def get_work_plan(
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """
    Get work plan for a specific date (defaults to today).
    
    Returns structured task list with priorities and time estimates.
    """
    if target_date is None:
        target_date = date.today()
    
    try:
        # Read file content
        content = file_repo.read_content("work", target_date)
        
        # Parse tasks from markdown
        tasks_data = parser.extract_tasks(content)
        
        # Convert to WorkTask objects with IDs
        tasks = []
        for task_data in tasks_data:
            task_id = generate_task_id(task_data['title'], str(target_date))
            tasks.append(WorkTask(
                id=task_id,
                title=task_data['title'],
                description=task_data['description'],
                priority=task_data['priority'],
                estimated_time=task_data['estimated_time'],
                completed=task_data['completed']
            ))
        
        # Calculate statistics
        total_time = sum(t.estimated_time or 0 for t in tasks)
        completed_count = sum(1 for t in tasks if t.completed)
        completion_rate = completed_count / len(tasks) if tasks else 0.0
        
        return WorkResponse(
            date=target_date,
            tasks=tasks,
            total_time=total_time,
            completion_rate=completion_rate,
            generated=True
        )
        
    except FileNotFoundError:
        # Return empty response if file doesn't exist
        return WorkResponse(
            date=target_date,
            tasks=[],
            total_time=0,
            completion_rate=0.0,
            generated=False
        )
    except FileReadError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/work/{date_str}", response_model=WorkResponse)
async def get_work_plan_by_date(
    date_str: str,
    db: Session = Depends(get_db)
):
    """
    Get work plan for a specific date (YYYY-MM-DD format).
    """
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    return await get_work_plan(target_date=target_date, db=db)


@router.get("/work/calendar", response_model=List[date])
async def get_work_calendar():
    """
    Get list of dates with available work plans.
    """
    try:
        dates = file_repo.list_available_dates("work")
        return dates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/work/generate", response_model=ActionResponse)
async def generate_work_plan():
    """
    Trigger generation of new work plan.
    
    Note: This endpoint would typically call the AI agent to generate content.
    For now, it returns a placeholder response.
    """
    return ActionResponse(
        success=False,
        message="Work plan generation not yet implemented. Use the CLI to generate content.",
        data={"cli_command": "python main.py --step work"}
    )


# Similar endpoints for other secretaries can be added here
# For now, let's keep the existing simple endpoints

@router.get("/news", response_model=dict)
async def get_news(target_date: Optional[date] = None):
    """Get news briefing."""
    if target_date is None:
        target_date = date.today()
    
    try:
        content = file_repo.read_content("news", target_date)
        snippet = parser.get_snippet(content)
        return {
            "date": target_date,
            "content": content,
            "snippet": snippet,
            "generated": True
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False
        }


@router.get("/outfit", response_model=dict)
async def get_outfit(target_date: Optional[date] = None):
    """Get outfit recommendation."""
    if target_date is None:
        target_date = date.today()
    
    try:
        content = file_repo.read_content("outfit", target_date)
        snippet = parser.get_snippet(content)
        return {
            "date": target_date,
            "content": content,
            "snippet": snippet,
            "generated": True
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False
        }


@router.get("/life", response_model=dict)
async def get_life(target_date: Optional[date] = None):
    """Get life management plan."""
    if target_date is None:
        target_date = date.today()
    
    try:
        content = file_repo.read_content("life", target_date)
        snippet = parser.get_snippet(content)
        return {
            "date": target_date,
            "content": content,
            "snippet": snippet,
            "generated": True
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False
        }


@router.get("/review", response_model=dict)
async def get_review(target_date: Optional[date] = None):
    """Get daily review."""
    if target_date is None:
        target_date = date.today()
    
    try:
        content = file_repo.read_content("review", target_date)
        snippet = parser.get_snippet(content)
        return {
            "date": target_date,
            "content": content,
            "snippet": snippet,
            "generated": True
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False
        }
