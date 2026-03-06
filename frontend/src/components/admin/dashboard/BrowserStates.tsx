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
    color: "#1890ff",
    users: "2,456",
  },
  {
    name: "Safari",
    icon: Monitor,
    value: 52.3,
    color: "#13c2c2",
    users: "1,892",
  },
  {
    name: "Firefox",
    icon: Tv,
    value: 38.5,
    color: "#faad14",
    users: "1,245",
  },
  {
    name: "Mobile",
    icon: Smartphone,
    value: 62.1,
    color: "#52c41a",
    users: "2,103",
  },
  {
    name: "Tablet",
    icon: Tablet,
    value: 28.4,
    color: "#f5222d",
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
        <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
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
        "bg-white dark:bg-duralux-bg-dark-card"
      )}
      styles={{
        body: { padding: "1.25rem", height: "100%" },
      }}
    >
      <div className="flex flex-col gap-4">
        {BROWSER_DATA.map((browser) => (
          <div key={browser.name} className="flex items-center gap-3">
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${browser.color}15` }}
            >
              <browser.icon className="w-4 h-4" style={{ color: browser.color }} size={16} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-duralux-text-primary dark:text-duralux-text-dark-primary">
                  {browser.name}
                </span>
                <span className="text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
                  {browser.value}%
                </span>
              </div>
              <Progress
                percent={browser.value}
                showInfo={false}
                strokeColor={browser.color}
                trailColor="#f0f2f7"
                className="m-0"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <p className="text-xs text-duralux-text-muted mt-1">
                {browser.users} users
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
