"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Expand,
  Globe,
  HelpCircle,
  LogOut,
  Mail,
  Menu,
  Moon,
  Search,
  Settings,
  Shrink,
  Sun,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Breadcrumb, generateBreadcrumbItems } from "./shared/Breadcrumb";

/** 通知数据 */
const NOTIFICATIONS = [
  {
    id: 1,
    title: "New order received #8934",
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

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAdminAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const breadcrumbItems = generateBreadcrumbItems(pathname);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white dark:bg-[#2b2c40] border-duralux-border-light dark:border-duralux-border-dark shadow-sm">
      {/* 主 Header - 单行布局 */}
      <div className="flex items-center justify-between h-[70px] px-4 sm:px-6">
        {/* 左侧：菜单按钮 + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* 菜单按钮 - 仅移动端 */}
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
        </div>

        {/* 右侧：功能按钮 - 按照指定顺序 */}
        <div className="flex items-center gap-0">
          {/* 1. 搜索框 */}
          <div className="flex items-center relative">
            <div className="flex items-center bg-duralux-bg-page dark:bg-duralux-bg-dark-card rounded-lg px-3 py-2 h-[40px]">
              <Search className="w-4 h-4 text-duralux-text-muted mr-2" />
              <input
                type="text"
                placeholder="Search (Ctrl+K)"
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-duralux-text-primary placeholder:text-duralux-text-muted w-[200px]"
              />
            </div>
          </div>

          {/* 2. 国际化选择器 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
                aria-label="Language"
              >
                <Globe className="w-5 h-5" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer flex items-center gap-3 hover:bg-duralux-bg-page">
                <span className="text-lg">🇺🇸</span>
                <span className="text-sm">English</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer flex items-center gap-3 hover:bg-duralux-bg-page">
                <span className="text-lg">🇨🇳</span>
                <span className="text-sm">中文</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer flex items-center gap-3 hover:bg-duralux-bg-page">
                <span className="text-lg">🇯🇵</span>
                <span className="text-sm">日本語</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. 全屏切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-2.5 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Shrink className="w-5 h-5" />
            ) : (
              <Expand className="w-5 h-5" />
            )}
          </motion.button>

          {/* 4. 深浅色切换 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2.5 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.button>

          {/* 5. Timesheets (邮件图标) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
                aria-label="Timesheets"
              >
                <Mail className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-duralux-success rounded-full border-2 border-white dark:border-[#2b2c40]" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 border-duralux-border-light dark:border-duralux-border-dark">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-duralux-text-primary">Timesheets</span>
                  <span className="text-xs text-duralux-primary cursor-pointer hover:underline">Mark all as read</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {[1, 2, 3, 4].map((i) => (
                  <DropdownMenuItem key={i} className="py-3 px-4 cursor-pointer flex gap-3 hover:bg-duralux-bg-page">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-duralux-text-primary">Timesheet #{i}</p>
                        <span className="text-xs text-duralux-text-muted">{i * 2}h ago</span>
                      </div>
                      <p className="text-xs text-duralux-text-muted truncate mt-1">New timesheet submitted for approval</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 text-center cursor-pointer text-duralux-primary hover:bg-duralux-bg-page">
                View all timesheets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 6. 通知 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-lg text-duralux-text-secondary hover:bg-duralux-bg-page hover:text-duralux-primary transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-duralux-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#2b2c40]">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 border-duralux-border-light dark:border-duralux-border-dark">
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
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => {
                  const config = TYPE_CONFIG[notification.type as keyof typeof TYPE_CONFIG];
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "py-3 px-4 cursor-pointer flex gap-3 transition-colors",
                        !notification.read && "bg-duralux-bg-page/50"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm truncate", !notification.read ? "font-semibold text-duralux-text-primary" : "text-duralux-text-muted")}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-duralux-text-muted mt-0.5">{notification.time}</p>
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

          {/* 7. 用户头像下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded-lg hover:bg-duralux-bg-page transition-colors ml-1"
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 border-2 border-duralux-border-light dark:border-duralux-border-dark">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`} alt={user?.username} />
                    <AvatarFallback className="bg-duralux-bg-page text-duralux-text-primary text-sm font-semibold">
                      {user?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-duralux-success border-2 border-white dark:border-[#2b2c40] rounded-full" />
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4 border-duralux-border-light dark:border-duralux-border-dark">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`} />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-duralux-text-primary">
                      {user?.username || "Admin"}
                    </p>
                    <p className="text-xs leading-none text-duralux-text-muted">Administrator</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-duralux-text-secondary hover:text-duralux-primary hover:bg-duralux-bg-page">
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-duralux-text-secondary hover:text-duralux-primary hover:bg-duralux-bg-page">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-duralux-text-secondary hover:text-duralux-primary hover:bg-duralux-bg-page">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 px-4 text-duralux-danger hover:text-duralux-danger hover:bg-duralux-danger-transparent cursor-pointer"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
