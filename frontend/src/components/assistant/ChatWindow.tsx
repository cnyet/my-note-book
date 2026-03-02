"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Button, Input, Card, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  conversationId?: string;
  initialMessages?: Message[];
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatWindow = ({
  conversationId,
  initialMessages = [],
  onSend,
  isLoading = false
}: ChatWindowProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');

    try {
      // Call the parent handler to send the message to the backend
      await onSend(messageToSend);
    } catch (error) {
      // If there's an error, remove the user message
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      console.error('Error sending message:', error);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      <Card
        className="flex-grow overflow-y-auto p-4 mb-4"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </Space>
      </Card>

      <form onSubmit={handleSubmit} className="mt-auto">
        <Space.Compact style={{ width: '100%' }} size="middle">
          <TextArea
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
            rows={2}
            style={{ minHeight: 40, resize: 'vertical' }}
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={isLoading}
            disabled={!inputMessage.trim() || isLoading}
            style={{ height: 'auto' }}
          >
            Send
          </Button>
        </Space.Compact>
      </form>
    </div>
  );
};