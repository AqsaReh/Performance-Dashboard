"use client";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const data = [
  { name: "Jan", growth: 40 },
  { name: "Feb", growth: -30 },
  { name: "Mar", growth: -20 },
  { name: "Apr", growth: 27 },
  { name: "May", growth: -18 },
  { name: "June", growth: 23 },
  { name: "Jul", growth: 34 },
  { name: "Aug", growth: 34 },
  { name: "Sep", growth: -34 },
  { name: "Oct", growth: 34 },
  { name: "Nov", growth: 34 },
  { name: "Dec", growth: 34 },
];

type SalesGrowthProps = {
  title: string;
  height?: number;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload) {
    return (
      <div className="bg-slate-900 text-primary-foreground p-3 rounded-md space-x-2 rtl:space-x-reverse ">
        <span>{`${payload[0].name}`}</span>
        <span>:</span>
        <span>{`${payload[0].value}%`}</span>
      </div>
    );
  }

  return null;
};

const SalesGrowth = ({ title, height = 320 }: SalesGrowthProps) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((t) => t.name === config);
  const css = theme?.cssVars[mode === "dark" ? "dark" : "light"];

  const green = `hsl(${css?.success ?? "158 64% 52%"})`;
  const red = `hsl(${css?.destructive ?? "0 84% 60%"})`;
  const grid = `hsl(${css?.chartGird})`;

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart height={height} data={data}>
            <CartesianGrid
              stroke={grid}
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: mode === "dark" ? "#cbd5e1" : "#64748b",
                fontSize: "10px",
              }}
              tickLine={false}
              stroke={grid}
              axisLine={false}
            />
            <YAxis
              tick={{
                fill: mode === "dark" ? "#cbd5e1" : "#64748b",
                fontSize: "10px",
              }}
              tickLine={false}
              stroke={grid}
            />

            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke={grid} />

            <Bar dataKey="growth" barSize={40} radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={`growth-${i}`} fill={d.growth >= 0 ? green : red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesGrowth;
