"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps } from "antd";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string; // Tailwind class for coloring the icon container
  description?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "bg-[#696cff]/10 text-[#696cff]",
  description,
  trend,
  className,
}: StatCardProps) {
  const items: MenuProps["items"] = [
    { key: "1", label: "View Report" },
    { key: "2", label: "Detailed Analysis" },
    { key: "3", label: "Share" },
  ];

  return (
    <Card
      bordered={false}
      className={cn(
        "h-full sneat-card-shadow transition-all hover:translate-y-[-2px]",
        className,
      )}
      styles={{ body: { padding: "1.5rem" } }}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110",
            iconColor,
          )}
        >
          <Icon size={22} />
        </div>
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined className="text-[#8592a3]" />}
            size="small"
          />
        </Dropdown>
      </div>

      <div className="flex flex-col">
        <span className="text-[#8592a3] font-normal text-sm tracking-tight mb-1">
          {title}
        </span>
        <h2 className="text-2xl font-semibold text-[#566a7f] dark:text-[#a3b1c2] m-0">
          {value}
        </h2>
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              "flex items-center text-xs font-semibold",
              trend.isPositive ? "text-[#71dd37]" : "text-[#ff3e1d]",
            )}
          >
            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </span>
          {trend.label && (
            <span className="text-[#a1acb8] text-xs">Since last month</span>
          )}
        </div>
      )}

      {description && !trend && (
        <p className="text-[#a1acb8] text-xs mt-2 m-0">{description}</p>
      )}
    </Card>
  );
}
