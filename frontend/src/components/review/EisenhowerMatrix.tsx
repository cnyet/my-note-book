// frontend/src/components/review/EisenhowerMatrix.tsx
/**
 * Eisenhower Matrix Component
 * 四象限可视化展示组件
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { QuadrantCard } from "./QuadrantCard";
import { QuadrantAnalysis, QuadrantTask } from "@/hooks/use-review";

interface EisenhowerMatrixProps {
  analysis: QuadrantAnalysis;
  onTaskMove?: (task: QuadrantTask, toQuadrant: keyof QuadrantAnalysis) => void;
}

export function EisenhowerMatrix({
  analysis,
  onTaskMove,
}: EisenhowerMatrixProps) {
  const [localAnalysis, setLocalAnalysis] = useState<QuadrantAnalysis>(analysis);

  const handleTaskDrop = (
    task: QuadrantTask,
    quadrant: keyof QuadrantAnalysis
  ) => {
    // 从所有象限中移除该任务
    const newAnalysis = {
      important_urgent: localAnalysis.important_urgent.filter(
        (t) => t.title !== task.title
      ),
      important_not_urgent: localAnalysis.important_not_urgent.filter(
        (t) => t.title !== task.title
      ),
      not_important_urgent: localAnalysis.not_important_urgent.filter(
        (t) => t.title !== task.title
      ),
      not_important_not_urgent: localAnalysis.not_important_not_urgent.filter(
        (t) => t.title !== task.title
      ),
    };

    // 添加到新象限
    newAnalysis[quadrant] = [...newAnalysis[quadrant], task];

    setLocalAnalysis(newAnalysis);
    onTaskMove?.(task, quadrant);
  };

  return (
    <div className="w-full">
      {/* Matrix Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          Eisenhower Matrix 四象限分析
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          根据任务的重要性和紧急性进行分类，帮助确定优先级
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 第一行：重要 */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 重要且紧急 - 立即做 */}
          <QuadrantCard
            title="重要且紧急"
            subtitle="立即做 (Do Now)"
            tasks={localAnalysis.important_urgent}
            color="red"
            onTaskDrop={(task) => handleTaskDrop(task, "important_urgent")}
          />

          {/* 重要不紧急 - 计划做 */}
          <QuadrantCard
            title="重要不紧急"
            subtitle="计划做 (Schedule)"
            tasks={localAnalysis.important_not_urgent}
            color="blue"
            onTaskDrop={(task) => handleTaskDrop(task, "important_not_urgent")}
          />
        </div>

        {/* 第二行：不重要 */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 不重要紧急 - 授权做 */}
          <QuadrantCard
            title="不重要紧急"
            subtitle="授权做 (Delegate)"
            tasks={localAnalysis.not_important_urgent}
            color="yellow"
            onTaskDrop={(task) => handleTaskDrop(task, "not_important_urgent")}
          />

          {/* 不重要不紧急 - 少做 */}
          <QuadrantCard
            title="不重要不紧急"
            subtitle="少做 (Eliminate)"
            tasks={localAnalysis.not_important_not_urgent}
            color="green"
            onTaskDrop={(task) =>
              handleTaskDrop(task, "not_important_not_urgent")
            }
          />
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4"
      >
        <h3 className="mb-2 text-sm font-semibold text-white">
          使用说明
        </h3>
        <ul className="grid gap-2 text-xs text-gray-400 md:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500/50"></span>
            <span>
              <strong className="text-red-400">重要且紧急</strong>：危机处理、明天截止的任务
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500/50"></span>
            <span>
              <strong className="text-blue-400">重要不紧急</strong>：学习提升、健康管理、长期规划
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-500/50"></span>
            <span>
              <strong className="text-yellow-400">不重要紧急</strong>：某些会议、邮件回复、他人请求
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500/50"></span>
            <span>
              <strong className="text-green-400">不重要不紧急</strong>：社交媒体、娱乐消遣
            </span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
