// frontend/src/app/(public)/agents/task/page.tsx
/**
 * Task Agent Page
 */
"use client";

import { useState } from "react";
import { useTaskList, useTaskCategories, useCreateTask, useCompleteTask, useDeleteTask } from "@/hooks/use-task";
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Flag } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TaskAgentPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: tasksData, isLoading } = useTaskList(1, 50);
  const { data: categories } = useTaskCategories();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category_id: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate(
      {
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        category_id: formData.category_id || undefined,
      },
      {
        onSuccess: () => {
          setFormData({ title: "", description: "", priority: "medium", category_id: "" });
          setShowForm(false);
        },
      }
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-400";
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.color || "#64748b";
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Agents</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Task Manager
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              Task<span className="text-emerald-400">.Flow</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              AI 驱动的任务管理，智能生成每日任务清单
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
          >
            <Plus size={20} />
            {showForm ? "取消" : "新建任务"}
          </button>
        </div>

        {/* Create Task Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">任务标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="输入任务标题..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">任务描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  placeholder="输入任务描述..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">优先级</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">分类</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">无分类</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={createTask.isPending}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {createTask.isPending ? "创建中..." : "创建任务"}
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">加载中...</div>
          ) : tasksData?.tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>暂无任务</p>
              <p className="text-sm mt-2">点击「新建任务」创建第一个任务</p>
            </div>
          ) : (
            tasksData?.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group"
              >
                <button
                  onClick={() => completeTask.mutate(task.id)}
                  disabled={task.status === "done"}
                  className="flex-shrink-0"
                >
                  {task.status === "done" ? (
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  ) : (
                    <Circle size={24} className="text-slate-500 hover:text-emerald-400 transition-colors" />
                  )}
                </button>
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: getCategoryColor(task.category_id || "") }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-white truncate ${task.status === "done" ? "line-through text-slate-500" : ""}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-500 truncate">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={14} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTask.mutate(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
