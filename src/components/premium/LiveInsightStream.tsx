import { GlassCard } from "./GlassCard";
import { TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

type InsightType = "context" | "alert" | "suggestion";

interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  action: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "context",
    title: "A1c Trending Up",
    description: "From patient transcript and lab history: A1c increased from 5.6% → 6.1% in 6 months. Diet adjustments discussed in today's call. Consider medication review if trend continues.",
    action: "View Trend"
  },
  {
    id: "2",
    type: "alert",
    title: "Renal Risk Combination",
    description: "Transcription flagged chronic ibuprofen mention. Combined with lisinopril, may impact renal function. AI cross-referenced prior CMP; recommends monitoring creatinine/eGFR once current labs return.",
    action: "Review Now"
  },
  {
    id: "3",
    type: "suggestion",
    title: "Add Ferritin & B12 Tests",
    description: "Patient described fatigue and lightheadedness during intake and in transcript. No recent iron studies found in uploaded labs (last 9 months).",
    action: "Add to Labs"
  }
];

const insightStyles: Record<InsightType, { icon: typeof TrendingUp; iconColor: string; accentColor: string }> = {
  context: {
    icon: TrendingUp,
    iconColor: "text-primary",
    accentColor: "border-t-primary"
  },
  alert: {
    icon: AlertTriangle,
    iconColor: "text-danger",
    accentColor: "border-t-danger"
  },
  suggestion: {
    icon: Lightbulb,
    iconColor: "text-gc-gold-500",
    accentColor: "border-t-gc-gold-500"
  }
};

export function LiveInsightStream() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-fg">AI Insights</h2>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-gc-gold-500 animate-pulse" />
            <span className="text-xs text-fg-muted">Live</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-fg-muted hover:text-fg">
          See All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Horizontal scrolling insight cards */}
      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overscrollBehaviorX: "contain"
        }}
      >
        {insights.map((insight, index) => {
          const { icon: Icon, iconColor, accentColor } = insightStyles[insight.type];
          
          return (
            <GlassCard
              key={insight.id}
              className={`
                flex-shrink-0 w-80 p-6 space-y-4 snap-start relative
                animate-fade-in
              `}
              hover
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "backwards"
              }}
            >
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentColor.replace('border-t-', 'bg-')}`} />
              
              {/* Icon */}
              <div className="flex items-start justify-between">
                <Icon className={`h-5 w-5 ${iconColor}`} />
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-fg-muted capitalize border border-border">
                  {insight.type}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-fg">{insight.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {insight.description}
                </p>
              </div>

              {/* Action */}
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between text-fg hover:text-fg hover:bg-surface-muted"
              >
                {insight.action}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
