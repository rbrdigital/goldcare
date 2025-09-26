"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import PharmacyPickerModal from "@/components/modals/PharmacyPickerModal";
import { Pill } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SelectedPharmacyCard from "./SelectedPharmacyCard";
import { useConsultStore, type Prescription } from "@/store/useConsultStore";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

// Mock pharmacy data
const MOCK_PHARMACIES = [
  {
    name: "CVS Pharmacy #1023", 
    address: "123 Main St", 
    city: "Naples", 
    state: "FL", 
    zip: "34102",
    phone: "(239) 555-0123",
    distance: "0.8 mi",
    isOpen: true,
    is24hr: false
  },
  {
    name: "Walgreens #5541", 
    address: "200 Pine Ave", 
    city: "Naples", 
    state: "FL", 
    zip: "34103",
    phone: "(239) 555-0456",
    distance: "1.2 mi",
    isOpen: false,
    is24hr: true
  },
  {
    name: "Publix Pharmacy", 
    address: "901 Lake Dr", 
    city: "Naples", 
    state: "FL", 
    zip: "34104",
    phone: "(239) 555-0789",
    distance: "2.1 mi",
    isOpen: true,
    is24hr: false
  }
];

type RxFields = {
  medicine: string;
  qtyPerDose: number | "";
  formulation: string;
  route: string;
  strength: string;
  frequencyKey: FrequencyKey | "";
  frequencyOther: string;
  duration: number | "";
  totalQtyUnit: "Tablet" | "Capsule" | "mL";
  refills: number | "";
  action: string;
  prn: boolean;
  prnInstructions: string;
  subsAllowed: boolean;
  startDate: string;
  earliestFill: string;
  notesPatient: string;
  notesPharmacy: string;
  selectedPharmacy: SelectedPharmacy | null;
};

type SelectedPharmacy = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  distance?: string;
  isOpen?: boolean;
  is24hr?: boolean;
};

type FrequencyKey = "qd" | "q12h" | "q8h" | "q6h" | "qod" | "other";

const FREQUENCIES: Record<FrequencyKey, { label: string; perDay: number }> = {
  qd: { label: "Once daily", perDay: 1 },
  q12h: { label: "Every 12 hours", perDay: 2 },
  q8h: { label: "Every 8 hours", perDay: 3 },
  q6h: { label: "Every 6 hours", perDay: 4 },
  qod: { label: "Every other day", perDay: 0.5 },
  other: { label: "Other", perDay: 1 }
};

const FORMULATIONS = ["Tablet", "Capsule", "Liquid", "ODT"] as const;
const ROUTES = ["Oral", "IM", "IV"] as const;
const QTY_UNITS = ["Tablet", "Capsule", "mL"] as const;

function emptyRx(): RxFields {
  const today = new Date().toISOString().split('T')[0];
  return {
    medicine: "",
    qtyPerDose: "",
    formulation: "",
    route: "",
    strength: "",
    frequencyKey: "",
    frequencyOther: "",
    duration: "",
    totalQtyUnit: "Tablet",
    refills: "",
    action: "Take",
    prn: false,
    prnInstructions: "",
    subsAllowed: true,
    startDate: today,
    earliestFill: today,
    notesPatient: "",
    notesPharmacy: "",
    selectedPharmacy: null
  };
}

export default function RXForm() {
  const {
    prescriptions,
    addPrescription,
    updatePrescription,
    removePrescription
  } = useConsultStore();
  
  // Initialize with empty prescription if none exist
  const [showPicker, setShowPicker] = React.useState<{ rxIndex: number } | null>(null);

  React.useEffect(() => {
    if (prescriptions.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const emptyPrescription: Prescription = {
        id: crypto.randomUUID(),
        medicine: "",
        qtyPerDose: "",
        formulation: "",
        route: "",
        strength: "",
        frequency: "",
        frequencyOther: "",
        duration: "",
        totalQtyUnit: "Tablet",
        refills: "",
        action: "Take",
        prn: false,
        prnInstructions: "",
        subsAllowed: true,
        startDate: today,
        earliestFill: today,
        notesPatient: "",
        notesPharmacy: "",
        selectedPharmacy: null
      };
      addPrescription(emptyPrescription);
    }
  }, [prescriptions.length, addPrescription]);

  const addItem = () => {
    const today = new Date().toISOString().split('T')[0];
    const newPrescription: Prescription = {
      id: crypto.randomUUID(),
      medicine: "",
      qtyPerDose: "",
      formulation: "",
      route: "",
      strength: "",
      frequency: "",
      frequencyOther: "",
      duration: "",
      totalQtyUnit: "Tablet",
      refills: "",
      action: "Take",
      prn: false,
      prnInstructions: "",
      subsAllowed: true,
      startDate: today,
      earliestFill: today,
      notesPatient: "",
      notesPharmacy: "",
      selectedPharmacy: null
    };
    addPrescription(newPrescription);
  };
  
  const removeItem = (idx: number) => {
    if (prescriptions.length === 1) return; // Keep at least one
    removePrescription(prescriptions[idx].id);
  };
  
  const duplicateItem = (idx: number) => {
    const original = prescriptions[idx];
    const duplicate: Prescription = {
      ...original,
      id: crypto.randomUUID()
    };
    addPrescription(duplicate);
  };
  
  const patchItem = (idx: number, patch: Partial<Prescription>) => {
    updatePrescription(prescriptions[idx].id, patch);
  };

  const handleSave = () => {
    toast({
      title: "Prescriptions Saved",
      description: "Your prescription orders have been saved.",
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6" data-testid="rx-form">

        {prescriptions.map((rx, i) => {
          const totalQty = calcTotalQty(rx);
          return (
            <section key={i} className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Prescription #{i + 1}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => duplicateItem(i)}>Duplicate</Button>
                  {prescriptions.length > 1 ? (
                    <Button variant="outline" onClick={() => removeItem(i)}>
                      Remove
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" disabled>
                          Remove
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Keep one draft prescription
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

            {/* Medicine name */}
            <div className="mb-3">
              <Label htmlFor={`med-${i}`}>Medicine name</Label>
              <Input
                id={`med-${i}`}
                placeholder="Enter medicine name"
                value={rx.medicine}
                onChange={(e) => patchItem(i, { medicine: e.target.value })}
              />
            </div>

            {/* GoldCare AI - Therapy plan */}
            <div className="space-y-2 mb-6">
              <AIChipClosedSmart
                text="Therapy plan: amoxicillin–clavulanate 875/125 mg tablet, 1 tab PO q12h x 10 days; 0 refills."
                onInsert={() =>
                  applyTherapyInsight(i, patchItem)
                }
              />
            </div>

            {/* Row 2: Route, Formulation, Strength */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Route</Label>
                <Select
                  value={rx.route}
                  onChange={(v) => patchItem(i, { route: v })}
                  placeholder="Select route"
                  options={[...ROUTES]}
                />
              </div>
              <div>
                <Label>Formulation</Label>
                <Select
                  value={rx.formulation}
                  onChange={(v) => patchItem(i, { formulation: v })}
                  placeholder="Select formulation"
                  options={[...FORMULATIONS]}
                />
              </div>
              <div>
                <Label htmlFor={`strength-${i}`}>Strength</Label>
                <Input
                  id={`strength-${i}`}
                  placeholder="e.g., 875/125 mg"
                  value={rx.strength}
                  onChange={(e) => patchItem(i, { strength: e.target.value })}
                />
              </div>
            </div>

            {/* Row 3: Quantity, Frequency, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor={`qty-${i}`}>Quantity</Label>
                <Input
                  id={`qty-${i}`}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 1"
                  value={rx.qtyPerDose as number | ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    patchItem(i, { qtyPerDose: val === "" ? "" : Math.max(0, parseInt(val) || 0) });
                  }}
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select
                  value={rx.frequency}
                  onChange={(label) => {
                    patchItem(i, { frequency: label });
                    if (label !== "Other") {
                      patchItem(i, { frequencyOther: "" });
                    }
                  }}
                  placeholder="Select frequency"
                  options={Object.values(FREQUENCIES).map((f) => f.label)}
                />
                {rx.frequency === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom frequency"
                    value={rx.frequencyOther}
                    onChange={(e) => patchItem(i, { frequencyOther: e.target.value })}
                  />
                )}
              </div>
              <div>
                <Label htmlFor={`dur-${i}`}>Duration (days)</Label>
                <Input
                  id={`dur-${i}`}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 10"
                  value={rx.duration as number | ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    patchItem(i, { duration: val === "" ? "" : Math.max(0, parseInt(val) || 0) });
                  }}
                />
              </div>
            </div>

            {/* Row 4: Substitutions, Refills, PRN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Substitutions</Label>
                <Select
                  value={rx.subsAllowed ? "Substitutions allowed" : "No substitutions"}
                  onChange={(v) => patchItem(i, { subsAllowed: v === "Substitutions allowed" })}
                  options={["Substitutions allowed", "No substitutions"]}
                />
              </div>
              <div>
                <Label htmlFor={`ref-${i}`}>Refills</Label>
                <Input
                  id={`ref-${i}`}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 0"
                  value={rx.refills as number | ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    patchItem(i, { refills: val === "" ? "" : Math.max(0, parseInt(val) || 0) });
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    id={`prn-${i}`}
                    type="checkbox"
                    className="h-4 w-4"
                    checked={rx.prn}
                    onChange={(e) => patchItem(i, { prn: e.target.checked, prnInstructions: e.target.checked ? rx.prnInstructions : "" })}
                  />
                  <Label htmlFor={`prn-${i}`}>PRN (as needed)</Label>
                </div>
                <Input
                  id={`prn-instructions-${i}`}
                  placeholder="e.g., for pain, for nausea"
                  value={rx.prnInstructions}
                  disabled={!rx.prn}
                  onChange={(e) => patchItem(i, { prnInstructions: e.target.value })}
                />
              </div>
            </div>

            {/* Row 5: Start date, Earliest fill date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={rx.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => patchItem(i, { startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Earliest fill date</Label>
                <Input
                  type="date"
                  value={rx.earliestFill || new Date().toISOString().split('T')[0]}
                  onChange={(e) => patchItem(i, { earliestFill: e.target.value })}
                />
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <Label>Notes to patient</Label>
                <AutosizeTextarea
                  minRows={2}
                  placeholder="Additional instructions for the patient"
                  value={rx.notesPatient}
                  onChange={(e) => patchItem(i, { notesPatient: e.target.value })}
                />
                {/* Safety AI chip */}
                <div className="mt-2">
                  <AIChipClosedSmart
                    text="Safety: avoid with anaphylaxis to penicillins; take with food; consider doxycycline/azithro if allergy."
                    onInsert={() =>
                      patchItem(i, {
                        notesPatient: mergeLines(rx.notesPatient, [
                          "Avoid if history of anaphylaxis to penicillins.",
                          "Take with food to reduce GI upset."
                        ])
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Notes to pharmacy</Label>
                <AutosizeTextarea
                  minRows={2}
                  placeholder="Additional instructions for the pharmacy"
                  value={rx.notesPharmacy}
                  onChange={(e) => patchItem(i, { notesPharmacy: e.target.value })}
                />
                {/* Pharmacy guidance AI chip */}
                <div className="mt-2">
                  <AIChipClosedSmart
                    text="Pharmacy guidance: counsel on GI tolerance, drug interactions with warfarin/oral contraceptives, proper storage, completion of full course."
                    onInsert={() =>
                      patchItem(i, {
                        notesPharmacy: mergeLines(rx.notesPharmacy, [
                          "Counsel patient on taking with food to minimize GI upset.",
                          "Check for drug interactions with warfarin and oral contraceptives.",
                          "Advise patient to complete full course even if symptoms improve.",
                          "Store in cool, dry place. Refrigeration not required."
                        ])
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Order Summary removed - replaced by PrescriptionHeader */}

            {/* Pharmacy selection removed - replaced by PharmacyLine */}
          </section>
        );
      })}

      {/* Add prescription */}
      <div className="mt-8">
        <Button variant="outline" onClick={addItem}>Add another prescription</Button>
      </div>

      {/* Pharmacy picker modal */}
      {showPicker && (
        <PharmacyPickerModal
          onClose={() => setShowPicker(null)}
          onSelect={(name) => {
            const selectedMockPharmacy = MOCK_PHARMACIES.find(p => p.name === name) || MOCK_PHARMACIES[0];
            if (showPicker) {
              patchItem(showPicker.rxIndex, { selectedPharmacy: selectedMockPharmacy });
            }
            setShowPicker(null);
          }}
        />
      )}
    </div>
    </TooltipProvider>
  );
}

/* ---------- helpers ---------- */

function labelToKey(label: string): FrequencyKey | null {
  const entries = Object.entries(FREQUENCIES) as [FrequencyKey, { label: string; perDay: number }][];
  for (const [k, v] of entries) if (v.label === label) return k;
  return null;
}

  const calcTotalQty = (rx: Prescription): number => {
    const qtyPerDose = Number(rx.qtyPerDose) || 0;
    const duration = Number(rx.duration) || 0;
    const frequency = rx.frequency;
    
    // Convert frequency label to key and get perDay value
    const frequencyKey = labelToKey(frequency);
    const perDay = frequencyKey ? FREQUENCIES[frequencyKey].perDay : 1;
    
    return Math.ceil(qtyPerDose * perDay * duration);
  };

function toNumber(v: number | "" | string): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n as number) ? (n as number) : 0;
}

function toNumOrEmpty(v: string): number | "" {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : "";
}

function mergeLines(existing: string, lines: string[]) {
  const set = new Set(
    existing
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
  );
  for (const l of lines) set.add(l);
  return Array.from(set).join("\n");
}

function renderSummary(rx: Prescription & { totalQty: number }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDuration = (duration: number | "") => {
    if (duration === "" || duration === 0 || !duration) return "";
    const num = Number(duration);
    return num === 1 ? `for 1 day` : `for ${num} days`;
  };

  const freq = rx.frequency || "—";
  const parts = [
    rx.medicine ? `Prescribed ${rx.medicine}` : "",
    `${capitalize(rx.action)} ${rx.qtyPerDose || "—"} ${rx.formulation || "—"} (${(rx.route || "—").toLowerCase()}) ${freq.toLowerCase()}`,
    rx.duration ? formatDuration(rx.duration) : "",
    Number.isFinite(rx.totalQty) ? `Total Qty: ${rx.totalQty} ${rx.totalQtyUnit.toLowerCase()}` : "",
    `Refills: ${rx.refills === "" ? "—" : rx.refills}`,
    rx.prn ? `PRN${rx.prnInstructions ? ` (${rx.prnInstructions})` : ""}` : "",
    rx.subsAllowed ? "Substitutions allowed" : "No substitutions",
    rx.startDate ? `Start: ${formatDate(rx.startDate)}` : "",
    rx.earliestFill ? `Earliest fill: ${formatDate(rx.earliestFill)}` : "",
    rx.selectedPharmacy ? `Pharmacy: ${rx.selectedPharmacy.name} — ${rx.selectedPharmacy.city}, ${rx.selectedPharmacy.state} ${rx.selectedPharmacy.zip}` : ""
  ].filter(Boolean);
  return parts.join("; ");
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/* styled select using primitives' look */
function Select({
  value,
  onChange,
  options,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      className={cn(
        "w-full h-9 px-3 rounded-md bg-surface border border-border",
        "text-sm placeholder:text-fg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
}

function ChoiceCard({
  label,
  sub,
  selected,
  onClick
}: {
  label: string;
  sub?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition",
        "focus-visible:outline-none focus-visible:ring-2",
        // selection uses primary ring
        selected ? "border-primary ring-2 ring-primary" : "border-border bg-surface"
      )}
    >
      <div className="font-medium">{label}</div>
      {sub ? <div className="text-sm text-fg-muted">{sub}</div> : null}
    </button>
  );
}

/* AI insight that fills Medicine + all fields */
function applyTherapyInsight(
  index: number,
  patch: (idx: number, patch: Partial<Prescription>) => void
) {
  patch(index, {
    medicine: "Amoxicillin–clavulanate 875/125 mg tablet",
    qtyPerDose: 1,
    formulation: "Tablet",
    route: "Oral",
    frequency: "Every 12 hours",
    duration: 10,
    totalQtyUnit: "Tablet",
    refills: 0,
    prn: false,
    prnInstructions: ""
  });
}