import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from "lucide-react";
import {
  Bar,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useId } from "react";

interface IncentiveData {
  month: string;
  incentive: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-popover-foreground">
          {label}: PKR {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

type IncentiveChartProps = {
  title: string;
  height?: number;
};

const IncentiveChart = ({ title, height = 240 }: IncentiveChartProps) => {
  const incentiveData: IncentiveData[] = [
    { month: "May", incentive: 115000 },
    { month: "Jun", incentive: 95000 },
    { month: "Jul", incentive: 108000 },
    { month: "Aug", incentive: 118000 },
    { month: "Sep", incentive: 98000 },
    { month: "Oct", incentive: 112000 },
  ];

  const average =
    incentiveData.reduce((acc, curr) => acc + curr.incentive, 0) /
    incentiveData.length;

  const gid = useId();
  const gradientId = `incentiveBarGradient-${gid}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={incentiveData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.5}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
          />
         
          <Bar
            dataKey="incentive"
            fill={`url(#${gradientId})`}
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
           <ReferenceLine
            y={average}
            stroke="hsl(var(--success))"
            strokeDasharray="8 4"
            strokeWidth={3}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-sm text-muted-foreground px-6 pb-6">
        Average (6 mo):{" "}
        <span className="font-semibold text-foreground">
          PKR {average.toLocaleString("en-PK", { maximumFractionDigits: 3 })}
        </span>
      </p>
    </Card>
  );
};

export default IncentiveChart;
