"use client";

import { Button, Dropdown, MenuProps, Tooltip } from "antd";
import { cn } from "@/lib/utils";
import {
  ColumnHeightOutlined,
  DownloadOutlined,
  EyeOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { TableDensity } from "@/lib/table-utils";

export interface TableToolbarProps {
  /** Show density toggle */
  showDensity?: boolean;
  /** Show column toggle */
  showColumnToggle?: boolean;
  /** Show export buttons */
  showExport?: boolean;
  /** Current density */
  density?: TableDensity;
  /** On density change */
  onDensityChange?: (density: TableDensity) => void;
  /** Available columns for toggling */
  columns?: { key: string; title: string; visible?: boolean }[];
  /** On column visibility change */
  onColumnToggle?: (columnKey: string, visible: boolean) => void;
  /** Export filename prefix */
  exportFilename?: string;
  /** Data to export */
  exportData?: Record<string, unknown>[];
  /** Columns to export */
  exportColumns?: string[];
}

/**
 * Duralux-style Table Toolbar
 * Provides density control, column toggling, and export options
 */
export function TableToolbar({
  showDensity = true,
  showColumnToggle = true,
  showExport = true,
  density = "normal",
  onDensityChange,
  columns = [],
  onColumnToggle,
  exportFilename = "export",
  exportData = [],
  exportColumns = [],
}: TableToolbarProps) {
  // Density dropdown
  const densityMenu: MenuProps = {
    items: [
      {
        key: "compact",
        label: "Compact",
        onClick: () => onDensityChange?.("compact"),
      },
      {
        key: "normal",
        label: "Normal",
        onClick: () => onDensityChange?.("normal"),
      },
      {
        key: "spacious",
        label: "Spacious",
        onClick: () => onDensityChange?.("spacious"),
      },
    ],
  };

  // Column toggle dropdown
  const columnMenu: MenuProps = {
    items: columns.map((col) => ({
      key: col.key,
      label: col.title,
      icon: col.visible !== false ? <EyeOutlined className="text-[#71dd37]" /> : <EyeOutlined className="text-[#a1acb8]" />,
      onClick: () => onColumnToggle?.(col.key, !(col.visible !== false)),
    })),
  };

  // Export dropdown
  const exportMenu: MenuProps = {
    items: [
      {
        key: "csv",
        label: "Export as CSV",
        onClick: () => handleExport("csv"),
      },
      {
        key: "excel",
        label: "Export for Excel",
        onClick: () => handleExport("excel"),
      },
    ],
  };

  const handleExport = (type: "csv" | "excel") => {
    if (exportData.length === 0 || exportColumns.length === 0) {
      console.warn("No data or columns to export");
      return;
    }

    const headers = exportColumns.join(",");
    const rows = exportData.map((row) =>
      exportColumns
        .map((col) => {
          const value = row[col];
          const escaped = String(value ?? "").replace(/"/g, '""');
          return escaped.includes(",") || escaped.includes("\n")
            ? `"${escaped}"`
            : escaped;
        })
        .join(",")
    );

    const content = type === "excel" ? "\uFEFF" + [headers, ...rows].join("\n") : [headers, ...rows].join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `${exportFilename}_${new Date().toISOString().split("T")[0]}.${type}`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {showDensity && (
        <Dropdown menu={densityMenu} trigger={["click"]}>
          <Tooltip title="Density">
            <Button
              type="text"
              icon={<ColumnHeightOutlined />}
              className={cn(
                "text-[#697a8d] hover:text-[#696cff]",
                density !== "normal" && "text-[#696cff]"
              )}
            />
          </Tooltip>
        </Dropdown>
      )}

      {showColumnToggle && columns.length > 0 && (
        <Dropdown menu={columnMenu} trigger={["click"]}>
          <Tooltip title="Columns">
            <Button
              type="text"
              icon={<TableOutlined />}
              className="text-[#697a8d] hover:text-[#696cff]"
            />
          </Tooltip>
        </Dropdown>
      )}

      {showExport && (
        <Dropdown menu={exportMenu} trigger={["click"]}>
          <Tooltip title="Export">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              className="text-[#697a8d] hover:text-[#696cff]"
            />
          </Tooltip>
        </Dropdown>
      )}
    </div>
  );
}
