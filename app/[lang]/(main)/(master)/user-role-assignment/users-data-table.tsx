"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
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
import { AssignRolesSheet } from "./assign-roles-sheet";
import { toast } from "sonner";
import DataTable from "@/components/ui/data-table/datatable";
import { User } from "@/app/shared/sfa/user-role-assignment/utils/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UsersDataTableProps {
  data: User[];
  isLoading?: boolean;
  onAssignRoles?: (user: User) => void;
}

export function UsersDataTable({ 
  data, 
  isLoading, 
  onAssignRoles,
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
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.original.roles;
        if (!roles || (Array.isArray(roles) && roles.length === 0)) {
          return <span className="text-muted-foreground text-sm">—</span>;
        }
        const roleNames = Array.isArray(roles) 
          ? roles.map((r: any) => typeof r === 'string' ? r : (r.name || r)).join(", ")
          : String(roles);
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[300px] truncate text-sm text-muted-foreground cursor-help">
                {roleNames}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px]">
              <p className="break-words">{roleNames}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "roles_count",
      header: "Roles Count",
      cell: ({ row }) => {
        const count = row.original.roles_count ?? (Array.isArray(row.original.roles) ? row.original.roles.length : 0);
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
              onClick={() => handleAssignRoles(row.original)} 
            >
              <UserCog className="h-4 w-4 mr-2" />
              Assign Roles
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleAssignRoles = (user: User) => {
    if (onAssignRoles) {
      onAssignRoles(user);
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

      {/* Assign Roles Sheet */}
      <AssignRolesSheet
        isOpen={isAssignSheetOpen}
        onClose={handleCloseSheet}
        user={selectedUser}
      />
    </TooltipProvider>
  );
}

