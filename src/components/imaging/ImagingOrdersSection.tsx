"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import PageContainer from "@/components/layout/PageContainer";
import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";
import { useConsultStore, type ImagingOrder } from "@/store/useConsultStore";

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

  // Initialize with one empty order if no orders exist
  React.useEffect(() => {
    if (imagingOrders.length === 0) {
      const newOrder: ImagingOrder = {
        id: crypto.randomUUID(),
        diagnoses: [],
        studies: [],
        urgency: "routine",
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
      studies: [],
      urgency: "routine",
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

  const openSet = (category: string, orderIndex: number) => 
    setModal({ open: true, category, orderIndex });

  const confirmSet = (exams: string[]) => {
    if (modal.category === null || modal.orderIndex === null) return;
    
    const orderIndex = modal.orderIndex;
    const currentOrder = imagingOrders[orderIndex];
    
    // Update the studies array directly with the selected exams
    const existingStudies = currentOrder.studies || [];
    const newStudies = [...existingStudies, ...exams];
    
    updateImagingOrderItem(orderIndex, { studies: newStudies });
    setModal({ open: false, category: null, orderIndex: null });
  };

  const editSet = (category: string, orderIndex: number) => openSet(category, orderIndex);
  
  const removeStudy = (orderIndex: number, studyToRemove: string) => {
    const currentOrder = imagingOrders[orderIndex];
    const updatedStudies = currentOrder.studies.filter(study => study !== studyToRemove);
    updateImagingOrderItem(orderIndex, { studies: updatedStudies });
  };

  return (
    <>
      <PageContainer>
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
                {order.studies && order.studies.length > 0 ? (
                  <div className="space-y-2">
                    {order.studies.map((study, studyIndex) => (
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
                ) : (
                  <p className="text-sm text-fg-muted py-3">No imaging studies selected.</p>
                )}
              </div>
            </section>

            {/* Summary card for this order */}
            <section>
              <div className="rounded-md border border-border bg-surface p-4">
                <div className="font-medium mb-1">Order summary</div>
                <div className="text-sm text-fg-muted leading-6">
                  {renderSummary(order.diagnoses, order.clinicalNotes || "", order.studies || [])}
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

function renderSummary(diagnoses: string[], clinicalNotes: string, studies: string[]) {
  const dxPart = diagnoses.length > 0 
    ? `Diagnoses: ${diagnoses.join("; ")}`
    : "Diagnoses: —";
  const notePart = clinicalNotes.trim() ? `; Notes: ${clinicalNotes.trim()}` : "";
  const studiesPart = studies.length > 0
    ? studies.join(", ")
    : "No imaging studies selected";
  return `${dxPart}${notePart}; Studies: ${studiesPart}`;
}