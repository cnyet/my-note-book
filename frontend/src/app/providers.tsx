"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sneat Primary Color: #696cff
  const themeConfig = {
    token: {
      colorPrimary: "#696cff",
      borderRadius: 8,
      fontFamily:
        "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    algorithm:
      mounted && currentTheme === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
  };

  return (
    <AuthProvider>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </AuthProvider>
  );
}
