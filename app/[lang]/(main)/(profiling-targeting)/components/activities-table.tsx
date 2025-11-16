"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Activity, ActivityType, ACTIVITY_TYPES } from "../utils/activity-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActivityFormSheet } from "./activity-form-sheet";

interface ActivitiesTableProps {
  activities: Activity[];
  onActivityUpdate: (id: string, activity: Omit<Activity, "id" | "createdAt">) => void;
  onActivityDelete: (id: string) => void;
}

export function ActivitiesTable({
  activities,
  onActivityUpdate,
  onActivityDelete
}: ActivitiesTableProps) {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const getActivityTypeInfo = (type: ActivityType) => {
    return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
  };

  const columns: ColumnDef<Activity>[] = [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const activity = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <DropdownMenuItem onClick={() => setEditingActivity(activity)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActivityDelete(activity.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const type = row.getValue("type") as ActivityType;
        const typeInfo = getActivityTypeInfo(type);
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${typeInfo.color.split(' ')[0]}`} />
            <span className="font-medium">{typeInfo.label}</span>
          </div>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px]">
            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
              {description}
            </p>
          </div>
        );
      },
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: ({ row }) => {
        const cost = row.getValue("cost") as number;
        return (
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(cost)}
          </div>
        );
      },
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={activities}
        filterColumnIds={["type", "description"]}
      />

      {/* Edit Activity Sheet */}
      {editingActivity && (
        <ActivityFormSheet
          onActivitySubmit={() => { }}
          editingActivity={editingActivity}
          onActivityUpdate={(id, activity) => {
            onActivityUpdate(id, activity);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
}
