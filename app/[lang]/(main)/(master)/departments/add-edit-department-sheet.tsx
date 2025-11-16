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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Department } from "@/app/shared/master/utils/types";
import { useCreateDepartment, useUpdateDepartment, useCompaniesList, useDivisionsList, useDepartmentsList } from "@/app/shared/master/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactSelectComponent } from "@/components/ui/react-select";

const formSchema = z.object({
  code: z.string().min(1, "Code is required").max(50, "Max 50 characters"),
  name: z.string().min(1, "Name is required").max(150, "Max 150 characters"),
  short_name: z.string().min(1, "Short name is required").max(50, "Max 50 characters"),
  parent_id: z.union([z.string().min(1, "Parent department is required"), z.number().positive("Parent department is required")]),
  company_id: z.union([z.string().min(1, "Company is required"), z.number().positive("Company is required")]),
  division_id: z.union([z.string().min(1, "Division is required"), z.number().positive("Division is required")]),
  location: z.string().optional(),
  is_active: z.preprocess((v) => {
    if (typeof v === 'string') return v === '1' ? 1 : 0;
    if (typeof v === 'boolean') return v ? 1 : 0;
    return v;
  }, z.union([z.literal(1), z.literal(0)])),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditDepartmentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  department?: Department | null;
}

export function AddEditDepartmentSheet({ isOpen, onClose, mode, department }: AddEditDepartmentSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useCompaniesList();
  const { data: divisionsData, isLoading: divisionsLoading, error: divisionsError } = useDivisionsList();
  const { data: departmentsData, isLoading: departmentsLoading, error: departmentsError } = useDepartmentsList();

  const companies = Array.isArray((companiesData as any)?.data) ? (companiesData as any).data : Array.isArray((companiesData as any)?.data?.data) ? (companiesData as any).data.data : (Array.isArray(companiesData as any) ? (companiesData as any) : []);
  const divisions = Array.isArray((divisionsData as any)?.data) ? (divisionsData as any).data : Array.isArray((divisionsData as any)?.data?.data) ? (divisionsData as any).data.data : (Array.isArray(divisionsData as any) ? (divisionsData as any) : []);
  const allDepartments = Array.isArray((departmentsData as any)?.data) ? (departmentsData as any).data : Array.isArray((departmentsData as any)?.data?.data) ? (departmentsData as any).data.data : (Array.isArray(departmentsData as any) ? (departmentsData as any) : []);

  // Transform departments into options for react-select, excluding current department being edited
  const departmentOptions = allDepartments
    .filter((d: Department) => mode === "edit" && department ? d.id !== department.id : true)
    .map((d: Department) => ({
      value: String(d.id),
      label: `${d.name}${d.code ? ` (${d.code})` : ''}`,
    }));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", name: "", short_name: "", parent_id: "", company_id: "", division_id: "", location: "", is_active: 1 },
  });

  useEffect(() => {
    if (mode === "edit" && department) {
      form.reset({
        code: department.code ?? "",
        name: department.name ?? "",
        short_name: (department as any).short_name ?? "",
        parent_id: department.parent_id ? String(department.parent_id) : "",
        company_id: (department as any).company_id ? String((department as any).company_id) : (department as any).company?.id ? String((department as any).company.id) : "",
        division_id: (department as any).division_id ? String((department as any).division_id) : (department as any).division?.id ? String((department as any).division.id) : "",
        location: (department as any).location ?? "",
        is_active: (department.is_active as any) == 1 || (department.is_active as any) === true ? 1 : 0,
      });
    } else {
      form.reset({ code: "", name: "", short_name: "", parent_id: "", company_id: "", division_id: "", location: "", is_active: 1 });
    }
  }, [mode, department, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        code: data.code,
        name: data.name,
        short_name: data.short_name,
        parent_id: Number(data.parent_id),
        company_id: Number(data.company_id),
        division_id: Number(data.division_id),
        location: data.location || "",
        is_active: data.is_active as 0 | 1,
      };
      if (mode === "add") {
        await createMutation.mutateAsync(payload as any);
        toast.success("Department created successfully.");
      } else if (mode === "edit" && department) {
        await updateMutation.mutateAsync({ id: department.id, payload: payload as any });
        toast.success("Department updated successfully.");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  const handleClose = () => { if (!isSubmitting) { form.reset(); onClose(); } };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="max-w-[50vw] p-0">
        <SheetHeader className="py-3 pl-4">
          <SheetTitle>{mode === "add" ? "Add Department" : "Edit Department"}</SheetTitle>
        </SheetHeader>
        <hr />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full ">
            <div className="px-3 py-6 h-[calc(100vh-120px)]">
              <ScrollArea className="h-full"> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
                  
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Enter department code" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Enter department name" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="short_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Enter short name" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="company_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Select value={String(field.value || "")} onValueChange={(val) => field.onChange(val)} disabled={isSubmitting}>
                        <SelectTrigger><SelectValue placeholder={companiesLoading ? "Loading companies..." : (companiesError ? "Failed to load" : "Select company")} /></SelectTrigger>
                        <SelectContent>
                          {companiesLoading ? (<SelectItem value="loading" disabled>Loading...</SelectItem>) : companiesError ? (<SelectItem value="error" disabled>Error loading companies</SelectItem>) : companies.length > 0 ? (
                            companies.map((c: any) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                <div className="flex items-center gap-2"><span className="font-medium">{c.name}</span><span className="text-xs text-muted-foreground">({c.code})</span></div>
                              </SelectItem>
                            ))
                          ) : (<SelectItem value="no-data" disabled>No companies available</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="division_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Select value={String(field.value || "")} onValueChange={(val) => field.onChange(val)} disabled={isSubmitting}>
                        <SelectTrigger><SelectValue placeholder={divisionsLoading ? "Loading divisions..." : (divisionsError ? "Failed to load" : "Select division")} /></SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {divisionsLoading ? (<SelectItem value="loading" disabled>Loading...</SelectItem>) : divisionsError ? (<SelectItem value="error" disabled>Error loading divisions</SelectItem>) : divisions.length > 0 ? (
                            divisions.map((d: any) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                <div className="flex items-center gap-2"><span className="font-medium">{d.name}</span><span className="text-xs text-muted-foreground">({d.code})</span></div>
                              </SelectItem>
                            ))
                          ) : (<SelectItem value="no-data" disabled>No divisions available</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="parent_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Department <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <ReactSelectComponent
                        options={departmentOptions}
                        value={field.value ? String(field.value) : ""}
                        onChange={(value) => field.onChange(value || "")}
                        placeholder={departmentsLoading ? "Loading departments..." : departmentsError ? "Failed to load" : "Select parent department"}
                        disabled={isSubmitting || departmentsLoading}
                        isLoading={departmentsLoading}
                        isClearable={false}
                        isSearchable={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="Enter location" {...field} disabled={isSubmitting} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="is_active" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Switch className="w-[36px]" checked={field.value === 1} onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)} disabled={isSubmitting} />
                        <span className="text-sm text-muted-foreground">{field.value === 1 ? "Active" : "Inactive"}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                </div>
 
              </ScrollArea>
            </div>

            <SheetFooter className="gap-3 pt-4 border-t px-6 pb-6">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create Department" : "Update Department")}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}


