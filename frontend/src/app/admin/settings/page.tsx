"use client";

import {
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
  Divider,
  Popconfirm,
} from "antd";
import type { TabsProps } from "antd";
import {
  SaveOutlined,
  DatabaseOutlined,
  ClearOutlined,
  UndoOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { motion } from "framer-motion";

const { TextArea } = Input;

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
];

const aiModels = [
  { label: "Gemini Pro", value: "gemini-pro" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "Claude 3 Opus", value: "claude-3-opus" },
  { label: "Claude 3 Sonnet", value: "claude-3-sonnet" },
];

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState("general");

  const handleSaveSection = async (section: string) => {
    setSaving(true);
    try {
      const values = form.getFieldsValue();

      // Mock API call - replace with actual endpoint
      // const response = await adminAuthApi.put(`/admin/settings/${section}`, values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      message.success(
        `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`,
      );
    } catch (error) {
      message.error(`Failed to save ${section} settings`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success("Logo uploaded successfully");
      setLogoFile([info.file]);
    } else if (info.file.status === "error") {
      message.error("Logo upload failed");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB");
      return false;
    }
    return true;
  };

  const handleDatabaseBackup = async () => {
    try {
      message.loading({ content: "Creating backup...", key: "backup" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success({
        content: "Backup created successfully",
        key: "backup",
        duration: 2,
      });
    } catch (error) {
      message.error({ content: "Failed to create backup", key: "backup" });
    }
  };

  const handleClearCache = async () => {
    try {
      message.loading({ content: "Clearing cache...", key: "cache" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success({
        content: "Cache cleared successfully",
        key: "cache",
        duration: 2,
      });
    } catch (error) {
      message.error({ content: "Failed to clear cache", key: "cache" });
    }
  };

  const handleClearLogs = async () => {
    try {
      message.loading({ content: "Clearing logs...", key: "logs" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success({
        content: "Logs cleared successfully",
        key: "logs",
        duration: 2,
      });
    } catch (error) {
      message.error({ content: "Failed to clear logs", key: "logs" });
    }
  };

  const handleResetDefaults = async () => {
    try {
      message.loading({ content: "Resetting to defaults...", key: "reset" });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      form.resetFields();
      message.success({
        content: "Settings reset to defaults",
        key: "reset",
        duration: 2,
      });
    } catch (error) {
      message.error({ content: "Failed to reset settings", key: "reset" });
    }
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "general",
      label: "General",
      children: (
        <div className="space-y-6">
          <Form.Item
            label="Site Title"
            name="site_title"
            rules={[{ required: true, message: "Please enter site title" }]}
          >
            <Input placeholder="Enter site title" className="dark:bg-[#2b2c40] rounded-xl" />
          </Form.Item>

          <Form.Item label="Site Description" name="site_description">
            <TextArea
              rows={4}
              placeholder="Enter site description"
              className="dark:bg-[#2b2c40] rounded-xl"
            />
          </Form.Item>

          <Form.Item label="Logo" name="logo">
            <Upload
              name="logo"
              listType="picture-card"
              className="logo-uploader"
              showUploadList={false}
              action="/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleLogoUpload}
              maxCount={1}
            >
              <Button
                icon={<UploadOutlined />}
                className="dark:bg-[#2b2c40] dark:border-[#444564] rounded-xl"
              >
                Upload Logo
              </Button>
            </Upload>
            <div className="text-xs text-duralux-text-muted mt-1">
              Recommended size: 200x60px, Max 2MB
            </div>
          </Form.Item>

          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[{ required: true, message: "Please select timezone" }]}
          >
            <Select
              placeholder="Select timezone"
              options={timezones.map((tz) => ({ label: tz, value: tz }))}
              className="dark:bg-[#2b2c40] rounded-xl"
            />
          </Form.Item>

          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSaveSection("general")}
              loading={saving}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 px-6 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      label: "Content",
      children: (
        <div className="space-y-6">
          <Form.Item
            label="Posts Per Page"
            name="posts_per_page"
            rules={[{ required: true, message: "Please enter posts per page" }]}
          >
            <InputNumber
              min={1}
              max={100}
              className="w-full dark:bg-[#2b2c40] rounded-xl"
              addonAfter="posts"
            />
          </Form.Item>

          <Form.Item
            label="Auto-save Interval"
            name="auto_save_interval"
            rules={[
              { required: true, message: "Please enter auto-save interval" },
            ]}
          >
            <InputNumber
              min={5}
              max={300}
              className="w-full dark:bg-[#2b2c40] rounded-xl"
              addonAfter="seconds"
            />
          </Form.Item>

          <Form.Item
            label="Markdown Storage Path"
            name="markdown_storage_path"
            rules={[{ required: true, message: "Please enter storage path" }]}
          >
            <Input
              placeholder="/content/posts"
              className="dark:bg-[#2b2c40] rounded-xl"
            />
          </Form.Item>

          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSaveSection("content")}
              loading={saving}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 px-6 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "agents",
      label: "Agents",
      children: (
        <div className="space-y-6">
          <Form.Item
            label="Default Model"
            name="default_model"
            rules={[{ required: true, message: "Please select default model" }]}
          >
            <Select
              placeholder="Select default AI model"
              options={aiModels}
              className="dark:bg-[#2b2c40] rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label="Request Timeout"
            name="request_timeout"
            rules={[{ required: true, message: "Please enter request timeout" }]}
          >
            <InputNumber
              min={10}
              max={300}
              className="w-full dark:bg-[#2b2c40] rounded-xl"
              addonAfter="seconds"
            />
          </Form.Item>

          <Form.Item
            label="WebSocket Heartbeat"
            name="websocket_heartbeat"
            rules={[
              { required: true, message: "Please enter heartbeat interval" },
            ]}
          >
            <InputNumber
              min={5}
              max={120}
              className="w-full dark:bg-[#2b2c40] rounded-xl"
              addonAfter="seconds"
            />
          </Form.Item>

          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSaveSection("agents")}
              loading={saving}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 px-6 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "security",
      label: "Security",
      children: (
        <div className="space-y-6">
          <Form.Item
            label="Session Expiry"
            name="session_expiry"
            rules={[{ required: true, message: "Please enter session expiry" }]}
          >
            <InputNumber
              min={5}
              max={10080}
              className="w-full dark:bg-[#2b2c40] rounded-xl"
              addonAfter="minutes"
            />
          </Form.Item>

          <Form.Item
            label="Max Login Attempts"
            name="max_login_attempts"
            rules={[
              { required: true, message: "Please enter max login attempts" },
            ]}
          >
            <InputNumber
              min={1}
              max={10}
              className="w-full dark:bg-[#2b2c40] rounded-xl"
              addonAfter="attempts"
            />
          </Form.Item>

          <Form.Item label="IP Whitelist" name="ip_whitelist">
            <TextArea
              rows={6}
              placeholder="Enter IP addresses (one per line)&#10;192.168.1.1&#10;10.0.0.1"
              className="dark:bg-[#2b2c40] rounded-xl"
            />
            <div className="text-xs text-duralux-text-muted mt-1">
              Leave empty to allow all IPs. One IP address per line.
            </div>
          </Form.Item>

          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSaveSection("security")}
              loading={saving}
              className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-9 px-6 font-medium rounded-xl shadow-lg shadow-duralux-primary/30"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "data",
      label: "Data",
      children: (
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-4">
              Database Operations
            </h4>
            <div className="flex flex-wrap gap-4">
              <Button
                type="default"
                icon={<DatabaseOutlined />}
                onClick={handleDatabaseBackup}
                className="h-9 font-medium rounded-xl border-duralux-border-light dark:border-duralux-border-dark"
              >
                Backup Database
              </Button>
              <Popconfirm
                title="Clear Cache"
                description="This will clear all cached data. Are you sure?"
                onConfirm={handleClearCache}
                okText="Clear"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<ClearOutlined />}
                  className="h-9 font-medium rounded-xl"
                >
                  Clear Cache
                </Button>
              </Popconfirm>
            </div>
          </div>

          <Divider className="dark:border-[#444564]" />

          <div>
            <h4 className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-4">
              Log Management
            </h4>
            <Popconfirm
              title="Clear Logs"
              description="This will permanently delete all logs. Are you sure?"
              onConfirm={handleClearLogs}
              okText="Clear"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} className="h-9 font-medium rounded-xl">
                Clear All Logs
              </Button>
            </Popconfirm>
          </div>

          <Divider className="dark:border-[#444564]" />

          <div>
            <h4 className="text-base font-semibold text-duralux-text-primary dark:text-duralux-text-dark-primary mb-4">
              Reset Settings
            </h4>
            <p className="text-sm text-duralux-text-secondary mb-4">
              This will reset all settings to their default values. This action
              cannot be undone.
            </p>
            <Popconfirm
              title="Reset to Defaults"
              description="Are you sure you want to reset all settings to default values?"
              onConfirm={handleResetDefaults}
              okText="Reset"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<UndoOutlined />}
                className="h-9 font-medium rounded-xl"
              >
                Reset All Settings
              </Button>
            </Popconfirm>
          </div>
        </div>
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
            Settings
          </h2>
          <p className="text-duralux-text-muted text-sm mt-1 mb-0">
            Manage your application settings and preferences
          </p>
        </div>
      </div>

      <Card
        className="shadow-duralux-card dark:shadow-duralux-card-dark border-none"
        bordered={false}
        styles={{ body: { padding: "1.5rem" } }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            site_title: "MyNoteBook",
            site_description: "A modern note-taking application",
            timezone: "UTC",
            posts_per_page: 10,
            auto_save_interval: 30,
            markdown_storage_path: "/content/posts",
            default_model: "gemini-pro",
            request_timeout: 60,
            websocket_heartbeat: 30,
            session_expiry: 1440,
            max_login_attempts: 5,
            ip_whitelist: "",
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="dark:[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-duralux-primary"
          />
        </Form>
      </Card>
    </motion.div>
  );
}
