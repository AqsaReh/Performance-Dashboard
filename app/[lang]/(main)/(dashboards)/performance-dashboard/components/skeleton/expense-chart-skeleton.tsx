"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

type SaleVsTargetProps = {
  height?: number; // stays numeric, like your Apex chart

  months?: string[];
};

const DEFAULT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
 
 
];

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>(800); // SSR-safe default

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // Initialize width immediately
    setWidth(el.getBoundingClientRect().width || 800);

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w =
          entry.contentBoxSize && Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0].inlineSize
            : entry.contentRect.width;
        if (w) setWidth(w);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, width };
}

const ExpenseChartSkeleton = ({
  height = 282,
  months = DEFAULT_MONTHS,
}: SaleVsTargetProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // THEME
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((t) => t.name === config);
  const palette = theme?.cssVars[mode === "dark" ? "dark" : "light"];

  const salesColor = `hsl(${palette?.success})`;
  // here
  const targetColor = "hsl(0 0% 90%)";
  const gridColor = `hsl(${palette?.chartGird})`;
  const labelColor = `hsl(${palette?.chartLabel})`;
  const borderColor = `hsl(${palette?.border})`;
  const cardFill = "hsl(var(--card))";

  // DATA
  const cats = months.slice(0, 12);
  while (cats.length < 12) cats.push(`M${cats.length + 1}`);

  const data = cats.map((m, i) => ({
    month: m,
  }));

  // RESPONSIVE WIDTH
  const { ref, width: chartWidth } = useElementWidth<HTMLDivElement>();

  // LAYOUT

  // Y ticks
  const yAxisTicks = 5;

  // Layout constants
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerHeight = Math.max(0, height - padding.top - padding.bottom);
  const innerWidth = Math.max(0, chartWidth - padding.left - padding.right);
  const barSlot = innerWidth / months.length;
  const barWidth = barSlot * 0.5; // width of each bar
  const maxBarHeight = innerHeight * 0.8; // max height for random bars

  const barHeights = months.map(
    () => Math.random() * (maxBarHeight * 0.8) + maxBarHeight * 0.2
  );

  const barBase = "hsl(var(--muted))"; // base neutral color for bars

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Skeleton className="w-1/4 h-5 " />
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={ref} className="w-full">
          <svg width="100%" height={height}>
            {/* Background grid lines (optional) */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = padding.top + (innerHeight / 5) * i;
              return (
                <line
                  key={i}
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={y}
                  y2={y}
                  stroke={borderColor}
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
              );
            })}

            {/* Skeleton bars */}
            {months.map((m, i) => {
              const barHeight = barHeights[i];
              const x = padding.left + i * barSlot + (barSlot - barWidth) / 2;
              const y = padding.top + innerHeight - barHeight;

              return (
                <rect
                  key={m}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  ry={4}
                  fill={barBase}
                  className="animate-pulse opacity-70"
                />
              );
            })}

            {/* Axes */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={chartWidth - padding.right}
              y2={height - padding.bottom}
              stroke={borderColor}
              strokeWidth={2}
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke={borderColor}
              strokeWidth={2}
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChartSkeleton;
