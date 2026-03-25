// frontend/src/app/(public)/agents/review/page.tsx
/**
 * Review Agent Page - Daily Review
 */
"use client";

import { useState } from "react";
import { useTodayReview, useReviews, useCreateReview, useUpdateReview, useAnalyzeQuadrants, type TaskAnalysisInput } from "@/hooks/use-review";
import { useTaskList } from "@/hooks/use-task";
import { ArrowLeft, Star, TrendingUp, Target, BookOpen, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { EisenhowerMatrix } from "@/components/review";

export default function ReviewAgentPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showQuadrantAnalysis, setShowQuadrantAnalysis] = useState(false);
  const { data: todayReview, isLoading: isLoadingToday } = useTodayReview();
  const { data: reviewsData } = useReviews(1, 7);
  const { data: tasksData } = useTaskList(1, 100); // 获取今日任务用于分析
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const analyzeQuadrants = useAnalyzeQuadrants();

  const [formData, setFormData] = useState({
    mood_score: 5,
    highlights: "",
    improvements: "",
    tasks_completed: 0,
    tasks_failed: 0,
  });

  const handleAnalyzeQuadrants = async () => {
    if (!tasksData?.tasks || tasksData.tasks.length === 0) {
      alert("暂无任务可分析");
      return;
    }

    // 转换任务格式
    const tasksForAnalysis: TaskAnalysisInput[] = tasksData.tasks.map((task) => ({
      title: task.title,
      description: task.description || "",
    }));

    analyzeQuadrants.mutate(tasksForAnalysis, {
      onSuccess: () => {
        setShowQuadrantAnalysis(true);
      },
      onError: (error) => {
        console.error("四象限分析失败:", error);
        alert("四象限分析失败，请稍后重试");
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = {
      review_date: new Date().toISOString().split("T")[0],
      ...formData,
      ai_summary: `今日心情评分：${formData.mood_score}/10`,
    };

    if (todayReview) {
      updateReview.mutate(
        { id: todayReview.id, data: reviewData },
        {
          onSuccess: () => {
            setIsEditing(false);
            setFormData({ mood_score: 5, highlights: "", improvements: "", tasks_completed: 0, tasks_failed: 0 });
          },
        }
      );
    } else {
      createReview.mutate(reviewData, {
        onSuccess: () => {
          setIsEditing(false);
          setFormData({ mood_score: 5, highlights: "", improvements: "", tasks_completed: 0, tasks_failed: 0 });
        },
      });
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Daily Review
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none">
              Review<span className="text-purple-400">.Mate</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              每日复盘，记录成长轨迹，成为更好的自己
            </p>
          </div>

          {todayReview && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
            >
              <BookOpen size={20} />
              编辑复盘
            </button>
          )}
        </div>

        {/* AI 分析按钮 */}
        <div className="mb-8 flex justify-end gap-4">
          <button
            onClick={handleAnalyzeQuadrants}
            disabled={analyzeQuadrants.isPending}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            <BrainCircuit size={20} />
            {analyzeQuadrants.isPending ? "分析中..." : "AI 分析任务优先级"}
          </button>
          {showQuadrantAnalysis && (
            <button
              onClick={() => setShowQuadrantAnalysis(false)}
              className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              收起四象限
            </button>
          )}
        </div>

        {/* Today's Review Card */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" />
            今日复盘
          </h2>

          {isLoadingToday ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-500">
              加载中...
            </div>
          ) : todayReview || isEditing ? (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
              {/* Mood Score */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">今日心情</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.mood_score}
                    onChange={(e) => setFormData({ ...formData, mood_score: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-3xl font-black text-purple-400 w-12 text-center">
                    {formData.mood_score}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>1 - 糟糕</span>
                  <span>5 - 普通</span>
                  <span>10 - 完美</span>
                </div>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Target size={16} className="text-green-400" />
                    完成任务数
                  </label>
                  <input
                    type="number"
                    value={formData.tasks_completed}
                    onChange={(e) => setFormData({ ...formData, tasks_completed: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <TrendingUp size={16} className="text-red-400" />
                    失败任务数
                  </label>
                  <input
                    type="number"
                    value={formData.tasks_failed}
                    onChange={(e) => setFormData({ ...formData, tasks_failed: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">✨ 今日亮点</label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  placeholder="今天发生了什么值得庆祝的事情？..."
                  rows={3}
                />
              </div>

              {/* Improvements */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">📈 改进空间</label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  placeholder="明天可以做得更好的是什么？..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createReview.isPending || updateReview.isPending}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {createReview.isPending || updateReview.isPending ? "保存中..." : "保存复盘"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    取消
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-slate-400 mb-4">今天还没有复盘</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-all"
              >
                开始复盘
              </button>
            </div>
          )}
        </div>

        {/* Eisenhower Matrix - 四象限分析 */}
        {showQuadrantAnalysis && analyzeQuadrants.data && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              <BrainCircuit className="text-cyan-400" />
              四象限分析
            </h2>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <EisenhowerMatrix analysis={analyzeQuadrants.data} />
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-400" />
            历史复盘
          </h2>

          <div className="space-y-3">
            {reviewsData?.reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-white">
                    {new Date(review.review_date).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-purple-400">{review.mood_score}</span>
                    <span className="text-xs text-slate-500">/ 10</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Target size={16} className="text-green-400" />
                    <span className="text-slate-400">完成：</span>
                    <span className="text-white font-bold">{review.tasks_completed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp size={16} className="text-red-400" />
                    <span className="text-slate-400">失败：</span>
                    <span className="text-white font-bold">{review.tasks_failed}</span>
                  </div>
                </div>
                {review.highlights && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">✨ 亮点</p>
                    <p className="text-sm text-slate-300">{review.highlights}</p>
                  </div>
                )}
                {review.improvements && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">📈 改进</p>
                    <p className="text-sm text-slate-300">{review.improvements}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
