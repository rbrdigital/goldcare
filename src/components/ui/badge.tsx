import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-medical-blue text-white hover:opacity-95",
        secondary: "border-transparent bg-medical-blue-light text-medical-blue hover:opacity-95",
        destructive: "border-transparent bg-medical-red-light text-medical-red hover:opacity-95",
        neutral: "border border-border bg-surface text-fg hover:bg-surface-muted",
        outline: "border border-border text-fg hover:bg-surface-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
