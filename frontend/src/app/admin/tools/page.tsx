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
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, MoreVertical, Wrench, Layers, Link2 } from "lucide-react";
import { toolsApi, type Tool as ApiTool } from "@/lib/admin-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CategoryBadge, StatusBadge } from "@/components/ui/Card";

const { Text, Title } = Typography;
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

// Sortable Tool Card Component
interface SortableToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}

function SortableToolCard({ tool, onEdit, onDelete }: SortableToolCardProps) {
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

  const statusBadgeProps = tool.status === "active"
    ? { status: "active" as const, label: "Active" }
    : { status: "inactive" as const, label: "Inactive" };

  const items = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => onEdit(tool),
    },
    { type: "divider" } as const,
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(tool),
    },
  ];

  return (
    <Card
      hover
      className="h-full"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header: Category Badge + Drag Handle + More Menu */}
      <div className="flex justify-between items-start mb-5">
        <CategoryBadge category={tool.category} />
        <div className="flex items-center gap-2">
          <Button
            type="text"
            shape="circle"
            icon={<GripVertical size={14} className="text-gray-400" />}
            size="small"
            className="cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-800"
            {...attributes}
            {...listeners}
          />
          <Button
            type="text"
            shape="circle"
            icon={<MoreVertical size={16} className="text-gray-400" />}
            size="small"
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onDelete(tool)}
          />
        </div>
      </div>

      {/* Tool Icon/Avatar - Larger gradient circle */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center mb-5 mx-auto shadow-lg">
        <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-gray-900/80 flex items-center justify-center backdrop-blur-sm">
          <span className="text-indigo-500 text-2xl font-bold">
            {tool.icon.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tool Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white m-0 mb-1 text-center">
        {tool.name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed mb-5 line-clamp-2">
        {tool.description}
      </p>

      {/* Status Badge */}
      <div className="flex justify-center mb-5">
        <StatusBadge status={statusBadgeProps.status} label={statusBadgeProps.label} size="md" />
      </div>

      {/* Footer: Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="default"
          size="large"
          icon={<EditOutlined />}
          onClick={() => onEdit(tool)}
          className="flex-1 h-11 rounded-xl font-semibold"
        >
          Edit
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<Link2 size={16} />}
          onClick={() => window.open(tool.link, "_blank")}
          className="flex-1 h-11 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 border-none"
        >
          Open
        </Button>
      </div>
    </Card>
  );
}

// Drag Overlay Component
function DragOverlayItem({ tool }: { tool: Tool | null }) {
  if (!tool) return null;

  return (
    <Card
      className="opacity-80"
    >
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="w-4 h-4 text-indigo-500" />
        <div className="flex-1">
          <Text strong className="text-gray-900 dark:text-white">
            {tool.name}
          </Text>
        </div>
        <CategoryBadge category={tool.category} />
      </div>
    </Card>
  );
}

// Tool Form Modal
interface ToolFormModalProps {
  open: boolean;
  tool: Tool | null;
  onSave: (values: Partial<Tool>) => void;
  onCancel: () => void;
}

function ToolFormModal({ open, tool, onSave, onCancel }: ToolFormModalProps) {
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Wrench className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Tool" : "Add New Tool"}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      okButtonProps={{
        className: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl",
        icon: <CheckOutlined />
      }}
      cancelButtonProps={{ className: "rounded-xl" }}
      width={640}
      styles={{
        body: { padding: "1.5rem" },
        header: { borderBottom: "1px solid #f0f0f0", paddingBottom: "1rem" },
        footer: { borderTop: "1px solid #f0f0f0", paddingTop: "1rem" },
      }}
    >
      {/* Tab Navigation */}
      <div className="flex gap-1.5 mb-6 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "basic"
              ? "bg-white dark:bg-gray-700 text-indigo-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Wrench size={16} />
          Basic
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "seo"
              ? "bg-white dark:bg-gray-700 text-indigo-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <SearchOutlined />
          SEO
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
                value={tool?.name}
                placeholder="e.g., Code Runner"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <Segmented
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <TextArea
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Icon <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., code (Lucide icon name)"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
                extra="Lucide icon name (e.g., code, zap, wand-2)"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Link <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="/tools/code-runner"
                className="h-11 rounded-xl"
                prefix={<Link2 className="text-gray-400" size={16} />}
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                className="rounded-full"
                style={{ backgroundColor: "#696cff" }}
              />
            </div>
          </>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <>
            {/* SEO Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                SEO Title
              </label>
              <Input
                placeholder="SEO-friendly title for search engines"
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                SEO Description
              </label>
              <TextArea
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
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">(
    "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Load tools from API using React Query
  const { data: toolsData } = useQuery({
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
  const loading = false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = async (values: Partial<Tool>) => {
    try {
      if (editingTool) {
        // Update existing tool via API
        const apiData = mapFrontendToolToApi({ ...editingTool, ...values } as Tool);
        const response = await toolsApi.update(editingTool.id, apiData);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
          message.success("Tool updated successfully");
        }
      } else {
        // Create new tool via API
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

      // Update sortOrder for all affected tools
      try {
        // Update each tool's sort order via API
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

  // Filter tools by category and search query using useMemo
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((tool) => tool.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      );
    }

    // Sort by sortOrder
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  }, [tools, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e] p-6">
      {/* Header Section - Enhanced with gradient and better typography */}
      <Row gutter={[24, 24]} align="middle" className="mb-8">
        <Col xs={24} md={12}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wrench className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                Tools Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Manage and organize your development tools
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search tools..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="h-11 w-full sm:w-[240px] rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
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
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none h-11 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
              styles={{
                button: { borderRadius: "12px" },
              }}
            >
              Add Tool
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Row */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center p-4" gradient>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Layers className="text-indigo-500" size={20} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Total Tools</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tools.length}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center p-4" gradient>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tools.filter((t) => t.status === "active").length}
                </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center p-4" gradient>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <span className="text-indigo-500 font-bold text-sm">Dev</span>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Dev Tools</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tools.filter((t) => t.category === "Dev").length}
                </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center p-4" gradient>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Link2 className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
              </div>
            </div>
          </Card>
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

      {/* Empty State - Enhanced design */}
      {filteredTools.length === 0 && (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Wrench size={40} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white m-0 mb-2">
                No tools found
              </h3>
              <Text className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or add a new tool
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none h-11 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
              styles={{
                button: { borderRadius: "12px" },
              }}
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
    </div>
  );
}
