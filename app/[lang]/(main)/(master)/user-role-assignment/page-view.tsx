'use client';

import { useMemo, useState, Fragment } from "react";
import { UsersDataTable } from "./users-data-table";
import { UsersGridView } from "./users-grid-view";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDataTable from "@/components/ui/skeletons/TableSkeleton"; 
import { AssignRolesSheet } from "./assign-roles-sheet";
import { useUsersList } from "@/app/shared/sfa/user-role-assignment/hooks";
import { User } from "@/app/shared/sfa/user-role-assignment/utils/types";
import CurrencyCardSkeleton from "@/components/ui/skeletons/CurrencyCardSkeleton";

export default function UserRoleAssignmentPageView() {
  const { data: usersData, isLoading, error } = useUsersList();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const allUsers: User[] = useMemo(() => usersData?.data || [], [usersData]);

  const handleAssignRoles = (user: User) => {
    setSelectedUser(user);
    setIsAssignSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsAssignSheetOpen(false);
    setSelectedUser(null);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
          <BreadcrumbItem>User Role</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load users. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
        <BreadcrumbItem>User Role Assignment</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              User Role
            </div>
          </div>
          <div className="flex-none flex items-center gap-3">
            <div className="flex-1 flex gap-3">
              <Button
                size="icon"
                variant="outline"
                className={cn("hover:bg-transparent  ", {
                  "hover:border-primary hover:text-primary": viewMode === "grid",
                  "hover:border-muted-foreground hover:text-muted-foreground": viewMode !== "grid",
                })}
                color={viewMode === "grid" ? "primary" : "secondary"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className={cn("hover:bg-transparent  ", {
                  "hover:border-primary hover:text-primary": viewMode === "list",
                  "hover:border-muted-foreground hover:text-muted-foreground": viewMode !== "list",
                })}
                color={viewMode === "list" ? "primary" : "secondary"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

       
        <CardContent className="p-0">
          {isLoading ? (
            viewMode === "list" ? (
              <LoadingDataTable rows={5} columns={6} />
            ) : (
              <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5 ">
                {[...Array(8)].map((_, i) => (
                  <CurrencyCardSkeleton key={i} />
                ))}
              </div>
            )
          ) : viewMode === "list" ? (
            <Card className="py-0">
              <UsersDataTable
                data={allUsers}
                isLoading={false}
                onAssignRoles={handleAssignRoles}
              />
            </Card>
          ) : (
            <div className="p-0">
              <UsersGridView
                data={allUsers}
                onAssignRoles={handleAssignRoles}
              />
            </div>
          )}
        </CardContent> 

      <AssignRolesSheet
        isOpen={isAssignSheetOpen}
        onClose={handleCloseSheet}
        user={selectedUser}
      />
    </Fragment>
  );
}

