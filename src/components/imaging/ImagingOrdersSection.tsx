"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import ComboboxChips from "@/components/ui/ComboboxChips";
import { useConsultStore, type ImagingOrder } from "@/store/useConsultStore";
import ImagingCategorySidebar from "./ImagingCategorySidebar";
import ImagingCategoryView from "./ImagingCategoryView";
import { type ImagingOrderData } from "@/data/imagingOrders";

// Imaging icon from sidebar
const ImagingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M11.4234 6.81094H12.5765V7.96406H11.4234V6.81094ZM11.4234 9.11719H12.5765V10.2703H11.4234V9.11719ZM11.4234 13.7297V15.4594C11.4234 15.7769 11.6824 16.0359 12 16.0359C12.3175 16.0359 12.5765 15.7769 12.5765 15.4594V13.7297H11.4234ZM16.0359 5.65781H13.7297V6.81094H15.4593C16.0572 6.81094 16.5978 7.04556 17.0081 7.42029C17.1213 7.23963 17.189 7.03199 17.189 6.81094C17.189 6.17468 16.6722 5.65781 16.0359 5.65781ZM12 4.50469C11.6824 4.50469 11.4234 4.76368 11.4234 5.08125V5.65781H12.5765V5.08125C12.5765 4.76368 12.3175 4.50469 12 4.50469ZM11.4234 11.4234H12.5765V12.5766H11.4234V11.4234Z" fill="currentColor"/>
    <path d="M20.1103 2.19844L3.88966 2.16C2.93587 2.16 2.15997 2.9359 2.15997 3.88969V20.1103C2.15997 21.0641 2.93587 21.84 3.88966 21.84H20.1103C21.0641 21.84 21.84 21.0641 21.84 20.0719V3.88969C21.84 2.97434 21.0641 2.19844 20.1103 2.19844ZM17.7656 9.11719C17.7656 9.7421 17.5098 10.3201 17.0765 10.7486C17.1429 10.9634 17.189 11.1871 17.189 11.4234C17.189 12.6948 16.1541 13.7297 14.8828 13.7297C14.5641 13.7297 14.3062 13.4718 14.3062 13.1531C14.3062 12.8344 14.5641 12.5766 14.8828 12.5766C15.519 12.5766 16.0359 12.0597 16.0359 11.4234C16.0359 10.7872 15.519 10.2703 14.8828 10.2703H13.7297V14.8828H15.4593C16.4131 14.8828 17.189 15.6587 17.189 16.6125C17.189 17.4042 16.6395 18.0866 15.8524 18.2735C14.8288 18.5478 13.968 19.1606 13.3941 19.9424C13.0191 20.3996 12.518 20.6484 12 20.6484C11.4561 20.6484 10.9527 20.3838 10.6171 19.9221C9.99999 19.1147 9.11489 18.5325 8.13182 18.2926C7.33343 18.0663 6.81091 17.394 6.81091 16.6125C6.81091 15.6587 7.58681 14.8828 8.5406 14.8828H10.2703V10.2703H9.11716C8.48091 10.2703 7.96404 10.7872 7.96404 11.4234C7.96404 12.0597 8.48091 12.5766 9.11716 12.5766C9.43585 12.5766 9.69372 12.8344 9.69372 13.1531C9.69372 13.4718 9.43585 13.7297 9.11716 13.7297C7.8458 13.7297 6.81091 12.6948 6.81091 11.4234C6.81091 11.1871 6.857 10.9634 6.92346 10.7486C6.49011 10.3201 6.23435 9.7421 6.23435 9.11719C6.23435 8.88084 6.28044 8.65717 6.34689 8.4423C5.91355 8.01388 5.65779 7.43585 5.65779 6.81094C5.65779 5.53958 6.69268 4.50469 7.96404 4.50469H10.3765C10.6153 3.83499 11.2493 3.35156 12 3.35156C12.7507 3.35156 13.3846 3.83499 13.6235 4.50469H16.0359C17.3073 4.50469 18.3422 5.53958 18.3422 6.81094C18.3422 7.43585 18.0864 8.0138 17.6531 8.4423C17.7194 8.65717 17.7656 8.88084 17.7656 9.11719Z" fill="currentColor"/>
    <path d="M15.4593 7.96406H13.7297V9.11719H14.8828C15.4807 9.11719 16.0213 9.35181 16.4315 9.72654C16.5447 9.54588 16.6125 9.33824 16.6125 9.11719C16.6125 8.48093 16.0956 7.96406 15.4593 7.96406ZM15.4593 16.0359H13.6306C13.3929 16.7071 12.7522 17.1891 12 17.1891C11.2478 17.1891 10.607 16.7071 10.3694 16.0359H8.5406C8.22303 16.0359 7.96404 16.2949 7.96404 16.6125C7.96404 16.9132 8.19601 17.1136 8.42575 17.1778C9.64306 17.474 10.7568 18.2059 11.5416 19.2329C11.6182 19.3376 11.7669 19.4953 12 19.4953C12.2353 19.4953 12.4031 19.332 12.4831 19.2352C13.2001 18.2585 14.2936 17.4946 15.5708 17.1553C15.8107 17.099 16.0359 16.9109 16.0359 16.6125C16.0359 16.2949 15.7769 16.0359 15.4593 16.0359ZM7.96404 5.65781C7.32778 5.65781 6.81091 6.17468 6.81091 6.81094C6.81091 7.03195 6.87868 7.23971 6.99191 7.42029C7.40219 7.04556 7.9427 6.81094 8.5406 6.81094H10.2703V5.65781H7.96404ZM8.5406 7.96406C7.90434 7.96406 7.38747 8.48093 7.38747 9.11719C7.38747 9.3382 7.45524 9.54596 7.56848 9.72654C7.97876 9.35181 8.51927 9.11719 9.11716 9.11719H10.2703V7.96406H8.5406Z" fill="currentColor"/>
  </svg>
);

type Diagnosis = { code: string; label: string };

// Top common ICD-10 diagnoses for imaging
const TOP_DIAGNOSES: Diagnosis[] = [
  { code: "R07.9", label: "Chest pain, unspecified" },
  { code: "R10.11", label: "Right upper quadrant pain" },
  { code: "R10.9", label: "Abdominal pain, unspecified" },
  { code: "M54.50", label: "Low back pain, unspecified" },
  { code: "S09.90XA", label: "Head injury, initial encounter" },
  { code: "J18.9", label: "Community-acquired pneumonia, unspecified organism" },
  { code: "R51.9", label: "Headache, unspecified" },
  { code: "G43.909", label: "Migraine, unspecified, not intractable" },
  { code: "M25.50", label: "Pain in unspecified joint" },
  { code: "K59.00", label: "Constipation, unspecified" },
  { code: "N23", label: "Unspecified renal colic" },
  { code: "I10", label: "Essential (primary) hypertension" },
  { code: "M79.10", label: "Myalgia, unspecified site" },
  { code: "R42", label: "Dizziness and giddiness" },
  { code: "R06.02", label: "Shortness of breath" },
];

export default function ImagingOrdersSection() {  
  const { 
    imagingOrders, 
    addImagingOrder, 
    updateImagingOrder, 
    removeImagingOrder 
  } = useConsultStore();
  
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Convert TOP_DIAGNOSES to combobox format
  const diagnosisOptions = React.useMemo(
    () => TOP_DIAGNOSES.map(d => ({
      value: `${d.label} (${d.code})`,
      label: `${d.label} (${d.code})`
    })),
    []
  );

  // Initialize with one empty order if no orders exist
  React.useEffect(() => {
    if (imagingOrders.length === 0) {
      const newOrder: ImagingOrder = {
        id: crypto.randomUUID(),
        diagnoses: [],
        selectedOrders: [],
        otherOrders: [],
        urgency: "routine",
        indication: "",
        clinicalNotes: ""
      };
      addImagingOrder(newOrder);
    }
  }, [imagingOrders.length, addImagingOrder]);

  const handleSave = () => {
    // Store updates automatically via direct store calls
  };

  // Imaging order management functions
  const addImagingOrderItem = () => {
    const newOrder: ImagingOrder = {
      id: crypto.randomUUID(),
      diagnoses: [],
      selectedOrders: [],
      otherOrders: [],
      urgency: "routine",
      indication: "",
      clinicalNotes: ""
    };
    addImagingOrder(newOrder);
  };

  const removeImagingOrderItem = (index: number) => {
    const orderToRemove = imagingOrders[index];
    removeImagingOrder(orderToRemove.id);
  };

  const duplicateImagingOrderItem = (index: number) => {
    const orderToDuplicate = imagingOrders[index];
    const duplicatedOrder: ImagingOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID()
    };
    addImagingOrder(duplicatedOrder);
  };

  const updateImagingOrderItem = (index: number, updates: Partial<ImagingOrder>) => {
    const orderId = imagingOrders[index].id;
    updateImagingOrder(orderId, updates);
  };

  // Handle order selection from category view
  const handleOrderToggle = (orderId: string, order: ImagingOrderData, orderIndex: number) => {
    const currentOrder = imagingOrders[orderIndex];
    // Ensure selectedOrders exists as an array
    const existingOrders = currentOrder.selectedOrders || [];
    
    const orderExists = existingOrders.some(o => o.orderId === orderId);
    
    if (orderExists) {
      // Remove the order
      const updatedOrders = existingOrders.filter(o => o.orderId !== orderId);
      updateImagingOrderItem(orderIndex, { selectedOrders: updatedOrders });
    } else {
      // Add the order
      const newOrder = {
        orderId: order.OrderID,
        orderName: order.OrderName,
        modality: order.Modality,
        contrast: order.Contrast,
        laterality: order.Laterality
      };
      const updatedOrders = [...existingOrders, newOrder];
      updateImagingOrderItem(orderIndex, { selectedOrders: updatedOrders });
    }
  };

  const handleOtherOrderAdd = (orderText: string, orderIndex: number) => {
    const currentOrder = imagingOrders[orderIndex];
    // Ensure otherOrders exists as an array
    const existingOtherOrders = currentOrder.otherOrders || [];
    const updatedOtherOrders = [...existingOtherOrders, orderText];
    updateImagingOrderItem(orderIndex, { otherOrders: updatedOtherOrders });
  };

  const removeSelectedOrder = (orderIndex: number, orderId: string) => {
    const currentOrder = imagingOrders[orderIndex];
    const updatedOrders = (currentOrder.selectedOrders || []).filter(o => o.orderId !== orderId);
    updateImagingOrderItem(orderIndex, { selectedOrders: updatedOrders });
  };

  const removeOtherOrder = (orderIndex: number, otherOrderIndex: number) => {
    const currentOrder = imagingOrders[orderIndex];
    const updatedOtherOrders = (currentOrder.otherOrders || []).filter((_, idx) => idx !== otherOrderIndex);
    updateImagingOrderItem(orderIndex, { otherOrders: updatedOtherOrders });
  };

  // Show category view when a category is selected
  if (selectedCategory) {
    const currentOrderIndex = 0; // Always use first order for simplicity in this flow
    const currentOrder = imagingOrders[currentOrderIndex];
    const selectedOrderIds = (currentOrder.selectedOrders || []).map(o => o.orderId);

    return (
      <div className="flex h-screen">
        <ImagingCategorySidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <ImagingCategoryView
          category={selectedCategory}
          selectedOrders={selectedOrderIds}
          onOrderToggle={(orderId, order) => handleOrderToggle(orderId, order, currentOrderIndex)}
          onOtherOrderAdd={(orderText) => handleOtherOrderAdd(orderText, currentOrderIndex)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ImagingCategorySidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <PageHeader
            title="Imaging orders"
            description="Create and manage imaging orders for your patients"
            icon={ImagingIcon}
            onSave={handleSave}
          />

          {/* Always render orders - never show empty state */}
          {imagingOrders.map((order, orderIndex) => (
            <div key={order.id} className="space-y-6">
              {/* Imaging order section header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Imaging order #{orderIndex + 1}</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => duplicateImagingOrderItem(orderIndex)}
                  >
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => removeImagingOrderItem(orderIndex)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Clinical diagnosis */}
              <section>
                <h3 className="text-base font-medium mb-3">Clinical diagnosis</h3>
                <div className="space-y-4">
                  <ComboboxChips
                    id={`diagnoses-${orderIndex}`}
                    label="Common diagnoses"
                    placeholder="Search diagnoses or add custom text..."
                    options={diagnosisOptions}
                    selected={order.diagnoses}
                    onSelectionChange={(diagnoses) => updateImagingOrderItem(orderIndex, { diagnoses })}
                  />

                  <div>
                    <Label htmlFor={`indication-${orderIndex}`}>Indication/Reason</Label>
                    <AutosizeTextarea
                      id={`indication-${orderIndex}`}
                      minRows={2}
                      placeholder="Enter indication or reason for imaging..."
                      value={order.indication || ""}
                      onChange={(e) => updateImagingOrderItem(orderIndex, { indication: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`notes-${orderIndex}`}>Clinical Notes</Label>
                    <AutosizeTextarea
                      id={`notes-${orderIndex}`}
                      minRows={2}
                      placeholder="Additional clinical context..."
                      value={order.clinicalNotes || ""}
                      onChange={(e) => updateImagingOrderItem(orderIndex, { clinicalNotes: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              {/* Selected Orders */}
              <section>
                <h3 className="text-base font-medium mb-3">Selected Studies</h3>
                <div className="space-y-4">
                  {/* Standard Orders */}
                  {order.selectedOrders && order.selectedOrders.length > 0 && (
                    <div className="space-y-2">
                      {(order.selectedOrders || []).map((selectedOrder) => (
                        <div key={selectedOrder.orderId} className="flex items-center justify-between p-3 border border-border rounded-md bg-surface">
                          <div>
                            <div className="text-sm font-medium">{selectedOrder.orderName}</div>
                            <div className="text-xs text-fg-muted">
                              {selectedOrder.modality}
                              {selectedOrder.contrast && selectedOrder.contrast !== 'N/A' && ` • ${selectedOrder.contrast}`}
                              {selectedOrder.laterality && ` • ${selectedOrder.laterality}`}
                            </div>
                          </div>
                          <button 
                            className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                            onClick={() => removeSelectedOrder(orderIndex, selectedOrder.orderId)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Other Orders */}
                  {order.otherOrders && order.otherOrders.length > 0 && (
                    <div className="space-y-2">
                      {(order.otherOrders || []).map((otherOrder, otherIndex) => (
                        <div key={otherIndex} className="flex items-center justify-between p-3 border border-border rounded-md bg-surface">
                          <div className="text-sm">{otherOrder}</div>
                          <button 
                            className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                            onClick={() => removeOtherOrder(orderIndex, otherIndex)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!order.selectedOrders || order.selectedOrders.length === 0) && 
                   (!order.otherOrders || order.otherOrders.length === 0) && (
                    <p className="text-sm text-fg-muted py-3">No imaging studies selected. Choose a category to add studies.</p>
                  )}
                </div>
              </section>

              {/* Summary card for this order */}
              <section>
                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="font-medium mb-1">Order summary</div>
                  <div className="text-sm text-fg-muted leading-6">
                    {renderSummary(order)}
                  </div>
                </div>
              </section>
            </div>
          ))}

          {/* Add another order */}
          <div className="mt-4">
            <Button variant="outline" className="text-sm" onClick={addImagingOrderItem}>
              + Add another order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderSummary(order: ImagingOrder) {
  const dxPart = order.diagnoses.length > 0 
    ? `Diagnoses: ${order.diagnoses.join("; ")}`
    : "Diagnoses: —";
  
  const indicationPart = order.indication?.trim() ? `; Indication: ${order.indication.trim()}` : "";
  const notePart = order.clinicalNotes?.trim() ? `; Notes: ${order.clinicalNotes.trim()}` : "";
  
  const selectedStudies = order.selectedOrders?.map(o => o.orderName) || [];
  const otherStudies = order.otherOrders || [];
  const allStudies = [...selectedStudies, ...otherStudies];
  
  const studiesPart = allStudies.length > 0
    ? allStudies.join(", ")
    : "No imaging studies selected";
    
  return `${dxPart}${indicationPart}${notePart}; Studies: ${studiesPart}`;
}