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

type RxFields = {
  medicine: string;
  qtyPerDose: number | "";
  formulation: string;
  route: string;
  frequencyKey: FrequencyKey | "";
  duration: number | "";
  durationUnit: "Days" | "Weeks";
  totalQtyUnit: "Tablet" | "Capsule" | "mL";
  refills: number | "";
  action: string;
  prn: boolean;
  location: string;
  subsAllowed: boolean;
  startDate: string;
  earliestFill: string;
  notesPatient: string;
  notesPharmacy: string;
};

type FrequencyKey = "qd" | "q12h" | "q8h" | "q6h" | "qod";

const FREQUENCIES: Record<FrequencyKey, { label: string; perDay: number }> = {
  qd: { label: "Once daily", perDay: 1 },
  q12h: { label: "Every 12 hours", perDay: 2 },
  q8h: { label: "Every 8 hours", perDay: 3 },
  q6h: { label: "Every 6 hours", perDay: 4 },
  qod: { label: "Every other day", perDay: 0.5 }
};

const FORMULATIONS = ["Tablet", "Capsule", "Liquid", "ODT"] as const;
const ROUTES = ["Oral", "IM", "IV"] as const;
const QTY_UNITS = ["Tablet", "Capsule", "mL"] as const;

function emptyRx(): RxFields {
  return {
    medicine: "",
    qtyPerDose: "",
    formulation: "",
    route: "",
    frequencyKey: "",
    duration: "",
    durationUnit: "Days",
    totalQtyUnit: "Tablet",
    refills: "",
    action: "Take",
    prn: false,
    location: "",
    subsAllowed: true,
    startDate: "",
    earliestFill: "",
    notesPatient: "",
    notesPharmacy: ""
  };
}

export default function RXForm() {
  const [items, setItems] = React.useState<RxFields[]>([emptyRx()]);
  const [selectedPharmacy, setSelectedPharmacy] = React.useState<string | null>(null);
  const [showPicker, setShowPicker] = React.useState(false);

  const addItem = () => setItems((a) => [...a, emptyRx()]);
  const removeItem = (idx: number) =>
    setItems((a) => (a.length === 1 ? a : a.filter((_, i) => i !== idx)));
  const duplicateItem = (idx: number) =>
    setItems((a) => {
      const copy = structuredClone(a[idx]);
      return [...a.slice(0, idx + 1), copy, ...a.slice(idx + 1)];
    });
  const patchItem = (idx: number, patch: Partial<RxFields>) =>
    setItems((a) => a.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const handleSave = () => {
    toast({
      title: "Prescriptions Saved",
      description: "Your prescription orders have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptions"
        description="Create and manage prescription orders for your patients"
        icon={Pill}
        onSave={handleSave}
      />

      {items.map((rx, i) => {
        const totalQty = calcTotalQty(rx);
        return (
          <section key={i} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Prescription #{i + 1}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => duplicateItem(i)}>Duplicate</Button>
                <Button variant="outline" onClick={() => removeItem(i)} disabled={items.length === 1}>
                  Remove
                </Button>
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
            <div className="space-y-2 mb-4">
              <AIChipClosedSmart
                text="Therapy plan: amoxicillin–clavulanate 875/125 mg tablet, 1 tab PO q12h x 10 days; 0 refills."
                onInsert={() =>
                  applyTherapyInsight(i, patchItem)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Quantity per dose */}
              <div className="md:col-span-3">
                <Label htmlFor={`qty-${i}`}>Quantity</Label>
                <Input
                  id={`qty-${i}`}
                  type="number"
                  min={0}
                  placeholder="e.g., 1"
                  value={rx.qtyPerDose as number | ""}
                  onChange={(e) => patchItem(i, { qtyPerDose: toNumOrEmpty(e.target.value) })}
                />
              </div>

              {/* Formulation */}
              <div className="md:col-span-3">
                <Label>Formulation</Label>
                <Select
                  value={rx.formulation}
                  onChange={(v) => patchItem(i, { formulation: v })}
                  placeholder="Select formulation"
                  options={[...FORMULATIONS]}
                />
              </div>

              {/* Route */}
              <div className="md:col-span-3">
                <Label>Route</Label>
                <Select
                  value={rx.route}
                  onChange={(v) => patchItem(i, { route: v })}
                  placeholder="Select route"
                  options={[...ROUTES]}
                />
              </div>

              {/* Frequency */}
              <div className="md:col-span-3">
                <Label>Frequency</Label>
                <Select
                  value={rx.frequencyKey ? FREQUENCIES[rx.frequencyKey].label : ""}
                  onChange={(label) =>
                    patchItem(i, {
                      frequencyKey: labelToKey(label) ?? ""
                    })
                  }
                  placeholder="Select frequency"
                  options={Object.values(FREQUENCIES).map((f) => f.label)}
                />
              </div>

              {/* Duration */}
              <div className="md:col-span-3">
                <Label htmlFor={`dur-${i}`}>Duration</Label>
                <Input
                  id={`dur-${i}`}
                  type="number"
                  min={0}
                  placeholder="e.g., 10"
                  value={rx.duration as number | ""}
                  onChange={(e) => patchItem(i, { duration: toNumOrEmpty(e.target.value) })}
                />
              </div>

              {/* Duration unit */}
              <div className="md:col-span-3">
                <Label>Unit</Label>
                <Select
                  value={rx.durationUnit}
                  onChange={(v) =>
                    patchItem(i, { durationUnit: (v as RxFields["durationUnit"]) || "Days" })
                  }
                  options={["Days", "Weeks"]}
                />
              </div>

              {/* Total Qty (auto) */}
              <div className="md:col-span-3">
                <Label>Total Qty</Label>
                <Input readOnly value={Number.isFinite(totalQty) ? totalQty : ""} />
              </div>

              <div className="md:col-span-3">
                <Label>Unit</Label>
                <Select
                  value={rx.totalQtyUnit}
                  onChange={(v) =>
                    patchItem(i, { totalQtyUnit: (v as RxFields["totalQtyUnit"]) || "Tablet" })
                  }
                  options={[...QTY_UNITS]}
                />
              </div>

              {/* Refills */}
              <div className="md:col-span-3">
                <Label htmlFor={`ref-${i}`}>Refills</Label>
                <Input
                  id={`ref-${i}`}
                  type="number"
                  min={0}
                  placeholder="e.g., 0"
                  value={rx.refills as number | ""}
                  onChange={(e) => patchItem(i, { refills: toNumOrEmpty(e.target.value) })}
                />
              </div>

              {/* Action */}
              <div className="md:col-span-3">
                <Label htmlFor={`act-${i}`}>Action</Label>
                <Input
                  id={`act-${i}`}
                  placeholder="e.g., Take"
                  value={rx.action}
                  onChange={(e) => patchItem(i, { action: e.target.value })}
                />
              </div>

              {/* PRN */}
              <div className="md:col-span-3 flex items-end gap-2">
                <input
                  id={`prn-${i}`}
                  type="checkbox"
                  className="h-4 w-4"
                  checked={rx.prn}
                  onChange={(e) => patchItem(i, { prn: e.target.checked })}
                />
                <Label htmlFor={`prn-${i}`} className="mb-0">PRN (as needed)</Label>
              </div>

              {/* Location */}
              <div className="md:col-span-3">
                <Label htmlFor={`loc-${i}`}>Location</Label>
                <Input
                  id={`loc-${i}`}
                  placeholder="e.g., Home"
                  value={rx.location}
                  onChange={(e) => patchItem(i, { location: e.target.value })}
                />
              </div>

              {/* Substitutions */}
              <div className="md:col-span-3">
                <Label>Substitutions</Label>
                <Select
                  value={rx.subsAllowed ? "Substitutions allowed" : "No substitutions"}
                  onChange={(v) => patchItem(i, { subsAllowed: v === "Substitutions allowed" })}
                  options={["Substitutions allowed", "No substitutions"]}
                />
              </div>

              {/* Dates */}
              <div className="md:col-span-3">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={rx.startDate}
                  onChange={(e) => patchItem(i, { startDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-3">
                <Label>Earliest fill date</Label>
                <Input
                  type="date"
                  value={rx.earliestFill}
                  onChange={(e) => patchItem(i, { earliestFill: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Order Summary */}
            <div className="rounded-md border border-border bg-surface p-4">
              <div className="font-medium mb-1">Order Summary</div>
              <div className="text-sm text-fg-muted">
                {renderSummary({ ...rx, totalQty })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Pharmacy selector */}
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChoiceCard
          label="Partell specialty pharmacy"
          sub="Freedom"
          selected={selectedPharmacy === "Partell specialty pharmacy"}
          onClick={() => setSelectedPharmacy("Partell specialty pharmacy")}
        />
        <ChoiceCard
          label="Walgreens"
          sub="Nearby"
          selected={selectedPharmacy === "Walgreens"}
          onClick={() => setSelectedPharmacy("Walgreens")}
        />
        <ChoiceCard
          label="Choose other pharmacy"
          selected={false}
          onClick={() => setShowPicker(true)}
        />
        <ChoiceCard
          label="Send to manager"
          selected={selectedPharmacy === "Send to manager"}
          onClick={() => setSelectedPharmacy("Send to manager")}
        />
      </div>


      {/* Add prescription */}
      <div className="mt-8">
        <Button variant="outline" onClick={addItem}>Add another prescription</Button>
      </div>

      {/* Pharmacy picker modal */}
      {showPicker ? (
        <PharmacyPickerModal
          onClose={() => setShowPicker(false)}
          onSelect={(name) => {
            setSelectedPharmacy(name);
            setShowPicker(false);
          }}
        />
      ) : null}
    </div>
  );
}

/* ---------- helpers ---------- */

function labelToKey(label: string): FrequencyKey | null {
  const entries = Object.entries(FREQUENCIES) as [FrequencyKey, { label: string; perDay: number }][];
  for (const [k, v] of entries) if (v.label === label) return k;
  return null;
}

function calcTotalQty(rx: RxFields): number {
  const qty = toNumber(rx.qtyPerDose);
  const perDay = rx.frequencyKey ? FREQUENCIES[rx.frequencyKey].perDay : 0;
  const days = rx.durationUnit === "Weeks" ? toNumber(rx.duration) * 7 : toNumber(rx.duration);
  const total = qty * perDay * days;
  return Number.isFinite(total) ? Math.ceil(total) : NaN;
}

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

function renderSummary(rx: RxFields & { totalQty: number }) {
  const freq = rx.frequencyKey ? FREQUENCIES[rx.frequencyKey].label.toLowerCase() : "—";
  const parts = [
    rx.medicine ? `Prescribed ${rx.medicine}` : "",
    `${capitalize(rx.action)} ${rx.qtyPerDose || "—"} ${rx.formulation || "—"} (${(rx.route || "—").toLowerCase()}) ${freq}`,
    rx.duration ? `for ${rx.duration} ${rx.durationUnit.toLowerCase()}` : "",
    Number.isFinite(rx.totalQty) ? `Total Qty: ${rx.totalQty} ${rx.totalQtyUnit.toLowerCase()}` : "",
    `Refills: ${rx.refills === "" ? "—" : rx.refills}`,
    rx.prn ? "PRN" : "",
    rx.subsAllowed ? "Substitutions allowed" : "No substitutions",
    rx.startDate ? `Start: ${rx.startDate}` : "",
    rx.earliestFill ? `Earliest fill: ${rx.earliestFill}` : ""
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
  patch: (idx: number, patch: Partial<RxFields>) => void
) {
  patch(index, {
    medicine: "Amoxicillin–clavulanate 875/125 mg tablet",
    qtyPerDose: 1,
    formulation: "Tablet",
    route: "Oral",
    frequencyKey: "q12h",
    duration: 10,
    durationUnit: "Days",
    totalQtyUnit: "Tablet",
    refills: 0,
    prn: false
  });
}