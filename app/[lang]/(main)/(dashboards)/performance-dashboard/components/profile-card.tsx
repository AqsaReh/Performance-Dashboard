import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";

interface ProfileCardProps {
  name: string;
  role: string;
  team: string;
  startDate: string;
  endDate: string;
  avatarUrl?: string;
  badge?: number;
}

export const ProfileCard = ({
  name,
  role,
  team,
  startDate,
  endDate,
  avatarUrl,
  badge = 2,
}: ProfileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <Avatar className="w-full h-full border-4 border-card">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-2xl font-bold bg-muted">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            {badge && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                {badge}
              </div>
            )}
          </div>

          <div className="text-center mb-2 bg-muted/40 rounded-lg px-4 py-2 w-full">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <p className="text-sm font-medium text-muted-foreground mb-4">{role}</p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{team}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span >{startDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{endDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
