"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Table, Tag } from "antd";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ColumnsType } from "antd/es/table";

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
  completed: { color: "text-duralux-success", bgColor: "bg-duralux-success-transparent", text: "Completed" },
  pending: { color: "text-duralux-warning", bgColor: "bg-duralux-warning-transparent", text: "Pending" },
  "in-progress": { color: "text-duralux-info", bgColor: "bg-duralux-info-transparent", text: "In Progress" },
};

export function ProjectRemindersCard() {
  const items: MenuProps["items"] = [
    { key: "1", label: "View All" },
    { key: "2", label: "Add New" },
  ];

  const columns: ColumnsType<ProjectReminder> = [
    {
      title: "PROJECT",
      dataIndex: "project",
      key: "project",
      className: "text-duralux-text-muted text-xs font-medium",
      render: (text: string) => (
        <span className="text-sm font-medium text-duralux-text-primary dark:text-duralux-text-dark-primary">
          {text}
        </span>
      ),
    },
    {
      title: "LEADER",
      dataIndex: "leader",
      key: "leader",
      className: "text-duralux-text-muted text-xs font-medium",
      render: (leader: { name: string; avatar?: string }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-duralux-border-light dark:border-duralux-border-dark">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} />
            <AvatarFallback className="bg-duralux-bg-page text-duralux-text-primary text-xs">
              {leader.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-duralux-text-secondary dark:text-duralux-text-dark-secondary">{leader.name}</span>
        </div>
      ),
    },
    {
      title: "TEAM",
      dataIndex: "team",
      key: "team",
      className: "text-duralux-text-muted text-xs font-medium",
      render: (team: string[]) => (
        <div className="flex items-center gap-1">
          {team.map((role) => (
            <Tag
              key={role}
              className="!bg-duralux-bg-page !text-duralux-text-secondary !border-none !rounded-md text-xs px-2 py-0.5 font-medium"
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
      className: "text-duralux-text-muted text-xs font-medium",
      render: (text: string) => (
        <span className="text-sm text-duralux-text-secondary dark:text-duralux-text-dark-secondary">{text}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      className: "text-duralux-text-muted text-xs font-medium",
      render: (status: keyof typeof STATUS_CONFIG) => {
        const config = STATUS_CONFIG[status];
        return (
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              config.color,
              config.bgColor
            )}
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
        <span className="text-lg font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
          Project Reminders
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
        "rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark",
        "transition-all duration-200",
        "hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark",
        "hover:-translate-y-0.5",
        "cursor-pointer",
        "bg-white dark:bg-duralux-bg-dark-card"
      )}
      styles={{
        body: { padding: "1.5rem" },
      }}
    >
      <Table
        columns={columns}
        dataSource={DATA}
        pagination={false}
        size="small"
        className="duralux-table"
        scroll={{ x: 500 }}
      />
    </Card>
  );
}
