// frontend/src/components/life/ExercisePlanCard.tsx
/**
 * Exercise Plan Card Component
 * 显示健身计划
 */

import { motion } from "framer-motion";
import { Dumbbell, Clock, Repeat, Activity } from "lucide-react";
import { ExercisePlanItem } from "@/hooks/use-life";

interface ExercisePlanCardProps {
  exercises?: ExercisePlanItem[];
}

const categoryColors = {
  warmup: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", label: "热身" },
  strength: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", label: "力量" },
  cardio: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", label: "有氧" },
  stretch: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", label: "拉伸" },
};

const categoryIcons = {
  warmup: "🔥",
  strength: "💪",
  cardio: "🏃",
  stretch: "🧘",
};

export function ExercisePlanCard({ exercises }: ExercisePlanCardProps) {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">AI 健身计划</h2>
          <p className="text-sm text-gray-400">暂无健身计划</p>
        </div>
      </div>
    );
  }

  // 按类别分组
  const grouped = exercises.reduce((acc, ex) => {
    if (!acc[ex.category]) {
      acc[ex.category] = [];
    }
    acc[ex.category].push(ex);
    return acc;
  }, {} as Record<string, ExercisePlanItem[]>);

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">AI 健身计划</h2>
        <p className="text-sm text-gray-400">
          根据您的健身水平生成的个性化训练计划
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => {
          const colors = categoryColors[category as keyof typeof categoryColors];
          const icon = categoryIcons[category as keyof typeof categoryIcons];

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{icon}</span>
                <h3 className={`text-lg font-bold ${colors.text}`}>
                  {colors.label}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {items.length} 个动作
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {items.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm`}
                  >
                    <div className="mb-3">
                      <h4 className="font-bold text-white">{exercise.name}</h4>
                      {exercise.description && (
                        <p className="text-xs text-gray-400 mt-1">
                          {exercise.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Dumbbell size={14} className="text-gray-400" />
                        <span className="text-gray-300">
                          {exercise.sets} 组
                        </span>
                      </div>

                      {exercise.reps ? (
                        <div className="flex items-center gap-1">
                          <Repeat size={14} className="text-gray-400" />
                          <span className="text-gray-300">
                            {exercise.reps} 次
                          </span>
                        </div>
                      ) : exercise.duration ? (
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-gray-300">
                            {Math.floor(exercise.duration / 60)}:
                              {(exercise.duration % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-1 ml-auto">
                        <Activity size={14} className="text-gray-400" />
                        <span className={`text-xs ${colors.text}`}>
                          {colors.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
