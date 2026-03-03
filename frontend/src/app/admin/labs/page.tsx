"use client";

import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
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
import { useCallback, useMemo, memo, useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Globe,
  MoreVertical,
  Users,
  Beaker,
  Activity,
  Archive,
  Eye,
} from "lucide-react";
import { labsApi, type Lab as ApiLab } from "@/lib/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, StatusBadge } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Card/StatCard";

const { Text } = Typography;
const { TextArea } = Input;

/** Lab Status Types */
export type LabStatus = "Experimental" | "Preview" | "Live" | "Archived";

/** Lab Interface - 前端数据结构 */
interface Lab {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: LabStatus;
  demoLink?: string;
  mediaAssets?: string[];
  onlineCount: number;
}

/** 将后端 API Lab 转换为前端 Lab */
function mapApiLabToFrontend(apiLab: ApiLab): Lab {
  // 映射后端状态到前端（后端无 "Live"，用 "Preview" 代替）
  let status: LabStatus = "Experimental";
  if (apiLab.status === "Archived") status = "Archived";
  else if (apiLab.status === "Preview") status = "Preview";

  return {
    id: apiLab.id,
    name: apiLab.name,
    slug: apiLab.slug,
    description: apiLab.description || "",
    status,
    demoLink: apiLab.demo_url,
    mediaAssets: apiLab.media_urls,
    onlineCount: apiLab.online_count,
  };
}

/** 将前端 Lab 转换为后端 API 格式 */
function mapFrontendLabToApi(lab: Lab): Partial<ApiLab> {
  return {
    name: lab.name,
    slug: lab.slug || lab.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    status: lab.status === "Live" ? "Preview" : lab.status,
    description: lab.description,
    demo_url: lab.demoLink,
    media_urls: lab.mediaAssets || [],
    online_count: lab.onlineCount,
  };
}

/** Status Badge Props Mapper */
function getStatusBadgeProps(status: LabStatus): { status: string; label: string } {
  switch (status) {
    case "Experimental":
      return { status: "experimental", label: "Experimental" };
    case "Preview":
      return { status: "preview", label: "Preview" };
    case "Live":
      return { status: "live", label: "Live" };
    case "Archived":
      return { status: "archived", label: "Archived" };
  }
}

/** Lab Card Component */
const LabCard = memo(function LabCard({ lab, onEdit, onDelete }: { lab: Lab; onEdit: (lab: Lab) => void; onDelete: (lab: Lab) => void }) {
  const badgeProps = getStatusBadgeProps(lab.status);
  const items: MenuProps["items"] = [
    {
      key: "view",
      label: "View Demo",
      icon: <EyeOutlined />,
      disabled: !lab.demoLink,
      onClick: () => lab.demoLink && window.open(lab.demoLink, "_blank"),
    },
    { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => onEdit(lab) },
    { type: "divider" },
    { key: "delete", label: "Delete", danger: true, icon: <DeleteOutlined />, onClick: () => onDelete(lab) },
  ];

  return (
    <Card
      hover
      className="h-full"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header: Status Badge + More Menu */}
      <div className="flex justify-between items-start mb-5">
        <StatusBadge status={badgeProps.status as any} label={badgeProps.label} size="md" />
        <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
          <Button
            type="text"
            shape="circle"
            icon={<MoreVertical size={16} className="text-gray-400" />}
            size="small"
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          />
        </Dropdown>
      </div>

      {/* Lab Icon/Avatar - Larger gradient circle */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-5 mx-auto shadow-lg">
        <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-gray-900/80 flex items-center justify-center backdrop-blur-sm">
          <Beaker className="text-orange-500" size={36} />
        </div>
      </div>

      {/* Lab Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white m-0 mb-1 text-center">
        {lab.name}
      </h3>

      {/* Slug */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <span className="text-xs text-gray-400">/</span>
        <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium">
          {lab.slug}
        </Text>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed mb-5 line-clamp-2">
        {lab.description}
      </p>

      {/* Footer: Online Count + Demo Link */}
      <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Users size={16} className="text-gray-400" />
          <Text className="text-gray-600 dark:text-gray-400 text-xs font-semibold">
            {lab.onlineCount} online
          </Text>
        </div>
        {lab.demoLink && (
          <Button
            type="default"
            size="large"
            icon={<Eye size={16} />}
            className="flex-1 h-11 rounded-xl font-semibold"
          >
            Demo
          </Button>
        )}
      </div>
    </Card>
  );
});

/** Edit Lab Modal */
function EditLabModal({
  open,
  lab,
  onSave,
  onCancel,
}: {
  open: boolean;
  lab: Lab | null;
  onSave: (lab: Lab) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Lab>>(lab || {});
  const [activeTab, setActiveTab] = useState<"basic" | "config">("basic");

  useEffect(() => {
    setForm(lab || {});
  }, [lab]);

  const handleSave = () => {
    if (form.name && form.status) {
      onSave({
        id: lab?.id || Date.now(),
        name: form.name,
        slug: form.slug || (form.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: form.description || "",
        status: form.status,
        demoLink: form.demoLink,
        mediaAssets: form.mediaAssets,
        onlineCount: lab?.onlineCount || 0,
      });
      onCancel();
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <Beaker className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {lab ? "Edit Lab" : "Add New Lab"}
          </span>
        </div>
      }
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{ className: "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700" }}
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
              ? "bg-white dark:bg-gray-700 text-orange-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Beaker size={16} />
          Basic
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "config"
              ? "bg-white dark:bg-gray-700 text-orange-500 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Globe size={16} />
          Config
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
                placeholder="Enter lab name"
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
                placeholder="lab-slug"
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
                placeholder="Enter lab description"
                rows={3}
                className="rounded-xl"
                styles={{ textarea: { fontSize: "14px" } }}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <Select<LabStatus>
                value={form.status}
                onChange={(status) => setForm({ ...form, status })}
                className="w-full"
                options={[
                  { label: "Experimental", value: "Experimental" },
                  { label: "Preview", value: "Preview" },
                  { label: "Live", value: "Live" },
                  { label: "Archived", value: "Archived" },
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
            {/* Demo Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Demo Link
              </label>
              <Input
                value={form.demoLink}
                onChange={(e) => setForm({ ...form, demoLink: e.target.value })}
                placeholder="/labs/example"
                prefix={<Globe className="text-gray-400" size={16} />}
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Media Assets (Placeholder) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Media Assets
              </label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-orange-400 dark:hover:border-orange-500 transition-colors cursor-pointer">
                <Beaker size={24} className="text-gray-400 mx-auto mb-2" />
                <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Click to upload or drag and drop
                </Text>
                <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  PNG, JPG, GIF up to 10MB
                </div>
              </div>
            </div>

            {/* Online Count (Read-only) */}
            {lab && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Online Count
                </label>
                <Input
                  value={lab.onlineCount}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl"
                  prefix={<Users size={16} className="text-gray-400" />}
                />
              </div>
            )}
          </>
        )}
      </Space>
    </Modal>
  );
}

export default function LabsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const queryClient = useQueryClient();

  // Load labs from API using React Query
  const { data: labsData } = useQuery({
    queryKey: ["admin-labs"],
    queryFn: async () => {
      const response = await labsApi.list();
      if (response.success && response.data) {
        return response.data.map(mapApiLabToFrontend);
      }
      return [];
    },
  });

  const labs = labsData || [];
  const isLoading = false;

  // Mutation for deleting lab
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await labsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-labs"] });
      message.success("Lab deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete lab");
    },
  });

  const handleSaveLab = async (lab: Lab) => {
    try {
      if (editingLab) {
        // Update existing lab via API
        const apiData = mapFrontendLabToApi(lab);
        const response = await labsApi.update(lab.id, apiData as Parameters<typeof labsApi.update>[1]);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-labs"] });
          message.success("Lab updated successfully");
        }
      } else {
        // Create new lab via API
        const apiData = mapFrontendLabToApi(lab);
        const response = await labsApi.create(apiData as Parameters<typeof labsApi.create>[0]);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-labs"] });
          message.success("Lab created successfully");
        }
      }
      setEditModalOpen(false);
      setEditingLab(null);
    } catch (error) {
      console.error("Failed to save lab:", error);
      message.error("Failed to save lab");
    }
  };

  const handleDeleteLab = (lab: Lab) => {
    Modal.confirm({
      title: "Delete Lab",
      content: `Are you sure you want to delete "${lab.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        deleteMutation.mutate(lab.id);
      },
    });
  };

  // Filter labs using useMemo
  const filteredLabs = useMemo(() => {
    let result = labs;

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((lab) => lab.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lab) =>
          lab.name.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query),
      );
    }

    return result;
  }, [labs, statusFilter, searchQuery]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = useCallback((lab: Lab) => {
    setEditingLab(lab);
    setEditModalOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingLab(null);
    setEditModalOpen(true);
  }, []);

  const handleEditModalCancel = () => {
    setEditModalOpen(false);
    setEditingLab(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e] p-6">
      {/* Header Section - Enhanced with gradient and better typography */}
      <Row gutter={[24, 24]} align="middle" className="mb-8">
        <Col xs={24} md={12}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FlaskConical className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                Labs Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                Manage experimental features and demos
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search labs..."
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
                { label: "Experimental", value: "Experimental" },
                { label: "Preview", value: "Preview" },
                { label: "Live", value: "Live" },
                { label: "Archived", value: "Archived" },
              ]}
              styles={{
                selector: { borderRadius: "12px", height: "44px" },
              }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 border-none h-11 rounded-xl font-semibold shadow-lg shadow-orange-500/30"
              styles={{
                button: { borderRadius: "12px" },
              }}
            >
              Add Lab
            </Button>
          </div>
        </Col>
      </Row>

      {/* Stats Row - Enhanced with StatCard component */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<Beaker size={20} />}
            label="Total Labs"
            value={labs.length || 0}
            gradient="orange"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<Activity size={20} />}
            label="Experimental"
            value={labs.filter((l) => l.status === "Experimental").length}
            gradient="orange"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<Eye size={20} />}
            label="Preview"
            value={labs.filter((l) => l.status === "Preview").length}
            gradient="cyan"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<Archive size={20} />}
            label="Archived"
            value={labs.filter((l) => l.status === "Archived").length}
            gradient="gray"
          />
        </Col>
      </Row>

      {/* Labs Grid */}
      <Row gutter={[24, 24]}>
        {filteredLabs.map((lab) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={lab.id}>
            <LabCard lab={lab} onEdit={handleEdit} onDelete={handleDeleteLab} />
          </Col>
        ))}
      </Row>

      {/* Empty State - Enhanced design */}
      {filteredLabs.length === 0 && (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
              <FlaskConical size={40} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white m-0 mb-2">
                No labs found
              </h3>
              <Text className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or add a new lab
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 border-none h-11 rounded-xl font-semibold shadow-lg shadow-orange-500/30"
              styles={{
                button: { borderRadius: "12px" },
              }}
            >
              Add Your First Lab
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <EditLabModal
        open={editModalOpen}
        lab={editingLab}
        onSave={handleSaveLab}
        onCancel={handleEditModalCancel}
      />
    </div>
  );
}
