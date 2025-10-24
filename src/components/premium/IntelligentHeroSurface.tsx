import { GoldCareAIIcon } from "../icons/GoldCareAIIcon";
import { GlassCard } from "./GlassCard";
import { Button } from "../ui/button";
import { Sparkles, Activity, Clock, Pill, FlaskConical } from "lucide-react";

export function IntelligentHeroSurface() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Clean radial gradients - removed noise texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 30% 40%, hsl(var(--gc-gold-500) / 0.02) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 60%, hsl(var(--gc-gold-500) / 0.015) 0%, transparent 50%)
          `
        }}
      />

      <div 
        className="relative py-20"
        style={{
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        {/* AI Icon with perpetual glow - Full width header */}
        <div className="flex items-center gap-5 animate-fade-in mb-12">
          <div 
            className="relative"
            style={{
              animation: "rotate-glow 20s linear infinite"
            }}
          >
            <GoldCareAIIcon 
              className="h-10 w-10 text-gc-gold-500"
              style={{
                filter: "drop-shadow(0 0 12px hsl(var(--gc-gold-500) / 0.4))"
              }}
            />
          </div>
          <span className="text-sm font-medium text-gc-gold-600">GoldCare AI</span>
        </div>

        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Hero content */}
          <div className="space-y-8 min-w-0">
            <div 
              className="space-y-4 animate-fade-in"
              style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-fg">
                Visit Overview
              </h1>
              <p className="text-lg text-fg-muted max-w-2xl leading-relaxed">
                GoldCare AI has analyzed the live appointment transcription, prior clinical notes, intake responses, and uploaded records. Below is the structured summary to guide your next actions.
              </p>
            </div>

            {/* CTAs */}
            <div 
              className="flex gap-3 animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
            >
              <Button 
                size="lg"
                className="bg-fg text-bg hover:bg-fg/90 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Open AI Draft
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="hover:bg-surface-muted hover:border-fg/20 transition-all duration-200"
              >
                Document Manually
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Context Cards Stack */}
          <div className="space-y-4 min-w-0">
            {/* Live Context Panel */}
            <GlassCard 
              className="p-6 space-y-3 animate-fade-in"
              hover
              glow
              style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-fg-muted uppercase tracking-wide">
                <Activity className="h-3 w-3 text-gc-gold-500 animate-pulse" />
                Live Context
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Outstanding tasks</span>
                  <span className="font-semibold text-fg">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">Last encounter</span>
                  <span className="font-semibold text-fg">2 weeks ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted">AI confidence</span>
                  <span className="font-semibold text-gc-gold-600">94%</span>
                </div>
                <p className="text-xs text-fg-muted pt-1 leading-relaxed">
                  (based on transcription clarity, data consistency, and prior history alignment)
                </p>
              </div>
            </GlassCard>

            {/* Quick Stats Panel - NEW */}
            <GlassCard 
              className="p-6 space-y-3 animate-fade-in"
              hover
              style={{ animationDelay: "0.8s", animationFillMode: "backwards" }}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-fg-muted uppercase tracking-wide">
                <Activity className="h-3 w-3 text-gc-gold-500" />
                Quick Stats
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-fg-muted">
                    <Pill className="h-3.5 w-3.5" />
                    Active medications
                  </span>
                  <span className="font-semibold text-fg">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-fg-muted">
                    <FlaskConical className="h-3.5 w-3.5" />
                    Pending lab results
                  </span>
                  <span className="font-semibold text-fg">1 (CMP)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-fg-muted">
                    <Clock className="h-3.5 w-3.5" />
                    Today's visit
                  </span>
                  <span className="font-semibold text-fg">Ongoing consultation</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rotate-glow {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 12px hsl(var(--gc-gold-500) / 0.4));
          }
          50% { 
            transform: rotate(180deg) scale(1.05);
            filter: drop-shadow(0 0 16px hsl(var(--gc-gold-500) / 0.5));
          }
        }
      `}</style>
    </div>
  );
}
