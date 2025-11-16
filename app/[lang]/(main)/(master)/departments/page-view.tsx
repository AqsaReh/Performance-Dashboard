'use client';

import { useEffect, useMemo, useState, Fragment } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Filter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDataTable from "@/components/ui/skeletons/TableSkeleton";
import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";
import { FilterSheet, FilterConfig } from "../components/filter-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useDepartmentsList, useDeleteDepartment } from "@/app/shared/master/hooks";
import type { Department } from "@/app/shared/master/utils/types";
import { AddEditDepartmentSheet } from "./add-edit-department-sheet";
import { DepartmentsDataTable } from "./departments-data-table";
import { DepartmentsGridView } from "./departments-grid-view";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { usePagination } from "@/app/shared/master/use-pagination";

export default function MasterDepartmentsPageView() {
  const pagination = usePagination({ initialPageSize: 15 });
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentsToDelete, setDepartmentsToDelete] = useState<number[]>([]);
  
  // Convert activeFilters to API format
  // Filter keys: company, division -> API parameters: company, division (values should be IDs)
  const apiFilters = useMemo(() => {
    const filters: Record<string, any> = {};
    if (activeFilters.is_active?.length) {
      filters.is_active = activeFilters.is_active[0];
    }
    // company filter key -> company API parameter (value should be ID, not name)
    if (activeFilters.company?.length && activeFilters.company[0]) {
      const companyValue = activeFilters.company[0];
      // Only include if it's a numeric ID (not a string name)
      if (!isNaN(Number(companyValue))) {
        filters.company = companyValue;
      }
    }
    // division filter key -> division API parameter (value should be ID, not name)
    if (activeFilters.division?.length && activeFilters.division[0]) {
      const divisionValue = activeFilters.division[0];
      // Only include if it's a numeric ID (not a string name)
      if (!isNaN(Number(divisionValue))) {
        filters.division = divisionValue;
      }
    }
    return filters;
  }, [activeFilters]);

  const { data: departmentsData, isLoading, error } = useDepartmentsList({
    page: pagination.page,
    pageSize: pagination.pageSize,
    filters: apiFilters,
  });

  const deleteDepartment = useDeleteDepartment();
  // Update pagination when data changes
  useEffect(() => {
    if (departmentsData?.meta) {
      pagination.setTotalItems(departmentsData.meta.total);
      pagination.setTotalPages(departmentsData.meta.last_page);
    }
  }, [departmentsData?.meta]);

  const allDepartments: Department[] = useMemo(() => departmentsData?.data || [], [departmentsData]); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFilters = localStorage.getItem("master-departments-filters");
      if (savedFilters) {
        try { setActiveFilters(JSON.parse(savedFilters)); } catch { }
      }
    }
  }, []);

  const companyOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();
    (allDepartments || []).forEach((d: any) => {
      const comp = d.company;
      // Always prefer ID over string name
      if (comp && typeof comp === 'object' && comp.id) {
        const value = String(comp.id);
        const label = comp.name ? `${comp.name}${comp.code ? ` (${comp.code})` : ''}` : `Company ID: ${value}`;
        if (!map.has(value)) map.set(value, { value, label });
      } else if (d.company_id) {
        // Use company_id if available
        const value = String(d.company_id);
        const label = typeof comp === 'string' ? comp : (comp?.name || `Company ID: ${value}`);
        if (!map.has(value)) map.set(value, { value, label });
      } else if (typeof comp === 'string' && comp.trim()) { 
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [allDepartments]);

  const divisionOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();
    (allDepartments || []).forEach((d: any) => {
      const div = d.division;
      // Always prefer ID over string name
      if (div && typeof div === 'object' && (div.id || d.division_id)) {
        const value = String(div.id ?? d.division_id);
        const label = div.name ?? `Division ID: ${value}`;
        if (!map.has(value)) map.set(value, { value, label });
      } else if (d.division_id) {
        // Use division_id if available
        const value = String(d.division_id);
        const label = typeof div === 'string' ? div : `Division ID: ${value}`;
        if (!map.has(value)) map.set(value, { value, label });
      } else if (typeof div === 'string' && div.trim()) { 
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [allDepartments]);

  const filterConfigs: FilterConfig[] = [
    { key: "is_active", label: "Status", options: [{ value: "1", label: "Active" }, { value: "0", label: "Inactive" }] },
    { key: "company", label: "Company", options: companyOptions },
    { key: "division", label: "Division", options: divisionOptions },
  ];

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    // Reset to first page when filters change
    pagination.setPage(1);
  };

  // With server-side pagination, we use the data directly from the API
  // No need for client-side filtering as it's handled on the server
  const selectableItems = allDepartments;
  const allSelected = selectableItems.length > 0 && selectedRows.length === selectableItems.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < selectableItems.length;

  const onSelectRow = (id: string, selected: boolean) => setSelectedRows((prev) => selected ? [...prev, id] : prev.filter((x) => x !== id));
  const onSelectAll = (selected: boolean) => setSelectedRows(selected ? selectableItems.map((c: any) => String((c as any).id)) : []);

  const handleEdit = (department: Department) => { setEditingDepartment(department); setIsEditSheetOpen(true); };
  
  const handleDelete = (id: number) => {
    setDepartmentsToDelete([id]);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    setDepartmentsToDelete(selectedRows.map(id => Number(id)));
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      for (const id of departmentsToDelete) {
        await deleteDepartment.mutateAsync(id);
      }
      // Clear selected rows if they match the deleted departments
      const deletedIds = departmentsToDelete.map(id => String(id));
      setSelectedRows((prev) => prev.filter((id) => !deletedIds.includes(id)));
    } catch (error) {
      console.error("Failed to delete department(s):", error);
    }
  };

  const totalActiveFilters = Object.values(activeFilters).reduce((total: number, values: any) => total + values.length, 0);

  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Master</BreadcrumbItem>
          <BreadcrumbItem>Departments</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load departments. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Master</BreadcrumbItem>
        <BreadcrumbItem>Departments</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            {selectableItems.length > 0 && (
              <Checkbox checked={allSelected} onCheckedChange={(checked) => onSelectAll(!!checked)} aria-label="Select departments" />
            )}
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              Departments
              {selectedRows.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({selectedRows.length} selected)</span>
              )}
            </div>
          </div>
          <div className="flex-none flex items-center gap-4">
            <div className="flex-1 flex gap-3">
              <Button size="icon" variant="outline" className={cn("hover:bg-transparent  ", { "hover:border-primary hover:text-primary": viewMode === "grid", "hover:border-muted-foreground hover:text-muted-foreground": viewMode !== "grid", })} color={viewMode === "grid" ? "primary" : "secondary"} onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className={cn("hover:bg-transparent  ", { "hover:border-primary hover:text-primary": viewMode === "list", "hover:border-muted-foreground hover:text-muted-foreground": viewMode !== "list", })} color={viewMode === "list" ? "primary" : "secondary"} onClick={() => setViewMode("list")}>
                <List className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Button size="icon" variant="outline" className={cn("hover:bg-transparent hover:border-muted-foreground hover:text-muted-foreground", totalActiveFilters > 0 && "border-primary text-primary")} color={totalActiveFilters > 0 ? "primary" : "secondary"} onClick={() => setIsFilterSheetOpen(true)}>
                  <Filter className="h-5 w-5" />
                  {totalActiveFilters > 0 && (<Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs flex items-center justify-center">{totalActiveFilters}</Badge>)}
                </Button>
              </div>
            </div>

            {selectedRows.length > 0 && (
              <div className="relative inline-block">
                <Button color="destructive" onClick={handleBulkDelete}>Delete</Button>
                <Badge className=" w-5 h-5 p-0 text-xs items-center justify-center absolute left-[calc(100%-12px)] bottom-[calc(100%-12px)]">{selectedRows.length}</Badge>
              </div>
            )}

            <Button onClick={() => setIsAddSheetOpen(true)}>
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
      </Card>

      <CardContent className="p-0">
        {isLoading ? (
          viewMode === "list" ? (<Card> <LoadingDataTable rows={5} columns={6} /></Card>) : (
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5 ">{[...Array(6)].map((_, i) => (<CardSkeleton key={i} />))}</div>
          )
        ) : viewMode === "list" ? (
          <Card className="py-0">
          <DepartmentsDataTable 
            data={allDepartments}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
          <div className="p-0">
          <DepartmentsGridView 
            data={allDepartments}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
        </div>
        )}
      </CardContent>

      <AddEditDepartmentSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} mode="add" />
      <AddEditDepartmentSheet isOpen={isEditSheetOpen} onClose={() => setIsEditSheetOpen(false)} mode="edit" department={editingDepartment} />

      <FilterSheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen} filters={filterConfigs} onFilterChange={handleFilterChange} storageKey="master-departments-filters" />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDepartmentsToDelete([]);
        }}
        onConfirm={handleConfirmDelete}
        description={departmentsToDelete.length === 1 
          ? "This action cannot be undone. This will permanently delete the department and remove its data from our servers."
          : `This action cannot be undone. This will permanently delete ${departmentsToDelete.length} department(s) and remove their data from our servers.`
        }
        toastMessage={departmentsToDelete.length === 1 ? "Department deleted successfully" : `${departmentsToDelete.length} departments deleted successfully`}
      />
    </Fragment>
  );
}


