// frontend/src/app/admin/news/page.tsx
/**
 * News Management Page
 *
 * 新闻源管理和监控页面
 */
"use client";

import { useEffect, useState } from "react";
import {
  Newspaper,
  RefreshCw,
  BarChart3,
  Settings,
  ExternalLink,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNewsStats, useNewsSources, useRefreshNews } from "@/hooks/use-news";
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
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;

export default function NewsManagementPage() {
  const { data: stats, isLoading: statsLoading } = useNewsStats();
  const { data: sources, isLoading: sourcesLoading } = useNewsSources();
  const { mutate: refresh, isPending: isRefreshing } = useRefreshNews();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

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

  const handleToggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
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
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            href={record.url}
            target="_blank"
            icon={<ExternalLink size={14} />}
          >
            访问
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Space>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Newspaper className="text-indigo-500" size={24} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              News Hub 管理
            </Title>
            <Text type="secondary">管理新闻源和监控爬取状态</Text>
          </div>
        </Space>
        <Space>
          <Button
            icon={<RefreshCw className={isRefreshing ? "animate-spin" : ""} />}
            onClick={handleRefresh}
            loading={isRefreshing}
            type="primary"
          >
            {isRefreshing ? "刷新中..." : "立即刷新"}
          </Button>
          <Button icon={<Settings />}>配置</Button>
        </Space>
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
    </div>
  );
}
