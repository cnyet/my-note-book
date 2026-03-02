// frontend/src/app/admin/agents/news/page.tsx
/**
 * News Agent Management Page
 *
 * 新闻源管理和监控页面 - News Agent 专属管理
 */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Newspaper,
  RefreshCw,
  BarChart3,
  Settings,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Power,
  Play,
  Pause,
} from "lucide-react";
import {
  useNewsStats,
  useNewsSources,
  useRefreshNews,
  useCreateNewsSource,
  useUpdateNewsSource,
  useDeleteNewsSource,
  useToggleNewsSource,
} from "@/hooks/use-news";
import type { NewsSource } from "@/hooks/use-news";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Tag,
  Typography,
  Space,
  message,
  Modal,
  Spin,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;

export default function NewsManagementPage() {
  const { data: stats, isLoading: statsLoading } = useNewsStats();
  const { data: sources, isLoading: sourcesLoading } = useNewsSources();
  const { mutate: refresh, isPending: isRefreshing } = useRefreshNews();
  const { mutate: createSource, isPending: isCreating } = useCreateNewsSource();
  const { mutate: updateSource } = useUpdateNewsSource();
  const { mutate: deleteSource } = useDeleteNewsSource();
  const { mutate: toggleSource } = useToggleNewsSource();

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null);
  const [form] = Form.useForm();

  const handleRefresh = () => {
    refresh(selectedSources.length > 0 ? selectedSources : undefined, {
      onSuccess: (data) => {
        message.success(`成功获取 ${data.added_count} 篇新文章`);
        setSelectedSources([]);
      },
      onError: () => {
        message.error("刷新失败，请重试");
      },
    });
  };

  const handleAddSource = (values: any) => {
    createSource(values, {
      onSuccess: () => {
        message.success("新闻源添加成功");
        setIsAddModalOpen(false);
        form.resetFields();
      },
      onError: () => {
        message.error("添加失败，请重试");
      },
    });
  };

  const handleEditSource = (values: any) => {
    if (!editingSource) return;
    updateSource(
      { id: editingSource.id, data: values },
      {
        onSuccess: () => {
          message.success("新闻源更新成功");
          setEditingSource(null);
          form.resetFields();
        },
        onError: () => {
          message.error("更新失败，请重试");
        },
      }
    );
  };

  const handleDeleteSource = (sourceId: string) => {
    deleteSource(sourceId, {
      onSuccess: () => {
        message.success("新闻源已删除");
      },
      onError: () => {
        message.error("删除失败，请重试");
      },
    });
  };

  const handleToggleSource = (sourceId: string, currentStatus: boolean) => {
    toggleSource(sourceId, {
      onSuccess: () => {
        message.success(currentStatus ? "新闻源已禁用" : "新闻源已启用");
      },
      onError: () => {
        message.error("操作失败，请重试");
      },
    });
  };

  const openEditModal = (source: NewsSource) => {
    setEditingSource(source);
    form.setFieldsValue({
      name: source.name,
      url: source.url,
      source_type: source.source_type,
      category: source.category,
      language: source.language,
      crawl_interval: source.crawl_interval / 3600, // 转换为小时
      is_active: source.is_active,
    });
  };

  const columns: ColumnsType<NewsSource> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: NewsSource) => (
        <Space>
          <Newspaper size={16} className="text-indigo-500" />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "类型",
      dataIndex: "source_type",
      key: "source_type",
      render: (type: string) => (
        <Tag color={type === "rss" ? "blue" : "green"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      render: (category?: string) => (
        <Tag color="default">{category || "Uncategorized"}</Tag>
      ),
    },
    {
      title: "语言",
      dataIndex: "language",
      key: "language",
      width: 80,
      render: (lang: string) => lang.toUpperCase(),
    },
    {
      title: "状态",
      dataIndex: "is_active",
      key: "is_active",
      width: 80,
      render: (active: boolean) =>
        active ? (
          <Tag color="success" icon={<CheckCircle />}>
            活跃
          </Tag>
        ) : (
          <Tag color="default">已禁用</Tag>
        ),
    },
    {
      title: "爬取间隔",
      dataIndex: "crawl_interval",
      key: "crawl_interval",
      width: 100,
      render: (interval: number) => `${(interval / 3600).toFixed(1)}小时`,
    },
    {
      title: "最后爬取",
      dataIndex: "last_crawled_at",
      key: "last_crawled_at",
      width: 150,
      render: (lastCrawled?: string) =>
        lastCrawled ? (
          <Space>
            <Clock size={14} className="text-slate-400" />
            <Text className="text-slate-500 text-xs">
              {new Date(lastCrawled).toLocaleString("zh-CN")}
            </Text>
          </Space>
        ) : (
          <Text className="text-slate-400 text-xs">从未爬取</Text>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => openEditModal(record)}
              icon={<Edit size={14} />}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => handleToggleSource(record.id, record.is_active)}
              icon={<Power size={14} />}
            >
              {record.is_active ? "禁用" : "启用"}
            </Button>
          </Space>
          <Space>
            <Button
              type="link"
              size="small"
              href={record.url}
              target="_blank"
              icon={<ExternalLink size={14} />}
            >
              访问
            </Button>
            <Popconfirm
              title="确定要删除这个新闻源吗？"
              onConfirm={() => handleDeleteSource(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<Trash2 size={14} />}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/agents"
          className="inline-flex items-center gap-2 text-[#696cff] hover:underline w-fit"
        >
          <ArrowLeft size={16} />
          返回 Agents 管理
        </Link>
        <div className="flex justify-between items-center">
          <Space>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Newspaper className="text-indigo-500" size={24} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                News Hub Agent
              </Title>
              <Text type="secondary">管理新闻源和监控爬取状态</Text>
            </div>
          </Space>
          <Space>
            <Button
              icon={<Plus />}
              onClick={() => setIsAddModalOpen(true)}
            >
              添加新闻源
            </Button>
            <Button
              icon={<RefreshCw className={isRefreshing ? "animate-spin" : ""} />}
              onClick={handleRefresh}
              loading={isRefreshing}
              type="primary"
            >
              {isRefreshing ? "刷新中..." : "立即刷新"}
            </Button>
            <Button icon={<Settings />} disabled>
              配置
            </Button>
          </Space>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Newspaper className="text-blue-500" size={20} />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  活跃新闻源
                </Text>
                <div className="text-2xl font-bold">
                  {statsLoading ? "-" : stats?.active_sources}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="text-purple-500" size={20} />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  总文章数
                </Text>
                <div className="text-2xl font-bold">
                  {statsLoading ? "-" : stats?.total_articles}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  已摘要文章
                </Text>
                <div className="text-2xl font-bold">
                  {statsLoading ? "-" : stats?.summarized_articles}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="text-orange-500" size={20} />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  最后爬取
                </Text>
                <div className="text-sm font-bold truncate max-w-[120px]">
                  {statsLoading
                    ? "-"
                    : stats?.last_crawl_time
                    ? new Date(stats.last_crawl_time).toLocaleString("zh-CN")
                    : "无记录"}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* News Sources Table */}
      <Card title={`新闻源管理 (${sources?.length || 0})`}>
        {sourcesLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={sources || []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            rowSelection={{
              selectedRowKeys: selectedSources,
              onChange: (keys) => setSelectedSources(keys as string[]),
            }}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingSource ? "编辑新闻源" : "添加新闻源"}
        open={!!editingSource || isAddModalOpen}
        onCancel={() => {
          setEditingSource(null);
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingSource ? handleEditSource : handleAddSource}
          initialValues={{
            source_type: "rss",
            language: "en",
            crawl_interval: 1,
            is_active: true,
          }}
        >
          <Form.Item
            name="name"
            label="新闻源名称"
            rules={[{ required: true, message: "请输入新闻源名称" }]}
          >
            <Input placeholder="例如：OpenAI Blog" />
          </Form.Item>

          <Form.Item
            name="url"
            label="RSS/HTTP 地址"
            rules={[
              { required: true, message: "请输入地址" },
              { type: "url", message: "请输入有效的 URL" },
            ]}
          >
            <Input placeholder="https://example.com/rss" />
          </Form.Item>

          <Form.Item
            name="source_type"
            label="来源类型"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="rss">RSS Feed</Select.Option>
              <Select.Option value="http">HTTP/HTML</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="category" label="分类">
            <Input placeholder="例如：AI, Tech, Research" />
          </Form.Item>

          <Form.Item
            name="language"
            label="语言"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="zh">中文</Select.Option>
              <Select.Option value="ja">日本語</Select.Option>
              <Select.Option value="ko">한국어</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="crawl_interval"
            label="爬取间隔（小时）"
            rules={[{ required: true }]}
          >
            <InputNumber min={0.5} max={24} step={0.5} style={{ width: "100%" }} />
          </Form.Item>

          {editingSource && (
            <Form.Item name="is_active" label="状态" valuePropName="checked">
              <Select>
                <Select.Option value={true}>活跃</Select.Option>
                <Select.Option value={false}>已禁用</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
