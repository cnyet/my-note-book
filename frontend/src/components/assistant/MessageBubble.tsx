import { Card, Typography, Space } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export const MessageBubble = ({ role, content, timestamp }: MessageBubbleProps) => {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  const bgColor = isUser
    ? 'bg-blue-50'
    : isAssistant
      ? 'bg-gray-50'
      : 'bg-yellow-50';

  const textColor = isUser ? 'text-blue-800' : isAssistant ? 'text-gray-800' : 'text-yellow-800';
  const textAlign = isUser ? 'text-right' : 'text-left';
  const alignSelf = isUser ? 'self-end' : 'self-start';

  const icon = isUser ? <UserOutlined /> : <RobotOutlined />;
  const roleName = isUser ? 'You' : isAssistant ? 'Assistant' : 'System';

  return (
    <div className={`flex ${textAlign} w-full`}>
      <div className={`${alignSelf} max-w-[85%] w-fit`}>
        <Card
          className={`${bgColor} rounded-lg shadow-sm border`}
          size="small"
        >
          <Space direction="vertical" size={2} className="w-full">
            <div className="flex items-center gap-2">
              <span>{icon}</span>
              <Text strong className={textColor}>{roleName}</Text>
              {timestamp && (
                <Text type="secondary" className="text-xs">
                  {dayjs(timestamp).format('HH:mm')}
                </Text>
              )}
            </div>
            <Text className={textColor}>{content}</Text>
          </Space>
        </Card>
      </div>
    </div>
  );
};