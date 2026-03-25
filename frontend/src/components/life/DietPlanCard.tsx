// frontend/src/components/life/DietPlanCard.tsx
/**
 * Diet Plan Card Component
 * 显示三餐饮食计划
 */

import { motion } from "framer-motion";
import { Utensils, Flame, Droplet, TrendingUp } from "lucide-react";
import { MealPlan } from "@/hooks/use-life";

interface DietPlanCardProps {
  breakfast?: MealPlan;
  lunch?: MealPlan;
  dinner?: MealPlan;
}

function MealCard({
  title,
  icon,
  meal,
}: {
  title: string;
  icon: string;
  meal?: MealPlan;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold text-white">{title}</h4>
      </div>

      {meal ? (
        <div className="space-y-3">
          <div>
            <p className="text-lg font-semibold text-emerald-400">{meal.name}</p>
          </div>

          {/* 营养成分 */}
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Flame size={14} className="mx-auto mb-1 text-red-400" />
              <p className="text-xs text-gray-400">卡路里</p>
              <p className="text-sm font-bold text-red-400">{meal.calories}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Droplet size={14} className="mx-auto mb-1 text-blue-400" />
              <p className="text-xs text-gray-400">蛋白质</p>
              <p className="text-sm font-bold text-blue-400">{meal.protein}g</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <TrendingUp size={14} className="mx-auto mb-1 text-yellow-400" />
              <p className="text-xs text-gray-400">碳水</p>
              <p className="text-sm font-bold text-yellow-400">{meal.carbs}g</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Utensils size={14} className="mx-auto mb-1 text-purple-400" />
              <p className="text-xs text-gray-400">脂肪</p>
              <p className="text-sm font-bold text-purple-400">{meal.fat}g</p>
            </div>
          </div>

          {/* 食材 */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">主要食材</p>
              <div className="flex flex-wrap gap-1">
                {meal.ingredients.map((ingredient, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">暂无计划</p>
      )}
    </motion.div>
  );
}

export function DietPlanCard({ breakfast, lunch, dinner }: DietPlanCardProps) {
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">AI 饮食计划</h2>
        <p className="text-sm text-gray-400">
          根据您的健康数据生成的个性化三餐食谱
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MealCard title="早餐" icon="🌅" meal={breakfast} />
        <MealCard title="午餐" icon="☀️" meal={lunch} />
        <MealCard title="晚餐" icon="🌙" meal={dinner} />
      </div>

      {/* 营养总计 */}
      {breakfast && lunch && dinner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">总卡路里</p>
              <p className="text-2xl font-bold text-red-400">
                {breakfast.calories + lunch.calories + dinner.calories} kcal
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">总蛋白质</p>
              <p className="text-2xl font-bold text-blue-400">
                {breakfast.protein + lunch.protein + dinner.protein}g
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">总碳水</p>
              <p className="text-2xl font-bold text-yellow-400">
                {breakfast.carbs + lunch.carbs + dinner.carbs}g
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">总脂肪</p>
              <p className="text-2xl font-bold text-purple-400">
                {breakfast.fat + lunch.fat + dinner.fat}g
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
