'use client';

import { useEffect, useMemo, useState, Fragment } from "react";
import { ModulesDataTable } from "./modules-data-table";
import { ModulesGridView } from "./modules-grid-view";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Filter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDataTable from "@/components/ui/skeletons/TableSkeleton"; 
import { AddEditModuleSheet } from "./add-edit-module-sheet";
import { FilterSheet, FilterConfig } from "../components/filter-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useModulesList, useDeleteModule } from "@/app/shared/sfa/modules/hooks";
import { Module } from "@/app/shared/sfa/modules/utils/types";
import CurrencyCardSkeleton from "@/components/ui/skeletons/CurrencyCardSkeleton";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";
import { usePagination } from "@/app/shared/master/use-pagination";

export default function ModulesPageView() {
  const pagination = usePagination({ initialPageSize: 15 });
  const deleteModule = useDeleteModule();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Convert activeFilters to API format
  const apiFilters = useMemo(() => {
    const filters: Record<string, any> = {};
    if (activeFilters.status?.length) {
      filters.status = activeFilters.status[0];
    }
    return filters;
  }, [activeFilters]);

  const { data: modulesData, isLoading, error } = useModulesList({
    page: pagination.page,
    pageSize: pagination.pageSize,
    filters: apiFilters,
  });

  // Update pagination when data changes
  useEffect(() => {
    if (modulesData?.meta) {
      pagination.setTotalItems(modulesData.meta.total);
      pagination.setTotalPages(modulesData.meta.last_page);
    }
  }, [modulesData?.meta]);

  const allModules: Module[] = useMemo(() => modulesData?.data || [], [modulesData]);

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFilters = localStorage.getItem("master-modules-filters");
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          setActiveFilters(parsedFilters);
        } catch (error) {
          console.error("Error loading saved filters:", error);
        }
      }
    }
  }, []);

  // Filters config
  const filterConfigs: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    pagination.setPage(1); // Reset to first page when filters change
  };

  const selectableItems = allModules;
  const allSelected = selectableItems.length > 0 && selectedRows.length === selectableItems.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < selectableItems.length;

  const onSelectRow = (id: string, selected: boolean) => {
    if (selected) setSelectedRows((prev) => [...prev, id]);
    else setSelectedRows((prev) => prev.filter((x) => x !== id));
  };
  const onSelectAll = (selected: boolean) => {
    if (selected) {
      const selectableIds = selectableItems.map((m: any) => String((m as any).id));
      setSelectedRows(selectableIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (module_id: number) => {
    setModuleToDelete(module_id);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedRows.length === 0) return;
    setModuleToDelete(null);
    setIsBulkDelete(true);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete && selectedRows.length > 0) {
      let successCount = 0;
      let errorCount = 0;
      for (const id of selectedRows) {
        try {
          await deleteModule.mutateAsync(Number(id));
          successCount++;
        } catch (error: any) {
          errorCount++;
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete module";
          toast.error(`Failed to delete module ${id}: ${errorMessage}`);
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount} module(s) deleted successfully`);
      }
      if (errorCount === 0) {
        setSelectedRows([]);
      }
    } else if (moduleToDelete) {
      try {
        await deleteModule.mutateAsync(moduleToDelete);
        toast.success("Module deleted successfully");
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete module. Please try again.";
        toast.error(errorMessage);
        throw error; // Re-throw to prevent dialog from closing
      }
    }
  };

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (total: number, values: any) => total + values.length, 0
  );

  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
          <BreadcrumbItem>Modules</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load modules. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/sfa">SFA</BreadcrumbItem>
        <BreadcrumbItem>Modules</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            {selectableItems.length > 0 && (
            <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>  onSelectAll(!!checked)}
                aria-label="Select modules"
            />
            )}
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              Modules
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
              <div className="relative">
                <Button
                  size="icon"
                  variant="outline"
                  className={cn(
                    "hover:bg-transparent hover:border-muted-foreground hover:text-muted-foreground",
                    totalActiveFilters > 0 && "border-primary text-primary"
                  )}
                  color={totalActiveFilters > 0 ? "primary" : "secondary"}
                  onClick={() => setIsFilterSheetOpen(true)}
                >
                  <Filter className="h-5 w-5" />
                  {totalActiveFilters > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs flex items-center justify-center">
                      {totalActiveFilters}
                    </Badge>
                  )}
                </Button>
              </div>
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
              Add Module
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
              <ModulesDataTable
                data={allModules}
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
              <ModulesGridView
                data={allModules}
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

      <AddEditModuleSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        mode="add"
      />
      <AddEditModuleSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        mode="edit"
        module={editingModule}
      />

      <FilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        filters={filterConfigs}
        onFilterChange={handleFilterChange}
        storageKey="master-modules-filters"
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setModuleToDelete(null);
          setIsBulkDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        defaultToast={false}
      />
    </Fragment>
  );
}
