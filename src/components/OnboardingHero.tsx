import React from "react";
import { GoldCareAIIcon } from "@/components/icons/GoldCareAIIcon";

interface OnboardingHeroProps {
  onComplete?: () => void;
}

export function OnboardingHero({ onComplete }: OnboardingHeroProps) {
  const [phase, setPhase] = React.useState<"typing" | "fadeOut" | "hero">("typing");
  const [typedText, setTypedText] = React.useState("");
  
  const fullText = "GoldCare AI prepared your patient chart. You take it from here.";

  // Typing effect
  React.useEffect(() => {
    if (phase !== "typing") return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // After typing completes (2s total), wait a moment then fade out
        setTimeout(() => {
          setPhase("fadeOut");
        }, 500);
      }
    }, 2000 / fullText.length); // Distribute 2s across all characters

    return () => clearInterval(typingInterval);
  }, [phase]);

  // Fade out and show hero
  React.useEffect(() => {
    if (phase === "fadeOut") {
      const timer = setTimeout(() => {
        setPhase("hero");
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface border border-border">
      <div className="relative px-8 md:px-12 py-12 md:py-16">
        {/* Gold Pulse Background - visible during transition */}
        <div 
          className={`
            absolute inset-0 -z-10 transition-opacity duration-1000
            ${phase === "fadeOut" ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background: "radial-gradient(circle at center, hsla(var(--warning) / 0.08) 0%, transparent 70%)",
            animation: phase === "fadeOut" ? "pulse 1.5s ease-in-out" : "none"
          }}
        />

        {/* Typing Phase */}
        <div 
          className={`
            transition-all duration-800
            ${phase === "typing" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 absolute"}
          `}
        >
          <div className="max-w-3xl">
            <div className="mb-6">
              <GoldCareAIIcon className="h-6 w-6 md:h-8 md:w-8 text-fg" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-fg min-h-[4rem]">
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>
        </div>

        {/* Hero Phase */}
        <div 
          className={`
            transition-all duration-800
            ${phase === "hero" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            ${phase !== "hero" && "absolute top-12 md:top-16 left-8 md:left-12"}
          `}
        >
          <div className="max-w-3xl">
            <div className="mb-6">
              <GoldCareAIIcon className="h-6 w-6 md:h-8 md:w-8 text-fg" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-fg mb-4">
              Begin Your Clinical Documentation.
            </h1>
            <p className="text-lg md:text-xl text-fg-muted mb-8 max-w-2xl">
              GoldCare AI has everything prepped. Review the patient's latest vitals, notes, and suggested actions—or jump straight into documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
