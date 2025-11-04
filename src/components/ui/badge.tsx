import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-black text-white hover:bg-gray-800",
        secondary: "border-transparent bg-gray-100 text-black hover:bg-gray-200",
        destructive: "border-transparent bg-red-100 text-red-600 hover:bg-red-200",
        neutral: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
        outline: "border border-gray-300 text-gray-900 hover:bg-gray-50",
        calcom: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-md",
        gold: "h-8 px-3.5 gap-2 border border-[#F5D6A7] bg-gc-gold-bg hover:bg-gc-gold-bg-hover focus:ring-2 focus:ring-gc-gold-ring focus:ring-offset-2 text-transparent bg-gradient-to-r from-gc-gold-700 via-gc-gold-500 to-gc-gold-600 bg-clip-text [-webkit-background-clip:text] [&_svg]:text-gc-gold-700",
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
