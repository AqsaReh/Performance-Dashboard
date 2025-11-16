"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { BrandPerformanceTable } from "./brand-performance-table";
import BrandPerformanceDetails from "./geographical-performance-details";
import GeographicalPerformanceDetails from "./geographical-performance-details";

interface BrandPerformanceProps {
  title: string;
  metric: Metric;
  onMetricChange?: (m: Metric) => void;
}

export interface Brand {
  id: number;
  name: string;
  sales: number;
  achievement: number;
  growth: number;
  monthly: number[];
}

// 🔸 Sample months
const months = [
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


const brands = [
  {
    id: 1,
    emp: "abcxyz",
    sales: 10123,
    achievement: 123,
    growth: 25,
    monthly: [74, 83, 85, 79, 112, 66, 104, 68, 110, 65, 110, 84],
  },
  {
    id: 2,
    emp: "abcxyz",
    sales: 7843,
    achievement: 55,
    growth: 19,
    monthly: [113, 101, 115, 65, 61, 72, 64, 112, 114, 104, 82, 103],
  },
  {
    id: 3,
    emp: "abcxyz",
    sales: 344,
    achievement: 90,
    growth: 32,
    monthly: [112, 114, 99, 101, 113, 64, 88, 111, 107, 65, 69, 105],
  },
  {
    id: 4,
    emp: "abcxyz",
    sales: 457,
    achievement: 90,
    growth: 24,
    monthly: [112, 114, 78, 61, 83, 86, 111, 92, 96, 68, 99, 100],
  },
  {
    id: 5,
    emp: "abcxyz",
    sales: 578,
    achievement: 90,
    growth: 45,
    monthly: [68, 72, 114, 80, 85, 116, 94, 100, 105, 110, 62, 118],
  },
];

// 🎨 Use exact same color scale as your ApexCharts heatmap (ACH)
function getACHColor(value: number) {
  if (value < 70) return "#ef4444"; // <70%
  if (value < 85) return "#fca5a5"; // 70–85%
  if (value < 95) return "#fee2e2"; // 85–95%
  if (value < 100) return "#dcfce7"; // 95–100%
  if (value < 110) return "#86efac"; // 100–110%
  return "#16a34a"; // >110%
}

// (optional) If you ever toggle to Growth mode
function getGrowthColor(value: number) {
  if (value < -10) return "#ef4444"; // <-10%
  if (value < -5) return "#fca5a5"; // -10–-5%
  if (value < 0) return "#fee2e2"; // -5–0%
  if (value < 5) return "#dcfce7"; // 0–5%
  if (value < 10) return "#86efac"; // 5–10%
  return "#16a34a"; // >10%
}

type Metric = "ACH" | "Growth";

const GeographicalPerformance = ({
  title,
  metric,
  onMetricChange,
}: BrandPerformanceProps) => {
  const handleToggle = (val: Metric) => {
    onMetricChange?.(val);
    setInternalMetric(val);
  };

  const [internalMetric, setInternalMetric] = useState<Metric>(metric ?? "ACH");
  const currentMetric = metric ?? internalMetric;
  const [selectedRow, setSelectedRow] = useState<Brand | null>(null);
  const [openSKUSheet, setOpenSKUSheet] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-3 mb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            <div className="ml-auto">
              <div className="ml-auto flex items-center gap-1">
                <Toggle
                  pressed={currentMetric === "ACH"}
                  onPressedChange={() => handleToggle("ACH")}
                  aria-pressed={currentMetric === "ACH"}
                  aria-label="Show Grid"
                  className="px-3 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
                >
                  ACH
                </Toggle>
                <Toggle
                  pressed={currentMetric === "Growth"}
                  onPressedChange={() => handleToggle("Growth")}
                  aria-pressed={currentMetric === "Growth"}
                  aria-label="Show Graph"
                  className="px-3 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
                >
                  Growth
                </Toggle>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-3 py-2 text-xs w-4">Sr</TableHead>
                <TableHead className="px-3 py-2 text-xs">Employee</TableHead>
                <TableHead className="px-3 py-2 text-xs text-right">
                  Sales
                </TableHead>
                <TableHead className="px-3 py-2 text-xs text-right">
                  ACH%
                </TableHead>
                <TableHead className="px-3 py-2 text-xs text-right">
                  Growth%
                </TableHead>

                {months.map((m) => (
                  <TableHead
                    key={m}
                    className="pl-1 pr-2 py-1 text-[10px] text-center"
                  >
                    {m}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {brands.map((b) => (
                <TableRow
                  key={b.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setOpenSKUSheet(true)}
                >
                  <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                    {b.id}
                  </TableCell>
                  <TableCell className="px-3 py-1.5 text-xs font-medium">
                    {b.emp}
                  </TableCell>
                  <TableCell className="px-3 py-1.5 text-xs text-left">
                    {b.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-3 py-1.5 text-xs text-left">
                    {b.achievement}
                  </TableCell>
                  <TableCell className="px-3 py-1.5 text-xs text-left">
                    {b.growth}
                  </TableCell>

                  {/*   Heatmap cells */}
                  {b.monthly.map((val, i) => (
                    <TableCell
                      key={i}
                      className={clsx("text-[10px] text-center p-0")}
                      style={{
                        backgroundColor: getACHColor(val),
                        color: val < 85 || val > 110 ? "white" : "#000",
                      }}
                    >
                      <div className="text-[10px] text-white font-medium py-2 pr-2">
                        {val}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GeographicalPerformanceDetails
        open={openSKUSheet}
        onOpenChange={setOpenSKUSheet}
        brand={selectedRow}
      />
    </>
  );
};

export default GeographicalPerformance;
