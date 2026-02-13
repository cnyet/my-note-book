"use client";

import React, { useState, useEffect } from "react";

interface Tool {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  icon_url: string | null;
  link: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

const categories = ["Dev", "Auto", "Intel", "Creative"];
const categoryColors: Record<string, string> = {
  Dev: "bg-blue-100 text-blue-800",
  Auto: "bg-green-100 text-green-800",
  Intel: "bg-purple-100 text-purple-800",
  Creative: "bg-pink-100 text-pink-800",
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    fetchTools();
  }, [selectedCategory]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `http://127.0.0.1:8000/api/v1/admin/tools?category=${selectedCategory}`
        : "http://127.0.0.1:8000/api/v1/admin/tools";
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tools");
      
      const data = await response.json();
      setTools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tools...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchTools}
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
          <h1 className="text-2xl font-bold text-gray-900">Tools Management</h1>
          <p className="text-gray-500 mt-1">
            Manage tools library ({tools.length} tools)
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Add Tool
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === ""
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                  🔧
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      categoryColors[tool.category] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {tool.category}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tool.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tool.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {tool.description || "No description"}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Order: {tool.sort_order}</span>
              <span className="font-mono text-xs">/{tool.slug}</span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No tools found</p>
          <p className="text-sm">Try adjusting the filter or add a new tool</p>
        </div>
      )}
    </div>
  );
}
