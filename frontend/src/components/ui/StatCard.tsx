"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  color: "indigo" | "emerald" | "amber" | "purple";
}

const colorMap = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  purple: "from-purple-500 to-purple-600",
};

export function StatCard({ value, label, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-3xl font-black text-white">{value}</div>
          <div className="text-sm text-slate-400">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
