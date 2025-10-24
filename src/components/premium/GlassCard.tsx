import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  hover = false, 
  glow = false,
  style,
  onMouseEnter,
  onMouseLeave 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg outline outline-1 outline-border bg-surface/70 backdrop-blur-xl",
        "transition-all duration-300",
        hover && "hover:translate-y-[-2px] hover:shadow-lg hover:outline-gc-gold-500/30",
        glow && "shadow-[0_0_20px_rgba(212,175,55,0.1)]",
        className
      )}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
