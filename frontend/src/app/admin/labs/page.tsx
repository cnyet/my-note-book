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
  Card,
  Tag,
} from "antd";
import { useCallback, useMemo, useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  MoreVertical,
  Users,
  Beaker,
  Activity,
  Archive,
  Eye,
  FlaskConical,
} from "lucide-react";
import { labsApi, type Lab as ApiLab } from "@/lib/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { StatCard } from "@/components/ui/Card/StatCard";
import { DragSortTable } from "@/components/admin/DragSortTable";

const { Text } = Typography;
const { TextArea } = Input;

/** Lab Status Types */
export type LabStatus = "Experimental" | "Preview" | "Live" | "Archived";

/** Lab Interface */
interface Lab {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: LabStatus;
  demoLink?: string;
  mediaAssets?: string[];
  onlineCount: number;
  sortOrder: number;
}

/** Map API Lab to Frontend */
function mapApiLabToFrontend(apiLab: ApiLab): Lab {
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
    sortOrder: apiLab.sort_order || 0,
  };
}

/** Map Frontend Lab to API */
function mapFrontendLabToApi(lab: Lab): Partial<ApiLab> {
  return {
    name: lab.name,
    slug: lab.slug || lab.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    status: lab.status === "Live" ? "Preview" : lab.status,
    description: lab.description,
    demo_url: lab.demoLink,
    media_urls: lab.mediaAssets || [],
    online_count: lab.onlineCount,
    sort_order: lab.sortOrder,
  };
}

/** Status Badge Component */
function getStatusBadgeProps(status: LabStatus): { color: string; text: string } {
  switch (status) {
    case "Experimental":
      return { color: "blue", text: "Experimental" };
    case "Preview":
      return { color: "cyan", text: "Preview" };
    case "Live":
      return { color: "green", text: "Live" };
    case "Archived":
      return { color: "default", text: "Archived" };
  }
}

function StatusBadge({ status }: { status: LabStatus }) {
  const { color, text } = getStatusBadgeProps(status);
  return <Tag color={color}>{text}</Tag>;
}

/** Skeleton Stat Card */
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
        sortOrder: lab?.sortOrder || 0,
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-duralux-primary to-duralux-primary-dark flex items-center justify-center">
            <Beaker className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {lab ? "Edit Lab" : "Add New Lab"}
          </span>
        </div>
      }
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{
        className: "bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white"
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
          <Beaker size={16} />
          Basic
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "config"
              ? "bg-white dark:bg-[#2b2c40] text-duralux-primary shadow-sm"
              : "text-duralux-text-muted hover:text-duralux-text-secondary"
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
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Name <span className="text-duralux-danger">*</span>
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
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Slug <span className="text-duralux-danger">*</span>
              </label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="lab-slug"
                className="h-11 rounded-xl"
                prefix={<span className="text-duralux-text-muted text-sm">/</span>}
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
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
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
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
              />
            </div>
          </>
        )}

        {/* Config Tab */}
        {activeTab === "config" && (
          <>
            {/* Demo Link */}
            <div>
              <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                Demo Link
              </label>
              <Input
                value={form.demoLink}
                onChange={(e) => setForm({ ...form, demoLink: e.target.value })}
                placeholder="/labs/example"
                prefix={<Globe className="text-duralux-text-muted" size={16} />}
                className="h-11 rounded-xl"
                styles={{ input: { fontSize: "14px" } }}
              />
            </div>

            {/* Online Count (Read-only) */}
            {lab && (
              <div>
                <label className="block text-sm font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-2">
                  Online Count
                </label>
                <Input
                  value={lab.onlineCount}
                  disabled
                  className="bg-duralux-bg-page dark:bg-[#323249] rounded-xl"
                  prefix={<Users size={16} className="text-duralux-text-muted" />}
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

  // Load labs from API
  const { data: labsData, isLoading } = useQuery({
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
        const apiData = mapFrontendLabToApi(lab);
        const response = await labsApi.update(lab.id, apiData as Parameters<typeof labsApi.update>[1]);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["admin-labs"] });
          message.success("Lab updated successfully");
        }
      } else {
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

  // Filter labs
  const filteredLabs = useMemo(() => {
    let result = [...labs];

    if (statusFilter !== "all") {
      result = result.filter((lab) => lab.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lab) =>
          lab.name.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query),
      );
    }

    // Sort by sortOrder
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  }, [labs, statusFilter, searchQuery]);

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

  // Update sort order mutation
  const updateSortOrdersMutation = useMutation({
    mutationFn: async (labsToUpdate: Lab[]) => {
      const updates = labsToUpdate.map((lab) =>
        labsApi.update(lab.id, { sort_order: lab.sortOrder })
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-labs"] });
    },
    onError: () => {
      message.error("Failed to update sort order");
    },
  });

  const handleSort = async (sortedData: Lab[]) => {
    await updateSortOrdersMutation.mutateAsync(sortedData);
  };

  // Action menu for each row
  const getMenuItems = (lab: Lab): MenuProps["items"] => [
    {
      key: "view",
      label: "View Demo",
      icon: <EyeOutlined />,
      disabled: !lab.demoLink,
      onClick: () => lab.demoLink && window.open(lab.demoLink, "_blank"),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEdit(lab),
    },
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      danger: true,
      icon: <DeleteOutlined />,
      onClick: () => handleDeleteLab(lab),
    },
  ];

  // Table columns
  const columns: ColumnsType<Lab> = [
    {
      title: "Lab",
      dataIndex: "name",
      key: "lab",
      width: 200,
      render: (_, lab) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-duralux-primary-transparent flex items-center justify-center">
            <Beaker className="text-duralux-primary" size={20} />
          </div>
          <div>
            <div className="font-semibold text-duralux-text-primary">{lab.name}</div>
            <div className="text-xs text-duralux-text-muted">{lab.slug}</div>
          </div>
        </div>
      ),
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
      width: 120,
      render: (status: LabStatus) => <StatusBadge status={status} />,
    },
    {
      title: "Users",
      dataIndex: "onlineCount",
      key: "onlineCount",
      width: 80,
      render: (count: number) => (
        <div className="flex items-center gap-1.5 text-duralux-text-secondary">
          <Users size={14} className="text-duralux-text-muted" />
          <span className="text-sm font-semibold">{count}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, lab) => (
        <Dropdown
          menu={{ items: getMenuItems(lab) }}
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
              <FlaskConical className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-[1.5rem] font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary m-0">
                Labs Management
              </h1>
              <p className="text-duralux-text-muted text-sm mt-1">
                Manage experimental features and demos
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search labs..."
              prefix={<SearchOutlined className="text-duralux-text-muted" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full sm:w-[240px] rounded-xl"
              styles={{
                input: { fontSize: "14px" },
              }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className="w-full sm:w-[140px] rounded-xl"
              options={[
                { label: "All Status", value: "all" },
                { label: "Experimental", value: "Experimental" },
                { label: "Preview", value: "Preview" },
                { label: "Live", value: "Live" },
                { label: "Archived", value: "Archived" },
              ]}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-11 rounded-xl font-semibold shadow-lg shadow-duralux-primary/30"
            >
              Add Lab
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
              icon={<Beaker size={20} />}
              label="Total Labs"
              value={labs.length}
              gradient="blue"
            />
          )}
        </Col>
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<Activity size={20} />}
              label="Experimental"
              value={labs.filter((l) => l.status === "Experimental").length}
              gradient="green"
            />
          )}
        </Col>
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<Eye size={20} />}
              label="Preview"
              value={labs.filter((l) => l.status === "Preview").length}
              gradient="cyan"
            />
          )}
        </Col>
        <Col xs={24} sm={12} md={6}>
          {isLoading ? (
            <SkeletonStatCard />
          ) : (
            <StatCard
              icon={<Archive size={20} />}
              label="Archived"
              value={labs.filter((l) => l.status === "Archived").length}
              gradient="orange"
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
        <DragSortTable<Lab>
          dataSource={filteredLabs}
          columns={columns}
          onSort={handleSort}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </motion.div>

      {/* Empty State */}
      {filteredLabs.length === 0 && !isLoading && (
        <Card className="text-center py-16 rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-duralux-primary-transparent flex items-center justify-center">
              <FlaskConical size={40} className="text-duralux-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary m-0 mb-2">
                No labs found
              </h3>
              <Text className="text-duralux-text-muted">
                Try adjusting your filters or add a new lab
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-11 rounded-xl font-semibold shadow-lg shadow-duralux-primary/30"
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
    </motion.div>
  );
}
