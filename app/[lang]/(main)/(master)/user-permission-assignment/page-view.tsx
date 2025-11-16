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
import { AssignPermissionsSheet } from "./assign-permissions-sheet";
import { useUsersList } from "@/app/shared/sfa/user-permission-assignment/hooks";
import { User } from "@/app/shared/sfa/user-permission-assignment/utils/types";
import CurrencyCardSkeleton from "@/components/ui/skeletons/CurrencyCardSkeleton";

export default function UserPermissionAssignmentPageView() {
  const { data: usersData, isLoading, error } = useUsersList();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const allUsers: User[] = useMemo(() => {
    // Debug: Log the response structure
    if (process.env.NODE_ENV === "development" && usersData) {
      console.log("Users Data Response:", usersData);
    }
    // Handle different response structures
    if (!usersData) return [];
    // If data is directly an array
    if (Array.isArray(usersData)) return usersData;
    // If data is in a data property
    if (usersData.data && Array.isArray(usersData.data)) return usersData.data;
    // If data is in a nested structure
    if (usersData.success && usersData.data && Array.isArray(usersData.data)) return usersData.data;
    return [];
  }, [usersData]);

  const handleAssignPermissions = (user: User) => {
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
          <BreadcrumbItem>User Permission</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load users. Please try again.</p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-sm text-muted-foreground mt-2">
              Error: {error instanceof Error ? error.message : String(error)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
        <BreadcrumbItem>User Permission Assignment</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              User Permission
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
          ) : allUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users available.
              {process.env.NODE_ENV === "development" && (
                <p className="text-xs mt-2">
                  Debug: usersData = {JSON.stringify(usersData, null, 2)}
                </p>
              )}
            </div>
          ) : viewMode === "list" ? (
            <Card className="py-0">
              <UsersDataTable
                data={allUsers}
                isLoading={false}
                onAssignPermissions={handleAssignPermissions}
              />
            </Card>
          ) : (
            <div className="p-0">
              <UsersGridView
                data={allUsers}
                onAssignPermissions={handleAssignPermissions}
              />
            </div>
          )}
        </CardContent> 

      <AssignPermissionsSheet
        isOpen={isAssignSheetOpen}
        onClose={handleCloseSheet}
        user={selectedUser}
      />
    </Fragment>
  );
}

