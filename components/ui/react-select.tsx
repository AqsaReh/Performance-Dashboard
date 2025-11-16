"use client";

import ReactSelect, { SingleValue, ActionMeta } from 'react-select';
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface ReactSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
}

export function ReactSelectComponent({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
}: ReactSelectProps) {
  const selectedOption = options.find(option => option.value === value) || null;

  const handleChange = (newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
    if (newValue) {
      onChange(newValue.value);
    } else {
      onChange("");
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '40px',
      borderColor: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--border))',
      boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--primary))' : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--primary))',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--foreground))',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
        ? 'hsl(var(--accent))'
        : 'transparent',
      color: state.isSelected
        ? 'hsl(var(--primary-foreground))'
        : 'hsl(var(--foreground))',
      '&:hover': {
        backgroundColor: state.isSelected
          ? 'hsl(var(--primary))'
          : 'hsl(var(--accent))',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '4px',
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
    }),
    loadingMessage: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
    }),
  };

  return (
    <div className={cn("w-full", className)}>
      <ReactSelect
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "No options found"}
        loadingMessage={() => "Loading..."}
        menuPlacement="auto"
        maxMenuHeight={200}
      />
    </div>
  );
}
