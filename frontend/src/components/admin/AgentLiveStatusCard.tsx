"use client";

/**
 * AgentLiveStatusCard - 实时智能体状态卡片
 *
 * 使用 WebSocket 显示活动智能体的实时状态
 */

import { useEffect, useState } from "react";
import { Card, Badge, Spin } from "antd";
import { useAgentWebSocket, type AgentStatusEvent } from "@/hooks/use-agent-websocket";
import { Bot, Wifi, WifiOff } from "lucide-react";

interface AgentStatus {
  agent_id: string;
  status: string;
  session_id?: string;
  started_at?: string;
}

export function AgentLiveStatusCard() {
  const { status: wsStatus, lastMessage, subscribeToAgent } = useAgentWebSocket();
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  // 处理 WebSocket 消息
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === "initial_state") {
      // 初始状态
      const initialAgents = (lastMessage as any).agents || [];
      setAgents(initialAgents);
    } else if (lastMessage.type === "status") {
      // 状态更新
      const statusEvent = lastMessage as AgentStatusEvent;
      setAgents((prev) =>
        prev.map((agent) =>
          agent.agent_id === statusEvent.agent_id
            ? { ...agent, status: statusEvent.new_status }
            : agent
        )
      );
    }
  }, [lastMessage]);

  // 订阅所有智能体
  useEffect(() => {
    agents.forEach((agent) => {
      subscribeToAgent(agent.agent_id);
    });
  }, [agents.length, subscribeToAgent]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle":
        return "success";
      case "busy":
        return "processing";
      case "spawned":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const activeAgents = agents.filter(
    (a) => a.status === "idle" || a.status === "busy" || a.status === "spawned"
  );

  return (
    <Card
      bordered={false}
      className="sneat-card-shadow"
      title={
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-[#696cff]" />
          <span className="text-[#566a7f] dark:text-[#a3b1c2] font-semibold">
            Active Agents
          </span>
          {wsStatus === "connected" ? (
            <Wifi size={14} className="text-[#71dd37]" />
          ) : (
            <WifiOff size={14} className="text-[#ff3e1d]" />
          )}
        </div>
      }
      extra={
        <Badge
          count={activeAgents.length}
          showZero
          style={{ backgroundColor: "#696cff" }}
        />
      }
    >
      {wsStatus === "connecting" && (
        <div className="flex justify-center py-4">
          <Spin size="small" />
        </div>
      )}

      {activeAgents.length === 0 && wsStatus === "connected" && (
        <div className="text-center py-4 text-[#697a8d] text-sm">
          No active agents
        </div>
      )}

      <div className="space-y-2">
        {activeAgents.slice(0, 5).map((agent) => (
          <div
            key={agent.agent_id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#f5f5f9] dark:bg-[#232333]"
          >
            <div className="flex items-center gap-2">
              <Badge status={getStatusColor(agent.status) as any} />
              <span className="text-sm text-[#566a7f] dark:text-[#a3b1c2]">
                Agent {agent.agent_id.slice(0, 8)}
              </span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                agent.status === "busy"
                  ? "bg-[#ffab00]/10 text-[#ffab00]"
                  : agent.status === "idle"
                  ? "bg-[#71dd37]/10 text-[#71dd37]"
                  : "bg-[#696cff]/10 text-[#696cff]"
              }`}
            >
              {agent.status}
            </span>
          </div>
        ))}
      </div>

      {activeAgents.length > 5 && (
        <div className="text-center mt-2 text-[#a1acb8] text-xs">
          +{activeAgents.length - 5} more agents
        </div>
      )}
    </Card>
  );
}
