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
import { Input } from "@/components/ui/input";
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
import { Breadcrumb, generateBreadcrumbItems } from "./shared/Breadcrumb";
import { DateRangePicker } from "./shared/DateRangePicker";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | undefined>();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const breadcrumbItems = generateBreadcrumbItems(pathname);

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
    <header className="z-10 w-full px-6 pt-4 pb-2">
      {/* Breadcrumb Row */}
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header Controls Row */}
      <div className="flex items-center justify-between px-6 py-2 bg-white/80 dark:bg-[#2b2c40]/80 backdrop-blur-md rounded-md sneat-card-shadow border-none">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#697a8d]"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center w-64 lg:w-96 relative">
            <Keyboard className="w-[1.125rem] h-[1.125rem] mr-3 text-[#b4bdc6]" />
            <Input
              type="text"
              placeholder="Search (Ctrl+K)"
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-[#b4bdc6] text-sm"
            />
            <kbd className="absolute right-3 px-2 py-1 text-xs bg-[#f5f5f9] dark:bg-[#323249] text-[#a1acb8] rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="hidden lg:flex"
          />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-[#697a8d] hover:text-[#696cff] transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#697a8d] hover:text-[#696cff] relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-[#ff3e1d] rounded-full border-2 border-white dark:border-[#2b2c40]" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#696cff] hover:underline"
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
                        !notification.read && "bg-[#f5f5f9]/50 dark:bg-[#323249]/50"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm truncate",
                          !notification.read ? "font-semibold text-[#566a7f] dark:text-[#a3b1c2]" : "text-[#697a8d]"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#a1acb8]">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 text-center cursor-pointer text-[#696cff] hover:text-[#5f61e6]">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-0 shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "admin"}`}
                      alt={user?.username}
                    />
                    <AvatarFallback className="bg-[#696cff]/10 text-[#696cff]">
                      {user?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#71dd37] border-2 border-white dark:border-[#2b2c40] rounded-full"></span>
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
                    <p className="text-sm font-semibold leading-none text-[#566a7f] dark:text-[#a3b1c2]">
                      {user?.username || "John Doe"}
                    </p>
                    <p className="text-xs leading-none text-[#8592a3]">Administrator</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#697a8d] focus:text-[#696cff]">
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#697a8d] focus:text-[#696cff]">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-4 cursor-pointer text-[#697a8d] focus:text-[#696cff]">
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2 px-4 text-[#ff3e1d] focus:text-[#ff3e1d] focus:bg-[#ff3e1d]/10 cursor-pointer"
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
