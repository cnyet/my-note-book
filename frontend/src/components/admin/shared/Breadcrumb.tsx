"use client";

import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Duralux-style Breadcrumb Component
 *
 * Features:
 * - Home icon for root
 * - Chevron separators
 * - Current page non-clickable
 * - Responsive truncation
 * - Dark mode support
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-[0.375rem] text-[0.9375rem]",
        className,
      )}
      aria-label="Breadcrumb"
    >
      {/* Home Link */}
      <Link
        href="/admin"
        className="flex items-center text-[#8898aa] hover:text-[#5e72e4] transition-colors"
      >
        <Home className="w-3.5 h-3.5" strokeWidth={2} />
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li
            key={item.label}
            className={cn(
              "flex items-center gap-[0.25rem] list-none",
              isLast
                ? "text-[#5e72e4] dark:text-[#5e72e4] font-bold"
                : "text-[#8898aa]",
            )}
          >
            {/* Separator */}
            <span className="text-[#a1acb8] opacity-50 px-0.5">/</span>

            {/* Item Link or Text */}
            {isLast ? (
              <span className="flex items-center gap-[0.375rem] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                {item.icon}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || "#"}
                className="flex items-center gap-[0.375rem] hover:text-[#696cff] dark:hover:text-[#696cff] transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
              >
                {item.icon}
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </nav>
  );
}

/**
 * Helper: Generate breadcrumb items from pathname
 */
export function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const href = `/${segments.slice(0, i + 1).join("/")}`;

    items.push({ label, href });
  }

  return items;
}
