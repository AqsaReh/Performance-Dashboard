// "use client";
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// import { useThemeStore } from "@/store";
// import { useTheme } from "next-themes";
// import { themes } from "@/config/thems";
// import {
//   getGridConfig,
//   getYAxisConfig,
//   getLabel,
// } from "@/lib/appex-chart-options";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Target } from "lucide-react";

// type SaleVsTargetProps = {
//   title?: string;
//   height?: number;
//   sales: number[];
//   targets: number[];
//   months?: string[];
// };

// const DEFAULT_MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "June",
//   "Jul",
//   "Aug",
//   "Sept",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const SaleVsTarget = ({
//   title = "Sales Overview",
//   height = 300,
//   sales,
//   targets,
//   months = DEFAULT_MONTHS,
// }: SaleVsTargetProps) => {
//   const { theme: config } = useThemeStore();
//   const { theme: mode } = useTheme();
//   const theme = themes.find((t) => t.name === config);

//   const palette = theme?.cssVars[mode === "dark" ? "dark" : "light"];
//   const info = `hsl(${palette?.success})`;
//   const grid = `hsl(${palette?.chartGird})`;
//   const label = `hsl(${palette?.chartLabel})`;
//   const targetColor = `hsl(${palette?.warning})`;

//   const cats = months.slice(0, 12);
//   while (cats.length < 12) cats.push(`M${cats.length + 1}`);

//   const series = [
//     {
//       name: "Sales",
//       data: cats.map((x, i) => ({
//         x,
//         y: Number(sales[i] ?? 0),
//         goals: [
//           {
//             name: "Target",
//             value: Number(targets[i] ?? 0),
//             strokeHeight: 5,
//             strokeColor: targetColor,
//           },
//         ],
//       })),
//     },
//   ];

//   const options: any = {
//     chart: {
//       toolbar: { show: false },
//       zoom: { enabled: false },
//     },
//     stroke: { curve: "smooth", width: 2 },
//     plotOptions: { bar: { columnWidth: "50%" } },
//     dataLabels: { enabled: false },
//     colors: [info],
//     tooltip: {
//       theme: mode === "dark" ? "dark" : "light",
//     },
//     grid: getGridConfig(grid),
//     xaxis: {
//       categories: cats,
//       labels: getLabel(label),
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//       padding: { top: 0, right: 0, bottom: 0, left: 0 },
//     },
//     yaxis: getYAxisConfig(label),
//   };

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg font-semibold flex items-center gap-2">
//           {title}
//           <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//             <Target className="w-5 h-5 text-primary" />
//           </div>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Chart
//           options={options}
//           series={series}
//           type="bar"
//           height={height}
//           width="100%"
//         />
//       </CardContent>
//     </Card>
//   );
// };

// export default SaleVsTarget;
