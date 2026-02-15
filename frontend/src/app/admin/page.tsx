"use client";

import {
  ProfileReportCard,
  TotalRevenueCard,
} from "@/components/admin/DashboardCards";
import { StatCard } from "@/components/admin/StatCard";
import { WelcomeCard } from "@/components/admin/WelcomeCard";
import { adminAuthApi } from "@/lib/admin-api";
import { Col, Row } from "antd";
import { Bot, PenTool, Users, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    usersCount: number;
    agentsCount: number;
    toolsCount: number;
    blogPostsCount: number;
  } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminAuthApi.request<{
          usersCount: number;
          agentsCount: number;
          toolsCount: number;
          blogPostsCount: number;
        }>("/admin/dashboard/stats");

        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 p-6">
      {/* Row 1: Welcome & Primary Stats */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <WelcomeCard />
        </Col>
        <Col xs={24} md={12} lg={4}>
          <StatCard
            title="Active Users"
            value={stats?.usersCount || "1,234"}
            icon={Users}
            iconColor="bg-green-100 text-green-600"
            trend={{ value: 12, isPositive: true }}
            className="h-full"
          />
        </Col>
        <Col xs={24} md={12} lg={4}>
          <StatCard
            title="Total Agents"
            value={stats?.agentsCount || "56"}
            icon={Bot}
            iconColor="bg-cyan-100 text-cyan-600"
            trend={{ value: 28.4, isPositive: true }}
            className="h-full"
          />
        </Col>
      </Row>

      {/* Row 2: Charts & Secondary Stats */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <TotalRevenueCard />
        </Col>
        <Col xs={24} lg={8}>
          <div className="flex flex-col gap-6 h-full">
            <Row gutter={[24, 24]} className="flex-1">
              <Col xs={12}>
                <StatCard
                  title="Tools Library"
                  value={stats?.toolsCount || "128"}
                  icon={Wrench}
                  iconColor="bg-red-100 text-red-600"
                  trend={{ value: 14.8, isPositive: false }}
                  className="h-full"
                />
              </Col>
              <Col xs={12}>
                <StatCard
                  title="Blog Posts"
                  value={stats?.blogPostsCount || "42"}
                  icon={PenTool}
                  iconColor="bg-purple-100 text-purple-600"
                  trend={{ value: 32, isPositive: true }}
                  className="h-full"
                />
              </Col>
            </Row>

            <div className="flex-1">
              <ProfileReportCard />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
