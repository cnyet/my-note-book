// frontend/src/hooks/use-task.ts
/**
 * Task Agent API Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "done" | "failed";
  category_id: string | null;
  due_date: string | null;
  completed_at: string | null;
  ai_generated: boolean;
  raw_input: string | null;
  created_at: string;
  updated_at: string;
  category?: TaskCategory;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

const API_BASE = "/api/v1/admin";

async function fetchTasks(
  page = 1,
  pageSize = 20,
  filters?: { status?: string; priority?: string; category_id?: string }
): Promise<TaskListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.priority && { priority: filters.priority }),
    ...(filters?.category_id && { category_id: filters.category_id }),
  });

  const res = await fetch(`${API_BASE}/task?${params}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

async function fetchTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/task/${id}`);
  if (!res.ok) throw new Error("Failed to fetch task");
  return res.json();
}

async function fetchCategories(): Promise<TaskCategory[]> {
  const res = await fetch(`${API_BASE}/task/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function createTask(data: {
  title: string;
  description?: string;
  priority?: string;
  category_id?: string;
  due_date?: string;
  raw_input?: string;
  ai_generated?: boolean;
}): Promise<Task> {
  const res = await fetch(`${API_BASE}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_BASE}/task/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

async function completeTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/task/${id}/complete`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to complete task");
  return res.json();
}

async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/task/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
}

export function useTaskList(
  page = 1,
  pageSize = 20,
  filters?: { status?: string; priority?: string; category_id?: string }
) {
  return useQuery({
    queryKey: ["tasks", "list", { page, pageSize, ...filters }],
    queryFn: () => fetchTasks(page, pageSize, filters),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => fetchTask(id),
    enabled: !!id,
  });
}

export function useTaskCategories() {
  return useQuery({
    queryKey: ["tasks", "categories"],
    queryFn: fetchCategories,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
