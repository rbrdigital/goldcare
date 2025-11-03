import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NumberWithUnitInputProps {
  value: string;
  onValueChange: (value: string) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
  units: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: string;
  className?: string;
}

export function NumberWithUnitInput({
  value,
  onValueChange,
  unit,
  onUnitChange,
  units,
  placeholder = "Amount",
  min = "1",
  className,
}: NumberWithUnitInputProps) {
  return (
    <div className={cn("flex items-stretch rounded-md border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary overflow-hidden", className)}>
      <input
        type="number"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className="flex-1 bg-transparent px-3 py-2.5 text-base md:text-sm placeholder:text-fg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="flex items-center border-l border-border">
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="h-full border-0 bg-transparent px-3 py-2.5 text-base md:text-sm focus:ring-0 focus:ring-offset-0 min-w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.value} value={u.value}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
