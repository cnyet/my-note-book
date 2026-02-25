"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps } from "antd";
import { LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

/** 模拟数据生成器 */
const generateAreaData = () => [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 65 },
  { name: "Wed", value: 45 },
  { name: "Thu", value: 90 },
  { name: "Fri", value: 55 },
  { name: "Sat", value: 75 },
  { name: "Sun", value: 60 },
];

const generateBarData = () => [
  { name: "M", value: 40 },
  { name: "T", value: 95 },
  { name: "W", value: 60 },
  { name: "T", value: 45 },
  { name: "F", value: 90 },
  { name: "S", value: 50 },
  { name: "S", value: 75 },
];

/** 自定义 Tooltip 组件 */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-[#2b2c40] px-3 py-2 text-xs shadow-lg">
        <p className="text-[#a3b1c2]">{label}</p>
        <p className="font-semibold text-white">
          {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

/** Sneat 风格的迷你面积图 - 使用 Recharts */
function MiniAreaChart() {
  const data = generateAreaData();

  return (
    <div className="w-full h-[80px] mt-2 -mb-2 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#71dd37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#71dd37" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#71dd37"
            strokeWidth={2}
            fill="url(#areaGradient)"
            strokeLinecap="round"
          />
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Sneat 风格的迷你柱状图 - 使用 Recharts */
function MiniBarChart() {
  const data = generateBarData();

  return (
    <div className="w-full h-[95px] mt-2 -mb-2 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={12}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1acb8", fontSize: 10 }}
            dy={10}
          />
          <Tooltip content={<CustomTooltip />} />
          {data.map((entry, index) => (
            <Bar
              key={entry.name}
              dataKey="value"
              fill={index === 4 ? "#696cff" : "#696cff/15"}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
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

  // 带图表的卡片（Order / Revenue 风格）- 没有 icon，直接展示 title + value + chart
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
