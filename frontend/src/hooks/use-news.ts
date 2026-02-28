// frontend/src/hooks/use-news.ts
/**
 * News React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNewsList,
  fetchArticle,
  fetchSources,
  fetchNewsStats,
  refreshNews,
  type NewsArticle,
  type NewsSource,
  type NewsStats,
} from "@/lib/api/news";

// Query keys
export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (filters: Record<string, string | boolean | number>) =>
    [...newsKeys.lists(), filters] as const,
  sources: () => [...newsKeys.all, "sources"] as const,
  stats: () => [...newsKeys.all, "stats"] as const,
  article: (id: string) => [...newsKeys.all, "article", id] as const,
};

// Hooks
export function useNewsList(filters?: {
  page?: number;
  page_size?: number;
  category?: string;
  source_id?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: newsKeys.list(filters || {}),
    queryFn: () => fetchNewsList(filters),
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: newsKeys.article(id),
    queryFn: () => fetchArticle(id),
    enabled: !!id,
  });
}

export function useSources(activeOnly = true) {
  return useQuery({
    queryKey: newsKeys.sources(),
    queryFn: () => fetchSources(activeOnly),
  });
}

export function useNewsStats() {
  return useQuery({
    queryKey: newsKeys.stats(),
    queryFn: () => fetchNewsStats(),
  });
}

export function useRefreshNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sourceIds?: string[]) => refreshNews(sourceIds),
    onSuccess: () => {
      // Invalidate news list and stats queries
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsKeys.stats() });
    },
  });
}
