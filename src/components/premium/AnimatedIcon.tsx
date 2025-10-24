import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  animation?: "pulse" | "rotate" | "scale" | "none";
  size?: number;
}

export function AnimatedIcon({ 
  icon: Icon, 
  className, 
  animation = "none",
  size = 24 
}: AnimatedIconProps) {
  const animations = {
    pulse: "animate-[pulse_2s_ease-in-out_infinite]",
    rotate: "animate-[spin_20s_linear_infinite]",
    scale: "animate-[scale-pulse_2s_ease-in-out_infinite]",
    none: ""
  };

  return (
    <Icon 
      size={size}
      className={cn(
        "transition-all duration-300",
        animations[animation],
        className
      )}
    />
  );
}
