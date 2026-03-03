import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface StatCardProps extends Omit<HTMLMotionProps<"div">, "title"> {
  icon: ReactNode;
  label: string;
  value: number | string;
  gradient?: "blue" | "green" | "orange" | "gray" | "purple" | "pink" | "cyan";
  className?: string;
}

const gradientMap = {
  blue: "from-blue-500/20 to-blue-600/10",
  green: "from-green-500/20 to-green-600/10",
  orange: "from-orange-500/20 to-orange-600/10",
  gray: "from-gray-500/20 to-gray-600/10",
  purple: "from-purple-500/20 to-purple-600/10",
  pink: "from-pink-500/20 to-pink-600/10",
  cyan: "from-cyan-500/20 to-cyan-600/10",
};

const iconBgMap = {
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-green-500/10 text-green-500",
  orange: "bg-orange-500/10 text-orange-500",
  gray: "bg-gray-500/10 text-gray-500",
  purple: "bg-purple-500/10 text-purple-500",
  pink: "bg-pink-500/10 text-pink-500",
  cyan: "bg-cyan-500/10 text-cyan-500",
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
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#1e1e2f] p-5 shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[gradient]} opacity-50`} />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgMap[gradient]}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
