"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps } from "antd";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Mail, MousePointer, TrendingUp } from "lucide-react";

const EMAIL_DATA = [
  { day: "Mon", sent: 1250, opened: 890 },
  { day: "Tue", sent: 1100, opened: 780 },
  { day: "Wed", sent: 1450, opened: 1020 },
  { day: "Thu", sent: 1350, opened: 950 },
  { day: "Fri", sent: 1580, opened: 1180 },
  { day: "Sat", sent: 1200, opened: 820 },
  { day: "Sun", sent: 1680, opened: 1320 },
];

const COLORS = {
  sent: "#696cff",
  opened: "#03c3ec",
};

/** 自定义 Tooltip - Duralux Style */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-duralux-primary px-3 py-2.5 text-xs shadow-xl shadow-duralux-primary/30">
        <p className="text-white/70 mb-1.5 font-medium">Day {label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mt-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-white font-semibold">
              {p.name}: {p.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function EmailReportsCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View Report" },
    { key: "2", label: "Export" },
  ];

  const totalSent = EMAIL_DATA.reduce((sum, item) => sum + item.sent, 0);
  const totalOpened = EMAIL_DATA.reduce((sum, item) => sum + item.opened, 0);
  const openRate = ((totalOpened / totalSent) * 100).toFixed(1);

  return (
    <Card
      title={
        <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
          Email Reports
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
        "bg-white dark:bg-duralux-bg-dark-card"
      )}
      styles={{
        body: { padding: "1.25rem", height: "100%" },
      }}
    >
      {/* Stats Summary - Payment Record Style */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Sent */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-duralux-primary-transparent flex items-center justify-center mx-auto mb-2">
            <Mail className="w-4 h-4 text-duralux-primary" />
          </div>
          <div className="text-lg font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {(totalSent / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-duralux-text-muted mt-0.5">Sent</div>
        </div>

        {/* Opened */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-duralux-info-transparent flex items-center justify-center mx-auto mb-2">
            <MousePointer className="w-4 h-4 text-duralux-info" />
          </div>
          <div className="text-lg font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {(totalOpened / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-duralux-text-muted mt-0.5">Opened</div>
        </div>

        {/* Open Rate */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-duralux-success-transparent flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-duralux-success" />
          </div>
          <div className="text-lg font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {openRate}%
          </div>
          <div className="text-xs text-duralux-text-muted mt-0.5">Rate</div>
        </div>
      </div>

      {/* Chart - Bar + Line (Payment Record Style) */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={EMAIL_DATA}>
            <defs>
              <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.sent} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.sent} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8898aa", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8898aa", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Bar Chart - Sent */}
            <Bar
              dataKey="sent"
              name="Sent"
              fill="url(#sentGradient)"
              radius={[6, 6, 0, 0]}
              barSize={32}
            >
              {EMAIL_DATA.map((entry, index) => (
                <Cell
                  key={`cell-sent-${index}`}
                  fill={index === EMAIL_DATA.length - 1 ? COLORS.sent : `url(#sentGradient)`}
                  style={{ opacity: index === EMAIL_DATA.length - 1 ? 1 : 0.8 }}
                />
              ))}
            </Bar>

            {/* Line Chart - Open Rate Trend */}
            <Line
              type="monotone"
              dataKey="opened"
              name="Opened"
              stroke={COLORS.opened}
              strokeWidth={3}
              dot={{ fill: COLORS.opened, r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.sent }}></div>
          <span className="text-xs text-duralux-text-muted">Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.opened }}></div>
          <span className="text-xs text-duralux-text-muted">Opened Trend</span>
        </div>
      </div>
    </Card>
  );
}
