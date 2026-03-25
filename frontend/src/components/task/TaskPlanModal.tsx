// frontend/src/components/task/TaskPlanModal.tsx
/**
 * Task Plan Modal Component
 * 显示 AI 生成的任务计划，供用户确认/编辑
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, Edit2, Trash2, BrainCircuit } from "lucide-react";
import { PlannedTask } from "@/hooks/use-task";

interface TaskPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plannedTasks: PlannedTask[];
  onConfirm: (tasks: PlannedTask[]) => void;
  isLoading?: boolean;
}

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const priorityLabels = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
};

const categoryIcons = {
  work: "💼",
  personal: "🏠",
  health: "💪",
  learning: "📚",
  other: "📌",
};

export function TaskPlanModal({
  isOpen,
  onClose,
  plannedTasks,
  onConfirm,
  isLoading,
}: TaskPlanModalProps) {
  const [tasks, setTasks] = useState<PlannedTask[]>(plannedTasks);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PlannedTask | null>(null);

  if (!isOpen) return null;

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...tasks[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      const newTasks = [...tasks];
      newTasks[editingIndex] = editForm;
      setTasks(newTasks);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleDelete = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleConfirm = () => {
    onConfirm(tasks);
    setTasks(plannedTasks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0A0A0F] border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0A0A0F]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">AI 任务规划结果</h2>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-400">
              {tasks.length} 个任务
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {tasks.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无任务</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border ${priorityColors[task.priority]} transition-all`}
              >
                {editingIndex === index && editForm ? (
                  /* 编辑模式 */
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="任务标题"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                      placeholder="任务描述"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <select
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            priority: e.target.value as "high" | "medium" | "low",
                          })
                        }
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <option value="high">高优先级</option>
                        <option value="medium">中优先级</option>
                        <option value="low">低优先级</option>
                      </select>
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category: e.target.value as PlannedTask["category"],
                          })
                        }
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <option value="work">工作</option>
                        <option value="personal">个人</option>
                        <option value="health">健康</option>
                        <option value="learning">学习</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setEditForm(null);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 查看模式 */
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {categoryIcons[task.category]}
                          </span>
                          <h3 className="text-lg font-bold text-white">
                            {task.title}
                          </h3>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-400">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 border-t border-white/10 bg-[#0A0A0F]/90 backdrop-blur-xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || tasks.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Check size={20} />
              确认创建 {tasks.length} 个任务
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
