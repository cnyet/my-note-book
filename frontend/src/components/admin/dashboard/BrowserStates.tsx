"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Progress } from "antd";
import { cn } from "@/lib/utils";
import {
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
} from "lucide-react";

const BROWSER_DATA = [
  {
    name: "Chrome",
    icon: Globe,
    value: 73.8,
    color: "text-duralux-primary",
    bgColor: "bg-duralux-primary-transparent",
    users: "2,456",
  },
  {
    name: "Safari",
    icon: Monitor,
    value: 52.3,
    color: "text-duralux-info",
    bgColor: "bg-duralux-info-transparent",
    users: "1,892",
  },
  {
    name: "Firefox",
    icon: Tv,
    value: 38.5,
    color: "text-duralux-warning",
    bgColor: "bg-duralux-warning-transparent",
    users: "1,245",
  },
  {
    name: "Mobile",
    icon: Smartphone,
    value: 62.1,
    color: "text-duralux-success",
    bgColor: "bg-duralux-success-transparent",
    users: "2,103",
  },
  {
    name: "Tablet",
    icon: Tablet,
    value: 28.4,
    color: "text-duralux-danger",
    bgColor: "bg-duralux-danger-transparent",
    users: "845",
  },
];

export function BrowserStatesCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View Details" },
    { key: "2", label: "Export" },
  ];

  return (
    <Card
      title={
        <span className="text-lg font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
          Browser States
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
      <div className="flex flex-col gap-5">
        {BROWSER_DATA.map((browser) => (
          <div key={browser.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    browser.bgColor
                  )}
                >
                  <browser.icon className={cn("w-4 h-4", browser.color)} size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-duralux-text-primary dark:text-duralux-text-dark-primary">
                    {browser.name}
                  </p>
                  <p className="text-xs text-duralux-text-muted">
                    {browser.users} users
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                {browser.value}%
              </span>
            </div>
            <Progress
              percent={browser.value}
              showInfo={false}
              strokeColor={browser.color.replace("text-", "var(--duralux-")}
              trailColor="#f0f2f7"
              className="m-0"
              size="small"
              strokeWidth={8}
              strokeLineCap="round"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
