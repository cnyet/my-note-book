"use client";

import {
  ArrowUpOutlined,
  DollarOutlined,
  LineChartOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Space, Typography } from "antd";

const { Text } = Typography;

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
        {/* Left: Bar Chart Visualization */}
        <div className="flex-1 flex flex-col justify-end gap-2 min-h-[250px] border-r border-[#eceef1] dark:border-[#444564] pr-0 lg:pr-8">
          <div className="flex items-center gap-4 mb-4">
            <Space>
              <span className="flex items-center gap-1 text-xs text-[#8592a3]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#696cff]"></div>
                2024
              </span>
              <span className="flex items-center gap-1 text-xs text-[#8592a3]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#03c3ec]"></div>
                2023
              </span>
            </Space>
          </div>

          <div className="relative w-full flex-1 flex items-end justify-between px-2 gap-2">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[#eceef1] dark:text-[#444564] pointer-events-none z-0">
              <div className="border-b border-dashed border-current w-full h-0"></div>
              <div className="border-b border-dashed border-current w-full h-0"></div>
              <div className="border-b border-dashed border-current w-full h-0"></div>
              <div className="border-b border-dashed border-current w-full h-0"></div>
              <div className="border-b border-solid border-current w-full h-0"></div>
            </div>

            {/* Bars - 固定数据以避免 SSR hydration 不匹配 */}
            {[
              { month: "Jan", primary: 45, secondary: 25 },
              { month: "Feb", primary: 68, secondary: 35 },
              { month: "Mar", primary: 50, secondary: 42 },
              { month: "Apr", primary: 72, secondary: 30 },
              { month: "May", primary: 40, secondary: 55 },
              { month: "Jun", primary: 78, secondary: 38 },
              { month: "Jul", primary: 55, secondary: 48 },
            ].map(({ month, primary, secondary }) => (
              <div
                key={month}
                className="flex-1 flex flex-col items-center justify-end h-full gap-1 z-10 group relative min-w-[30px]"
              >
                <div
                  className="w-[9px] bg-[#696cff] rounded-t-[3px] transition-all duration-300 hover:opacity-80"
                  style={{ height: `${primary}%` }}
                />
                <div
                  className="w-[9px] bg-[#03c3ec] rounded-t-[3px] transition-all duration-300 hover:opacity-80"
                  style={{ height: `${secondary}%` }}
                />
                <span className="text-[11px] text-[#a1acb8] mt-2 font-medium">
                  {month}
                </span>
              </div>
            ))}
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
                <div className="w-8 h-8 rounded-md bg-[#696cff]/10 flex items-center justify-center text-[#696cff]">
                  <DollarOutlined />
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
                <div className="w-8 h-8 rounded-md bg-[#03c3ec]/10 flex items-center justify-center text-[#03c3ec]">
                  <LineChartOutlined />
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
        {/* 左侧: 标题 + 指标 */}
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

        {/* 右侧: 曲线折线图 (Warning色) */}
        <div className="w-[200px] h-[75px]">
          <svg
            viewBox="0 0 240 75"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <filter
                id="profileShadow"
                x="-20%"
                y="-20%"
                width="140%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodColor="#ffab00"
                  floodOpacity="0.2"
                />
              </filter>
            </defs>
            <path
              d="M0,66 C16,66 30,10 46,10 C63,10 77,54 93,54 C109,54 123,19 139,19 C155,19 169,33 186,33 C202,33 216,5 232,5"
              fill="none"
              stroke="#ffab00"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#profileShadow)"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
