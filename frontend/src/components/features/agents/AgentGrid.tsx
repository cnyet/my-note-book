"use client";

import { BarChart3, CheckCircle, Heart, Newspaper, Shirt } from "lucide-react";
import { HolographicCard } from "./HolographicCard";

const agents = [
  {
    id: "news",
    name: "News Agent",
    description: "Daily AI technology briefing and trend analysis.",
    icon: <Newspaper size={24} />,
    themeColor: "#00f2ff",
    status: "online" as const,
    metrics: [
      { label: "Accuracy", value: 98 },
      { label: "Speed", value: 92 },
      { label: "Relevance", value: 95 },
    ],
  },
  {
    id: "outfit",
    name: "Outfit Agent",
    description:
      "Personalized style recommendations based on weather and schedule.",
    icon: <Shirt size={24} />,
    themeColor: "#3b82f6",
    status: "online" as const,
    metrics: [
      { label: "Style", value: 88 },
      { label: "Context", value: 94 },
      { label: "Trend", value: 90 },
    ],
  },
  {
    id: "task",
    name: "Task Agent",
    description: "Intelligent task prioritization and workflow automation.",
    icon: <CheckCircle size={24} />,
    themeColor: "#10b981",
    status: "busy" as const,
    metrics: [
      { label: "Done", value: 75 },
      { label: "Priority", value: 85 },
      { label: "Load", value: 60 },
    ],
  },
  {
    id: "life",
    name: "Life Agent",
    description: "Health tracking and lifestyle optimization advice.",
    icon: <Heart size={24} />,
    themeColor: "#ec4899",
    status: "online" as const,
    metrics: [
      { label: "Vitals", value: 96 },
      { label: "Sleep", value: 82 },
      { label: "Active", value: 89 },
    ],
  },
  {
    id: "review",
    name: "Review Agent",
    description: "Daily retrospective and emotional intelligence insights.",
    icon: <BarChart3 size={24} />,
    themeColor: "#f59e0b",
    status: "idle" as const,
    metrics: [
      { label: "Depth", value: 91 },
      { label: "Recall", value: 88 },
      { label: "Score", value: 94 },
    ],
  },
];

export function AgentGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {agents.map((agent) => (
        <HolographicCard
          key={agent.id}
          {...agent}
          className={agent.id === "news" ? "sm:col-span-2" : ""}
        />
      ))}
      {/* Placeholder for future Agent */}
      <div className="hidden sm:flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-text-muted hover:border-white/10 hover:text-text-secondary transition-all group">
        <span className="text-xs uppercase tracking-widest font-mono group-hover:scale-105 transition-transform">
          + Add Custom Agent
        </span>
      </div>
    </div>
  );
}
