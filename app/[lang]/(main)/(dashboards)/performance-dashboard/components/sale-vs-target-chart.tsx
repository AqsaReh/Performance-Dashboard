"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

type SaleVsTargetProps = {
  title?: string;
  height?: number;        // stays numeric, like your Apex chart
  sales: number[];
  targets: number[];
  months?: string[];
};

const DEFAULT_MONTHS = [
  "Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sept","Oct","Nov","Dec",
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

const SaleVsTarget = ({
  title = "Sales Overview",
  height = 336,
  sales,
  targets,
  months = DEFAULT_MONTHS,
}: SaleVsTargetProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // THEME
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((t) => t.name === config);
  const palette = theme?.cssVars[mode === "dark" ? "dark" : "light"];

  const salesColor  = `hsl(${palette?.success})`;
  // here
  const targetColor = "hsl(0 0% 90%)"; 
  const gridColor   = `hsl(${palette?.chartGird})`;
  const labelColor  = `hsl(${palette?.chartLabel})`;
  const borderColor = `hsl(${palette?.border})`;
  const cardFill    = "hsl(var(--card))";

  // DATA
  const cats = months.slice(0, 12);
  while (cats.length < 12) cats.push(`M${cats.length + 1}`);

  const data = cats.map((m, i) => ({
    month: m,
    target: Number(targets[i] ?? 0),
    sales: Number(sales[i] ?? 0),
  }));

  const maxValue = Math.max(1, ...data.map((d) => Math.max(d.target, d.sales)));

  // RESPONSIVE WIDTH
  const { ref, width: chartWidth } = useElementWidth<HTMLDivElement>();

  // LAYOUT
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerHeight = Math.max(0, height - padding.top - padding.bottom);
  const innerWidth  = Math.max(0, chartWidth - padding.left - padding.right);

  const barSlot        = innerWidth / data.length;
  const targetBarWidth = barSlot * 0.7;
  const salesBarWidth  = barSlot * 0.4;

  const getY = (v: number) => innerHeight - (v / maxValue) * innerHeight;

  // Y ticks
  const yAxisTicks = 5;
  const tickStep = Math.ceil(maxValue / yAxisTicks / 200) * 200 || 1;
  const ticks = Array.from({ length: yAxisTicks + 1 }, (_, i) => i * tickStep);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={ref} className="w-full">
          <svg width="100%" height={height}>
            {/* Grid + labels */}
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={padding.left}
                  y1={padding.top + getY(t)}
                  x2={chartWidth - padding.right}
                  y2={padding.top + getY(t)}
                  stroke={gridColor}
                  strokeWidth={1}
                />
                <text
                  x={padding.left - 10}
                  y={padding.top + getY(t)}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  style={{ fill: labelColor }}
                  className="text-xs"
                >
                  {t.toLocaleString()}
                </text>
              </g>
            ))}

            {/* Bars */}
            {data.map((d, i) => {
              const x = padding.left + i * barSlot;
              const targetH = innerHeight - getY(d.target);
              const salesH  = innerHeight - getY(d.sales);
              const isHovered = hoveredIndex === i;

              return (
                <g
                  key={d.month}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Target (back) */}
                  <rect
                    x={x + (barSlot - targetBarWidth) / 2}
                    y={padding.top + getY(d.target)}
                    width={targetBarWidth}
                    height={Math.max(0, targetH)}
                    rx={4}
                    style={{ fill: targetColor, opacity: isHovered ? 0.85 : 1 }}
                  />

                  {/* Sales (front) */}
                  <rect
                    x={x + (barSlot - salesBarWidth) / 2}
                    y={padding.top + getY(d.sales)}
                    width={salesBarWidth}
                    height={Math.max(0, salesH)}
                    rx={4}
                    style={{ fill: salesColor, opacity: isHovered ? 0.95 : 1 }}
                  />

                  {/* Month label */}
                  <text
                    x={x + barSlot / 2}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    style={{ fill: labelColor }}
                    className="text-xs"
                  >
                    {d.month}
                  </text>

                  {/* Tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={x + barSlot / 2 - 70}
                        y={padding.top - 34}
                        width={140}
                        height={56}
                        rx={8}
                        style={{ fill: cardFill, stroke: borderColor }}
                        strokeWidth={1}
                      />
                      <text
                        x={x + barSlot / 2}
                        y={padding.top - 16}
                        textAnchor="middle"
                        style={{ fill: labelColor }}
                        className="text-xs font-semibold"
                      >
                        {d.month}
                      </text>
                      <text
                        x={x + barSlot / 2}
                        y={padding.top - 2}
                        textAnchor="middle"
                        style={{ fill: labelColor }}
                        className="text-xs"
                      >
                        Target: {d.target.toLocaleString()}
                      </text>
                      <text
                        x={x + barSlot / 2}
                        y={padding.top + 12}
                        textAnchor="middle"
                        style={{ fill: labelColor }}
                        className="text-xs"
                      >
                        Sales: {d.sales.toLocaleString()}
                      </text>
                    </g>
                  )}
                </g>
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

export default SaleVsTarget;
