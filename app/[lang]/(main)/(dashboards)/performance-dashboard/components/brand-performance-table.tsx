import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Target } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  sales: number;
  achievement: number;
  growth: number;
}

const brands: Brand[] = [
  { id: 1, name: "Combivair", sales: 10123, achievement: 123, growth: 25 },
  { id: 2, name: "Cyrocin", sales: 7843, achievement: 55, growth: 19 },
  { id: 3, name: "Tagipmet", sales: 344, achievement: 90, growth: 32 },
  { id: 4, name: "Kestine", sales: 457, achievement: 90, growth: 24 },
  { id: 5, name: "Ulsanic", sales: 578, achievement: 90, growth: 45 },
  { id: 6, name: "Zinetac", sales: 678, achievement: 90, growth: 12 },
  { id: 7, name: "Zinetac DSR", sales: 789, achievement: 90, growth: 5 },
  { id: 8, name: "Zinetac DSR", sales: 789, achievement: 90, growth: 5 },
  { id: 9, name: "Zinetac DSR", sales: 789, achievement: 90, growth: 5 },
  { id: 10, name: "Zinetac DSR", sales: 789, achievement: 90, growth: 5 },
];

interface BrandPerformanceTableProps {
  title: string;
}

export const BrandPerformanceTable = ({ title }: BrandPerformanceTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3 h-12 text-xs w-4">Sr.</TableHead>
              <TableHead className="px-2 h-12 text-xs">Brand Name</TableHead>
              <TableHead className="px-2 h-12 text-xs !text-right">Sale</TableHead>
              <TableHead className="px-2 h-12 text-xs !text-right">ACH %</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Growth</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Jan</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Feb</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">March</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">April</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">May</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">June</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Jul</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Aug</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Sep</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Oct</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Nov</TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">Dec</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow
                key={brand.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
                  {brand.id}
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs font-medium">{brand.name}</TableCell>
                <TableCell className="px-4 py-1.5 text-xs !text-right">
                  {brand.sales.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs !text-right">
                  {brand.achievement}
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs !text-right">{brand.growth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
