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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAssignPermissions, useRevokePermissions } from "@/app/shared/sfa/user-permission-assignment/hooks";
import type { User } from "@/app/shared/sfa/user-permission-assignment/utils/types";
import { usePermissionsList } from "@/app/shared/sfa/permissions/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  permission_ids: z.array(z.number()).min(0),
});

type FormData = z.infer<typeof formSchema>;

interface AssignPermissionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function AssignPermissionsSheet({
  isOpen,
  onClose,
  user
}: AssignPermissionsSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: permissionsData } = usePermissionsList();
  const permissions = permissionsData?.data || [];
  const assignMutation = useAssignPermissions();
  const revokeMutation = useRevokePermissions();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permission_ids: [],
    },
  });

  // Reset form when user changes or sheet opens
  useEffect(() => {
    if (isOpen && user) {
      const currentPermissionIds = user.permissions 
        ? user.permissions.map((permission) => typeof permission === 'number' ? permission : permission.id)
        : [];
      form.reset({
        permission_ids: currentPermissionIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isOpen]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      const currentPermissionIds = user.permissions 
        ? user.permissions.map((permission) => typeof permission === 'number' ? permission : permission.id)
        : [];
      
      const permissionsToAssign = data.permission_ids.filter(id => !currentPermissionIds.includes(id));
      const permissionsToRevoke = currentPermissionIds.filter(id => !data.permission_ids.includes(id));

      // Assign new permissions
      if (permissionsToAssign.length > 0) {
        await assignMutation.mutateAsync({
          userId: user.id,
          payload: { permission_ids: permissionsToAssign },
        });
      }

      // Revoke removed permissions
      if (permissionsToRevoke.length > 0) {
        await revokeMutation.mutateAsync({
          userId: user.id,
          payload: { permission_ids: permissionsToRevoke },
        });
      }

      if (permissionsToAssign.length > 0 || permissionsToRevoke.length > 0) {
        toast.success("User permissions updated successfully.");
      } else {
        toast.info("No changes to save.");
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

  const handleClose = (open: boolean) => {
    // Prevent closing if currently submitting
    if (!open && isSubmitting) {
      return;
    }
    
    // Handle close
    if (!open) {
      // Reset form to default values
      form.reset({
        permission_ids: [],
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      form.reset({
        permission_ids: [],
      });
      onClose();
    }
  };

  const togglePermission = (permissionId: number) => {
    const currentPermissionIds = form.getValues("permission_ids") || [];
    const isSelected = currentPermissionIds.includes(permissionId);
    
    if (isSelected) {
      const newPermissionIds = currentPermissionIds.filter((id: number) => id !== permissionId);
      form.setValue("permission_ids", newPermissionIds, { shouldValidate: true, shouldDirty: true });
    } else {
      const newPermissionIds = [...currentPermissionIds, permissionId];
      form.setValue("permission_ids", newPermissionIds, { shouldValidate: true, shouldDirty: true });
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="py-3 pl-4">
          <SheetTitle>
            Assign Permissions - {user?.full_name || user?.email}
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
                    name="permission_ids"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <FormLabel>Select Permissions</FormLabel>
                          <div className="space-y-2 border rounded-md p-3">
                            {permissions.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No permissions available</p>
                            ) : (
                              permissions.map((permission: any) => {
                                const isSelected = (field.value || []).includes(permission.id);
                                return (
                                  <div
                                    key={permission.id}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      togglePermission(permission.id);
                                    }}
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => {
                                        togglePermission(permission.id);
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                      aria-label={`Select permission ${permission.name}`}
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium">{permission.label || permission.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {permission.module?.name || permission.guard_name}
                                        {permission.module && permission.guard_name !== permission.module.name && ` • ${permission.guard_name}`}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                          {(field.value || []).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(field.value || []).map((permissionId: number) => {
                                const permission = permissions.find((p: any) => p.id === permissionId);
                                return permission ? (
                                  <Badge key={permissionId} variant="secondary">
                                    {permission.label || permission.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
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
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

