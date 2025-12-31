# Design Document - Secretary Pages Enhancement

## Overview

This design outlines the architecture for enhancing all 5 AI Secretary pages with rich content display, improved interactions, and real data integration. The solution involves frontend component redesign, backend API development, file system integration, and database queries.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ News Page    │  │ Work Page    │  │ Outfit Page  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Life Page    │  │ Review Page  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes Layer                         │  │
│  │  /api/news  /api/work  /api/outfit  /api/life       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Service Layer                              │  │
│  │  NewsService  WorkService  OutfitService             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Data Access Layer                            │  │
│  │  FileRepository  DatabaseRepository                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │  File System     │    │   Database       │
    │  data/daily_logs/│    │   SQLite/Postgres│
    └──────────────────┘    └──────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Markdown for content rendering
- Date-fns for date manipulation
- Framer Motion for animations

**Backend:**
- FastAPI for API endpoints
- Pydantic for data validation
- SQLAlchemy for database ORM
- Python pathlib for file operations
- Markdown parser for content processing

## Components and Interfaces

### Frontend Components

#### 1. Base Secretary Page Layout

```typescript
interface SecretaryPageProps {
  secretaryType: 'news' | 'work' | 'outfit' | 'life' | 'review';
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // Theme color (blue, orange, purple, green, indigo)
}

// Shared layout component
<SecretaryPageLayout {...props}>
  <ContentArea />
  <Sidebar />
  <ActionBar />
</SecretaryPageLayout>
```

#### 2. Content Display Components

**NewsContentCard**
```typescript
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: 'techcrunch' | 'mit' | 'verge';
  importance: 1 | 2 | 3 | 4 | 5;
  url: string;
  publishedAt: Date;
  read: boolean;
  saved: boolean;
}

<NewsContentCard 
  articles={articles}
  onRead={handleRead}
  onSave={handleSave}
  onFilter={handleFilter}
/>
```

**WorkTaskList**
```typescript
interface WorkTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
  completed: boolean;
  timeBlock?: string; // e.g., "09:00-10:00"
}

<WorkTaskList
  tasks={tasks}
  onToggle={handleToggle}
  onReorder={handleReorder}
  onAdd={handleAdd}
/>
```

**OutfitRecommendation**
```typescript
interface OutfitItem {
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories';
  items: string[];
  reason: string;
}

interface WeatherContext {
  temperature: number;
  condition: string;
  humidity: number;
  forecast: string;
}

<OutfitRecommendation
  outfit={outfit}
  weather={weather}
  planB={alternativeOutfit}
/>
```

**LifeHealthDashboard**
```typescript
interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

interface ExercisePlan {
  activities: Array<{
    name: string;
    duration: number;
    time: string;
  }>;
}

<LifeHealthDashboard
  meals={meals}
  exercise={exercise}
  sleep={sleepSchedule}
  hydration={hydrationGoal}
/>
```

**ReviewReflection**
```typescript
interface Reflection {
  id: string;
  date: Date;
  prompts: string[];
  responses: string[];
  mood: 'great' | 'good' | 'okay' | 'bad';
  tags: string[];
  highlights: string[];
}

<ReviewReflection
  reflection={reflection}
  onSave={handleSave}
  onTag={handleTag}
/>
```

#### 3. History and Navigation Components

**HistoryCalendar**
```typescript
interface CalendarEntry {
  date: Date;
  hasContent: boolean;
  preview?: string;
}

<HistoryCalendar
  entries={entries}
  selectedDate={selectedDate}
  onDateSelect={handleDateSelect}
/>
```

**DateNavigator**
```typescript
<DateNavigator
  currentDate={currentDate}
  onPrevious={handlePrevious}
  onNext={handleNext}
  onToday={handleToday}
/>
```

#### 4. Interactive Components

**SearchBar**
```typescript
<SearchBar
  placeholder="Search across all secretaries..."
  onSearch={handleSearch}
  filters={['date', 'type', 'importance']}
/>
```

**ActionMenu**
```typescript
<ActionMenu
  actions={[
    { label: 'Export PDF', icon: Download, onClick: handleExport },
    { label: 'Share', icon: Share, onClick: handleShare },
    { label: 'Edit', icon: Edit, onClick: handleEdit },
    { label: 'Print', icon: Printer, onClick: handlePrint }
  ]}
/>
```

### Backend API Endpoints

#### News Endpoints

```python
GET  /api/news                    # Get today's news
GET  /api/news/{date}             # Get news for specific date
POST /api/news/generate           # Generate new news briefing
PUT  /api/news/{article_id}/read  # Mark article as read
PUT  /api/news/{article_id}/save  # Save article for later
GET  /api/news/search?q={query}   # Search news articles
```

#### Work Endpoints

```python
GET    /api/work                  # Get today's work plan
GET    /api/work/{date}           # Get work plan for specific date
POST   /api/work/generate         # Generate new work plan
POST   /api/work/tasks            # Add new task
PUT    /api/work/tasks/{id}       # Update task
DELETE /api/work/tasks/{id}       # Delete task
PUT    /api/work/tasks/{id}/complete  # Toggle task completion
```

#### Outfit Endpoints

```python
GET  /api/outfit                  # Get today's outfit recommendation
GET  /api/outfit/{date}           # Get outfit for specific date
POST /api/outfit/generate         # Generate new outfit recommendation
GET  /api/outfit/weather          # Get current weather data
PUT  /api/outfit/{id}/worn        # Mark outfit as worn
```

#### Life Endpoints

```python
GET  /api/life                    # Get today's life plan
GET  /api/life/{date}             # Get life plan for specific date
POST /api/life/generate           # Generate new life plan
PUT  /api/life/checklist/{id}     # Update checklist item
GET  /api/life/health-score       # Get health score
```

#### Review Endpoints

```python
GET    /api/review                # Get today's review
GET    /api/review/{date}         # Get review for specific date
POST   /api/review                # Create new review
PUT    /api/review/{id}           # Update review
GET    /api/review/timeline       # Get review timeline
POST   /api/review/{id}/tags      # Add tags to review
```

#### Common Endpoints

```python
GET  /api/history/{secretary}/{date}  # Get historical content
GET  /api/search?q={query}&type={type}&from={date}&to={date}  # Global search
GET  /api/calendar/{secretary}        # Get calendar with available dates
POST /api/export/{secretary}/{date}   # Export content as PDF/MD
```

## Data Models

### File-Based Data Structure

```
data/daily_logs/
└── YYYY-MM-DD/
    ├── 新闻简报.md      # News briefing
    ├── 今日工作.md      # Work plan
    ├── 今日穿搭.md      # Outfit recommendation
    ├── 今日生活.md      # Life management
    └── 今日复盘.md      # Daily review
```

### Database Schema

```sql
-- User preferences and interactions
CREATE TABLE user_actions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    secretary_type VARCHAR(20),
    action_type VARCHAR(50),  -- 'read', 'save', 'favorite', 'complete'
    content_id VARCHAR(100),
    content_date DATE,
    created_at TIMESTAMP
);

-- Search index for fast lookups
CREATE TABLE content_index (
    id INTEGER PRIMARY KEY,
    secretary_type VARCHAR(20),
    content_date DATE,
    content_text TEXT,
    keywords TEXT,
    created_at TIMESTAMP
);

-- Health tracking
CREATE TABLE health_metrics (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    date DATE,
    steps INTEGER,
    sleep_hours FLOAT,
    water_intake INTEGER,
    exercise_minutes INTEGER,
    health_score INTEGER,
    created_at TIMESTAMP
);
```

### Pydantic Models

```python
from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional, Literal

class NewsArticle(BaseModel):
    id: str
    title: str
    summary: str
    source: Literal['techcrunch', 'mit', 'verge']
    importance: Literal[1, 2, 3, 4, 5]
    url: str
    published_at: datetime
    read: bool = False
    saved: bool = False

class WorkTask(BaseModel):
    id: str
    title: str
    description: str
    priority: Literal['high', 'medium', 'low']
    estimated_time: int  # minutes
    completed: bool = False
    time_block: Optional[str] = None

class OutfitRecommendation(BaseModel):
    date: date
    weather: dict
    tops: List[str]
    bottoms: List[str]
    shoes: List[str]
    accessories: List[str]
    plan_b: Optional[dict] = None
    worn: bool = False

class LifePlan(BaseModel):
    date: date
    meals: dict
    exercise: dict
    sleep_schedule: dict
    hydration_goal: int
    checklist: List[dict]

class Review(BaseModel):
    id: str
    date: date
    prompts: List[str]
    responses: List[str]
    mood: Literal['great', 'good', 'okay', 'bad']
    tags: List[str]
    highlights: List[str]
```

## Data Flow

### Content Loading Flow

```
1. User navigates to secretary page
   ↓
2. Frontend calls GET /api/{secretary}
   ↓
3. Backend checks for today's file in data/daily_logs/
   ↓
4. If file exists:
   - Parse markdown content
   - Enrich with database data (read status, favorites)
   - Return structured JSON
   ↓
5. If file doesn't exist:
   - Return empty state with generation prompt
   ↓
6. Frontend renders content with appropriate components
```

### Content Generation Flow

```
1. User clicks "Generate" button
   ↓
2. Frontend calls POST /api/{secretary}/generate
   ↓
3. Backend triggers AI secretary agent
   ↓
4. Agent generates content and saves to file
   ↓
5. Backend parses new file and returns content
   ↓
6. Frontend updates UI with new content
```

### Historical Content Flow

```
1. User clicks "History" or selects date
   ↓
2. Frontend calls GET /api/{secretary}/{date}
   ↓
3. Backend reads file from data/daily_logs/{date}/
   ↓
4. Parse and return content
   ↓
5. Frontend displays with date indicator
```

## Error Handling

### File System Errors

```python
class FileNotFoundError:
    status_code = 404
    message = "No content found for this date"
    action = "Generate new content or select another date"

class FileReadError:
    status_code = 500
    message = "Failed to read content file"
    action = "Retry or contact support"
```

### API Errors

```python
class ValidationError:
    status_code = 422
    message = "Invalid request data"
    details = {...}  # Field-specific errors

class RateLimitError:
    status_code = 429
    message = "Too many requests"
    retry_after = 60  # seconds
```

### Frontend Error Handling

```typescript
try {
  const data = await api.news.get();
  setContent(data);
} catch (error) {
  if (error.status === 404) {
    setEmptyState(true);
  } else if (error.status === 500) {
    setError("Failed to load content. Please try again.");
  } else {
    setError("An unexpected error occurred.");
  }
}
```

## Testing Strategy

### Unit Tests
- Test file parsing functions
- Test API endpoint handlers
- Test Pydantic model validation
- Test React component rendering

### Integration Tests
- Test file system operations
- Test database queries
- Test API request/response flow
- Test authentication and authorization

### End-to-End Tests
- Test complete user workflows
- Test content generation and display
- Test historical navigation
- Test search and filter functionality

### Property-Based Tests
- Test markdown parsing with various formats
- Test date handling across timezones
- Test search with different query patterns

## Performance Considerations

### Caching Strategy

```python
# Cache frequently accessed content
@cache(ttl=300)  # 5 minutes
async def get_today_content(secretary_type: str):
    return await read_daily_log(secretary_type, date.today())

# Cache calendar data
@cache(ttl=3600)  # 1 hour
async def get_calendar_entries(secretary_type: str):
    return await list_available_dates(secretary_type)
```

### Pagination

```python
# Paginate large result sets
@router.get("/api/news/search")
async def search_news(
    q: str,
    page: int = 1,
    per_page: int = 20
):
    offset = (page - 1) * per_page
    results = await search_content(q, offset, per_page)
    return {
        "results": results,
        "page": page,
        "total": total_count,
        "has_more": offset + per_page < total_count
    }
```

### Lazy Loading

```typescript
// Load content sections progressively
const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load critical content first
    loadTodayArticles().then(setArticles);
    
    // Load additional data in background
    setTimeout(() => {
      loadHistoricalSummary();
      loadSavedArticles();
    }, 1000);
  }, []);
};
```

## Security Considerations

### Input Validation

```python
# Validate all user inputs
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., max_length=1000)
    priority: Literal['high', 'medium', 'low']
    estimated_time: int = Field(..., gt=0, le=480)  # Max 8 hours
```

### File Path Sanitization

```python
def safe_file_path(date: str, secretary: str) -> Path:
    # Prevent directory traversal
    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    secretary_clean = secretary.lower().strip()
    
    if secretary_clean not in ALLOWED_SECRETARIES:
        raise ValueError("Invalid secretary type")
    
    return DATA_DIR / "daily_logs" / str(date_obj) / f"{secretary_clean}.md"
```

### Rate Limiting

```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/news/generate")
@limiter.limit("5/minute")
async def generate_news():
    # Limit generation requests to prevent abuse
    pass
```

## Accessibility

### Keyboard Navigation

```typescript
// All interactive elements must be keyboard accessible
<button
  onClick={handleAction}
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
  aria-label="Generate news briefing"
  tabIndex={0}
>
  Generate
</button>
```

### Screen Reader Support

```typescript
// Provide descriptive ARIA labels
<div role="article" aria-label={`News article: ${article.title}`}>
  <h2 id={`article-${article.id}`}>{article.title}</h2>
  <p aria-describedby={`article-${article.id}`}>{article.summary}</p>
</div>
```

### Color Contrast

```css
/* Ensure WCAG AA compliance */
.importance-high {
  color: hsl(0 84% 60%);  /* Contrast ratio: 4.5:1 */
}

.importance-medium {
  color: hsl(38 92% 50%);  /* Contrast ratio: 4.5:1 */
}
```

## Deployment Considerations

### Environment Variables

```bash
# Backend
DATABASE_URL=sqlite:///data/ai_life_assistant.db
DATA_DIR=/app/data
CACHE_TTL=300
RATE_LIMIT_PER_MINUTE=60

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### File System Permissions

```bash
# Ensure proper permissions for data directory
chmod 755 data/
chmod 755 data/daily_logs/
chmod 644 data/daily_logs/*/*.md
```

### Database Migrations

```python
# Use Alembic for schema changes
alembic revision --autogenerate -m "Add user_actions table"
alembic upgrade head
```

---

**Design Complexity**: High
**Estimated Implementation Time**: 40-50 hours
**Priority**: High (Core feature enhancement)
