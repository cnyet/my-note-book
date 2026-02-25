"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Bot,
  ChevronLeft,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Minus,
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
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out lg:translate-x-0 overflow-hidden",
          "bg-white dark:bg-[#2b2c40]",
          isExpanded ? "w-[260px]" : "w-[78px]",
          /* hover 浮动展开时更大阴影 */
          isCollapsed && isHovered
            ? "shadow-[0_0_15px_rgba(67,89,113,0.15)]"
            : "shadow-[5px_0_15px_-5px_rgba(67,89,113,0.08)]",
          /* 移动端 */
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
        )}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ═══ Logo + Toggle 区域 ═══ */}
        <div className="flex items-center justify-between h-16 px-[1.15rem] mt-1">
          <Link href="/" className="flex items-center gap-[0.6rem]">
            <div className="relative w-[30px] h-[30px] flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span
              className={cn(
                "text-[1.375rem] font-bold text-[#566a7f] dark:text-[#a3b1c2] tracking-[-0.01em] whitespace-nowrap transition-all duration-300",
                isExpanded
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 overflow-hidden pointer-events-none",
              )}
            >
              MyNoteBook
            </span>
          </Link>

          {/* 折叠切换按钮 - Sneat: 实心 primary 圆形 + 白色 chevron */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#696cff] text-white transition-all duration-300 hover:bg-[#5f61e6] flex-shrink-0",
              !isExpanded && "opacity-0 pointer-events-none",
            )}
          >
            <ChevronLeft
              className={cn(
                "w-[14px] h-[14px] transition-transform duration-300",
                isCollapsed && "rotate-180",
              )}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* ═══ 滚动区域: 菜单列表 ═══ */}
        <ScrollArea className="h-[calc(100vh-4.5rem)]">
          <ul className="py-1 px-[0.875rem] list-none m-0">
            {menuGroups.map((group) => (
              <li key={group.label}>
                {/* Section Header */}
                <div
                  className={cn(
                    "flex items-center py-[0.875rem] transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isExpanded ? "px-[0.5rem]" : "justify-center px-0",
                  )}
                >
                  {isExpanded ? (
                    <span className="text-[11px] font-bold uppercase text-[#adadb4] tracking-[0.8px] select-none">
                      {group.label}
                    </span>
                  ) : (
                    <Minus className="w-4 h-4 text-[#adadb4]" />
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
                      <li key={item.href} className="relative mb-[2px]">
                        {/* ──── 折叠态 Active: 左侧垂直条 (Sneat 折叠态特征) ──── */}
                        {isActive && !isExpanded && (
                          <div className="absolute left-[-0.875rem] top-[0.375rem] bottom-[0.375rem] w-[4px] bg-[#696cff] rounded-r-full" />
                        )}

                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center rounded-md text-[0.9375rem] transition-all duration-200 relative no-underline",
                            isExpanded
                              ? "px-[0.9375rem] py-[0.5375rem] gap-[0.625rem]"
                              : "px-0 py-[0.5375rem] justify-center",
                            /* 展开态 Active: 渐变 primary 背景 */
                            isActive && isExpanded
                              ? "bg-gradient-to-r from-[#696cff] to-[#696cff]/80 text-white font-medium shadow-[0_2px_6px_rgba(105,108,255,0.4)]"
                              : "",
                            /* 折叠态 Active: 图标变 primary 色 (配合左侧竖条) */
                            isActive && !isExpanded ? "text-[#696cff]" : "",
                            /* 非 Active */
                            !isActive
                              ? "text-[#697a8d] dark:text-[#a3b1c2] hover:bg-[#f5f5f9] dark:hover:bg-[#323249] hover:text-[#566a7f] dark:hover:text-white"
                              : "",
                          )}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                        >
                          <item.icon
                            className={cn(
                              "w-[1.375rem] h-[1.375rem] flex-shrink-0 transition-colors",
                              isActive && isExpanded && "text-white",
                              isActive && !isExpanded && "text-[#696cff]",
                              !isActive && "text-[#697a8d] dark:text-[#a3b1c2]",
                            )}
                            strokeWidth={1.5}
                          />
                          <span
                            className={cn(
                              "whitespace-nowrap transition-all duration-300 leading-none",
                              isExpanded
                                ? "opacity-100 w-auto"
                                : "opacity-0 w-0 overflow-hidden pointer-events-none",
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}

            {/* 底部: 返回网站 */}
            <li className="mt-4">
              <div
                className={cn(
                  "flex items-center py-[0.875rem] transition-all duration-300 whitespace-nowrap overflow-hidden",
                  isExpanded ? "px-[0.5rem]" : "justify-center px-0",
                )}
              >
                {isExpanded ? (
                  <span className="text-[11px] font-bold uppercase text-[#adadb4] tracking-[0.8px] select-none">
                    Misc
                  </span>
                ) : (
                  <Minus className="w-4 h-4 text-[#adadb4]" />
                )}
              </div>
              <Link
                href="/"
                className={cn(
                  "flex items-center rounded-md text-[0.9375rem] text-[#697a8d] dark:text-[#a3b1c2] hover:bg-[#f5f5f9] dark:hover:bg-[#323249] hover:text-[#566a7f] dark:hover:text-white transition-colors no-underline",
                  isExpanded
                    ? "px-[0.9375rem] py-[0.5375rem] gap-[0.625rem]"
                    : "px-0 py-[0.5375rem] justify-center",
                )}
              >
                <LogOut
                  className="w-[1.375rem] h-[1.375rem] text-[#697a8d] dark:text-[#a3b1c2] flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300 leading-none",
                    isExpanded
                      ? "opacity-100 w-auto"
                      : "opacity-0 w-0 overflow-hidden pointer-events-none",
                  )}
                >
                  Back to Site
                </span>
              </Link>
            </li>
          </ul>
        </ScrollArea>
      </aside>
    </>
  );
}
