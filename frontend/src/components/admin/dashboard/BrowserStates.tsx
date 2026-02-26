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
    color: "#696cff",
    users: "2,456",
  },
  {
    name: "Safari",
    icon: Monitor,
    value: 52.3,
    color: "#03c3ec",
    users: "1,892",
  },
  {
    name: "Firefox",
    icon: Tv,
    value: 38.5,
    color: "#ffab00",
    users: "1,245",
  },
  {
    name: "Mobile",
    icon: Smartphone,
    value: 62.1,
    color: "#71dd37",
    users: "2,103",
  },
  {
    name: "Tablet",
    icon: Tablet,
    value: 28.4,
    color: "#ff3e1d",
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
        <span className="text-lg font-semibold text-[#32325d]">
          Browser States
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
      <div className="flex flex-col gap-4">
        {BROWSER_DATA.map((browser) => (
          <div key={browser.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${browser.color}1a`,
                    color: browser.color,
                  }}
                >
                  <browser.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#32325d]">
                    {browser.name}
                  </p>
                  <p className="text-xs text-[#8898aa]">
                    {browser.users} users
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#32325d]">
                {browser.value}%
              </span>
            </div>
            <Progress
              percent={browser.value}
              showInfo={false}
              strokeColor={browser.color}
              trailColor="#f0f2f7"
              className="m-0"
              size="small"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
