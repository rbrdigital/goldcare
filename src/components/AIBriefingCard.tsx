import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function AIBriefingCard() {
  const [visible, setVisible] = useState(false);
  const [glowComplete, setGlowComplete] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    const timer = setTimeout(() => setVisible(true), 100);
    // Glow animation completes after 1s
    const glowTimer = setTimeout(() => setGlowComplete(true), 1100);
    return () => {
      clearTimeout(timer);
      clearTimeout(glowTimer);
    };
  }, []);

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg bg-surface border border-border
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 h-1 bg-warning overflow-hidden">
        <div
          className={`h-full bg-warning transition-transform duration-1000 ease-out ${
            visible ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ width: "100vw" }}
        />
      </div>

      <div className="px-6 py-5 flex gap-4">
        {/* Spark icon with glow */}
        <div className="flex-shrink-0 pt-1">
          <Sparkles
            className={`h-5 w-5 text-warning transition-all duration-500 ${
              glowComplete ? "opacity-100" : "opacity-100 drop-shadow-[0_0_8px_hsl(var(--warning))]"
            }`}
          />
        </div>

        {/* Content */}
        <div className="space-y-3 flex-1 min-w-0">
          {/* Patient Goal */}
          <div
            className={`transition-all duration-500 delay-100 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            }`}
          >
            <h3 className="text-sm font-bold text-fg mb-1">Today's Focus:</h3>
            <p className="text-sm text-fg">
              Optimize thyroid function and address fatigue.
            </p>
          </div>

          {/* AI Summary */}
          <div
            className={`transition-all duration-500 delay-300 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            }`}
          >
            <h3 className="text-sm font-bold text-fg mb-1">AI Summary:</h3>
            <p className="text-sm text-fg-muted">
              Patient reports low energy, hair loss, and cold sensitivity. Seeks alternative to Synthroid. Prior labs indicate TSH 3.8.
            </p>
          </div>

          {/* Provider Tip */}
          <div
            className={`transition-all duration-500 delay-500 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            }`}
          >
            <p className="text-sm text-fg-muted italic">
              Provider Tip: Consider reviewing supplement list and ordering updated thyroid panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
