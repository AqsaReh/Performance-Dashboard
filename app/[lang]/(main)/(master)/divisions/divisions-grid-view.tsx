"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { GridPagination } from "@/components/ui/grid-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Division } from "@/app/shared/master/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToggleDivisionStatus } from "@/app/shared/master/hooks";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

interface DivisionsGridViewProps {
  data: any[];
  onEdit?: (division: Division) => void;
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

export function DivisionsGridView({ 
  data, 
  onEdit, 
  onDelete, 
  selectedRows = [], 
  onSelectRow,
  pagination,
  isLoading = false
}: DivisionsGridViewProps) {
  const [togglingDivisionIds, setTogglingDivisionIds] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(null);
  const toggleStatusMutation = useToggleDivisionStatus();

  const handleEdit = (division: Division) => { if (onEdit) onEdit(division); };
  const handleDelete = (division: Division) => { setDivisionToDelete(division); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => { if (!divisionToDelete || !onDelete) return; try { await onDelete(divisionToDelete.id); } catch { } };

  const handleToggleStatus = async (id: number, currentStatus: any) => {
    try {
      const current = typeof currentStatus === 'boolean' ? (currentStatus ? 1 : 0) : Number(currentStatus);
      await toggleStatusMutation.mutateAsync({ id, status: current === 1 ? 0 : 1 });
    } catch (error) { console.error("Failed to toggle status:", error); }
  };

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No divisions available.</div>;
  }

  return (
    <>
      <div className=" md:min-h-[calc(100vh-420px)]">
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((division: any) => {
          const isActive = division.is_active == 1 || division.is_active === true || division.is_active === '1';
          const isLoading = togglingDivisionIds.has(division.id);
          return (
            <Card key={division.id} className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(division.id)) ? 'ring-1 ring-primary' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedRows.includes(String(division.id))}
                      onCheckedChange={(checked) => onSelectRow && onSelectRow(String(division.id), !!checked)}
                      aria-label="Select division"
                    />
                    <div>
                      <h3 className="text-sm font-medium truncate">{division.name}</h3>
                      <p className="text-muted-foreground text-xs truncate ">Code: {division.code}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(division)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(division)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Company:</span>
                    {division.company ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{division.company.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div className="space-y-3 pt-2 ">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">Company Code:
                        <Badge variant="soft">{division.company ? division.company.code : "N/A"}</Badge>
                      </span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => handleToggleStatus(division.id, division.is_active)}
                          disabled={isLoading || toggleStatusMutation.isPending}
                          size="sm"
                        />
                        <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {isLoading ? "Updating..." : (isActive ? "Active" : "Inactive")}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          );
        })}
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
          itemLabel="divisions"
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setDivisionToDelete(null); }}
        onConfirm={handleConfirmDelete}
        toastMessage="Division deleted successfully"
      />
    </>
  );
}


