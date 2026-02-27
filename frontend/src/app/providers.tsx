"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

// 创建 QueryClient 实例
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 分钟
        refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新
        retry: 1, // 失败重试 1 次
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // SSR: 每次请求创建新实例
    return makeQueryClient();
  }
  // 浏览器：创建单例
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * AntD 主题配置层 — 依赖 next-themes 的 useTheme 判断当前主题
 */
function AntdConfigLayer({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeConfig = {
    token: {
      colorPrimary: "#696cff",
      borderRadius: 8,
      fontFamily:
        "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    algorithm:
      mounted && resolvedTheme === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}

/**
 * 顶层 Providers:
 * - QueryClientProvider: React Query 数据获取和缓存
 * - ThemeProvider (next-themes): 管理 dark/light 切换，写入 className 到 <html>
 * - AntdConfigLayer: 根据当前主题配置 AntD
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AntdConfigLayer>{children}</AntdConfigLayer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
