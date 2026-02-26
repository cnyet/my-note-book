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
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#5e72e4] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8898aa] font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // Prevent flash of content

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-[padding] duration-300 cubic-bezier-[0.4,0,0.2,1] will-change-[padding-left]",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[280px]",
        )}
      >
        <div className="sticky top-0 z-20">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="flex-1 px-6 pt-6 pb-14">{children}</main>
      </div>
    </div>
  );
}
