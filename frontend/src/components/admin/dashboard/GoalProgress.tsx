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
        <span className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
          Goal Progress
        </span>
      }
      extra={
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined className="text-[#8592a3]" />}
          />
        </Dropdown>
      }
      bordered={false}
      className={cn("h-full sneat-card-shadow")}
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
              className="flex flex-col items-center p-4 rounded-xl bg-[#f5f5f9] dark:bg-[#323249]"
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
                    className="text-[#eceef1] dark:text-[#444564]"
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
                  <span className="text-sm font-bold text-[#566a7f] dark:text-[#a3b1c2]">
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
                  <p className="text-xs font-medium text-[#697a8d] truncate">
                    {goal.name}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#566a7f] dark:text-[#a3b1c2]">
                  {formatValue(goal.current, goal.name)}{" "}
                  <span className="text-xs font-normal text-[#8592a3]">
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
