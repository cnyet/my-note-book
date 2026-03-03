import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className = "", hover = true, gradient = false, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#1e1e2f] shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50" />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export interface StatusBadgeProps {
  status: "online" | "offline" | "idle" | "experimental" | "preview" | "live" | "archived" | "active" | "inactive";
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig = {
  // Agent statuses
  online: { color: "#71dd37", bg: "bg-green-500/10", label: "Online" },
  offline: { color: "#697a8d", bg: "bg-gray-500/10", label: "Offline" },
  idle: { color: "#ffab00", bg: "bg-orange-500/10", label: "Idle" },
  active: { color: "#71dd37", bg: "bg-green-500/10", label: "Active" },
  inactive: { color: "#697a8d", bg: "bg-gray-500/10", label: "Inactive" },
  // Lab statuses
  experimental: { color: "#ffab00", bg: "bg-orange-500/10", label: "Experimental" },
  preview: { color: "#00cfdd", bg: "bg-cyan-500/10", label: "Preview" },
  live: { color: "#71dd37", bg: "bg-green-500/10", label: "Live" },
  archived: { color: "#697a8d", bg: "bg-gray-500/10", label: "Archived" },
};

export function StatusBadge({ status, label, size = "sm", className = "" }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider ${config.bg} rounded-md ${
        size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      } ${className}`}
      style={{ color: config.color }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "online" || status === "active" || status === "live"
            ? "bg-current animate-pulse"
            : "bg-current"
        }`}
      />
      {displayLabel}
    </span>
  );
}

export interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  Dev: { color: "#696cff", bg: "bg-indigo-500/10" },
  Auto: { color: "#71dd37", bg: "bg-green-500/10" },
  Intel: { color: "#00cfdd", bg: "bg-cyan-500/10" },
  Creative: { color: "#ffab00", bg: "bg-orange-500/10" },
  Default: { color: "#697a8d", bg: "bg-gray-500/10" },
};

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const config = categoryColors[category] || categoryColors.Default;

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wider ${config.bg} rounded-md px-2.5 py-1 text-[10px] ${className}`}
      style={{ color: config.color }}
    >
      {category}
    </span>
  );
}
