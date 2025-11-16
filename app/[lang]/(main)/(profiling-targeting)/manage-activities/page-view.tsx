"use client";

import { useState } from "react";
import { ActivitiesTable } from "../components/activities-table";
import { Activity, SAMPLE_ACTIVITIES } from "../utils/activity-types";
import { ActivityFormSheet } from "../components/activity-form-sheet";
import { BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon, Plus } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

export default function ManageActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(SAMPLE_ACTIVITIES);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleActivitySubmit = (newActivity: Omit<Activity, "id" | "createdAt">) => {
    const activity: Activity = {
      ...newActivity,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setActivities(prev => [activity, ...prev]);
    setIsSheetOpen(false);
  };

  const handleActivityUpdate = (id: string, updatedActivity: Omit<Activity, "id" | "createdAt">) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id
          ? { ...activity, ...updatedActivity }
          : activity
      )
    );
  };

  const handleActivityDelete = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  return (
    <Fragment>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/manage-activities">Manage Activities</Link>
        </BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 sticky top-[4rem] z-10">
        <CardHeader className="sm:flex-row sm:items-center justify-between gap-3 border-b-0">
          <div className="text-xl font-medium text-default-700 whitespace-nowrap">
            Manage Activities
          </div>
          <div className="flex-none flex items-center gap-3">
         
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Add Activity
                </Button>
              </SheetTrigger>
              <ActivityFormSheet 
                onActivitySubmit={handleActivitySubmit}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
              />
            </Sheet>
          </div>
        </CardHeader>
      </Card>

      <Card className="pt-3"> 
          <ActivitiesTable
            activities={activities}
            onActivityUpdate={handleActivityUpdate}
            onActivityDelete={handleActivityDelete}
          /> 
      </Card>
    </Fragment>
  );
}
