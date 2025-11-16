"use client";

import { DataTable } from "@/components/ui/data-table/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmployeeData {
  sr: number;
  employeeName: string;
  empCode: string;
  territory: string;
  doctorsCount: number;
  chemistsCount: number;
  budget: number;
  sales: number;
}

export default function EmpListTable() {
  const router = useRouter();
  // Real employee data
  const data: EmployeeData[] = [
    {
      sr: 1,
      employeeName: "Zakwan Ali",
      empCode: "07186",
      territory: "TEAM 5 - JAMPUR - 01",
      doctorsCount: 5,
      chemistsCount: 10,
      budget: 150000,
      sales: 120000
    },
    {
      sr: 2,
      employeeName: "Ali Raza",
      empCode: "06195",
      territory: "TEAM 5 - LARKANA - 01",
      doctorsCount: 3,
      chemistsCount: 6,
      budget: 200000,
      sales: 80000
    },
    {
      sr: 3,
      employeeName: "Hasham Mehmood",
      empCode: "06012",
      territory: "TEAM 3B - KARACHI - 07",
      doctorsCount: 12,
      chemistsCount: 5,
      budget: 180000,
      sales: 144000
    }
  ];

  const columns: ColumnDef<EmployeeData>[] = [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
             
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/customer-profiling/employee-listing-allowed/${employee.empCode}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
          
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      header: "SR.",
      accessorKey: "sr",
      cell: ({ row }) => {
        return (
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.getValue("sr")}
          </div>
        );
      },
    },
    {
      header: "Employee Name",
      accessorKey: "employeeName",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {employee.employeeName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {employee.empCode}
            </div>
          </div>
        );
      },
    },
    {
      header: "Territory",
      accessorKey: "territory",
      cell: ({ row }) => {
        const territory = row.getValue("territory") as string;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {territory}
            </span>
          </div>
        );
      },
    },
    {
      header: "Doctors",
      accessorKey: "doctorsCount",
      cell: ({ row }) => {
        const count = row.getValue("doctorsCount") as number;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                {count}
              </span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
                {count === 1 ? 'Doctor' : 'Doctors'}
            </span>
          </div>
        );
      },
    },
    {
      header: "Chemists",
      accessorKey: "chemistsCount",
      cell: ({ row }) => {
        const count = row.getValue("chemistsCount") as number;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-green-600 dark:text-green-300">
                {count}
              </span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
                {count === 1 ? 'Chemist' : 'Chemists'}
            </span>
          </div>
        );
      },
    },
    {
      header: "Budget",
      accessorKey: "budget",
      cell: ({ row }) => {
        const budget = row.getValue("budget") as number;
        return (
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(budget)}
          </div>
        );
      },
    },
    {
      header: "Forcasting",
      accessorKey: "sales",
      
      cell: ({ row }) => {
        const sales = row.getValue("sales") as number;
        const budget = row.original.budget;
        const percentage = ((sales / budget) * 100).toFixed(1);
        
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(sales)}
            </div>
            <div className={`text-xs ${
              sales >= budget ? 'text-green-600' : 
              sales >= budget * 0.8 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {percentage}% of budget
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable columns={columns} data={data} filterColumnIds={["employeeName", "territory"]} />
    </div>
  );
}