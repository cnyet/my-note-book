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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f9] dark:bg-[#232333]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // Prevent flash of content

  return (
    <div className="min-h-screen bg-[#f5f5f9] dark:bg-[#232333]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-[78px]" : "lg:pl-[260px]",
        )}
      >
        <div className="sticky top-0 z-20">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="flex-1 px-6 pb-6 animate-in fade-in-50 duration-500">
          {children}
        </main>

        <footer className="py-6 text-center text-sm text-[#a1acb8]">
          <p>© {new Date().getFullYear()} MyNoteBook - Admin Dashboard</p>
        </footer>
      </div>
    </div>
  );
}
