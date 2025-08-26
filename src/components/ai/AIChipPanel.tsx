"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  onInsert: () => void;
  onClose: () => void;
  className?: string;
  "data-testid"?: string;
};

export default function AIChipPanel({
  text,
  onInsert,
  onClose,
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        // one-line pill; wraps naturally if space is tight
        "w-full rounded-full border border-border bg-surface-muted",
        "px-4 py-2 flex items-center gap-3",
        className
      )}
      {...rest}
    >
      {/* 14x14 vector icon */}
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

      {/* prefix + content stay in the same inline flow */}
      <span className="text-sm font-medium whitespace-nowrap">GoldCare&nbsp;AI:</span>

      <span className="text-sm leading-5 min-w-0 whitespace-normal">
        {text}
      </span>

      <div className="flex-1 min-w-[8px]" />

      {/* actions on the right: Insert (blue), Close (muted) */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "text-sm text-fg-muted hover:underline focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary rounded"
        )}
        aria-label="Close AI suggestion"
      >
        Close
      </button>

      <button
        type="button"
        onClick={onInsert}
        className={cn(
          "text-sm font-medium text-primary ml-2 hover:underline focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary rounded"
        )}
        aria-label="Insert AI suggestion"
        data-testid="gcai-insert"
      >
        Insert
      </button>
    </div>
  );
}