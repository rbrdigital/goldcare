import { PageHeader } from "@/components/ui/page-header";
import { GoldCareAIIcon } from "@/components/icons/GoldCareAIIcon";

export function GoldCareAISection() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="GoldCare AI"
        description="AI-powered insights and recommendations for patient care"
        icon={GoldCareAIIcon}
      />

      {/* Empty content area - ready for future implementation */}
      <div className="bg-surface border border-border rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <GoldCareAIIcon className="w-6 h-6 text-fg-muted" />
          </div>
          <h3 className="text-lg font-semibold text-fg mb-2">Coming Soon</h3>
          <p className="text-sm text-fg-muted">
            This section is ready for GoldCare AI features and functionality.
          </p>
        </div>
      </div>
    </div>
  );
}