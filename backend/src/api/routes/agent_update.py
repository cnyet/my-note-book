@router.get("/news", response_model=dict)
async def get_news(
    background_tasks: BackgroundTasks,
    target_date: Optional[date] = None,
    latest: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Get news briefing from database. v2.0: Includes background auto-refresh.
    """
    news_repo = NewsRepository(db)
    is_updating = False
    
    # Check for background refresh if it's for today
    is_today = target_date is None or target_date == date.today()
    if is_today and not latest:
        last_updated = news_repo.get_last_updated_at()
        
        should_refresh = False
        if not last_updated:
            should_refresh = True
        else:
            diff = datetime.now() - last_updated
            if diff.total_seconds() > 4 * 3600: # 4 hours TTL
                should_refresh = True
        
        if should_refresh:
            logger.info("News is stale or missing. Triggering background refresh...")
            service = get_agent_service()
            background_tasks.add_task(service.run_news)
            is_updating = True

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
                "importance_score": article.importance_score,
                "category": article.category,
                "created_at": article.created_at.isoformat() if article.created_at else None,
            }
        )

    # Try to get markdown content from content_index
    content = None
    snippet = None
    try:
        content_date = target_date or date.today()
        content = file_repo.read_content("news", content_date)
        snippet = parser.get_snippet(content)
    except:
        pass

    return {
        "articles": articles_data,
        "content": content,
        "snippet": snippet,
        "generated": len(articles_data) > 0 or content is not None,
        "is_updating": is_updating
    }
