'use client';

import { useEffect, useMemo, useState, Fragment } from "react";
import { RolesDataTable } from "./roles-data-table";
import { RolesGridView } from "./roles-grid-view";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDataTable from "@/components/ui/skeletons/TableSkeleton"; 
import { AddEditRoleSheet } from "./add-edit-role-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useRolesList, useDeleteRole } from "@/app/shared/sfa/roles/hooks";
import { Role } from "@/app/shared/sfa/roles/utils/types";
import CurrencyCardSkeleton from "@/components/ui/skeletons/CurrencyCardSkeleton";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";
import { usePagination } from "@/app/shared/master/use-pagination";

export default function RolesPageView() {
  const pagination = usePagination({ initialPageSize: 15 });
  const deleteRole = useDeleteRole();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const { data: rolesData, isLoading, error } = useRolesList({
    page: pagination.page,
    pageSize: pagination.pageSize,
    filters: {},
  });

  // Update pagination when data changes
  useEffect(() => {
    if (rolesData?.meta) {
      pagination.setTotalItems(rolesData.meta.total);
      pagination.setTotalPages(rolesData.meta.last_page);
    }
  }, [rolesData?.meta]);

  const allRoles: Role[] = useMemo(() => rolesData?.data || [], [rolesData]);

  const selectableItems = allRoles;
  const allSelected = selectableItems.length > 0 && selectedRows.length === selectableItems.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < selectableItems.length;

  const onSelectRow = (id: string, selected: boolean) => {
    if (selected) setSelectedRows((prev) => [...prev, id]);
    else setSelectedRows((prev) => prev.filter((x) => x !== id));
  };
  const onSelectAll = (selected: boolean) => {
    if (selected) {
      const selectableIds = selectableItems.map((r: any) => String((r as any).id));
      setSelectedRows(selectableIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (role_id: number) => {
    setRoleToDelete(role_id);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedRows.length === 0) return;
    setRoleToDelete(null);
    setIsBulkDelete(true);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete && selectedRows.length > 0) {
      let successCount = 0;
      let errorCount = 0;
      for (const id of selectedRows) {
        try {
          await deleteRole.mutateAsync(Number(id));
          successCount++;
        } catch (error: any) {
          errorCount++;
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete role";
          toast.error(`Failed to delete role ${id}: ${errorMessage}`);
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount} role(s) deleted successfully`);
      }
      if (errorCount === 0) {
        setSelectedRows([]);
      }
    } else if (roleToDelete) {
      try {
        await deleteRole.mutateAsync(roleToDelete);
        toast.success("Role deleted successfully");
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete role. Please try again.";
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
          <BreadcrumbItem>Roles</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load roles. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
        <BreadcrumbItem>Roles</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            {selectableItems.length > 0 && (
            <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>  onSelectAll(!!checked)}
                aria-label="Select roles"
            />
            )}
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              Roles
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
              Add Role
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
              <RolesDataTable
                data={allRoles}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                selectedRows={selectedRows}
                onSelectRow={onSelectRow}
                onSelectAll={onSelectAll}
                allSelected={allSelected}
                someSelected={someSelected}
                pagination={{
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                  totalItems: pagination.totalItems,
                  totalPages: pagination.totalPages,
                  onPageChange: pagination.setPage,
                  onPageSizeChange: pagination.setPageSize,
                }}
              />
            </Card>
          ) : (
            
              <RolesGridView
                data={allRoles}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                selectedRows={selectedRows}
                onSelectRow={onSelectRow}
                pagination={{
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                  totalItems: pagination.totalItems,
                  totalPages: pagination.totalPages,
                  onPageChange: pagination.setPage,
                  onPageSizeChange: pagination.setPageSize,
                }}
                isLoading={isLoading}
              /> 
          )}
        </CardContent> 

      <AddEditRoleSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        mode="add"
      />
      <AddEditRoleSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        mode="edit"
        role={editingRole}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setRoleToDelete(null);
          setIsBulkDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        defaultToast={false}
      />
    </Fragment>
  );
}

