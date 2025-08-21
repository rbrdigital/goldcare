import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

export function RightPanel({ isOpen, children, className }: RightPanelProps) {
  if (!isOpen) return null;
  
  return (
    <aside 
      className={cn(
        "w-[360px] md:w-[420px] lg:w-[480px] bg-bg border-l border-border flex flex-col pt-0",
        className
      )}
    >
      {children}
    </aside>
  );
}