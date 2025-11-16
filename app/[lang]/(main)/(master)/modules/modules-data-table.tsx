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
import { AddEditModuleSheet } from "./add-edit-module-sheet";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table/datatable";
import { Module } from "@/app/shared/sfa/modules/utils/types";
import { useToggleModuleStatus } from "@/app/shared/sfa/modules/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModulesDataTableProps {
  data: Module[];
  isLoading?: boolean;
  onEdit?: (module: Module) => void;
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

export function ModulesDataTable({ 
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
}: ModulesDataTableProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [togglingModuleIds, setTogglingModuleIds] = useState<Set<number>>(new Set());

  const toggleStatusMutation = useToggleModuleStatus();

  // Define columns
  const columns: ColumnDef<Module>[] = [
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
      accessorKey: "sr",
      header: "Sr.",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.slug ? (
            <Badge variant="outline" className="bg-muted">{row.original.slug}</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.route || "—"}</span>
      ),
    },
    {
      accessorKey: "parent",
      header: "Parent",
      cell: ({ row }) => {
        // Use parent_name if available, otherwise lookup
        if (row.original.parent_name) {
          return <span className="text-muted-foreground text-sm">{row.original.parent_name}</span>;
        }
        const parentId = row.original.parent_id ? Number(row.original.parent_id) : null;
        if (parentId) {
          const parentModule = data.find((m) => m.id === parentId);
          return <span className="text-muted-foreground text-sm">{parentModule?.name || "—"}</span>;
        }
        return <span className="text-muted-foreground text-sm">—</span>;
      },
    },
    {
      accessorKey: "order_no",
      header: "Order",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.order_no ?? 0}</span>
      ),
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.icon ? (
            <Badge variant="outline" className="bg-muted text-xs">{row.original.icon}</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isLoading = togglingModuleIds.has(row.original.id);
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.original.status === "active"}
              onCheckedChange={() => handleToggleStatus(row.original.id, row.original.status)}
              disabled={isLoading || toggleStatusMutation.isPending}
              size="sm"
            />
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Updating..." : (row.original.status === "active" ? "Active" : "Inactive")}
            </span>
          </div>
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

  const handleEdit = (module: Module) => {
    if (onEdit) {
      onEdit(module);
    } else {
      setEditingModule(module);
      setIsEditSheetOpen(true);
    }
  };

  const handleDelete = (module: Module) => {
    if (onDelete) {
      onDelete(module.id);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    // Prevent multiple clicks on the same module
    if (togglingModuleIds.has(id) || toggleStatusMutation.isPending) return;
    
    setTogglingModuleIds(prev => new Set(prev).add(id));
    
    try {
      await toggleStatusMutation.mutateAsync({
        id,
        status: currentStatus === "active" ? 0 : 1
      });
      toast.success(`Module status updated to ${currentStatus === "active" ? "Inactive" : "Active"}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update module status. Please try again.";
      toast.error(errorMessage);
    } finally {
      setTogglingModuleIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleCloseSheets = () => {
    setIsAddSheetOpen(false);
    setIsEditSheetOpen(false);
    setEditingModule(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading modules...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable<Module>
          data={data}
          columns={columns}
          initialPageSize={pagination?.pageSize || 10}
          pageSizeOptions={[5, 10, 15, 20]}
          filterColumnIds={["name", "slug", "route"]}
          getRowId={(row) => row.id.toString()}
          pagination={pagination}
        />
      </div>

      {/* Add/Edit Sheets */}
      <AddEditModuleSheet
        isOpen={isAddSheetOpen}
        onClose={handleCloseSheets}
        mode="add"
      />

      <AddEditModuleSheet
        isOpen={isEditSheetOpen}
        onClose={handleCloseSheets}
        mode="edit"
        module={editingModule}
      />
    </TooltipProvider>
  );
}
