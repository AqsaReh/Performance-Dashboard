// departments-grid-view.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Department } from "@/app/shared/master/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToggleDepartmentStatus } from "@/app/shared/master/hooks";
import { GridPagination } from "@/components/ui/grid-pagination";

interface DepartmentsGridViewProps {
  data: any[];
  onEdit?: (department: Department) => void;
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

export function DepartmentsGridView({ 
  data, 
  onEdit, 
  onDelete, 
  selectedRows = [], 
  onSelectRow,
  pagination,
  isLoading = false
}: DepartmentsGridViewProps) {
  const [togglingDepartmentIds, setTogglingDepartmentIds] = useState<Set<number>>(new Set());
  const toggleStatusMutation = useToggleDepartmentStatus();

  const handleEdit = (department: Department) => { if (onEdit) onEdit(department); };
  const handleDelete = (department: Department) => { if (onDelete) onDelete(department.id); };

  const handleToggleStatus = async (id: number, currentStatus: any) => {
    try {
      setTogglingDepartmentIds((prev) => new Set(prev).add(id));
      const current = (currentStatus === '1' || currentStatus === 1 || currentStatus === true) ? 1 : 0;
      await toggleStatusMutation.mutateAsync({ id, status: current === 1 ? 0 : 1 });
    } catch (error) { console.error("Failed to toggle status:", error); }
    finally {
      setTogglingDepartmentIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (data.length === 0 && !isLoading) {
    return <Card className="text-center py-8 text-muted-foreground">No departments available.</Card>;
  }

  return (
    <>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((department: any) => {
          const isActive = department.is_active == 1 || department.is_active === true || department.is_active === '1';
          const isLoading = togglingDepartmentIds.has(department.id);
          return (
            <Card key={department.id} className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(department.id)) ? 'ring-1 ring-primary' : ''}`}>
              <CardContent className="p-4">
                {/* ... existing card content (same as before) */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedRows.includes(String(department.id))} onCheckedChange={(checked) => onSelectRow && onSelectRow(String(department.id), !!checked)} aria-label="Select department" />
                    <div>
                      <h3 className="text-sm font-medium">{department.name}</h3>
                      <p className="text-muted-foreground text-xs truncate">Code: {department.code}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(department)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(department)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  {/* ... rest of your card content */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Short name:</span>
                    <span>{department.short_name || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Company:</span>
                    {typeof department.company === 'string' ? (
                      <span className="max-w-[220px] truncate">{department.company || "—"}</span>
                    ) : department.company ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="max-w-[220px] truncate">{department.company.name || "—"}</span>
                        <span>{department.company.code || "—"}</span>
                        <span>ID: {department.company.id || "—"}</span>
                      </div>
                    ) : department.company_id ? (
                      <span>ID: {department.company_id || "—"}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Division:</span>
                    {typeof department.division === 'string' ? (
                      <span className="max-w-[220px] truncate">{department.division || "—"}</span>
                    ) : department.division ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="max-w-[220px] truncate">{department.division.name || "—"}</span>
                        {department.division.code && (<span>{department.division.code || "—"}</span>)}
                      </div>
                    ) : department.division_id ? (
                      <span>ID: {department.division_id || "—"}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Switch 
                      checked={isActive} 
                      onCheckedChange={() => handleToggleStatus(department.id, department.is_active)} 
                      disabled={isLoading || toggleStatusMutation.isPending}
                      size="sm" 
                    />
                    <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {isLoading ? "Updating..." : (isActive ? "Active" : "Inactive")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
          itemLabel="departments"
        />
      )}
    </>
  );
}