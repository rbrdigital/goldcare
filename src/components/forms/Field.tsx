import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FieldProps {
  label?: string;
  children: React.ReactNode;
  helper?: string;
  className?: string;
  required?: boolean;
  aiAction?: React.ReactNode;
}

export function Field({ label, children, helper, className, required, aiAction }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-fg-muted">
            {label}
            {required && <span className="text-medical-red ml-1">*</span>}
          </Label>
          {aiAction && <div className="ml-auto">{aiAction}</div>}
        </div>
      )}
      {children}
      {helper && (
        <p className="text-xs text-fg-muted">{helper}</p>
      )}
    </div>
  );
}

interface FieldRowProps {
  children: React.ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function FieldRow({ children, columns = 2, className }: FieldRowProps) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface InlineSuffixFieldProps {
  children: React.ReactNode;
  suffix: React.ReactNode;
  className?: string;
}

export function InlineSuffixField({ children, suffix, className }: InlineSuffixFieldProps) {
  return (
    <div className={cn("relative", className)}>
      {React.cloneElement(children as React.ReactElement, {
        className: cn(
          (children as React.ReactElement).props.className,
          "pr-20"
        )
      })}
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        {suffix}
      </div>
    </div>
  );
}