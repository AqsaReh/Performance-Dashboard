"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const CurrencyCardSkeleton = () => {
  return (
    <Card className="dark:border dark:border-default-200">
      <CardContent className="p-4">
        {/* Header with checkbox and menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Skeleton className="h-4 w-4 rounded" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Divider */}
        <Skeleton className="w-full h-px mb-3" />

        {/* Status section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-9 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyCardSkeleton;