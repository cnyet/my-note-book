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
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Keyboard,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { DateRangePicker } from "./shared/DateRangePicker";
import { useState } from "react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

/** 模拟通知数据 */
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
  info: { icon: AlertCircle, color: "#03c3ec", bg: "bg-[#03c3ec]/10" },
  success: { icon: CheckCircle, color: "#71dd37", bg: "bg-[#71dd37]/10" },
  error: { icon: AlertCircle, color: "#ff3e1d", bg: "bg-[#ff3e1d]/10" },
  warning: { icon: Clock, color: "#ffab00", bg: "bg-[#ffab00]/10" },
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();
  const { theme, setTheme } = useTheme();
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | undefined>();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Keyboard shortcut for search (Ctrl+K)
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Focus search input - would need a ref to implement
      }
    });
  }

  return (
    <header className="z-10 w-full bg-white border-b border-[#e0e0e0]">
      {/* Header 内容行 - 单行布局 */}
      <div className="flex items-center justify-between h-[72px] px-6">
        {/* 左侧：菜单按钮 + 搜索框 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#525f7f]"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* 搜索框 */}
          <div className="hidden md:flex items-center relative">
            <div className="flex items-center w-64 lg:w-80 px-4 py-2.5 bg-[#f8f9fa] rounded-md transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5e72e4]/20">
              <Keyboard className="w-4 h-4 mr-3 text-[#8898aa]" />
              <input
                type="text"
                placeholder="Search (Ctrl+K)"
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-[#525f7f] placeholder:text-[#8898aa]"
              />
              <kbd className="hidden lg:inline-flex px-2 py-0.5 text-xs bg-white rounded text-[#8898aa]">
                ⌘K
              </kbd>
            </div>
          </div>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-[#525f7f] hover:text-[#5e72e4] hover:bg-[#f8f9fa] transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* 通知 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#525f7f] hover:text-[#5e72e4] hover:bg-[#f8f9fa] relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#f5365c] rounded-full border border-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#525f7f]">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#5e72e4] hover:underline"
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
                        "py-3 px-4 cursor-pointer flex gap-3",
                        !notification.read && "bg-[#f8f9fa]"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm truncate",
                          !notification.read ? "font-semibold text-[#525f7f]" : "text-[#8898aa]"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#8898aa]">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 text-center cursor-pointer text-[#5e72e4] hover:text-[#5665e3]">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 用户头像 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-[#e0e0e0]">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                      alt={user?.username}
                    />
                    <AvatarFallback className="bg-[#f0f2f7] text-[#525f7f]">
                      {user?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#71dd37] border-2 border-white rounded-full"></span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                    />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-[#525f7f]">
                      {user?.username || "John Doe"}
                    </p>
                    <p className="text-xs leading-none text-[#8898aa]">Administrator</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#525f7f] hover:text-[#5e72e4] hover:bg-[#f8f9fa]">
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#525f7f] hover:text-[#5e72e4] hover:bg-[#f8f9fa]">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#525f7f] hover:text-[#5e72e4] hover:bg-[#f8f9fa]">
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 px-4 text-[#f5365c] hover:text-[#f5365c] hover:bg-[#f5365c]/10 cursor-pointer"
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
