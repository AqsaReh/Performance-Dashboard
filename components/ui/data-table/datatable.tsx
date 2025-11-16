"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData> {
  data: TData[];
  getRowId?: (row: TData) => string;
  columns: ColumnDef<TData, any>[];
  filterColumnIds?: string[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  createButton?: React.ReactNode;
  renderToolbarExtras?: (ctx: { table: TanstackTable<TData> }) => React.ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export function DataTable<TData>({
  data,
  columns,
  filterColumnIds,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 15, 20],
  createButton,
  pagination,
  renderToolbarExtras,
}: DataTableProps<TData>) {
  const defaultFilterId = columns[0].id!;
  const filters =
    filterColumnIds && filterColumnIds.length > 0
      ? filterColumnIds
      : [defaultFilterId];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable<TData>({
    data,
    columns,
    state: { 
      sorting, 
      columnFilters, 
      columnVisibility, 
      rowSelection,
      pagination: pagination ? {
        pageIndex: pagination.page - 1, // TanStack Table uses 0-based index
        pageSize: pagination.pageSize,
      } : { pageIndex: 0, pageSize: initialPageSize },
     },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(), // Only use client-side pagination if no server-side pagination
    initialState: { pagination: { pageSize: initialPageSize } },
    onPaginationChange: pagination ? (updater) => {
      if (!pagination) return;
      const newPagination = typeof updater === 'function' 
        ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize })
        : updater;
      
      if (newPagination && newPagination.pageIndex !== undefined) {
        pagination.onPageChange(newPagination.pageIndex + 1);
      }
      if (newPagination && newPagination.pageSize !== undefined) {
        pagination.onPageSizeChange(newPagination.pageSize);
      }
    } : undefined,
    manualPagination: !!pagination, // Important: enable manual pagination
    pageCount: pagination?.totalPages,
  });

  return (
    <div>
      {/* DataTableToolbar */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row  gap-4">
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center  gap-3">
           
            <div className="flex flex-wrap gap-2">
              {filters.map((colId) => {
                const label = colId
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                return (
                  <div className="relative">
                    <Input
                      key={colId}
                      placeholder={`Search ${label}...`}
                      value={
                        (table.getColumn(colId)?.getFilterValue() as string) ||
                        ""
                      }
                      onChange={(e) =>
                        table.getColumn(colId)?.setFilterValue(e.target.value)
                      }
                      className="min-w-[200px] sm:max-w-[248px] ltr:pl-7 rtl:pr-7 rounded"
                    />
                    <Icon
                      icon="heroicons:magnifying-glass"
                      className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-default-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-none flex flex-col sm:flex-row sm:items-center  gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-default-300 text-default-600"
                >
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const label = column.id
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ");
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <React.Fragment>{createButton}</React.Fragment>
            {renderToolbarExtras && (
              <React.Fragment>{renderToolbarExtras({ table })}</React.Fragment>
            )}
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="p-0 w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="ltr:last:text-left rtl:last:text-left whitespace-nowrap relative lg:text-xs text-sm bg-primary-100 font-medium text-default-600"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanSort() && (
                      <div
                        className="mx-1 mt-1 text-xs inline h-3 w-3 cursor-pointer absolute text-muted-foreground hover:text-black"
                        onClick={() =>
                          header.column.toggleSorting(
                            header.column.getIsSorted() === "asc"
                          )
                        }
                      >
                        {header.column.getIsSorted() === "asc" && (
                          <ChevronUp className="w-3 h-3 text-green-500" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ChevronDown className="w-3 h-3 text-red-500" />
                        )}
                        {header.column.getIsSorted() === false && (
                          <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-1">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-xs text-default-600 "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className=" text-center" style={{textAlign: 'center'}}
                >
                  No Results Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* DataTablePagination - Server-side pagination */}
      {pagination && (
        <div className="flex items-center flex-wrap gap-2 justify-between p-5">
          <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {pagination.totalItems} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => pagination.onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px] rounded-lg text-sm" size="md" radius="sm">
                <SelectValue placeholder={String(pagination.pageSize)} />
              </SelectTrigger>
              <SelectContent className="w-20 min-w-[80px]">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                size="icon"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    className="w-8 h-8"
                    variant={pagination.page === pageNum ? "soft" : "outline"}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                size="icon"
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => pagination.onPageChange(pagination.totalPages)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DataTablePagination - Client-side pagination */}
      {!pagination && (
        <div className="flex items-center flex-wrap gap-2 justify-between p-5">
          <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(val) => {
                table.setPageSize(Number(val));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] rounded-lg text-sm" size="md" radius="sm">
                <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
              </SelectTrigger>
              <SelectContent className="w-20 min-w-[80px]">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                size="icon"
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
