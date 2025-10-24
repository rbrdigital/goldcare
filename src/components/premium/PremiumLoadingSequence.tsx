import { useEffect, useState } from "react";
import { GoldCareAIIcon } from "../icons/GoldCareAIIcon";

interface PremiumLoadingSequenceProps {
  onComplete?: () => void;
}

type Phase = "thinking" | "synthesizing" | "ready" | "complete";

export function PremiumLoadingSequence({ onComplete }: PremiumLoadingSequenceProps) {
  const [phase, setPhase] = useState<Phase>("thinking");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Thinking (0-1.5s)
    timers.push(setTimeout(() => setPhase("synthesizing"), 1500));
    
    // Phase 2: Synthesizing (1.5-2.5s)
    timers.push(setTimeout(() => setPhase("ready"), 2500));
    
    // Phase 3: Ready (2.5-4s)
    timers.push(setTimeout(() => {
      setPhase("complete");
      setVisible(false);
    }, 4000));

    // Notify parent when complete
    timers.push(setTimeout(() => {
      onComplete?.();
    }, 4200));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (!visible) return null;

  const messages = {
    thinking: "Analyzing patient context...",
    synthesizing: "Synthesizing clinical insights...",
    ready: "Everything is ready for you, Doctor.",
    complete: ""
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
      {/* Radial gradient pulse background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--gc-gold-500) / 0.08) 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Phase 1: Pulsing dot */}
        {phase === "thinking" && (
          <div className="relative">
            <div 
              className="h-3 w-3 rounded-full bg-gc-gold-500 animate-pulse"
              style={{
                boxShadow: "0 0 20px hsl(var(--gc-gold-500) / 0.6), 0 0 40px hsl(var(--gc-gold-500) / 0.3)"
              }}
            />
            {/* Concentric rings */}
            <div className="absolute inset-0 -m-4 rounded-full border border-gc-gold-500/30 animate-[ping_1.5s_ease-out_infinite]" />
            <div className="absolute inset-0 -m-8 rounded-full border border-gc-gold-500/20 animate-[ping_2s_ease-out_infinite]" />
          </div>
        )}

        {/* Phase 2: Icon with orbiting orbs */}
        {phase === "synthesizing" && (
          <div className="relative h-16 w-16">
            <GoldCareAIIcon 
              className="h-16 w-16 text-gc-gold-500 animate-fade-in"
            />
            {/* Orbiting data orbs */}
            {[0, 120, 240].map((rotation, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-gc-gold-400"
                style={{
                  animation: `orbit 2s linear infinite`,
                  animationDelay: `${i * 0.33}s`,
                  transformOrigin: "-24px 0",
                  transform: `rotate(${rotation}deg)`
                }}
              />
            ))}
          </div>
        )}

        {/* Phase 3: Ready state with glow */}
        {phase === "ready" && (
          <div 
            className="relative"
            style={{
              filter: "drop-shadow(0 0 20px hsl(var(--gc-gold-500) / 0.5))"
            }}
          >
            <GoldCareAIIcon 
              className="h-20 w-20 text-gc-gold-500 animate-[scale-in_0.5s_ease-out]"
            />
          </div>
        )}

        {/* Message with typing effect */}
        <p className="text-sm text-fg-muted animate-fade-in">
          {messages[phase]}
        </p>
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(32px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(32px) rotate(-360deg);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
