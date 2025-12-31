"""Pydantic schemas for secretary API responses."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import date, datetime


# Common schemas
class SecretaryResponse(BaseModel):
    """Base response for secretary content."""
    date: date
    content: str
    generated: bool
    snippet: Optional[str] = None


# News schemas
class NewsArticle(BaseModel):
    """Individual news article."""
    id: str
    title: str
    summary: str
    source: Literal['techcrunch', 'mit', 'verge', 'other']
    importance: int = Field(ge=1, le=5)
    url: Optional[str] = None
    published_at: Optional[datetime] = None
    read: bool = False
    saved: bool = False


class NewsResponse(BaseModel):
    """Response for news endpoint."""
    date: date
    articles: List[NewsArticle]
    total_count: int
    generated: bool


# Work schemas
class WorkTask(BaseModel):
    """Individual work task."""
    id: str
    title: str
    description: str
    priority: Literal['high', 'medium', 'low']
    estimated_time: Optional[int] = None  # minutes
    completed: bool = False
    time_block: Optional[str] = None


class WorkResponse(BaseModel):
    """Response for work endpoint."""
    date: date
    tasks: List[WorkTask]
    total_time: int  # total estimated minutes
    completion_rate: float  # 0.0 to 1.0
    generated: bool


# Outfit schemas
class OutfitItem(BaseModel):
    """Outfit recommendation item."""
    category: Literal['tops', 'bottoms', 'shoes', 'accessories']
    items: List[str]
    reason: Optional[str] = None


class WeatherData(BaseModel):
    """Weather information."""
    temperature: float
    condition: str
    humidity: int
    wind_speed: float
    feels_like: float
    location: str


class OutfitResponse(BaseModel):
    """Response for outfit endpoint."""
    date: date
    weather: WeatherData
    outfit: List[OutfitItem]
    plan_b: Optional[List[OutfitItem]] = None
    worn: bool = False
    generated: bool


# Life schemas
class MealPlan(BaseModel):
    """Meal plan for a time period."""
    time: str
    items: List[str]
    notes: Optional[str] = None


class ExerciseActivity(BaseModel):
    """Exercise activity."""
    name: str
    duration: int  # minutes
    time: Optional[str] = None


class ChecklistItem(BaseModel):
    """Health checklist item."""
    id: str
    text: str
    completed: bool = False


class LifeResponse(BaseModel):
    """Response for life endpoint."""
    date: date
    meals: List[MealPlan]
    exercise: List[ExerciseActivity]
    sleep_schedule: Dict[str, str]
    hydration_goal: int  # ml
    checklist: List[ChecklistItem]
    health_score: Optional[int] = None
    generated: bool


# Review schemas
class ReviewReflection(BaseModel):
    """Daily reflection."""
    id: str
    date: date
    prompts: List[str]
    responses: List[str]
    mood: Literal['great', 'good', 'okay', 'bad']
    tags: List[str]
    highlights: List[str]


class ReviewResponse(BaseModel):
    """Response for review endpoint."""
    date: date
    reflection: ReviewReflection
    generated: bool


# History and calendar schemas
class CalendarEntry(BaseModel):
    """Calendar entry showing content availability."""
    date: date
    has_content: bool
    preview: Optional[str] = None


class CalendarResponse(BaseModel):
    """Response for calendar endpoint."""
    secretary_type: str
    entries: List[CalendarEntry]


# Search schemas
class SearchResult(BaseModel):
    """Individual search result."""
    secretary_type: str
    date: date
    title: str
    snippet: str
    relevance: float


class SearchResponse(BaseModel):
    """Response for search endpoint."""
    query: str
    results: List[SearchResult]
    total_count: int
    page: int
    per_page: int


# Action responses
class ActionResponse(BaseModel):
    """Generic action response."""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None


# Error response
class ErrorResponse(BaseModel):
    """Error response."""
    error: str
    detail: Optional[str] = None
    status_code: int
