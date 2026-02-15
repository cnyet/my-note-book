"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  LayoutDashboard,
  LogOut,
  PenTool,
  Settings,
  UserCircle,
  Users,
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

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/agents", icon: Users, label: "Agents" },
  { href: "/admin/tools", icon: Wrench, label: "Tools" },
  { href: "/admin/labs", icon: FlaskConical, label: "Labs" },
  { href: "/admin/blog", icon: PenTool, label: "Blog" },
  { href: "/admin/profile", icon: UserCircle, label: "Profile" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Determine if the sidebar should be in expanded mode (either locked or hovered)
  const isExpanded = !isCollapsed || isHovered;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white dark:bg-[#2b2c40] border-r border-[#d9dee3] dark:border-[#444564] transition-all duration-300 ease-in-out lg:translate-x-0 group/sidebar overflow-hidden",
          isExpanded ? "w-[260px] shadow-xl" : "w-[84px]",
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
        )}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Toggle Button (Sneat Style - High Fidelity) */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "absolute right-4 top-5 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-transparent text-[#696cff] transition-all duration-300 hover:scale-110 hidden lg:flex",
            !isExpanded && "hidden", // Sneat hides toggle when collapsed unless hovered
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 border-[#696cff] flex items-center justify-center transition-all duration-300",
              isCollapsed ? "bg-transparent" : "bg-transparent",
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full bg-[#696cff] transition-all duration-300",
                isCollapsed ? "scale-0 opacity-0" : "scale-100 opacity-100",
              )}
            />
          </div>
        </button>

        {/* Logo Section */}
        <div className="flex items-center h-16 px-6 mt-1 mb-2">
          <Link href="/" className="flex items-center gap-3 w-full">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span
              className={cn(
                "text-xl font-bold text-[#566a7f] dark:text-[#a3b1c2] tracking-normal whitespace-nowrap transition-all duration-300",
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 pointer-events-none",
              )}
            >
              MyNoteBook
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="h-[calc(100vh-5rem)] py-2">
          <nav className="px-3">
            <div
              className={cn(
                "px-4 py-3 text-[11px] font-semibold uppercase text-[#b4bdc6] tracking-[0.0625rem] mb-1 transition-all duration-300 whitespace-nowrap overflow-hidden",
                isExpanded ? "opacity-100 h-auto" : "opacity-0 h-0 p-0 m-0",
              )}
            >
              Dashboards & Apps
            </div>

            {menuItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="relative group/menu-item px-1">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md text-[0.9375rem] transition-all duration-200 group/item relative mb-1",
                      isExpanded
                        ? "px-4 py-2.5 gap-3"
                        : "px-0 py-2.5 justify-center",
                      isActive
                        ? "bg-[#696cff]/10 text-[#696cff] font-medium"
                        : "text-[#697a8d] dark:text-[#a3b1c2] hover:bg-[#f5f5f9] dark:hover:bg-[#323249] hover:text-[#566a7f] dark:hover:text-white",
                    )}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    {/* Left Active Indicator Bar - Pure Sneat Style */}
                    {isActive && (
                      <div className="absolute left-[-4px] top-1 bottom-1 w-[4px] bg-[#696cff] rounded-r-full shadow-[2px_0_4px_rgba(105,108,255,0.4)]" />
                    )}

                    <item.icon
                      className={cn(
                        "w-[1.25rem] h-[1.25rem] flex-shrink-0 transition-colors",
                        isActive
                          ? "text-[#696cff]"
                          : "text-[#8592a3] group-hover/item:text-[#566a7f] dark:group-hover/item:text-white",
                      )}
                    />
                    <span
                      className={cn(
                        "whitespace-nowrap transition-all duration-300",
                        isExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4 pointer-events-none hidden",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              );
            })}

            <div
              className={cn(
                "mt-6 px-4 py-3 text-[11px] font-semibold uppercase text-[#b4bdc6] tracking-[0.0625rem] mb-1 transition-all duration-300 whitespace-nowrap overflow-hidden",
                isExpanded ? "opacity-100 h-auto" : "opacity-0 h-0 p-0 m-0",
              )}
            >
              System Settings
            </div>

            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 mx-1 rounded-md text-[0.9375rem] text-[#697a8d] dark:text-[#a3b1c2] hover:bg-[#f5f5f9] dark:hover:bg-[#323249] hover:text-[#566a7f] dark:hover:text-white transition-colors",
                isExpanded ? "px-4 py-2.5" : "px-0 py-2.5 justify-center",
              )}
            >
              <LogOut className="w-[1.25rem] h-[1.25rem] text-[#8592a3] flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4 pointer-events-none hidden",
                )}
              >
                Back to Site
              </span>
            </Link>
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}
