"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/app/shared/sfa/user-permission-assignment/utils/types";

interface UsersGridViewProps {
  data: any[];
  onAssignPermissions?: (user: User) => void;
}

export function UsersGridView({
  data,
  onAssignPermissions,
}: UsersGridViewProps) {
  const handleAssignPermissions = (user: User) => {
    if (onAssignPermissions) onAssignPermissions(user);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users available.
      </div>
    );
  }

  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((user: any) => {
          const pno = user.pno || "";
          const cleanPno = pno.replace(/^(H-|C-|R-)/i, "");
          const permissions = user.permissions || [];
          const permissionsCount = user.permissions_count ?? (Array.isArray(permissions) ? permissions.length : 0);
          
          return (
            <Card
              key={user.id}
              className="relative group transition-all duration-300 hover:shadow-xl border-0 border-border bg-card"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold truncate">
                      {user.full_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    {cleanPno && (
                      <p className="text-xs text-muted-foreground mt-1">
                        PNO: {cleanPno}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAssignPermissions(user)} >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Assign Permissions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Permissions:</span>
                    <div className="flex-1 text-right">
                      {permissions && Array.isArray(permissions) && permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {permissions.slice(0, 3).map((permission: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {typeof permission === 'string' ? permission : (permission.label || permission.name || permission)}
                            </Badge>
                          ))}
                          {permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Permissions Count:</span>
                    <Badge variant="outline" className="text-xs">
                      {permissionsCount}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

