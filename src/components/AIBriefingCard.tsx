import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface AIBriefingCardProps {
  todaysFocus?: string;
  aiSummary?: string;
  providerTip?: string;
}

export function AIBriefingCard({
  todaysFocus = "Optimize thyroid function and address fatigue.",
  aiSummary = "Patient reports low energy, hair loss, and cold sensitivity. Seeks alternative to Synthroid. Prior labs indicate TSH 3.8.",
  providerTip = "Consider reviewing supplement list and ordering updated thyroid panel."
}: AIBriefingCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  useEffect(() => {
    // Initial card fade-in
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    
    // Staggered text reveal
    const timer2 = setTimeout(() => setShowLine1(true), 400);
    const timer3 = setTimeout(() => setShowLine2(true), 1200);
    const timer4 = setTimeout(() => setShowLine3(true), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <Card 
      className={`
        relative overflow-hidden bg-surface border border-border shadow-sm
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Gold accent bar at top */}
      <div className="relative h-1 bg-surface overflow-hidden">
        <div 
          className={`
            absolute inset-0 bg-gradient-to-r from-[hsl(var(--warning))] via-[hsl(var(--warning))] to-transparent
            transition-transform duration-1000 ease-out
            ${isVisible ? 'translate-x-0' : '-translate-x-full'}
          `}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <div 
            className={`
              h-10 w-10 rounded-lg bg-[hsl(var(--warning))]/10 
              flex items-center justify-center
              transition-all duration-700 ease-out
              ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
            `}
          >
            <Sparkles 
              className={`
                h-5 w-5 text-[hsl(var(--warning))]
                ${isVisible ? 'animate-pulse' : ''}
              `}
              style={{ animationDuration: '2s', animationIterationCount: '1' }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-4">
          {/* Line 1: Today's Focus */}
          <div 
            className={`
              transition-all duration-500 ease-out
              ${showLine1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            <h3 className="text-sm font-semibold text-fg mb-1">
              Today's Focus
            </h3>
            <p className="text-base text-fg leading-relaxed">
              {todaysFocus}
            </p>
          </div>

          {/* Line 2: AI Summary */}
          <div 
            className={`
              transition-all duration-500 ease-out delay-100
              ${showLine2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            <h3 className="text-sm font-semibold text-fg mb-1">
              AI Summary
            </h3>
            <p className="text-sm text-fg-muted leading-relaxed">
              {aiSummary}
            </p>
          </div>

          {/* Line 3: Provider Tip */}
          <div 
            className={`
              transition-all duration-500 ease-out delay-200
              ${showLine3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            <h3 className="text-sm font-semibold text-[hsl(var(--warning))] mb-1">
              Provider Tip
            </h3>
            <p className="text-sm text-fg-muted leading-relaxed">
              {providerTip}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
