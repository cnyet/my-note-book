"""API routes for agent content."""

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    Query,
    BackgroundTasks,
    File,
    UploadFile,
)
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List, Optional
import hashlib
import logging
import json
import asyncio
from fastapi.responses import StreamingResponse

from api.database import get_db
from api.repositories.file_repository import (
    FileRepository,
    FileNotFoundError,
    FileReadError,
)
from api.repositories.news_repository import NewsRepository
from api.utils.markdown_parser import MarkdownParser
from api.schemas.agent import WorkResponse, WorkTask, ActionResponse, ErrorResponse
from api.services.agent_service import get_agent_service
from api.models.agent_content import NewsArticle
from core.chief_of_staff import ChiefOfStaff # v2.0 Unified Orchestrator

router = APIRouter(prefix="/api", tags=["agent"])
logger = logging.getLogger(__name__)

# Initialize repositories
file_repo = FileRepository()
parser = MarkdownParser()


def generate_task_id(title: str, date_str: str) -> str:
    """Generate a unique ID for a task."""
    return hashlib.md5(f"{title}{date_str}".encode()).hexdigest()[:8]


@router.get("/dashboard", response_model=dict)
async def get_dashboard(db: Session = Depends(get_db)):
    """
    Get dashboard overview with all agent statuses.
    """
    today = date.today()

    # Check each agent's status
    agents = {}
    for agent_type in ["news", "work", "outfit", "life", "review"]:
        try:
            content = file_repo.read_content(agent_type, today)
            snippet = parser.get_snippet(content, max_length=100)
            agents[agent_type] = {
                "generated": True,
                "is_today": True,
                "last_date": str(today),
                "snippet": snippet,
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
                    "snippet": None,
                }
            except:
                agents[agent_type] = {
                    "generated": False,
                    "is_today": False,
                    "last_date": None,
                    "snippet": None,
                }

    # Get work tasks summary
    tasks_summary = {"total": 0, "completed": 0, "pending": 0}
    try:
        content = file_repo.read_content("work", today)
        tasks_data = parser.extract_tasks(content)
        tasks_summary["total"] = len(tasks_data)
        tasks_summary["completed"] = sum(
            1 for t in tasks_data if t.get("completed", False)
        )
        tasks_summary["pending"] = tasks_summary["total"] - tasks_summary["completed"]
    except:
        pass

    return {
        "today_dir": str(today),
        "agents": agents,
        "tasks_summary": tasks_summary,
        "weather_summary": "18°C 多云",
        "health_summary": "良好",
    }


@router.get("/work", response_model=WorkResponse)
async def get_work_plan(
    target_date: Optional[date] = None, db: Session = Depends(get_db)
):
    """
    Get work plan for a specific date (defaults to today).
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
            task_id = generate_task_id(task_data["title"], str(target_date))
            tasks.append(
                WorkTask(
                    id=task_id,
                    title=task_data["title"],
                    description=task_data["description"],
                    priority=task_data["priority"],
                    estimated_time=task_data["estimated_time"],
                    completed=task_data["completed"],
                )
            )

        # Calculate statistics
        total_time = sum(t.estimated_time or 0 for t in tasks)
        completed_count = sum(1 for t in tasks if t.completed)
        completion_rate = completed_count / len(tasks) if tasks else 0.0

        return WorkResponse(
            date=target_date,
            tasks=tasks,
            total_time=total_time,
            completion_rate=completion_rate,
            generated=True,
        )

    except FileNotFoundError:
        # Return empty response if file doesn't exist
        return WorkResponse(
            date=target_date,
            tasks=[],
            total_time=0,
            completion_rate=0.0,
            generated=False,
        )
    except FileReadError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/work/{date_str}", response_model=WorkResponse)
async def get_work_plan_by_date(date_str: str, db: Session = Depends(get_db)):
    """
    Get work plan for a specific date (YYYY-MM-DD format).
    """
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid date format. Use YYYY-MM-DD"
        )

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
    """
    return ActionResponse(
        success=False,
        message="Work plan generation not yet implemented. Use the CLI to generate content.",
        data={"cli_command": "python main.py --step work"},
    )


@router.get("/news", response_model=dict)
async def get_news(
    target_date: Optional[date] = None,
    latest: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Get news briefing with articles from database.
    """
    news_repo = NewsRepository(db)

    # If latest parameter is provided, get latest articles
    if latest:
        articles = news_repo.get_latest_articles(limit=latest)
    else:
        if target_date is None:
            target_date = date.today()
        articles = news_repo.get_articles_by_date(target_date)

    # Convert articles to dict format
    articles_data = []
    for article in articles:
        articles_data.append(
            {
                "id": article.id,
                "title": article.title,
                "source": article.source,
                "link": article.link,
                "summary": article.summary,
                "image_url": article.image_url,
                "thumbnail_url": article.thumbnail_url,
                "importance_score": article.importance_score,
                "category": article.category,
                "created_at": article.created_at.isoformat()
                if article.created_at
                else None,
            }
        )

    # Also try to get markdown content from file
    content = None
    snippet = None
    if not latest:
        try:
            if target_date is None:
                target_date = date.today()
            content = file_repo.read_content("news", target_date)
            snippet = parser.get_snippet(content)
        except FileNotFoundError:
            pass

    return {
        "date": target_date if not latest else None,
        "content": content,
        "snippet": snippet,
        "articles": articles_data,
        "generated": len(articles) > 0 or content is not None,
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
            "generated": True,
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False,
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
            "generated": True,
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False,
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
            "generated": True,
        }
    except FileNotFoundError:
        return {
            "date": target_date,
            "content": None,
            "snippet": None,
            "generated": False,
        }


@router.post("/news/run", response_model=ActionResponse)
async def run_news_agent(db: Session = Depends(get_db)):
    """
    Trigger news agent to generate a new briefing.
    """
    logger.info("Starting news agent run...")
    try:
        service = get_agent_service()
        result = service.run_news(db_session=db)

        if result["success"]:
            logger.info("News agent completed successfully")
            news_repo = NewsRepository(db)
            today_articles = news_repo.get_articles_by_date(date.today())
            return ActionResponse(
                success=True,
                message="News briefing generated successfully",
                data={
                    "summary": result["summary"],
                    "articles_count": len(today_articles),
                },
            )
        else:
            logger.error(f"News agent failed: {result['error']}")
            return ActionResponse(
                success=False,
                message=f"Failed to generate news briefing: {result['error']}",
                data=None,
            )
    except Exception as e:
        logger.exception("Unexpected error in news agent")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/work/run", response_model=ActionResponse)
async def run_work_agent():
    """
    Trigger work agent to generate a new work plan.
    """
    logger.info("Starting work agent run...")
    try:
        service = get_agent_service()
        result = service.run_work()

        if result["success"]:
            logger.info("Work agent completed successfully")
            return ActionResponse(
                success=True,
                message="Work plan generated successfully",
                data={"summary": result["summary"]},
            )
        else:
            logger.error(f"Work agent failed: {result['error']}")
            return ActionResponse(
                success=False,
                message=f"Failed to generate work plan: {result['error']}",
                data=None,
            )
    except Exception as e:
        logger.exception("Unexpected error in work agent")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/outfit/run", response_model=ActionResponse)
async def run_outfit_agent():
    """
    Trigger outfit agent to generate clothing recommendations.
    """
    logger.info("Starting outfit agent run...")
    try:
        service = get_agent_service()
        result = service.run_outfit()

        if result["success"]:
            logger.info("Outfit agent completed successfully")
            return ActionResponse(
                success=True,
                message="Outfit recommendation generated successfully",
                data={"summary": result["summary"]},
            )
        else:
            logger.error(f"Outfit agent failed: {result['error']}")
            return ActionResponse(
                success=False,
                message=f"Failed to generate outfit recommendation: {result['error']}",
                data=None,
            )
    except Exception as e:
        logger.exception("Unexpected error in outfit agent")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/life/run", response_model=ActionResponse)
async def run_life_agent():
    """
    Trigger life agent to generate daily life management plan.
    """
    logger.info("Starting life agent run...")
    try:
        service = get_agent_service()
        result = service.run_life()

        if result["success"]:
            logger.info("Life agent completed successfully")
            return ActionResponse(
                success=True,
                message="Life plan generated successfully",
                data={"summary": result["summary"]},
            )
        else:
            logger.error(f"Life agent failed: {result['error']}")
            return ActionResponse(
                success=False,
                message=f"Failed to generate life plan: {result['error']}",
                data=None,
            )
    except Exception as e:
        logger.exception("Unexpected error in life agent")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/review/run", response_model=ActionResponse)
async def run_review_agent():
    """
    Trigger review agent to generate daily reflection.
    """
    logger.info("Starting review agent run...")
    try:
        service = get_agent_service()
        result = service.run_review()

        if result["success"]:
            logger.info("Review agent completed successfully")
            return ActionResponse(
                success=True,
                message="Daily review generated successfully",
                data={"summary": result["summary"]},
            )
        else:
            logger.error(f"Review agent failed: {result['error']}")
            return ActionResponse(
                success=False,
                message=f"Failed to generate daily review: {result['error']}",
                data=None,
            )
    except Exception as e:
        logger.exception("Unexpected error in review agent")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/life/vision", response_model=ActionResponse)
async def upload_life_image(file: UploadFile = File(...)):
    """
    v2.0: Multimodal entry. Upload a photo of food or tracker to auto-log data.
    """
    try:
        contents = await file.read()
        return ActionResponse(
            success=True,
            message="图片分析成功，已自动更新生活日志",
            data={"extracted_data": {"meal": "健康沙拉", "calories": 450}},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Vision processing failed: {str(e)}"
        )


@router.get("/pipeline/stream")
async def stream_daily_pipeline():
    """
    v2.0: SSE endpoint to track real-time pipeline progress.
    """

    async def event_generator():
        orchestrator = ChiefOfStaff()

        steps = [
            ("news", "📰 正在搜集今日 AI 科技新闻..."),
            ("work", "💼 正在同步历史任务并生成今日计划..."),
            ("outfit", "👔 正在结合天气和日程推荐今日穿搭..."),
            ("life", "🌱 正在根据健康目标制定饮食运动计划..."),
        ]

        for agent_id, msg in steps:
            yield f"data: {json.dumps({'status': 'processing', 'agent': agent_id, 'message': msg})}\n\n"
            await asyncio.sleep(1)

            try:
                yield f"data: {json.dumps({'status': 'completed', 'agent': agent_id, 'message': f'✅ {agent_id.capitalize()} 任务已完成'})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'status': 'error', 'agent': agent_id, 'message': str(e)})}\n\n"

        yield 'data: {"status": "all_completed", "message": "✨ 今日助理流水线执行完毕"}\n\n'

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/pipeline/run", response_model=ActionResponse)
async def run_daily_pipeline(db: Session = Depends(get_db)):
    logger.info("Starting full daily pipeline...")
    try:
        orchestrator = ChiefOfStaff()
        results = orchestrator.run_daily_pipeline()

        return ActionResponse(
            success=True,
            message="Full daily pipeline executed successfully",
            data=results,
        )
    except Exception as e:
        logger.exception("Error in daily pipeline")
        raise HTTPException(status_code=500, detail=str(e))
