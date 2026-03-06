'use client';

import { useState, useEffect, Suspense } from 'react';
import { Layout, Row, Col, Divider, Space, Alert, Button, Popover, Badge } from 'antd';
import { ConversationList } from '@/components/assistant/ConversationList';
import { ChatWindow } from '@/components/assistant/ChatWindow';
import { ModelSelector } from '@/components/assistant/ModelSelector';
import { MessageOutlined, ApiOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Header, Sider, Content } = Layout;

// Mock API functions
const mockApi = {
  createConversation: async (model: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return `conv_${Date.now()}`;
  },

  getConversation: async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      title: `Conversation ${id}`,
      model: 'gpt-4o',
      messages: []
    };
  },

  sendMessage: async (conversationId: string, message: string, model: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    // Return a mock response
    return `This is a mock response to your message: "${message}". Using model: ${model}.`;
  },

  deleteConversation: async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  },

  getModels: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      { name: 'gpt-4o', provider: 'openai', capabilities: ['chat', 'reasoning'] },
      { name: 'claude-3-5-sonnet-20241022', provider: 'anthropic', capabilities: ['chat', 'reasoning', 'long-context'] },
      { name: 'deepseek-r1', provider: 'ollama', capabilities: ['chat', 'local-processing'] }
    ];
  }
};

function AssistantChatPageContent() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const conversationIdFromUrl = searchParams?.get('conversation');

  useEffect(() => {
    loadModels();
    if (conversationIdFromUrl) {
      loadConversation(conversationIdFromUrl);
    } else {
      // Start with a blank slate or create a new conversation
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [conversationIdFromUrl]);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      const models = await mockApi.getModels();
      setAvailableModels(models);
      if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0].name);
      }
    } catch (err) {
      setError('Failed to load available models');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const conv = await mockApi.getConversation(id);
      setCurrentConversation(conv);
      // For demo purposes, add a sample message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm your AI assistant. This is conversation ${id}. How can I help you today?`,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      setError('Failed to load conversation');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newId = await mockApi.createConversation(selectedModel);

      // Create new conversation object
      const newConversation = {
        id: newId,
        title: `New Chat ${newId.slice(-6)}`,
        model: selectedModel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);

      // Update URL
      router.push(`/admin/assistant/chat?conversation=${newId}`);

      return newId;
    } catch (err) {
      setError('Failed to create conversation');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const conv = await mockApi.getConversation(id);
      setCurrentConversation(conv);

      // Update URL
      router.push(`/admin/assistant/chat?conversation=${id}`);
    } catch (err) {
      setError('Failed to load conversation');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await mockApi.deleteConversation(id);

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== id));

      // If this was the current conversation, clear it
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
        router.push('/admin/assistant/chat'); // Go back to a default view
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      if (!currentConversation) {
        // If no current conversation, create one first
        const newId = await handleCreateConversation();
        if (!newId) throw new Error('Could not create conversation');
      }

      // The ChatWindow component will add the user message to the state
      // Here we just need to send it to the backend and get the response

      if (!currentConversation) throw new Error('No conversation to send message to');

      const response = await mockApi.sendMessage(
        currentConversation.id,
        message,
        selectedModel
      );

      // Add the AI response to the messages
      setMessages(prev => [
        ...prev,
        {
          id: `resp_${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // Update current conversation's model if there is one
    if (currentConversation) {
      setCurrentConversation((prev: any) => ({ ...prev, model }));
    }
  };

  return (
    <Layout style={{ height: '100vh', backgroundColor: 'white' }}>
      <Sider width={320} theme="light" className="border-r">
        <ConversationList
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          currentConversationId={currentConversation?.id}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: '16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space size="middle">
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <MessageOutlined />
                  <span className="ml-2">
                    {currentConversation?.title || 'AI Assistant'}
                  </span>
                </h2>
                {currentConversation && (
                  <Badge.Ribbon text={currentConversation.model} color="blue">
                    <div style={{ width: 200 }}>
                      <ModelSelector
                        selectedModel={selectedModel}
                        onModelChange={handleModelChange}
                        availableModels={availableModels}
                        isLoading={isLoading}
                      />
                    </div>
                  </Badge.Ribbon>
                )}
              </Space>
            </Col>
            <Col>
              <Popover
                content="AI Assistant powered by multiple models"
                title="Assistant Status"
              >
                <Button
                  icon={<ApiOutlined />}
                  disabled
                  style={{ borderColor: '#52c41a', color: '#52c41a' }}
                >
                  Connected
                </Button>
              </Popover>
            </Col>
          </Row>
        </Header>

        <Content style={{ padding: '24px', overflow: 'hidden' }}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              closable
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}

          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {currentConversation ? (
              <ChatWindow
                conversationId={currentConversation?.id}
                initialMessages={messages}
                onSend={handleSendMessage}
                isLoading={isLoading}
              />
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: '#888'
              }}>
                <MessageOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <h3>Select or create a conversation to start chatting</h3>
                <p>Choose an existing conversation from the sidebar or create a new one.</p>

                <Button
                  type="primary"
                  size="large"
                  className="mt-4"
                  onClick={handleCreateConversation}
                  loading={isLoading}
                >
                  Create New Conversation
                </Button>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
// Wrap with Suspense for useSearchParams
function AssistantChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssistantChatPageContent />
    </Suspense>
  );
}

export default AssistantChatPage;
