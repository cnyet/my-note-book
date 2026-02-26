"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps } from "antd";
import { cn } from "@/lib/utils";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";

const GOALS = [
  {
    name: "Revenue Goal",
    icon: DollarSign,
    current: 78500,
    target: 100000,
    color: "#696cff",
    bgColor: "bg-[#696cff]/10",
  },
  {
    name: "New Users",
    icon: Users,
    current: 1840,
    target: 2500,
    color: "#71dd37",
    bgColor: "bg-[#71dd37]/10",
  },
  {
    name: "Conversion Rate",
    icon: TrendingUp,
    current: 18,
    target: 25,
    color: "#03c3ec",
    bgColor: "bg-[#03c3ec]/10",
  },
  {
    name: "Active Projects",
    icon: Target,
    current: 12,
    target: 15,
    color: "#ffab00",
    bgColor: "bg-[#ffab00]/10",
  },
];

function formatValue(value: number, name: string) {
  if (name === "Conversion Rate") return `${value}%`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

export function GoalProgressCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View All Goals" },
    { key: "2", label: "Edit Goals" },
  ];

  return (
    <Card
      title={
        <span className="text-lg font-semibold text-[#32325d]">
          Goal Progress
        </span>
      }
      extra={
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined className="text-[#8592a3] hover:text-[#32325d] transition-colors" />}
            className="cursor-pointer"
          />
        </Dropdown>
      }
      bordered={false}
      className={cn("h-full rounded-xl shadow-[0_2px_6px_rgba(67,89,113,0.12)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(67,89,113,0.2)] hover:-translate-y-[2px] cursor-pointer")}
      styles={{
        body: { padding: "1.5rem", height: "100%" },
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOALS.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);

          return (
            <div
              key={goal.name}
              className="flex flex-col items-center p-4 rounded-xl bg-[#f8f9fa]"
            >
              {/* Circular Progress */}
              <div className="relative w-20 h-20 mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-[#e0e0e0]"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke={goal.color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={201.06}
                    strokeDashoffset={201.06 * (1 - percentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#32325d]">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Goal Info */}
              <div className="text-center w-full">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <goal.icon
                    size={14}
                    className={cn("w-3.5 h-3.5", goal.color.replace("#", "text-"))}
                  />
                  <p className="text-xs font-medium text-[#525f7f] truncate">
                    {goal.name}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#32325d]">
                  {formatValue(goal.current, goal.name)}{" "}
                  <span className="text-xs font-normal text-[#8898aa]">
                    / {formatValue(goal.target, goal.name)}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
