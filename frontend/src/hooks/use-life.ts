// frontend/src/hooks/use-life.ts
/**
 * Life Agent API Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface HealthMetrics {
  id: string;
  height: number | null;
  weight: number | null;
  health_status: string | null;
  exercise_frequency: string | null;
  diet_preference: string | null;
  sleep_hours: number | null;
  water_intake: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  suggestions?: HealthSuggestion[];
}

export interface HealthSuggestion {
  id: string;
  metric_id: string;
  diet_suggestion: string | null;
  exercise_suggestion: string | null;
  lifestyle_suggestion: string | null;
  ai_notes: string | null;
  created_at: string;
}

export interface HealthMetricsListResponse {
  metrics: HealthMetrics[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

const API_BASE = "/api/v1/admin";

async function fetchHealthMetrics(
  page = 1,
  pageSize = 20
): Promise<HealthMetricsListResponse> {
  const res = await fetch(`${API_BASE}/life?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch health metrics");
  return res.json();
}

async function fetchHealthMetric(id: string): Promise<HealthMetrics> {
  const res = await fetch(`${API_BASE}/life/metrics/${id}`);
  if (!res.ok) throw new Error("Failed to fetch health metric");
  return res.json();
}

async function saveHealthMetrics(data: {
  height?: number;
  weight?: number;
  health_status?: string;
  exercise_frequency?: string;
  diet_preference?: string;
  sleep_hours?: number;
  water_intake?: number;
  notes?: string;
}): Promise<HealthMetrics> {
  const res = await fetch(`${API_BASE}/life/metrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save health metrics");
  return res.json();
}

async function updateHealthMetrics(
  id: string,
  data: Partial<HealthMetrics>
): Promise<HealthMetrics> {
  const res = await fetch(`${API_BASE}/life/metrics/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update health metrics");
  return res.json();
}

async function deleteHealthMetrics(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/life/metrics/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete health metrics");
}

async function generateSuggestion(metricId: string): Promise<HealthSuggestion> {
  const res = await fetch(`${API_BASE}/life/suggestions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ metric_id: metricId }),
  });
  if (!res.ok) throw new Error("Failed to generate suggestion");
  return res.json();
}

export function useHealthMetrics(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["life", "metrics", { page, pageSize }],
    queryFn: () => fetchHealthMetrics(page, pageSize),
  });
}

export function useHealthMetric(id: string) {
  return useQuery({
    queryKey: ["life", "metric", id],
    queryFn: () => fetchHealthMetric(id),
    enabled: !!id,
  });
}

export function useSaveHealthMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveHealthMetrics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["life"] });
    },
  });
}

export function useUpdateHealthMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HealthMetrics> }) =>
      updateHealthMetrics(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["life"] });
    },
  });
}

export function useDeleteHealthMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHealthMetrics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["life"] });
    },
  });
}

export function useGenerateSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["life"] });
    },
  });
}
