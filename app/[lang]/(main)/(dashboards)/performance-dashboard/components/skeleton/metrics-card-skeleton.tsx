import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardProps {
  title: string;
  value: string;
  achievement: number;
  achievementGoal: number;
  goal: number;
  goalPercentage: number;
  trend: "up" | "down";
}

export const MetricsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Skeleton className="w-1/3 h-5 " />
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {/* <Target className="w-5 h-5 text-primary" /> */}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="text-5xl font-semibold py-3 text-foreground">
            <Skeleton className="w-1/3 h-12 " />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-1/4 h-5 mb-1" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="w-1/3 h-5 mb-1" />
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              <Skeleton className="w-1/4 h-5 " />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
