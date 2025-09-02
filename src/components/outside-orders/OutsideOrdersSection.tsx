"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Upload } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import { InternalReferralModal } from "./InternalReferralModal";
import { cn } from "@/lib/utils";

interface ExternalReferral {
  id: string;
  content: string;
}

interface InternalReferral {
  id: string;
  type: "specialty" | "provider";
  specialty?: string;
  providers?: Array<{
    id: string;
    name: string;
    degree: string;
    availability: string;
    tokens: string;
  }>;
}

type OrderState = "initial" | "external-editor" | "summary";

export default function OutsideOrdersSection() {
  const [orderState, setOrderState] = React.useState<OrderState>("initial");
  const [externalReferral, setExternalReferral] = React.useState<ExternalReferral | null>(null);
  const [internalReferral, setInternalReferral] = React.useState<InternalReferral | null>(null);
  const [externalContent, setExternalContent] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleSave = () => {
    // Auto-save functionality placeholder
  };

  const handleExternalSelect = () => {
    setOrderState("external-editor");
  };

  const handleInternalSelect = () => {
    setModalOpen(true);
  };

  const handleExternalSave = () => {
    if (!externalContent.trim()) return;
    
    setExternalReferral({
      id: crypto.randomUUID(),
      content: externalContent.trim()
    });
    setOrderState("summary");
  };

  const handleExternalEdit = () => {
    setExternalContent(externalReferral?.content || "");
    setOrderState("external-editor");
  };

  const handleExternalRemove = () => {
    setExternalReferral(null);
    setExternalContent("");
    setOrderState("initial");
  };

  const handleInternalComplete = (referral: InternalReferral) => {
    setInternalReferral(referral);
    setModalOpen(false);
    if (!externalReferral) {
      setOrderState("summary");
    }
  };

  const handleInternalEdit = () => {
    setModalOpen(true);
  };

  const handleInternalRemove = () => {
    setInternalReferral(null);
    if (!externalReferral) {
      setOrderState("initial");
    }
  };

  const handleCancel = () => {
    if (orderState === "external-editor") {
      if (externalReferral) {
        setOrderState("summary");
      } else {
        setOrderState("initial");
        setExternalContent("");
      }
    }
  };

  const insertExternalSuggestion = (text: string) => {
    setExternalContent(prev => prev ? `${prev}\n\n${text}` : text);
  };

  return (
    <>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Outside Orders"
            description="Create and manage referrals and recommendations outside GoldCare services."
            icon={Upload}
            onSave={handleSave}
          />

          {orderState === "initial" && (
            <>
              {/* Initial state - two selectable cards */}
              <div className="space-y-3">
                <button
                  onClick={handleExternalSelect}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                >
                  <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-fg">Suggest an External referral</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                </button>

                <button
                  onClick={handleInternalSelect}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                >
                  <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-fg">Suggest an Internal referral</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                </button>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </div>
            </>
          )}

          {orderState === "external-editor" && (
            <>
              {/* External referral editor */}
              <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
                <div>
                  <Label htmlFor="external-referral" className="text-sm font-medium text-fg mb-2">
                    Please detail your referral
                  </Label>
                  <AutosizeTextarea
                    id="external-referral"
                    minRows={3}
                    placeholder="Describe the external referral recommendation..."
                    value={externalContent}
                    onChange={(e) => setExternalContent(e.target.value)}
                  />
                  <AIChipClosedSmart
                    text="Refer to physical therapy for mobility training"
                    onInsert={() => insertExternalSuggestion("Refer to physical therapy for mobility training")}
                    onGenerateInsert={(text) => insertExternalSuggestion(text)}
                    useCustomizable={true}
                  />
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleExternalSave} disabled={!externalContent.trim()}>Save</Button>
              </div>
            </>
          )}

          {orderState === "summary" && (
            <>
              {/* Summary cards */}
              <div className="space-y-4">
                {externalReferral && (
                  <div className="rounded-md border border-border bg-surface p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">External Referral</div>
                        <div className="text-sm text-fg-muted leading-6">
                          {externalReferral.content || "No content yet"}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <button 
                          className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                          onClick={handleExternalEdit}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                          onClick={handleExternalRemove}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {internalReferral && (
                  <div className="rounded-md border border-border bg-surface p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">Internal Referral</div>
                        {internalReferral.type === "specialty" && internalReferral.specialty && (
                          <div className="text-sm text-fg-muted leading-6">
                            Specialty: {internalReferral.specialty}
                          </div>
                        )}
                        {internalReferral.type === "provider" && internalReferral.providers && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {internalReferral.providers.map((provider) => (
                              <div key={provider.id} className="rounded-md border border-border bg-bg p-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-surface-muted flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">{provider.name}, {provider.degree}</div>
                                    <div className="text-xs text-fg-muted mt-1">
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-surface-muted">
                                        {provider.availability}
                                      </span>
                                    </div>
                                    <div className="text-xs text-fg-muted mt-1 flex items-center gap-1">
                                      <div className="w-1 h-1 rounded-full bg-fg-muted" />
                                      <span>{provider.tokens}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <button 
                          className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                          onClick={handleInternalEdit}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                          onClick={handleInternalRemove}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </div>
            </>
          )}
        </div>
      </PageContainer>

      {modalOpen && (
        <InternalReferralModal
          onClose={() => setModalOpen(false)}
          onComplete={handleInternalComplete}
          initialReferral={internalReferral}
        />
      )}
    </>
  );
}