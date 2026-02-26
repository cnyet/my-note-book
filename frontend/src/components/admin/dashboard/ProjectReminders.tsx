"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Table, Tag } from "antd";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectReminder {
  key: string;
  project: string;
  leader: {
    name: string;
    avatar?: string;
  };
  team: string[];
  deadline: string;
  status: "completed" | "pending" | "in-progress";
}

const DATA: ProjectReminder[] = [
  {
    key: "1",
    project: "Admin Dashboard UI",
    leader: { name: "John Doe", avatar: "JD" },
    team: ["FE", "BE", "UI"],
    deadline: "Apr 30, 2024",
    status: "in-progress",
  },
  {
    key: "2",
    project: "API Integration",
    leader: { name: "Sarah Smith", avatar: "SS" },
    team: ["BE", "QA"],
    deadline: "May 15, 2024",
    status: "pending",
  },
  {
    key: "3",
    project: "Mobile App Design",
    leader: { name: "Mike Johnson", avatar: "MJ" },
    team: ["UI", "UX"],
    deadline: "Apr 25, 2024",
    status: "completed",
  },
  {
    key: "4",
    project: "Database Migration",
    leader: { name: "Emily Chen", avatar: "EC" },
    team: ["BE", "DevOps"],
    deadline: "May 20, 2024",
    status: "in-progress",
  },
];

const STATUS_CONFIG = {
  completed: { color: "#71dd37", text: "Completed" },
  pending: { color: "#ffab00", text: "Pending" },
  "in-progress": { color: "#03c3ec", text: "In Progress" },
};

export function ProjectRemindersCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View All" },
    { key: "2", label: "Add New" },
  ];

  const columns = [
    {
      title: "PROJECT",
      dataIndex: "project",
      key: "project",
      className: "text-[#8898aa] text-xs font-medium",
      render: (text: string) => (
        <span className="text-sm font-medium text-[#32325d]">
          {text}
        </span>
      ),
    },
    {
      title: "LEADER",
      dataIndex: "leader",
      key: "leader",
      className: "text-[#8898aa] text-xs font-medium",
      render: (leader: { name: string; avatar?: string }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} />
            <AvatarFallback className="bg-[#32325d]/10 text-[#32325d] text-xs">
              {leader.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-[#525f7f]">{leader.name}</span>
        </div>
      ),
    },
    {
      title: "TEAM",
      dataIndex: "team",
      key: "team",
      className: "text-[#8898aa] text-xs font-medium",
      render: (team: string[]) => (
        <div className="flex items-center gap-1">
          {team.map((role) => (
            <Tag
              key={role}
              color=""
              className="!bg-[#f8f9fa] !text-[#525f7f] !border-none !rounded text-xs px-2 py-0.5"
            >
              {role}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "DEADLINE",
      dataIndex: "deadline",
      key: "deadline",
      className: "text-[#8898aa] text-xs font-medium",
      render: (text: string) => (
        <span className="text-sm text-[#525f7f]">{text}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      className: "text-[#8898aa] text-xs font-medium",
      render: (status: keyof typeof STATUS_CONFIG) => {
        const config = STATUS_CONFIG[status];
        return (
          <span
            className="text-xs font-medium px-2 py-1 rounded"
            style={{
              backgroundColor: `${config.color}1a`,
              color: config.color,
            }}
          >
            {config.text}
          </span>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <span className="text-lg font-semibold text-[#32325d]">
          Project Reminders
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
      className={cn("rounded-xl shadow-[0_2px_6px_rgba(67,89,113,0.12)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(67,89,113,0.2)] hover:-translate-y-[2px] cursor-pointer")}
      styles={{
        body: { padding: "1.5rem" },
      }}
    >
      <Table
        columns={columns}
        dataSource={DATA}
        pagination={false}
        size="small"
        className="admin-table"
      />
    </Card>
  );
}
