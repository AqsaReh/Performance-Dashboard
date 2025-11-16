import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryCardSkeleton() {
  return (
    <Card className="p-6 dark:border dark:border-default-200">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}