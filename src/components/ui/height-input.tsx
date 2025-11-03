import * as React from "react";
import { cn } from "@/lib/utils";

interface HeightInputProps {
  feet: string;
  inches: string;
  onFeetChange: (value: string) => void;
  onInchesChange: (value: string) => void;
  className?: string;
}

export function HeightInput({
  feet,
  inches,
  onFeetChange,
  onInchesChange,
  className,
}: HeightInputProps) {
  return (
    <div className={cn("flex items-stretch rounded-md border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary overflow-hidden", className)}>
      <div className="flex-1 flex items-center">
        <input
          type="number"
          value={feet}
          onChange={(e) => onFeetChange(e.target.value)}
          placeholder="5"
          min="0"
          max="8"
          className="w-full bg-transparent px-3 py-2.5 text-base md:text-sm placeholder:text-fg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="text-sm text-fg-muted pr-2">ft</span>
      </div>
      <div className="w-px bg-border"></div>
      <div className="flex-1 flex items-center">
        <input
          type="number"
          value={inches}
          onChange={(e) => onInchesChange(e.target.value)}
          placeholder="7"
          min="0"
          max="11"
          className="w-full bg-transparent px-3 py-2.5 text-base md:text-sm placeholder:text-fg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="text-sm text-fg-muted pr-2">in</span>
      </div>
    </div>
  );
}
