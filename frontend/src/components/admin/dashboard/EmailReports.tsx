"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps } from "antd";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

const DATA = [
  { day: "01", sent: 1250, opened: 890 },
  { day: "02", sent: 1100, opened: 780 },
  { day: "03", sent: 1450, opened: 1020 },
  { day: "04", sent: 1350, opened: 950 },
  { day: "05", sent: 1580, opened: 1180 },
  { day: "06", sent: 1200, opened: 820 },
  { day: "07", sent: 1680, opened: 1320 },
  { day: "08", sent: 1420, opened: 980 },
  { day: "09", sent: 1350, opened: 920 },
  { day: "10", sent: 1750, opened: 1380 },
  { day: "11", sent: 1520, opened: 1100 },
  { day: "12", sent: 1280, opened: 850 },
];

const COLORS = {
  sent: "#696cff",
  opened: "#03c3ec",
};

export function EmailReportsCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View Report" },
    { key: "2", label: "Export" },
  ];

  const totalSent = DATA.reduce((sum, item) => sum + item.sent, 0);
  const totalOpened = DATA.reduce((sum, item) => sum + item.opened, 0);
  const openRate = ((totalOpened / totalSent) * 100).toFixed(1);

  return (
    <Card
      title={
        <span className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
          Email Reports
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
      <div className="flex flex-col h-full">
        {/* Stats Summary */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#696cff]"></div>
            <span className="text-xs text-[#8592a3]">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#03c3ec]"></div>
            <span className="text-xs text-[#8592a3]">Opened</span>
          </div>
          <div className="ml-auto">
            <span className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
              {openRate}%
            </span>
            <span className="text-xs text-[#8592a3] ml-1">Open Rate</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA} barGap={4}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a1acb8", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a1acb8", fontSize: 11 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Bar
                dataKey="sent"
                fill={COLORS.sent}
                radius={[4, 4, 0, 0]}
                barSize={12}
              >
                {DATA.map((entry, index) => (
                  <Cell
                    key={`cell-sent-${index}`}
                    fill={index === DATA.length - 1 ? "#5f61e6" : COLORS.sent}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="opened"
                fill={COLORS.opened}
                radius={[4, 4, 0, 0]}
                barSize={12}
              >
                {DATA.map((entry, index) => (
                  <Cell
                    key={`cell-opened-${index}`}
                    fill={index === DATA.length - 1 ? "#03adcf" : COLORS.opened}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
