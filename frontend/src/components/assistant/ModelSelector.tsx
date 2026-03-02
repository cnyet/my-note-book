'use client';

import { useState, useEffect } from 'react';
import { Select, Tag, Space, Spin, Alert } from 'antd';
import { CheckCircleOutlined, WarningOutlined, SyncOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ModelOption {
  name: string;
  provider: string;
  capabilities: string[];
}

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange: (model: string) => void;
  availableModels?: ModelOption[];
  isLoading?: boolean;
}

export const ModelSelector = ({
  selectedModel,
  onModelChange,
  availableModels = [
    { name: 'gpt-4o', provider: 'openai', capabilities: ['chat', 'reasoning'] },
    { name: 'claude-3-5-sonnet-20241022', provider: 'anthropic', capabilities: ['chat', 'reasoning', 'long-context'] },
    { name: 'deepseek-r1', provider: 'ollama', capabilities: ['chat', 'local-processing'] }
  ],
  isLoading = false
}: ModelSelectorProps) => {
  const [modelStatus, setModelStatus] = useState<Record<string, 'loading' | 'available' | 'error'>>({});

  // Simulate checking model availability
  useEffect(() => {
    const checkModelAvailability = async () => {
      // Initialize all models as loading
      const initialStatus = availableModels.reduce((acc, model) => {
        acc[model.name] = 'loading';
        return acc;
      }, {} as Record<string, 'loading' | 'available' | 'error'>);

      setModelStatus(initialStatus);

      // Simulate API calls to check availability
      for (const model of availableModels) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

        // Randomly set status (simulating real checks)
        setModelStatus(prev => ({
          ...prev,
          [model.name]: Math.random() > 0.2 ? 'available' : 'error'
        }));
      }
    };

    checkModelAvailability();
  }, [availableModels]);

  const getModelProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'blue';
      case 'anthropic': return 'purple';
      case 'ollama': return 'orange';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: 'loading' | 'available' | 'error') => {
    switch (status) {
      case 'loading':
        return <Spin size="small" />;
      case 'available':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Space size="small" align="center">
        <label htmlFor="model-selector">
          <strong>AI Model:</strong>
        </label>
        {isLoading && <SyncOutlined spin />}
      </Space>

      <Select
        id="model-selector"
        placeholder="Select an AI model"
        value={selectedModel}
        onChange={onModelChange}
        loading={isLoading}
        style={{ width: '100%' }}
        optionLabelProp="label"
      >
        {availableModels.map((model) => (
          <Option
            key={model.name}
            value={model.name}
            label={
              <Space>
                <span>{model.name}</span>
                <Tag color={getModelProviderColor(model.provider)}>
                  {model.provider}
                </Tag>
                {getStatusIcon(modelStatus[model.name])}
              </Space>
            }
          >
            <Space>
              <div>
                <div><strong>{model.name}</strong></div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {model.capabilities.join(', ')}
                </div>
              </div>
              <Tag color={getModelProviderColor(model.provider)}>
                {model.provider}
              </Tag>
              <span>
                {getStatusIcon(modelStatus[model.name])}
              </span>
            </Space>
          </Option>
        ))}
      </Select>

      {selectedModel && (
        <Alert
          message={`Using ${selectedModel}`}
          description={`Powered by ${availableModels.find(m => m.name === selectedModel)?.provider}`}
          type="info"
          showIcon
        />
      )}
    </Space>
  );
};