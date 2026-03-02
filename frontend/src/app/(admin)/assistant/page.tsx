'use client';

import { Card, Space, Button, Typography, Row, Col } from 'antd';
import { MessageOutlined, HistoryOutlined, SettingOutlined, RocketOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function AssistantDashboardPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <RocketOutlined /> AI Assistant
        </Title>
        <Paragraph type="secondary">
          Interact with advanced AI models for intelligent conversations and assistance.
        </Paragraph>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Link href="/admin/assistant/chat">
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button type="primary" size="large" key="start">
                    Start Chatting
                  </Button>
                ]}
              >
                <Card.Meta
                  avatar={<MessageOutlined style={{ fontSize: '24px' }} />}
                  title="Start New Conversation"
                  description="Begin a new conversation with the AI assistant using your preferred model."
                />
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={8}>
            <Link href="/admin/assistant/chat">
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button size="large" key="view">
                    View Conversations
                  </Button>
                ]}
              >
                <Card.Meta
                  avatar={<HistoryOutlined style={{ fontSize: '24px' }} />}
                  title="View Past Conversations"
                  description="Browse and continue previous conversations with the AI assistant."
                />
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={8}>
            <Link href="/admin/assistant/settings">
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button size="large" key="configure">
                    Configure
                  </Button>
                ]}
              >
                <Card.Meta
                  avatar={<SettingOutlined style={{ fontSize: '24px' }} />}
                  title="Configure Settings"
                  description="Manage your AI model preferences and assistant settings."
                />
              </Card>
            </Link>
          </Col>
        </Row>

        <Card title="About AI Assistant" style={{ marginTop: '24px' }}>
          <Paragraph>
            Our AI Assistant provides intelligent conversation capabilities powered by multiple
            state-of-the-art models including:
          </Paragraph>
          <ul>
            <li>OpenAI GPT models for advanced reasoning</li>
            <li>Anthropic Claude models for thoughtful responses</li>
            <li>Ollama models for local processing</li>
          </ul>
          <Paragraph>
            Choose the model that best fits your needs and start a conversation today.
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
}