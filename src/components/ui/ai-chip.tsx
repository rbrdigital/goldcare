import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AIChipProps {
  text: string;
  onInsert: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function AIChip({ text, onInsert, onDismiss, className }: AIChipProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleInsert = () => {
    onInsert();
    setIsExpanded(false);
  };

  const handleClose = () => {
    setIsExpanded(false);
    onDismiss?.();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleInsert();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={cn(
          "mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-100 transition-colors duration-140",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
        <span>GoldCare AI</span>
        <span>•</span>
        <span>Preview</span>
      </button>
    );
  }

  return (
    <div className={cn("mt-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 transition-all duration-140", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-bold text-neutral-800">GoldCare AI</span>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleInsert}>
            Insert
          </Button>
          <button 
            onClick={handleClose}
            className="text-[12px] text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      
      <p className="text-[13px] leading-relaxed text-neutral-800 line-clamp-3">
        {text}
      </p>
    </div>
  );
}