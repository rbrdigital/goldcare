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
        gold: "h-8 px-3.5 gap-2 border-none bg-gc-gold-bg hover:bg-gc-gold-bg-hover focus:ring-2 focus:ring-gc-gold-ring focus:ring-offset-2 text-gc-gold-700 [&_svg]:text-gc-gold-700",
      },
      size: {
        default: "h-5 px-2.5 py-0.5 text-xs",
        sm: "h-7 px-3 py-0.5 text-xs",
        md: "h-8 px-3.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
