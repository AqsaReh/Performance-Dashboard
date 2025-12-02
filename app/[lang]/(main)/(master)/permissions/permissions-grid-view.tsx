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
import { Permission } from "@/app/shared/sfa/permissions/utils/types";

interface PermissionsGridViewProps {
  data: any[];
  onEdit?: (permission: Permission) => void;
  onDelete?: (id: number) => void;
  selectedRows?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
}

export function PermissionsGridView({
  data,
  onEdit,
  onDelete,
  selectedRows = [],
  onSelectRow
}: PermissionsGridViewProps) {
  const handleEdit = (permission: Permission) => {
    if (onEdit) onEdit(permission);
  };

  const handleDelete = (permission: Permission) => {
    if (onDelete) {
      onDelete(permission.id);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No permissions available.
      </div>
    );
  }

  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
        {data.map((permission: any) => {
          const module = permission.module || (permission.module_id ? { id: permission.module_id, name: `Module ${permission.module_id}` } : null);
          return (
            <Card
              key={permission.id}
              className={`relative group transition-all duration-300 hover:shadow-xl border-0 ${selectedRows.includes(String(permission.id))
                  ? 'ring-1 ring-primary shadow-xl'
                  : 'border-border'
                } bg-card`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Checkbox
                      checked={selectedRows.includes(String(permission.id))}
                      onCheckedChange={(checked) => onSelectRow && onSelectRow(String(permission.id), !!checked)}
                      aria-label="Select permission"
                    />
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold truncate">
                        {permission.name}
                      </CardTitle>
                      {permission.label && (
                        <p className="text-xs text-muted-foreground truncate">
                          {permission.label}
                        </p>
                      )}
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
                      <DropdownMenuItem onClick={() => handleEdit(permission)} >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(permission)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  {module && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Module:</span>
                      <Badge variant="outline" color="secondary" className="text-xs">{module.name}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Guard:</span>
                    <Badge variant="outline" className="text-xs">{permission.guard_name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

