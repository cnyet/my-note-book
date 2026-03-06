/**
 * Admin API Client - 统一的后端 API 接口
 * 用于前后端联调，替代 mock 数据
 */

import axios from "axios";
import { getAuthToken } from "./admin-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
const API_VERSION = "/api/v1";

// ============ Axios 实例配置 ============

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 导出 apiClient 供内部使用
export { apiClient };

// 请求拦截器 - 自动添加 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Network error";
    console.error(`API Error: ${message}`);
    return Promise.reject({
      success: false,
      error: message,
      status: error.response?.status,
    });
  }
);

// ============ 通用类型 ============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============ Agents API ============

export interface Agent {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  link?: string;
  category: "Dev" | "Auto" | "Intel" | "Creative";
  system_prompt?: string;
  model: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  sort_order: number;
}

export interface AgentCreate {
  name: string;
  slug: string;
  description: string;
  icon_url?: string;
  link?: string;
  category: "Dev" | "Auto" | "Intel" | "Creative";
  system_prompt?: string;
  model: string;
  is_active?: boolean;
}

export interface AgentUpdate {
  name?: string;
  slug?: string;
  description?: string;
  icon_url?: string;
  link?: string;
  category?: "Dev" | "Auto" | "Intel" | "Creative";
  system_prompt?: string;
  model?: string;
  is_active?: boolean;
}

export const agentsApi = {
  /** 获取所有智能体 */
  list: async (params?: { category?: string; status?: string; skip?: number; limit?: number }) => {
    const response = await apiClient.get<Agent[]>("/admin/agents", { params });
    return { success: true, data: response.data };
  },

  /** 获取智能体详情 */
  get: async (id: number) => {
    const response = await apiClient.get<Agent>(`/admin/agents/${id}`);
    return { success: true, data: response.data };
  },

  /** 创建智能体 */
  create: async (data: AgentCreate) => {
    const response = await apiClient.post<Agent>("/admin/agents", data);
    return { success: true, data: response.data };
  },

  /** 更新智能体 */
  update: async (id: number, data: AgentUpdate) => {
    const response = await apiClient.put<Agent>(`/admin/agents/${id}`, data);
    return { success: true, data: response.data };
  },

  /** 删除智能体 */
  delete: async (id: number) => {
    await apiClient.delete(`/admin/agents/${id}`);
    return { success: true };
  },

  /** 切换智能体状态 */
  toggleStatus: async (id: number) => {
    const response = await apiClient.post<Agent>(`/admin/agents/${id}/status`);
    return { success: true, data: response.data };
  },

  /** 获取所有类别 */
  getCategories: async () => {
    const response = await apiClient.get<string[]>("/admin/agents/categories");
    return { success: true, data: response.data };
  },

  /** 获取统计摘要 */
  getSummary: async () => {
    const response = await apiClient.get("/admin/agents/stats/summary");
    return { success: true, data: response.data };
  },
};

// ============ Tools API ============

export interface Tool {
  id: number;
  name: string;
  slug: string;
  category: "Dev" | "Auto" | "Intel" | "Creative";
  description: string;
  icon_url?: string;
  link?: string;
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export interface ToolCreate {
  name: string;
  slug: string;
  category: "Dev" | "Auto" | "Intel" | "Creative";
  description?: string;
  icon_url?: string;
  link?: string;
  status?: "active" | "inactive";
  sort_order?: number;
}

export interface ToolUpdate {
  name?: string;
  slug?: string;
  category?: "Dev" | "Auto" | "Intel" | "Creative";
  description?: string;
  icon_url?: string;
  link?: string;
  status?: "active" | "inactive";
  sort_order?: number;
}

export const toolsApi = {
  /** 获取所有工具 */
  list: async (params?: { category?: string; status?: string; skip?: number; limit?: number }) => {
    const response = await apiClient.get<Tool[]>("/admin/tools", { params });
    return { success: true, data: response.data };
  },

  /** 获取工具详情 */
  get: async (id: number) => {
    const response = await apiClient.get<Tool>(`/admin/tools/${id}`);
    return { success: true, data: response.data };
  },

  /** 创建工具 */
  create: async (data: ToolCreate) => {
    const response = await apiClient.post<Tool>("/admin/tools", data);
    return { success: true, data: response.data };
  },

  /** 更新工具 */
  update: async (id: number, data: ToolUpdate) => {
    const response = await apiClient.put<Tool>(`/admin/tools/${id}`, data);
    return { success: true, data: response.data };
  },

  /** 删除工具 */
  delete: async (id: number) => {
    await apiClient.delete(`/admin/tools/${id}`);
    return { success: true };
  },

  /** 切换工具状态 */
  toggleStatus: async (id: number) => {
    const response = await apiClient.patch<Tool>(`/admin/tools/${id}/status`);
    return { success: true, data: response.data };
  },

  /** 获取所有类别 */
  getCategories: async () => {
    const response = await apiClient.get<string[]>("/admin/tools/categories");
    return { success: true, data: response.data };
  },

  /** 获取统计摘要 */
  getSummary: async () => {
    const response = await apiClient.get("/admin/tools/stats/summary");
    return { success: true, data: response.data };
  },
};

// ============ Labs API ============

export interface Lab {
  id: number;
  name: string;
  slug: string;
  status: "Experimental" | "Preview" | "Archived";
  description?: string;
  demo_url?: string;
  media_urls: string[];
  online_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface LabCreate {
  name: string;
  slug: string;
  status?: "Experimental" | "Preview" | "Archived";
  description?: string;
  demo_url?: string;
  media_urls?: string[];
  online_count?: number;
}

export interface LabUpdate {
  name?: string;
  slug?: string;
  status?: "Experimental" | "Preview" | "Archived";
  description?: string;
  demo_url?: string;
  media_urls?: string[];
  online_count?: number;
}

export const labsApi = {
  /** 获取所有实验室 */
  list: async (params?: { status?: string; skip?: number; limit?: number }) => {
    const response = await apiClient.get<Lab[]>("/admin/labs", { params });
    return { success: true, data: response.data };
  },

  /** 获取实验室详情 */
  get: async (id: number) => {
    const response = await apiClient.get<Lab>(`/admin/labs/${id}`);
    return { success: true, data: response.data };
  },

  /** 创建实验室 */
  create: async (data: LabCreate) => {
    const response = await apiClient.post<Lab>("/admin/labs", data);
    return { success: true, data: response.data };
  },

  /** 更新实验室 */
  update: async (id: number, data: LabUpdate) => {
    const response = await apiClient.put<Lab>(`/admin/labs/${id}`, data);
    return { success: true, data: response.data };
  },

  /** 删除实验室 */
  delete: async (id: number) => {
    await apiClient.delete(`/admin/labs/${id}`);
    return { success: true };
  },

  /** 更新实验室状态 */
  updateStatus: async (id: number, status: "Experimental" | "Preview" | "Archived") => {
    const response = await apiClient.post<Lab>(`/admin/labs/${id}/status`, null, {
      params: { new_status: status },
    });
    return { success: true, data: response.data };
  },

  /** 增加在线人数 */
  incrementOnline: async (id: number) => {
    const response = await apiClient.patch<Lab>(`/admin/labs/${id}/online`);
    return { success: true, data: response.data };
  },

  /** 获取所有状态 */
  getStatuses: async () => {
    const response = await apiClient.get<string[]>("/admin/labs/statuses");
    return { success: true, data: response.data };
  },

  /** 获取统计摘要 */
  getSummary: async () => {
    const response = await apiClient.get("/admin/labs/stats/summary");
    return { success: true, data: response.data };
  },
};

// ============ Blog API ============

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  author_id?: number;
  status: "draft" | "published" | "archived";
  published_at?: string;
  created_at: string;
  updated_at?: string | null;
  views?: number;
  cover_image?: string;
  tags?: { tag_name: string }[];
  category?: string;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  author: string;
  status?: "draft" | "published";
  cover_image?: string;
  tags?: string[];
  category?: string;
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  status?: "draft" | "published";
  cover_image?: string;
  tags?: string[];
  category?: string;
}

export const blogApi = {
  /** 获取所有文章 */
  list: async (params?: { status?: string; skip?: number; limit?: number; category?: string }) => {
    const response = await apiClient.get<BlogPost[]>("/admin/blog", { params });
    return { success: true, data: response.data };
  },

  /** 获取文章详情 */
  get: async (id: number) => {
    const response = await apiClient.get<BlogPost>(`/admin/blog/${id}`);
    return { success: true, data: response.data };
  },

  /** 创建文章 */
  create: async (data: BlogPostCreate) => {
    const response = await apiClient.post<BlogPost>("/admin/blog", data);
    return { success: true, data: response.data };
  },

  /** 更新文章 */
  update: async (id: number, data: BlogPostUpdate) => {
    const response = await apiClient.put<BlogPost>(`/admin/blog/${id}`, data);
    return { success: true, data: response.data };
  },

  /** 删除文章 */
  delete: async (id: number) => {
    await apiClient.delete(`/admin/blog/${id}`);
    return { success: true };
  },

  /** 发布/取消发布文章 */
  togglePublish: async (id: number) => {
    const response = await apiClient.patch<BlogPost>(`/admin/blog/${id}/publish`);
    return { success: true, data: response.data };
  },

  /** 获取所有分类 */
  getCategories: async () => {
    const response = await apiClient.get<string[]>("/admin/blog/categories");
    return { success: true, data: response.data };
  },

  /** 获取统计摘要 */
  getSummary: async () => {
    const response = await apiClient.get("/admin/blog/stats/summary");
    return { success: true, data: response.data };
  },
};

// ============ 导出通用请求方法 ============

export const adminApi = {
  request: <T>(endpoint: string, options?: { method?: string; data?: unknown }) => {
    return apiClient.request<T>({
      url: endpoint,
      method: options?.method || "GET",
      data: options?.data,
    });
  },
  get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => apiClient.post<T>(endpoint, data),
  put: <T>(endpoint: string, data: unknown) => apiClient.put<T>(endpoint, data),
  patch: <T>(endpoint: string, data: unknown) => apiClient.patch<T>(endpoint, data),
  delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
};

// ============ 向后兼容的导出 ============

export const adminAuthApi = {
  request: <T>(endpoint: string, options?: RequestInit) => apiClient.request<T>({
    url: endpoint,
    method: options?.method || "GET",
    ...(options?.method === "POST" || options?.method === "PUT" || options?.method === "PATCH" ? { data: JSON.parse(options.body as string) } : {}),
  }),

  get: async <T>(endpoint: string) => {
    const response = await apiClient.get<T>(endpoint);
    return { success: true, data: response.data };
  },

  post: async <T>(endpoint: string, data: unknown) => {
    const response = await apiClient.post<T>(endpoint, data);
    return { success: true, data: response.data };
  },

  put: async <T>(endpoint: string, data: unknown) => {
    const response = await apiClient.put<T>(endpoint, data);
    return { success: true, data: response.data };
  },

  delete: async <T>(endpoint: string) => {
    const response = await apiClient.delete<T>(endpoint);
    return { success: true, data: response.data };
  },

  login: async (username: string, password: string) => {
    const response = await apiClient.post<{
      access_token: string;
      refresh_token: string;
      user: { id: number; username: string; email: string };
    }>("/admin/auth/login", { username, password });
    return { success: true, data: response.data };
  },

  verify: async () => {
    const response = await apiClient.get<{
      id: number;
      username: string;
      email: string;
    }>("/admin/auth/verify");
    return { success: true, data: response.data };
  },
};

export default adminApi;
