"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Currency } from "@/app/shared/master/utils/types";
import { useToggleCurrencyStatus } from "@/app/shared/master/hooks";
import { GridPagination } from "@/components/ui/grid-pagination";

interface CurrenciesGridViewProps {
  data: any[];
  onEdit?: (currency: Currency) => void;
  onDelete?: (id: number) => void;
  selectedRows?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  isLoading?: boolean;
}

export function CurrenciesGridView({
  data,
  onEdit,
  onDelete,
  selectedRows = [],
  onSelectRow,
  pagination,
  isLoading = false
}: CurrenciesGridViewProps) {
  const [togglingCurrencyIds, setTogglingCurrencyIds] = useState<Set<number>>(new Set());
  const toggleStatusMutation = useToggleCurrencyStatus();

  const handleEdit = (currency: Currency) => {
    if (onEdit) onEdit(currency);
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
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setTogglingCurrencyIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No currencies available.
      </div>
    );
  }

  return (
    <>
     <div className=" md:min-h-[calc(100vh-420px)]">

      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((currency) => (
          <Card
            key={currency.currency_id}
            className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(currency.currency_id))
                ? 'ring-1 ring-primary shadow-xl'
                : 'border-border'
              } ${currency.is_active !== "1"
                ? 'opacity-80 grayscale '
                : 'bg-card'
              }`}
          >
            {/* Default Badge - Top Right */}
            {currency.is_default == "1" && (
              <div className="absolute -top-2 -right-2">
                <Badge className="shadow-md text-xs" color="success">
                  Default
                </Badge>
              </div>
            )}

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedRows.includes(String(currency.currency_id))}
                    onCheckedChange={(checked) => onSelectRow && onSelectRow(String(currency.currency_id), !!checked)}
                    aria-label="Select currency"
                    disabled={currency.currency_id == 99 || currency.code === "PKR"}
                  />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold truncate">
                      {currency.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {currency.code} • {currency.symbol}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      // disabled={currency.currency_id == 99 || currency.code === "PKR"}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(currency)} >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(currency)}
                      className="text-destructive"
                      disabled={currency.code === "PKR"}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium"></span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={currency.is_active === "1"}
                      onCheckedChange={() => handleToggleStatus(currency.currency_id, currency.is_active)}
                      disabled={currency.currency_id == 99 || currency.is_default === "1" || currency.code === "PKR" || togglingCurrencyIds.has(currency.currency_id) || toggleStatusMutation.isPending}
                      size="sm"
                    />
                    <span className={`text-sm font-medium ${currency.is_active === "1" ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {togglingCurrencyIds.has(currency.currency_id) ? "Updating..." : (currency.is_active === "1" ? "Active" : "Inactive")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <GridPagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          itemLabel="currencies"
        />
      )}
    </>
  );
}
