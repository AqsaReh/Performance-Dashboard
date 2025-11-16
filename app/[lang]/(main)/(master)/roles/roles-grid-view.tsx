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
import { Role } from "@/app/shared/sfa/roles/utils/types";
import { GridPagination } from "@/components/ui/grid-pagination";

interface RolesGridViewProps {
  data: any[];
  onEdit?: (role: Role) => void;
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

export function RolesGridView({
  data,
  onEdit,
  onDelete,
  selectedRows = [],
  onSelectRow,
  pagination,
  isLoading = false
}: RolesGridViewProps) {
  const handleEdit = (role: Role) => {
    if (onEdit) onEdit(role);
  };

  const handleDelete = (role: Role) => {
    if (onDelete) {
      onDelete(role.id);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No roles available.
      </div>
    );
  }

  return (
    <>
    <div className=" md:min-h-[calc(100vh-420px)]"> 
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((role: any) => (
          <Card
            key={role.id}
            className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(role.id))
                ? 'ring-1 ring-primary shadow-xl'
                : 'border-border'
              } bg-card`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedRows.includes(String(role.id))}
                    onCheckedChange={(checked) => onSelectRow && onSelectRow(String(role.id), !!checked)}
                    aria-label="Select role"
                  />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold truncate">
                      {role.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      Guard: {role.guard_name}
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
                    <DropdownMenuItem onClick={() => handleEdit(role)} >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(role)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Permissions:</span>
                  <div className="flex-1 text-right">
                    {role.permissions && Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {role.permissions.slice(0, 3).map((p: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {typeof p === 'string' ? p : (p.name || p)}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Users:</span>
                  <Badge variant="soft" className="text-xs">
                    {role.users_count ?? (Array.isArray(role.users) ? role.users.length : 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
          itemLabel="roles"
        />
      )}
    </>
  );
}

