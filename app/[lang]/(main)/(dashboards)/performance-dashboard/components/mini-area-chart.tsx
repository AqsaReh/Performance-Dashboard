import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

interface ChartData {
  value: number;
  month: string;
}

interface MetricChartProps {
  data: ChartData[];
  color: string;
  metricName: string;
  height?: number;
}

const CustomTooltip = ({ active, payload, label, metricName }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-popover-foreground">
          {metricName}: {payload[0].value}
        </p>
        <p className="text-xs text-muted-foreground">{payload[0]?.payload?.month}</p>
      </div>
    );
  }
  return null;
}


const MiniAreaChart = ({ data, color, metricName, height = 80 }: MetricChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={`hsl(var(--${color}))`} stopOpacity={0.3} />
            <stop offset="95%" stopColor={`hsl(var(--${color}))`} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip metricName={metricName} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={`hsl(var(--${color}))`}
          strokeWidth={2}
          fill={`url(#gradient-${color})`}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MiniAreaChart;
