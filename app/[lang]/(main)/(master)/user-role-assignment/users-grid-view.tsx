"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserCog,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/app/shared/sfa/user-role-assignment/utils/types";

interface UsersGridViewProps {
  data: any[];
  onAssignRoles?: (user: User) => void;
}

export function UsersGridView({
  data,
  onAssignRoles,
}: UsersGridViewProps) {
  const handleAssignRoles = (user: User) => {
    if (onAssignRoles) onAssignRoles(user);
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
          const roles = user.roles || [];
          const rolesCount = user.roles_count ?? (Array.isArray(roles) ? roles.length : 0);
          
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
                      <DropdownMenuItem onClick={() => handleAssignRoles(user)} >
                        <UserCog className="h-4 w-4 mr-2" />
                        Assign Roles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Roles:</span>
                    <div className="flex-1 text-right">
                      {roles && Array.isArray(roles) && roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {roles.slice(0, 3).map((role: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {typeof role === 'string' ? role : (role.name || role)}
                            </Badge>
                          ))}
                          {roles.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{roles.length - 3} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Roles Count:</span>
                    <Badge variant="secondary" className="text-xs">
                      {rolesCount}
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

