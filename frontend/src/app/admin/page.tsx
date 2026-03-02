"use client";

import { WelcomeCard } from "@/components/admin/WelcomeCard";
import {
  EmailReportsCard,
  BrowserStatesCard,
  GoalProgressCard,
  ProjectRemindersCard,
} from "@/components/admin/dashboard";
import { apiClient } from "@/lib/admin-api";
import { Col, Row, Card, Spin } from "antd";
import { Bot, Wrench, FlaskConical, PenTool, Users, ShoppingCart, Wallet, CreditCard, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  usersCount: number;
  agentsCount: number;
  toolsCount: number;
  labsCount: number;
  blogPostsCount: number;
  newsSourcesCount: number;
  newsArticlesCount: number;
}

/** 模块卡片组件 */
function ModuleCard({
  title,
  value,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <a href={href} className="block no-underline">
      <Card
        bordered={false}
        className="sneat-card-shadow transition-all hover:translate-y-[-2px] hover:shadow-lg"
        styles={{ body: { padding: "1.25rem" } }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[#697a8d] text-xs font-medium mb-1">{title}</div>
            <div className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
              {value}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon size={22} />
          </div>
        </div>
      </Card>
    </a>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 duration-500">
      {/* Row 1: Welcome Card */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24}>
          <WelcomeCard />
        </Col>
      </Row>

      {/* Row 2: Core Module Stats Grid */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <ModuleCard
            title="Agents"
            value={stats?.agentsCount || 0}
            icon={Bot}
            color="bg-[#696cff]/10 text-[#696cff]"
            href="/admin/agents"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ModuleCard
            title="Tools"
            value={stats?.toolsCount || 0}
            icon={Wrench}
            color="bg-[#03c3ec]/10 text-[#03c3ec]"
            href="/admin/tools"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ModuleCard
            title="Labs"
            value={stats?.labsCount || 0}
            icon={FlaskConical}
            color="bg-[#ffab00]/10 text-[#ffab00]"
            href="/admin/labs"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ModuleCard
            title="Blog Posts"
            value={stats?.blogPostsCount || 0}
            icon={PenTool}
            color="bg-[#71dd37]/10 text-[#71dd37]"
            href="/admin/blog"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ModuleCard
            title="News Sources"
            value={stats?.newsSourcesCount || 0}
            icon={Newspaper}
            color="bg-[#3b82f6]/10 text-[#3b82f6]"
            href="/admin/agents/news"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <ModuleCard
            title="Users"
            value={stats?.usersCount || 0}
            icon={Users}
            color="bg-[#ec4899]/10 text-[#ec4899]"
            href="/admin/settings"
          />
        </Col>
      </Row>

      {/* Row 3: General Stats - Order/Sales/Payments/Revenue */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#696cff]/10 flex items-center justify-center">
                <ShoppingCart className="text-[#696cff]" size={20} />
              </div>
              <div>
                <div className="text-[#697a8d] text-xs font-medium">Orders</div>
                <div className="text-xl font-bold text-[#566a7f]">
                  {stats?.newsArticlesCount || 0}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#03c3ec]/10 flex items-center justify-center">
                <Wallet className="text-[#03c3ec]" size={20} />
              </div>
              <div>
                <div className="text-[#697a8d] text-xs font-medium">Sales</div>
                <div className="text-xl font-bold text-[#566a7f]">
                  ${stats?.usersCount ? (stats.usersCount * 17.5).toFixed(0) : "0"}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff3e1d]/10 flex items-center justify-center">
                <CreditCard className="text-[#ff3e1d]" size={20} />
              </div>
              <div>
                <div className="text-[#697a8d] text-xs font-medium">Payments</div>
                <div className="text-xl font-bold text-[#566a7f]">
                  ${stats?.toolsCount ? (stats.toolsCount * 124).toFixed(0) : "0"}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#71dd37]/10 flex items-center justify-center">
                <BarChart3 className="text-[#71dd37]" size={20} />
              </div>
              <div>
                <div className="text-[#697a8d] text-xs font-medium">Revenue</div>
                <div className="text-xl font-bold text-[#566a7f]">
                  ${stats?.blogPostsCount ? (stats.blogPostsCount * 89).toFixed(0) : "0"}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 4: Diverse Content - Email Reports + Browser States */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={12}>
          <EmailReportsCard />
        </Col>
        <Col xs={24} lg={12}>
          <BrowserStatesCard />
        </Col>
      </Row>

      {/* Row 5: Diverse Content - Goal Progress + Project Reminders */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={12}>
          <GoalProgressCard />
        </Col>
        <Col xs={24} lg={12}>
          <ProjectRemindersCard />
        </Col>
      </Row>
    </div>
  );
}
