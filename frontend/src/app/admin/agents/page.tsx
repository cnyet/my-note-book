"use client";

import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  LinkOutlined,
  ApiOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { ChangeEvent, useState, useMemo, useEffect } from "react";
import {
  ArrowUpDown,
  Bot,
  MoreVertical,
  Activity,
  Clock,
  Link2,
  Server,
} from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { agentsApi, type Agent as ApiAgent } from "@/lib/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;
const { TextArea } = Input;

/** Agent Status Types */
export type AgentStatus = "offline" | "spawned" | "idle";

/** Agent Interface - 前端数据结构 */
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

/** 将后端 API Agent 转换为前端 Agent */
function mapApiAgentToFrontend(apiAgent: ApiAgent): Agent {
  // 将后端 is_active 转换为前端 status
  let status: AgentStatus = "offline";
  if (apiAgent.is_active) {
    status = "spawned"; // active = spawned/online
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

/** 将前端 Agent 转换为后端 API 格式 */
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

/** Status Badge Colors */
const statusConfig: Record<
  AgentStatus,
  { color: string; bgColor: string; textColor: string; label: string }
> = {
  offline: {
    color: "#697a8d",
    bgColor: "bg-[#697a8d]/10",
    textColor: "text-[#697a8d]",
    label: "Offline",
  },
  spawned: {
    color: "#71dd37",
    bgColor: "bg-[#71dd37]/10",
    textColor: "text-[#71dd37]",
    label: "Online",
  },
  idle: {
    color: "#ffab00",
    bgColor: "bg-[#ffab00]/10",
    textColor: "text-[#ffab00]",
    label: "Idle",
  },
};

/** Draggable Agent Card Component */
function AgentCard({
  agent,
  onEdit,
  onDelete,
}: {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}) {
  const config = statusConfig[agent.status];
  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => onEdit(agent),
    },
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(agent),
    },
  ];

  return (
    <Card
      bordered={false}
      className="h-full sneat-card-shadow transition-all hover:translate-y-[-2px]"
      styles={{ body: { padding: "1.5rem", height: "100%" } }}
    >
      {/* Header: Status Badge + Drag Handle + More Menu */}
      <div className="flex justify-between items-start mb-4">
        <Tag
          className={`${config.bgColor} ${config.textColor} border-none m-0`}
          style={{
            backgroundColor: config.color + "20",
            color: config.color,
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "4px",
          }}
        >
          {config.label}
        </Tag>
        <div className="flex items-center gap-2">
          <Button
            type="text"
            shape="circle"
            icon={<ArrowUpDown size={14} className="text-[#8592a3]" />}
            size="small"
            className="cursor-grab active:cursor-grabbing"
          />
          <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
            <Button
              type="text"
              shape="circle"
              icon={<MoreVertical size={16} className="text-[#8592a3]" />}
              size="small"
            />
          </Dropdown>
        </div>
      </div>

      {/* Agent Icon/Avatar */}
      <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-[#696cff]/20 to-[#9c27b0]/20 flex items-center justify-center mb-4 mx-auto">
        <Bot className="text-[#696cff]" size={32} />
      </div>

      {/* Agent Name */}
      <h4 className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2] m-0 mb-1 text-center">
        {agent.name}
      </h4>

      {/* Slug */}
      <Text className="text-[#8592a3] text-xs mb-3 block text-center">
        /{agent.slug}
      </Text>

      {/* Description */}
      <Text className="text-[#697a8d] text-sm line-clamp-2 mb-4 block text-center">
        {agent.description}
      </Text>

      {/* Config Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#8592a3]">Model:</span>
          <span className="text-[#566a7f] dark:text-[#a3b1c2] font-medium">
            {agent.config.model}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#8592a3]">Priority:</span>
          <span className="text-[#566a7f] dark:text-[#a3b1c2] font-medium">
            {agent.config.websocketPriority}
          </span>
        </div>
      </div>

      {/* Footer: Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-[#eceef1] dark:border-[#444564]">
        <Button
          type="default"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(agent)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          type="default"
          size="small"
          icon={<LinkOutlined />}
          className="flex-1"
        >
          Connect
        </Button>
      </div>
    </Card>
  );
}

/** Sortable Agent Card (for drag & drop) */
interface SortableAgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}

function SortableAgentCard({ agent, onEdit, onDelete }: SortableAgentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: agent.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners}>
        <AgentCard agent={agent} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
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
  const [activeTab, setActiveTab] = useState<"basic" | "config" | "connections">("basic");

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
        <span className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
          {agent ? "Edit Agent" : "Add New Agent"}
        </span>
      }
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{ className: "bg-[#696cff] hover:bg-[#5f61e6]" }}
      width={600}
      styles={{ body: { padding: "1.5rem" } }}
    >
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 p-1 bg-[#f5f5f9] dark:bg-[#232333] rounded-lg">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "basic"
              ? "bg-white dark:bg-[#2b2c40] text-[#696cff] shadow-sm"
              : "text-[#697a8d] hover:text-[#566a7f]"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Bot size={16} />
            Basic Info
          </span>
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "config"
              ? "bg-white dark:bg-[#2b2c40] text-[#696cff] shadow-sm"
              : "text-[#697a8d] hover:text-[#566a7f]"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <SettingOutlined />
            Config
          </span>
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "connections"
              ? "bg-white dark:bg-[#2b2c40] text-[#696cff] shadow-sm"
              : "text-[#697a8d] hover:text-[#566a7f]"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Link2 size={16} />
            Connections
          </span>
        </button>
      </div>

      <Space direction="vertical" size="large" className="w-full">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Name <span className="text-[#ff3e1d]">*</span>
              </label>
              <Input
                value={form.name}
                onChange={handleNameChange}
                placeholder="Enter agent name"
                className="h-10"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Slug <span className="text-[#ff3e1d]">*</span>
              </label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="agent-slug"
                className="h-10"
                prefix="/"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Description
              </label>
              <TextArea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter agent description"
                rows={3}
              />
            </div>

            {/* Icon URL */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Icon URL
              </label>
              <Input
                value={form.iconUrl}
                onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                placeholder="/icons/agent.png"
                className="h-10"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Status
              </label>
              <Select<AgentStatus>
                value={form.status}
                onChange={(status) => setForm({ ...form, status })}
                className="w-full"
                options={[
                  { label: "Offline", value: "offline" },
                  { label: "Online (Spawned)", value: "spawned" },
                  { label: "Idle", value: "idle" },
                ]}
              />
            </div>
          </>
        )}

        {/* Config Tab */}
        {activeTab === "config" && (
          <>
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Model
              </label>
              <Select<string>
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
                  { label: "DALL-E", value: "DALL-E" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </div>

            {/* Prompt Template */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Prompt Template
              </label>
              <TextArea
                value={form.config?.promptTemplate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    config: { ...form.config!, promptTemplate: e.target.value },
                  })
                }
                placeholder="Enter the prompt template for this agent"
                rows={4}
              />
            </div>

            {/* Call Quota */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Call Quota
              </label>
              <Input
                type="number"
                value={form.config?.quota}
                onChange={(e) =>
                  setForm({
                    ...form,
                    config: { ...form.config!, quota: parseInt(e.target.value) || 0 },
                  })
                }
                placeholder="1000"
                className="h-10"
              />
            </div>

            {/* WebSocket Priority */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                WebSocket Priority
              </label>
              <Input
                type="number"
                value={form.config?.websocketPriority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    config: { ...form.config!, websocketPriority: parseInt(e.target.value) || 0 },
                  })
                }
                placeholder="1"
                min={1}
                max={10}
                className="h-10"
              />
              <Text className="text-[#a1acb8] text-xs">
                Lower numbers = higher priority (1 = highest)
              </Text>
            </div>
          </>
        )}

        {/* Connections Tab */}
        {activeTab === "connections" && (
          <>
            {/* LobeChat URL */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
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
                placeholder="https://lobe.chat/agent/..."
                className="h-10"
                prefix={<LinkOutlined className="text-[#8592a3]" />}
              />
            </div>

            {/* API Endpoint */}
            <div>
              <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
                Internal API Endpoint
              </label>
              <Input
                value={form.connections?.apiEndpoint}
                onChange={(e) =>
                  setForm({
                    ...form,
                    connections: { ...form.connections!, apiEndpoint: e.target.value },
                  })
                }
                placeholder="/api/v1/agents/..."
                className="h-10"
                prefix={<ApiOutlined className="text-[#8592a3]" />}
              />
            </div>

            {/* Connection Status */}
            <Card
              bordered={false}
              className="bg-[#f5f5f9] dark:bg-[#232333]"
              styles={{ body: { padding: "1rem" } }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#71dd37] animate-pulse" />
                <div>
                  <Text className="text-[#566a7f] dark:text-[#a3b1c2] text-sm font-medium block">
                    Connection Status
                  </Text>
                  <Text className="text-[#697a8d] text-xs">
                    {agent?.status === "spawned" ? "Connected" : "Disconnected"}
                  </Text>
                </div>
              </div>
            </Card>
          </>
        )}
      </Space>
    </Modal>
  );
}

export default function AgentsPage() {
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const queryClient = useQueryClient();

  // Load agents from API using React Query
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

  // Mutation for deleting agent
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

  const loadAgents = async () => {
    queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
  };

  // Filter agents - 添加过滤逻辑
  const filterAgents = useMemo(() => {
    let result = [...agents];

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "online") {
        result = result.filter((agent) => agent.status === "spawned");
      } else {
        result = result.filter((agent) => agent.status === statusFilter);
      }
    }

    // Search filter
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

  useEffect(() => {
    setFilteredAgents(filterAgents);
  }, [filterAgents]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setAgents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        // Update sort orders
        return reordered.map((agent, index) => ({ ...agent, sortOrder: index + 1 }));
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
      if (editingAgent) {
        // Update existing agent via API
        const apiData = mapFrontendAgentToApi(agent);
        const response = await agentsApi.update(agent.id, apiData);
        if (response.success) {
          await loadAgents();
          message.success("Agent updated successfully");
        }
      } else {
        // Create new agent via API
        const apiData: Parameters<typeof agentsApi.create>[0] = {
          name: agent.name,
          slug: agent.slug,
          description: agent.description,
          icon_url: agent.iconUrl,
          link: agent.connections?.lobeChatUrl,
          category: "Dev" as const,
          system_prompt: agent.config?.promptTemplate,
          model: agent.config?.model || "Gemini",
        };
        const response = await agentsApi.create(apiData);
        if (response.success) {
          await loadAgents();
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

  return (
    <div className="animate-in fade-in-50 duration-500 p-6">
      {/* Header Section */}
      <Row gutter={[24, 24]} align="middle" className="mb-6">
        <Col xs={24} md={12}>
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-lg bg-[#696cff]/10 flex items-center justify-center">
              <Bot className="text-[#696cff]" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#566a7f] dark:text-[#a3b1c2] m-0">
                Agents Management
              </h2>
              <p className="text-[#697a8d] text-sm m-0">
                Configure and manage AI agents
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search agents..."
              prefix={<SearchOutlined className="text-[#8592a3]" />}
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-10 w-full sm:w-[200px]"
            />
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full sm:w-[140px]"
              options={[
                { label: "All Status", value: "all" },
                { label: "Online", value: "online" },
                { label: "Offline", value: "offline" },
                { label: "Idle", value: "idle" },
              ]}
            />
            <Button
              type="default"
              icon={<ArrowUpDown size={16} />}
              onClick={() => setDragEnabled(!dragEnabled)}
              className={dragEnabled ? "bg-[#696cff]/20 text-[#696cff]" : "h-10"}
            >
              {dragEnabled ? "Sorting..." : "Reorder"}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-[#696cff] hover:bg-[#5f61e6] h-10"
            >
              Add Agent
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Row */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={8} md={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-lg bg-[#696cff]/10 flex items-center justify-center">
                <Bot className="text-[#696cff]" size={18} />
              </div>
              <div>
                <Text className="text-[#697a8d] text-xs block">Total Agents</Text>
                <Text className="text-[#566a7f] dark:text-[#a3b1c2] text-lg font-bold">
                  {agents.length || 0}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-lg bg-[#71dd37]/10 flex items-center justify-center">
                <Activity className="text-[#71dd37]" size={18} />
              </div>
              <div>
                <Text className="text-[#697a8d] text-xs block">Online</Text>
                <Text className="text-[#566a7f] dark:text-[#a3b1c2] text-lg font-bold">
                  {agents.filter((a) => a.status === "spawned").length}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-lg bg-[#ffab00]/10 flex items-center justify-center">
                <Clock className="text-[#ffab00]" size={18} />
              </div>
              <div>
                <Text className="text-[#697a8d] text-xs block">Idle</Text>
                <Text className="text-[#566a7f] dark:text-[#a3b1c2] text-lg font-bold">
                  {agents.filter((a) => a.status === "idle").length}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card
            bordered={false}
            className="sneat-card-shadow"
            styles={{ body: { padding: "1.25rem" } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-lg bg-[#697a8d]/10 flex items-center justify-center">
                <Server className="text-[#697a8d]" size={18} />
              </div>
              <div>
                <Text className="text-[#697a8d] text-xs block">Offline</Text>
                <Text className="text-[#566a7f] dark:text-[#a3b1c2] text-lg font-bold">
                  {agents.filter((a) => a.status === "offline").length}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Agents Grid */}
      {dragEnabled ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredAgents.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <Row gutter={[24, 24]}>
              {filteredAgents.map((agent) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={agent.id}>
                  <SortableAgentCard
                    agent={agent}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Col>
              ))}
            </Row>
          </SortableContext>
        </DndContext>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredAgents.map((agent) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={agent.id}>
              <AgentCard agent={agent} onEdit={handleEdit} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <Card bordered={false} className="text-center py-12 sneat-card-shadow">
          <Bot size={48} className="text-[#eceef1] dark:text-[#444564] mx-auto mb-4" />
          <Text className="text-[#697a8d] text-lg">No agents found</Text>
          <div className="mt-2">
            <Text className="text-[#a1acb8] text-sm">
              Try adjusting your filters or add a new agent
            </Text>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <EditAgentModal
        open={editModalOpen}
        agent={editingAgent}
        onSave={handleSaveAgent}
        onCancel={() => setEditModalOpen(false)}
      />
    </div>
  );
}
