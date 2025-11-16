"use client";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Fragment } from "react";
import EmpListTable from "./emp-list-table";
import { FilterIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmpListingPageView = () => {
  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/customer-profiling/employee-listing-allowed">Employee Listing Allowed</Link>
        </BreadcrumbItem>
      </Breadcrumbs>


      <Card className="mt-6 sticky top-[4rem] z-10">
      <CardHeader className="sm:flex-row sm:items-center justify-between gap-3 border-b-0">
          <div className="text-xl font-medium text-default-700 whitespace-nowrap">
            Employee Listing
          </div>
          <div className="flex-none flex items-center gap-3">
            <Button variant="outline" size="icon" color="secondary">
              <FilterIcon className="h-5 w-5" />
              
            </Button>
 
          </div>
        </CardHeader>
      </Card>

      <Card className="pt-3">
        <EmpListTable />
      </Card>
    </Fragment>
  )
};

export default EmpListingPageView;