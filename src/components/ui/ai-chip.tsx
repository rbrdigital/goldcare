import * as React from "react"
import { cn } from "@/lib/utils"
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart"
import { AIChipPanel } from "@/components/ai/AIChipPanel"

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
    onDismiss?.();
  };

  const handleClose = () => {
    setIsExpanded(false);
    onDismiss?.();
  };

  const handlePreview = () => {
    setIsExpanded(true);
  };

  if (!isExpanded) {
    return (
      <AIChipClosedSmart
        text={text}
        onInsert={handleInsert}
        onPreview={handlePreview}
        className={className}
      />
    );
  }

  return (
    <AIChipPanel
      text={text}
      onInsert={handleInsert}
      onClose={handleClose}
      className={className}
    />
  );
}