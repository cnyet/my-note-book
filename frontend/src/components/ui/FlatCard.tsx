"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FlatCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function FlatCard({ children, className, hover = true }: FlatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "backdrop-blur-md bg-white/5",
        "border border-white/10 rounded-xl",
        hover &&
          "hover:border-indigo-400/30 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
