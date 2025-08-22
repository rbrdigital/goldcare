import * as React from "react"
import { cn } from "@/lib/utils"

export interface AutosizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
}

const AutosizeTextarea = React.forwardRef<HTMLTextAreaElement, AutosizeTextareaProps>(
  ({ className, minRows = 2, maxRows = 8, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [internalRef, setInternalRef] = React.useState<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => internalRef!, [internalRef]);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get proper scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate min and max heights based on line height
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseInt(computedStyle.lineHeight);
      const paddingTop = parseInt(computedStyle.paddingTop);
      const paddingBottom = parseInt(computedStyle.paddingBottom);
      
      const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
      
      // Set height based on content, within min/max bounds
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [minRows, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [props.value, adjustHeight]);

    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        setInternalRef(textarea);
        adjustHeight();
      }
    }, [adjustHeight]);

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md bg-surface text-fg placeholder:text-fg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-hidden aria-invalid:border-danger aria-invalid:focus:ring-danger",
          className
        )}
        ref={textareaRef}
        onChange={(e) => {
          props.onChange?.(e);
          adjustHeight();
        }}
        {...props}
      />
    );
  }
);
AutosizeTextarea.displayName = "AutosizeTextarea";

export { AutosizeTextarea };