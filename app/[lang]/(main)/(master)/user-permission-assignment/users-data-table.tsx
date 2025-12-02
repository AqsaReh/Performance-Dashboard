"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
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
import { AssignPermissionsSheet } from "./assign-permissions-sheet";
import { toast } from "sonner";
import DataTable from "@/components/ui/data-table/datatable";
import { User } from "@/app/shared/sfa/user-permission-assignment/utils/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UsersDataTableProps {
  data: User[];
  isLoading?: boolean;
  onAssignPermissions?: (user: User) => void;
}

export function UsersDataTable({ 
  data, 
  isLoading, 
  onAssignPermissions,
}: UsersDataTableProps) {
  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "full_name",
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-muted-foreground">{row.original.full_name}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "pno",
      header: "PNO",
      cell: ({ row }) => {
        const pno = row.original.pno || "";
        const cleanPno = pno.replace(/^(H-|C-|R-)/i, "");
        return <span className="text-muted-foreground text-sm">{cleanPno || "—"}</span>;
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissions = row.original.permissions;
        if (!permissions || (Array.isArray(permissions) && permissions.length === 0)) {
          return <span className="text-muted-foreground text-sm">—</span>;
        }
        const permissionNames = Array.isArray(permissions) 
          ? permissions.map((p: any) => typeof p === 'string' ? p : (p.label || p.name || p)).join(", ")
          : String(permissions);
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[300px] truncate text-sm text-muted-foreground cursor-help">
                {permissionNames}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px]">
              <p className="break-words">{permissionNames}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "permissions_count",
      header: "Permissions Count",
      cell: ({ row }) => {
        const count = row.original.permissions_count ?? (Array.isArray(row.original.permissions) ? row.original.permissions.length : 0);
        return (
          <Badge variant="outline" className="bg-muted">
            {count}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => handleAssignPermissions(row.original)} 
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Assign Permissions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleAssignPermissions = (user: User) => {
    if (onAssignPermissions) {
      onAssignPermissions(user);
    } else {
      setSelectedUser(user);
      setIsAssignSheetOpen(true);
    }
  };

  const handleCloseSheet = () => {
    setIsAssignSheetOpen(false);
    setSelectedUser(null);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable<User>
          data={data}
          columns={columns}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 15, 20]}
          filterColumnIds={["full_name", "email", "pno"]}
          getRowId={(row) => row.id.toString()}
        />
      </div>

      {/* Assign Permissions Sheet */}
      <AssignPermissionsSheet
        isOpen={isAssignSheetOpen}
        onClose={handleCloseSheet}
        user={selectedUser}
      />
    </TooltipProvider>
  );
}

