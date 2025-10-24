import { GoldCareAIIcon } from "../icons/GoldCareAIIcon";
import { GlassCard } from "./GlassCard";
import { Button } from "../ui/button";
import { Sparkles, Activity } from "lucide-react";

export function IntelligentHeroSurface() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Ambient animated background with noise texture */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          animation: "slow-shift 20s ease-in-out infinite"
        }}
      />
      
      {/* Radial gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 40%, hsl(var(--gc-gold-500) / 0.03) 0%, transparent 60%)`
        }}
      />

      <div className="relative px-12 py-16 space-y-8">
        {/* AI Icon with perpetual glow */}
        <div className="flex items-center gap-3 animate-fade-in">
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

        {/* Hero content */}
        <div 
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
        >
          <h1 
            className="text-5xl md:text-6xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, hsl(var(--fg)) 0%, hsl(var(--fg-muted)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Welcome back, Dr. Chen
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl leading-relaxed">
            Your patient chart is ready. AI has prepared comprehensive insights to help you deliver exceptional care.
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
            <Sparkles className="h-4 w-4 mr-2" />
            Start with AI
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="hover:bg-surface-muted hover:border-fg/20 transition-all duration-200"
          >
            Traditional Documentation
          </Button>
        </div>

        {/* Live Context Panel - Floating Glass Card */}
        <GlassCard 
          className="max-w-sm p-6 space-y-3 animate-fade-in"
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
              <span className="text-fg-muted">Pending items</span>
              <span className="font-semibold text-fg">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">Last visit</span>
              <span className="font-semibold text-fg">2 weeks ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">AI confidence</span>
              <span className="font-semibold text-gc-gold-600">94%</span>
            </div>
          </div>
        </GlassCard>
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
        @keyframes slow-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2%, 2%); }
        }
      `}</style>
    </div>
  );
}
