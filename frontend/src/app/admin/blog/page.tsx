"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, message, Modal, Select, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { exportToCSV } from "@/lib/table-utils";
import { TableToolbar } from "@/components/admin/shared/TableToolbar";
import { motion } from "framer-motion";

type SorterType<T> = {
  column?: ColumnsType<T>[number];
  field?: keyof T | string;
  order?: "ascend" | "descend" | null;
};
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

import { BLOG_CONSTANTS } from "./constants";
import { blogApi, type BlogPost as ApiBlogPost } from "@/lib/admin-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// 前端 BlogPost 类型（与 API 类型兼容）
type BlogPost = ApiBlogPost;

type StatusFilter = "all" | "draft" | "published";
type SortField = "date" | "title";
type SortOrder = "asc" | "desc";

/** 统计卡片组件 - Duralux Style */
function StatWidget({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark transition-all duration-200 hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark hover:-translate-y-0.5 overflow-hidden"
      styles={{ body: { padding: "1.25rem" } }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-duralux-text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon className={color} size={20} />
        </div>
      </div>
    </Card>
  );
}

/** 骨架屏统计卡片 */
function SkeletonStatCard() {
  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark overflow-hidden"
      styles={{ body: { padding: "1.25rem" } }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-20 h-3 skeleton" />
          <div className="w-24 h-6 skeleton" />
        </div>
        <div className="w-12 h-12 rounded-xl skeleton" />
      </div>
    </Card>
  );
}

export default function BlogListPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: BLOG_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE as number,
  });
  const [density, setDensity] = useState<"compact" | "normal" | "spacious">("normal");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    title: true,
    author: true,
    published_at: true,
    views: true,
    status: true,
    actions: true,
  });

  // Load posts from API using React Query
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const response = await blogApi.list();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
  });

  const posts = postsData || [];
  const loading = isLoading;

  // Memoized filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt || "").toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "date") {
        comparison =
          new Date(a.published_at || a.created_at || 0).getTime() - new Date(b.published_at || b.created_at || 0).getTime();
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [posts, statusFilter, searchQuery, sortField, sortOrder]);

  // Memoized paginated posts
  const paginatedPosts = useMemo(() => {
    return filteredPosts.slice(
      (pagination.current - 1) * pagination.pageSize,
      pagination.current * pagination.pageSize
    );
  }, [filteredPosts, pagination]);

  // Memoized stats calculations
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    totalViews: posts
      .filter((p) => p.status === "published")
      .reduce((sum, p) => sum + (p.views || 0), 0),
  }), [posts]);

  // Handlers
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Delete Blog Post",
      content: "Are you sure you want to delete this blog post? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await blogApi.delete(id);
          queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
          toast.success("Blog post deleted successfully");
        } catch (error) {
          console.error("Failed to delete blog post:", error);
          toast.error("Failed to delete blog post");
        }
      },
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: "Delete Blog Posts",
      content: `Are you sure you want to delete ${selectedRowKeys.length} blog post(s)? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map(id => blogApi.delete(id as number)));
          queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
          setSelectedRowKeys([]);
          toast.success(`${selectedRowKeys.length} blog post(s) deleted successfully`);
        } catch (error) {
          console.error("Failed to delete blog posts:", error);
          toast.error("Failed to delete blog posts");
        }
      },
    });
  };

  const handleBatchPublish = () => {
    const draftCount = selectedRowKeys.filter(
      (key) => posts.find((p) => p.id === key)?.status === "draft"
    ).length;

    if (draftCount === 0) {
      message.info("No draft posts selected to publish");
      return;
    }

    Modal.confirm({
      title: "Publish Blog Posts",
      content: `Are you sure you want to publish ${draftCount} draft post(s)?`,
      okText: "Publish",
      okType: "primary",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys
              .filter((key) => posts.find((p) => p.id === key)?.status === "draft")
              .map(id => blogApi.togglePublish(id as number))
          );
          queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
          setSelectedRowKeys([]);
          toast.success(`${draftCount} post(s) published successfully`);
        } catch (error) {
          console.error("Failed to publish posts:", error);
          toast.error("Failed to publish posts");
        }
      },
    });
  };

  const handleStatusToggle = async (id: number) => {
    try {
      await blogApi.togglePublish(id);
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Post status updated successfully");
    } catch (error) {
      console.error("Failed to toggle post status:", error);
      toast.error("Failed to update post status");
    }
  };

  const handleStatusKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStatusToggle(id);
    }
  };

  const handleExport = () => {
    const columns = ["title", "author", "published_at", "status"];
    exportToCSV(paginatedPosts as unknown as Record<string, unknown>[], columns, "blog_posts");
    toast.success("Blog posts exported successfully");
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible,
    }));
  };

  // Table columns - Duralux Style
  const columns: ColumnsType<BlogPost> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (title: string, record: BlogPost) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium text-duralux-text-primary dark:text-duralux-text-dark-primary">
            {title}
          </span>
          <span className="text-xs text-duralux-text-muted">
            {record.excerpt}
          </span>
        </Space>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.AUTHOR,
      render: (author: string) => (
        <span className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary">{author}</span>
      ),
    },
    {
      title: "Publish Date",
      dataIndex: "published_at",
      key: "published_at",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.PUBLISH_DATE,
      sorter: true,
      render: (date: string) => (
        <span className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.VIEWS,
      render: (views: number, record: BlogPost) =>
        record.status === "published" ? (
          <span className="text-duralux-text-secondary dark:text-duralux-text-dark-secondary">
            {views?.toLocaleString() || 0}
          </span>
        ) : (
          <span className="text-duralux-text-muted">-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.STATUS,
      render: (status: string, record: BlogPost) => (
        <Tag
          className="cursor-pointer !rounded-full text-xs font-medium px-3 py-0.5 border-0"
          role="button"
          tabIndex={0}
          color={status === "published" ? "success" : "default"}
          onClick={() => handleStatusToggle(record.id)}
          onKeyPress={(e) => handleStatusKeyPress(e, record.id)}
          aria-label={`Toggle status for ${record.title}, currently ${status}`}
          style={{
            backgroundColor: status === "published"
              ? "var(--duralux-success-transparent)"
              : "var(--duralux-bg-page)",
            color: status === "published"
              ? "var(--duralux-success)"
              : "var(--duralux-text-muted)",
          }}
        >
          {status === "published" ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.ACTIONS,
      render: (_: unknown, record: BlogPost) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-duralux-text-secondary hover:text-duralux-primary transition-colors"
              onClick={() => toast.info(`View post: ${record.title}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-duralux-text-secondary hover:text-duralux-primary transition-colors"
              onClick={() => router.push(`/admin/blog/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-duralux-text-secondary hover:text-duralux-danger transition-colors"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const onTableChange = (
    pagination: TablePaginationConfig,
    _filters: unknown,
    sorter: SorterType<BlogPost> | SorterType<BlogPost>[]
  ) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: (pagination.pageSize as number) || 10,
    });

    if (sorter && !Array.isArray(sorter) && typeof sorter === "object" && "field" in sorter) {
      const field = sorter.field as SortField;
      const order =
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
            ? "desc"
            : "asc";
      if (field) {
        setSortField(field);
        setSortOrder(order);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header - Duralux Style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary m-0">
            Blog Management
          </h1>
          <p className="text-sm text-duralux-text-muted mt-1">
            Manage your blog posts, drafts, and publications
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-gradient-to-r from-duralux-primary to-duralux-primary-dark hover:from-duralux-primary-dark hover:to-duralux-primary text-white border-none h-10 px-6 rounded-xl shadow-lg shadow-duralux-primary/30 transition-all duration-200"
          onClick={() => router.push("/admin/blog/new")}
        >
          New Post
        </Button>
      </div>

      {/* Stats Cards - Duralux Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))
        ) : (
          <>
            <StatWidget
              title="Total Posts"
              value={stats.total}
              icon={FileTextOutlined}
              color="text-duralux-primary"
              bgColor="bg-duralux-primary-transparent"
            />
            <StatWidget
              title="Published"
              value={stats.published}
              icon={FileTextOutlined}
              color="text-duralux-success"
              bgColor="bg-duralux-success-transparent"
            />
            <StatWidget
              title="Drafts"
              value={stats.drafts}
              icon={FileTextOutlined}
              color="text-duralux-warning"
              bgColor="bg-duralux-warning-transparent"
            />
            <StatWidget
              title="Total Views"
              value={stats.totalViews.toLocaleString()}
              icon={EyeOutlined}
              color="text-duralux-info"
              bgColor="bg-duralux-info-transparent"
            />
          </>
        )}
      </div>

      {/* Filters and Actions - Duralux Style */}
      <Card
        className="sneat-card-shadow mb-4 rounded-xl"
        styles={{ body: { padding: "1.25rem" } }}
      >
        <div className="flex flex-col gap-4">
          {/* Table Toolbar */}
          <TableToolbar
            showDensity
            showColumnToggle
            showExport
            density={density}
            onDensityChange={setDensity}
            columns={[
              { key: "title", title: "Title", visible: visibleColumns.title },
              { key: "author", title: "Author", visible: visibleColumns.author },
              { key: "published_at", title: "Publish Date", visible: visibleColumns.published_at },
              { key: "views", title: "Views", visible: visibleColumns.views },
              { key: "status", title: "Status", visible: visibleColumns.status },
              { key: "actions", title: "Actions", visible: visibleColumns.actions },
            ]}
            onColumnToggle={handleColumnToggle}
            exportFilename="blog_posts"
            exportData={paginatedPosts.map(post => ({
              title: post.title,
              author: post.author,
              published_at: post.published_at,
              status: post.status,
              views: post.views || 0,
            }))}
            exportColumns={["title", "author", "published_at", "status", "views"]}
          />

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <Input
              placeholder="Search posts..."
              prefix={<SearchOutlined className="text-duralux-text-muted" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs rounded-xl"
              allowClear
            />

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40 rounded-xl"
              options={[
                { label: "All Posts", value: "all" },
                { label: "Published", value: "published" },
                { label: "Drafts", value: "draft" },
              ]}
              styles={{
              }}
            />

            {/* Sort */}
            <Select
              value={`${sortField}-${sortOrder}`}
              onChange={(value) => {
                const [field, order] = value.split("-");
                setSortField(field as SortField);
                setSortOrder(order as SortOrder);
              }}
              className="w-40 rounded-xl"
              options={[
                { label: "Newest First", value: "date-desc" },
                { label: "Oldest First", value: "date-asc" },
                { label: "Title A-Z", value: "title-asc" },
                { label: "Title Z-A", value: "title-desc" },
              ]}
              styles={{
              }}
            />

            <div className="flex-1" />

            {/* Batch Actions */}
            {selectedRowKeys.length > 0 && (
              <Space>
                <span className="text-sm text-duralux-text-secondary">
                  {selectedRowKeys.length} selected
                </span>
                <Button
                  icon={<ThunderboltOutlined />}
                  className="text-duralux-success border-duralux-success hover:bg-duralux-success hover:text-white rounded-xl transition-all"
                  onClick={handleBatchPublish}
                >
                  Publish
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  className="text-duralux-danger border-duralux-danger hover:bg-duralux-danger hover:text-white rounded-xl transition-all"
                  onClick={handleBatchDelete}
                >
                  Delete
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Card>

      {/* Table - Duralux Style */}
      <Card
        className="rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark"
        styles={{ body: { padding: "0" } }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns.filter(col => {
            const key = col.key as string;
            return visibleColumns[key] !== false;
          })}
          dataSource={paginatedPosts}
          rowKey="id"
          pagination={{
            ...pagination,
            total: filteredPosts.length,
            showSizeChanger: true,
            pageSizeOptions: [...BLOG_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS],
            showTotal: (total: number) => `Total ${total} posts`,
            className: "text-duralux-text-secondary",
          } as Record<string, unknown>}
          onChange={onTableChange as unknown as (pagination: TablePaginationConfig, filters: unknown, sorter: unknown) => void}
          className="duralux-table"
          scroll={{ x: BLOG_CONSTANTS.TABLE_SCROLL_X }}
          size={density === "compact" ? "small" : density === "spacious" ? "large" : "middle"}
        />
      </Card>

      {/* Custom Styles for Table */}
      <style jsx global>{`
        .duralux-table .ant-table {
          background: transparent !important;
        }
        .duralux-table .ant-table-thead > tr > th {
          background: ${isDark ? "#2b2c40" : "#f8f7fa"} !important;
          border-bottom: 1px solid ${isDark ? "#444564" : "#eceef1"} !important;
          color: ${isDark ? "#a3b1c2" : "#566a7f"} !important;
          font-weight: 600;
          padding: ${density === "compact" ? "0.5rem 0.75rem" : density === "spacious" ? "1.5rem 1.25rem" : "1rem 1rem"} !important;
        }
        .duralux-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${isDark ? "#444564" : "#eceef1"} !important;
          color: ${isDark ? "#a3b1c2" : "#697a8d"} !important;
          padding: ${density === "compact" ? "0.5rem 0.75rem" : density === "spacious" ? "1.5rem 1.25rem" : "1rem 1rem"} !important;
        }
        .duralux-table .ant-table-tbody > tr:hover > td {
          background: ${isDark ? "#323249" : "#f8f7fa"} !important;
        }
        .duralux-table .ant-table-wrapper {
          background: transparent !important;
        }
        .duralux-table .ant-pagination-item-active {
          background: #696cff !important;
          border-color: #696cff !important;
        }
        .duralux-table .ant-pagination-item-active a {
          color: white !important;
        }
        .duralux-table .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #696cff !important;
          border-color: #696cff !important;
        }
        .duralux-table .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .duralux-table .ant-checkbox:hover .ant-checkbox-inner {
          border-color: #696cff !important;
        }
      `}</style>
    </motion.div>
  );
}
