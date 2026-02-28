"use client";

/**
 * useAgentWebSocket - 智能体 WebSocket 连接 Hook
 *
 * 提供实时智能体状态更新和消息通信
 */

import { useEffect, useRef, useState, useCallback } from "react";

export type WSStatus = "connecting" | "connected" | "disconnected" | "error";

export interface AgentStatusEvent {
  type: "status";
  agent_id: string;
  old_status: string;
  new_status: string;
  timestamp: number;
}

export interface AgentMessage {
  type: "message";
  agent_id: string;
  content: string;
  timestamp: number;
}

export interface UseAgentWebSocketReturn {
  status: WSStatus;
  lastMessage: AgentStatusEvent | AgentMessage | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (type: string, payload?: unknown) => void;
  subscribeToAgent: (agentId: string) => void;
  unsubscribeFromAgent: () => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001";

export function useAgentWebSocket(): UseAgentWebSocketReturn {
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [lastMessage, setLastMessage] = useState<
    AgentStatusEvent | AgentMessage | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribedAgentRef = useRef<string | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const ws = new WebSocket(`${WS_URL}/ws/agents`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        setError(null);
        console.log("[WebSocket] Connected to agent stream");

        // 如果之前有订阅的 agent，重新订阅
        if (subscribedAgentRef.current) {
          ws.send(
            JSON.stringify({
              type: "subscribe",
              agent_id: subscribedAgentRef.current,
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);

          if (message.type === "error") {
            setError(message.message);
          }
        } catch (e) {
          console.error("[WebSocket] Failed to parse message:", e);
        }
      };

      ws.onclose = () => {
        setStatus("disconnected");
        wsRef.current = null;
        console.log("[WebSocket] Disconnected");

        // 自动重连
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[WebSocket] Attempting to reconnect...");
          connect();
        }, 3000);
      };

      ws.onerror = (e) => {
        setStatus("error");
        setError("WebSocket connection error");
        console.error("[WebSocket] Error:", e);
      };
    } catch (e) {
      setStatus("error");
      setError("Failed to create WebSocket connection");
      console.error("[WebSocket] Failed to connect:", e);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus("disconnected");
  }, []);

  const sendMessage = useCallback(
    (type: string, payload?: unknown) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type, ...payload }));
      } else {
        console.warn("[WebSocket] Cannot send message, not connected");
      }
    },
    []
  );

  const subscribeToAgent = useCallback(
    (agentId: string) => {
      subscribedAgentRef.current = agentId;
      sendMessage("subscribe", { agent_id: agentId });
    },
    [sendMessage]
  );

  const unsubscribeFromAgent = useCallback(() => {
    subscribedAgentRef.current = null;
    sendMessage("unsubscribe");
  }, [sendMessage]);

  // 自动连接
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
    subscribeToAgent,
    unsubscribeFromAgent,
  };
}

/**
 * useAgentChat - 与特定智能体的聊天 WebSocket Hook
 */
export interface UseAgentChatReturn {
  status: WSStatus;
  isTyping: boolean;
  messages: Array<{ role: "user" | "agent"; content: string; timestamp: number }>;
  error: string | null;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

export function useAgentChat(agentId: string): UseAgentChatReturn {
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "agent"; content: string; timestamp: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!agentId) return;

    setStatus("connecting");

    const ws = new WebSocket(`${WS_URL}/ws/chat/${agentId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "typing") {
          setIsTyping(true);
        } else if (message.type === "message") {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              role: "agent",
              content: message.content,
              timestamp: Date.now(),
            },
          ]);
        } else if (message.type === "error") {
          setError(message.message);
        }
      } catch (e) {
        console.error("[Chat WebSocket] Failed to parse message:", e);
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
      wsRef.current = null;
    };

    ws.onerror = () => {
      setStatus("error");
      setError("Chat connection error");
    };

    return () => {
      ws.close();
    };
  }, [agentId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "message",
            content,
            timestamp: Date.now(),
          })
        );

        setMessages((prev) => [
          ...prev,
          { role: "user", content, timestamp: Date.now() },
        ]);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    status,
    isTyping,
    messages,
    error,
    sendMessage,
    clearMessages,
  };
}
