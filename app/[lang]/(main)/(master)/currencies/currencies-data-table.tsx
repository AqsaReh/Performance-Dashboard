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
import { AddEditCurrencySheet } from "./add-edit-currency-sheet";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/data-table/datatable";
import { Currency } from "@/app/shared/master/utils/types";
import { useToggleCurrencyStatus } from "@/app/shared/master/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CurrenciesDataTableProps {
  data: Currency[];
  isLoading?: boolean;
  onEdit?: (currency: Currency) => void;
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

export function CurrenciesDataTable({ 
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
}: CurrenciesDataTableProps) {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [togglingCurrencyIds, setTogglingCurrencyIds] = useState<Set<number>>(new Set());

  const toggleStatusMutation = useToggleCurrencyStatus();

  // Define columns
  const columns: ColumnDef<Currency>[] = [
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
        const isSelected = selectedRows.includes(row.original.currency_id.toString());
        return (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (onSelectRow) {
                onSelectRow(row.original.currency_id.toString(), !!checked);
              }
            }}
            aria-label="Select row"
            disabled={row.original.code === "PKR" || row.original.currency_id == 99}
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-muted">{row.original.code}</Badge>
          {row.original.is_default === "1" && (
            <Badge variant="outline" className="bg-green-600 text-white border-green-600 text-xs">
              Default
            </Badge>
          )}
        </div>
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
      accessorKey: "symbol",
      header: "Symbol",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.symbol}</span>
      ),
    },
    {
      accessorKey: "is_default",
      header: "Default",
      cell: ({ row }) => (
        <Badge color={row.original.is_default === "1" ? "default" : "secondary"}>
          {row.original.is_default === "1" ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isLoading = togglingCurrencyIds.has(row.original.currency_id);
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.original.is_active === "1"}
              onCheckedChange={() => handleToggleStatus(row.original.currency_id, row.original.is_active)}
              disabled={row.original.currency_id == 99 || row.original.is_default === "1" || row.original.code === "PKR" || isLoading || toggleStatusMutation.isPending}
              size="sm"
            />
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Updating..." : (row.original.is_active === "1" ? "Active" : "Inactive")}
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
              // disabled={row.original.code === "PKR"}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(row.original)}
              className="text-destructive"
              disabled={row.original.code === "PKR"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleEdit = (currency: Currency) => {
    if (onEdit) {
      onEdit(currency);
    } else {
      setEditingCurrency(currency);
      setIsEditSheetOpen(true);
    }
  };

  const handleDelete = (currency: Currency) => {
    if (onDelete) {
      onDelete(currency.currency_id);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    // Prevent multiple clicks on the same currency
    if (togglingCurrencyIds.has(id) || toggleStatusMutation.isPending) return;
    
    setTogglingCurrencyIds(prev => new Set(prev).add(id));
    
    try {
      await toggleStatusMutation.mutateAsync({
        id,
        status: currentStatus === "1" ? 0 : 1
      });
      toast.success(`Currency status updated to ${currentStatus === "1" ? "Inactive" : "Active"}`);
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update currency status. Please try again.");
    } finally {
      setTogglingCurrencyIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleCloseSheets = () => {
    setIsAddSheetOpen(false);
    setIsEditSheetOpen(false);
    setEditingCurrency(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading currencies...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <DataTable<Currency>
          data={data}
          columns={columns}
          initialPageSize={pagination?.pageSize || 10}
          pageSizeOptions={[5, 10, 15, 20]}
          filterColumnIds={["code", "name", "symbol"]}
          getRowId={(row) => row.currency_id.toString()}
          pagination={pagination}
        />
      </div>

      {/* Add/Edit Sheets */}
      <AddEditCurrencySheet
        isOpen={isAddSheetOpen}
        onClose={handleCloseSheets}
        mode="add"
      />

      <AddEditCurrencySheet
        isOpen={isEditSheetOpen}
        onClose={handleCloseSheets}
        mode="edit"
        currency={editingCurrency}
      />
    </TooltipProvider>
  );
}
