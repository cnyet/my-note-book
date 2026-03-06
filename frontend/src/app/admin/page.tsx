"use client";

import {
  EmailReportsCard,
  BrowserStatesCard,
  GoalProgressCard,
  ProjectRemindersCard,
} from "@/components/admin/dashboard";
import { ModuleDistributionCard } from "@/components/admin/ModuleDistribution";
import { ActivityTrendCard } from "@/components/admin/ActivityTrend";
import { apiClient } from "@/lib/admin-api";
import { Card, Row, Col } from "antd";
import {
  Bot,
  Wrench,
  FlaskConical,
  PenTool,
  Newspaper,
  CreditCard,
  DollarSign,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ModuleCard } from "@/components/admin/ModuleCard";
import { StatWidget } from "@/components/admin/StatWidget";
import { WelcomeBanner } from "@/components/admin/WelcomeBanner";

interface DashboardStats {
  usersCount: number;
  agentsCount: number;
  toolsCount: number;
  labsCount: number;
  blogPostsCount: number;
  newsSourcesCount: number;
  newsArticlesCount: number;
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
      {/* Row 1: Welcome Banner - Clean design with centered icon */}
      {isLoading ? (
        <div className="rounded-2xl bg-white dark:bg-duralux-bg-dark-card p-8 shadow-duralux-card dark:shadow-duralux-card-dark h-[200px] skeleton" />
      ) : (
        <WelcomeBanner />
      )}

      {/* Row 2: Module Stats Grid - 5 cards in a row, responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-5 shadow-duralux-card dark:shadow-duralux-card-dark h-[140px] skeleton" />
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
            </>
          )}
      </div>

      {/* Row 3: Payment Record Style Stats - 4 cards, compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-5 shadow-duralux-card dark:shadow-duralux-card-dark h-[120px] skeleton" />
            ))
          : (
            <>
              <StatWidget
                title="Orders"
                value={stats?.newsArticlesCount || 0}
                icon={ShoppingBag}
                color="text-duralux-primary"
                bgColor="bg-duralux-primary-transparent"
              />
              <StatWidget
                title="Sales"
                value={`$${stats?.usersCount ? (stats.usersCount * 17.5).toFixed(0) : "0"}`}
                icon={DollarSign}
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
                icon={TrendingUp}
                color="text-duralux-success"
                bgColor="bg-duralux-success-transparent"
              />
            </>
          )}
      </div>

      {/* Row 4: Dashboard Charts - Activity Trend + Module Distribution */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[340px] skeleton" />
          ) : (
            <ActivityTrendCard />
          )}
        </Col>
        <Col xs={24} lg={12}>
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[340px] skeleton" />
          ) : (
            <ModuleDistributionCard />
          )}
        </Col>
      </Row>

      {/* Row 5: Dashboard Cards - Email Reports + Browser States */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[320px] skeleton" />
          ) : (
            <EmailReportsCard />
          )}
        </Col>
        <Col xs={24} lg={12}>
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[320px] skeleton" />
          ) : (
            <BrowserStatesCard />
          )}
        </Col>
      </Row>

      {/* Row 6: Dashboard Cards - Goal Progress + Project Reminders */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[280px] skeleton" />
          ) : (
            <GoalProgressCard />
          )}
        </Col>
        <Col xs={24} lg={12}>
          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-duralux-bg-dark-card p-6 shadow-duralux-card dark:shadow-duralux-card-dark h-[280px] skeleton" />
          ) : (
            <ProjectRemindersCard />
          )}
        </Col>
      </Row>
    </div>
  );
}
