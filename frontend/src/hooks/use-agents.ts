// frontend/src/hooks/use-agents.ts
/**
 * Hook for fetching agents list from API
 */
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/admin-api";

export interface Agent {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  link: string;
  category: string;
  model: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

async function fetchAgents(): Promise<Agent[]> {
  const response = await apiClient.get<Agent[]>("/admin/agents");
  return response.data || [];
}

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
}
