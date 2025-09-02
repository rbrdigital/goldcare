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

// Outside order can be either external or internal referral
interface OutsideOrder {
  id: string;
  type: "external" | "internal";
  external?: ExternalReferral;
  internal?: InternalReferral;
}

type EditState = "none" | "external-editor";

export default function OutsideOrdersSection() {
  const [outsideOrders, setOutsideOrders] = React.useState<OutsideOrder[]>([]);
  const [editState, setEditState] = React.useState<EditState>("none");
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(null);
  const [externalContent, setExternalContent] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalOrderId, setModalOrderId] = React.useState<string | null>(null);

  const handleSave = () => {
    // Auto-save functionality placeholder
  };

  const addOutsideOrder = () => {
    // Show the initial selector state for new orders
    const newOrder: OutsideOrder = {
      id: crypto.randomUUID(),
      type: "external" // temporary, will be set when user selects
    };
    setOutsideOrders(prev => [...prev, newOrder]);
  };

  const removeOutsideOrder = (orderId: string) => {
    setOutsideOrders(prev => prev.filter(order => order.id !== orderId));
    if (editingOrderId === orderId) {
      setEditState("none");
      setEditingOrderId(null);
      setExternalContent("");
    }
  };

  const duplicateOutsideOrder = (orderId: string) => {
    const orderToDuplicate = outsideOrders.find(order => order.id === orderId);
    if (!orderToDuplicate) return;
    
    const duplicatedOrder: OutsideOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID(),
      external: orderToDuplicate.external ? {
        ...orderToDuplicate.external,
        id: crypto.randomUUID()
      } : undefined,
      internal: orderToDuplicate.internal ? {
        ...orderToDuplicate.internal,
        id: crypto.randomUUID()
      } : undefined
    };
    setOutsideOrders(prev => [...prev, duplicatedOrder]);
  };

  // Fix the initial selectors to create orders properly
  const handleExternalSelect = (orderId?: string) => {
    if (shouldShowInitialSelectors) {
      // Create new order
      addOutsideOrder();
      setEditState("external-editor");
      setEditingOrderId(outsideOrders[0]?.id || crypto.randomUUID());
    } else {
      // Edit existing order
      setEditState("external-editor");
      setEditingOrderId(orderId || "");
      setExternalContent("");
      
      if (orderId) {
        setOutsideOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, type: "external" } : order
        ));
      }
    }
  };

  const handleInternalSelect = (orderId?: string) => {
    if (shouldShowInitialSelectors) {
      // Create new order and open modal
      const newOrderId = crypto.randomUUID();
      const newOrder: OutsideOrder = {
        id: newOrderId,
        type: "internal"
      };
      setOutsideOrders(prev => [...prev, newOrder]);
      setModalOpen(true);
      setModalOrderId(newOrderId);
    } else {
      // Edit existing order
      setModalOpen(true);
      setModalOrderId(orderId || "");
      
      if (orderId) {
        setOutsideOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, type: "internal" } : order
        ));
      }
    }
  };

  const handleExternalSave = () => {
    if (!externalContent.trim() || !editingOrderId) return;
    
    const externalReferral: ExternalReferral = {
      id: crypto.randomUUID(),
      content: externalContent.trim()
    };

    setOutsideOrders(prev => prev.map(order => 
      order.id === editingOrderId 
        ? { ...order, external: externalReferral }
        : order
    ));

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

  const handleInternalComplete = (referral: InternalReferral) => {
    if (!modalOrderId) return;
    
    setOutsideOrders(prev => prev.map(order => 
      order.id === modalOrderId 
        ? { ...order, internal: referral }
        : order
    ));
    
    setModalOpen(false);
    setModalOrderId(null);
  };

  const handleInternalEdit = (orderId: string) => {
    setModalOpen(true);
    setModalOrderId(orderId);
  };

  const handleCancel = () => {
    setEditState("none");
    setEditingOrderId(null);
    setExternalContent("");
  };

  const insertExternalSuggestion = (text: string) => {
    setExternalContent(text); // Replace content, don't append
  };

  // Check if we should show initial selectors or existing orders
  const shouldShowInitialSelectors = outsideOrders.length === 0;
  const isEditing = editState === "external-editor";

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
                    <div className="font-medium text-fg">Suggest an External referral</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-fg-muted flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleInternalSelect()}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:bg-surface-muted transition-colors text-left"
                >
                  <div className="w-4 h-4 rounded border-2 border-border bg-bg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-fg">Suggest an Internal referral</div>
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
              {/* Don't render incomplete orders */}
              {(!order.external && !order.internal) && order.id !== editingOrderId ? null : (
                <>
                  {/* Order header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Outside order #{orderIndex + 1}</h2>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => duplicateOutsideOrder(order.id)}
                      >
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => removeOutsideOrder(order.id)}
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
                            onClick={() => removeOutsideOrder(order.id)}
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
                            onClick={() => removeOutsideOrder(order.id)}
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

          {/* Add another order - only show if we have orders and not editing */}
          {outsideOrders.length > 0 && !isEditing && (
            <div className="mt-4">
              <Button variant="outline" className="text-sm" onClick={addOutsideOrder}>
                + Add another order
              </Button>
            </div>
          )}
        </div>
      </PageContainer>

      {modalOpen && modalOrderId && (
        <InternalReferralModal
          onClose={() => {
            setModalOpen(false);
            setModalOrderId(null);
          }}
          onComplete={handleInternalComplete}
          initialReferral={outsideOrders.find(o => o.id === modalOrderId)?.internal || null}
        />
      )}
    </>
  );
}