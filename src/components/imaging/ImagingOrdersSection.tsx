"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";

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

export default function ImagingOrdersSection() {
  const [imagingOrders, setImagingOrders] = React.useState<ImagingOrder[]>([
    { id: "1", diagnoses: [], otherDx: "", requests: [] }
  ]);
  
  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedSet, setSelectedSet] = React.useState<string>("");
  const [currentOrderIndex, setCurrentOrderIndex] = React.useState<number>(0);
  const [currentRequestIndex, setCurrentRequestIndex] = React.useState<number>(-1);

  // Memoized diagnosis options for ComboboxChips
  const diagnosisOptions = React.useMemo(() => 
    TOP_DIAGNOSES.map(d => ({ 
      value: `${d.code} ${d.label}`, 
      label: `${d.code} ${d.label}` 
    })),
    []
  );

  const addImagingOrder = () => {
    const newOrder: ImagingOrder = {
      id: Date.now().toString(),
      diagnoses: [],
      otherDx: "",
      requests: []
    };
    setImagingOrders(prev => [...prev, newOrder]);
  };

  const removeImagingOrder = (index: number) => {
    if (imagingOrders.length > 1) {
      setImagingOrders(prev => prev.filter((_, i) => i !== index));
    }
  };

  const duplicateImagingOrder = (index: number) => {
    const orderToDuplicate = imagingOrders[index];
    const duplicatedOrder: ImagingOrder = {
      ...orderToDuplicate,
      id: Date.now().toString()
    };
    setImagingOrders(prev => [...prev, duplicatedOrder]);
  };

  const updateImagingOrder = (index: number, updatedOrder: Partial<ImagingOrder>) => {
    setImagingOrders(prev => prev.map((order, i) => 
      i === index ? { ...order, ...updatedOrder } : order
    ));
  };

  const openSet = (setName: string, orderIndex: number) => {
    setSelectedSet(setName);
    setCurrentOrderIndex(orderIndex);
    setCurrentRequestIndex(-1);
    setModalOpen(true);
  };

  const confirmSet = (selectedExams: string[]) => {
    const newRequest: Request = {
      id: Date.now().toString(),
      category: selectedSet,
      exams: selectedExams
    };
    
    const updatedOrder = { ...imagingOrders[currentOrderIndex] };
    updatedOrder.requests = [...updatedOrder.requests, newRequest];
    
    updateImagingOrder(currentOrderIndex, updatedOrder);
    setModalOpen(false);
  };

  const editSet = (orderIndex: number, requestIndex: number) => {
    const request = imagingOrders[orderIndex].requests[requestIndex];
    setSelectedSet(request.category);
    setCurrentOrderIndex(orderIndex);
    setCurrentRequestIndex(requestIndex);
    setModalOpen(true);
  };

  const removeSet = (orderIndex: number, requestIndex: number) => {
    const updatedOrder = { ...imagingOrders[orderIndex] };
    updatedOrder.requests = updatedOrder.requests.filter((_, i) => i !== requestIndex);
    updateImagingOrder(orderIndex, updatedOrder);
  };

  const handleSave = () => {
    console.log("Saving imaging orders:", imagingOrders);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Imaging Orders"
        description="Create and manage imaging orders for your patients"
        icon={Activity}
        onSave={handleSave}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => duplicateImagingOrder(0)}>
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            onClick={() => removeImagingOrder(0)}
            disabled={imagingOrders.length === 1}
          >
            Remove
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-8">
        {modalOpen && (
          <OrderSetModal
            title={selectedSet}
            options={IMAGING_SETS[selectedSet] || []}
            selected={
              currentRequestIndex >= 0 && currentOrderIndex >= 0
                ? imagingOrders[currentOrderIndex].requests[currentRequestIndex]?.exams || []
                : []
            }
            onClose={() => setModalOpen(false)}
            onConfirm={confirmSet}
          />
        )}

        {imagingOrders.map((order, orderIndex) => (
          <div key={order.id} className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-fg">
                Imaging order #{orderIndex + 1}
              </h3>
              {orderIndex > 0 && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => duplicateImagingOrder(orderIndex)}
                  >
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeImagingOrder(orderIndex)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Clinical Diagnosis */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-2">
                  Clinical diagnosis
                </Label>
                <div className="space-y-2">
                  <Label className="text-xs text-fg-muted">
                    Common diagnoses
                  </Label>
                  <ComboboxChips
                    placeholder="Search diagnoses or add custom text..."
                    options={diagnosisOptions}
                    selected={order.diagnoses}
                    onSelectionChange={(values) => updateImagingOrder(orderIndex, { diagnoses: values })}
                  />
                  <Label className="text-xs text-fg-muted">
                    Other (free text)
                  </Label>
                  <AutosizeTextarea
                    value={order.otherDx}
                    onChange={(e) => updateImagingOrder(orderIndex, { otherDx: e.target.value })}
                    placeholder="Describe additional clinical context"
                    minRows={2}
                    maxRows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <AIChipClosedSmart
                text="R10.11 Right upper quadrant pain • J18.9 Community-acquired pneumonia • M54.50 Low back pain"
                onInsert={() => {
                  const suggestions = ["R10.11 Right upper quadrant pain", "J18.9 Community-acquired pneumonia", "M54.50 Low back pain"];
                  updateImagingOrder(orderIndex, { 
                    diagnoses: [...order.diagnoses, ...suggestions.filter(s => !order.diagnoses.includes(s))]
                  });
                }}
              />
            </div>

            <Separator />

            {/* Order Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-fg">
                Order
              </Label>
              
              <div className="flex flex-wrap gap-2">
                {Object.keys(IMAGING_SETS).map((setName) => (
                  <Button
                    key={setName}
                    variant="secondary"
                    size="sm"
                    onClick={() => openSet(setName, orderIndex)}
                  >
                    {setName}
                  </Button>
                ))}
              </div>

              {/* Selected Sets */}
              {order.requests.map((request, requestIndex) => (
                <div key={request.id} className="border border-border rounded-lg p-4 bg-surface">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-fg mb-1">
                        {request.category}
                      </h4>
                      <p className="text-sm text-fg-muted mb-2">
                        {request.exams.join(" • ")}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <button 
                          className="text-primary underline hover:no-underline"
                          onClick={() => editSet(orderIndex, requestIndex)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-primary underline hover:no-underline"
                          onClick={() => removeSet(orderIndex, requestIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <AIChipClosedSmart
                text="Chest X-ray, PA and lateral • Abdominal ultrasound, RUQ • CT head without contrast"
                onInsert={() => {
                  const suggestions = [
                    { category: "Chest", exams: ["Chest X-ray, PA and lateral"] },
                    { category: "Abdomen", exams: ["Abdominal ultrasound, RUQ"] },
                    { category: "Head", exams: ["CT head without contrast"] }
                  ];
                  const newRequests = suggestions.map(s => ({
                    id: Date.now().toString() + Math.random(),
                    category: s.category,
                    exams: s.exams
                  }));
                  updateImagingOrder(orderIndex, { 
                    requests: [...order.requests, ...newRequests]
                  });
                }}
              />
            </div>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-fg-muted">
                {renderSummary(order)}
              </CardContent>
            </Card>
          </div>
        ))}

        <Button variant="secondary" onClick={addImagingOrder}>
          + Add another order
        </Button>
      </div>
    </div>
  );
}

// Helper function to render order summary
function renderSummary(order: ImagingOrder): string {
  const parts: string[] = [];
  
  if (order.diagnoses.length > 0 || order.otherDx) {
    const diagnosesText = [
      ...order.diagnoses,
      ...(order.otherDx ? [order.otherDx] : [])
    ].join("; ");
    parts.push(`Diagnoses: ${diagnosesText}`);
  }
  
  if (order.requests.length > 0) {
    const requestsText = order.requests
      .map(req => `${req.category}: ${req.exams.join(", ")}`)
      .join("; ");
    parts.push(`Orders: ${requestsText}`);
  }
  
  return parts.length > 0 ? parts.join("; ") : "No content yet";
}