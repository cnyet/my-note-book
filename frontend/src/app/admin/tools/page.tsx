"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Typography,
  message,
  Card,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Wrench, Layers, Link2 } from "lucide-react";
import { toolsApi, type Tool as ApiTool } from "@/lib/admin-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;
const { TextArea } = Input;

// Types
type ToolCategory = "Dev" | "Auto" | "Intel" | "Creative";
type ToolStatus = "active" | "inactive";

interface Tool {
  id: number;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  link: string;
  status: ToolStatus;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

// 将后端 API Tool 转换为前端 Tool
function mapApiToolToFrontend(apiTool: ApiTool): Tool {
  return {
    id: apiTool.id,
    name: apiTool.name,
    category: apiTool.category,
    description: apiTool.description || "",
    icon: apiTool.icon_url || "default",
    link: apiTool.link || "",
    status: apiTool.status,
    sortOrder: apiTool.sort_order,
    seoTitle: "",
    seoDescription: "",
  };
}

// 将前端 Tool 转换为后端 API 格式
function mapFrontendToolToApi(tool: Tool): Partial<ApiTool> {
  return {
    name: tool.name,
    slug: tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: tool.category,
    description: tool.description,
    icon_url: tool.icon,
    link: tool.link,
    status: tool.status,
    sort_order: tool.sortOrder,
  };
}

// Category Badge Component - Duralux Style
function CategoryBadge({ category }: { category: ToolCategory }) {
  const categoryColors: Record<ToolCategory, { color: string; bgColor: string }> = {
    Dev: { color: "var(--duralux-primary)", bgColor: "var(--duralux-primary-transparent)" },
    Auto: { color: "var(--duralux-info)", bgColor: "var(--duralux-info-transparent)" },
    Intel: { color: "var(--duralux-warning)", bgColor: "var(--duralux-warning-transparent)" },
    Creative: { color: "var(--duralux-success)", bgColor: "var(--duralux-success-transparent)" },
  };

  const colors = categoryColors[category];

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium border-0"
      style={{ backgroundColor: colors.bgColor, color: colors.color }}
    >
      {category}
    </span>
  );
}

// Status Badge Component - Duralux Style
function StatusBadge({ status, label, size = "md" }: { status: ToolStatus; label: string; size?: "sm" | "md" }) {
  const colors = status === "active"
    ? { color: "var(--duralux-success)", bgColor: "var(--duralux-success-transparent)" }
    : { color: "var(--duralux-text-muted)", bgColor: "var(--duralux-bg-hover)" };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`${sizeClasses} rounded-full font-medium border-0`}
      style={{ backgroundColor: colors.bgColor, color: colors.color }}
    >
      {label}
    </span>
  );
}

// Stat Card Component - Duralux Style
function StatCard({
  icon,
  label,
  value,
  gradient = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient?: "primary" | "success" | "info" | "warning";
}) {
  const gradientClasses = {
    primary: "bg-duralux-primary-transparent text-duralux-primary",
    success: "bg-duralux-success-transparent text-duralux-success",
    info: "bg-duralux-info-transparent text-duralux-info",
    warning: "bg-duralux-warning-transparent text-duralux-warning",
  };

  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark transition-all duration-200 hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark hover:-translate-y-0.5 overflow-hidden"
      styles={{ body: { padding: "1.25rem" } }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradientClasses[gradient]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-duralux-text-muted mb-0.5">{label}</p>
          <p className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Skeleton Stat Card
function SkeletonStatCard() {
  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark overflow-hidden"
      styles={{ body: { padding: "1.25rem" } }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="space-y-2">
          <div className="w-20 h-3 skeleton" />
          <div className="w-16 h-6 skeleton" />
        </div>
      </div>
    </Card>
  );
}

// Sortable Tool Card Component - Duralux Style
function SortableToolCard({ tool, onEdit, onDelete }: { tool: Tool; onEdit: (tool: Tool) => void; onDelete: (tool: Tool) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full"
    >
      <div
        ref={setNodeRef}
        style={style}
        className="relative h-full rounded-2xl bg-white dark:bg-[#2b2c40] border border-[#eceef1] dark:border-[#444564] shadow-duralux-card hover:shadow-duralux-hover dark:shadow-duralux-card-dark dark:hover:shadow-duralux-hover-dark transition-all duration-200 overflow-hidden"
      >
        <div className="relative p-5 h-full flex flex-col">
          {/* Header: Category Badge + Actions */}
          <div className="flex justify-between items-start mb-4">
            <CategoryBadge category={tool.category} />
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-7 h-7 rounded-md flex items-center justify-center text-duralux-text-muted hover:text-duralux-primary hover:bg-duralux-bg-hover cursor-grab active:cursor-grabbing transition-colors"
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
              >
                <GripVertical size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(tool)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-duralux-text-muted hover:text-duralux-danger hover:bg-duralux-danger-transparent cursor-pointer transition-colors"
                aria-label="Delete tool"
              >
                <DeleteOutlined size={14} />
              </motion.button>
            </div>
          </div>

          {/* Tool Icon */}
          <div className="relative mb-4 mx-auto">
            <div className="w-16 h-16 rounded-full bg-duralux-primary-transparent flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-2xl font-bold text-duralux-primary">
                {tool.icon.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Tool Name */}
          <h3 className="text-base font-bold text-center text-duralux-text-primary dark:text-duralux-text-dark-primary m-0 mb-2">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary text-xs text-center leading-relaxed mb-4 line-clamp-2 flex-grow">
            {tool.description}
          </p>

          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <StatusBadge
              status={tool.status}
              label={tool.status === "active" ? "Active" : "Inactive"}
              size="sm"
            />
          </div>

          {/* Footer: Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-[#eceef1] dark:border-[#444564] mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEdit(tool)}
              className="flex-1 h-9 rounded-lg font-semibold text-xs bg-duralux-bg-page dark:bg-[#323249] text-duralux-text-secondary dark:text-duralux-text-dark-secondary hover:bg-duralux-bg-hover dark:hover:bg-duralux-bg-dark-hover transition-colors flex items-center justify-center gap-1.5 cursor-pointer border-none"
            >
              <EditOutlined size={12} />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(tool.link, "_blank")}
              className="flex-1 h-9 rounded-lg font-semibold text-xs bg-gradient-to-r from-duralux-primary to-duralux-primary-dark text-white hover:from-duralux-primary-dark hover:to-duralux-primary shadow-md shadow-duralux-primary/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
            >
              <Link2 size={12} />
              Open
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Drag Overlay Component
function DragOverlayItem({ tool }: { tool: Tool | null }) {
  if (!tool) return null;

  return (
    <Card className="opacity-80 rounded-xl">
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="w-4 h-4 text-duralux-primary" />
        <div className="flex-1">
          <Text strong className="text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {tool.name}
          </Text>
        </div>
        <CategoryBadge category={tool.category} />
      </div>
    </Card>
  );
}

// Tool Form Modal - Duralux Style
function ToolFormModal({
  open,
  tool,
  onSave,
  onCancel,
}: {
  open: boolean;
  tool: Tool | null;
  onSave: (values: Partial<Tool>) => void;
  onCancel: () => void;
}) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<"basic" | "seo">("basic");

  const isEdit = tool !== null;

  useEffect(() => {
    if (open) {
      if (tool) {
        form.setFieldsValue(tool);
      } else {
        form.resetFields();
      }
    }
  }, [open, tool, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
    } catch (error) {
      // Validation failed
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-duralux-primary to-duralux-primary-dark flex items-center justify-center">
            <Wrench className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {isEdit ? "Edit Tool" : "Add New Tool"}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      okButtonProps={{
        className: "bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white",
        icon: <CheckOutlined />,
      }}
      cancelButtonProps={{ className: "rounded-xl" }}
      width={640}
      styles={{
        body: { padding: "1.5rem" },
        header: { borderBottom: "1px solid #eceef1", paddingBottom: "1rem" },
        footer: { borderTop: "1px solid #eceef1", paddingTop: "1rem" },
      }}
    >
      {/* Tab Navigation */}
      <div className="flex gap-1.5 mb-6 p-1.5 bg-duralux-bg-page dark:bg-[#323249] rounded-xl">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "basic"
              ? "bg-white dark:bg-[#2b2c40] text-duralux-primary shadow-sm"
              : "text-duralux-text-muted hover:text-duralux-text-secondary"
          }`}
        >
          <Wrench size={16} />
          Basic
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "seo"
              ? "bg-white dark:bg-[#2b2c40] text-duralux-primary shadow-sm"
              : "text-duralux-text-muted hover:text-duralux-text-secondary"
          }`}
        >
          <SearchOutlined size={16} />
          SEO
        </button>
      </div>

      <Space direction="vertical" size="middle" className="w-full">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Name <span className="text-duralux-danger">*</span>
              </label>
              <Input
                name="name"
                defaultValue={tool?.name}
                placeholder="e.g., Code Runner"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Category <span className="text-duralux-danger">*</span>
              </label>
              <Segmented
                name="category"
                defaultValue={tool?.category || "Dev"}
                options={[
                  { label: "Dev", value: "Dev" },
                  { label: "Auto", value: "Auto" },
                  { label: "Intel", value: "Intel" },
                  { label: "Creative", value: "Creative" },
                ]}
                block
                className="rounded-xl"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Description <span className="text-duralux-danger">*</span>
              </label>
              <TextArea
                name="description"
                defaultValue={tool?.description}
                rows={3}
                placeholder="Describe what this tool does..."
                showCount
                maxLength={200}
                className="rounded-xl"
                styles={{ textarea: { fontSize: "14px" } }}
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Icon <span className="text-duralux-danger">*</span>
              </label>
              <Input
                name="icon"
                defaultValue={tool?.icon}
                placeholder="e.g., code (Lucide icon name)"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Link <span className="text-duralux-danger">*</span>
              </label>
              <Input
                name="link"
                defaultValue={tool?.link}
                placeholder="/tools/code-runner"
                className="h-11 rounded-xl"
                prefix={<Link2 className="text-duralux-text-muted" size={16} />}
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Status
              </label>
              <Switch
                
                defaultChecked={tool?.status !== "inactive"}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                className="rounded-full"
                style={{ backgroundColor: "var(--duralux-primary)" }}
              />
            </div>
          </>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <>
            {/* SEO Title */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                SEO Title
              </label>
              <Input
                name="seoTitle"
                defaultValue={tool?.seoTitle}
                placeholder="SEO-friendly title for search engines"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                SEO Description
              </label>
              <TextArea
                name="seoDescription"
                defaultValue={tool?.seoDescription}
                rows={3}
                placeholder="Meta description for search engines"
                showCount
                maxLength={160}
                className="rounded-xl"
                styles={{ textarea: { fontSize: "14px" } }}
              />
            </div>
          </>
        )}
      </Space>
    </Modal>
  );
}

// Main Page Component
export default function ToolsManagementPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Load tools from API
  const { data: toolsData, isLoading } = useQuery({
    queryKey: ["admin-tools"],
    queryFn: async () => {
      const response = await toolsApi.list();
      if (response.success && response.data) {
        return response.data.map(mapApiToolToFrontend);
      }
      return [];
    },
  });

  const tools = useMemo(() => toolsData || [], [toolsData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = async (values: Partial<Tool>) => {
    try {
      if (editingTool) {
        const apiData = mapFrontendToolToApi({ ...editingTool, ...values } as Tool);
        const response = await toolsApi.update(editingTool.id, apiData);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
          message.success("Tool updated successfully");
        }
      } else {
        const apiData = mapFrontendToolToApi({
          id: 0,
          name: values.name!,
          category: values.category!,
          description: values.description!,
          icon: values.icon || "default",
          link: values.link || "",
          status: values.status || "active",
          sortOrder: tools.length + 1,
        } as Tool);
        const response = await toolsApi.create(apiData as Parameters<typeof toolsApi.create>[0]);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
          message.success("Tool created successfully");
        }
      }
      setIsModalOpen(false);
      setEditingTool(null);
    } catch (error) {
      console.error("Failed to save tool:", error);
      message.error("Failed to save tool");
    }
  };

  const handleDelete = async (tool: Tool) => {
    Modal.confirm({
      title: "Delete Tool",
      content: `Are you sure you want to delete "${tool.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await toolsApi.delete(tool.id);
          queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
          message.success("Tool deleted successfully");
        } catch (error) {
          console.error("Failed to delete tool:", error);
          message.error("Failed to delete tool");
        }
      },
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tools.findIndex((item) => item.id === active.id);
      const newIndex = tools.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(tools, oldIndex, newIndex);

      try {
        for (let i = 0; i < reordered.length; i++) {
          const tool = reordered[i];
          if (tool.sortOrder !== i + 1) {
            await toolsApi.update(tool.id, { sort_order: i + 1 });
          }
        }
        queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
        message.success("Tools reordered successfully");
      } catch (error) {
        console.error("Failed to reorder tools:", error);
        message.error("Failed to reorder tools");
      }
    }

    setActiveId(null);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingTool(null);
  };

  // Filter tools
  const filteredTools = useMemo(() => {
    let result = [...tools];

    if (activeCategory !== "All") {
      result = result.filter((tool) => tool.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  }, [tools, activeCategory, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-duralux-bg-page dark:bg-duralux-bg-dark-page"
    >
      {/* Header Section */}
      <Row gutter={[24, 24]} align="middle" className="mb-6">
        <Col xs={24} md={12}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-duralux-primary to-duralux-primary-dark flex items-center justify-center shadow-lg shadow-duralux-primary/30">
              <Wrench className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-[1.5rem] font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary m-0">
                Tools Management
              </h1>
              <p className="text-duralux-text-muted text-sm mt-1">
                Manage and organize your development tools
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search tools..."
              prefix={<SearchOutlined className="text-duralux-text-muted" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="h-11 w-full sm:w-[240px] rounded-xl"
              styles={{
                input: { fontSize: "14px" },
              }}
            />
            <Select
              value={activeCategory}
              onChange={(value) => setActiveCategory(value as typeof activeCategory)}
              className="w-full sm:w-[140px] rounded-xl"
              options={[
                { label: "All", value: "All" },
                { label: "Dev", value: "Dev" },
                { label: "Auto", value: "Auto" },
                { label: "Intel", value: "Intel" },
                { label: "Creative", value: "Creative" },
              ]}
              styles={{
                selector: { borderRadius: "12px", height: "44px" },
              }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-11 rounded-xl font-semibold shadow-lg shadow-duralux-primary/30"
            >
              Add Tool
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Row */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<Layers size={20} />}
              label="Total Tools"
              value={tools.length}
              gradient="primary"
            />
          )}
        </Col>
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<div className="w-2.5 h-2.5 rounded-full bg-duralux-success animate-pulse" />}
              label="Active"
              value={tools.filter((t) => t.status === "active").length}
              gradient="success"
            />
          )}
        </Col>
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<span className="text-duralux-primary font-bold text-sm">Dev</span>}
              label="Dev Tools"
              value={tools.filter((t) => t.category === "Dev").length}
              gradient="primary"
            />
          )}
        </Col>
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<Link2 size={20} />}
              label="Categories"
              value={4}
              gradient="info"
            />
          )}
        </Col>
      </Row>

      {/* Tools Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTools.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <Row gutter={[24, 24]}>
            {filteredTools.map((tool) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={tool.id}>
                <SortableToolCard tool={tool} onEdit={handleEdit} onDelete={handleDelete} />
              </Col>
            ))}
          </Row>
        </SortableContext>

        <DragOverlay>
          <DragOverlayItem
            tool={activeId ? tools.find((t) => t.id === activeId) || null : null}
          />
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {filteredTools.length === 0 && !isLoading && (
        <Card className="text-center py-16 rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-duralux-primary-transparent flex items-center justify-center">
              <Wrench size={40} className="text-duralux-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary m-0 mb-2">
                No tools found
              </h3>
              <Text className="text-duralux-text-muted">
                Try adjusting your filters or add a new tool
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-11 rounded-xl font-semibold shadow-lg shadow-duralux-primary/30"
            >
              Add Your First Tool
            </Button>
          </div>
        </Card>
      )}

      {/* Edit/Add Modal */}
      <ToolFormModal
        open={isModalOpen}
        tool={editingTool}
        onSave={handleSave}
        onCancel={handleModalCancel}
      />
    </motion.div>
  );
}
