import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface StatCardProps extends Omit<HTMLMotionProps<"div">, "title"> {
  icon: ReactNode;
  label: string;
  value: number | string;
  gradient?: "blue" | "green" | "orange" | "gray" | "purple" | "pink" | "cyan" | "indigo";
  className?: string;
}

const gradientMap = {
  blue: "from-blue-500/15 to-blue-600/5",
  green: "from-emerald-500/15 to-green-600/5",
  orange: "from-orange-500/15 to-amber-600/5",
  gray: "from-gray-500/15 to-gray-600/5",
  purple: "from-purple-500/15 to-violet-600/5",
  pink: "from-pink-500/15 to-rose-600/5",
  cyan: "from-cyan-500/15 to-teal-600/5",
  indigo: "from-indigo-500/15 to-purple-600/5",
};

const iconBgMap = {
  blue: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-500",
  green: "bg-gradient-to-br from-emerald-500/20 to-green-600/10 text-emerald-500",
  orange: "bg-gradient-to-br from-orange-500/20 to-amber-600/10 text-orange-500",
  gray: "bg-gradient-to-br from-gray-500/20 to-gray-600/10 text-gray-500",
  purple: "bg-gradient-to-br from-purple-500/20 to-violet-600/10 text-purple-500",
  pink: "bg-gradient-to-br from-pink-500/20 to-rose-600/10 text-pink-500",
  cyan: "bg-gradient-to-br from-cyan-500/20 to-teal-600/10 text-cyan-500",
  indigo: "bg-gradient-to-br from-indigo-500/20 to-purple-600/10 text-indigo-500",
};

const borderGradientMap = {
  blue: "hover:border-blue-500/30",
  green: "hover:border-emerald-500/30",
  orange: "hover:border-orange-500/30",
  gray: "hover:border-gray-500/30",
  purple: "hover:border-purple-500/30",
  pink: "hover:border-pink-500/30",
  cyan: "hover:border-cyan-500/30",
  indigo: "hover:border-indigo-500/30",
};

const shadowMap = {
  blue: "hover:shadow-blue-500/20",
  green: "hover:shadow-emerald-500/20",
  orange: "hover:shadow-orange-500/20",
  gray: "hover:shadow-gray-500/20",
  purple: "hover:shadow-purple-500/20",
  pink: "hover:shadow-pink-500/20",
  cyan: "hover:shadow-cyan-500/20",
  indigo: "hover:shadow-indigo-500/20",
};

export function StatCard({
  icon,
  label,
  value,
  gradient = "blue",
  className = "",
  ...props
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a2e] p-5 shadow-lg ${shadowMap[gradient]} border border-gray-200 dark:border-white/10 ${borderGradientMap[gradient]} hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[gradient]}`} />

      {/* Glow Effect on Hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientMap[gradient].replace('/15', '/30').replace('/5', '/15')} rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none`} />

      <div className="relative flex items-center gap-4">
        {/* Icon - Enhanced with gradient background */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgMap[gradient]} shadow-sm`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
