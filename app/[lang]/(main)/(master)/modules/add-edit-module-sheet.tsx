"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent, 
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateModule, useUpdateModule, useModulesList } from "@/app/shared/sfa/modules/hooks";
import type { Module } from "@/app/shared/sfa/modules/utils/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  slug: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  route: z.string().nullable().optional(),
  parent_id: z.union([z.number(), z.string(), z.null()]).nullable().optional(),
  order_no: z.number().optional(),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditModuleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  module?: Module | null;
}

export function AddEditModuleSheet({
  isOpen,
  onClose,
  mode,
  module
}: AddEditModuleSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: modulesData } = useModulesList();
  const modules = modulesData?.data || [];

  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: null,
      icon: null,
      route: null,
      parent_id: null,
      order_no: 0,
      status: "active",
    },
  });

  // Reset form when module changes or mode changes
  useEffect(() => {
    if (mode === "edit" && module) {
      form.reset({
        name: module.name,
        slug: module.slug,
        icon: module.icon,
        route: module.route,
        parent_id: module.parent_id ? (typeof module.parent_id === 'string' ? Number(module.parent_id) : module.parent_id) : null,
        order_no: typeof module.order_no === 'string' ? Number(module.order_no) : (module.order_no ?? 0),
        status: module.status as "active" | "inactive",
      });
    } else {
      form.reset({
        name: "",
        slug: null,
        icon: null,
        route: null,
        parent_id: null,
        order_no: 0,
        status: "active",
      });
    }
  }, [mode, module, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        parent_id: data.parent_id === "" || data.parent_id === null ? null : Number(data.parent_id),
        order_no: data.order_no || 0,
      };

      if (mode === "add") {
        await createMutation.mutateAsync(payload);
        toast.success("Module created successfully.");
      } else if (mode === "edit" && module) {
        await updateMutation.mutateAsync({
          id: module.id,
          payload,
        });
        toast.success("Module updated successfully.");
      }

      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          const errorMessages = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
          errorMessages.forEach((msg: string) => {
            toast.error(msg);
          });
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  // Filter out current module from parent options when editing
  const parentOptions = modules.filter((m: Module) => mode === "edit" ? m.id !== module?.id : true);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="py-3 pl-4">
          <SheetTitle>
            {mode === "add" ? "Add New Module" : "Edit Module"}
          </SheetTitle> 
        </SheetHeader>
        <hr />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-3 py-6 h-[calc(100vh-125px)]">
              <ScrollArea className="h-full">
                <div className="space-y-3 px-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter module name"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter module slug"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          URL-friendly identifier (optional)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter icon name or class"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Icon identifier (optional)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter route path"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Route path (optional)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Module</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(val === "none" ? null : Number(val))}
                            value={field.value ? String(field.value) : "none"}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent module (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {parentOptions.map((m: Module) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                  {m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter order number"
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Display order (default: 0)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(val as "active" | "inactive")}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
            </div>

            <SheetFooter className="gap-3 pt-4 border-t px-4 pb-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (mode === "add" ? "Creating..." : "Updating...")
                  : (mode === "add" ? "Create Module" : "Update Module")
                }
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

