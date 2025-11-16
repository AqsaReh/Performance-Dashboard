import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileCardProps {
  name: string;
  role: string;
  team: string;
  startDate: string;
  endDate: string;
  avatarUrl?: string;
  badge?: number;
}

export const ProfileCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
            </div>
          </div>

          <div className="text-center mb-2 bg-muted/40 rounded-lg px-4 py-2 w-full">
            <h3 className=" flex justify-center ">
              <Skeleton className="w-1/3 h-4 mb-2" />
            </h3>
            <p className=" flex justify-center mb-4">
              <Skeleton className="w-3/4 h-4 " />
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Skeleton className="w-2/3 h-4 mb-1" />
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Skeleton className="w-2/3 h-4 mb-1" />
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Skeleton className="w-2/3 h-4 " />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
