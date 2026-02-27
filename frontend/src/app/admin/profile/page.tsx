"use client";

import {
  Card,
  Form,
  Input,
  Button,
  message,
  Table,
  Space,
  Popconfirm,
  Progress,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  KeyOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { adminAuthApi } from "@/lib/admin-api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  display_name: string | null;
}

interface ApiToken {
  id: string;
  name: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  last_used: string | null;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  percent: number;
}

export default function ProfilePage() {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [creatingToken, setCreatingToken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Weak",
    color: "#ff4d4f",
    percent: 0,
  });

  const queryClient = useQueryClient();

  // Load user profile using React Query
  const { data: profile } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await adminAuthApi.get<UserProfile>("/admin/profile");
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    },
  });

  // Load tokens using React Query
  const { data: tokensData } = useQuery({
    queryKey: ["admin-profile-tokens"],
    queryFn: async () => {
      const response = await adminAuthApi.get<ApiToken[]>("/admin/profile/tokens");
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
  });

  const tokens = tokensData || [];

  // Set form values when profile loads
  useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        username: profile.username,
        email: profile.email,
        display_name: profile.display_name || "",
      });
    }
  }, [profile, profileForm]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: "Weak", color: "#ff4d4f", percent: 0 };
    }

    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) score += 12.5;

    let label = "Weak";
    let color = "#ff4d4f";

    if (score >= 87.5) {
      label = "Strong";
      color = "#52c41a";
    } else if (score >= 62.5) {
      label = "Good";
      color = "#1890ff";
    } else if (score >= 37.5) {
      label = "Fair";
      color = "#faad14";
    }

    return { score, label, color, percent: score };
  };

  const handleProfileUpdate = async (values: {
    email: string;
    display_name: string;
  }) => {
    setLoading(true);
    try {
      const response = await adminAuthApi.put<UserProfile>("/admin/profile", {
        email: values.email,
        display_name: values.display_name || undefined,
      });

      if (response.success) {
        message.success("Profile updated successfully");
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    setPasswordLoading(true);
    try {
      const response = await adminAuthApi.post("/admin/profile/change-password", {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });

      if (response.success) {
        message.success("Password changed successfully");
        passwordForm.resetFields();
        setPasswordStrength({
          score: 0,
          label: "Weak",
          color: "#ff4d4f",
          percent: 0,
        });
      } else {
        message.error("Failed to change password");
      }
    } catch (error) {
      message.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCreateToken = async () => {
    if (!newTokenName.trim()) {
      message.warning("Please enter a token name");
      return;
    }

    setCreatingToken(true);
    try {
      const response = await adminAuthApi.post<ApiToken>(
        "/admin/profile/tokens",
        { name: newTokenName },
      );

      if (response.success && response.data) {
        message.success(
          `Token created: ${response.data.id}. Save it now, you won't see it again!`,
        );
        setNewTokenName("");
        queryClient.invalidateQueries({ queryKey: ["admin-profile-tokens"] });
      } else {
        message.error("Failed to create token");
      }
    } catch (error) {
      message.error("Failed to create token");
    } finally {
      setCreatingToken(false);
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    try {
      const response = await adminAuthApi.delete(
        `/admin/profile/tokens/${tokenId}`,
      );

      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin-profile-tokens"] });
        message.success("Token revoked successfully");
      } else {
        message.error("Failed to revoke token");
      }
    } catch (error) {
      message.error("Failed to revoke token");
    }
  };

  const tokenColumns: ColumnsType<ApiToken> = [
    {
      title: "Token ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <code className="bg-[#f5f5f9] dark:bg-[#323249] px-2 py-1 rounded text-sm">
          ••••{id.slice(-4)}
        </code>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      title: "Expires",
      dataIndex: "expires_at",
      key: "expires_at",
      render: (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            active
              ? "bg-[#71dd37]/10 text-[#71dd37]"
              : "bg-[#ff3e1d]/10 text-[#ff3e1d]"
          }`}
        >
          {active ? "Active" : "Revoked"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Revoke token"
          description="Are you sure you want to revoke this token?"
          onConfirm={() => handleRevokeToken(record.id)}
          okText="Revoke"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            disabled={!record.is_active}
          >
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#566a7f] dark:text-[#a3b1c2] m-0">
            My Profile
          </h2>
          <p className="text-[#697a8d] text-sm mt-1 mb-0">
            Manage your profile settings and preferences
          </p>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card
        title={
          <span className="text-base font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
            Basic Information
          </span>
        }
        className="sneat-card-shadow border-none"
        bordered={false}
        styles={{ body: { padding: "1.5rem" } }}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item label="Username" name="username">
              <Input
                prefix={<UserOutlined className="text-[#a1acb8]" />}
                disabled
                className="bg-[#f5f5f9] dark:bg-[#323249] text-[#697a8d]"
              />
            </Form.Item>

            <Form.Item
              label="Display Name"
              name="display_name"
              rules={[
                { max: 50, message: "Display name cannot exceed 50 characters" },
              ]}
            >
              <Input
                placeholder="Enter display name"
                className="dark:bg-[#2b2c40]"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-[#a1acb8]" />}
                placeholder="Enter email"
                className="dark:bg-[#2b2c40]"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-[#696cff] hover:bg-[#5f61e6] border-none h-9 px-6 font-medium"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>

      {/* Password Change Card */}
      <Card
        title={
          <span className="text-base font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
            Change Password
          </span>
        }
        className="sneat-card-shadow border-none"
        bordered={false}
        styles={{ body: { padding: "1.5rem" } }}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item
              label="Current Password"
              name="current_password"
              rules={[{ required: true, message: "Please enter current password" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-[#a1acb8]" />}
                placeholder="Enter current password"
                className="dark:bg-[#2b2c40]"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="new_password"
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-[#a1acb8]" />}
                placeholder="Enter new password"
                className="dark:bg-[#2b2c40]"
                onChange={(e) =>
                  setPasswordStrength(calculatePasswordStrength(e.target.value))
                }
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirm_password"
              dependencies={["new_password"]}
              rules={[
                { required: true, message: "Please confirm new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-[#a1acb8]" />}
                placeholder="Confirm new password"
                className="dark:bg-[#2b2c40]"
              />
            </Form.Item>
          </div>

          {/* Password Strength Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#697a8d]">Password Strength:</span>
              <span
                className="text-sm font-medium"
                style={{ color: passwordStrength.color }}
              >
                {passwordStrength.label}
              </span>
            </div>
            <Progress
              percent={passwordStrength.percent}
              strokeColor={passwordStrength.color}
              showInfo={false}
              size="small"
              className="mb-4"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
              className="bg-[#696cff] hover:bg-[#5f61e6] border-none h-9 px-6 font-medium"
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Card>

      {/* API Tokens Card */}
      <Card
        title={
          <span className="text-base font-semibold text-[#566a7f] dark:text-[#a3b1c2]">
            <KeyOutlined className="mr-2" />
            API Tokens
          </span>
        }
        className="sneat-card-shadow border-none"
        bordered={false}
        styles={{ body: { padding: "1.5rem" } }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Token name (e.g., 'Frontend - Dev')"
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            onPressEnter={handleCreateToken}
            className="max-w-xs dark:bg-[#2b2c40]"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateToken}
            loading={creatingToken}
            className="bg-[#696cff] hover:bg-[#5f61e6] border-none h-9 font-medium"
          >
            Generate New Token
          </Button>
        </div>

        <Table
          columns={tokenColumns}
          dataSource={tokens}
          rowKey="id"
          loading={queryClient.isFetching({ queryKey: ["admin-profile-tokens"] })}
          pagination={false}
          className="dark:[&_th]:bg-[#2b2c40] dark:[_tr:hover_.ant-table-cell]:bg-[#323249]"
        />
      </Card>
    </div>
  );
}
