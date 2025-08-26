"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { FlaskConical } from "lucide-react";
import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";

type Diagnosis = { code: string; label: string };
type Request = { id: string; category: string; exams: string[] };

// Lab order type
interface LabOrder {
  id: string;
  diagnoses: string[];
  otherDx: string;
  requests: Request[];
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

  // Lab order management functions
  const addLabOrder = () => {
    const newOrder: LabOrder = {
      id: crypto.randomUUID(),
      diagnoses: [],
      otherDx: "",
      requests: []
    };
    setLabOrders(prev => [...prev, newOrder]);
  };

  const removeLabOrder = (index: number) => {
    if (labOrders.length <= 1) return; // Keep at least one order
    setLabOrders(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateLabOrder = (index: number) => {
    const orderToDuplicate = labOrders[index];
    const duplicatedOrder: LabOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID()
    };
    setLabOrders(prev => [...prev, duplicatedOrder]);
  };

  const updateLabOrder = (index: number, updates: Partial<LabOrder>) => {
    setLabOrders(prev => prev.map((order, i) => 
      i === index ? { ...order, ...updates } : order
    ));
  };

  const openSet = (category: string, orderIndex: number) => 
    setModal({ open: true, category, orderIndex });

  const confirmSet = (exams: string[]) => {
    if (modal.category === null || modal.orderIndex === null) return;
    
    const orderIndex = modal.orderIndex;
    const category = modal.category;
    
    updateLabOrder(orderIndex, {
      requests: labOrders[orderIndex].requests.map(r => 
        r.category === category ? { ...r, exams } : r
      ).concat(
        labOrders[orderIndex].requests.find(r => r.category === category) 
          ? [] 
          : [{ id: `${category}-${Date.now()}`, category, exams }]
      ).filter(r => r.category !== category || exams.length > 0)
    });
    
    setModal({ open: false, category: null, orderIndex: null });
  };

  const editSet = (category: string, orderIndex: number) => openSet(category, orderIndex);
  
  const removeSet = (category: string, orderIndex: number) => {
    updateLabOrder(orderIndex, {
      requests: labOrders[orderIndex].requests.filter(r => r.category !== category)
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6">
      <div className="space-y-6">
        <PageHeader
          title="Lab orders"
          description="Create and manage lab orders for your patients"
          icon={FlaskConical}
          onSave={handleSave}
        />

        {/* Render each lab order */}
        {labOrders.map((order, orderIndex) => (
          <div key={order.id} className="space-y-6">
            {/* Lab order section header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lab order #{orderIndex + 1}</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => duplicateLabOrder(orderIndex)}
                >
                  Duplicate
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => removeLabOrder(orderIndex)}
                  disabled={labOrders.length <= 1}
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
                  onSelectionChange={(diagnoses) => updateLabOrder(orderIndex, { diagnoses })}
                />

                <div>
                  <Label htmlFor={`other-${orderIndex}`}>Other (free text)</Label>
                  <AutosizeTextarea
                    id={`other-${orderIndex}`}
                    minRows={2}
                    placeholder="Describe additional clinical context"
                    value={order.otherDx}
                    onChange={(e) => updateLabOrder(orderIndex, { otherDx: e.target.value })}
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
                  <p className="text-sm text-fg-muted py-3">No lab orders selected.</p>
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
            {orderIndex < labOrders.length - 1 && <Separator className="my-6" />}
          </div>
        ))}

        {/* Add another order */}
        <div className="mt-4">
          <Button variant="outline" className="text-sm" onClick={addLabOrder}>
            + Add another order
          </Button>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-black text-white hover:opacity-90">Save</Button>
        </div>
      </div>

      {/* Modal: preselect ALL items for the chosen set; user can uncheck then Confirm */}
      {modal.open && modal.category && modal.orderIndex !== null ? (
        <OrderSetModal
          title={modal.category}
          options={LAB_SETS[modal.category]}
          selected={
            labOrders[modal.orderIndex].requests.find((r) => r.category === modal.category)?.exams ??
            LAB_SETS[modal.category]
          }
          onClose={() => setModal({ open: false, category: null, orderIndex: null })}
          onConfirm={confirmSet}
        />
      ) : null}
    </div>
  );
}

function renderSummary(diagnoses: string[], other: string, reqs: Request[]) {
  const dxPart = diagnoses.length > 0 
    ? `Diagnoses: ${diagnoses.join("; ")}`
    : "Diagnoses: —";
  const otherPart = other.trim() ? `; Notes: ${other.trim()}` : "";
  const orders = reqs.length > 0
    ? reqs.map((r) => `${r.category}: ${r.exams.join(", ")}`).join("; ")
    : "No lab orders selected";
  return `${dxPart}${otherPart}; Orders: ${orders}`;
}