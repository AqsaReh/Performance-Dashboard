"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

//we can change the props "side"'s value to 'top', 'left', 'bottom', 'right' so that the sheet will come out from different direction.

import { useState } from "react";
import BrandPerformanceDetailsSheet from "./brand-performance-details-sheet";

export interface Brand {
  id: number;
  name: string;
  sales: number;
  achievement: number;
  growth: number;
  monthly: number[];
}

const BrandPerformanceDetails = ({
  open,
  onOpenChange,
  brand,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
}) => {
  const [metric, setMetric] = useState<"ACH" | "Growth">("ACH");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-[1300px]">
        <SheetHeader>
          <SheetTitle>Brand Performance</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            {/* <hr className="text-border" /> */}

            <BrandPerformanceDetailsSheet
              title="Brand Performance"
              metric={metric}
              onMetricChange={setMetric}
            />
          </div>
          <div className="space-x-4 rtl:space-x-reverse ">
            
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BrandPerformanceDetails;
