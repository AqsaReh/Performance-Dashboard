'use client';

import { useEffect, useMemo, useState, Fragment } from "react";
import { CompaniesDataTable } from "./companies-data-table";
import { CompaniesGridView } from "./companies-grid-view";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Filter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingDataTable from "@/components/ui/skeletons/TableSkeleton";
import CurrencyCardSkeleton from "@/components/ui/skeletons/CurrencyCardSkeleton";
import { AddEditCompanySheet } from "./add-edit-company-sheet";
import { FilterSheet, FilterConfig } from "../components/filter-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompaniesList, useDeleteCompany } from "@/app/shared/master/hooks";
import type { Company } from "@/app/shared/master/utils/types";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { usePagination } from "@/app/shared/master/use-pagination";

export default function CompaniesPageView() {
  const pagination = usePagination({ initialPageSize: 15 });
  
  const deleteCompany = useDeleteCompany();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Convert activeFilters to API format
  const apiFilters = useMemo(() => {
    const filters: Record<string, any> = {};
    if (activeFilters.is_active?.length) {
      filters.is_active = activeFilters.is_active[0];
    }
    return filters;
  }, [activeFilters]);

  const { data: companiesData, isLoading, error } = useCompaniesList({
    page: pagination.page,
    pageSize: pagination.pageSize,
    filters: apiFilters,
  });

  // Update pagination when data changes
  useEffect(() => {
    if (companiesData?.meta) {
      pagination.setTotalItems(companiesData.meta.total);
      pagination.setTotalPages(companiesData.meta.last_page);
    }
  }, [companiesData?.meta]);

  const allCompanies: Company[] = useMemo(() => companiesData?.data || [], [companiesData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFilters = localStorage.getItem("capex-companies-filters");
      if (savedFilters) {
        try { setActiveFilters(JSON.parse(savedFilters)); } catch {}
      }
    }
  }, []);

  const filterConfigs: FilterConfig[] = [
    {
      key: "is_active",
      label: "Status",
      options: [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
      ],
    },
  ];

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    pagination.setPage(1);
  };

  // With server-side pagination, we use the data directly from the API
  const filteredCompanies = allCompanies;

  const selectableItems = filteredCompanies;
  const allSelected = selectableItems.length > 0 && selectedRows.length === selectableItems.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < selectableItems.length;

  const onSelectRow = (id: string, selected: boolean) => {
    if (selected) setSelectedRows((prev) => [...prev, id]);
    else setSelectedRows((prev) => prev.filter((x) => x !== id));
  };
  const onSelectAll = (selected: boolean) => {
    if (selected) setSelectedRows(selectableItems.map((c: any) => String((c as any).id)));
    else setSelectedRows([]);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCompanyToDelete(id);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedRows.length === 0) return;
    setCompanyToDelete(null);
    setIsBulkDelete(true);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete && selectedRows.length > 0) {
      for (const id of selectedRows) {
        try { 
          await deleteCompany.mutateAsync(Number(id)); 
        } catch (error) {
          console.error("Failed to delete company:", error);
        }
      }
      setSelectedRows([]);
    } else if (companyToDelete) {
      try {
        await deleteCompany.mutateAsync(companyToDelete);
      } catch (error) {
        console.error("Failed to delete company:", error);
      }
    }
  };

  const totalActiveFilters = Object.values(activeFilters).reduce((total: number, values: any) => total + values.length, 0);

  if (error) {
    return (
      <div className="space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Master</BreadcrumbItem>
          <BreadcrumbItem>Companies</BreadcrumbItem>
        </Breadcrumbs>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load companies. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Master</BreadcrumbItem>
        <BreadcrumbItem>Companies</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center gap-3 border-b-0">
          <div className="flex-1 flex items-center gap-3">
            {selectableItems.length > 0 && (
            <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>  onSelectAll(!!checked)}
                aria-label="Select companies"
            />
            )}
            <div className="text-xl font-medium text-default-700 whitespace-nowrap">
              Companies
              {selectedRows.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({selectedRows.length} selected)
                </span>
              )}
            </div>
          </div>
          <div className="flex-none flex items-center gap-4">
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
              Add Company
            </Button>
          </div>
        </CardHeader>
      </Card>

      
        <CardContent className="p-0">
          {isLoading ? (
            viewMode === "list" ? (
              <LoadingDataTable rows={5} columns={6} />
            ) : (
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
                {[...Array(6)].map((_, i) => (
                  <CurrencyCardSkeleton key={i} />
                ))}
              </div>
            )
          ) : viewMode === "list" ? (
            <Card className="py-0">
              <CompaniesDataTable
                data={filteredCompanies}
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
      
              <CompaniesGridView
                data={filteredCompanies}
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

      <AddEditCompanySheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        mode="add"
      />
      <AddEditCompanySheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        mode="edit"
        company={editingCompany}
      />

      <FilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        filters={filterConfigs}
        onFilterChange={handleFilterChange}
        storageKey="capex-companies-filters"
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCompanyToDelete(null);
          setIsBulkDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        toastMessage={isBulkDelete 
          ? `${selectedRows.length} companies deleted successfully` 
          : "Company deleted successfully"}
      />
    </Fragment>
  );
}


