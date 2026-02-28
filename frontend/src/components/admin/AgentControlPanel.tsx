"use client";

/**
 * AgentControlPanel - 智能体控制面板
 *
 * 提供启动/停止/重启智能体的控制按钮
 */

import { useState } from "react";
import { Button, Card, Space, Tag, Typography, message } from "antd";
import {
  PlayCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useAgentWebSocket } from "@/hooks/use-agent-websocket";
import { apiClient } from "@/lib/admin-api";

const { Text } = Typography;

interface AgentControlPanelProps {
  agentId: number;
  agentName: string;
  initialStatus?: string;
}

type AgentStatus = "offline" | "spawning" | "idle" | "busy" | "error";

export function AgentControlPanel({
  agentId,
  agentName,
  initialStatus = "offline",
}: AgentControlPanelProps) {
  const [status, setStatus] = useState<AgentStatus>(initialStatus as AgentStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Use WebSocket for real-time status updates
  const { status: wsStatus, lastMessage } = useAgentWebSocket();

  // Update status from WebSocket messages
  useState(() => {
    if (lastMessage?.type === "status" && lastMessage.agent_id === String(agentId)) {
      setStatus(lastMessage.new_status as AgentStatus);
    }
  });

  const handleSpawn = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/admin/agents/${agentId}/spawn`);
      setStatus("idle");
      message.success(`Agent "${agentName}" started successfully`);
    } catch (error) {
      message.error("Failed to start agent");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminate = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/admin/agents/${agentId}/terminate`);
      setStatus("offline");
      message.success(`Agent "${agentName}" stopped`);
    } catch (error) {
      message.error("Failed to stop agent");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(`/admin/agents/${agentId}/terminate`);
      await apiClient.post(`/admin/agents/${agentId}/spawn`);
      setStatus("idle");
      message.success(`Agent "${agentName}" restarted`);
    } catch (error) {
      message.error("Failed to restart agent");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig: Record<AgentStatus, { color: string; label: string; dot: string }> = {
    offline: { color: "default", label: "Offline", dot: "bg-gray-400" },
    spawning: { color: "processing", label: "Starting...", dot: "bg-blue-400" },
    idle: { color: "success", label: "Idle", dot: "bg-green-400" },
    busy: { color: "warning", label: "Busy", dot: "bg-yellow-400" },
    error: { color: "error", label: "Error", dot: "bg-red-400" },
  };

  const config = statusConfig[status];
  const isRunning = status === "idle" || status === "busy";

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span>Agent Control</span>
          <Tag color={config.color}>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${config.dot} ${isRunning ? "animate-pulse" : ""}`} />
              {config.label}
            </span>
          </Tag>
        </div>
      }
      bordered={false}
      className="sneat-card-shadow"
    >
      <Space direction="vertical" className="w-full">
        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleSpawn}
              loading={isLoading}
              className="bg-[#71dd37] hover:bg-[#67c732] flex-1"
            >
              Start
            </Button>
          ) : (
            <>
              <Button
                danger
                icon={<StopOutlined />}
                onClick={handleTerminate}
                loading={isLoading}
                className="flex-1"
              >
                Stop
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRestart}
                loading={isLoading}
                className="flex-1"
              >
                Restart
              </Button>
            </>
          )}
        </div>

        {/* Quick Actions */}
        {isRunning && (
          <Button
            icon={<MessageOutlined />}
            className="w-full"
            onClick={() => message.info("Chat feature coming in Phase 3")}
          >
            Open Chat
          </Button>
        )}

        {/* Status Info */}
        <div className="mt-4 pt-4 border-t border-[#eceef1] dark:border-[#444564]">
          <div className="flex justify-between text-sm">
            <Text className="text-[#697a8d]">WebSocket:</Text>
            <Tag color={wsStatus === "connected" ? "success" : "default"}>
              {wsStatus === "connected" ? "Connected" : wsStatus}
            </Tag>
          </div>
        </div>
      </Space>
    </Card>
  );
}
