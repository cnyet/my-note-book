// frontend/src/lib/api/news.ts
/**
 * News API Client
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface NewsArticle {
  id: string;
  source_id: string;
  source_name?: string;
  title: string;
  url: string;
  author?: string;
  published_at?: string;
  crawled_at: string;
  summary?: string;
  category?: string;
  tags?: string[];
  image_url?: string;
  is_featured: boolean;
  view_count: number;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  source_type: string;
  category?: string;
  language: string;
  is_active: boolean;
  crawl_interval: number;
  last_crawled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface NewsStats {
  active_sources: number;
  total_sources: number;
  total_articles: number;
  summarized_articles: number;
  featured_articles: number;
  last_crawl_time?: string;
}

export async function fetchNewsList(params?: {
  page?: number;
  page_size?: number;
  category?: string;
  source_id?: string;
  featured?: boolean;
}): Promise<NewsListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
  if (params?.category) searchParams.set("category", params.category);
  if (params?.source_id) searchParams.set("source_id", params.source_id);
  if (params?.featured !== undefined) searchParams.set("featured", params.featured.toString());

  const response = await fetch(`${API_BASE}/news?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  return response.json();
}

export async function fetchArticle(id: string): Promise<NewsArticle> {
  const response = await fetch(`${API_BASE}/news/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }
  return response.json();
}

export async function fetchSources(activeOnly = true): Promise<NewsSource[]> {
  const response = await fetch(`${API_BASE}/news/sources?active_only=${activeOnly}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sources");
  }
  return response.json();
}

export async function fetchNewsStats(): Promise<NewsStats> {
  const response = await fetch(`${API_BASE}/news/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export async function refreshNews(sourceIds?: string[]): Promise<{
  status: string;
  message: string;
  added_count: number;
}> {
  const response = await fetch(`${API_BASE}/news/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source_ids: sourceIds }),
  });
  if (!response.ok) {
    throw new Error("Failed to refresh news");
  }
  return response.json();
}
