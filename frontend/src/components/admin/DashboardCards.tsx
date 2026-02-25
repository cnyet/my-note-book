"use client";

import { ArrowUpOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Space, Typography } from "antd";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { Text } = Typography;

const DATA = [
  { month: "Jan", primary: 45, secondary: 25 },
  { month: "Feb", primary: 68, secondary: 35 },
  { month: "Mar", primary: 50, secondary: 42 },
  { month: "Apr", primary: 72, secondary: 30 },
  { month: "May", primary: 40, secondary: 55 },
  { month: "Jun", primary: 78, secondary: 38 },
  { month: "Jul", primary: 55, secondary: 48 },
];

/** 自定义 Tooltip */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-[#2b2c40] px-3 py-2 text-xs shadow-lg">
        <p className="text-[#a3b1c2] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-white font-semibold">
              {p.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function TotalRevenueCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View Report" },
    { key: "2", label: "Export" },
  ];

  return (
    <Card
      title={
        <span className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
          Total Revenue
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
      className="h-full sneat-card-shadow"
      styles={{ body: { padding: "1.5rem", height: "100%" } }}
    >
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left: Bar Chart with Recharts */}
        <div className="flex-1 min-h-[250px] border-r border-[#eceef1] dark:border-[#444564] pr-0 lg:pr-8">
          <div className="flex items-center gap-4 mb-4">
            <Space>
              <span className="flex items-center gap-1 text-xs text-[#8592a3]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#696cff]" />
                2024
              </span>
              <span className="flex items-center gap-1 text-xs text-[#8592a3]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#03c3ec]" />
                2023
              </span>
            </Space>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA} barGap={4}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1acb8", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1acb8", fontSize: 11 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="primary"
                  name="2024"
                  fill="#696cff"
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                >
                  {DATA.map((entry, index) => (
                    <Cell
                      key={`cell-primary-${index}`}
                      fill={index === DATA.length - 1 ? "#5f61e6" : "#696cff"}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="secondary"
                  name="2023"
                  fill="#03c3ec"
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Radial Growth */}
        <div className="w-full lg:w-48 flex flex-col items-center justify-center gap-6 py-4">
          <div className="flex bg-[#f5f5f9] dark:bg-[#323249] p-1 rounded-md">
            <button className="px-4 py-1.5 bg-white dark:bg-[#696cff] shadow-sm rounded-md text-xs font-semibold text-[#696cff] dark:text-white">
              2024
            </button>
            <button className="px-4 py-1.5 text-xs text-[#8592a3] hover:text-[#566a7f] dark:hover:text-[#a3b1c2]">
              2023
            </button>
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-[#f5f5f9] dark:text-[#323249]"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#696cff"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="351.86"
                strokeDashoffset="80"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
                78%
              </span>
              <span className="text-[11px] text-[#8592a3] uppercase font-semibold">
                Growth
              </span>
            </div>
          </div>

          <div className="text-center w-full">
            <Text className="text-[#8592a3] text-xs font-medium">
              62% Company Growth
            </Text>
            <div className="flex items-center justify-center gap-4 mt-6 w-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#696cff]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#696cff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#a1acb8] font-medium">
                    2024
                  </div>
                  <div className="text-sm font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
                    $32.5k
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#03c3ec]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#03c3ec]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#a1acb8] font-medium">
                    2023
                  </div>
                  <div className="text-sm font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
                    $41.2k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProfileReportCard() {
  return (
    <Card
      bordered={false}
      className="h-full sneat-card-shadow"
      styles={{
        body: {
          padding: "1.5rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="flex justify-between items-center flex-wrap gap-4 flex-1">
        {/* 左侧：标题 + 指标 */}
        <div className="flex flex-col justify-between">
          <div className="mb-4">
            <h5 className="text-[0.9375rem] font-semibold text-[#566a7f] dark:text-[#a3b1c2] m-0 mb-1">
              Profile Report
            </h5>
            <span className="px-2 py-1 bg-[#ffab00]/10 text-[#ffab00] rounded text-[11px] font-bold">
              YEAR 2022
            </span>
          </div>
          <div>
            <span className="text-[#71dd37] font-medium text-sm flex items-center gap-1">
              <ArrowUpOutlined /> 68.2%
            </span>
            <h4 className="text-xl font-bold text-[#566a7f] dark:text-[#a3b1c2] m-0">
              $84,686k
            </h4>
          </div>
        </div>

        {/* 右侧：曲线折线图 (Warning 色) - 使用 Recharts AreaChart */}
        <div className="w-[200px] h-[75px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { x: 0, y: 66 },
                { x: 16, y: 66 },
                { x: 30, y: 10 },
                { x: 46, y: 10 },
                { x: 63, y: 54 },
                { x: 77, y: 54 },
                { x: 93, y: 54 },
                { x: 109, y: 19 },
                { x: 123, y: 19 },
                { x: 139, y: 33 },
                { x: 155, y: 33 },
                { x: 169, y: 33 },
                { x: 186, y: 33 },
                { x: 202, y: 5 },
                { x: 216, y: 5 },
                { x: 232, y: 5 },
              ]}
            >
              <defs>
                <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffab00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffab00" stopOpacity="0" />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke="#ffab00"
                strokeWidth={5}
                fill="url(#profileGradient)"
                strokeLinecap="round"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
