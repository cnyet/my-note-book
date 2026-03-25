// frontend/src/components/review/QuadrantCard.tsx
/**
 * Quadrant Card Component
 * Displays tasks for a single Eisenhower Matrix quadrant
 */

import { motion } from "framer-motion";
import { QuadrantTask } from "@/hooks/use-review";

interface QuadrantCardProps {
  title: string;
  subtitle: string;
  tasks: QuadrantTask[];
  color: "red" | "blue" | "yellow" | "green";
  onTaskDrop?: (task: QuadrantTask) => void;
}

const colorVariants = {
  red: {
    border: "border-red-500/50",
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300",
  },
  blue: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
  },
  yellow: {
    border: "border-yellow-500/50",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
  green: {
    border: "border-green-500/50",
    bg: "bg-green-500/10",
    text: "text-green-400",
    badge: "bg-green-500/20 text-green-300",
  },
};

export function QuadrantCard({
  title,
  subtitle,
  tasks,
  color,
  onTaskDrop,
}: QuadrantCardProps) {
  const variant = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl border ${variant.border} ${variant.bg} p-4 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className={`text-lg font-semibold ${variant.text}`}>{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">
            暂无任务
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg ${variant.badge} p-3 text-sm`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify(task)
                );
              }}
            >
              <div className="font-medium">{task.title}</div>
              {task.description && (
                <div className="mt-1 text-xs opacity-70">{task.description}</div>
              )}
              {task.reason && (
                <div className="mt-2 text-xs italic opacity-50">
                  💡 {task.reason}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Drop Zone Indicator */}
      {onTaskDrop && (
        <div
          className="absolute inset-0 rounded-xl border-2 border-dashed border-transparent transition-colors hover:border-white/20"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("application/json");
            if (data) {
              try {
                const task = JSON.parse(data) as QuadrantTask;
                onTaskDrop(task);
              } catch {
                // Invalid data
              }
            }
          }}
        />
      )}
    </motion.div>
  );
}
