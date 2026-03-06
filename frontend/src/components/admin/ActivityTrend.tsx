"use client";

import { Card } from "antd";
import { Column } from "@ant-design/charts";
import { cn } from "@/lib/utils";

interface ActivityData {
  name: string;
  value: number;
  color: string;
}

export function ActivityTrendCard() {
  // Mock data - in real app, this would come from API
  const data: ActivityData[] = [
    { name: "Mon", value: 120, color: "#3b82f6" },
    { name: "Tue", value: 200, color: "#3b82f6" },
    { name: "Wed", value: 150, color: "#3b82f6" },
    { name: "Thu", value: 280, color: "#3b82f6" },
    { name: "Fri", value: 180, color: "#3b82f6" },
    { name: "Sat", value: 100, color: "#3b82f6" },
    { name: "Sun", value: 90, color: "#3b82f6" },
  ];

  const config = {
    data,
    xField: "name",
    yField: "value",
    padding: [20, 20, 40, 40],
    legend: false,
    axis: {
      x: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      y: {
        label: {
          autoHide: true,
        },
      },
    },
    style: {
      radiusTop: 4,
      radiusBottom: 0,
    },
    colorField: "name",
    color: (datum: ActivityData) => {
      const colors: Record<string, string> = {
        Mon: "#3b82f6",
        Tue: "#22c55e",
        Wed: "#f97316",
        Thu: "#8b5cf6",
        Fri: "#06b6d4",
        Sat: "#ec4899",
        Sun: "#eab308",
      };
      return colors[datum.name] || "#3b82f6";
    },
    tooltip: {
      formatter: (datum: ActivityData) => ({
        name: "Activity",
        value: datum.value,
      }),
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <Card
      title={
        <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
          Weekly Activity
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
        <Column {...config} />
      </div>
    </Card>
  );
}
