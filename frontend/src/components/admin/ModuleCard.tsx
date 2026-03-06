import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  gradient: "blue" | "green" | "orange" | "purple" | "pink" | "cyan" | "indigo";
  href: string;
  className?: string;
}

const gradientMap: Record<string, string> = {
  blue: "from-blue-500/15 to-blue-600/5",
  green: "from-emerald-500/15 to-green-600/5",
  orange: "from-orange-500/15 to-amber-600/5",
  purple: "from-purple-500/15 to-violet-600/5",
  pink: "from-pink-500/15 to-rose-600/5",
  cyan: "from-cyan-500/15 to-teal-600/5",
  indigo: "from-indigo-500/15 to-purple-600/5",
};

const iconBgMap: Record<string, string> = {
  blue: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-500",
  green: "bg-gradient-to-br from-emerald-500/20 to-green-600/10 text-emerald-500",
  orange: "bg-gradient-to-br from-orange-500/20 to-amber-600/10 text-orange-500",
  purple: "bg-gradient-to-br from-purple-500/20 to-violet-600/10 text-purple-500",
  pink: "bg-gradient-to-br from-pink-500/20 to-rose-600/10 text-pink-500",
  cyan: "bg-gradient-to-br from-cyan-500/20 to-teal-600/10 text-cyan-500",
  indigo: "bg-gradient-to-br from-indigo-500/20 to-purple-600/10 text-indigo-500",
};

export function ModuleCard({
  title,
  value,
  icon: Icon,
  gradient = "blue",
  href,
  className,
}: ModuleCardProps) {
  return (
    <a href={href} className="block no-underline">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative overflow-hidden rounded-xl bg-white dark:bg-duralux-bg-dark-card p-5 shadow-duralux-card dark:shadow-duralux-card-dark",
          "border border-gray-200 dark:border-white/10",
          "hover:shadow-xl transition-all duration-300",
          className
        )}
      >
        {/* Background Gradient */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientMap[gradient])} />

        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center", iconBgMap[gradient])}>
            <Icon size={18} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-duralux-text-muted uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mt-0.5">
              {value}
            </p>
          </div>
        </div>
      </motion.div>
    </a>
  );
}
