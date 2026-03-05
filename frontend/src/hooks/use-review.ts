// frontend/src/hooks/use-review.ts
/**
 * Review Agent API Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface DailyReview {
  id: string;
  review_date: string;
  tasks_completed: number;
  tasks_failed: number;
  health_data: Record<string, unknown> | null;
  outfit_data: Record<string, unknown> | null;
  news_summary: string | null;
  ai_summary: string | null;
  mood_score: number | null;
  highlights: string | null;
  improvements: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  category: string;
  key: string;
  value: Record<string, unknown>;
  confidence: number;
  last_verified: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyReviewListResponse {
  reviews: DailyReview[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

const API_BASE = "/api/v1/admin";

async function fetchReviews(
  page = 1,
  pageSize = 20
): Promise<DailyReviewListResponse> {
  const res = await fetch(`${API_BASE}/review?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

async function fetchTodayReview(): Promise<DailyReview> {
  const res = await fetch(`${API_BASE}/review/today`);
  if (!res.ok) throw new Error("Failed to fetch today review");
  return res.json();
}

async function fetchReview(id: string): Promise<DailyReview> {
  const res = await fetch(`${API_BASE}/review/${id}`);
  if (!res.ok) throw new Error("Failed to fetch review");
  return res.json();
}

async function createReview(data: {
  review_date: string;
  tasks_completed?: number;
  tasks_failed?: number;
  health_data?: Record<string, unknown>;
  outfit_data?: Record<string, unknown>;
  news_summary?: string;
  ai_summary?: string;
  mood_score?: number;
  highlights?: string;
  improvements?: string;
}): Promise<DailyReview> {
  const res = await fetch(`${API_BASE}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create review");
  return res.json();
}

async function updateReview(
  id: string,
  data: Partial<DailyReview>
): Promise<DailyReview> {
  const res = await fetch(`${API_BASE}/review/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update review");
  return res.json();
}

async function deleteReview(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/review/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete review");
}

async function generateReview(reviewDate: string): Promise<DailyReview> {
  const res = await fetch(
    `${API_BASE}/review/generate?review_date=${reviewDate}`,
    {
      method: "POST",
    }
  );
  if (!res.ok) throw new Error("Failed to generate review");
  return res.json();
}

async function fetchPreferences(
  category?: string
): Promise<UserPreference[]> {
  const params = category ? `?category=${category}` : "";
  const res = await fetch(`${API_BASE}/review/preferences${params}`);
  if (!res.ok) throw new Error("Failed to fetch preferences");
  return res.json();
}

async function createPreference(data: {
  category: string;
  key: string;
  value: Record<string, unknown>;
  confidence?: number;
}): Promise<UserPreference> {
  const res = await fetch(`${API_BASE}/review/preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create preference");
  return res.json();
}

export function useReviews(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["reviews", "list", { page, pageSize }],
    queryFn: () => fetchReviews(page, pageSize),
  });
}

export function useTodayReview() {
  return useQuery({
    queryKey: ["reviews", "today"],
    queryFn: fetchTodayReview,
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReview(id),
    enabled: !!id,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DailyReview> }) =>
      updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useGenerateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function usePreferences(category?: string) {
  return useQuery({
    queryKey: ["preferences", category],
    queryFn: () => fetchPreferences(category),
  });
}

export function useCreatePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
}
