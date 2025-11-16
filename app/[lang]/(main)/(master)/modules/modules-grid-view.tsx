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
import { Module } from "@/app/shared/sfa/modules/utils/types";
import { useToggleModuleStatus } from "@/app/shared/sfa/modules/hooks";
import { toast } from "sonner";
import { GridPagination } from "@/components/ui/grid-pagination";

interface ModulesGridViewProps {
  data: any[];
  onEdit?: (module: Module) => void;
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

export function ModulesGridView({
  data,
  onEdit,
  onDelete,
  selectedRows = [],
  onSelectRow,
  pagination,
  isLoading = false
}: ModulesGridViewProps) {
  const [togglingModuleIds, setTogglingModuleIds] = useState<Set<number>>(new Set());
  const toggleStatusMutation = useToggleModuleStatus();

  const handleEdit = (module: Module) => {
    if (onEdit) onEdit(module);
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

  if (data.length === 0) {
    return (
      <Card className="text-center py-8 text-muted-foreground">
        No modules available.
      </Card>
    );
  }

  return (
    <>
    <div className=" md:min-h-[calc(100vh-420px)]"> 
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((module: any) => {
          // Use parent_name if available, otherwise lookup
          const parentName = module.parent_name || (() => {
            const parentId = module.parent_id ? Number(module.parent_id) : null;
            if (parentId) {
              const parentModule = data.find((m: any) => m.id === parentId);
              return parentModule?.name || null;
            }
            return null;
          })();
          
          return (
            <Card
              key={module.id}
              className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(module.id))
                  ? 'ring-1 ring-primary shadow-xl'
                  : 'border-border'
                } ${module.status !== "active"
                  ? 'opacity-80 grayscale '
                  : 'bg-card'
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Checkbox
                      checked={selectedRows.includes(String(module.id))}
                      onCheckedChange={(checked) => onSelectRow && onSelectRow(String(module.id), !!checked)}
                      aria-label="Select module"
                    />
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold truncate">
                        {module.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {module.slug ? module.slug : module.icon ? module.icon : "—"}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(module)} >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(module)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  {module.route && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Route:</span>
                      <span className="text-xs font-medium truncate ml-2">{module.route}</span>
                    </div>
                  )}
                  {module.icon && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Icon:</span>
                      <span className="text-xs">{module.icon || "—"}</span>
                    </div>
                  )}
                   
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Parent:</span>
                      <span className="text-xs">{parentName || "—"}</span>
                    </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Order:</span>
                    <Badge variant="outline" className="text-xs">{module.order_no ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 border-t pt-2">
                    <span className="text-sm font-medium"></span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={module.status === "active"}
                        onCheckedChange={() => handleToggleStatus(module.id, module.status)}
                        disabled={togglingModuleIds.has(module.id) || toggleStatusMutation.isPending}
                        size="sm"
                      />
                      <span className={`text-sm font-medium ${module.status === "active" ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {togglingModuleIds.has(module.id) ? "Updating..." : (module.status === "active" ? "Active" : "Inactive")}
                      </span>
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
          itemLabel="module(s)"
        />
      )}
    </>
  );
}
