"use client";

import React, { useState } from "react";
import { adminAuthApi } from "@/lib/admin-api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "data">("general");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({
    general: {
      site_title: "",
      site_description: "",
      logo_url: "",
      items_per_page: 10,
    },
    security: {
      session_timeout: 30,
      max_login_attempts: 5,
      ip_whitelist: "",
    },
    data: {
      enable_auto_backup: false,
      backup_retention_days: 30,
      log_retention_days: 7,
    },
  });
  const [saving, setSaving] = useState(false);

  // Fetch settings on mount
  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAuthApi.request("/settings");
      if (response.success) {
        setSettings(response.data);
      }
    } catch {
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await adminAuthApi.request("/settings", {
        method: "PUT",
        body: { general: settings.general },
      });
      if (response.success) {
        setMessage("General settings saved!");
      } else {
        setMessage("Failed to save general settings");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await adminAuthApi.request("/settings", {
        method: "PUT",
        body: { security: settings.security },
      });
      if (response.success) {
        setMessage("Security settings saved!");
      } else {
        setMessage("Failed to save security settings");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await adminAuthApi.request("/settings", {
        method: "PUT",
        body: { data: settings.data },
      });
      if (response.success) {
        setMessage("Data settings saved!");
      } else {
        setMessage("Failed to save data settings");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    if (!confirm("Create backup now? This may take a few moments.")) return;

    try {
      const response = await adminAuthApi.request("/settings/backup", { method: "POST" });
      if (response.success) {
        setMessage("Backup completed successfully!");
      }
    } catch {
      setMessage("Backup failed");
    }
  };

  const handleClearCache = async () => {
    if (!confirm("Clear all cache? This may affect performance.")) return;

    try {
      const response = await adminAuthApi.request("/settings/cleanup/cache", { method: "POST" });
      if (response.success) {
        setMessage("Cache cleared successfully!");
      }
    } catch {
      setMessage("Cache clearing failed");
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Clear old logs? This cannot be undone.")) return;

    try {
      const response = await adminAuthApi.request("/settings/cleanup/logs", { method: "POST" });
      if (response.success) {
        setMessage("Logs cleaned successfully!");
      }
    } catch {
      setMessage("Logs cleaning failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <a href="/admin" className="block text-gray-300 hover:text-white py-2">
                ← Back to Dashboard
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              系统设置
            </h1>

            {/* Messages */}
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.includes("saved") || message.includes("completed")
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                {message}
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "general"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  常规设置
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "security"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  安全设置
                </button>
                <button
                  onClick={() => setActiveTab("data")}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "data"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  数据管理
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading settings...</p>
              </div>
            )}

            {!loading && activeTab === "general" && (
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    常规设置
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        站点标题
                      </label>
                      <input
                        type="text"
                        id="site_title"
                        value={settings.general.site_title}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, site_title: e.target.value } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="site_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        站点描述
                      </label>
                      <textarea
                        id="site_description"
                        rows={3}
                        value={settings.general.site_description}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, site_description: e.target.value } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Logo 链接
                      </label>
                      <input
                        type="url"
                        id="logo_url"
                        value={settings.general.logo_url}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, logo_url: e.target.value } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="items_per_page" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        每页文章数量
                      </label>
                      <input
                        type="number"
                        id="items_per_page"
                        min={1}
                        max={100}
                        value={settings.general.items_per_page}
                        onChange={(e) => setSettings({ ...settings, general: { ...settings.general, items_per_page: parseInt(e.target.value) } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {saving ? "保存中..." : "保存"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {!loading && activeTab === "security" && (
              <form onSubmit={handleSaveSecurity} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    安全设置
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="session_timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Session 过期时间（分钟）
                      </label>
                      <input
                        type="number"
                        id="session_timeout"
                        min={5}
                        max={1440}
                        value={settings.security.session_timeout}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, session_timeout: parseInt(e.target.value) } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        用户会话过期时间（默认 60 分钟）
                      </p>
                    </div>

                    <div>
                      <label htmlFor="max_login_attempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        最大登录尝试次数
                      </label>
                      <input
                        type="number"
                        id="max_login_attempts"
                        min={1}
                        max={20}
                        value={settings.security.max_login_attempts}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, max_login_attempts: parseInt(e.target.value) } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="ip_whitelist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        IP 白名单（逗号分隔）
                      </label>
                      <textarea
                        id="ip_whitelist"
                        rows={2}
                        value={settings.security.ip_whitelist}
                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, ip_whitelist: e.target.value } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        留空则允许所有 IP，每行一个
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {saving ? "保存中..." : "保存"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {!loading && activeTab === "data" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    数据管理
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enable_auto_backup"
                          checked={settings.data.enable_auto_backup}
                          onChange={(e) => setSettings({ ...settings, data: { ...settings.data, enable_auto_backup: e.target.checked } })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="enable_auto_backup" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          自动备份
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="backup_retention_days" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        备份保留天数
                      </label>
                      <input
                        type="number"
                        id="backup_retention_days"
                        min={1}
                        max={365}
                        value={settings.data.backup_retention_days}
                        onChange={(e) => setSettings({ ...settings, data: { ...settings.data, backup_retention_days: parseInt(e.target.value) } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="log_retention_days" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        日志保留天数
                      </label>
                      <input
                        type="number"
                        id="log_retention_days"
                        min={1}
                        max={90}
                        value={settings.data.log_retention_days}
                        onChange={(e) => setSettings({ ...settings, data: { ...settings.data, log_retention_days: parseInt(e.target.value) } })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={handleBackup}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          立即备份
                        </button>
                        <button
                          onClick={handleClearCache}
                          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          清理缓存
                        </button>
                        <button
                          onClick={handleClearLogs}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          清理日志
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      * 备份和清理操作需要较长时间，请耐心等待
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
