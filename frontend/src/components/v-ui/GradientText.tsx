"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  from?: string;
  to?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function GradientText({
  children,
  className,
  from = "from-primary",
  to = "to-accent",
  as: Component = "h1",
  ...props
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        from,
        to,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
