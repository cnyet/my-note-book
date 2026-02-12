"use client";

import React, { useState, useEffect } from "react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-amber-100 text-amber-800" },
  published: { label: "Published", color: "bg-green-100 text-green-800" },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600" },
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [selectedStatus]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = "http://127.0.0.1:8000/api/v1/admin/blog";
      const params = new URLSearchParams();
      if (selectedStatus) params.append("status", selectedStatus);
      if (search) params.append("search", search);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/admin/blog/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch {
      // Ignore tags fetch error
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleStatusChange = async (postId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/admin/blog/${postId}/status?status=${newStatus}`,
        { method: "PATCH" }
      );
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("zh-CN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchPosts}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 mt-1">Manage blog posts ({posts.length} posts)</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          + New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedStatus("")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === ""
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {Object.keys(statusConfig).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {statusConfig[status as keyof typeof statusConfig].label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-gray-500 py-1">Tags:</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {post.cover_image ? (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        📝
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500">/{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      statusConfig[post.status]?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusConfig[post.status]?.label || post.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(post.published_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {post.status === "draft" && (
                      <button
                        onClick={() => handleStatusChange(post.id, "published")}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100"
                      >
                        Publish
                      </button>
                    )}
                    {post.status === "published" && (
                      <button
                        onClick={() => handleStatusChange(post.id, "draft")}
                        className="px-3 py-1 bg-amber-50 text-amber-600 rounded text-sm hover:bg-amber-100"
                      >
                        Unpublish
                      </button>
                    )}
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-lg mb-2">No posts found</p>
          <p className="text-sm">Try adjusting the filters or create a new post</p>
        </div>
      )}
    </div>
  );
}
