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
import { Skeleton } from "@/components/ui/skeleton";

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

export const BrandPerformanceTableSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Skeleton className="w-1/4 h-6 " />
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3 h-12  text-xs w-4">
                <Skeleton className=" h-6 " />
              </TableHead>
              <TableHead className="px-2 h-12 text-xs">
                <Skeleton className=" h-6 w-full" />
              </TableHead>
              <TableHead className="px-2 h-12 text-xs !text-center">
                <Skeleton className=" h-6 w-1/2 ml-auto" />
              </TableHead>
              <TableHead className="px-2 h-12 text-xs !text-right">
                <Skeleton className=" h-6 w-1/2 ml-auto" />
              </TableHead>
              <TableHead className="px-4 h-12 text-xs !text-right">
                <Skeleton className=" h-6 w-1/2 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow
                
              >
                <TableCell className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
                  <Skeleton className=" h-4 w-5" />
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs font-medium">
                  <Skeleton className=" h-4 " />
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs !text-right">
                   <Skeleton className=" h-4 w-1/2 ml-auto" />
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs !text-right">
                  <Skeleton className=" h-4 w-1/2 ml-auto" />
                </TableCell>
                <TableCell className="px-4 py-1.5 text-xs !text-right">
                   <Skeleton className=" h-4 w-1/2 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
