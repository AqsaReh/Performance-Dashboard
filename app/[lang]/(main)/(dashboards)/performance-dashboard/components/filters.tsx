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
import Link from "next/link";
import { SiteLogo } from "@/components/svg";
import { ScrollArea } from "@/components/ui/scroll-area";
// import MonthPicker from "../dashboard/components/month-picker";

interface FiltersProps {
  employee: string;
  setEmployee: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  month: string;
  setMonth: (value: string) => void;
}
const Filters = ({
  employee,
  setEmployee,
  duration,
  setDuration,
  month,
  setMonth,
}: FiltersProps) => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Filters</Button>
        </SheetTrigger>
        <SheetContent className="max-w-[400px] p-0">
          <SheetHeader className="py-3 pl-4">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <hr />
          <div className="px-5 py-6 h-[calc(100vh-120px)]">
            <ScrollArea className="h-full">
              {/* form */}
              <div className="flex flex-col gap-6 mt-6 space-y-6 md:space-y-0">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Select Employee</Label>
                  <Select
                    value={employee}
                    onValueChange={(val) => {
                      setEmployee(val);
                      console.log(val, "selected employee");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Mcc Callem">Mcc Callem</SelectItem>
                      <SelectItem value="Employee 3">Employee 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 relative">
                  <Label htmlFor="owner">Select Duration</Label>
                  <Select
                    value={duration}
                    onValueChange={(val) => {
                      setDuration(val);
                      console.log(val, "selected duration");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MTD">MTD</SelectItem>
                      <SelectItem value="QTD">QTD</SelectItem>
                      <SelectItem value="YTD">YTD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <Label htmlFor="choose-type">Select Month</Label>
                  <MonthPicker
                    onChange={(value) =>
                      setMonth(value ? value.toISOString() : "")
                    }
                    value={month ? new Date(month) : null}
                  />
                </div> */}
              </div>
            </ScrollArea>
          </div>
          <SheetFooter className="gap-3 pt-4 block">
            <div className="flex items-center gap-2.5 justify-center">
              <SheetClose asChild>
                <Button color="destructive" variant="outline" size="xs">
                  Cancel
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button size="xs">Apply</Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Filters;
