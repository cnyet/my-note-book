# Design: Work Agents MVP v1.0

## 1. Architecture

### 1.1 High Level

- **Frontend**: Next.js (App Router) serving the UI.
- **Backend**: FastAPI serving REST APIs.
- **Database**: SQLite (SINGLE FILE) with async access (`aiosqlite`).
- **Scheduler**: APScheduler running inside the Backend process for daily jobs (8:00 AM).
- **LobeChat**: Independent Docker container, embedded via Iframe.

### 1.2 Tech Stack

- **Language**: Python 3.11+, TypeScript 5+.
- **ORM**: SQLAlchemy 2.0 (Async).
- **Schema**: Pydantic v2.
- **UI**: Shadcn/UI + TailwindCSS (Genesis Design System).

## 2. Database Schema

Tables to be added (see `docs/design/database-schema.md` for base):

### 2.1 News

- `news_items`: id, title, summary, url, source, published_at, created_at.

### 2.2 Tasks

- `tasks`: id, user_id, title, status (todo/done), priority, deadline, created_at.

### 2.3 Life Metrics (Encrypted)

- `life_metrics`: id, user_id, date, data (ENCRYPTED TEXT), advice, created_at.
- _Encryption_: Fernet (symmetric) using `ENCRYPTION_KEY` from env.

### 2.4 Reviews

- `daily_reviews`: id, user_id, date, content (Markdown), created_at.
- `user_preferences`: id, user_id, key, value, confidence, source_agent.

### 2.5 Outfits

- `outfit_recommendations`: id, user_id, date, suggestion_text, image_path, created_at.

## 3. Agent Workflows

### 3.1 News Agent

- **Trigger**: 8:00 AM Cron.
- **Action**: Fetch RSS/HTML -> LLM Summarize -> Save DB.
- **Retry**: 3 times, exponetial backoff.

### 3.2 Task Agent

- **Trigger**: User POST `/api/v1/agents/task/generate`.
- **Action**: Form Data -> LLM -> JSON List of Tasks -> Save DB.

### 3.3 Life Agent

- **Trigger**: User POST `/api/v1/agents/life/record`.
- **Action**: Encrypt Data -> Save DB -> LLM Analyze -> Save Advice.

### 3.4 Outfit Agent

- **Trigger**: 8:00 AM Cron.
- **Action**: Get Weather -> Check Calendar -> LLM Suggest -> (Opt) Generate Image -> Save DB.

### 3.5 Review Agent

- **Trigger**: User request (Evening).
- **Action**: Fetch Daily Data (News+Task+Life) -> LLM Review -> Extract Prefs -> Save DB.

## 4. Integration Strategy

### 4.1 LobeChat

- **Endpoint**: `http://localhost:3210` (Internal Docker Network) / Public URL.
- **Auth**: Independent. User logs in separately or SSO (Future). MVP: Manual login.
- **UI**: `<iframe src="..." />` in `frontend/src/app/(dashboard)/agents/lobe/page.tsx`.

## 5. Security

- **Secrets**: Load from `.env`.
- **Encryption**: `cryptography` library for Life data.
- **Auth**: JWT for Backend API protection.
