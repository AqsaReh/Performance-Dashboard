"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, ActivityType, ACTIVITY_TYPES } from "../utils/activity-types";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const activityFormSchema = z.object({
  type: z.enum(["giveaways", "promotional", "pfp"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cost: z.number().min(0, "Cost must be a positive number"),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormSheetProps {
  onActivitySubmit: (activity: Omit<Activity, "id" | "createdAt">) => void;
  editingActivity?: Activity | null;
  onActivityUpdate?: (id: string, activity: Omit<Activity, "id" | "createdAt">) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ActivityFormSheet({ 
  onActivitySubmit, 
  editingActivity, 
  onActivityUpdate,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: ActivityFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: editingActivity?.type || "giveaways",
      description: editingActivity?.description || "",
      cost: editingActivity?.cost || 0,
    },
  });

  const onSubmit = async (values: ActivityFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingActivity && onActivityUpdate) {
        onActivityUpdate(editingActivity.id, values);
      } else {
        onActivitySubmit(values);
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting activity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
    
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
      <SheetHeader className="py-3 pl-4">
          <SheetTitle>
            {editingActivity ? "Edit Activity" : "Add New Activity"}
          </SheetTitle> 
        </SheetHeader>
        <hr />
        <div className="px-3 py-6 h-[calc(100vh-125px)]">
        <ScrollArea className="h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${type.color.split(' ')[0]}`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the activity details..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Cost</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rs
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cost Preview */}
            {form.watch("cost") > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Cost: <span className="font-semibold text-lg">
                    {formatCurrency(form.watch("cost"))}
                  </span>
                </p>
              </div>
            )}
          </form>
        </Form>
        </ScrollArea>
        </div>
        <SheetFooter className="gap-3 pt-4 border-t px-6 pb-6">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting} 
          > 
            {isSubmitting ? "Saving..." : editingActivity ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
