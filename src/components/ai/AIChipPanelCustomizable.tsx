"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";

interface AIChipPanelCustomizableProps {
  text: string;
  onInsert: () => void;
  onClose: () => void;
  onGenerateInsert?: (text: string) => void;
  className?: string;
  "data-testid"?: string;
}

export function AIChipPanelCustomizable({
  text,
  onInsert,
  onClose,
  onGenerateInsert,
  className,
  ...rest
}: AIChipPanelCustomizableProps) {
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [customText, setCustomText] = React.useState("");

  const handleGenerate = () => {
    const textToInsert = customText.trim() || text;
    if (onGenerateInsert) {
      onGenerateInsert(textToInsert);
    }
    onClose();
  };

  return (
    <div className={cn("w-full", className)} {...rest}>
      {/* Main pill */}
      <div className="w-full rounded-full border border-border bg-surface-muted px-4 py-2 flex items-center gap-3">
        {/* 12x12 star icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none"
          className="shrink-0 text-fg"
          aria-hidden="true"
        >
          <mask id="mask0_1169_244" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
            <path d="M12 0H0V12H12V0Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_1169_244)">
            <path d="M9.74997 6.75C9.75087 6.90289 9.70444 7.05233 9.61699 7.17775C9.52954 7.30315 9.40534 7.39838 9.26149 7.45031L6.8437 8.34375L5.95308 10.7634C5.90034 10.9067 5.80491 11.0304 5.67968 11.1177C5.55445 11.2051 5.40544 11.2519 5.25277 11.2519C5.10008 11.2519 4.95107 11.2051 4.82584 11.1177C4.70062 11.0304 4.60519 10.9067 4.55245 10.7634L3.6562 8.34375L1.23652 7.45312C1.09323 7.40038 0.969577 7.30496 0.882224 7.17974C0.794879 7.0545 0.748047 6.9055 0.748047 6.75281C0.748047 6.60013 0.794879 6.45112 0.882224 6.32589C0.969577 6.20066 1.09323 6.10524 1.23652 6.0525L3.6562 5.15625L4.54683 2.73656C4.59957 2.59328 4.69499 2.46962 4.82022 2.38228C4.94545 2.29492 5.09446 2.24809 5.24714 2.24809C5.39982 2.24809 5.54883 2.29492 5.67406 2.38228C5.79928 2.46962 5.89471 2.59328 5.94745 2.73656L6.8437 5.15625L9.26337 6.04688C9.40729 6.09928 9.53142 6.19506 9.61857 6.32101C9.70572 6.44696 9.75162 6.59685 9.74997 6.75ZM7.12495 2.25H7.87497V3C7.87497 3.09946 7.91449 3.19484 7.98477 3.26516C8.05512 3.33549 8.15052 3.375 8.24997 3.375C8.34942 3.375 8.44482 3.33549 8.51509 3.26516C8.58544 3.19484 8.62497 3.09946 8.62497 3V2.25H9.37497C9.47442 2.25 9.56982 2.21049 9.64009 2.14016C9.71044 2.06984 9.74997 1.97446 9.74997 1.875C9.74997 1.77554 9.71044 1.68016 9.64009 1.60984C9.56982 1.53951 9.47442 1.5 9.37497 1.5H8.62497V0.75C8.62497 0.650544 8.58544 0.555161 8.51509 0.484835C8.44482 0.414509 8.34942 0.375 8.24997 0.375C8.15052 0.375 8.05512 0.414509 7.98477 0.484835C7.91449 0.555161 7.87497 0.650544 7.87497 0.75V1.5H7.12495C7.0255 1.5 6.93011 1.53951 6.85978 1.60984C6.78946 1.68016 6.74995 1.77554 6.74995 1.875C6.74995 1.97446 6.78946 2.06984 6.85978 2.14016C6.93011 2.21049 7.0255 2.25 7.12495 2.25ZM11.25 3.75H10.875V3.375C10.875 3.27554 10.8354 3.18016 10.7651 3.10984C10.6948 3.03951 10.5994 3 10.5 3C10.4005 3 10.3051 3.03951 10.2348 3.10984C10.1645 3.18016 10.125 3.27554 10.125 3.375V3.75H9.74997C9.65052 3.75 9.55512 3.78951 9.48477 3.85984C9.41449 3.93016 9.37497 4.02554 9.37497 4.125C9.37497 4.22446 9.41449 4.31984 9.48477 4.39016C9.55512 4.46049 9.65052 4.5 9.74997 4.5H10.125V4.875C10.125 4.97446 10.1645 5.06984 10.2348 5.14016C10.3051 5.21049 10.4005 5.25 10.5 5.25C10.5994 5.25 10.6948 5.21049 10.7651 5.14016C10.8354 5.06984 10.875 4.97446 10.875 4.875V4.5H11.25C11.3494 4.5 11.4448 4.46049 11.5151 4.39016C11.5854 4.31984 11.625 4.22446 11.625 4.125C11.625 4.02554 11.5854 3.93016 11.5151 3.85984C11.4448 3.78951 11.3494 3.75 11.25 3.75Z" fill="currentColor"/>
          </g>
        </svg>

        <strong className="shrink-0">GoldCare&nbsp;AI:</strong>
        <span className="text-sm leading-5 min-w-0 flex-1">{text}</span>

        {/* Actions on the right */}
        <button
          type="button"
          onClick={onInsert}
          className="text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ml-2"
          aria-label="Insert AI suggestion"
        >
          Insert
        </button>

        <button
          type="button"
          onClick={() => setShowCustomize(!showCustomize)}
          className="text-sm text-fg-muted hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ml-2"
          aria-label="Customize AI suggestion"
        >
          Customize
        </button>

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-fg-muted hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ml-2"
          aria-label="Close AI suggestion"
        >
          Close
        </button>
      </div>

      {/* Customization area */}
      {showCustomize && (
        <div className="mt-2 rounded-md border border-border bg-surface p-3">
          <div className="text-sm font-medium mb-2 text-fg">Refine this insight</div>
          <AutosizeTextarea
            minRows={2}
            placeholder="Describe the change. Example: emphasize renal dosing for eGFR 30; use plain language; include return precautions."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="mb-3"
          />
          <div className="flex items-center gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowCustomize(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              className="bg-black text-white hover:opacity-90"
            >
              GENERATE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}