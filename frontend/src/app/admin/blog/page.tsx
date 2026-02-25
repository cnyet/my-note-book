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

type SorterType<T> = {
  column?: ColumnsType<T>[number];
  field?: keyof T | string;
  order?: "ascend" | "descend" | null;
};
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { BLOG_CONSTANTS } from "./constants";
import { BlogPost, mockBlogPosts } from "./mock-data";

type StatusFilter = "all" | "draft" | "published";
type SortField = "date" | "title";
type SortOrder = "asc" | "desc";

export default function BlogListPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  // State
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: BLOG_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
  });

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
          post.summary.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "date") {
        comparison =
          new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
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
      onOk() {
        return new Promise<void>((resolve) => {
          setPosts(posts.filter((post) => post.id !== id));
          toast.success("Blog post deleted successfully");
          resolve();
        });
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
      onOk() {
        return new Promise<void>((resolve) => {
          setPosts(posts.filter((post) => !selectedRowKeys.includes(post.id)));
          setSelectedRowKeys([]);
          toast.success(`${selectedRowKeys.length} blog post(s) deleted successfully`);
          resolve();
        });
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
      onOk() {
        return new Promise<void>((resolve) => {
          setPosts(
            posts.map((post) =>
              selectedRowKeys.includes(post.id) && post.status === "draft"
                ? { ...post, status: "published" as const }
                : post
            )
          );
          setSelectedRowKeys([]);
          toast.success(`${draftCount} post(s) published successfully`);
          resolve();
        });
      },
    });
  };

  const handleStatusToggle = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              status: post.status === "draft" ? "published" : "draft",
            }
          : post
      )
    );
    toast.success("Post status updated successfully");
  };

  const handleStatusKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStatusToggle(id);
    }
  };

  // Table columns
  const columns: ColumnsType<BlogPost> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (title: string, record: BlogPost) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium text-[#566a7f] dark:text-[#a3b1c2]">
            {title}
          </span>
          <span className="text-xs text-[#a1acb8] dark:text-[#696c80]">
            {record.summary}
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
        <span className="text-[#697a8d] dark:text-[#a3b1c2]">{author}</span>
      ),
    },
    {
      title: "Publish Date",
      dataIndex: "publishDate",
      key: "publishDate",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.PUBLISH_DATE,
      sorter: true,
      render: (date: string) => (
        <span className="text-[#697a8d] dark:text-[#a3b1c2]">
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
          <span className="text-[#697a8d] dark:text-[#a3b1c2]">
            {views?.toLocaleString() || 0}
          </span>
        ) : (
          <span className="text-[#a1acb8]">-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: BLOG_CONSTANTS.COLUMN_WIDTHS.STATUS,
      render: (status: string, record: BlogPost) => (
        <Tag
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          color={status === "published" ? "success" : "default"}
          onClick={() => handleStatusToggle(record.id)}
          onKeyPress={(e) => handleStatusKeyPress(e, record.id)}
          aria-label={`Toggle status for ${record.title}, currently ${status}`}
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
              className="text-[#697a8d] hover:text-[#696cff]"
              onClick={() => toast.info(`View post: ${record.title}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-[#697a8d] hover:text-[#696cff]"
              onClick={() => router.push(`/admin/blog/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-[#697a8d] hover:text-[#ff3e1d]"
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
      pageSize: pagination.pageSize || 10,
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
    <div className="animate-in fade-in-50 duration-500 p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-bold text-[#566a7f] dark:text-[#a3b1c2]">
            Blog Management
          </h1>
          <p className="text-sm text-[#a1acb8] mt-1">
            Manage your blog posts, drafts, and publications
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#696cff] hover:bg-[#5f61e6] text-white border-none h-10 px-6"
          onClick={() => router.push("/admin/blog/new")}
        >
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="sneat-card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a1acb8] mb-1">Total Posts</p>
              <p className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#696cff]/10 flex items-center justify-center">
              <FileTextOutlined className="text-[#696cff] text-xl" />
            </div>
          </div>
        </Card>
        <Card className="sneat-card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a1acb8] mb-1">Published</p>
              <p className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
                {stats.published}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#71dd37]/10 flex items-center justify-center">
              <FileTextOutlined className="text-[#71dd37] text-xl" />
            </div>
          </div>
        </Card>
        <Card className="sneat-card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a1acb8] mb-1">Drafts</p>
              <p className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
                {stats.drafts}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#ffab00]/10 flex items-center justify-center">
              <FileTextOutlined className="text-[#ffab00] text-xl" />
            </div>
          </div>
        </Card>
        <Card className="sneat-card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a1acb8] mb-1">Total Views</p>
              <p className="text-2xl font-bold text-[#566a7f] dark:text-[#a3b1c2]">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#03c3ec]/10 flex items-center justify-center">
              <EyeOutlined className="text-[#03c3ec] text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="sneat-card-shadow mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <Input
            placeholder="Search posts..."
            prefix={<SearchOutlined className="text-[#a1acb8]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            allowClear
          />

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-40"
            options={[
              { label: "All Posts", value: "all" },
              { label: "Published", value: "published" },
              { label: "Drafts", value: "draft" },
            ]}
          />

          {/* Sort */}
          <Select
            value={`${sortField}-${sortOrder}`}
            onChange={(value) => {
              const [field, order] = value.split("-");
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="w-40"
            options={[
              { label: "Newest First", value: "date-desc" },
              { label: "Oldest First", value: "date-asc" },
              { label: "Title A-Z", value: "title-asc" },
              { label: "Title Z-A", value: "title-desc" },
            ]}
          />

          <div className="flex-1" />

          {/* Batch Actions */}
          {selectedRowKeys.length > 0 && (
            <Space>
              <span className="text-sm text-[#697a8d]">
                {selectedRowKeys.length} selected
              </span>
              <Button
                icon={<ThunderboltOutlined />}
                className="text-[#71dd37] border-[#71dd37] hover:bg-[#71dd37] hover:text-white"
                onClick={handleBatchPublish}
              >
                Publish
              </Button>
              <Button
                icon={<DeleteOutlined />}
                className="text-[#ff3e1d] border-[#ff3e1d] hover:bg-[#ff3e1d] hover:text-white"
                onClick={handleBatchDelete}
              >
                Delete
              </Button>
            </Space>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="sneat-card-shadow">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={paginatedPosts}
          rowKey="id"
          pagination={{
            ...pagination,
            total: filteredPosts.length,
            showSizeChanger: true,
            pageSizeOptions: [...BLOG_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS],
            showTotal: (total: number) => `Total ${total} posts`,
            className: "text-[#697a8d]",
          } as Record<string, unknown>}
          onChange={onTableChange as unknown as (pagination: TablePaginationConfig, filters: unknown, sorter: unknown) => void}
          className="blog-table"
          scroll={{ x: BLOG_CONSTANTS.TABLE_SCROLL_X }}
        />
      </Card>

      {/* Custom Styles for Table */}
      <style jsx global>{`
        .blog-table .ant-table {
          background: transparent !important;
        }
        .blog-table .ant-table-thead > tr > th {
          background: ${isDark ? "#2b2c40" : "#f8f7fa"} !important;
          border-bottom: 1px solid ${isDark ? "#444564" : "#eceef1"} !important;
          color: ${isDark ? "#a3b1c2" : "#566a7f"} !important;
          font-weight: 600;
          padding: 1rem 1rem !important;
        }
        .blog-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${isDark ? "#444564" : "#eceef1"} !important;
          color: ${isDark ? "#a3b1c2" : "#697a8d"} !important;
          padding: 1rem 1rem !important;
        }
        .blog-table .ant-table-tbody > tr:hover > td {
          background: ${isDark ? "#323249" : "#f8f7fa"} !important;
        }
        .blog-table .ant-table-wrapper {
          background: transparent !important;
        }
        .blog-table .ant-pagination-item-active {
          background: #696cff !important;
          border-color: #696cff !important;
        }
        .blog-table .ant-pagination-item-active a {
          color: white !important;
        }
        .blog-table .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #696cff !important;
          border-color: #696cff !important;
        }
        .blog-table .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .blog-table .ant-checkbox:hover .ant-checkbox-inner {
          border-color: #696cff !important;
        }
      `}</style>
    </div>
  );
}
