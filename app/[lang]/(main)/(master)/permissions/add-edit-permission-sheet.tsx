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
import { useCreatePermission, useUpdatePermission } from "@/app/shared/sfa/permissions/hooks";
import type { Permission } from "@/app/shared/sfa/permissions/utils/types";
import { useModulesList } from "@/app/shared/sfa/modules/hooks";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  guard_name: z.string().min(1, "Guard name is required"),
  module_id: z.union([z.number(), z.string(), z.null()]).nullable().optional(),
  label: z.string().nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditPermissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  permission?: Permission | null;
}

export function AddEditPermissionSheet({
  isOpen,
  onClose,
  mode,
  permission
}: AddEditPermissionSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: modulesData } = useModulesList();
  const modules = modulesData?.data || [];

  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      guard_name: "web",
      module_id: null,
      label: null,
    },
  });

  // Reset form when permission changes or mode changes
  useEffect(() => {
    if (mode === "edit" && permission) {
      form.reset({
        name: permission.name,
        guard_name: permission.guard_name,
        module_id: permission.module_id ? (typeof permission.module_id === 'string' ? Number(permission.module_id) : permission.module_id) : null,
        label: permission.label,
      });
    } else {
      form.reset({
        name: "",
        guard_name: "web",
        module_id: null,
        label: null,
      });
    }
  }, [mode, permission, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        module_id: data.module_id === "" || data.module_id === null ? null : Number(data.module_id),
      };

      if (mode === "add") {
        await createMutation.mutateAsync(payload);
        toast.success("Permission created successfully.");
      } else if (mode === "edit" && permission) {
        await updateMutation.mutateAsync({
          id: permission.id,
          payload,
        });
        toast.success("Permission updated successfully.");
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

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="py-3 pl-4">
          <SheetTitle>
            {mode === "add" ? "Add New Permission" : "Edit Permission"}
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
                        <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter permission name"
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
                    name="guard_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guard Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(val)}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select guard name" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web">Web</SelectItem>
                              <SelectItem value="api">API</SelectItem>
                              <SelectItem value="sanctum">Sanctum</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          The guard that will be assigned to this permission
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="module_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(val === "none" ? null : Number(val))}
                            value={field.value ? String(field.value) : "none"}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select module (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {modules.map((m: any) => (
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
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter permission label"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Display label for the permission (optional)
                        </p>
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
                  : (mode === "add" ? "Create Permission" : "Update Permission")
                }
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

