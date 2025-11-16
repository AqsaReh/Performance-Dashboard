'use client';

import { useMemo, useState, Fragment } from "react";
import { PermissionsDataTable } from "./permissions-data-table";
import { PermissionsGridView } from "./permissions-grid-view";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDataTable from "@/components/ui/skeletons/TableSkeleton"; 
import { AddEditPermissionSheet } from "./add-edit-permission-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissionsList, useDeletePermission } from "@/app/shared/sfa/permissions/hooks";
import { Permission } from "@/app/shared/sfa/permissions/utils/types";
import CurrencyCardSkeleton from "@/components/ui/skeletons/CurrencyCardSkeleton";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";

export default function PermissionsPageView() {
  const { data: permissionsData, isLoading, error } = usePermissionsList();
  const deletePermission = useDeletePermission();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const allPermissions: Permission[] = useMemo(() => permissionsData?.data || [], [permissionsData]);

  const selectableItems = allPermissions;
  const allSelected = selectableItems.length > 0 && selectedRows.length === selectableItems.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < selectableItems.length;

  const onSelectRow = (id: string, selected: boolean) => {
    if (selected) setSelectedRows((prev) => [...prev, id]);
    else setSelectedRows((prev) => prev.filter((x) => x !== id));
  };
  const onSelectAll = (selected: boolean) => {
    if (selected) {
      const selectableIds = selectableItems.map((p: any) => String((p as any).id));
      setSelectedRows(selectableIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (permission_id: number) => {
    setPermissionToDelete(permission_id);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedRows.length === 0) return;
    setPermissionToDelete(null);
    setIsBulkDelete(true);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete && selectedRows.length > 0) {
      let successCount = 0;
      let errorCount = 0;
      for (const id of selectedRows) {
        try {
          await deletePermission.mutateAsync(Number(id));
          successCount++;
        } catch (error: any) {
          errorCount++;
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete permission";
          toast.error(`Failed to delete permission ${id}: ${errorMessage}`);
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount} permission(s) deleted successfully`);
      }
      if (errorCount === 0) {
        setSelectedRows([]);
      }
    } else if (permissionToDelete) {
      try {
        await deletePermission.mutateAsync(permissionToDelete);
        toast.success("Permission deleted successfully");
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete permission. Please try again.";
        toast.error(errorMessage);
        throw error; // Re-throw to prevent dialog from closing
      }
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
          <BreadcrumbItem>Permissions</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load permissions. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
        <BreadcrumbItem>Permissions</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            {selectableItems.length > 0 && (
            <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>  onSelectAll(!!checked)}
                aria-label="Select permissions"
            />
            )}
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              Permissions
              {selectedRows.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({selectedRows.length} selected)
                </span>
              )}
            </div>
          </div>
          <div className="flex-none flex items-center gap-3">
            <div className="flex-1 flex gap-3">
              <Button
                size="icon"
                variant="outline"
                className={cn("hover:bg-transparent  ", {
                  "hover:border-primary hover:text-primary": viewMode === "grid",
                  "hover:border-muted-foreground hover:text-muted-foreground": viewMode !== "grid",
                })}
                color={viewMode === "grid" ? "primary" : "secondary"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className={cn("hover:bg-transparent  ", {
                  "hover:border-primary hover:text-primary": viewMode === "list",
                  "hover:border-muted-foreground hover:text-muted-foreground": viewMode !== "list",
                })}
                color={viewMode === "list" ? "primary" : "secondary"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>

            {selectedRows.length > 0 && (
              <div className="relative inline-block">
                <Button color="destructive" onClick={handleBulkDeleteClick}>
                  Delete
                </Button>
                <Badge className=" w-5 h-5 p-0 text-xs items-center justify-center absolute left-[calc(100%-12px)] bottom-[calc(100%-12px)]">
                  {selectedRows.length}
                </Badge>
              </div>
            )}

            <Button onClick={() => setIsAddSheetOpen(true)}>
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Add Permission
            </Button>
          </div>
        </CardHeader>
      </Card>

       
        <CardContent className="p-0">
          {isLoading ? (
            viewMode === "list" ? (
              <LoadingDataTable rows={5} columns={6} />
            ) : (
              <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5 ">
                {[...Array(8)].map((_, i) => (
                  <CurrencyCardSkeleton key={i} />
                ))}
              </div>
            )
          ) : viewMode === "list" ? (
            <Card className="py-0">
              <PermissionsDataTable
                data={allPermissions}
                isLoading={false}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                selectedRows={selectedRows}
                onSelectRow={onSelectRow}
                onSelectAll={onSelectAll}
                allSelected={allSelected}
                someSelected={someSelected}
              />
            </Card>
          ) : (
            <div className="p-0">
              <PermissionsGridView
                data={allPermissions}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                selectedRows={selectedRows}
                onSelectRow={onSelectRow}
              />
            </div>
          )}
        </CardContent> 

      <AddEditPermissionSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        mode="add"
      />
      <AddEditPermissionSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        mode="edit"
        permission={editingPermission}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setPermissionToDelete(null);
          setIsBulkDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        defaultToast={false}
      />
    </Fragment>
  );
}

