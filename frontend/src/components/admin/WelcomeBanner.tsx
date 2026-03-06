"use client";

import { Card } from "antd";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function WelcomeBanner() {
  return (
    <Card
      className="h-full border-none rounded-2xl shadow-duralux-card dark:shadow-duralux-card-dark overflow-hidden"
      bordered={false}
      styles={{ body: { padding: "0" } }}
    >
      <div className="relative bg-white dark:bg-duralux-bg-dark-card p-8">
        <div className="flex items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Icon Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-duralux-primary/10 to-duralux-primary-dark/10 border border-duralux-primary/20 mb-4">
                <Sparkles className="w-4 h-4 text-duralux-primary" />
                <span className="text-sm font-medium text-duralux-primary">
                  Admin Dashboard
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-3">
                Welcome back, Admin
              </h1>

              {/* Description */}
              <p className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary text-base leading-relaxed">
                Manage your AI agents, tools, and labs from a centralized platform.
                Track performance metrics and monitor system health in real-time.
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-duralux-success animate-pulse" />
                  <span className="text-sm text-duralux-text-muted">
                    All systems operational
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-duralux-primary" />
                  <span className="text-sm text-duralux-text-muted">
                    5 modules active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Optional Image/Icon */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-32 h-32 lg:w-40 lg:h-40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-duralux-primary/20 to-duralux-primary-dark/20 rounded-full blur-2xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-duralux-primary to-duralux-primary-dark flex items-center justify-center shadow-xl">
                  <Sparkles className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Optional Bottom Image Strip */}
        <div className="mt-6 pt-6 border-t border-duralux-border-light dark:border-duralux-border-dark">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                99.9%
              </div>
              <div className="text-xs text-duralux-text-muted mt-1">
                Uptime
              </div>
            </div>
            <div className="w-px h-8 bg-duralux-border-light dark:bg-duralux-border-dark" />
            <div className="text-center">
              <div className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                24/7
              </div>
              <div className="text-xs text-duralux-text-muted mt-1">
                Monitoring
              </div>
            </div>
            <div className="w-px h-8 bg-duralux-border-light dark:bg-duralux-border-dark" />
            <div className="text-center">
              <div className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                &lt;50ms
              </div>
              <div className="text-xs text-duralux-text-muted mt-1">
                Response
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
