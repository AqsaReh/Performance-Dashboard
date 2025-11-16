"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Company } from "@/app/shared/master/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToggleCompanyStatus } from "@/app/shared/master/hooks";
import { GridPagination } from "@/components/ui/grid-pagination";
import { Button } from "@/components/ui/button";

interface CompaniesGridViewProps {
  data: Company[];
  onEdit?: (company: Company) => void;
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

export function CompaniesGridView({
  data,
  onEdit,
  onDelete,
  selectedRows = [],
  onSelectRow,
  pagination,
  isLoading = false
}: CompaniesGridViewProps) {
  const [togglingCompanyIds, setTogglingCompanyIds] = useState<Set<number>>(new Set());
  const toggleStatusMutation = useToggleCompanyStatus();

  const handleEdit = (company: Company) => {
    if (onEdit) onEdit(company);
  };

  const handleDelete = (company: Company) => {
    if (onDelete) {
      onDelete(company.id);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: any) => {
    // Prevent multiple clicks on the same company
    if (togglingCompanyIds.has(id) || toggleStatusMutation.isPending) return;

    setTogglingCompanyIds(prev => new Set(prev).add(id));

    try {
      const current = (currentStatus === '1' || currentStatus === 1 || currentStatus === true) ? 1 : 0;
      await toggleStatusMutation.mutateAsync({ id, status: current === 1 ? 0 : 1 });
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setTogglingCompanyIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No companies available.</div>;
  }

  return (
    <>
      <div className=" md:min-h-[calc(100vh-420px)]">
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
          {data.map((company: any) => {
            const isActive = company.is_active == 1 || company.is_active === true || company.is_active === '1';
            const isLoading = togglingCompanyIds.has(company.id);

            return (
              <Card key={company.id} className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(company.id)) ? 'ring-1 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedRows.includes(String(company.id))}
                        onCheckedChange={(checked) => onSelectRow && onSelectRow(String(company.id), !!checked)}
                        aria-label="Select company"
                      />
                      <div>
                        <h3 className="text-sm font-medium truncate">{company.name}</h3>
                        <p className="text-muted-foreground text-xs truncate ">Code: {company.code}</p>
                      </div>

                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(company)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(company)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-3 pt-2 ">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">Short Name:
                        <Badge variant="soft">{company.short_name}</Badge>
                      </span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => handleToggleStatus(company.id, company.is_active)}
                          disabled={isLoading || toggleStatusMutation.isPending}
                          size="sm"
                        />
                        <span className={`text-sm ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {isLoading ? "Updating..." : (isActive ? "Active" : "Inactive")}
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
          itemLabel="companies"
        />
      )}
    </>
  );
}
