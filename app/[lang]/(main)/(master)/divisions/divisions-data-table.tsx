"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table/datatable";
import type { Division } from "@/app/shared/master/utils/types";
import { useToggleDivisionStatus } from "@/app/shared/master/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DivisionsDataTableProps {
  data: Division[];
  isLoading?: boolean;
  onEdit?: (division: Division) => void;
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

export function DivisionsDataTable({ 
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
}: DivisionsDataTableProps) {
  const [togglingDivisionIds, setTogglingDivisionIds] = useState<Set<number>>(new Set());
  const toggleStatusMutation = useToggleDivisionStatus();

  // Define columns
  const columns: ColumnDef<Division>[] = [
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
        <span className="font-medium">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-muted">{row.original.code}</Badge>
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
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => {
        const company = row.original.company;
        return (
          <div className="text-muted-foreground">
            {company ? (
              <div className="flex flex-col">
                <span className="font-medium text-sm">{company.name}</span>
                <span className="text-xs text-muted-foreground">
                  {company.code} • ID: {company.id}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="soft">ID: {row.original.company_id}</Badge>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isLoading = togglingDivisionIds.has(row.original.id);
        const isActive = row.original.is_active == 1 || row.original.is_active === true || row.original.is_active === 1;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={() => handleToggleStatus(row.original.id, row.original.is_active)}
              disabled={isLoading || toggleStatusMutation.isPending}
              size="sm"
            />
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Updating..." : (isActive ? "Active" : "Inactive")}
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
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
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

  const handleEdit = (division: Division) => {
    if (onEdit) {
      onEdit(division);
    }
  };

  const handleDelete = (division: Division) => {
    if (onDelete) {
      onDelete(division.id);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: any) => {
    // Prevent multiple clicks on the same division
    if (togglingDivisionIds.has(id) || toggleStatusMutation.isPending) return;
    
    setTogglingDivisionIds(prev => new Set(prev).add(id));
    
    try {
      const current = (currentStatus === '1' || currentStatus === 1 || currentStatus === true) ? 1 : 0;
      await toggleStatusMutation.mutateAsync({ id, status: current === 1 ? 0 : 1 });
      toast.success(`Division status updated to ${current === 1 ? "Inactive" : "Active"}`);
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update division status. Please try again.");
    } finally {
      setTogglingDivisionIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading divisions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable<Division>
          data={data}
          columns={columns}
          initialPageSize={pagination?.pageSize || 10}
          pageSizeOptions={[5, 10, 15, 20]}
          filterColumnIds={["code", "name"]}
          getRowId={(row) => row.id.toString()}
          pagination={pagination}
        />
      </div>
    </TooltipProvider>
  );
}