"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "accent" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function NeonButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: NeonButtonProps) {
  const variants = {
    primary:
      "bg-primary text-abyss neon-glow-primary border-transparent hover:brightness-110",
    accent:
      "bg-accent text-white neon-glow-accent border-transparent hover:brightness-110",
    success:
      "bg-success text-abyss shadow-[0_0_20px_rgba(0,255,136,0.3)] border-transparent hover:brightness-110",
    outline:
      "bg-transparent text-text-primary border border-white/10 hover:border-primary/50 hover:bg-white/5 hover:text-primary",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-10 py-4 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-lg font-bold tracking-tight transition-all duration-300 border inline-flex items-center justify-center whitespace-nowrap",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children as React.ReactNode}
      </span>
    </motion.button>
  );
}
