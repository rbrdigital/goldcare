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
import { useConsultStore, OutsideOrder } from "@/store/useConsultStore";
import { toast } from "@/hooks/use-toast";

type EditState = "none" | "external-editor";

export default function OutsideOrdersSection() {
  const { 
    outsideOrders, 
    addOutsideOrder, 
    updateOutsideOrder, 
    removeOutsideOrder 
  } = useConsultStore();
  
  const [editState, setEditState] = React.useState<EditState>("none");
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(null);
  const [externalContent, setExternalContent] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalOrderId, setModalOrderId] = React.useState<string | null>(null);

  const handleSave = () => {
    // Store updates automatically via direct store calls
  };

  const addOutsideOrderItem = () => {
    const newOrder = {
      id: crypto.randomUUID(),
      type: "external" as const,
      external: { content: "" },
      internal: undefined
    };
    addOutsideOrder(newOrder);
  };

  const removeOutsideOrderItem = (orderId: string) => {
    removeOutsideOrder(orderId);
    if (editingOrderId === orderId) {
      setEditState("none");
      setEditingOrderId(null);
      setExternalContent("");
    }
  };

  const duplicateOutsideOrderItem = (orderId: string) => {
    const orderToDuplicate = outsideOrders.find(order => order.id === orderId);
    if (!orderToDuplicate) return;
    
    const duplicatedOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID()
    };
    addOutsideOrder(duplicatedOrder);
  };

  const handleExternalSelect = (orderId?: string) => {
    if (orderId) {
      // Edit existing order or configure incomplete order
      setEditState("external-editor");
      setEditingOrderId(orderId);
      
      // Update order type and get existing content if editing
      const order = outsideOrders.find(o => o.id === orderId);
      setExternalContent(order?.external?.content || "");
      
      updateOutsideOrder(orderId, { type: "external" as const });
    } else {
      // Initial state - create new order first
      const newOrderId = crypto.randomUUID();
      const newOrder = {
        id: newOrderId,
        type: "external" as const,
        external: { content: "" },
        internal: undefined
      };
      addOutsideOrder(newOrder);
      setEditState("external-editor");
      setEditingOrderId(newOrderId);
      setExternalContent("");
    }
  };

  const handleInternalSelect = (orderId?: string) => {
    if (orderId) {
      // Edit existing order or configure incomplete order
      setModalOpen(true);
      setModalOrderId(orderId);
      
      updateOutsideOrder(orderId, { type: "internal" as const });
    } else {
      // Initial state - create new order first
      const newOrderId = crypto.randomUUID();
      const newOrder = {
        id: newOrderId,
        type: "internal" as const,
        external: undefined,
        internal: { id: crypto.randomUUID(), type: "specialty" as const }
      };
      addOutsideOrder(newOrder);
      setModalOpen(true);
      setModalOrderId(newOrderId);
    }
  };

  const handleExternalSave = () => {
    if (!externalContent.trim() || !editingOrderId) return;
    
    const externalReferral = {
      content: externalContent.trim()
    };

    updateOutsideOrder(editingOrderId, { external: externalReferral });

    setEditState("none");
    setEditingOrderId(null);
    setExternalContent("");
  };

  const handleExternalEdit = (orderId: string) => {
    const order = outsideOrders.find(o => o.id === orderId);
    if (order?.external) {
      setExternalContent(order.external.content);
      setEditState("external-editor");
      setEditingOrderId(orderId);
    }
  };

  const handleInternalComplete = (referral: any) => {
    if (!modalOrderId) return;
    
    // The modal returns a referral without id, so we add it
    const completeReferral = {
      id: crypto.randomUUID(),
      ...referral
    };
    
    updateOutsideOrder(modalOrderId, { internal: completeReferral });
    
    setModalOpen(false);
    setModalOrderId(null);
  };

  const handleInternalEdit = (orderId: string) => {
    setModalOpen(true);
    setModalOrderId(orderId);
  };

  const handleCancel = () => {
    // If we're editing an incomplete order, remove it
    if (editingOrderId) {
      const order = outsideOrders.find(o => o.id === editingOrderId);
      if (order && !order.external && !order.internal) {
        removeOutsideOrderItem(editingOrderId);
      }
    }
    
    setEditState("none");
    setEditingOrderId(null);
    setExternalContent("");
  };

  const insertExternalSuggestion = (text: string) => {
    setExternalContent(text); // Replace content, don't append
  };

  // Check if we should show initial selectors - when no orders exist at all
  const shouldShowInitialSelectors = outsideOrders.length === 0;
  const isEditing = editState === "external-editor";
  
  // Helper function to check if an order needs configuration
  const orderNeedsConfiguration = (order: OutsideOrder) => {
    return !order.external && !order.internal;
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

          {shouldShowInitialSelectors && !isEditing && (
            <>
              {/* Initial state - two selectable cards */}
              <div className="space-y-3">
                <button
                  onClick={() => handleExternalSelect()}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                >
                  <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-fg">External referral</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleInternalSelect()}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                >
                  <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-fg">Internal referral</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                </button>
              </div>
            </>
          )}

          {isEditing && (
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

              {/* Bottom actions for editor */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleExternalSave} disabled={!externalContent.trim()}>Save</Button>
              </div>
            </>
          )}

          {/* Render existing orders */}
          {outsideOrders.map((order, orderIndex) => (
            <div key={order.id} className="space-y-6">
              {/* Show selectors for orders that need configuration */}
              {orderNeedsConfiguration(order) && order.id !== editingOrderId && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-fg mb-2">Outside order #{orderIndex + 1}</div>
                  <button
                    onClick={() => handleExternalSelect(order.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                  >
                    <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-fg">External referral</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                  </button>

                  <button
                    onClick={() => handleInternalSelect(order.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                  >
                    <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-fg">Internal referral</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                  </button>
                </div>
              )}

              {/* Show configured orders */}
              {(order.external || order.internal) && (
                <>
                  {/* Order header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Outside order #{orderIndex + 1}</h2>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => duplicateOutsideOrderItem(order.id)}
                      >
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => removeOutsideOrderItem(order.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Order content */}
                  {order.external && (
                    <div className="rounded-md border border-border bg-surface p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium mb-1">External Referral</div>
                          <div className="text-sm text-fg-muted leading-6">
                            {order.external.content || "No content yet"}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <button 
                            className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                            onClick={() => handleExternalEdit(order.id)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                            onClick={() => removeOutsideOrderItem(order.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.internal && (
                    <div className="rounded-md border border-border bg-surface p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium mb-1">Internal Referral</div>
                          {order.internal.type === "specialty" && order.internal.specialty && (
                            <div className="text-sm text-fg-muted leading-6">
                              Specialty: {order.internal.specialty}
                            </div>
                          )}
                          {order.internal.type === "provider" && order.internal.providers && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              {order.internal.providers.map((provider) => (
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
                            onClick={() => handleInternalEdit(order.id)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                            onClick={() => removeOutsideOrderItem(order.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Separator between orders */}
                  {orderIndex < outsideOrders.length - 1 && <Separator className="my-6" />}
                </>
              )}
            </div>
          ))}

          {/* Add another order - show if we have any configured orders and not editing */}
          {outsideOrders.some(order => order.external || order.internal) && !isEditing && (
            <div className="mt-4">
              <Button variant="outline" className="text-sm" onClick={addOutsideOrderItem}>
                + Add another order
              </Button>
            </div>
          )}
        </div>
      </PageContainer>

      {modalOpen && modalOrderId && (
        <InternalReferralModal
          onClose={() => {
            // If we're closing an incomplete order, remove it
            if (modalOrderId) {
              const order = outsideOrders.find(o => o.id === modalOrderId);
              if (order && !order.external && !order.internal) {
                removeOutsideOrderItem(modalOrderId);
              }
            }
            setModalOpen(false);
            setModalOrderId(null);
          }}
          onComplete={handleInternalComplete}
          initialReferral={outsideOrders.find(o => o.id === modalOrderId)?.internal as any || null}
        />
      )}
    </>
  );
}