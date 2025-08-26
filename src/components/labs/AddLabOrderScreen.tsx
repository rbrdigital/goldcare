"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { FlaskConical } from "lucide-react";

import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";

type Diagnosis = { code: string; label: string };
type Request = { id: string; category: string; exams: string[] };

// Lab order type with requests as arrays
interface LabOrder {
  id: string;
  diagnoses: string[];
  otherDx: string;
  requests: { id: string; category: string; exams: string }[];
}

// Top ~30 common ICD-10 (clinically popular; no backend)
const TOP_DIAGNOSES: Diagnosis[] = [
  { code: "I10", label: "Essential (primary) hypertension" },
  { code: "E11.9", label: "Type 2 diabetes mellitus, without complications" },
  { code: "E78.5", label: "Hyperlipidemia, unspecified" },
  { code: "E03.9", label: "Hypothyroidism, unspecified" },
  { code: "J06.9", label: "Acute upper respiratory infection, unspecified" },
  { code: "J01.90", label: "Acute sinusitis, unspecified" },
  { code: "J02.9", label: "Acute pharyngitis, unspecified" },
  { code: "H66.90", label: "Otitis media, unspecified" },
  { code: "J20.9", label: "Acute bronchitis, unspecified" },
  { code: "R07.9", label: "Chest pain, unspecified" },
  { code: "R10.9", label: "Abdominal pain, unspecified" },
  { code: "M54.50", label: "Low back pain, unspecified" },
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
  { code: "Z20.822", label: "Exposure to COVID-19" },
  { code: "Z00.00", label: "Adult health check, no abnormal findings" },
  { code: "Z32.01", label: "Pregnancy test, positive result" },
];

// Exact GoldCare sets from production
const LAB_SETS: Record<string, string[]> = {
  "Basic": [
    "Complete Blood Count with Differential (CBC)",
    "Metabolic Panel (BMP)",
  ],
  "Inflam-Stress": [
    "DHEA 004020",
    "Cortisol-am 104018",
    "Insulin 004333",
    "Sedimentation Rate 005215",
    "CRP-HS 120766",
  ],
  "Anemia": [
    "Complete Blood Count with Differential (CBC)",
    "Ferritin",
    "Iron and TIBC 001321",
  ],
  "Advanced": [
    "Complete Blood Count with Differential (CBC)",
    "Metabolic Panel (CMP)",
    "Comprehensive and Urinalysis",
    "Complete with microscopic examination with reflect to urine culture",
    "Comprehensive 377200",
    "Thyroid Stimulating Hormone (TSH) 004259",
    "D-Dimer",
  ],
  "Thyroid": [
    "Thyroid Antibodies",
    "Thyroglobulin Antibody",
    "Thyroid Stimulating Hormone (TSH)",
    "Triiodothyronine (T3)",
    "Triiodothyronine (T3), Free",
    "T4 Free",
    "Thyroxine (T4)",
    "Reverse T3, Serum",
  ],
  "Autoimmune": [
    "Immunoglobulin A 001784",
    "Antinuclear Antibodies 164863",
  ],
  "Hormone Female": [
    "Creatine Kinase and Urinalysis",
    "Complete with microscopic examination with reflect to urine culture",
    "Comprehensive 377200",
    "Complete Blood Count with Differential (CBC)",
    "Thyroid Stimulating Hormone (TSH) 004259",
    "D-Dimer and Lipid Panel 235010",
    "Metabolic Panel",
    "Comprehensive",
    "FSH",
    "LH 028480",
    "Progesterone 004317",
    "Estradiol 004515",
    "Estrogens Total",
    "Estrone Serum",
    "Sex Hormone Binding Globulin Serum",
  ],
  "Hormone Male": [
    "Creatine Kinase and Urinalysis",
    "Complete with microscopic examination with reflect to urine culture",
    "Comprehensive 377200",
    "Complete Blood Count with Differential (CBC)",
    "Thyroid Stimulating Hormone (TSH) 004259",
    "nd D-Dimer and Lipid Panel 235010",
    "Metabolic Panel",
    "Comprehensive and Testosterone 070038",
    "Sex Hormone Binding Globulin",
  ],
  "Thyroid Comprehensive": [
    "Thyroid Stimulating Hormone (TSH)",
    "Free T4 (223476)",
    "Thyroid Antibodies",
    "Thyroglobulin Antibody",
    "Thyroid-stimulating Immunoglobulin TSI",
  ],
};

const ORDER_TABS = Object.keys(LAB_SETS);

export default function AddLabOrderScreen() {  
  // Multi-order state management like RX form
  const [labOrders, setLabOrders] = React.useState<LabOrder[]>([
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

  // Convert diagnoses for ComboboxChips (outside of JSX)
  const diagnosisOptions = React.useMemo(() => 
    TOP_DIAGNOSES.map(d => ({ value: d.code, label: d.label })), 
    []
  );

  const handleSave = () => {
    // Auto-save functionality placeholder
  };

  // Lab order management functions
  const addOrder = () => {
    const newOrder: LabOrder = {
      id: crypto.randomUUID(),
      diagnoses: [],
      otherDx: "",
      requests: []
    };
    setLabOrders(prev => [...prev, newOrder]);
  };

  const removeOrder = (index: number) => {
    if (labOrders.length <= 1) return;
    setLabOrders(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateOrder = (index: number) => {
    const orderToDuplicate = labOrders[index];
    const duplicatedOrder: LabOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID()
    };
    setLabOrders(prev => [...prev, duplicatedOrder]);
  };

  const patchOrder = (index: number, updates: Partial<LabOrder>) => {
    setLabOrders(prev => prev.map((order, i) => 
      i === index ? { ...order, ...updates } : order
    ));
  };

  const addRequest = (orderIndex: number) => {
    const newRequest = {
      id: crypto.randomUUID(),
      category: "",
      exams: ""
    };
    setLabOrders(prev => prev.map((order, i) => 
      i === orderIndex 
        ? { ...order, requests: [...order.requests, newRequest] }
        : order
    ));
  };

  const removeRequest = (orderIndex: number, requestId: string) => {
    setLabOrders(prev => prev.map((order, i) => 
      i === orderIndex 
        ? { ...order, requests: order.requests.filter(r => r.id !== requestId) }
        : order
    ));
  };

  const updateRequest = (orderIndex: number, requestId: string, updates: Partial<{ category: string; exams: string }>) => {
    setLabOrders(prev => prev.map((order, i) => 
      i === orderIndex 
        ? { 
            ...order, 
            requests: order.requests.map(r => 
              r.id === requestId ? { ...r, ...updates } : r
            ) 
          }
        : order
    ));
  };

  const openModal = (orderIndex: number) => {
    setModal({ open: true, category: "Basic", orderIndex });
  };

  const openSet = (category: string, orderIndex: number) => 
    setModal({ open: true, category, orderIndex });

  const confirmSet = (exams: string[]) => {
    if (modal.category === null || modal.orderIndex === null) return;
    
    const orderIndex = modal.orderIndex;
    const category = modal.category;
    
    patchOrder(orderIndex, {
      requests: labOrders[orderIndex].requests.map(r => 
        r.category === category ? { ...r, exams: exams.join(", ") } : r
      ).concat(
        labOrders[orderIndex].requests.find(r => r.category === category) 
          ? [] 
          : [{ id: `${category}-${Date.now()}`, category, exams: exams.join(", ") }]
      ).filter(r => r.category !== category || exams.length > 0)
    });
    
    setModal({ open: false, category: null, orderIndex: null });
  };

  const renderSummary = (order: LabOrder) => {
    if (order.diagnoses.length === 0 && !order.otherDx.trim() && order.requests.length === 0) {
      return "";
    }
    
    const dxPart = order.diagnoses.length > 0 
      ? `Diagnoses: ${order.diagnoses.join("; ")}`
      : "Diagnoses: —";
    const otherPart = order.otherDx.trim() ? `; Notes: ${order.otherDx.trim()}` : "";
    const orders = order.requests.length > 0
      ? order.requests.map((r) => `${r.category}: ${r.exams}`).join("; ")
      : "No lab orders selected";
    return `${dxPart}${otherPart}; Orders: ${orders}`;
  };

  return (
    <>
    <div className="space-y-6">
      <PageHeader
        title="Lab orders"
        description="Create and manage lab orders for your patients"
        icon={FlaskConical}
      />

      {labOrders.map((order, idx) => (
        <Card key={idx} className="bg-surface border border-border rounded-lg p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm font-medium text-fg">Order #{idx + 1}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              {labOrders.length > 1 && (
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => duplicateOrder(idx)}
                >
                  Duplicate
                </Button>
              )}
              {labOrders.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeOrder(idx)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Diagnoses */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-fg">Diagnoses</Label>
                <ComboboxChips
                  options={diagnosisOptions}
                  selected={order.diagnoses}
                  onSelectionChange={(newDiagnoses) => patchOrder(idx, { diagnoses: newDiagnoses })}
                  placeholder="Select diagnoses..."
                />
              </div>
            </div>

            {/* Other diagnoses */}
            <div className="space-y-2">
              <Label htmlFor={`other-dx-${idx}`} className="text-sm font-medium text-fg">
                Other diagnosis
              </Label>
              <AutosizeTextarea
                id={`other-dx-${idx}`}
                value={order.otherDx}
                onChange={(e) => patchOrder(idx, { otherDx: e.target.value })}
                placeholder="Any additional diagnosis not listed above..."
                className="bg-surface text-fg placeholder:text-fg-muted border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Lab requests */}
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-between">
                <Label className="text-sm font-medium text-fg">Lab requests</Label>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => openModal(idx)}
                >
                  Select from order sets
                </Button>
              </div>

              {order.requests.map((req, reqIdx) => (
                <div key={req.id} className="border border-border rounded-md p-3 bg-bg">
                  <div className="flex flex-row items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={req.category}
                        onChange={(e) => updateRequest(idx, req.id, { category: e.target.value })}
                        placeholder="Lab category (e.g., Blood work, Imaging)"
                        className="bg-surface text-fg placeholder:text-fg-muted border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <AutosizeTextarea
                        value={req.exams}
                        onChange={(e) => updateRequest(idx, req.id, { exams: e.target.value })}
                        placeholder="Specific exams/tests..."
                        className="bg-surface text-fg placeholder:text-fg-muted border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => removeRequest(idx, req.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="subtle"
                size="sm"
                onClick={() => addRequest(idx)}
                className="w-full"
              >
                + Add lab request
              </Button>
            </div>

            {/* Summary */}
            {renderSummary(order) && (
              <div className="border-t border-border pt-4">
                <div className="text-sm text-fg-muted">
                  <strong>Summary:</strong> {renderSummary(order)}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Add another order */}
      <div className="flex justify-center">
        <Button
          variant="subtle"
          onClick={addOrder}
          className="px-6"
        >
          + Add another order
        </Button>
      </div>
    </div>

    {/* Modal: preselect ALL items for the chosen set; user can uncheck then Confirm */}
    {modal.open && modal.category && modal.orderIndex !== null ? (
      <OrderSetModal
        title={`${modal.category}`}
        options={LAB_SETS[modal.category] || []}
        selected={LAB_SETS[modal.category] || []}
        onClose={() => setModal({ open: false, category: null, orderIndex: null })}
        onConfirm={confirmSet}
      />
    ) : null}
    </>
  );
}
