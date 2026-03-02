// frontend/src/hooks/use-news.ts
/**
 * News API Hooks
 *
 * 提供新闻相关的 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ==================== Types ====================

export interface NewsArticle {
  id: string;
  source_id: string;
  source_name?: string;
  title: string;
  url: string;
  author?: string;
  published_at: string;
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

export interface NewsStats {
  active_sources: number;
  total_sources: number;
  total_articles: number;
  summarized_articles: number;
  featured_articles: number;
  last_crawl_time?: string;
}

export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface RefreshResponse {
  status: string;
  message: string;
  added_count: number;
}

// ==================== API Functions ====================

// 使用相对路径，通过 Next.js rewrite 代理到后端
const API_BASE = "/api/v1";

async function fetchNews(
  page = 1,
  pageSize = 20,
  filters?: {
    category?: string;
    source_id?: string;
    featured?: boolean;
  }
): Promise<NewsListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.source_id && { source_id: filters.source_id }),
    ...(filters?.featured !== undefined && { featured: filters.featured.toString() }),
  });

  const res = await fetch(`${API_BASE}/news?${params}`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

async function fetchNewsStats(): Promise<NewsStats> {
  const res = await fetch(`${API_BASE}/news/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

async function fetchNewsSources(): Promise<NewsSource[]> {
  const res = await fetch(`${API_BASE}/news/sources`);
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}

async function refreshNews(sourceIds?: string[]): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE}/news/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_ids: sourceIds }),
  });
  if (!res.ok) throw new Error("Failed to refresh news");
  return res.json();
}

// ==================== Hooks ====================

export function useNewsList(
  page = 1,
  pageSize = 20,
  filters?: {
    category?: string;
    source_id?: string;
    featured?: boolean;
  }
) {
  return useQuery({
    queryKey: ["news", "list", { page, pageSize, ...filters }],
    queryFn: () => fetchNews(page, pageSize, filters),
  });
}

export function useNewsStats() {
  return useQuery({
    queryKey: ["news", "stats"],
    queryFn: fetchNewsStats,
    refetchInterval: 60000, // 每分钟刷新
  });
}

export function useNewsSources() {
  return useQuery({
    queryKey: ["news", "sources"],
    queryFn: fetchNewsSources,
  });
}

export function useRefreshNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshNews,
    onSuccess: () => {
      // 刷新成功后，更新新闻列表和统计
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

// ==================== Management Hooks ====================

interface CreateSourceData {
  name: string;
  url: string;
  source_type: "rss" | "http";
  category?: string;
  language: string;
  crawl_interval: number;
}

interface UpdateSourceData {
  name?: string;
  url?: string;
  is_active?: boolean;
  crawl_interval?: number;
}

async function createNewsSource(data: CreateSourceData): Promise<NewsSource> {
  const res = await fetch(`${API_BASE}/news/sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create source");
  return res.json();
}

async function updateNewsSource(
  id: string,
  data: UpdateSourceData
): Promise<NewsSource> {
  const res = await fetch(`${API_BASE}/news/sources/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update source");
  return res.json();
}

async function deleteNewsSource(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/news/sources/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete source");
}

async function toggleNewsSource(id: string): Promise<NewsSource> {
  const res = await fetch(`${API_BASE}/news/sources/${id}/toggle`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to toggle source");
  return res.json();
}

export function useCreateNewsSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewsSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", "sources"] });
    },
  });
}

export function useUpdateNewsSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSourceData }) =>
      updateNewsSource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", "sources"] });
    },
  });
}

export function useDeleteNewsSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNewsSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", "sources"] });
    },
  });
}

export function useToggleNewsSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleNewsSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", "sources"] });
    },
  });
}
