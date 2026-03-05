"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Keyboard,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Breadcrumb, generateBreadcrumbItems } from "./shared/Breadcrumb";
import { DateRangePicker } from "./shared/DateRangePicker";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

/** 通知数据 */
const NOTIFICATIONS = [
  {
    id: 1,
    title: "New order received",
    time: "5 mins ago",
    type: "info",
    read: false,
  },
  {
    id: 2,
    title: "Server reboot completed",
    time: "1 hour ago",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "Payment failed for #1234",
    time: "3 hours ago",
    type: "error",
    read: true,
  },
  {
    id: 4,
    title: "New user registered",
    time: "5 hours ago",
    type: "info",
    read: true,
  },
];

const TYPE_CONFIG = {
  info: { icon: AlertCircle, color: "#03c3ec", bg: "bg-duralux-info-transparent text-duralux-info" },
  success: { icon: CheckCircle, color: "#71dd37", bg: "bg-duralux-success-transparent text-duralux-success" },
  error: { icon: AlertCircle, color: "#ff3e1d", bg: "bg-duralux-danger-transparent text-duralux-danger" },
  warning: { icon: Clock, color: "#ffab00", bg: "bg-duralux-warning-transparent text-duralux-warning" },
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [dateRange, setDateRange] = useState<
    { startDate: Date; endDate: Date } | undefined
  >();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const breadcrumbItems = generateBreadcrumbItems(pathname);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-[#2b2c40]/80 backdrop-blur-xl border-b border-duralux-border-light dark:border-duralux-border-dark">
      {/* Header 内容行 */}
      <div className="flex items-center justify-between h-[72px] px-6">
        {/* 左侧：菜单按钮 + Breadcrumb + 搜索框 */}
        <div className="flex items-center gap-4">
          {/* 菜单按钮 - 移动端 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-duralux-bg-page text-duralux-text-secondary"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center"
          >
            <Breadcrumb items={breadcrumbItems} className="text-duralux-text-muted" />
          </motion.div>

          {/* 搜索框 - Duralux Style */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex items-center relative"
          >
            <div
              className={cn(
                "flex items-center w-64 lg:w-80 px-4 py-2.5 rounded-xl transition-all duration-200",
                searchFocused
                  ? "bg-white dark:bg-duralux-bg-dark-card shadow-[0_0_0_2px_rgba(105,108,255,0.2)]"
                  : "bg-duralux-bg-page hover:bg-duralux-bg-hover dark:bg-duralux-bg-dark-card"
              )}
            >
              <Search className="w-4 h-4 mr-3 text-duralux-text-muted" />
              <input
                type="text"
                placeholder="Search (Ctrl+K)"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-duralux-text-primary placeholder:text-duralux-text-muted"
              />
              <kbd className="hidden lg:inline-flex px-2 py-0.5 text-xs bg-white dark:bg-duralux-bg-dark-card rounded text-duralux-text-muted border border-duralux-border-light dark:border-duralux-border-dark">
                ⌘K
              </kbd>
            </div>
          </motion.div>
        </div>

        {/* 右侧：功能按钮 */}
        <div className="flex items-center gap-2">
          {/* 日期选择器 */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="hidden lg:flex"
          />

          {/* 主题切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </motion.button>

          {/* 通知 - Duralux Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-duralux-danger rounded-full border-2 border-white dark:border-duralux-bg-dark"
                  />
                )}
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 border-b border-duralux-border-light dark:border-duralux-border-dark">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-duralux-text-primary">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-duralux-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto duralux-scrollbar">
                {notifications.map((notification) => {
                  const config =
                    TYPE_CONFIG[notification.type as keyof typeof TYPE_CONFIG];
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "py-3 px-4 cursor-pointer flex gap-3 transition-colors",
                        !notification.read && "bg-duralux-bg-page"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          config.bg
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm truncate",
                            !notification.read
                              ? "font-semibold text-duralux-text-primary"
                              : "text-duralux-text-muted"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-duralux-text-muted mt-0.5">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 text-center cursor-pointer text-duralux-primary hover:bg-duralux-bg-page">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 用户头像 - Duralux Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-full p-0 hover:ring-2 hover:ring-duralux-primary/20 transition-all"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-duralux-border-light dark:border-duralux-border-dark">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                      alt={user?.username}
                    />
                    <AvatarFallback className="bg-duralux-bg-page text-duralux-text-primary">
                      {user?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-duralux-success border-2 border-white dark:border-duralux-bg-dark rounded-full" />
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 border-b border-duralux-border-light dark:border-duralux-border-dark">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                    />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-duralux-text-primary">
                      {user?.username || "John Doe"}
                    </p>
                    <p className="text-xs leading-none text-duralux-text-muted">
                      Administrator
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-duralux-text-secondary hover:text-duralux-primary hover:bg-duralux-bg-page">
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-duralux-text-secondary hover:text-duralux-primary hover:bg-duralux-bg-page">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 px-4 text-duralux-danger hover:text-duralux-danger hover:bg-duralux-danger-transparent cursor-pointer"
                onClick={logout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
