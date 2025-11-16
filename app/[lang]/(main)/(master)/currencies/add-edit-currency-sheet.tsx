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
import { useCreateCurrency, useUpdateCurrency } from "@/app/shared/master/hooks";
import { Currency } from "@/app/shared/master/utils/types";

const formSchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol must be less than 10 characters"),
  is_default: z.string().min(1, "Default status is required"),
  is_active: z.string().min(1, "Active status is required")
});

type FormData = z.infer<typeof formSchema>;

interface AddEditCurrencySheetProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  currency?: Currency | null;
}

export function AddEditCurrencySheet({
  isOpen,
  onClose,
  mode,
  currency
}: AddEditCurrencySheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useCreateCurrency();
  const updateMutation = useUpdateCurrency();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      symbol: "",
      is_default: "0",
      is_active: "1",
    },
  });
  
  // currency code can't be greater than 3 characters
  useEffect(() => {
    if (form.getValues("code") && form.getValues("code").length > 3) {
      form.setError("code", { message: "Code must not be greater than 3 characters" });
    }
  }, [form.getValues("code")]);
  // Reset form when currency changes or mode changes
  useEffect(() => {
    if (mode === "edit" && currency) {
      form.reset({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        is_default: currency.is_default,
        is_active: currency.is_active,
      });
    } else {
      form.reset({
        code: "",
        name: "",
        symbol: "",
        is_default: "0",
        is_active: "1",
      });
    }
  }, [mode, currency, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (mode === "add") {
        await createMutation.mutateAsync(data);
          toast.success("Currency created successfully.");
      } else if (mode === "edit" && currency) {
        await updateMutation.mutateAsync({
          currency_id: currency.currency_id,
          payload: data,
        });
        toast.success("Currency updated successfully.");
      }

      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
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
            {mode === "add" ? "Add New Currency" : "Edit Currency"}
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
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter currency code (e.g., USD, EUR)"
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter currency name"
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
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter currency symbol"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Currency symbol (e.g., $, €, £)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Default </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(val)}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select default status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Yes</SelectItem>
                              <SelectItem value="0">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Status </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(val) => field.onChange(val)}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Active</SelectItem>
                              <SelectItem value="0">Inactive</SelectItem>
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
                  : (mode === "add" ? "Create Currency" : "Update Currency")
                }
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
