// frontend/src/app/(public)/agents/life/page.tsx
/**
 * Life Agent Page - Health Metrics Tracker
 */
"use client";

import { useState } from "react";
import { useHealthMetrics, useSaveHealthMetrics, useGenerateSuggestion } from "@/hooks/use-life";
import { ArrowLeft, Plus, Heart, Droplets, Moon, Activity } from "lucide-react";
import Link from "next/link";

export default function LifeAgentPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: metricsData, isLoading } = useHealthMetrics(1, 10);
  const saveMetrics = useSaveHealthMetrics();
  const generateSuggestion = useGenerateSuggestion();

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    health_status: "good",
    exercise_frequency: "weekly",
    diet_preference: "normal",
    sleep_hours: "",
    water_intake: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMetrics.mutate(
      {
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        health_status: formData.health_status || undefined,
        exercise_frequency: formData.exercise_frequency || undefined,
        diet_preference: formData.diet_preference || undefined,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : undefined,
        water_intake: formData.water_intake ? parseInt(formData.water_intake) : undefined,
        notes: formData.notes || undefined,
      },
      {
        onSuccess: () => {
          setFormData({
            height: "",
            weight: "",
            health_status: "good",
            exercise_frequency: "weekly",
            diet_preference: "normal",
            sleep_hours: "",
            water_intake: "",
            notes: "",
          });
          setShowForm(false);
        },
      }
    );
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Health Tracker
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              Life<span className="text-red-400">.Vital</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              记录健康数据，获取 AI 驱动的个性化健康建议
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-red-500/25"
          >
            <Plus size={20} />
            {showForm ? "取消" : "记录数据"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-red-400" size={20} />
              <span className="text-sm text-slate-400">健康状况</span>
            </div>
            <p className="text-2xl font-black text-white">
              {metricsData?.metrics[0]?.health_status || "-"}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="text-blue-400" size={20} />
              <span className="text-sm text-slate-400">今日饮水</span>
            </div>
            <p className="text-2xl font-black text-white">
              {metricsData?.metrics[0]?.water_intake ? `${metricsData.metrics[0].water_intake}ml` : "-"}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Moon className="text-purple-400" size={20} />
              <span className="text-sm text-slate-400">睡眠时长</span>
            </div>
            <p className="text-2xl font-black text-white">
              {metricsData?.metrics[0]?.sleep_hours ? `${metricsData.metrics[0].sleep_hours}h` : "-"}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-green-400" size={20} />
              <span className="text-sm text-slate-400">运动频率</span>
            </div>
            <p className="text-2xl font-black text-white">
              {metricsData?.metrics[0]?.exercise_frequency || "-"}
            </p>
          </div>
        </div>

        {/* Input Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">身高 (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">体重 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="70.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">睡眠 (小时)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="7.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">饮水 (ml)</label>
                <input
                  type="number"
                  value={formData.water_intake}
                  onChange={(e) => setFormData({ ...formData, water_intake: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">健康状况</label>
                <select
                  value={formData.health_status}
                  onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="excellent">优秀</option>
                  <option value="good">良好</option>
                  <option value="fair">一般</option>
                  <option value="poor">较差</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">运动频率</label>
                <select
                  value={formData.exercise_frequency}
                  onChange={(e) => setFormData({ ...formData, exercise_frequency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="rarely">偶尔</option>
                  <option value="never">从不</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">饮食偏好</label>
                <select
                  value={formData.diet_preference}
                  onChange={(e) => setFormData({ ...formData, diet_preference: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="normal">正常</option>
                  <option value="vegetarian">素食</option>
                  <option value="vegan">纯素</option>
                  <option value="keto">生酮</option>
                  <option value="low-carb">低碳</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">备注</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="其他备注信息..."
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saveMetrics.isPending}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {saveMetrics.isPending ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* History List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white mb-4">历史记录</h2>
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">加载中...</div>
          ) : metricsData?.metrics.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>暂无健康记录</p>
              <p className="text-sm mt-2">点击「记录数据」添加第一条记录</p>
            </div>
          ) : (
            metricsData?.metrics.map((metric) => (
              <div
                key={metric.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">
                    {new Date(metric.created_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                    {metric.health_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {metric.height && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">身高</p>
                      <p className="text-lg font-bold text-white">{metric.height} cm</p>
                    </div>
                  )}
                  {metric.weight && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">体重</p>
                      <p className="text-lg font-bold text-white">{metric.weight} kg</p>
                    </div>
                  )}
                  {metric.sleep_hours && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">睡眠</p>
                      <p className="text-lg font-bold text-white">{metric.sleep_hours} h</p>
                    </div>
                  )}
                  {metric.water_intake && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">饮水</p>
                      <p className="text-lg font-bold text-white">{metric.water_intake} ml</p>
                    </div>
                  )}
                </div>
                {metric.notes && (
                  <p className="mt-4 text-sm text-slate-400">{metric.notes}</p>
                )}
                {metric.suggestions && metric.suggestions.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <h4 className="text-sm font-bold text-red-400 mb-2">AI 建议</h4>
                    {metric.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="space-y-1">
                        {suggestion.diet_suggestion && (
                          <p className="text-sm text-slate-300">🍽️ {suggestion.diet_suggestion}</p>
                        )}
                        {suggestion.exercise_suggestion && (
                          <p className="text-sm text-slate-300">💪 {suggestion.exercise_suggestion}</p>
                        )}
                        {suggestion.lifestyle_suggestion && (
                          <p className="text-sm text-slate-300">🌿 {suggestion.lifestyle_suggestion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
