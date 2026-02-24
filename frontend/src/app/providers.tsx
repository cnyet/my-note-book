"use client";

import { ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
 * - ThemeProvider (next-themes): 管理 dark/light 切换，写入 className 到 <html>
 * - AntdConfigLayer: 根据当前主题配置 AntD
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AntdConfigLayer>{children}</AntdConfigLayer>
    </ThemeProvider>
  );
}
