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
import { useRouter } from "next/navigation";
import { adminAuthApi } from "@/lib/admin-api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";

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
    color: "var(--duralux-danger)",
    percent: 0,
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  // Load user profile using React Query
  const { data: profile, error: profileError } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await adminAuthApi.get<UserProfile>("/admin/profile");
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    },
    retry: false,
  });

  // Load tokens using React Query
  const { data: tokensData, error: tokensError } = useQuery({
    queryKey: ["admin-profile-tokens"],
    queryFn: async () => {
      const response = await adminAuthApi.get<ApiToken[]>("/admin/profile/tokens");
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    retry: false,
  });

  // Redirect to login if 401
  useEffect(() => {
    if ((profileError as any)?.status === 401 || (tokensError as any)?.status === 401) {
      router.push("/login");
    }
  }, [profileError, tokensError, router]);

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
      return { score: 0, label: "Weak", color: "var(--duralux-danger)", percent: 0 };
    }

    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) score += 12.5;

    let label = "Weak";
    let color = "var(--duralux-danger)";

    if (score >= 87.5) {
      label = "Strong";
      color = "var(--duralux-success)";
    } else if (score >= 62.5) {
      label = "Good";
      color = "var(--duralux-info)";
    } else if (score >= 37.5) {
      label = "Fair";
      color = "var(--duralux-warning)";
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
          color: "var(--duralux-danger)",
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
        <code className="bg-duralux-bg-page dark:bg-[#323249] px-2 py-1 rounded text-sm text-duralux-text-secondary">
          {String.fromCharCode(8226).repeat(4)}{id.slice(-4)}
        </code>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="text-duralux-text-primary dark:text-duralux-text-dark-primary font-medium">
          {name}
        </span>
      ),
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
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            active
              ? "bg-[var(--duralux-success-transparent)] text-[var(--duralux-success)]"
              : "bg-[var(--duralux-bg-hover)] text-[var(--duralux-text-muted)]"
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
            className="text-duralux-text-secondary hover:text-duralux-danger transition-colors"
          >
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.5rem] font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary m-0">
            My Profile
          </h2>
          <p className="text-duralux-text-muted text-sm mt-1 mb-0">
            Manage your profile settings and preferences
          </p>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card
        title={
          <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            Basic Information
          </span>
        }
        className="shadow-duralux-card dark:shadow-duralux-card-dark border-none"
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
                prefix={<UserOutlined className="text-duralux-text-muted" />}
                disabled
                className="bg-duralux-bg-page dark:bg-[#323249] text-duralux-text-secondary"
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
                prefix={<MailOutlined className="text-duralux-text-muted" />}
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
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 px-6 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>

      {/* Password Change Card */}
      <Card
        title={
          <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            Change Password
          </span>
        }
        className="shadow-duralux-card dark:shadow-duralux-card-dark border-none"
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
                prefix={<LockOutlined className="text-duralux-text-muted" />}
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
                prefix={<LockOutlined className="text-duralux-text-muted" />}
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
                prefix={<LockOutlined className="text-duralux-text-muted" />}
                placeholder="Confirm new password"
                className="dark:bg-[#2b2c40]"
              />
            </Form.Item>
          </div>

          {/* Password Strength Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-duralux-text-secondary">Password Strength:</span>
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
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 px-6 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Card>

      {/* API Tokens Card */}
      <Card
        title={
          <span className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            <KeyOutlined className="mr-2" />
            API Tokens
          </span>
        }
        className="shadow-duralux-card dark:shadow-duralux-card-dark border-none"
        bordered={false}
        styles={{ body: { padding: "1.5rem" } }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Token name (e.g., 'Frontend - Dev')"
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            onPressEnter={handleCreateToken}
            className="max-w-xs dark:bg-[#2b2c40] rounded-xl"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateToken}
            loading={creatingToken}
            className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
          >
            Generate New Token
          </Button>
        </div>

        <Table
          columns={tokenColumns}
          dataSource={tokens}
          rowKey="id"
          loading={queryClient.isFetching({ queryKey: ["admin-profile-tokens"] }) > 0}
          pagination={false}
          className="dark:[&_th]:bg-[#2b2c40] dark:[_tr:hover_.ant-table-cell]:bg-[#323249] duralux-table"
        />
      </Card>
    </motion.div>
  );
}
