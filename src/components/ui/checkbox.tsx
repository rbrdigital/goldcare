import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm transition-all duration-200",
      "border border-[color:var(--border-subtle)] bg-[color:var(--surface-base)]",
      "hover:border-[color:var(--border-strong)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--border-strong)] focus-visible:ring-offset-2",
      "data-[state=checked]:bg-[color:var(--surface-inverse)] data-[state=checked]:border-[color:var(--surface-inverse)]",
      "disabled:cursor-not-allowed disabled:bg-[color:var(--surface-disabled)] disabled:border-[color:var(--border-subtle)] disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-[color:var(--content-inverse)]",
        "disabled:text-[color:var(--content-disabled)]"
      )}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
