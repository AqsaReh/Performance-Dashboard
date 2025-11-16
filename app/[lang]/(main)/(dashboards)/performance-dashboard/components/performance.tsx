"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import clsx from "clsx";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { BrandPerformanceTable } from "./brand-performance-table";
import BrandPerformanceDetails from "./brand-performance-details";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GeographicalPerformanceDetails from "./geographical-performance-details";
import { PerformanceGroup } from "../utils/types";
// import { PerformanceGroup } from "../page-view";

interface BrandPerformanceProps {
  title: string;
  metric: Metric;
  onMetricChange?: (m: Metric) => void;
  data: PerformanceGroup[];
  onChangeDataShowing: (val: string) => void;
  onChangeDataType : (val: string) => void;
}

export interface Brand {
  id: number;
  name: string;
  sales: number;
  achievement: number;
  growth: number;
  monthly: number[];
}

type Metric = "ach" | "growth";

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

// 🔸 Sample brand data

// 🔸 Helper to decide background color by value

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
  if (value < -5) return "#fca5a5"; // -10–-5%+
  if (value < 0) return "#fee2e2"; // -5–0%
  if (value < 5) return "#dcfce7"; // 0–5%
  if (value < 10) return "#86efac"; // 5–10%
  return "#16a34a"; // >10%
}

const Performance = ({
  title,
  metric,
  onMetricChange,
  data,
  onChangeDataShowing,
  onChangeDataType,
}: BrandPerformanceProps) => {
  const handleToggle = (val: Metric) => {
    onMetricChange?.(val);
    setInternalMetric(val);
  };

  const [internalMetric, setInternalMetric] = useState<Metric>(metric ?? "ACH");
  const currentMetric = metric ?? internalMetric;
  const [selectedRow, setSelectedRow] = useState<Brand | null>(null);
  const [openSelfSKUSheet, setOpenSelfSKUSheet] = useState(false);
  const [selected, setSelected] = useState("Self");
  const [openSKUSheet, setOpenSKUSheet] = useState(false);

  const group = data[0];
  if (!group) return <p>No data</p>;
  const isSelf = group.dataShowing === "self";
  const dataShowing = group.dataShowing;
 

  return (
    <>
      <Card>
        <CardHeader className="pb-3 mb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {selected === "Self"
              ? "Brand Performance"
              : "Geographical Performance"}
            <div className="ml-auto">
              <div className="ml-auto flex items-center gap-1">
                <Toggle
                  pressed={currentMetric === "ach"}
                  onPressedChange={() => handleToggle("ach")}
                  aria-pressed={currentMetric === "ach"}
                  aria-label="Show Grid"
                  className="px-3 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
                >
                  ACH
                </Toggle>
                <Toggle
                  pressed={currentMetric === "growth"}
                  onPressedChange={() => handleToggle("growth")}
                  aria-pressed={currentMetric === "growth"}
                  aria-label="Show Graph"
                  className="px-3 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
                >
                  Growth
                </Toggle>
              </div>
            </div>
            <div>
              <Select
                defaultValue={dataShowing}
                onValueChange={(val: string) => {
                  onChangeDataShowing(val);
                  setSelected(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table className="border rounded-md text-xs">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>{isSelf ? "Brand" : "Employee"}</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Ach %</TableHead>
                <TableHead className="text-right">Growth %</TableHead>
                {months.map((month, i) => (
                  <TableHead key={i} className="text-center">
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {group.columns.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={(row) => {
                    
                    if (isSelf) {
                      setOpenSelfSKUSheet(true);
                    } else {
                      setOpenSKUSheet(true);
                    }
                  }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">
                    {row.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{row.qty}</TableCell>
                  <TableCell className="text-right">
                    {row.achievementPercent}%
                  </TableCell>
                  <TableCell className="text-right">
                    {row.growthPercent}%
                  </TableCell>

                  {row.monthlyAch.map((val, i) => (
                    <TableCell
                      key={i}
                      className={clsx("text-[10px] text-center p-0")}
                      style={{
                        backgroundColor: getACHColor(val),
                        color: val < 85 || val > 110 ? "#fff" : "#000",
                      }}
                    >
                      {val}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BrandPerformanceDetails
        open={openSelfSKUSheet}
        onOpenChange={setOpenSelfSKUSheet}
        brand={selectedRow}
      />

      <GeographicalPerformanceDetails
        open={openSKUSheet}
        onOpenChange={setOpenSKUSheet}
        brand={selectedRow}
      />
    </>
  );
};

export default Performance;
