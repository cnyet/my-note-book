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
    color: "text-duralux-primary",
    strokeColor: "#696cff",
  },
  {
    name: "New Users",
    icon: Users,
    current: 1840,
    target: 2500,
    color: "text-duralux-success",
    strokeColor: "#71dd37",
  },
  {
    name: "Conversion Rate",
    icon: TrendingUp,
    current: 18,
    target: 25,
    color: "text-duralux-info",
    strokeColor: "#03c3ec",
  },
  {
    name: "Active Projects",
    icon: Target,
    current: 12,
    target: 15,
    color: "text-duralux-warning",
    strokeColor: "#ffab00",
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
        <span className="text-lg font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
          Goal Progress
        </span>
      }
      extra={
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined className="text-duralux-text-muted hover:text-duralux-text-primary transition-colors" />}
            className="cursor-pointer"
          />
        </Dropdown>
      }
      bordered={false}
      className={cn(
        "h-full rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark",
        "transition-all duration-200",
        "hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark",
        "hover:-translate-y-0.5",
        "cursor-pointer",
        "bg-white dark:bg-duralux-bg-dark-card"
      )}
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
              className={cn(
                "flex flex-col items-center p-4 rounded-xl",
                "bg-duralux-bg-page dark:bg-duralux-bg-dark-card/50",
                "transition-all duration-200 hover:shadow-sm"
              )}
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
                    className="text-duralux-border-light dark:text-duralux-border-dark"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke={goal.strokeColor}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={201.06}
                    strokeDashoffset={201.06 * (1 - percentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Goal Info */}
              <div className="text-center w-full">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <goal.icon
                    size={14}
                    className={cn("w-3.5 h-3.5", goal.color)}
                  />
                  <p className="text-xs font-medium text-duralux-text-secondary dark:text-duralux-text-dark-secondary truncate">
                    {goal.name}
                  </p>
                </div>
                <p className="text-sm font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                  {formatValue(goal.current, goal.name)}{" "}
                  <span className="text-xs font-normal text-duralux-text-muted">
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
