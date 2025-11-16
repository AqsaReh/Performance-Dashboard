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
import { useAssignRoles, useRevokeRoles } from "@/app/shared/sfa/user-role-assignment/hooks";
import type { User } from "@/app/shared/sfa/user-role-assignment/utils/types";
import { useRolesList } from "@/app/shared/sfa/roles/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  role_ids: z.array(z.number()).min(0),
});

type FormData = z.infer<typeof formSchema>;

interface AssignRolesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function AssignRolesSheet({
  isOpen,
  onClose,
  user
}: AssignRolesSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: rolesData } = useRolesList();
  const roles = rolesData?.data || [];
  const assignMutation = useAssignRoles();
  const revokeMutation = useRevokeRoles();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role_ids: [],
    },
  });

  // Reset form when user changes or sheet opens
  useEffect(() => {
    if (isOpen && user) {
      const currentRoleIds = user.roles 
        ? user.roles.map((role) => typeof role === 'number' ? role : role.id)
        : [];
      form.reset({
        role_ids: currentRoleIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isOpen]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      const currentRoleIds = user.roles 
        ? user.roles.map((role) => typeof role === 'number' ? role : role.id)
        : [];
      
      const rolesToAssign = data.role_ids.filter(id => !currentRoleIds.includes(id));
      const rolesToRevoke = currentRoleIds.filter(id => !data.role_ids.includes(id));

      // Assign new roles
      if (rolesToAssign.length > 0) {
        await assignMutation.mutateAsync({
          userId: user.id,
          payload: { role_ids: rolesToAssign },
        });
      }

      // Revoke removed roles
      if (rolesToRevoke.length > 0) {
        await revokeMutation.mutateAsync({
          userId: user.id,
          payload: { role_ids: rolesToRevoke },
        });
      }

      if (rolesToAssign.length > 0 || rolesToRevoke.length > 0) {
        toast.success("User roles updated successfully.");
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
        role_ids: [],
      });
      onClose();
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      form.reset({
        role_ids: [],
      });
      onClose();
    }
  };

  const toggleRole = (roleId: number) => {
    const currentRoleIds = form.getValues("role_ids") || [];
    const isSelected = currentRoleIds.includes(roleId);
    
    if (isSelected) {
      const newRoleIds = currentRoleIds.filter((id: number) => id !== roleId);
      form.setValue("role_ids", newRoleIds, { shouldValidate: true, shouldDirty: true });
    } else {
      const newRoleIds = [...currentRoleIds, roleId];
      form.setValue("role_ids", newRoleIds, { shouldValidate: true, shouldDirty: true });
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="py-3 pl-4">
          <SheetTitle>
            Assign Roles - {user?.full_name || user?.email}
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
                    name="role_ids"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <FormLabel>Select Roles</FormLabel>
                          <div className="space-y-2 border rounded-md p-3">
                            {roles.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No roles available</p>
                            ) : (
                              roles.map((role: any) => {
                                const isSelected = (field.value || []).includes(role.id);
                                return (
                                  <div
                                    key={role.id}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleRole(role.id);
                                    }}
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => {
                                        toggleRole(role.id);
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                      aria-label={`Select role ${role.name}`}
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium">{role.name}</div>
                                      <div className="text-xs text-muted-foreground">{role.guard_name}</div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                          {(field.value || []).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(field.value || []).map((roleId: number) => {
                                const role = roles.find((r: any) => r.id === roleId);
                                return role ? (
                                  <Badge key={roleId} variant="secondary">
                                    {role.name}
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

