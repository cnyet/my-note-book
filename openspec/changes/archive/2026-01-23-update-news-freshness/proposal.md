# Change: Update News Agent Freshness and Article Count

## Why
The user currently has to manually trigger news generation, and the system only shows 10 articles (with the agent only picking 5). This makes the "News" feature feel stale and limited. We need a way to automatically provide 20 fresh articles upon opening the page without redundant LLM calls.

## What Changes
- **MODIFIED**: `backend/config/config.ini` to increase `articles_per_summary` to 20.
- **MODIFIED**: `backend/src/api/repositories/news_repository.py` to add a `get_last_updated_at` method for fast freshness checks.
- **MODIFIED**: `backend/src/api/routes/agent.py`'s `get_news` endpoint to implement background auto-refresh if data is older than 4 hours.
- **MODIFIED**: `frontend/src/app/(dashboard)/news/page.tsx` to request 20 articles and display a background sync status.

## Impact
- Affected specs: `news-agent`
- Affected code:
  - `backend/config/config.ini`
  - `backend/src/api/repositories/news_repository.py`
  - `backend/src/api/routes/agent.py`
  - `frontend/src/app/(dashboard)/news/page.tsx`
