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
import { useCreateRole, useUpdateRole } from "@/app/shared/sfa/roles/hooks";
import type { Role } from "@/app/shared/sfa/roles/utils/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  guard_name: z.string().min(1, "Guard name is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditRoleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  role?: Role | null;
}

export function AddEditRoleSheet({
  isOpen,
  onClose,
  mode,
  role
}: AddEditRoleSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      guard_name: "web",
    },
  });

  // Reset form when role changes or mode changes
  useEffect(() => {
    if (mode === "edit" && role) {
      form.reset({
        name: role.name,
        guard_name: role.guard_name,
      });
    } else {
      form.reset({
        name: "",
        guard_name: "web",
      });
    }
  }, [mode, role, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (mode === "add") {
        await createMutation.mutateAsync(data);
        toast.success("Role created successfully.");
      } else if (mode === "edit" && role) {
        await updateMutation.mutateAsync({
          id: role.id,
          payload: data,
        });
        toast.success("Role updated successfully.");
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
            {mode === "add" ? "Add New Role" : "Edit Role"}
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
                            placeholder="Enter role name"
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
                          The guard that will be assigned to this role
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
                  : (mode === "add" ? "Create Role" : "Update Role")
                }
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

