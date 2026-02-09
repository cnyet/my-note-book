"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: "primary" | "accent" | "none";
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  hoverable = true,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    primary:
      "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:shadow-glow-primary before:opacity-0 hover:before:opacity-20 before:transition-opacity",
    accent:
      "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:shadow-glow-accent before:opacity-0 hover:before:opacity-20 before:transition-opacity",
    none: "",
  };

  return (
    <motion.div
      whileHover={hoverable ? { translateY: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative glass-effect rounded-2xl p-6 overflow-hidden",
        glow !== "none" && glowStyles[glow],
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>

      {/* Subtle shine effect */}
      {hoverable && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
    </motion.div>
  );
}
