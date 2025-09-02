"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Activity } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";

type Diagnosis = { code: string; label: string };
type Request = { id: string; category: string; exams: string[] };

// Imaging order type
interface ImagingOrder {
  id: string;
  diagnoses: string[];
  otherDx: string;
  requests: Request[];
}

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

// Imaging sets organized by category
const IMAGING_SETS: Record<string, string[]> = {
  "Chest": [
    "Chest X-ray, PA and lateral",
    "Chest X-ray, single view",
    "Chest CT without contrast",
    "Chest CT with contrast",
    "Chest CT angiography",
  ],
  "Abdomen": [
    "Abdominal ultrasound, RUQ",
    "Abdominal ultrasound, complete",
    "CT abdomen/pelvis without contrast",
    "CT abdomen/pelvis with contrast",
    "Abdominal X-ray (KUB)",
  ],
  "Head": [
    "CT head without contrast",
    "CT head with contrast",
    "MRI brain without contrast",
    "MRI brain with contrast",
  ],
  "Spine": [
    "Lumbar spine X-ray, 2–3 views",
    "Cervical spine X-ray",
    "Thoracic spine X-ray",
    "MRI lumbar spine",
    "MRI cervical spine",
  ],
  "Extremities": [
    "X-ray hand/wrist",
    "X-ray foot/ankle",
    "X-ray knee",
    "X-ray shoulder",
    "MRI knee",
    "MRI shoulder",
  ],
  "Vascular": [
    "Venous duplex ultrasound, lower extremity (DVT)",
    "Carotid duplex ultrasound",
    "Arterial duplex ultrasound, lower extremity",
    "Echocardiogram",
  ],
  "Urological": [
    "CT KUB (non-contrast) for suspected nephrolithiasis",
    "Renal ultrasound",
    "Bladder ultrasound with post-void residual",
  ],
  "Emergency": [
    "CT head without contrast (trauma)",
    "CT cervical spine",
    "FAST exam (focused assessment with sonography for trauma)",
    "Chest X-ray (trauma)",
  ],
};

const ORDER_TABS = Object.keys(IMAGING_SETS);

export default function ImagingOrdersSection() {  
  // Multi-order state management like RX form
  const [imagingOrders, setImagingOrders] = React.useState<ImagingOrder[]>([
    {
      id: crypto.randomUUID(),
      diagnoses: [],
      otherDx: "",
      requests: []
    }
  ]);
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
    // Auto-save functionality placeholder
  };

  // Imaging order management functions
  const addImagingOrder = () => {
    const newOrder: ImagingOrder = {
      id: crypto.randomUUID(),
      diagnoses: [],
      otherDx: "",
      requests: []
    };
    setImagingOrders(prev => [...prev, newOrder]);
  };

  const removeImagingOrder = (index: number) => {
    if (imagingOrders.length <= 1) return; // Keep at least one order
    setImagingOrders(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateImagingOrder = (index: number) => {
    const orderToDuplicate = imagingOrders[index];
    const duplicatedOrder: ImagingOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID()
    };
    setImagingOrders(prev => [...prev, duplicatedOrder]);
  };

  const updateImagingOrder = (index: number, updates: Partial<ImagingOrder>) => {
    setImagingOrders(prev => prev.map((order, i) => 
      i === index ? { ...order, ...updates } : order
    ));
  };

  const openSet = (category: string, orderIndex: number) => 
    setModal({ open: true, category, orderIndex });

  const confirmSet = (exams: string[]) => {
    if (modal.category === null || modal.orderIndex === null) return;
    
    const orderIndex = modal.orderIndex;
    const category = modal.category;
    
    updateImagingOrder(orderIndex, {
      requests: imagingOrders[orderIndex].requests.map(r => 
        r.category === category ? { ...r, exams } : r
      ).concat(
        imagingOrders[orderIndex].requests.find(r => r.category === category) 
          ? [] 
          : [{ id: `${category}-${Date.now()}`, category, exams }]
      ).filter(r => r.category !== category || exams.length > 0)
    });
    
    setModal({ open: false, category: null, orderIndex: null });
  };

  const editSet = (category: string, orderIndex: number) => openSet(category, orderIndex);
  
  const removeSet = (category: string, orderIndex: number) => {
    updateImagingOrder(orderIndex, {
      requests: imagingOrders[orderIndex].requests.filter(r => r.category !== category)
    });
  };

  return (
    <>
      <PageContainer>
        <div className="space-y-6">
        <PageHeader
          title="Imaging orders"
          description="Create and manage imaging orders for your patients"
          icon={Activity}
          onSave={handleSave}
        />

        {/* Render each imaging order */}
        {imagingOrders.map((order, orderIndex) => (
          <div key={order.id} className="space-y-6">
            {/* Imaging order section header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Imaging order #{orderIndex + 1}</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => duplicateImagingOrder(orderIndex)}
                >
                  Duplicate
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => removeImagingOrder(orderIndex)}
                  disabled={imagingOrders.length <= 1}
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
                  onSelectionChange={(diagnoses) => updateImagingOrder(orderIndex, { diagnoses })}
                />

                <div>
                  <Label htmlFor={`other-${orderIndex}`}>Other (free text)</Label>
                  <AutosizeTextarea
                    id={`other-${orderIndex}`}
                    minRows={2}
                    placeholder="Describe additional clinical context"
                    value={order.otherDx}
                    onChange={(e) => updateImagingOrder(orderIndex, { otherDx: e.target.value })}
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

              {/* Requests list */}
              <div className="mt-4 divide-y divide-divider">
                {order.requests.map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium">{r.category}</div>
                      <div className="text-sm text-fg-muted truncate">{r.exams.join(" • ")}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                        onClick={() => editSet(r.category, orderIndex)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-sm text-fg-muted hover:underline focus-visible:outline-none" 
                        onClick={() => removeSet(r.category, orderIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {order.requests.length === 0 && (
                  <p className="text-sm text-fg-muted py-3">No imaging orders selected.</p>
                )}
              </div>
            </section>

            {/* Summary card for this order */}
            <section>
              <div className="rounded-md border border-border bg-surface p-4">
                <div className="font-medium mb-1">Order summary</div>
                <div className="text-sm text-fg-muted leading-6">
                  {renderSummary(order.diagnoses, order.otherDx, order.requests)}
                </div>
              </div>
            </section>

            {/* Separator between orders */}
            {orderIndex < imagingOrders.length - 1 && <Separator className="my-6" />}
          </div>
        ))}

        {/* Add another order */}
        <div className="mt-4">
          <Button variant="outline" className="text-sm" onClick={addImagingOrder}>
            + Add another order
          </Button>
        </div>
        </div>
      </PageContainer>

      {/* Modal: preselect ALL items for the chosen set; user can uncheck then Confirm */}
      {modal.open && modal.category && modal.orderIndex !== null ? (
        <OrderSetModal
          title={modal.category}
          options={IMAGING_SETS[modal.category]}
          selected={
            imagingOrders[modal.orderIndex].requests.find((r) => r.category === modal.category)?.exams ??
            IMAGING_SETS[modal.category]
          }
          onClose={() => setModal({ open: false, category: null, orderIndex: null })}
          onConfirm={confirmSet}
        />
      ) : null}
    </>
  );
}

function renderSummary(diagnoses: string[], other: string, reqs: Request[]) {
  const dxPart = diagnoses.length > 0 
    ? `Diagnoses: ${diagnoses.join("; ")}`
    : "Diagnoses: —";
  const otherPart = other.trim() ? `; Notes: ${other.trim()}` : "";
  const orders = reqs.length > 0
    ? reqs.map((r) => `${r.category}: ${r.exams.join(", ")}`).join("; ")
    : "No imaging orders selected";
  return `${dxPart}${otherPart}; Orders: ${orders}`;
}