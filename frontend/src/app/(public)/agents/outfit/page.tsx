// frontend/src/app/(public)/agents/outfit/page.tsx
/**
 * Outfit Agent Page - Daily Outfit Recommendation
 */
"use client";

import { useState } from "react";
import { useTodayOutfit, useOutfitRecommendations, useCreateOutfitRecommendation, useGenerateOutfitRecommendation } from "@/hooks/use-outfit";
import { ArrowLeft, Sun, Cloud, CloudRain, Shirt, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function OutfitAgentPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleInput, setScheduleInput] = useState("");
  const { data: todayOutfit, isLoading: isLoadingToday } = useTodayOutfit();
  const { data: outfitsData } = useOutfitRecommendations(1, 7);
  const createOutfit = useCreateOutfitRecommendation();
  const generateOutfit = useGenerateOutfitRecommendation();

  const handleGenerate = () => {
    setIsGenerating(true);
    generateOutfit.mutate(
      {
        recommend_date: new Date().toISOString().split("T")[0],
        schedule_input: scheduleInput || undefined,
      },
      {
        onSuccess: () => {
          setIsGenerating(false);
          setScheduleInput("");
        },
        onError: () => {
          setIsGenerating(false);
        },
      }
    );
  };

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <Sun size={24} className="text-yellow-400" />;
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun size={24} className="text-yellow-400" />;
      case "cloudy":
        return <Cloud size={24} className="text-gray-400" />;
      case "rainy":
        return <CloudRain size={24} className="text-blue-400" />;
      default:
        return <Sun size={24} className="text-yellow-400" />;
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Style Advisor
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              Outfit<span className="text-orange-400">.AI</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              AI 穿搭推荐，根据天气和日程为你搭配完美造型
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || generateOutfit.isPending}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating || generateOutfit.isPending ? "生成中..." : "生成穿搭"}
          </button>
        </div>

        {/* Today's Outfit Card */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
            <Shirt className="text-orange-400" />
            今日穿搭
          </h2>

          {isLoadingToday ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-500">
              加载中...
            </div>
          ) : todayOutfit ? (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Outfit Image Placeholder */}
                <div className="w-full md:w-64 h-64 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                  {todayOutfit.outfit_image_url ? (
                    <img
                      src={todayOutfit.outfit_image_url}
                      alt="Outfit recommendation"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <Shirt size={64} className="text-orange-400/50" />
                  )}
                </div>

                {/* Outfit Details */}
                <div className="flex-1 space-y-6">
                  {/* Weather Info */}
                  {todayOutfit.weather_data && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      {getWeatherIcon(todayOutfit.weather_data.condition || undefined)}
                      <div>
                        <p className="text-white font-bold">
                          {todayOutfit.weather_data.temperature || 0}°C
                        </p>
                        <p className="text-sm text-slate-400">
                          {todayOutfit.weather_data.condition || "晴朗"}
                        </p>
                      </div>
                      {todayOutfit.weather_data.humidity && (
                        <div className="ml-auto text-right">
                          <p className="text-xs text-slate-500">湿度</p>
                          <p className="text-sm text-white font-bold">
                            {todayOutfit.weather_data.humidity}%
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schedule Info */}
                  {todayOutfit.schedule_input && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">今日日程</p>
                      <p className="text-white">{todayOutfit.schedule_input}</p>
                    </div>
                  )}

                  {/* Outfit Description */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">穿搭建议</p>
                    <p className="text-lg text-white font-medium leading-relaxed">
                      {todayOutfit.outfit_description}
                    </p>
                  </div>

                  {/* AI Notes */}
                  {todayOutfit.ai_notes && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <p className="text-sm text-orange-300">{todayOutfit.ai_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Shirt size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 mb-4">今天还没有穿搭推荐</p>
              <div className="max-w-md mx-auto mb-4">
                <input
                  type="text"
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 mb-4"
                  placeholder="告诉我今天的日程安排（可选）..."
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={generateOutfit.isPending}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {generateOutfit.isPending ? "生成中..." : "AI 生成穿搭"}
              </button>
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <h2 className="text-2xl font-black text-white mb-4">历史穿搭</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outfitsData?.recommendations.map((outfit) => (
              <div
                key={outfit.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">
                    {new Date(outfit.recommend_date).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </span>
                  {outfit.is_generated ? (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      AI 生成
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                      手动创建
                    </span>
                  )}
                </div>
                {outfit.outfit_image_url && (
                  <div className="mb-4 h-32 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 overflow-hidden">
                    <img
                      src={outfit.outfit_image_url}
                      alt="Outfit"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-slate-300 line-clamp-3">
                  {outfit.outfit_description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
