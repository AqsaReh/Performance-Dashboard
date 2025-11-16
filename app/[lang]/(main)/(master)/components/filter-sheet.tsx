// components/filter-sheet.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Filter, RotateCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    options: FilterOption[];
}

export interface FilterState {
    [key: string]: string[];
}

interface FilterSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: FilterConfig[];
    onFilterChange: (filters: FilterState) => void;
    storageKey?: string;
}

export function FilterSheet({
    open,
    onOpenChange,
    filters,
    onFilterChange,
    storageKey = "capex-filters",
}: FilterSheetProps) {
    const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
    const [savedFilters, setSavedFilters] = useState<FilterState>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved filters from localStorage only when component mounts
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setSavedFilters(parsed);
                    setSelectedFilters(parsed); // Pre-populate with saved filters
                    setIsInitialized(true);
                } catch (error) {
                    console.error("Error loading filters from localStorage:", error);
                    setIsInitialized(true);
                }
            } else {
                setIsInitialized(true);
            }
        }
    }, [storageKey, isInitialized]);

    const handleFilterToggle = (filterKey: string, value: string) => {
        setSelectedFilters(prev => {
            const currentValues = prev[filterKey] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            const updated = {
                ...prev,
                [filterKey]: newValues,
            };

            // Remove empty arrays
            if (newValues.length === 0) {
                delete updated[filterKey];
            }

            return updated;
        });
    };

    const isFilterSelected = (filterKey: string, value: string) => {
        return selectedFilters[filterKey]?.includes(value) || false;
    };

    const getSelectedCount = (filterKey: string) => {
        return selectedFilters[filterKey]?.length || 0;
    };

    const handleApplyFilters = () => {
        // Apply the current selected filters
        onFilterChange(selectedFilters);
        onOpenChange(false);
    };

    const handleSaveFilters = () => {
        // Save to localStorage with simple storage key
        localStorage.setItem(storageKey, JSON.stringify(selectedFilters));
        setSavedFilters(selectedFilters);

        // Apply the filters
        onFilterChange(selectedFilters);
        onOpenChange(false);

        toast.success("Filters saved successfully");
    };

    const handleResetFilters = () => {
        const resetFilters: FilterState = {};
        setSelectedFilters(resetFilters);
        onFilterChange(resetFilters);

        // Clear from localStorage
        if (typeof window !== "undefined") {
            localStorage.removeItem(storageKey);
        }

        setSavedFilters({});
    };

    const handleResetToSaved = () => {
        // Reset to the last saved filters
        setSelectedFilters(savedFilters);
    };

    const getSelectedLabels = (filterKey: string) => {
        const selectedValues = selectedFilters[filterKey] || [];
        const filterConfig = filters.find(f => f.key === filterKey);
        return selectedValues.map(value => {
            const option = filterConfig?.options.find(opt => opt.value === value);
            return option?.label || value;
        });
    };

    const totalSelectedFilters = Object.values(selectedFilters).reduce(
        (total, values) => total + values.length, 0
    );

    const hasUnsavedChanges = JSON.stringify(selectedFilters) !== JSON.stringify(savedFilters);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="max-w-[90vw] sm:max-w-md p-0">
                <SheetHeader className="py-3 pl-4 border-b">
                    <div className="flex items-center justify-between pr-[3rem]">
                        <SheetTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                            {totalSelectedFilters > 0 && (
                                <Badge variant="outline" className="ml-2">
                                    {totalSelectedFilters}
                                </Badge>
                            )}
                        </SheetTitle>
                        <div className="flex items-center gap-1">
                            {hasUnsavedChanges && Object.keys(savedFilters).length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetToSaved}
                                    className="h-8 px-2 text-xs"
                                >
                                    Reset to Saved
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                                disabled={totalSelectedFilters === 0}
                                className="h-8 px-2 text-xs"
                            >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Clear All
                            </Button>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex flex-col h-full">
                    <div className="px-2 py-6 h-[calc(100vh-120px)]">
                        <ScrollArea className="h-full">
                            <div className="space-y-6 px-4">
                                {filters.map((filter) => (
                                    <div key={filter.key} className="space-y-3">
                                        <Label className="text-sm font-medium flex items-center justify-between">
                                            {filter.label}
                                            {getSelectedCount(filter.key) > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                    {getSelectedCount(filter.key)}
                                                </Badge>
                                            )}
                                        </Label>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full justify-between border-border text-default-500 focus:outline-hidden focus:border-primary disabled:bg-default-200"
                                                >
                                                    <span className="truncate text-left">
                                                        {getSelectedCount(filter.key) === 0
                                                            ? `Select ${filter.label.toLowerCase()}`
                                                            : getSelectedLabels(filter.key).slice(0, 2).join(", ") +
                                                            (getSelectedCount(filter.key) > 2
                                                                ? ` +${getSelectedCount(filter.key) - 2}`
                                                                : "")}
                                                    </span>
                                                    <ChevronDown className="h-4 w-4 opacity-60" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[min(380px,90vw)] p-0" align="start">
                                                <div className="p-2 max-h-60 overflow-y-auto">
                                                    <div className="space-y-1">
                                                        {filter.options.map((option) => (
                                                            <label
                                                                key={option.value}
                                                                htmlFor={`${filter.key}-${option.value}`}
                                                                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                                            >
                                                                <Checkbox
                                                                    id={`${filter.key}-${option.value}`}
                                                                    checked={isFilterSelected(filter.key, option.value)}
                                                                    onCheckedChange={() => handleFilterToggle(filter.key, option.value)}
                                                                    className="border-default-300"
                                                                />
                                                                <span className="text-sm flex-1">{option.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        {/* Selected chips */}
                                        {getSelectedCount(filter.key) > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {getSelectedLabels(filter.key).map((label, index) => {
                                                    const value = selectedFilters[filter.key]?.[index];
                                                    return (
                                                        <Badge
                                                            key={value}
                                                            variant="outline"
                                                            className="flex items-center gap-1 text-xs"
                                                        >
                                                            {label}
                                                            <X
                                                                className="h-3 w-3 cursor-pointer"
                                                                onClick={() => handleFilterToggle(filter.key, value)}
                                                            />
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <SheetFooter className="gap-3 pt-4 border-t px-4 pb-4">
                        <div className="flex items-center gap-2.5 justify-between w-full">
                                <SheetClose asChild>
                                    <Button variant="outline" size="sm" type="button">
                                        Cancel
                                    </Button>
                                </SheetClose>
                            <div className="flex items-center gap-2.5">
                                <Button
                                    size="sm"
                                    onClick={handleApplyFilters}
                                    disabled={totalSelectedFilters === 0}
                                    variant="outline"
                                >
                                    Apply Filters
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSaveFilters}
                                    disabled={totalSelectedFilters === 0}
                                >
                                    Save Filters
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}