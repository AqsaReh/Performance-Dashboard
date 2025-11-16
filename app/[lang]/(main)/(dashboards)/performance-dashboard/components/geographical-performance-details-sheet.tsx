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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

// 🔸 Sample brand data

// 🔸 Helper to decide background color by value

const SKU = [
  {
    id: 1,
    code: "2398",
    desc: "abc",
    achievement: 123,
    growth: 25,
    monthly: [74, 83, 85, 79, 112, 66, 104, 68, 110, 65, 110, 84],
  },
  {
    id: 2,
    code: "2398",
    desc: "abc",
    achievement: 55,
    growth: 19,
    monthly: [113, 101, 115, 65, 61, 72, 64, 112, 114, 104, 82, 103],
  },
  {
    id: 3,
    code: "2398",
    desc: "abc",
    achievement: 90,
    growth: 32,
    monthly: [112, 114, 99, 101, 113, 64, 88, 111, 107, 65, 69, 105],
  },
  {
    id: 4,
    code: "2398",
    desc: "abc",
    achievement: 90,
    growth: 24,
    monthly: [112, 114, 78, 61, 83, 86, 111, 92, 96, 68, 99, 100],
  },
  {
    id: 5,
    code: "2398",
    desc: "abc",
    achievement: 90,
    growth: 45,
    monthly: [68, 72, 114, 80, 85, 116, 94, 100, 105, 110, 62, 118],
  },
];

const Brick = [
  {
    id: 1,
    code: "2398",
    desc: "abc",
    achievement: 123,
    growth: 25,
    monthly: [74, 83, 85, 79, 112, 66, 104, 68, 110, 65, 110, 84],
  },
  {
    id: 2,
    code: "2398",
    desc: "abc",
    achievement: 55,
    growth: 19,
    monthly: [113, 101, 115, 65, 61, 72, 64, 112, 114, 104, 82, 103],
  },
  {
    id: 3,
    code: "2398",
    desc: "abc",
    achievement: 90,
    growth: 32,
    monthly: [112, 114, 99, 101, 113, 64, 88, 111, 107, 65, 69, 105],
  },
  {
    id: 4,
    code: "2398",
    desc: "abc",
    achievement: 90,
    growth: 24,
    monthly: [112, 114, 78, 61, 83, 86, 111, 92, 96, 68, 99, 100],
  },
  {
    id: 5,
    code: "2398",
    desc: "abc",
    achievement: 90,
    growth: 45,
    monthly: [68, 72, 114, 80, 85, 116, 94, 100, 105, 110, 62, 118],
  },
];

const Chemist = [
  {
    id: 1,
    code: "2398",
    name: "abc",
    address: "xyz",
    sale: 123,
    achievement: 123,
    growth: 25,
    monthly: [74, 83, 85, 79, 112, 66, 104, 68, 110, 65, 110, 84],
  },
  {
    id: 2,
    code: "2398",
    name: "abc",
    address: "xyz",
    sale: 123,
    achievement: 55,
    growth: 19,
    monthly: [113, 101, 115, 65, 61, 72, 64, 112, 114, 104, 82, 103],
  },
  {
    id: 3,
    code: "2398",
    name: "abc",
    address: "xyz",
    sale: 123,
    achievement: 90,
    growth: 32,
    monthly: [112, 114, 99, 101, 113, 64, 88, 111, 107, 65, 69, 105],
  },
  {
    id: 4,
    code: "2398",
    name: "abc",
    address: "xyz",
    sale: 123,
    achievement: 90,
    growth: 24,
    monthly: [112, 114, 78, 61, 83, 86, 111, 92, 96, 68, 99, 100],
  },
  {
    id: 5,
    code: "2398",
    name: "abc",
    address: "xyz",
    sale: 123,
    achievement: 90,
    growth: 45,
    monthly: [68, 72, 114, 80, 85, 116, 94, 100, 105, 110, 62, 118],
  },
];

const City = [
  {
    id: 1,
    code: "2398",
    name: "Combivair",
    sales: 10123,
    achievement: 123,
    growth: 25,
    monthly: [74, 83, 85, 79, 112, 66, 104, 68, 110, 65, 110, 84],
  },
  {
    id: 2,
    code: "2398",
    name: "Cyrocin",
    sales: 7843,
    achievement: 55,
    growth: 19,
    monthly: [113, 101, 115, 65, 61, 72, 64, 112, 114, 104, 82, 103],
  },
  {
    id: 3,
    code: "2398",
    name: "Tagipmet",
    sales: 344,
    achievement: 90,
    growth: 32,
    monthly: [112, 114, 99, 101, 113, 64, 88, 111, 107, 65, 69, 105],
  },
  {
    id: 4,
    code: "2398",
    name: "Kestine",
    sales: 457,
    achievement: 90,
    growth: 24,
    monthly: [112, 114, 78, 61, 83, 86, 111, 92, 96, 68, 99, 100],
  },
  {
    id: 5,
    code: "2398",
    name: "Ulsanic",
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

const GeographicalPerformanceDetailsSheet = ({
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
  const [selected, setSelected] = useState("SKU");

  return (
    <>
      <Card>
        <CardHeader className="pb-3 mb-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="flex justify-between w-full">
              <div className=" flex items-center gap-1">
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
              <div className="flex flex-col gap-2">
                <Select
                  defaultValue="SKU"
                  onValueChange={(value) => setSelected(value)} // ✅ get value here
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SKU">SKU</SelectItem>
                    <SelectItem value="Chemist">Chemist</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                    <SelectItem value="Brick">Brick</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {selected === "SKU" ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-3 py-2 text-xs w-4">Sr</TableHead>

                    <TableHead className="px-3 py-2 text-xs text-left">
                      Prd.Code
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-left">
                      Prd.Desc
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
                  {SKU.map((b) => (
                    <TableRow
                      key={b.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setOpenSKUSheet(true)}
                    >
                      <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                        {b.id}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs font-medium">
                        {b.code}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-left">
                        {b.desc.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
                        {b.achievement}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
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
                          <div className="text-[10px] text-white font-medium py-2 text-center">
                            {val}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : selected === "Chemist" ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-3 py-2 text-xs w-4">Sr</TableHead>

                    <TableHead className="px-3 py-2 text-xs text-left">
                      Cust.Code
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-left">
                      Cust.Name
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-left">
                      Cust Address
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-right">
                      Sales
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-right">
                      Ach
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
                  {Chemist.map((b) => (
                    <TableRow
                      key={b.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setOpenSKUSheet(true)}
                    >
                      <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                        {b.id}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs font-medium">
                        {b.code}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs font-medium">
                        {b.name}
                      </TableCell>

                      <TableCell className="px-3 py-1.5 text-xs font-medium text-left">
                        {b.address.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
                        {b.sale}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
                        {b.achievement}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
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
                          <div className="text-[10px] text-white font-medium py-2 text-center">
                            {val}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : selected === "City" ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-3 py-2 text-xs w-4">Sr</TableHead>

                    <TableHead className="px-3 py-2 text-xs text-left">
                      City Code
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-left">
                      City Name
                    </TableHead>
                    <TableHead className="px-3 py-2 text-xs text-left">
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
                  {City.map((b) => (
                    <TableRow
                      key={b.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setOpenSKUSheet(true)}
                    >
                      <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                        {b.id}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs font-medium">
                        {b.code}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs font-medium">
                        {b.name}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-left">
                        {b.sales.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
                        {b.achievement}
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right">
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
                          <div className="text-[10px] text-white font-medium py-2 text-center">
                            {val}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <>
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-3 py-2 text-xs w-4">
                        Sr
                      </TableHead>

                      <TableHead className="px-3 py-2 text-xs text-left">
                        Brick.Code
                      </TableHead>
                      <TableHead className="px-3 py-2 text-xs text-left">
                        Brick.Dec
                      </TableHead>

                      <TableHead className="px-3 py-2 text-xs text-right">
                        Ach
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
                    {Brick.map((b) => (
                      <TableRow
                        key={b.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setOpenSKUSheet(true)}
                      >
                        <TableCell className="px-3 py-1.5 text-xs text-muted-foreground">
                          {b.id}
                        </TableCell>
                        <TableCell className="px-3 py-1.5 text-xs font-medium">
                          {b.code}
                        </TableCell>
                        <TableCell className="px-3 py-1.5 text-xs font-medium">
                          {b.desc}
                        </TableCell>

                        <TableCell className="px-3 py-1.5 text-xs text-right">
                          {b.achievement}
                        </TableCell>
                        <TableCell className="px-3 py-1.5 text-xs text-right">
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
                            <div className="text-[10px] text-white font-medium py-2 text-center">
                              {val}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default GeographicalPerformanceDetailsSheet;
