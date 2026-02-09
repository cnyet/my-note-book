"use client";

import { GlassCard } from "@/components/v-ui/GlassCard";
import { OnlinePulse } from "@/components/v-ui/OnlinePulse";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface HolographicCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  themeColor: string;
  status: "online" | "offline" | "busy" | "training" | "idle";
  metrics?: { label: string; value: number }[];
  className?: string;
  onClick?: () => void;
}

export function HolographicCard({
  name,
  description,
  icon,
  themeColor,
  status,
  metrics = [],
  className,
  onClick,
}: HolographicCardProps) {
  return (
    <GlassCard
      onClick={onClick}
      className={cn(
        "relative overflow-hidden group cursor-pointer transition-all duration-500",
        "border-white/5 hover:border-white/20 hover:shadow-[0_0_30px_-10px] shadow-primary/20",
        className,
      )}
    >
      {/* Holographic Background Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${themeColor} 0%, transparent 40%)`,
        }}
      />

      {/* Animated Scanlines (Always active but subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="relative z-10 flex flex-col h-full space-y-6">
        <div className="flex justify-between items-start">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundColor: `${themeColor}20`,
              borderColor: `${themeColor}40`,
              color: themeColor,
            }}
          >
            {icon}
          </div>
          <OnlinePulse status={status} showLabel />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold tracking-tight">
            {name}
          </h3>
          <p className="text-text-muted text-sm font-body line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-tighter">
                  <span>{m.label}</span>
                  <span>{m.value}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
