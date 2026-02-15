"use client";

import {
  ProfileReportCard,
  TotalRevenueCard,
} from "@/components/admin/DashboardCards";
import { StatCard } from "@/components/admin/StatCard";
import { WelcomeCard } from "@/components/admin/WelcomeCard";
import { adminAuthApi } from "@/lib/admin-api";
import { Col, Row } from "antd";
import { BarChart3, CreditCard, ShoppingCart, Wallet } from "lucide-react";
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
    <div className="animate-in fade-in-50 duration-500 p-6">
      {/* Row 1: Welcome Card + 2 stat cards (Sneat: col-xxl-8 + col-xxl-4) */}
      <Row gutter={[24, 24]}>
        <Col xs={24} xxl={16}>
          <WelcomeCard />
        </Col>
        <Col xs={24} xxl={8}>
          <Row gutter={[24, 24]}>
            <Col xs={12} xxl={12}>
              <StatCard
                title="Order"
                value={stats?.agentsCount || "276k"}
                icon={ShoppingCart}
                iconColor="bg-[#696cff]/10 text-[#696cff]"
                chartType="area"
                className="h-full"
              />
            </Col>
            <Col xs={12} xxl={12}>
              <StatCard
                title="Sales"
                value={stats?.usersCount || "$4,679"}
                icon={Wallet}
                iconColor="bg-[#03c3ec]/10 text-[#03c3ec]"
                trend={{ value: 28.42, isPositive: true }}
                className="h-full"
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Row 2: Total Revenue + 4 stat cards (2×2 grid + Profile Report) */}
      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} xxl={16}>
          <TotalRevenueCard />
        </Col>
        <Col xs={24} xxl={8}>
          <div className="flex flex-col gap-6 h-full">
            <Row gutter={[24, 24]}>
              <Col xs={12}>
                <StatCard
                  title="Payments"
                  value={stats?.toolsCount || "$2,456"}
                  icon={CreditCard}
                  iconColor="bg-[#ff3e1d]/10 text-[#ff3e1d]"
                  trend={{ value: -14.82, isPositive: false }}
                  className="h-full"
                />
              </Col>
              <Col xs={12}>
                <StatCard
                  title="Revenue"
                  value={stats?.blogPostsCount || "425k"}
                  icon={BarChart3}
                  iconColor="bg-[#71dd37]/10 text-[#71dd37]"
                  chartType="bar"
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
