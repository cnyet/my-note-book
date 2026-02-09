"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface GlitchTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({
  children,
  className,
  intensity = "medium",
  ...props
}: GlitchTextProps) {
  const intensityMap = {
    low: "animate-glitch-slow",
    medium: "animate-glitch",
    high: "animate-glitch-fast",
  };

  return (
    <span
      className={cn(
        "relative inline-block group",
        "before:content-[attr(data-text)] before:absolute before:top-0 before:left-[-1px] before:text-accent/50 before:bg-transparent before:overflow-hidden before:clip-path-glitch-1 before:animate-glitch-1",
        "after:content-[attr(data-text)] after:absolute after:top-0 after:left-[1px] after:text-primary/50 after:bg-transparent after:overflow-hidden after:clip-path-glitch-2 after:animate-glitch-2",
        className,
      )}
      data-text={children}
      {...props}
    >
      <span className={cn("relative z-10", intensityMap[intensity])}>
        {children}
      </span>
    </span>
  );
}
