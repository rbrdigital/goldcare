"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Scan } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";
// Remove the conflicting interface and import from store
import { useConsultStore, type ImagingOrder } from "@/store/useConsultStore";

type Diagnosis = { code: string; label: string };

// Top ~30 common ICD-10 (clinically popular; no backend)
const TOP_DIAGNOSES: Diagnosis[] = [
  { code: "J18.9", label: "Community-acquired pneumonia, unspecified organism" },
  { code: "R07.9", label: "Chest pain, unspecified" },
  { code: "R10.11", label: "Right upper quadrant pain" },
  { code: "M54.50", label: "Low back pain, unspecified" },
  { code: "S09.90XA", label: "Head injury, initial encounter" },
  { code: "I10", label: "Essential (primary) hypertension" },
  { code: "E11.9", label: "Type 2 diabetes mellitus, without complications" },
  { code: "E78.5", label: "Hyperlipidemia, unspecified" },
  { code: "E03.9", label: "Hypothyroidism, unspecified" },
  { code: "J06.9", label: "Acute upper respiratory infection, unspecified" },
  { code: "J01.90", label: "Acute sinusitis, unspecified" },
  { code: "J02.9", label: "Acute pharyngitis, unspecified" },
  { code: "H66.90", label: "Otitis media, unspecified" },
  { code: "J20.9", label: "Acute bronchitis, unspecified" },
  { code: "R10.9", label: "Abdominal pain, unspecified" },
  { code: "F41.9", label: "Anxiety disorder, unspecified" },
  { code: "F32.A", label: "Depression, unspecified" },
  { code: "K21.9", label: "GERD without esophagitis" },
  { code: "J45.909", label: "Unspecified asthma, uncomplicated" },
  { code: "J44.9", label: "COPD, unspecified" },
  { code: "N39.0", label: "Urinary tract infection, site not specified" },
  { code: "R51.9", label: "Headache, unspecified" },
  { code: "G43.909", label: "Migraine, unspecified, not intractable" },
  { code: "M25.50", label: "Pain in unspecified joint" },
  { code: "M79.10", label: "Myalgia, unspecified site" },
  { code: "D64.9", label: "Anemia, unspecified" },
  { code: "E86.0", label: "Dehydration" },
  { code: "E87.6", label: "Hypokalemia" },
  { code: "E66.9", label: "Obesity, unspecified" },
  { code: "Z23", label: "Encounter for immunization" },
];

// Exact GoldCare imaging sets from production
const IMAGING_SETS: Record<string, string[]> = {
  "Chest": [
    "Chest X-ray, PA and lateral",
    "Chest X-ray, single view",
    "Chest CT without contrast",
    "Chest CT with contrast",
  ],
  "Abdomen": [
    "Abdominal ultrasound, RUQ",
    "Abdominal ultrasound, complete", 
    "CT abdomen and pelvis with contrast",
    "CT abdomen and pelvis without contrast",
  ],
  "Head": [
    "CT head without contrast",
    "CT head with contrast",
    "MRI brain without contrast",
    "MRI brain with and without contrast",
  ],
  "Spine": [
    "Lumbar spine X-ray, 2–3 views",
    "Cervical spine X-ray",
    "Thoracic spine X-ray",
    "MRI lumbar spine without contrast",
    "MRI cervical spine without contrast",
  ],
  "Extremities": [
    "Hand X-ray",
    "Wrist X-ray",
    "Ankle X-ray", 
    "Knee X-ray",
    "Shoulder X-ray",
  ],
  "Vascular": [
    "Venous duplex ultrasound, lower extremity (DVT)",
    "Carotid duplex ultrasound",
    "Arterial duplex ultrasound, lower extremity",
  ],
  "Urological": [
    "CT KUB (non-contrast) for suspected nephrolithiasis",
    "Renal ultrasound",
    "Pelvic ultrasound",
  ],
  "Emergency": [
    "CT head without contrast",
    "Chest X-ray, PA and lateral", 
    "CT abdomen and pelvis with contrast",
    "CT cervical spine without contrast",
  ],
};

const ORDER_TABS = Object.keys(IMAGING_SETS);

export default function AddImagingOrderScreen() {  
  const { 
    imagingOrders, 
    addImagingOrder, 
    updateImagingOrder, 
    removeImagingOrder 
  } = useConsultStore();
  
  const [modal, setModal] = React.useState<{ 
    open: boolean; 
    category: string | null;
    orderIndex: number | null;
  }>({ open: false, category: null, orderIndex: null });

  // Convert TOP_DIAGNOSES to combobox format
  const diagnosisOptions = React.useMemo(
    () => TOP_DIAGNOSES.map(d => ({
      value: `${d.label} (${d.code})`,
      label: `${d.label} (${d.code})`
    })),
    []
  );

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
    const duplicatedOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID()
    };
    addImagingOrder(duplicatedOrder);
  };

  const updateImagingOrderItem = (index: number, updates: any) => {
    const orderId = imagingOrders[index].id;
    updateImagingOrder(orderId, updates);
  };

  const openSet = (category: string, orderIndex: number) => 
    setModal({ open: true, category, orderIndex });

  const confirmSet = (exams: string[]) => {
    if (modal.category === null || modal.orderIndex === null) return;
    
    const orderIndex = modal.orderIndex;
    const category = modal.category;
    const currentOrder = imagingOrders[orderIndex];
    
    // Update the otherOrders array directly with the selected exams
    const existingOtherOrders = currentOrder.otherOrders || [];
    const newOtherOrders = [...existingOtherOrders, ...exams];
    
    updateImagingOrderItem(orderIndex, { otherOrders: newOtherOrders });
    setModal({ open: false, category: null, orderIndex: null });
  };

  const editSet = (category: string, orderIndex: number) => openSet(category, orderIndex);
  
  const removeStudy = (orderIndex: number, studyToRemove: string) => {
    const currentOrder = imagingOrders[orderIndex];
    const updatedOtherOrders = currentOrder.otherOrders.filter(study => study !== studyToRemove);
    updateImagingOrderItem(orderIndex, { otherOrders: updatedOtherOrders });
  };

  return (
    <>
      <PageContainer>
        <div className="space-y-6">
        <PageHeader
          title="Imaging Orders"
          description="Create and manage imaging orders for your patients"
          icon={Scan}
          onSave={handleSave}
        />

        {/* Render each imaging order or show empty state */}
        {imagingOrders.length > 0 ? (
          <>
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
                      <Label htmlFor={`other-${orderIndex}`}>Other (free text)</Label>
                      <AutosizeTextarea
                        id={`other-${orderIndex}`}
                        minRows={2}
                        placeholder="Describe additional clinical context"
                        value={order.clinicalNotes || ""}
                        onChange={(e) => updateImagingOrderItem(orderIndex, { clinicalNotes: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                <Separator className="my-6" />

                {/* Orders */}
                <section>
                  <h2 className="text-lg font-semibold mb-3">Order</h2>

                  <div className="flex flex-wrap gap-2">
                    {ORDER_TABS.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className="rounded-full border border-border bg-surface px-3 py-1 text-sm hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        onClick={() => openSet(cat, orderIndex)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

              {/* Studies list */}
              <div className="mt-4">
                {/* Selected Orders */}
                {order.selectedOrders && order.selectedOrders.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium">Selected Studies</h4>
                    {order.selectedOrders.map((selectedOrder) => (
                      <div key={selectedOrder.orderId} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="text-sm">{selectedOrder.orderName}</span>
                        <button 
                          className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                          onClick={() => removeStudy(orderIndex, selectedOrder.orderName)}
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
                    <h4 className="text-sm font-medium">Other Studies</h4>
                    {order.otherOrders.map((study, studyIndex) => (
                      <div key={studyIndex} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="text-sm">{study}</span>
                        <button 
                          className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                          onClick={() => removeStudy(orderIndex, study)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(!order.selectedOrders || order.selectedOrders.length === 0) && 
                 (!order.otherOrders || order.otherOrders.length === 0) && (
                  <p className="text-sm text-fg-muted py-3">No imaging studies selected.</p>
                )}
              </div>
                </section>

                {/* Summary card for this order */}
                <section>
                  <div className="rounded-md border border-border bg-surface p-4">
                    <div className="font-medium mb-1">Order summary</div>
                    <div className="text-sm text-fg-muted leading-6">
                      {renderSummary(order.diagnoses, order.clinicalNotes || "", order)}
                    </div>
                  </div>
                </section>

                {/* Separator between orders */}
                {orderIndex < imagingOrders.length - 1 && <Separator className="my-6" />}
              </div>
            ))}

            {/* Add another order */}
            <div className="mt-4">
              <Button variant="outline" className="text-sm" onClick={addImagingOrderItem}>
                + Add another order
              </Button>
            </div>
          </>
        ) : (
          /* Empty state - no orders */
          <div className="text-center py-12">
            <Scan className="h-12 w-12 text-fg-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fg mb-2">No Imaging Orders</h3>
            <p className="text-fg-muted mb-4">Create your first imaging order to get started.</p>
            <Button onClick={addImagingOrderItem}>Create Imaging Order</Button>
          </div>
        )}
        </div>
      </PageContainer>

      {/* Modal: preselect ALL items for the chosen set; user can uncheck then Confirm */}
      {modal.open && modal.category && modal.orderIndex !== null ? (
        <OrderSetModal
          title={modal.category}
          options={IMAGING_SETS[modal.category]}
          selected={IMAGING_SETS[modal.category]}
          onClose={() => setModal({ open: false, category: null, orderIndex: null })}
          onConfirm={confirmSet}
        />
      ) : null}
    </>
  );
}

function renderSummary(diagnoses: string[], clinicalNotes: string, order: ImagingOrder) {
  const dxPart = diagnoses.length > 0 
    ? `Diagnoses: ${diagnoses.join("; ")}`
    : "Diagnoses: —";
  const notePart = clinicalNotes.trim() ? `; Notes: ${clinicalNotes.trim()}` : "";
  
  const selectedStudies = order.selectedOrders?.map(o => o.orderName) || [];
  const otherStudies = order.otherOrders || [];
  const allStudies = [...selectedStudies, ...otherStudies];
  
  const studiesPart = allStudies.length > 0
    ? allStudies.join(", ")
    : "No imaging studies selected";
  return `${dxPart}${notePart}; Studies: ${studiesPart}`;
}