"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import {
  getGridConfig,
  getLabel,
  getYAxisConfig,
} from "@/lib/appex-chart-options";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Toggle } from "@/components/ui/toggle";

type Metric = "ACH" | "Growth";

type HeatmapColorScale = {
  ranges: Array<{ from: number; to: number; color: string; name?: string }>;
};

const DEFAULT_BRANDS = [
  "Fildil",
  "Prospan",
  "Zorix",
  "Avelon",
  "Nexra",
  "Heporin",
  "Cardiol",
  "Zentum",
  "Dermox",
  "Maxfer",
];

const DEFAULT_MONTHS = [
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

function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function makeSeriesForACH(brands: string[], months: string[]) {
  return brands.map((b) => ({
    name: b,
    data: months.map((m) => ({ x: m, y: rand(60, 120) })), // 60–120%
  }));
}

function makeSeriesForGrowth(brands: string[], months: string[]) {
  return brands.map((b) => ({
    name: b,
    data: months.map((m) => ({ x: m, y: rand(-30, 30) })), // -30–30%
  }));
}

function colorScaleForACH(): HeatmapColorScale {
  return {
    ranges: [
      { from: 0, to: 70, color: "#bg-muted/30", name: "<70%" },
      { from: 70, to: 85, color: "#bg-muted/30", name: "70–85%" },
      { from: 85, to: 95, color: "#bg-muted/30", name: "85–95%" },
      { from: 95, to: 100, color: "#bg-muted/30", name: "95–100%" },
      { from: 100, to: 110, color: "#bg-muted/30", name: "100–110%" },
      { from: 110, to: 999, color: "#bg-muted/30", name: ">110%" },
    ],
  };
}

function colorScaleForGrowth(): HeatmapColorScale {
  return {
    ranges: [
      { from: -100, to: -10, color: "bg-muted", name: "<-10%" },
      { from: -10, to: -5, color: "#bg-muted", name: "-10–-5%" },
      { from: -5, to: 0, color: "#bg-muted/50", name: "-5–0%" },
      { from: 0, to: 5, color: "#bg-muted/60", name: "0–5%" },
      { from: 5, to: 10, color: "#bg-muted/30", name: "5–10%" },
      { from: 10, to: 100, color: "#bg-muted/30", name: ">10%" },
    ],
  };
}

interface BrandPerformanceChartProps {
  height?: number;
  metric: Metric;
  onMetricChange?: (m: Metric) => void;
  brands?: string[];
  months?: string[];
}

const BrandPerformanceChartSkeleton = ({
  height = 360,
  metric,
  onMetricChange,
  brands = DEFAULT_BRANDS,
  months = DEFAULT_MONTHS,
}: BrandPerformanceChartProps) => {
  const [internalMetric, setInternalMetric] = useState<Metric>(metric ?? "ACH");

  useEffect(() => {
    if (metric) setInternalMetric(metric);
  }, [metric]);

  const currentMetric = metric ?? internalMetric;

  const handleToggle = (val: Metric) => {
    onMetricChange?.(val);
    setInternalMetric(val);
  };

  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((t) => t.name === config);

  const labelColor = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
  })`;
  const gridColor = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird
  })`;

  const series = useMemo(
    () =>
      currentMetric === "ACH"
        ? makeSeriesForACH(brands, months)
        : makeSeriesForGrowth(brands, months),
    [currentMetric, brands, months]
  );

  const colorScale: HeatmapColorScale =
    currentMetric === "ACH" ? colorScaleForACH() : colorScaleForGrowth();

  const options: any = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
      animations: { enabled: true, dynamicAnimation: { speed: 250 } },
    },
    grid: getGridConfig(gridColor),
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
      y: { formatter: (v: any) => `${v}%` },
    },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: false,
        colorScale,
      },
    },
    xaxis: {
      labels: getLabel(labelColor),
      type: "category",
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      ...getYAxisConfig(labelColor),
      labels: {
        ...getYAxisConfig(labelColor)?.labels,
        style: { colors: labelColor },
      },
    },
  };

  const grid = Array.from({ length: DEFAULT_BRANDS.length }, () =>
    Array.from({ length: DEFAULT_MONTHS.length }, () => 0)
  );
  const shades = [
    "bg-muted/30",
    "bg-muted/40",
    "bg-muted/50",
    "bg-muted/60",
    "bg-muted/70",
  ];

  return (
    <Card>
      <CardHeader className="pb-3 mb-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Skeleton className="w-1/4 h-5 " />

          {/* Toggle on the right */}
          <div className="ml-auto">
            <div className="ml-auto flex items-center gap-1">
              <Toggle
                aria-label="Show Grid"
                className="px-5 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
              ></Toggle>
              <Toggle
                aria-label="Show Graph"
                className="px-5 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
              ></Toggle>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2">
        {/* Grid for brands × months */}
        <div
          className="grid gap-[4px] w-full"
          style={{
            gridTemplateColumns: `repeat(${DEFAULT_MONTHS.length}, 1fr)`,
            height,
          }}
        >
          {DEFAULT_BRANDS.map((brand, rowIndex) =>
            DEFAULT_MONTHS.map((month, colIndex) => (
              <Skeleton
                key={`${brand}-${month}`}
                className={`w-full h-[calc(${
                  height / DEFAULT_BRANDS.length
                }px-4px)] rounded-md animate-pulse ${
                  shades[Math.floor(Math.random() * shades.length)]
                }`}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandPerformanceChartSkeleton;
