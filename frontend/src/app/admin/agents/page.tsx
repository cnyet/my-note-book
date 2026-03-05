"use client";

import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  LinkOutlined,
  ApiOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card as AntCard,
  Col,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { ChangeEvent, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Bot,
  MoreVertical,
  Activity,
  Clock,
  Link2,
  Server,
  Zap,
} from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { agentsApi, type Agent as ApiAgent } from "@/lib/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, StatusBadge } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Card/StatCard";

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

/** Status to Badge Props */
function getStatusBadgeProps(status: AgentStatus): { status: string; label: string } {
  switch (status) {
    case "spawned":
      return { status: "online", label: "Online" };
    case "idle":
      return { status: "idle", label: "Idle" };
    default:
      return { status: "offline", label: "Offline" };
  }
}

/** Draggable Agent Card Component - Compact */
function AgentCard({
  agent,
  onEdit,
  onDelete,
  onSpawn,
  onTerminate,
}: {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  onSpawn?: (agent: Agent) => void;
  onTerminate?: (agent: Agent) => void;
}) {
  const isRunning = agent.status === "spawned" || agent.status === "idle";
  const badgeProps = getStatusBadgeProps(agent.status);

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => onEdit(agent),
    },
    {
      key: "spawn",
      label: isRunning ? "Restart" : "Start",
      icon: <PlayCircleOutlined />,
      onClick: () => onSpawn?.(agent),
    },
    {
      key: "terminate",
      label: "Stop",
      icon: <StopOutlined />,
      onClick: () => onTerminate?.(agent),
      disabled: !isRunning,
      danger: true,
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
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

      {/* Main Card */}
      <div className="relative h-full rounded-2xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-4 h-full flex flex-col">
          {/* Header: Status Badge */}
          <div className="flex justify-between items-start mb-3">
            <StatusBadge status={badgeProps.status as any} label={badgeProps.label} size="sm" />
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-500/10 cursor-grab active:cursor-grabbing transition-colors"
                aria-label="Drag to reorder"
              >
                <ArrowUpDown size={14} />
              </motion.button>
              <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 cursor-pointer transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical size={14} />
                </motion.button>
              </Dropdown>
            </div>
          </div>

          {/* Agent Icon - Compact */}
          <div className="relative mb-3 mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-md shadow-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-shadow duration-300">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#1a1a2e] flex items-center justify-center">
                <Bot className="text-indigo-500" size={28} />
              </div>
            </div>
            {isRunning && (
              <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1a1a2e] animate-pulse" />
            )}
          </div>

          {/* Agent Name */}
          <h3 className="text-base font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent m-0 mb-2">
            {agent.name}
          </h3>

          {/* Description - Single line */}
          <p className="text-gray-600 dark:text-gray-400 text-xs text-center leading-relaxed mb-3 line-clamp-1 flex-grow">
            {agent.description}
          </p>

          {/* Config Badge - Single */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              <Zap size={10} className="fill-current" />
              {agent.config.model}
            </span>
          </div>

          {/* Footer: Action Buttons - Compact */}
          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-white/10 mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEdit(agent)}
              className="flex-1 h-9 rounded-lg font-semibold text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <EditOutlined size={12} />
              Edit
            </motion.button>
            {isRunning ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTerminate?.(agent)}
                className="flex-1 h-9 rounded-lg font-semibold text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <StopOutlined size={12} />
                Stop
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSpawn?.(agent)}
                className="flex-1 h-9 rounded-lg font-semibold text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                <PlayCircleOutlined size={12} />
                Start
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Sortable Agent Card (for drag & drop) */
interface SortableAgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  onSpawn?: (agent: Agent) => void;
  onTerminate?: (agent: Agent) => void;
}

function SortableAgentCard({ agent, onEdit, onDelete, onSpawn, onTerminate }: SortableAgentCardProps) {
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
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners}>
        <AgentCard
          agent={agent}
          onEdit={onEdit}
          onDelete={onDelete}
          onSpawn={onSpawn}
          onTerminate={onTerminate}
        />
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {agent ? "Edit Agent" : "Add New Agent"}
          </span>
        </div>
      }
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{ className: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" }}
      cancelButtonProps={{ className: "rounded-xl" }}
      width={640}
      styles={{
        body: { padding: "1.5rem" },
        header: { borderBottom: "1px solid #f0f0f0", paddingBottom: "1rem" },
        footer: { borderTop: "1px solid #f0f0f0", paddingTop: "1rem" },
      }}
    >
      {/* Tab Navigation - Enhanced */}
      <div className="flex gap-1.5 mb-6 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "basic"
              ? "bg-white dark:bg-gray-700 text-indigo-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Bot size={16} />
          Basic
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "config"
              ? "bg-white dark:bg-gray-700 text-indigo-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <SettingOutlined />
          Config
        </button>
        <button
          onClick={() => setActiveTab("connections")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "connections"
              ? "bg-white dark:bg-gray-700 text-indigo-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Link2 size={16} />
          Connections
        </button>
      </div>

      <Space direction="vertical" size="middle" className="w-full">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={handleNameChange}
                placeholder="Enter agent name"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="agent-slug"
                className="h-11 rounded-xl"
                prefix={<span className="text-gray-400 text-sm">/</span>}
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <TextArea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter agent description"
                rows={3}
                className="rounded-xl"
                styles={{ textarea: { fontSize: "14px" } }}
              />
            </div>

            {/* Icon URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Icon URL
              </label>
              <Input
                value={form.iconUrl}
                onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                placeholder="/icons/agent.png"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                styles={{
                  selector: { borderRadius: "12px", height: "44px" },
                }}
              />
            </div>
          </>
        )}

        {/* Config Tab */}
        {activeTab === "config" && (
          <>
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                styles={{
                  selector: { borderRadius: "12px", height: "44px" },
                }}
              />
            </div>

            {/* Prompt Template */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                className="rounded-xl"
                styles={{ textarea: { fontSize: "14px" } }}
              />
            </div>

            {/* Call Quota */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* WebSocket Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
              <Text className="text-gray-400 text-xs mt-1 block">
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                className="h-11 rounded-xl"
                prefix={<LinkOutlined className="text-gray-400" />}
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* API Endpoint */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                className="h-11 rounded-xl"
                prefix={<ApiOutlined className="text-gray-400" />}
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Connection Status */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold block">
                    Connection Status
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
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

  // Mutation for agent lifecycle
  const spawnMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/agents/${id}/spawn`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      message.success("Agent started successfully");
    },
    onError: () => {
      message.error("Failed to start agent");
    },
  });

  const terminateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/agents/${id}/terminate`);
    },
    onSuccess: (_, id) => {
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
          queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e] p-6">
      {/* Header Section - Enhanced with gradient and better typography */}
      <Row gutter={[24, 24]} align="middle" className="mb-8">
        <Col xs={24} md={12}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Bot className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                Agents Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Configure and manage AI agents
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search agents..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-11 w-full sm:w-[240px] rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              styles={{
                input: { fontSize: "14px" },
              }}
            />
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full sm:w-[140px] rounded-xl"
              options={[
                { label: "All Status", value: "all" },
                { label: "Online", value: "online" },
                { label: "Offline", value: "offline" },
                { label: "Idle", value: "idle" },
              ]}
              styles={{
                selector: { borderRadius: "12px", height: "44px" },
              }}
            />
            <Button
              type="default"
              icon={<ArrowUpDown size={16} />}
              onClick={() => setDragEnabled(!dragEnabled)}
              className={`h-11 rounded-xl font-semibold ${
                dragEnabled ? "bg-indigo-500 text-white" : ""
              }`}
              styles={{
                button: { borderRadius: "12px" },
              }}
            >
              {dragEnabled ? "Sorting..." : "Reorder"}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none h-11 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
              styles={{
                button: { borderRadius: "12px" },
              }}
            >
              Add Agent
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Row - Enhanced with StatCard component */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={8} md={6}>
          <StatCard
            icon={<Bot size={20} />}
            label="Total Agents"
            value={agents.length || 0}
            gradient="blue"
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <StatCard
            icon={<Activity size={20} />}
            label="Online"
            value={agents.filter((a) => a.status === "spawned").length}
            gradient="green"
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <StatCard
            icon={<Clock size={20} />}
            label="Idle"
            value={agents.filter((a) => a.status === "idle").length}
            gradient="orange"
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <StatCard
            icon={<Server size={20} />}
            label="Offline"
            value={agents.filter((a) => a.status === "offline").length}
            gradient="gray"
          />
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
                    onSpawn={handleSpawn}
                    onTerminate={handleTerminate}
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
              <AgentCard
                agent={agent}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSpawn={handleSpawn}
                onTerminate={handleTerminate}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Empty State - Enhanced design */}
      {filteredAgents.length === 0 && (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Bot size={40} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white m-0 mb-2">
                No agents found
              </h3>
              <Text className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or add a new agent
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none h-11 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
              styles={{
                button: { borderRadius: "12px" },
              }}
            >
              Add Your First Agent
            </Button>
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
