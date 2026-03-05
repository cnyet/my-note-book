"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  PenTool,
  Settings,
  UserCircle,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/** 菜单组划分 */
const menuGroups = [
  {
    label: "Dashboards",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/agents", icon: Bot, label: "Agents" },
      { href: "/admin/tools", icon: Wrench, label: "Tools" },
      { href: "/admin/labs", icon: FlaskConical, label: "Labs" },
      { href: "/admin/blog", icon: PenTool, label: "Blog" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/profile", icon: UserCircle, label: "Profile" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // 折叠态下 hover 时临时展开
  const isExpanded = !isCollapsed || isHovered;

  // Animation variants
  const sidebarVariants = {
    collapsed: { width: 72 },
    expanded: { width: 280 },
  };

  const textVariants = {
    collapsed: { opacity: 0, x: -10, width: 0 },
    expanded: { opacity: 1, x: 0, width: "auto" },
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Duralux Style */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.2,
        }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen lg:translate-x-0 overflow-hidden",
          "bg-white dark:bg-[#2b2c40]",
          "border-r border-duralux-border-light dark:border-duralux-border-dark",
          "shadow-[4px_0_24px_rgba(0,0,0,0.04)]",
          /* 移动端 */
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ═══ Logo 区域 ═══ */}
        <div className="flex items-center justify-between h-[72px] px-3">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span
              className={cn(
                "text-xl font-semibold text-[#32325d] dark:text-[#32325d] whitespace-nowrap transition-all duration-300 ease-in-out",
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 pointer-events-none",
              )}
            >
              MyNoteBook
            </span>
          </Link>

          {/* 折叠切换按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-all flex-shrink-0 cursor-pointer",
              "border border-duralux-border-light dark:border-duralux-border-dark",
              "bg-duralux-bg-page hover:bg-duralux-bg-hover dark:bg-duralux-bg-dark-card dark:hover:bg-duralux-bg-dark-hover",
              !isExpanded && "opacity-0 pointer-events-none",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-duralux-primary" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-duralux-primary" />
            )}
          </motion.button>
        </div>

        {/* ═══ 滚动区域：菜单列表 ═══ */}
        <ScrollArea className="h-[calc(100vh-5rem)] duralux-scrollbar">
          <ul className="py-3 px-3 list-none m-0">
            {menuGroups.map((group, groupIndex) => (
              <li key={group.label}>
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className={cn(
                    "flex items-center py-2 px-2 mb-1 transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isExpanded ? "px-2" : "justify-center px-0",
                  )}
                >
                  {isExpanded ? (
                    <span className="text-[10px] font-semibold uppercase text-duralux-text-muted tracking-wider select-none">
                      {group.label}
                    </span>
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-duralux-primary/40" />
                  )}
                </motion.div>

                {/* 菜单项列表 */}
                <ul className="list-none m-0 p-0">
                  {group.items.map((item, itemIndex) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <li
                        key={item.href}
                        className="relative mb-0.5"
                        style={{
                          animationDelay: `${itemIndex * 50}ms`,
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center rounded-xl text-[14px] transition-all duration-200 relative no-underline cursor-pointer group",
                            isExpanded
                              ? "px-2.5 py-2 gap-2"
                              : "w-12 h-12 mx-auto my-0.5 flex items-center justify-center p-0",
                            /* Active/Inactive States */
                            isActive
                              ? "bg-duralux-primary text-white shadow-[0_4px_8px_rgba(105,108,255,0.25)]"
                              : "text-duralux-text-secondary hover:text-duralux-text-primary hover:bg-duralux-bg-page",
                          )}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                        >
                          {/* Icon Container */}
                          <div
                            className={cn(
                              "relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                              isActive
                                ? "bg-white/20"
                                : "bg-duralux-bg-page group-hover:bg-duralux-bg-hover dark:bg-duralux-bg-dark-card dark:group-hover:bg-duralux-bg-dark-hover",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-5 h-5 transition-colors duration-200",
                                isActive
                                  ? "text-white"
                                  : "text-duralux-text-muted group-hover:text-duralux-text-primary",
                              )}
                              strokeWidth={1.8}
                            />
                          </div>

                          {/* Label */}
                          <motion.span
                            variants={textVariants}
                            className={cn(
                              "whitespace-nowrap leading-none flex-1 font-medium",
                            )}
                          >
                            {item.label}
                          </motion.span>

                          {/* Active Indicator - Right Arrow */}
                          {isExpanded && (
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 transition-all duration-200",
                                isActive
                                  ? "opacity-100 text-white/80"
                                  : "opacity-0 group-hover:opacity-100 text-duralux-text-muted",
                              )}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Divider between groups */}
                {group.label !== "Settings" && isExpanded && (
                  <div className="my-2 mx-2 h-px bg-gradient-to-r from-transparent via-duralux-border-light to-transparent dark:via-duralux-border-dark" />
                )}
              </li>
            ))}

            {/* 底部：返回网站 */}
            <li className="mt-4 pt-4 border-t border-duralux-border-light dark:border-duralux-border-dark">
              <Link
                href="/"
                className={cn(
                  "flex items-center rounded-xl text-[14px] transition-all duration-200 no-underline cursor-pointer group",
                  isExpanded
                    ? "px-2.5 py-2 gap-2"
                    : "w-12 h-12 mx-auto flex items-center justify-center p-0",
                  "text-duralux-text-secondary hover:text-duralux-text-primary hover:bg-duralux-bg-page",
                  "dark:text-duralux-text-dark-secondary dark:hover:text-duralux-text-dark-primary dark:hover:bg-duralux-bg-dark-hover",
                )}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-duralux-bg-page group-hover:bg-duralux-bg-hover dark:bg-duralux-bg-dark-card dark:group-hover:bg-duralux-bg-dark-hover transition-colors">
                  <LogOut className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <motion.span
                  variants={textVariants}
                  className="whitespace-nowrap leading-none font-medium"
                >
                  Back to Site
                </motion.span>
              </Link>
            </li>

            {/* 底部用户信息卡片 - Duralux Style (仅展开态显示) */}
            {isExpanded && (
              <li className="mt-4 pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-duralux-bg-page to-duralux-bg-page/50 p-4 border border-duralux-border-light dark:from-duralux-bg-dark-card dark:to-duralux-bg-dark-card/50 dark:border-duralux-border-dark"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-duralux-primary/20 to-duralux-success/20 flex items-center justify-center border-2 border-white dark:border-duralux-border-dark shadow-sm">
                        <UserCircle className="w-6 h-6 text-duralux-primary" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-duralux-success border-2 border-white dark:border-duralux-bg-dark rounded-full shadow-[0_0_8px_rgba(113,221,55,0.4)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary truncate">
                        Admin User
                      </p>
                      <p className="text-xs text-duralux-text-muted truncate">
                        Administrator
                      </p>
                    </div>
                  </div>
                </motion.div>
              </li>
            )}
          </ul>
        </ScrollArea>
      </motion.aside>
    </>
  );
}
