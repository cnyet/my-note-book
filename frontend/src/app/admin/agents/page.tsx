"use client";

import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Table,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  message,
  Typography,
  Dropdown,
  Row,
  Col,
  type MenuProps,
} from "antd";
import { ChangeEvent, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, MoreVertical, Activity, Clock, Server } from "lucide-react";
import { agentsApi, type Agent as ApiAgent } from "@/lib/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { StatCard } from "@/components/ui/Card/StatCard";

const { Text } = Typography;

/** Agent Status Types */
export type AgentStatus = "offline" | "spawned" | "idle";

/** Agent Interface */
interface Agent {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  status: AgentStatus;
  sortOrder: number;
  config: {
    model: string;
    promptTemplate: string;
    quota: number;
    websocketPriority: number;
  };
  connections: {
    lobeChatUrl: string;
    apiEndpoint: string;
  };
}

/** Map API Agent to Frontend */
function mapApiAgentToFrontend(apiAgent: ApiAgent): Agent {
  let status: AgentStatus = "offline";
  if (apiAgent.is_active) {
    status = "spawned";
  }

  return {
    id: apiAgent.id,
    name: apiAgent.name,
    slug: apiAgent.slug,
    description: apiAgent.description,
    iconUrl: apiAgent.icon_url || "/icons/default.png",
    status,
    sortOrder: apiAgent.sort_order,
    config: {
      model: apiAgent.model || "Gemini",
      promptTemplate: apiAgent.system_prompt || "",
      quota: 1000,
      websocketPriority: 1,
    },
    connections: {
      lobeChatUrl: apiAgent.link || "",
      apiEndpoint: `/api/v1/agents/${apiAgent.slug}`,
    },
  };
}

/** Map Frontend Agent to API */
function mapFrontendAgentToApi(agent: Agent): Partial<ApiAgent> {
  return {
    name: agent.name,
    slug: agent.slug,
    description: agent.description,
    icon_url: agent.iconUrl,
    link: agent.connections?.lobeChatUrl,
    category: "Dev" as const,
    system_prompt: agent.config?.promptTemplate,
    model: agent.config?.model || "Gemini",
    is_active: agent.status !== "offline",
    sort_order: agent.sortOrder,
  };
}

/** Status Badge Component */
function StatusBadge({ status }: { status: AgentStatus }) {
  const badgeConfig = {
    spawned: { color: "success", text: "Online" },
    idle: { color: "warning", text: "Idle" },
    offline: { color: "default", text: "Offline" },
  };
  const config = badgeConfig[status] || badgeConfig.offline;
  return <Tag color={config.color}>{config.text}</Tag>;
}

/** Edit Agent Modal */
function EditAgentModal({
  open,
  agent,
  onSave,
  onCancel,
}: {
  open: boolean;
  agent: Agent | null;
  onSave: (agent: Agent) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Agent>>(agent || {});

  useEffect(() => {
    setForm(agent || {});
  }, [agent]);

  const handleSave = () => {
    if (form.name && form.slug) {
      onSave({
        id: agent?.id || Date.now(),
        name: form.name,
        slug: form.slug,
        description: form.description || "",
        iconUrl: form.iconUrl || "/icons/default.png",
        status: form.status || "offline",
        sortOrder: agent?.sortOrder || 0,
        config: form.config || {
          model: "Gemini",
          promptTemplate: "",
          quota: 1000,
          websocketPriority: 1,
        },
        connections: form.connections || {
          lobeChatUrl: "",
          apiEndpoint: "",
        },
      });
      onCancel();
    } else {
      message.error("Please fill in required fields");
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({
      ...form,
      name,
      slug: form.slug || generateSlug(name),
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <span className="text-lg font-semibold">{agent ? "Edit Agent" : "Add New Agent"}</span>
        </div>
      }
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{ className: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" }}
      width={640}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.name}
            onChange={handleNameChange}
            placeholder="Enter agent name"
            className="h-10 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="agent-slug"
            className="h-10 rounded-lg"
            prefix={<span className="text-gray-400 text-sm">/</span>}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <Input.TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter agent description"
            rows={3}
            className="rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Model
          </label>
          <Select
            value={form.config?.model}
            onChange={(model) =>
              setForm({
                ...form,
                config: { ...form.config!, model },
              })
            }
            className="w-full"
            options={[
              { label: "Gemini", value: "Gemini" },
              { label: "GPT-4", value: "GPT-4" },
              { label: "Claude", value: "Claude" },
              { label: "deepseek-r1", value: "deepseek-r1" },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LobeChat URL
          </label>
          <Input
            value={form.connections?.lobeChatUrl}
            onChange={(e) =>
              setForm({
                ...form,
                connections: { ...form.connections!, lobeChatUrl: e.target.value },
              })
            }
            placeholder="/agents/..."
            className="h-10 rounded-lg"
          />
        </div>
      </div>
    </Modal>
  );
}

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const queryClient = useQueryClient();

  // Load agents
  const { data: agentsData, isLoading } = useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => {
      const response = await agentsApi.list();
      if (response.success && response.data) {
        return response.data.map(mapApiAgentToFrontend);
      }
      return [];
    },
  });

  const agents = agentsData || [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await agentsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      message.success("Agent deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete agent");
    },
  });

  const spawnMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/v1/admin/agents/${id}/spawn`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      message.success("Agent started successfully");
    },
    onError: () => {
      message.error("Failed to start agent");
    },
  });

  const terminateMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/v1/admin/agents/${id}/terminate`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      message.success("Agent stopped");
    },
    onError: () => {
      message.error("Failed to stop agent");
    },
  });

  const handleSpawn = (agent: Agent) => {
    spawnMutation.mutate(agent.id);
  };

  const handleTerminate = (agent: Agent) => {
    terminateMutation.mutate(agent.id);
  };

  // Filter agents
  const filteredAgents = useMemo(() => {
    let result = [...agents];

    if (statusFilter !== "all") {
      if (statusFilter === "online") {
        result = result.filter((agent) => agent.status === "spawned");
      } else {
        result = result.filter((agent) => agent.status === statusFilter);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query) ||
          agent.slug.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query),
      );
    }

    return result;
  }, [agents, statusFilter, searchQuery]);

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setEditModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAgent(null);
    setEditModalOpen(true);
  };

  const handleSaveAgent = async (agent: Agent) => {
    try {
      const apiData = mapFrontendAgentToApi(agent);
      if (editingAgent) {
        const response = await agentsApi.update(agent.id, apiData);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
          message.success("Agent updated successfully");
        }
      } else {
        const response = await agentsApi.create(apiData as any);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
          message.success("Agent created successfully");
        }
      }
      setEditModalOpen(false);
      setEditingAgent(null);
    } catch (error) {
      console.error("Failed to save agent:", error);
      message.error("Failed to save agent");
    }
  };

  const handleDelete = (agent: Agent) => {
    Modal.confirm({
      title: "Delete Agent",
      content: `Are you sure you want to delete "${agent.name}"? This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        deleteMutation.mutate(agent.id);
      },
    });
  };

  // Action menu for each row
  const getMenuItems = (agent: Agent): MenuProps["items"] => [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEdit(agent),
    },
    {
      key: "spawn",
      label: agent.status !== "offline" ? "Restart" : "Start",
      icon: <PlayCircleOutlined />,
      onClick: () => handleSpawn(agent),
    },
    {
      key: "terminate",
      label: "Stop",
      icon: <StopOutlined />,
      onClick: () => handleTerminate(agent),
      disabled: agent.status === "offline",
      danger: true,
    },
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(agent),
    },
  ];

  // Table columns
  const columns: ColumnsType<Agent> = [
    {
      title: "Agent",
      dataIndex: "name",
      key: "agent",
      width: 250,
      render: (_, agent) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <div className="font-semibold">{agent.name}</div>
            <div className="text-xs text-gray-500">{agent.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => <Text className="text-gray-600 dark:text-gray-400">{text}</Text>,
    },
    {
      title: "Model",
      dataIndex: ["config", "model"],
      key: "model",
      width: 120,
      render: (model: string) => (
        <Tag color="blue">{model || "Gemini"}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: AgentStatus) => <StatusBadge status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, agent) => (
        <Dropdown
          menu={{ items: getMenuItems(agent) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            icon={<MoreVertical size={16} />}
            size="small"
            className="border-0 shadow-none"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Agents Management</h1>
              <p className="text-sm text-gray-500">Configure and manage AI agents</p>
            </div>
          </div>

          <Space size="middle">
            <Input
              placeholder="Search agents..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 rounded-lg"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-36"
              options={[
                { label: "All Status", value: "all" },
                { label: "Online", value: "online" },
                { label: "Offline", value: "offline" },
                { label: "Idle", value: "idle" },
              ]}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 border-none h-10 rounded-lg"
            >
              Add Agent
            </Button>
          </Space>
        </div>
      </motion.div>

      {/* Stats Row - 4 Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<Bot size={20} />}
              label="Total Agents"
              value={agents.length || 0}
              gradient="blue"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<Activity size={20} />}
              label="Online"
              value={agents.filter((a) => a.status === "spawned").length}
              gradient="green"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<Clock size={20} />}
              label="Idle"
              value={agents.filter((a) => a.status === "idle").length}
              gradient="orange"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              icon={<Server size={20} />}
              label="Offline"
              value={agents.filter((a) => a.status === "offline").length}
              gradient="gray"
            />
          </Col>
        </Row>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Table<Agent>
          columns={columns}
          dataSource={filteredAgents}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          className="dark:bg-gray-800 rounded-lg overflow-hidden"
        />
      </motion.div>

      <EditAgentModal
        open={editModalOpen}
        agent={editingAgent}
        onSave={handleSaveAgent}
        onCancel={() => setEditModalOpen(false)}
      />
    </div>
  );
}
