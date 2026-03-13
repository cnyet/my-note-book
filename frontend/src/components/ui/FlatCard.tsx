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
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "backdrop-blur-md bg-white/5",
        "border border-white/10 rounded-xl",
        hover &&
          "hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10 hover:-translate-y-1",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
