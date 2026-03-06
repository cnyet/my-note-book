"use client";

import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  CheckOutlined,
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
  Table,
  Tag,
  Dropdown,
  type MenuProps,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Layers, Link2, MoreVertical } from "lucide-react";
import { toolsApi, type Tool as ApiTool } from "@/lib/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";

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

// Map API Tool to Frontend
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

// Map Frontend Tool to API
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

// Category Badge Component
function CategoryBadge({ category }: { category: ToolCategory }) {
  const categoryConfig: Record<ToolCategory, { color: string; text: string }> = {
    Dev: { color: "blue", text: "Dev" },
    Auto: { color: "cyan", text: "Auto" },
    Intel: { color: "orange", text: "Intel" },
    Creative: { color: "purple", text: "Creative" },
  };

  const config = categoryConfig[category];
  return <Tag color={config.color}>{config.text}</Tag>;
}

// Status Badge Component
function StatusBadge({ status }: { status: ToolStatus }) {
  const badgeConfig = {
    active: { color: "success", text: "Active" },
    inactive: { color: "default", text: "Inactive" },
  };
  const config = badgeConfig[status] || badgeConfig.inactive;
  return <Tag color={config.color}>{config.text}</Tag>;
}

// Stat Card Component
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

// Tool Form Modal
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

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await toolsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
      message.success("Tool deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete tool");
    },
  });

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

  const handleDelete = (tool: Tool) => {
    Modal.confirm({
      title: "Delete Tool",
      content: `Are you sure you want to delete "${tool.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteMutation.mutate(tool.id);
      },
    });
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

  // Action menu for each row
  const getMenuItems = (tool: Tool): MenuProps["items"] => [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEdit(tool),
    },
    {
      key: "open",
      label: "Open",
      icon: <Link2 size={16} />,
      onClick: () => window.open(tool.link, "_blank"),
    },
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(tool),
    },
  ];

  // Table columns
  const columns: ColumnsType<Tool> = [
    {
      title: "Tool",
      dataIndex: "name",
      key: "tool",
      width: 200,
      render: (_, tool) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-duralux-primary to-duralux-primary-dark flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {tool.icon.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-duralux-text-primary">{tool.name}</div>
            <div className="text-xs text-duralux-text-muted">{tool.icon}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: (category: ToolCategory) => <CategoryBadge category={category} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <Text className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary">
          {text}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: ToolStatus) => <StatusBadge status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, tool) => (
        <Dropdown
          menu={{ items: getMenuItems(tool) }}
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <Row gutter={[24, 24]} align="middle">
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
      <Row gutter={[24, 24]}>
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Table<Tool>
          columns={columns}
          dataSource={filteredTools}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          className="dark:bg-duralux-bg-dark-card rounded-lg overflow-hidden"
        />
      </motion.div>

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
