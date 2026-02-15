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
  iconColor?: string;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive: boolean;
  };
  /** 是否显示迷你图表（area | bar），不传则不显示图表 */
  chartType?: "area" | "bar";
  className?: string;
}

/** Sneat 风格的迷你面积图 */
function MiniAreaChart() {
  return (
    <div className="w-full h-[80px] mt-2 -mb-2 -mx-2">
      <svg
        viewBox="0 0 200 60"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#71dd37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#71dd37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,36 C28,36 51,38 78,38 C105,38 129,8 156,8 C183,8 200,2 200,2 V60 H0 Z"
          fill="url(#areaGradient)"
        />
        <path
          d="M0,36 C28,36 51,38 78,38 C105,38 129,8 156,8 C183,8 200,2 200,2"
          fill="none"
          stroke="#71dd37"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Sneat 风格的迷你柱状图 */
function MiniBarChart() {
  const bars = [40, 95, 60, 45, 90, 50, 75];
  const maxH = 60;
  return (
    <div className="w-full h-[95px] mt-2 -mb-2 flex items-end justify-between gap-1 px-1">
      {bars.map((pct, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className={cn(
              "w-full rounded-t-sm transition-all duration-300",
              i === 4 ? "bg-[#696cff]" : "bg-[#696cff]/15",
            )}
            style={{ height: `${(pct / 100) * maxH}px` }}
          />
          <span className="text-[10px] text-[#a1acb8] font-medium">
            {["M", "T", "W", "T", "F", "S", "S"][i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "bg-[#696cff]/10 text-[#696cff]",
  description,
  trend,
  chartType,
  className,
}: StatCardProps) {
  const items: MenuProps["items"] = [
    { key: "1", label: "View More" },
    { key: "2", label: "Delete" },
  ];

  // 带图表的卡片（Order / Revenue 风格）- 没有icon，直接展示 title + value + chart
  if (chartType) {
    return (
      <Card
        bordered={false}
        className={cn(
          "h-full sneat-card-shadow transition-all hover:translate-y-[-2px]",
          className,
        )}
        styles={{
          body: {
            padding:
              chartType === "area" ? "1.5rem 1.5rem 0" : "1.5rem 1.5rem 0",
          },
        }}
      >
        <span className="text-[#697a8d] font-medium text-sm">{title}</span>
        <h4 className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2] m-0 mt-0.5">
          {value}
        </h4>

        {chartType === "area" && <MiniAreaChart />}
        {chartType === "bar" && <MiniBarChart />}
      </Card>
    );
  }

  // 标准 icon 卡片（Sales / Payments 风格）
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
            "w-[42px] h-[42px] rounded-lg flex items-center justify-center transition-transform hover:scale-110",
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
        <span className="text-[#697a8d] font-normal text-[0.9375rem] tracking-tight mb-1">
          {title}
        </span>
        <h4 className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2] m-0">
          {value}
        </h4>
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <small
            className={cn(
              "flex items-center font-medium",
              trend.isPositive ? "text-[#71dd37]" : "text-[#ff3e1d]",
            )}
          >
            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            &nbsp;{trend.value > 0 ? "+" : ""}
            {trend.value}%
          </small>
        </div>
      )}

      {description && !trend && (
        <p className="text-[#a1acb8] text-xs mt-2 m-0">{description}</p>
      )}
    </Card>
  );
}
