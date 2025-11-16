"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Division } from "@/app/shared/master/utils/types";
import { useCreateDivision, useUpdateDivision, useCompaniesList } from "@/app/shared/master/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
const formSchema = z.object({
  code: z.string().min(1, "Code is required").max(50, "Max 50 characters"),
  name: z.string().min(1, "Name is required").max(150, "Max 150 characters"),
  company_id: z.union([z.string(), z.number()]).refine((v) => String(v).trim().length > 0, "Company is required"),
  is_active: z.preprocess((v) => {
    if (typeof v === 'string') return v === '1' ? 1 : 0;
    if (typeof v === 'boolean') return v ? 1 : 0;
    return v;
  }, z.union([z.literal(1), z.literal(0)])),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditDivisionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  division?: Division | null;
}

export function AddEditDivisionSheet({ isOpen, onClose, mode, division }: AddEditDivisionSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateDivision();
  const updateMutation = useUpdateDivision();
  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useCompaniesList();
  const companies = Array.isArray((companiesData as any)?.data)
    ? (companiesData as any).data
    : Array.isArray(companiesData as any)
      ? (companiesData as any)
      : Array.isArray((companiesData as any)?.data?.data)
        ? (companiesData as any).data.data
        : [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", name: "", company_id: "", is_active: 1 },
  });

  useEffect(() => {
    if (mode === "edit" && division) {
      form.reset({
        code: division.code ?? "",
        name: division.name ?? "",
        company_id: division.company_id ?? "",
        is_active: (division.is_active as any) == 1 || (division.is_active as any) === true ? 1 : 0,
      });
    } else {
      form.reset({ code: "", name: "", company_id: "", is_active: 1 });
    }
  }, [mode, division, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        code: data.code,
        name: data.name,
        company_id: Number(data.company_id),
        is_active: data.is_active as 0 | 1,
      };
      if (mode === "add") {
        await createMutation.mutateAsync(payload as any);
        toast.success("Division created successfully.");
      } else if (mode === "edit" && division) {
        await updateMutation.mutateAsync({ id: division.id, payload: payload as any });
        toast.success("Division updated successfully.");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "An error occurred. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  const handleClose = () => { if (!isSubmitting) { form.reset(); onClose(); } };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
       <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="py-3 pl-4">
          <SheetTitle>{mode === "add" ? "Add Division" : "Edit Division"}</SheetTitle>
         </SheetHeader>
        <hr />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full ">
            <div className="px-3 py-6 h-[calc(100vh-125px)]">
              <ScrollArea className="h-full"> 
              <div className="flex flex-col justify-between gap-3 px-2">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter division code" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter division name" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="company_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value || "")}
                        onValueChange={(val) => field.onChange(val)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={companiesLoading ? "Loading companies..." : (companiesError ? "Failed to load" : "Select company")} />
                        </SelectTrigger>
                        <SelectContent>
                          {companiesLoading ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : companiesError ? (
                            <SelectItem value="error" disabled>Error loading companies</SelectItem>
                          ) : companies.length > 0 ? (
                            companies.map((c: any) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{c.name}</span>
                                  <span className="text-xs text-muted-foreground">{c.code}</span>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>No companies available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="is_active" render={({ field }) => {
                  const isActive = field.value === 1;
                  return (
                    <FormItem>
                      <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Switch checked={isActive} onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)} disabled={isSubmitting} />
                          <span className="text-sm text-muted-foreground">{isActive ? "Active" : "Inactive"}</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} />
              </div>
              </ScrollArea>
            </div>

            <SheetFooter className="gap-3 pt-4 border-t px-6 pb-6 border-t-default-200">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create Division" : "Update Division")}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}


