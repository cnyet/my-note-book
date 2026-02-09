"use client";

import { cn } from "@/lib/utils";

interface OnlinePulseProps {
  status?: "online" | "offline" | "busy" | "training" | "idle";
  className?: string;
  showLabel?: boolean;
}

export function OnlinePulse({
  status = "online",
  className,
  showLabel,
}: OnlinePulseProps) {
  const styles = {
    online: "bg-success shadow-[0_0_10px_rgba(0,255,136,0.5)]",
    offline: "bg-text-muted opacity-50",
    busy: "bg-error shadow-[0_0_10px_rgba(255,51,102,0.5)]",
    training: "bg-accent shadow-[0_0_10px_rgba(188,19,254,0.5)]",
    idle: "bg-text-secondary opacity-70",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-2.5 w-2.5">
        {status === "online" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        )}
        {status === "training" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            styles[status],
          )}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
          {status}
        </span>
      )}
    </div>
  );
}
