## 1. Backend Implementation
- [x] 1.1 Update `config.ini` to set `articles_per_summary = 20`
- [x] 1.2 Add `get_last_updated_at` to `NewsRepository`
- [x] 1.3 Update `get_news` route in `agent.py` with background refresh logic (4h TTL)
- [x] 1.4 Ensure background task properly initializes `agent_service` and `db_session`

## 2. Frontend Implementation
- [x] 2.1 Update `loadLatestNews` in `page.tsx` to fetch 20 articles
- [x] 2.2 Add `isUpdating` state and UI feedback for background sync
- [x] 2.3 Verify responsive grid layout for 20 cards

## 3. Verification
- [x] 3.1 Verify news auto-triggers on first page load
- [x] 3.2 Verify news does NOT trigger if articles are < 4 hours old
- [x] 3.3 Verify 20 articles are displayed
