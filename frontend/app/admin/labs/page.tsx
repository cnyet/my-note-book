"use client";

import React, { useState, useEffect } from "react";

interface Lab {
  id: number;
  name: string;
  slug: string;
  status: "Experimental" | "Preview" | "Archived";
  description: string | null;
  demo_url: string | null;
  media_urls: string[];
  online_count: number;
  created_at: string;
  updated_at: string | null;
}

const statusConfig = {
  Experimental: {
    label: "Experimental",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  Preview: {
    label: "Preview",
    color: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  Archived: {
    label: "Archived",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    fetchLabs();
  }, [selectedStatus]);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const url = selectedStatus
        ? `http://127.0.0.1:8000/api/v1/admin/labs?status=${selectedStatus}`
        : "http://127.0.0.1:8000/api/v1/admin/labs";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch labs");

      const data = await response.json();
      setLabs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading labs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchLabs}
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
          <h1 className="text-2xl font-bold text-gray-900">Labs Management</h1>
          <p className="text-gray-500 mt-1">Manage experimental features and demos ({labs.length} labs)</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          + Add Lab
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStatus("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === ""
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Labs
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

      {/* Labs List */}
      <div className="space-y-4">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{lab.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      statusConfig[lab.status]?.color ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        statusConfig[lab.status]?.dot || "bg-gray-400"
                      }`}
                    />
                    {lab.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 max-w-2xl">
                  {lab.description || "No description"}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>🧪</span>
                    <span className="font-mono text-xs">/{lab.slug}</span>
                  </div>

                  {lab.online_count > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>{lab.online_count} online</span>
                    </div>
                  )}

                  {lab.demo_url && (
                    <a
                      href={lab.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Demo →
                    </a>
                  )}

                  {lab.media_urls.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span>📷</span>
                      <span>{lab.media_urls.length} media</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Edit
                </button>
                <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {labs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No labs found</p>
          <p className="text-sm">Try adjusting the filter or add a new lab</p>
        </div>
      )}
    </div>
  );
}
