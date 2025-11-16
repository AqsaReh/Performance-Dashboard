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
import { AddEditPermissionSheet } from "./add-edit-permission-sheet";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table/datatable";
import { Permission } from "@/app/shared/sfa/permissions/utils/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PermissionsDataTableProps {
  data: Permission[];
  isLoading?: boolean;
  onEdit?: (permission: Permission) => void;
  onDelete?: (id: number) => void;
  selectedRows?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  allSelected?: boolean;
  someSelected?: boolean;
}

export function PermissionsDataTable({ 
  data, 
  isLoading, 
  onEdit, 
  onDelete,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  allSelected = false,
  someSelected = false
}: PermissionsDataTableProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // Define columns
  const columns: ColumnDef<Permission>[] = [
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
      header: "Permission",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.label || "—"}</span>
      ),
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => {
        const module = row.original.module;
        if (module) {
          return <span className="text-muted-foreground text-sm">{module.name}</span>;
        }
        const moduleId = row.original.module_id;
        if (moduleId) {
          // Find module in data if available
          const moduleFromData = data.find((p) => p.module_id === moduleId && p.module);
          return <span className="text-muted-foreground text-sm">{moduleFromData?.module?.name || `Module ${moduleId}`}</span>;
        }
        return <span className="text-muted-foreground text-sm">—</span>;
      },
    },
    {
      accessorKey: "guard_name",
      header: "Guard Name",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-muted">
          {row.original.guard_name}
        </Badge>
      ),
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

  const handleEdit = (permission: Permission) => {
    if (onEdit) {
      onEdit(permission);
    } else {
      setEditingPermission(permission);
      setIsEditSheetOpen(true);
    }
  };

  const handleDelete = (permission: Permission) => {
    if (onDelete) {
      onDelete(permission.id);
    }
  };

  const handleCloseSheets = () => {
    setIsAddSheetOpen(false);
    setIsEditSheetOpen(false);
    setEditingPermission(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading permissions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable<Permission>
          data={data}
          columns={columns}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 15, 20]}
          filterColumnIds={["name", "label"]}
          getRowId={(row) => row.id.toString()}
        />
      </div>

      {/* Add/Edit Sheets */}
      <AddEditPermissionSheet
        isOpen={isAddSheetOpen}
        onClose={handleCloseSheets}
        mode="add"
      />

      <AddEditPermissionSheet
        isOpen={isEditSheetOpen}
        onClose={handleCloseSheets}
        mode="edit"
        permission={editingPermission}
      />
    </TooltipProvider>
  );
}

