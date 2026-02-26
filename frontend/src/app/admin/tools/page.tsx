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
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Segmented,
  Space,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { GripVertical, MoreVertical } from "lucide-react";
import { toolsApi, type Tool as ApiTool } from "@/lib/admin-api";

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

// Category color mapping
const categoryColors: Record<ToolCategory, string> = {
  Dev: "#696cff",
  Auto: "#71dd37",
  Intel: "#00cfdd",
  Creative: "#ffab00",
};

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
}

function SortableToolCard({ tool, onEdit }: SortableToolCardProps) {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative"
    >
      <Card
        bordered={false}
        className="sneat-card-shadow h-full hover:translate-y-[-2px] transition-transform duration-300"
        styles={{ body: { padding: "1.25rem" } }}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-4 left-4 p-1 cursor-grab active:cursor-grabbing text-[#a1acb8] hover:text-[#696cff] transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <Tag
            style={{
              backgroundColor: `${categoryColors[tool.category]}15`,
              color: categoryColors[tool.category],
              border: "none",
              borderRadius: "4px",
              padding: "2px 8px",
              fontWeight: 600,
              fontSize: "11px",
            }}
          >
            {tool.category}
          </Tag>
        </div>

        {/* Tool Content */}
        <div className="mt-8">
          {/* Icon Preview */}
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-[#696cff]/10">
            <span className="text-[#696cff] text-lg font-bold">
              {tool.icon.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <Title level={5} className="m-0 mb-2 text-[#566a7f] dark:text-[#a3b1c2]">
            {tool.name}
          </Title>

          {/* Description */}
          <Text
            className="text-[#8592a3] text-sm line-clamp-2"
            style={{ display: "block", marginBottom: "12px" }}
          >
            {tool.description}
          </Text>

          {/* Footer: Status + Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#eceef1] dark:border-[#444564]">
            {/* Status Badge */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  tool.status === "active"
                    ? "bg-[#71dd37]"
                    : "bg-[#a1acb8]"
                }`}
              />
              <Text className="text-xs text-[#8592a3] font-medium">
                {tool.status === "active" ? "Active" : "Inactive"}
              </Text>
            </div>

            {/* Action Button */}
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-xs" />}
              onClick={() => onEdit(tool)}
              className="text-[#696cff] hover:bg-[#696cff]/10"
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Drag Overlay Component
function DragOverlayItem({ tool }: { tool: Tool | null }) {
  if (!tool) return null;

  return (
    <Card
      bordered={false}
      className="sneat-card-shadow opacity-80"
      styles={{ body: { padding: "1.25rem" } }}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="w-4 h-4 text-[#696cff]" />
        <div className="flex-1">
          <Text strong className="text-[#566a7f] dark:text-[#a3b1c2]">
            {tool.name}
          </Text>
        </div>
        <Tag
          style={{
            backgroundColor: `${categoryColors[tool.category]}15`,
            color: categoryColors[tool.category],
            border: "none",
            borderRadius: "4px",
            padding: "2px 8px",
            fontWeight: 600,
            fontSize: "11px",
          }}
        >
          {tool.category}
        </Tag>
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
        <span className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
          {isEdit ? "Edit Tool" : "Add New Tool"}
        </span>
      }
      open={open}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            icon={<CheckOutlined />}
            style={{ backgroundColor: "#696cff" }}
          >
            {isEdit ? "Save Changes" : "Create Tool"}
          </Button>
        </div>
      }
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "active",
          category: "Dev",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter tool name" }]}
        >
          <Input
            placeholder="e.g., Code Runner"
            prefix={
              <span className="text-[#a1acb8]">
                <EditOutlined />
              </span>
            }
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Segmented
            options={[
              {
                label: "Dev",
                value: "Dev",
              },
              {
                label: "Auto",
                value: "Auto",
              },
              {
                label: "Intel",
                value: "Intel",
              },
              {
                label: "Creative",
                value: "Creative",
              },
            ]}
            block
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            rows={3}
            placeholder="Describe what this tool does..."
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          label="Icon"
          name="icon"
          rules={[{ required: true, message: "Please enter icon name" }]}
          extra="Lucide icon name (e.g., code, zap, wand-2)"
        >
          <Input
            placeholder="e.g., code"
            prefix={
              <span className="text-[#a1acb8]">
                <EditOutlined />
              </span>
            }
          />
        </Form.Item>

        <Form.Item
          label="Link"
          name="link"
          rules={[
            { required: true, message: "Please enter the tool link" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input
            placeholder="/tools/code-runner"
            prefix={
              <span className="text-[#a1acb8]">
                <EditOutlined />
              </span>
            }
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            style={{
              backgroundColor: "#696cff",
            }}
          />
        </Form.Item>

        <Title level={5} className="text-[#566a7f] dark:text-[#a3b1c2] mt-6 mb-4">
          SEO Metadata
        </Title>

        <Form.Item
          label="SEO Title"
          name="seoTitle"
        >
          <Input
            placeholder="SEO-friendly title for search engines"
            prefix={
              <span className="text-[#a1acb8]">
                <EditOutlined />
              </span>
            }
          />
        </Form.Item>

        <Form.Item
          label="SEO Description"
          name="seoDescription"
        >
          <TextArea
            rows={2}
            placeholder="Meta description for search engines"
            showCount
            maxLength={160}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Main Page Component
export default function ToolsManagementPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">(
    "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load tools from API
  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const response = await toolsApi.list();
      if (response.success && response.data) {
        const mappedTools = response.data.map(mapApiToolToFrontend);
        setTools(mappedTools);
      }
    } catch (error) {
      console.error("Failed to load tools:", error);
      message.error("Failed to load tools from API");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: Partial<Tool>) => {
    try {
      if (editingTool) {
        // Update existing tool via API
        const apiData = mapFrontendToolToApi({ ...editingTool, ...values } as Tool);
        const response = await toolsApi.update(editingTool.id, apiData);
        if (response.success) {
          await loadTools();
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
          await loadTools();
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
          await loadTools();
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTools((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update sortOrder
        return reordered.map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        }));
      });
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

  // Filter tools by category and search query
  useEffect(() => {
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

    setFilteredTools(result);
  }, [tools, activeCategory, searchQuery]);

  return (
    <div className="animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="mb-6">
        <Title level={2} className="text-[#2c3e50] dark:text-[#e8e8e8] m-0 mb-2">
          Tools Management
        </Title>
        <Text className="text-[#8592a3]">
          Manage and organize your development tools and utilities
        </Text>
      </div>

      {/* Filters Bar */}
      <Card
        bordered={false}
        className="sneat-card-shadow mb-6"
        styles={{ body: { padding: "1.25rem" } }}
      >
        <Row gutter={[24, 16]} align="middle">
          {/* Category Filter */}
          <Col xs={24} md={12} lg={16}>
            <Space size="middle" wrap>
              <Text className="text-sm text-[#8592a3] font-medium">
                Category:
              </Text>
              <Segmented
                value={activeCategory}
                onChange={(value) => setActiveCategory(value as typeof activeCategory)}
                options={[
                  { label: "All", value: "All" },
                  { label: "Dev", value: "Dev" },
                  { label: "Auto", value: "Auto" },
                  { label: "Intel", value: "Intel" },
                  { label: "Creative", value: "Creative" },
                ]}
              />
            </Space>
          </Col>

          {/* Search + Add Button */}
          <Col xs={24} md={12} lg={8}>
            <div className="flex gap-3">
              <Input
                placeholder="Search tools..."
                prefix={<SearchOutlined className="text-[#a1acb8]" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                className="flex-1"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ backgroundColor: "#696cff" }}
              >
                <span className="hidden sm:inline">Add Tool</span>
              </Button>
            </div>
          </Col>
        </Row>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-[#eceef1] dark:border-[#444564]">
          <Text className="text-sm text-[#8592a3]">
            Showing <Text strong className="text-[#566a7f] dark:text-[#a3b1c2]">{filteredTools.length}</Text> of{" "}
            <Text strong className="text-[#566a7f] dark:text-[#a3b1c2]">{tools.length}</Text> tools
          </Text>
        </div>
      </Card>

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
              <Col key={tool.id} xs={24} sm={12} lg={8} xl={6}>
                <SortableToolCard tool={tool} onEdit={handleEdit} />
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
      {filteredTools.length === 0 && (
        <Card
          bordered={false}
          className="sneat-card-shadow text-center py-12"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#f5f5f9] dark:bg-[#323249] flex items-center justify-center">
              <SearchOutlined className="text-2xl text-[#a1acb8]" />
            </div>
            <div>
              <Title level={5} className="text-[#566a7f] dark:text-[#a3b1c2] m-0 mb-1">
                No tools found
              </Title>
              <Text className="text-[#8592a3]">
                Try adjusting your search or filter criteria
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ backgroundColor: "#696cff" }}
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
