"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Company } from "@/app/shared/master/utils/types";
import { useCreateCompany, useUpdateCompany } from "@/app/shared/master/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
const formSchema = z.object({
  code: z.string().min(1, "Code is required").max(20, "Max 20 characters"),
  name: z.string().min(1, "Name is required").max(200, "Max 200 characters"),
  short_name: z.string().min(1, "Short name is required").max(20, "Max 20 characters"),
  is_active: z.preprocess((v) => {
    if (typeof v === 'string') return v === '1' ? 1 : 0;
    if (typeof v === 'boolean') return v ? 1 : 0;
    return v;
  }, z.union([z.literal(1), z.literal(0)])),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditCompanySheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  company?: Company | null;
}

export function AddEditCompanySheet({ isOpen, onClose, mode, company }: AddEditCompanySheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", name: "", short_name: "", is_active: 1 },
  });

  useEffect(() => {
    if (mode === "edit" && company) {
      form.reset({
        code: company.code ?? "",
        name: company.name ?? "",
        short_name: (company as any).short_name ?? "",
        is_active: (company.is_active as any) == 1 || (company.is_active as any) === true ? 1 : 0,
      });
    } else {
      form.reset({ code: "", name: "", short_name: "", is_active: 1 });
    }
  }, [mode, company, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = { code: data.code, name: data.name, short_name: data.short_name, is_active: data.is_active as 0 | 1 };
      if (mode === "add") {
        await createMutation.mutateAsync(payload as any);
        toast.success("Company created successfully.");
      } else if (mode === "edit" && company) {
        await updateMutation.mutateAsync({ id: company.id, payload: payload as any });
        toast.success("Company updated successfully.");
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
          <SheetTitle>{mode === "add" ? "Add Company" : "Edit Company"}</SheetTitle>
        </SheetHeader>
        <hr />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="px-3 py-6 h-[calc(100vh-125px)]">
              <ScrollArea className="h-full"> 
              <div className="flex flex-col justify-between gap-3 px-2">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company code" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="short_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter short name" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="is_active" render={({ field }) => {
                  const isActive = field.value === 1;
                  return (
                    <FormItem>
                      <FormLabel>Status </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Switch className="w-[33px]" checked={isActive} onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)} disabled={isSubmitting} />
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
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create Company" : "Update Company")}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}


