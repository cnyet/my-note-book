"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
}

const PRESET_RANGES = [
  { label: "Today", days: 0 },
  { label: "Yesterday", days: -1 },
  { label: "Last 7 Days", days: -7 },
  { label: "Last 30 Days", days: -30 },
  { label: "This Month", months: 0 },
  { label: "Last Month", months: -1 },
];

/**
 * Duralux-style DateRangePicker Component
 *
 * Features:
 * - Calendar icon + date display
 * - Preset ranges
 * - Manual date selection
 * - Dark mode support
 */
export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const displayValue = value
    ? `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`
    : "Select Date Range";

  const handlePresetClick = (days: number, months: number) => {
    const endDate = new Date();
    const startDate = new Date();

    if (days !== 0) {
      startDate.setDate(endDate.getDate() + days);
      if (days === -1) {
        // Yesterday only
        endDate.setDate(endDate.getDate() + days);
      }
    } else if (months !== 0) {
      startDate.setMonth(endDate.getMonth() + months);
      startDate.setDate(1); // First day of month
      endDate.setDate(0); // Last day of previous month
    }

    onChange?.({ startDate, endDate });
    setOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = value &&
        date >= value.startDate &&
        date <= value.endDate;
      const isToday =
        date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          className={cn(
            "w-8 h-8 rounded text-sm transition-colors",
            isSelected
              ? "bg-[#696cff] text-white"
              : isToday
              ? "text-[#696cff] font-medium"
              : "text-[#566a7f] dark:text-[#a3b1c2] hover:bg-[#f5f5f9] dark:hover:bg-[#323249]"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#2b2c40]/80 backdrop-blur-md rounded-md sneat-card-shadow hover:sneat-hover-shadow transition-all",
            "text-[#566a7f] dark:text-[#a3b1c2] text-sm font-medium",
            className
          )}
        >
          <Calendar className="w-4 h-4 text-[#696cff]" />
          <span>{displayValue}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-4 bg-white dark:bg-[#2b2c40] border border-[#eceef1] dark:border-[#444564] sneat-dropdown-shadow"
        align="end"
      >
        <div className="space-y-4">
          {/* Preset Ranges */}
          <div className="flex flex-wrap gap-2">
            {PRESET_RANGES.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                onClick={() =>
                  handlePresetClick(preset.days || 0, preset.months || 0)
                }
                className="text-xs text-[#697a8d] dark:text-[#a3b1c2] hover:text-[#696cff] dark:hover:text-[#696cff] hover:bg-[#f5f5f9] dark:hover:bg-[#323249]"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <div className="space-y-2">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(currentMonth.getMonth() - 1);
                  setCurrentMonth(newMonth);
                }}
                className="w-8 h-8 text-[#697a8d] hover:text-[#696cff]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-[#566a7f] dark:text-[#a3b1c2]">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(currentMonth.getMonth() + 1);
                  setCurrentMonth(newMonth);
                }}
                className="w-8 h-8 text-[#697a8d] hover:text-[#696cff]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="w-8 h-8 flex items-center justify-center text-xs font-medium text-[#adadb4]"
                >
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
