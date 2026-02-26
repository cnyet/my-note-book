"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
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

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-[width,transform] duration-300 cubic-bezier-[0.4,0,0.2,1] lg:translate-x-0 overflow-hidden will-change-[width]",
          "bg-white dark:bg-[#ffffff]",
          "border-r border-[#e0e0e0] dark:border-[#2a2a2a]",
          isExpanded ? "w-[280px]" : "w-[72px]",
          /* hover 浮动展开时更大阴影 */
          isCollapsed && isHovered
            ? "shadow-[0_0_20px_rgba(0,0,0,0.12)]"
            : "shadow-none",
          /* 移动端 */
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
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

          {/* 折叠切换按钮 - 放在右侧 */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex items-center justify-center w-8 h-8 rounded-md transition-all flex-shrink-0 cursor-pointer hover:bg-[#f8f9fa]",
              !isExpanded && "opacity-0 pointer-events-none",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-[#525f7f]" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-[#525f7f]" />
            )}
          </button>
        </div>

        {/* ═══ 滚动区域：菜单列表 ═══ */}
        <ScrollArea className="h-[calc(100vh-4.5rem)]">
          <ul className="py-1 px-2 list-none m-0">
            {menuGroups.map((group) => (
              <li key={group.label}>
                {/* Section Header */}
                <div
                  className={cn(
                    "flex items-center py-3 transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isExpanded ? "px-3" : "justify-center px-0",
                  )}
                >
                  {isExpanded ? (
                    <span className="text-[10px] font-semibold uppercase text-[#8898aa] tracking-wider select-none">
                      {group.label}
                    </span>
                  ) : (
                    <MoreHorizontal
                      className="w-4 h-4 text-[#a1acb8]"
                      strokeWidth={2}
                    />
                  )}
                </div>

                {/* 菜单项列表 */}
                <ul className="list-none m-0 p-0">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <li key={item.href} className="relative mb-1 group">
                        {/* 展开态 Active: 圆角矩形背景包裹整个菜单项 */}
                        {isActive && isExpanded && (
                          <div className="absolute inset-x-0 inset-y-0 bg-[#f0f2f7] rounded-lg" />
                        )}

                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center rounded-lg text-[15px] transition-[padding,background-color,color,gap] duration-300 cubic-bezier-[0.4,0,0.2,1] relative no-underline cursor-pointer group",
                            isExpanded
                              ? "px-4 py-2.5 gap-3"
                              : "w-12 h-12 mx-auto my-0.5 flex items-center justify-center p-0",
                            /* Active 状态已在上面用绝对定位背景处理 */
                            !isActive
                              ? "text-[#525f7f] dark:text-[#525f7f] hover:bg-[#f8f9fa] dark:hover:bg-[#f8f9fa]"
                              : isExpanded
                                ? "text-[#32325d] dark:text-[#32325d] font-medium"
                                : "text-[#32325d] bg-[#f0f2f7]",
                          )}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                        >
                          <item.icon
                            className={cn(
                              "w-5 h-5 flex-shrink-0 transition-colors",
                              isActive && isExpanded && "text-[#32325d]",
                              isActive && !isExpanded && "text-[#32325d]",
                              !isActive && "text-[#525f7f] dark:text-[#525f7f]",
                            )}
                            strokeWidth={1.5}
                          />
                          <span
                            className={cn(
                              "whitespace-nowrap transition-all duration-300 cubic-bezier-[0.4,0,0.2,1] leading-none",
                              isExpanded
                                ? "opacity-100 translate-x-0 flex-1"
                                : "opacity-0 -translate-x-4 pointer-events-none absolute",
                            )}
                          >
                            {item.label}
                          </span>

                          {/* 展开态 hover 时显示右侧箭头 */}
                          {isExpanded && !isActive && (
                            <ChevronRight className="w-4 h-4 text-[#525f7f] opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          {isExpanded && isActive && (
                            <ChevronRight className="w-4 h-4 text-[#32325d] opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}

            {/* 底部：返回网站 */}
            <li className="mt-4">
              <div
                className={cn(
                  "flex items-center py-3 transition-all duration-300 whitespace-nowrap overflow-hidden",
                  isExpanded ? "px-3" : "justify-center px-0",
                )}
              >
                {isExpanded ? (
                  <span className="text-[10px] font-semibold uppercase text-[#8898aa] tracking-wider select-none">
                    Misc
                  </span>
                ) : (
                  <MoreHorizontal
                    className="w-4 h-4 text-[#a1acb8]"
                    strokeWidth={2}
                  />
                )}
              </div>
              <Link
                href="/"
                className={cn(
                  "flex items-center rounded-lg text-[15px] text-[#525f7f] hover:bg-[#f8f9fa] transition-colors no-underline cursor-pointer",
                  isExpanded
                    ? "px-4 py-2.5 gap-3"
                    : "w-12 h-12 mx-auto flex items-center justify-center p-0",
                )}
              >
                <LogOut
                  className="w-5 h-5 text-[#525f7f] flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300 cubic-bezier-[0.4,0,0.2,1] leading-none",
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 pointer-events-none absolute",
                  )}
                >
                  Back to Site
                </span>
              </Link>
            </li>

            {/* 底部用户信息卡片 (仅展开态显示) */}
            {isExpanded && (
              <li className="mt-6">
                <div className="bg-[#f8f9fa] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#f0f2f7] flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-[#525f7f]" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#71dd37] border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#32325d] truncate">
                        John Doe
                      </p>
                      <p className="text-xs text-[#8898aa] truncate">
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </ScrollArea>
      </aside>
    </>
  );
}
