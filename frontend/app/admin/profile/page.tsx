"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthApi } from "@/lib/admin-api";

interface Token {
  id: string;
  name: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  last_used: string | null;
}

interface PasswordFormState {
  current_password: string;
  new_password: string;
  confirm_password: string;
  strength: "weak" | "medium" | "strong";
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "security" | "tokens">("info");

  // Profile info state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password change state
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    current_password: "",
    new_password: "",
    confirm_password: "",
    strength: "weak",
  });

  // Tokens state
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminAuthApi.request("/profile", {
        method: "PUT",
        body: { display_name: displayName, email },
      });
      if (response.success) {
        alert("Profile updated successfully!");
      } else {
        setError(response.error || "Update failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    if (passwordForm.strength !== "strong") {
      setError("Password is not strong enough");
      return;
    }
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await adminAuthApi.request("/profile/change-password", {
        method: "POST",
        body: {
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          confirm_password: passwordForm.confirm_password,
        },
      });
      if (response.success) {
        alert("Password changed successfully!");
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
          strength: "weak",
        });
      } else {
        setError(response.error || "Password change failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password: string): "weak" | "medium" | "strong" => {
    if (password.length < 8) return "weak";
    if (password.length < 12) return "medium";
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) return "strong";
    return "weak";
  };

  const fetchTokens = async () => {
    try {
      const response = await adminAuthApi.request<List<Token>>("/profile/tokens");
      if (response.success) {
        setTokens(response.data || []);
      }
    } catch {
      console.error("Failed to fetch tokens");
    }
  };

  const handleCreateToken = async () => {
    const name = prompt("Enter token name:");
    if (!name) return;

    try {
      const response = await adminAuthApi.request("/profile/tokens", {
        method: "POST",
        body: { name },
      });
      if (response.success) {
        setTokens([...tokens, response.data]);
        alert(`Token "${name}" created!`);
      }
    } catch {
      alert("Failed to create token");
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    if (!confirm("Are you sure you want to revoke this token?")) return;

    try {
      const response = await adminAuthApi.request(`/profile/tokens/${tokenId}`, {
        method: "DELETE",
      });
      if (response.success) {
        setTokens(tokens.filter((t) => t.id !== tokenId));
        alert("Token revoked successfully!");
      }
    } catch {
      alert("Failed to revoke token");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* TODO: Add Sidebar component */}
            <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <a href="/admin" className="block text-gray-300 hover:text-white py-2">
                ← Back to Dashboard
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              个人中心
            </h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "info"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  个人信息
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === "security"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  密码与 Token
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    个人信息
                  </h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(e); }}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          显示名称
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          邮箱
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                      >
                        {loading ? "保存中..." : "保存"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Password Change */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    修改密码
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        当前密码
                      </label>
                      <input
                        type="password"
                        id="current_password"
                        value={passwordForm.current_password}
                        onChange={(e) => {
                          setPasswordForm({ ...passwordForm, current_password: e.target.value });
                          setPasswordForm({ ...passwordForm, strength: checkPasswordStrength(e.target.value) });
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        新密码
                      </label>
                      <input
                        type="password"
                        id="new_password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        确认新密码
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordForm.strength && (
                      <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          密码强度: <span className={`font-medium ${
                            passwordForm.strength === "strong" ? "text-green-600" :
                            passwordForm.strength === "medium" ? "text-yellow-600" :
                            "text-red-600"
                          }`}>{passwordForm.strength === "strong" ? "强" : passwordForm.strength === "medium" ? "中" : "弱"}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          至少8个字符，包含大小写字母和数字
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || passwordForm.strength !== "strong"}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                      {loading ? "修改中..." : "修改密码"}
                    </button>
                  </form>
                </div>

                {/* API Tokens */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      API Tokens
                    </h2>
                    <button
                      onClick={handleCreateToken}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      + 新建 Token
                    </button>
                  </div>
                  {tokens.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">暂无 API Token</p>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Token 名称
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              创建时间
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              过期时间
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              状态
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              最后使用
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {tokens.map((token) => (
                            <tr key={token.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {token.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(token.created_at).toLocaleString("zh-CN")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(token.expires_at).toLocaleString("zh-CN")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  token.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}>
                                  {token.is_active ? "活跃" : "已过期"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {token.last_used ? new Date(token.last_used).toLocaleString("zh-CN") : "-"}
                              </td>
                              <td className="px-6 py-4 text-right text-sm">
                                <button
                                  onClick={() => handleRevokeToken(token.id)}
                                  disabled={!token.is_active}
                                  className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                                >
                                  撤销
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
