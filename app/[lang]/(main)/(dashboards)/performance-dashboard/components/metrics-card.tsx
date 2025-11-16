import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  achievement: number;
  achievementGoal: number;
  goal: number;
  goalPercentage: number;
  trend: "up" | "down";
}

export const MetricsCard = ({
  title,
  value,
  achievement,
  achievementGoal,
  goal,
  goalPercentage,
  trend,
}: MetricsCardProps) => {
  const achievementPercent = Math.round((achievement / achievementGoal) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <div className="ml-auto w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="text-5xl font-semibold py-3 text-foreground">
            {value}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                ACH :
              </span>
              <span className="text-success flex items-center">
                <span className="text-base font-semibold">
                  {achievementPercent}
                </span>
                <span className="text-xs">%</span>
              </span>
              {/* {trend === "up" ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )} */}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                GOLY :
              </span>
              <span className="flex items-center gap-1">
                <span className="text-base font-semibold">{goal}</span>
                <span className="text-destructive">
                  (-{goalPercentage}
                  <span className="text-xs"> %</span>)
                </span>
              </span>
              <TrendingDown className="w-5 h-5 text-destructive mt-1" />
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              vs Previous Month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
