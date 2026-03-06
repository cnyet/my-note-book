/**
 * Table utilities for Duralux Admin
 * Provides CSV export, column toggling, and density controls
 */

/**
 * Convert table data to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: string[],
  filename: string = "export"
): void {
  // Create CSV content
  const headers = columns.join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = (row as Record<string, unknown>)[col];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value ?? "").replace(/"/g, '""');
        return escaped.includes(",") || escaped.includes("\n")
          ? `"${escaped}"`
          : escaped;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert table data to Excel-compatible CSV (with BOM for UTF-8)
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: string[],
  filename: string = "export"
): void {
  const csv = columns.join(",") + "\n" + data.map((row) =>
    columns.map((col) => {
      const value = row[col];
      const escaped = String(value ?? "").replace(/"/g, '""');
      return escaped.includes(",") || escaped.includes("\n")
        ? `"${escaped}"`
        : escaped;
    }).join(",")
  ).join("\n");

  // Add BOM for Excel UTF-8 support
  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get column key from data index
 */
export function getColumnKey<T>(dataIndex: keyof T, prefix = "col"): string {
  return `${prefix}-${String(dataIndex)}`;
}

/**
 * Generate column toggle state
 */
export function createColumnToggleState<T extends string>(
  allColumns: T[],
  defaultVisible?: T[]
): Record<T, boolean> {
  if (defaultVisible) {
    return allColumns.reduce(
      (acc, col) => {
        acc[col] = defaultVisible.includes(col);
        return acc;
      },
      {} as Record<T, boolean>
    );
  }
  return allColumns.reduce(
    (acc, col) => {
      acc[col] = true;
      return acc;
    },
    {} as Record<T, boolean>
  );
}

/**
 * Density levels for tables
 */
export type TableDensity = "compact" | "normal" | "spacious";

export const DENSITY_CONFIG = {
  compact: {
    padding: "0.5rem 0.75rem",
    fontSize: "0.8125rem",
    label: "Compact",
  },
  normal: {
    padding: "1rem 1rem",
    fontSize: "0.9375rem",
    label: "Normal",
  },
  spacious: {
    padding: "1.5rem 1.25rem",
    fontSize: "1rem",
    label: "Spacious",
  },
} as const;
