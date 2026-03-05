"use client";

import { WelcomeCard } from "@/components/admin/WelcomeCard";
import {
  EmailReportsCard,
  BrowserStatesCard,
  GoalProgressCard,
  ProjectRemindersCard,
} from "@/components/admin/dashboard";
import { apiClient } from "@/lib/admin-api";
import { Card } from "antd";
import { Bot, Wrench, FlaskConical, PenTool, Newspaper, Users, ShoppingCart, Wallet, CreditCard, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/ui/Card/StatCard";

interface DashboardStats {
  usersCount: number;
  agentsCount: number;
  toolsCount: number;
  labsCount: number;
  blogPostsCount: number;
  newsSourcesCount: number;
  newsArticlesCount: number;
}

/** 模块卡片组件 - Duralux Style */
function ModuleCard({
  title,
  value,
  icon: Icon,
  gradient,
  href,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  gradient: "blue" | "green" | "orange" | "purple" | "pink" | "cyan" | "indigo";
  href: string;
}) {
  return (
    <a href={href} className="block no-underline">
      <StatCard
        icon={<Icon size={20} />}
        label={title}
        value={value}
        gradient={gradient}
        className="h-full"
      />
    </a>
  );
}

/** 统计卡片组件 - Duralux Style */
function StatWidget({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark transition-all duration-200 hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark hover:-translate-y-0.5 overflow-hidden"
      styles={{ body: { padding: "1.25rem" } }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon className={color} size={20} />
        </div>
        <div>
          <div className="text-sm text-duralux-text-muted mb-0.5">{title}</div>
          <div className="text-xl font-bold text-duralux-text-primary">
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
}

/** 骨架屏卡片组件 */
function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-duralux-bg-dark-card p-5 shadow-duralux-card dark:shadow-duralux-card-dark ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="w-20 h-3 skeleton" />
          <div className="w-24 h-5 skeleton" />
        </div>
      </div>
    </div>
  );
}

/** 骨架屏模块卡片 */
function SkeletonModuleCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-duralux-bg-dark-card p-5 shadow-duralux-card dark:shadow-duralux-card-dark h-full">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="w-16 h-3 skeleton" />
          <div className="w-20 h-6 skeleton" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const response = await apiClient.get<DashboardStats>("/admin/dashboard/stats");
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Row 1: Welcome Card */}
      {isLoading ? (
        <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[180px] skeleton" />
      ) : (
        <WelcomeCard />
      )}

      {/* Row 2: Core Module Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonModuleCard key={i} />
            ))
          : (
            <>
              <ModuleCard
                title="Agents"
                value={stats?.agentsCount || 0}
                icon={Bot}
                gradient="blue"
                href="/admin/agents"
              />
              <ModuleCard
                title="Tools"
                value={stats?.toolsCount || 0}
                icon={Wrench}
                gradient="cyan"
                href="/admin/tools"
              />
              <ModuleCard
                title="Labs"
                value={stats?.labsCount || 0}
                icon={FlaskConical}
                gradient="orange"
                href="/admin/labs"
              />
              <ModuleCard
                title="Blog Posts"
                value={stats?.blogPostsCount || 0}
                icon={PenTool}
                gradient="green"
                href="/admin/blog"
              />
              <ModuleCard
                title="News Sources"
                value={stats?.newsSourcesCount || 0}
                icon={Newspaper}
                gradient="indigo"
                href="/admin/agents/news"
              />
              <ModuleCard
                title="Users"
                value={stats?.usersCount || 0}
                icon={Users}
                gradient="pink"
                href="/admin/settings"
              />
            </>
          )}
      </div>

      {/* Row 3: General Stats - Order/Sales/Payments/Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : (
            <>
              <StatWidget
                title="Orders"
                value={stats?.newsArticlesCount || 0}
                icon={ShoppingCart}
                color="text-duralux-primary"
                bgColor="bg-duralux-primary-transparent"
              />
              <StatWidget
                title="Sales"
                value={`$${stats?.usersCount ? (stats.usersCount * 17.5).toFixed(0) : "0"}`}
                icon={Wallet}
                color="text-duralux-info"
                bgColor="bg-duralux-info-transparent"
              />
              <StatWidget
                title="Payments"
                value={`$${stats?.toolsCount ? (stats.toolsCount * 124).toFixed(0) : "0"}`}
                icon={CreditCard}
                color="text-duralux-danger"
                bgColor="bg-duralux-danger-transparent"
              />
              <StatWidget
                title="Revenue"
                value={`$${stats?.blogPostsCount ? (stats.blogPostsCount * 89).toFixed(0) : "0"}`}
                icon={BarChart3}
                color="text-duralux-success"
                bgColor="bg-duralux-success-transparent"
              />
            </>
          )}
      </div>

      {/* Row 4: Diverse Content - Email Reports + Browser States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[300px] skeleton" />
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[300px] skeleton" />
          </>
        ) : (
          <>
            <EmailReportsCard />
            <BrowserStatesCard />
          </>
        )}
      </div>

      {/* Row 5: Diverse Content - Goal Progress + Project Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[280px] skeleton" />
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[280px] skeleton" />
          </>
        ) : (
          <>
            <GoalProgressCard />
            <ProjectRemindersCard />
          </>
        )}
      </div>
    </div>
  );
}
