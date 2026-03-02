'use client';

import { useState, useEffect } from 'react';
import { List, Button, Modal, Space, Typography, Dropdown, MenuProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface Conversation {
  id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => Promise<string>;
  onDeleteConversation: (id: string) => Promise<void>;
  currentConversationId?: string;
}

export const ConversationList = ({
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  currentConversationId
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from an API
      // For now, we'll simulate with mock data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'Project Discussion',
          model: 'gpt-4o',
          created_at: '2026-03-01T10:00:00Z',
          updated_at: '2026-03-02T15:30:00Z'
        },
        {
          id: '2',
          title: 'Research Summary',
          model: 'claude-3-5-sonnet-20241022',
          created_at: '2026-02-28T09:15:00Z',
          updated_at: '2026-03-01T11:20:00Z'
        },
        {
          id: '3',
          title: 'Code Review Help',
          model: 'deepseek-r1',
          created_at: '2026-02-27T14:30:00Z',
          updated_at: '2026-02-28T16:45:00Z'
        }
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const newId = await onCreateConversation();
      onSelectConversation(newId);
      router.push(`/admin/assistant/chat?conversation=${newId}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteConversation(id);
      setConversations(conversations.filter(conv => conv.id !== id));
      if (currentConversationId === id) {
        // If deleting the current conversation, go back to conversation list
        router.push('/admin/assistant');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setConfirmModalVisible(false);
      setConversationToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setConversationToDelete(id);
    setConfirmModalVisible(true);
  };

  const menuItems = (id: string): MenuProps['items'] => [
    {
      key: 'delete',
      label: 'Delete Conversation',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: () => confirmDelete(id)
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Space size="middle" className="w-full justify-between">
          <Title level={4} className="m-0">Conversations</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            loading={loading}
          >
            New Chat
          </Button>
        </Space>
      </div>

      <List
        className="flex-grow overflow-y-auto"
        loading={loading}
        dataSource={conversations}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            onClick={() => onSelectConversation(item.id)}
            className={`cursor-pointer ${
              currentConversationId === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <List.Item.Meta
              title={
                <div className="flex justify-between items-start">
                  <Text strong ellipsis={{ tooltip: item.title }}>
                    {item.title || `Conversation ${item.id.substring(0, 8)}`}
                  </Text>
                  <Dropdown
                    menu={{ items: menuItems(item.id) }}
                    trigger={['click']}
                  >
                    <Button
                      type="text"
                      icon={<EllipsisOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
              }
              description={
                <div className="text-xs text-gray-500">
                  <div>Model: {item.model}</div>
                  <div>
                    Updated: {dayjs(item.updated_at).format('MMM D, YYYY HH:mm')}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Confirm Deletion"
        open={confirmModalVisible}
        onCancel={() => {
          setConfirmModalVisible(false);
          setConversationToDelete(null);
        }}
        onOk={() => {
          if (conversationToDelete) {
            handleDelete(conversationToDelete);
          }
        }}
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this conversation?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};