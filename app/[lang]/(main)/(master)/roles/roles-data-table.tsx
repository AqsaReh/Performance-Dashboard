"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Edit, 
  Trash2, 
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEditRoleSheet } from "./add-edit-role-sheet";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table/datatable";
import { Role } from "@/app/shared/sfa/roles/utils/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RolesDataTableProps {
  data: Role[];
  isLoading?: boolean;
  onEdit?: (role: Role) => void;
  onDelete?: (id: number) => void;
  selectedRows?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  allSelected?: boolean;
  someSelected?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export function RolesDataTable({ 
  data, 
  isLoading, 
  onEdit, 
  onDelete,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  allSelected = false,
  someSelected = false,
  pagination
}: RolesDataTableProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // Define columns
  const columns: ColumnDef<Role>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={allSelected || (someSelected && "indeterminate")}
          onCheckedChange={(value) => {
            if (onSelectAll) {
              onSelectAll(!!value);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const isSelected = selectedRows.includes(row.original.id.toString());
        return (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (onSelectRow) {
                onSelectRow(row.original.id.toString(), !!checked);
              }
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">{row.original.name}</span>
      ),
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
          ? permissions.map((p: any) => typeof p === 'string' ? p : (p.name || p)).join(", ")
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
      accessorKey: "users_count",
      header: "Users",
      cell: ({ row }) => {
        const count = row.original.users_count ?? (Array.isArray(row.original.users) ? row.original.users.length : 0);
        return (
          <Badge variant="soft" className="bg-muted">
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
              onClick={() => handleEdit(row.original)} 
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(row.original)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleEdit = (role: Role) => {
    if (onEdit) {
      onEdit(role);
    } else {
      setEditingRole(role);
      setIsEditSheetOpen(true);
    }
  };

  const handleDelete = (role: Role) => {
    if (onDelete) {
      onDelete(role.id);
    }
  };

  const handleCloseSheets = () => {
    setIsAddSheetOpen(false);
    setIsEditSheetOpen(false);
    setEditingRole(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading roles...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable<Role>
          data={data}
          columns={columns}
          initialPageSize={pagination?.pageSize || 10}
          pageSizeOptions={[5, 10, 15, 20]}
          filterColumnIds={["name"]}
          getRowId={(row) => row.id.toString()}
          pagination={pagination}
        />
      </div>

      {/* Add/Edit Sheets */}
      <AddEditRoleSheet
        isOpen={isAddSheetOpen}
        onClose={handleCloseSheets}
        mode="add"
      />

      <AddEditRoleSheet
        isOpen={isEditSheetOpen}
        onClose={handleCloseSheets}
        mode="edit"
        role={editingRole}
      />
    </TooltipProvider>
  );
}

