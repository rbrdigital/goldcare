import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface FieldTipsProps {
  tip1: string;
  tip2: string;
}

export function FieldTips({ tip1, tip2 }: FieldTipsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center ml-1.5 text-fg-muted hover:text-fg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="start"
          className="max-w-[340px] bg-black text-white border-border p-4 space-y-3"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <p className="text-sm leading-relaxed">{tip1}</p>
          <p className="text-sm leading-relaxed">{tip2}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
