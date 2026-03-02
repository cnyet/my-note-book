import { Space, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const TypingIndicator = () => {
  return (
    <div className="flex text-left w-full">
      <div className="self-start max-w-[85%]">
        <div className="bg-gray-50 rounded-lg p-3 shadow-sm border">
          <Space direction="horizontal" size={4}>
            <RobotOutlined />
            <Text strong className="text-gray-800">Assistant</Text>
          </Space>
          <div className="flex space-x-1 mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};