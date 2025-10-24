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
    title: "TSH Trending Up",
    description: "Patient's TSH levels have increased from 3.8 to 4.2 over past 3 months.",
    action: "View Trend"
  },
  {
    id: "2",
    type: "alert",
    title: "Drug Interaction Risk",
    description: "Current medications may interact. Review before prescribing.",
    action: "Review Now"
  },
  {
    id: "3",
    type: "suggestion",
    title: "Consider Vitamin D",
    description: "Based on symptoms and geographic location. Last tested 8 months ago.",
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
    <div className="space-y-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
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
        className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 px-4 sm:px-6 md:px-8 lg:px-12 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {insights.map((insight, index) => {
          const { icon: Icon, iconColor, accentColor } = insightStyles[insight.type];
          
          return (
            <GlassCard
              key={insight.id}
              className="flex-shrink-0 w-80 min-w-[320px] p-6 space-y-4 snap-start relative animate-fade-in"
              hover
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "backwards"
              }}
            >
              {/* Accent bar - more visible */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${accentColor.replace('border-t-', 'bg-')}`} />
              
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
