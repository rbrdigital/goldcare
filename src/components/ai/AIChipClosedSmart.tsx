// src/components/ai/AIChipClosedSmart.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface AIChipClosedSmartProps {
  text: string;
  onInsert: () => void;
  onPreview: () => void;
  className?: string;
}

export function AIChipClosedSmart({
  text,
  onInsert,
  onPreview,
  className
}: AIChipClosedSmartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  const measure = React.useCallback(() => {
    const el = previewRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollWidth > el.clientWidth);
  }, []);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, text]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const onWin = () => measure();
    window.addEventListener("resize", onWin);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, [measure]);

  // Keep it single-line, no word breaks
  const displayText = text ?? "";

  const actionLabel = isOverflowing ? "Preview" : "Insert";
  const actionHandler = isOverflowing ? onPreview : onInsert;

  return (
    <div
      ref={containerRef}
      className={cn(
        "inline-flex items-center max-w-full select-none",
        "rounded-full border border-border bg-surface-muted",
        "px-3 py-1 gap-2 text-fg",
        className
      )}
    >
      {/* 14×14 inline icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        aria-hidden="true"
        className="shrink-0 text-fg"
      >
        <path
          d="M7 1.5c2.9 0 5 2.1 5 5s-2.1 5-5 5-5-2.1-5-5 2.1-5 5-5Zm-.5 2h1v2.1l1.6.9-.5.9L6.5 7V3.5Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>

      <span className="text-sm font-medium whitespace-nowrap">GoldCare&nbsp;AI:</span>

      <span
        ref={previewRef}
        className="text-sm min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
        title={displayText}
        data-testid="gcai-preview-text"
      >
        {displayText}
      </span>

      <div className="flex-1 min-w-[8px]" />

      <button
        type="button"
        onClick={actionHandler}
        className={cn(
          "h-7 px-3 rounded-full border border-border bg-surface",
          "text-sm text-fg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}
        aria-label={`${actionLabel} GoldCare AI suggestion`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
