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

interface ExpenseData {
  month: string;
  expense: number;
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

type ExpenseChartProps = {
  title: string;
  height?: number;
};

const ExpenseChart = ({ title, height = 240 }: ExpenseChartProps) => {
  const expenseData: ExpenseData[] = [
    { month: "May", expense: 115000 },
    { month: "Jun", expense: 95000 },
    { month: "Jul", expense: 108000 },
    { month: "Aug", expense: 118000 },
    { month: "Sep", expense: 98000 },
    { month: "Oct", expense: 112000 },
  ];

  const average =
    expenseData.reduce((acc, curr) => acc + curr.expense, 0) /
    expenseData.length;

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
          data={expenseData}
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
            dataKey="expense"
            fill={`url(#${gradientId})`} 
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
             <ReferenceLine
            y={average}
            ifOverflow="extendDomain"
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

export default ExpenseChart;
