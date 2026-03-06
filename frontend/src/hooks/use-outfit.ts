// frontend/src/hooks/use-outfit.ts
/**
 * Outfit Agent API Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface OutfitRecommendation {
  id: string;
  recommend_date: string;
  weather_data: {
    temperature?: number;
    humidity?: number;
    condition?: string;
  } | null;
  schedule_input: string | null;
  outfit_description: string;
  outfit_image_path: string | null;
  outfit_image_url: string | null;
  ai_notes: string | null;
  is_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface OutfitRecommendationListResponse {
  recommendations: OutfitRecommendation[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

const API_BASE = "/api/v1/admin";

async function fetchOutfitRecommendations(
  page = 1,
  pageSize = 20
): Promise<OutfitRecommendationListResponse> {
  const res = await fetch(`${API_BASE}/outfit?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch outfit recommendations");
  return res.json();
}

async function fetchTodayOutfit(): Promise<OutfitRecommendation> {
  const res = await fetch(`${API_BASE}/outfit/today`);
  if (!res.ok) throw new Error("Failed to fetch today outfit");
  return res.json();
}

async function fetchOutfitRecommendation(
  id: string
): Promise<OutfitRecommendation> {
  const res = await fetch(`${API_BASE}/outfit/${id}`);
  if (!res.ok) throw new Error("Failed to fetch outfit recommendation");
  return res.json();
}

async function createOutfitRecommendation(data: {
  recommend_date: string;
  outfit_description: string;
  weather_data?: {
    temperature?: number;
    humidity?: number;
    condition?: string;
  };
  schedule_input?: string;
  outfit_image_path?: string;
  outfit_image_url?: string;
  ai_notes?: string;
  is_generated?: boolean;
}): Promise<OutfitRecommendation> {
  const res = await fetch(`${API_BASE}/outfit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create outfit recommendation");
  return res.json();
}

async function updateOutfitRecommendation(
  id: string,
  data: Partial<OutfitRecommendation>
): Promise<OutfitRecommendation> {
  const res = await fetch(`${API_BASE}/outfit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update outfit recommendation");
  return res.json();
}

async function deleteOutfitRecommendation(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/outfit/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete outfit recommendation");
}

async function generateOutfitRecommendation(data: {
  recommend_date: string;
  schedule_input?: string;
  weather_data?: {
    temperature?: number;
    humidity?: number;
    condition?: string;
  };
}): Promise<OutfitRecommendation> {
  const res = await fetch(`${API_BASE}/outfit/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate outfit recommendation");
  return res.json();
}

export function useOutfitRecommendations(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["outfit", "list", { page, pageSize }],
    queryFn: () => fetchOutfitRecommendations(page, pageSize),
  });
}

export function useTodayOutfit() {
  return useQuery({
    queryKey: ["outfit", "today"],
    queryFn: fetchTodayOutfit,
  });
}

export function useOutfitRecommendation(id: string) {
  return useQuery({
    queryKey: ["outfit", id],
    queryFn: () => fetchOutfitRecommendation(id),
    enabled: !!id,
  });
}

export function useCreateOutfitRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOutfitRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfit"] });
    },
  });
}

export function useUpdateOutfitRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<OutfitRecommendation>;
    }) => updateOutfitRecommendation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfit"] });
    },
  });
}

export function useDeleteOutfitRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOutfitRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfit"] });
    },
  });
}

export function useGenerateOutfitRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateOutfitRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfit"] });
    },
  });
}
