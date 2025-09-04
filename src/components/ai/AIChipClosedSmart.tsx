import * as React from "react"
import { cn } from "@/lib/utils"
import AIChipPanel from "./AIChipPanel"
import { AIChipPanelCustomizable } from "./AIChipPanelCustomizable"
import { useConsultStore } from "@/store/useConsultStore"

interface AIChipClosedSmartProps {
  text: string;
  onInsert: () => void;
  onGenerateInsert?: (text: string) => void;
  useCustomizable?: boolean;
  className?: string;
}

// Utility to truncate text at word boundaries
function truncateAtWord(input: string, max = 140): string {
  if (!input) return "";
  if (input.length <= max) return input;
  const slice = input.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trimEnd() + "…";
}

export function AIChipClosedSmart({ text, onInsert, onGenerateInsert, useCustomizable = false, className }: AIChipClosedSmartProps) {
  const { isAIVisible } = useConsultStore();
  const previewRef = React.useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const measure = React.useCallback(() => {
    const el = previewRef.current;
    if (!el) return;
    // measure after layout
    const overflowing = el.scrollWidth > el.clientWidth;
    console.log('🐛 AIChipClosedSmart: measuring overflow', { overflowing, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
    setIsOverflowing(overflowing);
  }, []);

  React.useEffect(() => {
    measure();
  }, [text, measure]);

  React.useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Hide the component if AI is not visible
  if (!isAIVisible) {
    return null;
  }

  // If overflowing and not expanded, pre-truncate to a pleasant word boundary
  const displayText = (isOverflowing && !isExpanded) ? truncateAtWord(text, 140) : text;

  // If expanded, use appropriate panel for the expanded state
  if (isExpanded) {
    console.log('🐛 AIChipClosedSmart: rendering expanded state with', useCustomizable ? 'AIChipPanelCustomizable' : 'AIChipPanel');
    
    if (useCustomizable) {
      return (
        <AIChipPanelCustomizable
          text={text}
          onInsert={() => {
            console.log('🐛 AIChipClosedSmart: Insert clicked in customizable expanded state');
            onInsert();
          }}
          onGenerateInsert={onGenerateInsert}
          onClose={() => {
            console.log('🐛 AIChipClosedSmart: Close clicked, collapsing');
            setIsExpanded(false);
          }}
          className={cn("mt-2", className)}
          data-testid="gcai-expanded-panel"
        />
      );
    }
    
    return (
      <AIChipPanel
        text={text}
        onInsert={() => {
          console.log('🐛 AIChipClosedSmart: Insert clicked in expanded state');
          onInsert();
        }}
        onClose={() => {
          console.log('🐛 AIChipClosedSmart: Close clicked, collapsing');
          setIsExpanded(false);
        }}
        className={cn("mt-2", className)}
        data-testid="gcai-expanded-panel"
      />
    );
  }

  return (
    <div 
      className={cn(
        "relative mt-2 w-full flex items-center justify-between rounded-full px-3 py-2 text-[13px] text-fg transition-all duration-300",
        // GoldCare gradient background - pearl-like subtle gradient
        "bg-gradient-to-r from-white via-[#FBF9F5] to-white",
        // Soft gold border
        "border border-[#E8E1D6]",
        // AI Glow effect - subtle and professional
        "animate-ai-glow hover:animate-ai-glow-hover",
        // Hover state - warmer background
        "hover:bg-gradient-to-r hover:from-[#FAF5EC] hover:via-[#F8F4EE] hover:to-[#FAF5EC]",
        // Focus state - golden glow ring
        "focus-within:shadow-[0_0_0_2px_rgba(212,175,55,0.3)]",
        // Dark mode gradient
        "dark:bg-gradient-to-r dark:from-[#2B2925] dark:via-[#34322E] dark:to-[#2B2925]",
        "dark:hover:from-[#36342F] dark:hover:via-[#3A3833] dark:hover:to-[#36342F]",
        className
      )}
      role="group"
      aria-label="GoldCare AI suggestion"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="min-w-0 flex items-center gap-2 overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none"
          className={cn(
            "shrink-0 text-primary transition-colors duration-300",
            isHovered && "text-primary drop-shadow-sm"
          )}
          aria-hidden="true"
        >
          <mask id="mask0_1169_244" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
            <path d="M12 0H0V12H12V0Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_1169_244)">
            <path d="M9.74997 6.75C9.75087 6.90289 9.70444 7.05233 9.61699 7.17775C9.52954 7.30315 9.40534 7.39838 9.26149 7.45031L6.8437 8.34375L5.95308 10.7634C5.90034 10.9067 5.80491 11.0304 5.67968 11.1177C5.55445 11.2051 5.40544 11.2519 5.25277 11.2519C5.10008 11.2519 4.95107 11.2051 4.82584 11.1177C4.70062 11.0304 4.60519 10.9067 4.55245 10.7634L3.6562 8.34375L1.23652 7.45312C1.09323 7.40038 0.969577 7.30496 0.882224 7.17974C0.794879 7.0545 0.748047 6.9055 0.748047 6.75281C0.748047 6.60013 0.794879 6.45112 0.882224 6.32589C0.969577 6.20066 1.09323 6.10524 1.23652 6.0525L3.6562 5.15625L4.54683 2.73656C4.59957 2.59328 4.69499 2.46962 4.82022 2.38228C4.94545 2.29492 5.09446 2.24809 5.24714 2.24809C5.39982 2.24809 5.54883 2.29492 5.67406 2.38228C5.79928 2.46962 5.89471 2.59328 5.94745 2.73656L6.8437 5.15625L9.26337 6.04688C9.40729 6.09928 9.53142 6.19506 9.61857 6.32101C9.70572 6.44696 9.75162 6.59685 9.74997 6.75ZM7.12495 2.25H7.87497V3C7.87497 3.09946 7.91449 3.19484 7.98477 3.26516C8.05512 3.33549 8.15052 3.375 8.24997 3.375C8.34942 3.375 8.44482 3.33549 8.51509 3.26516C8.58544 3.19484 8.62497 3.09946 8.62497 3V2.25H9.37497C9.47442 2.25 9.56982 2.21049 9.64009 2.14016C9.71044 2.06984 9.74997 1.97446 9.74997 1.875C9.74997 1.77554 9.71044 1.68016 9.64009 1.60984C9.56982 1.53951 9.47442 1.5 9.37497 1.5H8.62497V0.75C8.62497 0.650544 8.58544 0.555161 8.51509 0.484835C8.44482 0.414509 8.34942 0.375 8.24997 0.375C8.15052 0.375 8.05512 0.414509 7.98477 0.484835C7.91449 0.555161 7.87497 0.650544 7.87497 0.75V1.5H7.12495C7.0255 1.5 6.93011 1.53951 6.85978 1.60984C6.78946 1.68016 6.74995 1.77554 6.74995 1.875C6.74995 1.97446 6.78946 2.06984 6.85978 2.14016C6.93011 2.21049 7.0255 2.25 7.12495 2.25ZM11.25 3.75H10.875V3.375C10.875 3.27554 10.8354 3.18016 10.7651 3.10984C10.6948 3.03951 10.5994 3 10.5 3C10.4005 3 10.3051 3.03951 10.2348 3.10984C10.1645 3.18016 10.125 3.27554 10.125 3.375V3.75H9.74997C9.65052 3.75 9.55512 3.78951 9.48477 3.85984C9.41449 3.93016 9.37497 4.02554 9.37497 4.125C9.37497 4.22446 9.41449 4.31984 9.48477 4.39016C9.55512 4.46049 9.65052 4.5 9.74997 4.5H10.125V4.875C10.125 4.97446 10.1645 5.06984 10.2348 5.14016C10.3051 5.21049 10.4005 5.25 10.5 5.25C10.5994 5.25 10.6948 5.21049 10.7651 5.14016C10.8354 5.06984 10.875 4.97446 10.875 4.875V4.5H11.25C11.3494 4.5 11.4448 4.46049 11.5151 4.39016C11.5854 4.31984 11.625 4.22446 11.625 4.125C11.625 4.02554 11.5854 3.93016 11.5151 3.85984C11.4448 3.78951 11.3494 3.75 11.25 3.75Z" fill="currentColor"/>
          </g>
        </svg>
        <strong className={cn(
          "shrink-0 transition-colors duration-300",
          isHovered ? "text-primary" : "text-fg"
        )}>
          GoldCare&nbsp;AI:
        </strong>
        <span 
          ref={previewRef}
          className="min-w-0 truncate whitespace-nowrap"
          data-testid="gcai-preview-text"
          title={text}
        >
          {displayText}
        </span>
      </div>

      {isOverflowing ? (
        <button
          type="button"
          onClick={() => {
            console.log('🐛 AIChipClosedSmart: Preview button clicked, expanding');
            setIsExpanded(true);
          }}
          className="ml-3 shrink-0 text-[12px] font-medium text-primary hover:underline focus:outline-none"
          aria-label="Preview GoldCare AI suggestion"
          data-testid="gcai-preview-btn"
        >
          Preview
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            console.log('🐛 AIChipClosedSmart: Insert button clicked (not overflowing)');
            onInsert();
          }}
          className="ml-3 shrink-0 text-[12px] font-medium text-primary hover:underline focus:outline-none"
          aria-label="Insert GoldCare AI suggestion"
          data-testid="gcai-insert-btn"
        >
          Insert
        </button>
      )}
    </div>
  );
}