import { ReactNode } from "react";
import { Card } from "antd";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  className?: string;
}

export function StatWidget({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  className,
}: StatWidgetProps) {
  return (
    <Card
      bordered={false}
      className={cn(
        "rounded-xl shadow-duralux-card dark:shadow-duralux-card-dark",
        "transition-all duration-200 hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark",
        "hover:-translate-y-0.5 overflow-hidden",
        "bg-white dark:bg-duralux-bg-dark-card",
        className
      )}
      styles={{ body: { padding: "1rem" } }}
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", bgColor)}>
          <Icon className={cn("w-4 h-4", color)} size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-duralux-text-muted truncate">{title}</div>
          <div className="text-lg font-bold text-duralux-text-primary dark:text-duralux-text-dark-primary truncate">
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
}
