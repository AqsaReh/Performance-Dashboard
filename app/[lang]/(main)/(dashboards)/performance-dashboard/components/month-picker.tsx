"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

type Props = {
  className?: string;
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthPicker({
  className,
  value = null,
  onChange,
  placeholder = "Pick month",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const initial = value ?? new Date();
  const [year, setYear] = React.useState<number>(initial.getFullYear());
  const { theme: mode } = useTheme();

  React.useEffect(() => {
    if (value) setYear(value.getFullYear());
  }, [value]);

  const selectMonth = (monthIndex: number) => {
    const picked = new Date(year, monthIndex, 1);
    onChange?.(picked);
    setOpen(false);
  };

  const isActive = (idx: number) =>
    value && value.getFullYear() === year && value.getMonth() === idx;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            color={mode === "dark" ? "secondary" : "default"}
            variant="outline"
            className={cn(" font-normal", {
              " bg-white text-default-600": mode !== "dark",
            })}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "MMM yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-3" align="start">
          {/* Year header */}
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setYear((y) => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">{year}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setYear((y) => y + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Months grid */}
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m, idx) => (
              <button
                key={m}
                onClick={() => selectMonth(idx)}
                className={cn(
                  "text-sm rounded-md border px-3 py-2 transition",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive(idx)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
