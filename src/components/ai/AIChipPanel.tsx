import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AIChipPanelProps {
  text: string;
  onInsert: () => void;
  onClose: () => void;
  className?: string;
}

export function AIChipPanel({ text, onInsert, onClose, className }: AIChipPanelProps) {
  const handleInsert = () => {
    onInsert();
    onClose();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleInsert();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={cn(
        "mt-3 rounded-md border border-border bg-surface-muted p-3",
        className
      )}
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            className="w-4 h-4 text-primary" 
            fill="currentColor" 
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_ai_panel)">
              <path d="M13 9c.001 0 0 .204-.177.57a1.02 1.02 0 0 1-.474.364l-3.224 1.19-1.188 3.226a1.5 1.5 0 0 1-2.5.472L4.875 11.125l-3.226-1.188A1 1 0 0 1 1 9.004c0-.204.062-.402.178-.57A1.02 1.02 0 0 1 1.65 8.07l3.225-1.195 1.188-3.226a1.5 1.5 0 0 1 2.5-.472l1.225 3.226 3.226 1.188c.192.07.358.197.474.365.117.167.178.367.178.59ZM9.5 3h1V1.5a.5.5 0 0 1 1 0V3h1.5a.5.5 0 0 1 0 1H11.5v1.5a.5.5 0 1 1-1 0V4H9.5a.5.5 0 0 1 0-1Z"/>
            </g>
            <defs>
              <clipPath id="clip0_ai_panel">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <span className="text-sm font-semibold text-fg">GoldCare AI</span>
        </div>
      </div>
      
      <p className="text-sm text-fg leading-relaxed line-clamp-3 mb-4">
        {text}
      </p>
      
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleInsert}>
          Insert
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}