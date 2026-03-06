"use client";

import { Card } from "antd";
import { Pie } from "@ant-design/charts";
import { cn } from "@/lib/utils";

interface ModuleDistribution {
  name: string;
  value: number;
  color: string;
}

export function ModuleDistributionCard() {
  // Mock data - in real app, this would come from API
  const data: ModuleDistribution[] = [
    { name: "Agents", value: 12, color: "#3b82f6" },
    { name: "Tools", value: 8, color: "#06b6d4" },
    { name: "Labs", value: 5, color: "#f97316" },
    { name: "Blog Posts", value: 15, color: "#22c55e" },
    { name: "News Sources", value: 6, color: "#6366f1" },
  ];

  const config = {
    data,
    angleField: "value",
    colorField: "name",
    radius: 0.8,
    innerRadius: 0.6,
    padding: [20, 20, 20, 20],
    legend: {
      position: "bottom" as const,
      layout: { justifyContent: "center" },
    },
    label: {
      type: "outer",
      autoRotate: true,
      autoHide: true,
    },
    tooltip: {
      formatter: (datum: ModuleDistribution) => ({
        name: datum.name,
        value: datum.value,
      }),
    },
    color: ["#3b82f6", "#06b6d4", "#f97316", "#22c55e", "#6366f1"],
    interactions: [{ type: "element-active" }],
    statistic: {
      title: {
        style: {
          fontSize: "14px",
          fontWeight: 400,
          fill: "#8c8c8c",
        },
        content: "Total",
      },
      content: {
        style: {
          fontSize: "20px",
          fontWeight: 600,
          fill: "#262626",
        },
        content: data.reduce((sum, item) => sum + item.value, 0).toString(),
      },
    },
  };

  return (
    <Card
      title={
        <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
          Module Distribution
        </span>
      }
      bordered={false}
      className={cn(
        "h-full rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark",
        "transition-all duration-200",
        "bg-white dark:bg-duralux-bg-dark-card"
      )}
      styles={{
        body: { padding: "1.25rem", height: "100%" },
      }}
    >
      <div className="h-[280px]">
        <Pie {...config} />
      </div>
    </Card>
  );
}
