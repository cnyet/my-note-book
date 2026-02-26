"use client";

import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
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
import { useCallback, useMemo, memo, useState, useEffect } from "react";
import {
  FlaskConical,
  Globe,
  MoreVertical,
  Users,
} from "lucide-react";
import { labsApi, type Lab as ApiLab } from "@/lib/admin-api";

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

/** Status Badge Colors */
const statusConfig: Record<
  LabStatus,
  { color: string; bgColor: string; textColor: string }
> = {
  Experimental: {
    color: "#ffab00",
    bgColor: "bg-[#ffab00]/10",
    textColor: "text-[#ffab00]",
  },
  Preview: {
    color: "#00cfdd",
    bgColor: "bg-[#00cfdd]/10",
    textColor: "text-[#00cfdd]",
  },
  Live: {
    color: "#71dd37",
    bgColor: "bg-[#71dd37]/10",
    textColor: "text-[#71dd37]",
  },
  Archived: {
    color: "#697a8d",
    bgColor: "bg-[#697a8d]/10",
    textColor: "text-[#697a8d]",
  },
};

/** Lab Card Component */
const LabCard = memo(function LabCard({ lab, onEdit }: { lab: Lab; onEdit: (lab: Lab) => void }) {
  const config = statusConfig[lab.status];
  const items: MenuProps["items"] = [
    {
      key: "view",
      label: "View Demo",
      icon: <EyeOutlined />,
      disabled: !lab.demoLink,
    },
    { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => onEdit(lab) },
    { type: "divider" },
    { key: "delete", label: "Delete", danger: true },
  ];

  return (
    <Card
      bordered={false}
      className="h-full sneat-card-shadow transition-all hover:translate-y-[-2px]"
      styles={{ body: { padding: "1.5rem", height: "100%" } }}
    >
      {/* Header: Status + More Menu */}
      <div className="flex justify-between items-start mb-4">
        <Tag
          className={config.bgColor + " " + config.textColor + " border-none m-0"}
          style={{
            backgroundColor: config.color + "20",
            color: config.color,
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "4px",
          }}
        >
          {lab.status}
        </Tag>
        <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
          <Button
            type="text"
            shape="circle"
            icon={<MoreVertical size={16} className="text-[#8592a3]" />}
            size="small"
          />
        </Dropdown>
      </div>

      {/* Lab Icon */}
      <div className="w-[48px] h-[48px] rounded-lg bg-[#696cff]/10 flex items-center justify-center mb-4">
        <FlaskConical className="text-[#696cff]" size={24} />
      </div>

      {/* Lab Name */}
      <h4 className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2] m-0 mb-2">
        {lab.name}
      </h4>

      {/* Description */}
      <Text className="text-[#697a8d] text-sm line-clamp-2 mb-4 block">
        {lab.description}
      </Text>

      {/* Footer: Online Count + Demo Link */}
      <div className="flex items-center justify-between pt-3 border-t border-[#eceef1] dark:border-[#444564]">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-[#8592a3]" />
          <Text className="text-[#8592a3] text-xs">
            {lab.onlineCount} online
          </Text>
        </div>
        {lab.demoLink && (
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            className="text-[#696cff] p-0 h-auto"
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

  return (
    <Modal
      title={
        <span className="text-lg font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
          {lab ? "Edit Lab" : "Add New Lab"}
        </span>
      }
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      okButtonProps={{ className: "bg-[#696cff] hover:bg-[#5f61e6]" }}
      styles={{ body: { padding: "1.5rem" } }}
    >
      <Space direction="vertical" size="large" className="w-full">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
            Name <span className="text-[#ff3e1d]">*</span>
          </label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter lab name"
            className="h-10"
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
            placeholder="Enter lab description"
            rows={3}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
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

        {/* Demo Link */}
        <div>
          <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
            Demo Link
          </label>
          <Input
            value={form.demoLink}
            onChange={(e) => setForm({ ...form, demoLink: e.target.value })}
            placeholder="/labs/example"
            prefix={<Globe size={16} className="text-[#8592a3]" />}
          />
        </div>

        {/* Media Assets (Placeholder) */}
        <div>
          <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
            Media Assets
          </label>
          <div className="border-2 border-dashed border-[#eceef1] dark:border-[#444564] rounded-lg p-6 text-center">
            <Text className="text-[#8592a3] text-sm">
              Click to upload or drag and drop
            </Text>
            <div className="text-[#a1acb8] text-xs mt-1">PNG, JPG, GIF up to 10MB</div>
          </div>
        </div>

        {/* Online Count (Read-only) */}
        {lab && (
          <div>
            <label className="block text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2] mb-2">
              Online Count
            </label>
            <Input value={lab.onlineCount} disabled className="bg-[#f5f5f9] dark:bg-[#323249]" />
          </div>
        )}
      </Space>
    </Modal>
  );
}

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);

  // Load labs from API
  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setLoading(true);
      const response = await labsApi.list();
      if (response.success && response.data) {
        const mappedLabs = response.data.map(mapApiLabToFrontend);
        setLabs(mappedLabs);
      }
    } catch (error) {
      console.error("Failed to load labs:", error);
      message.error("Failed to load labs from API");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLab = async (lab: Lab) => {
    try {
      if (editingLab) {
        // Update existing lab via API
        const apiData = mapFrontendLabToApi(lab);
        const response = await labsApi.update(lab.id, apiData as Parameters<typeof labsApi.update>[1]);
        if (response.success) {
          await loadLabs();
          message.success("Lab updated successfully");
        }
      } else {
        // Create new lab via API
        const apiData = mapFrontendLabToApi(lab);
        const response = await labsApi.create(apiData as Parameters<typeof labsApi.create>[0]);
        if (response.success) {
          await loadLabs();
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

  const handleDeleteLab = async (lab: Lab) => {
    Modal.confirm({
      title: "Delete Lab",
      content: `Are you sure you want to delete "${lab.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await labsApi.delete(lab.id);
          await loadLabs();
          message.success("Lab deleted successfully");
        } catch (error) {
          console.error("Failed to delete lab:", error);
          message.error("Failed to delete lab");
        }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="animate-in fade-in-50 duration-500 p-6">
      {/* Header Section */}
      <Row gutter={[24, 24]} align="middle" className="mb-6">
        <Col xs={24} md={12}>
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-lg bg-[#696cff]/10 flex items-center justify-center">
              <FlaskConical className="text-[#696cff]" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#566a7f] dark:text-[#a3b1c2] m-0">
                Labs Management
              </h2>
              <p className="text-[#697a8d] text-sm m-0">
                Manage experimental features and demos
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Input
              placeholder="Search labs..."
              prefix={<SearchOutlined className="text-[#8592a3]" />}
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-10 w-full sm:w-[240px]"
            />
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full sm:w-[140px]"
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
              className="bg-[#696cff] hover:bg-[#5f61e6] h-10"
            >
              Add Lab
            </Button>
          </div>
        </Col>
      </Row>

      {/* Labs Grid */}
      <Row gutter={[24, 24]}>
        {filteredLabs.map((lab) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={lab.id}>
            <LabCard lab={lab} onEdit={handleEdit} />
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {filteredLabs.length === 0 && (
        <Card bordered={false} className="text-center py-12 sneat-card-shadow">
          <FlaskConical size={48} className="text-[#eceef1] dark:text-[#444564] mx-auto mb-4" />
          <Text className="text-[#697a8d] text-lg">No labs found</Text>
          <div className="mt-2">
            <Text className="text-[#a1acb8] text-sm">
              Try adjusting your filters or add a new lab
            </Text>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <EditLabModal
        open={editModalOpen}
        lab={editingLab}
        onSave={handleSaveLab}
        onCancel={() => setEditModalOpen(false)}
      />
    </div>
  );
}
