"use client";

import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminHeader from "./Header";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Loading State - Duralux Style
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duralux-bg-page dark:bg-duralux-bg-dark-page">
        <div className="flex flex-col items-center gap-6">
          {/* Logo Animation */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-br from-duralux-primary/30 to-duralux-success/30 rounded-2xl blur-lg animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-duralux-primary to-duralux-primary-dark flex items-center justify-center shadow-xl shadow-duralux-primary/30">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          </div>

          {/* Loading Text with Skeleton */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-duralux-text-secondary dark:text-duralux-text-dark-secondary animate-pulse">
              Loading Dashboard...
            </p>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-duralux-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-duralux-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-duralux-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-duralux-bg-page dark:bg-duralux-bg-dark-page">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out will-change-[padding-left]",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[280px]",
        )}
      >
        <div className="sticky top-0 z-20">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Main Content - Duralux Style */}
        <main className="flex-1 px-6 py-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
