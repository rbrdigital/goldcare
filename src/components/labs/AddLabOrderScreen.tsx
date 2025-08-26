"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import ComboboxChips from "@/components/ui/ComboboxChips";
import OrderSetModal from "./OrderSetModal";

type Diagnosis = { code: string; label: string };
type Request = { id: string; category: string; exams: string[] };

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
  const [selectedDiagnoses, setSelectedDiagnoses] = React.useState<string[]>([]);
  const [otherDx, setOtherDx] = React.useState("");
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [modal, setModal] = React.useState<{ open: boolean; category: string | null }>({ open: false, category: null });

  // Convert TOP_DIAGNOSES to combobox format
  const diagnosisOptions = React.useMemo(
    () => TOP_DIAGNOSES.map(d => ({
      value: `${d.label} (${d.code})`,
      label: `${d.label} (${d.code})`
    })),
    []
  );

  const openSet = (category: string) => setModal({ open: true, category });
  const confirmSet = (exams: string[]) => {
    if (!modal.category) return;
    setRequests((prev) => {
      const i = prev.findIndex((r) => r.category === modal.category);
      const next: Request = { id: `${modal.category}-${Date.now()}`, category: modal.category!, exams };
      if (i >= 0) return prev.map((r, idx) => (idx === i ? next : r));
      return [...prev, next];
    });
    setModal({ open: false, category: null });
  };
  const editSet = (category: string) => openSet(category);
  const removeSet = (category: string) => setRequests((prev) => prev.filter((r) => r.category !== category));

  return (
    <div className="mx-auto w-full max-w-5xl px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-fg">
              Lab orders
            </h1>
            <p className="text-fg-muted">Create and manage lab orders for your patients</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Auto-saved</Badge>
            <Button variant="outline">Duplicate</Button>
            <Button variant="outline">Create new</Button>
          </div>
        </div>

        {/* Clinical diagnosis */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Clinical diagnosis</h2>
          <div className="space-y-4">
            <ComboboxChips
              id="diagnoses"
              label="Common diagnoses"
              placeholder="Search diagnoses or add custom text..."
              options={diagnosisOptions}
              selected={selectedDiagnoses}
              onSelectionChange={setSelectedDiagnoses}
            />

            <div>
              <Label htmlFor="other">Other (free text)</Label>
              <AutosizeTextarea
                id="other"
                minRows={2}
                placeholder="Describe additional clinical context"
                value={otherDx}
                onChange={(e) => setOtherDx(e.target.value)}
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
                onClick={() => openSet(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Requests list */}
          <div className="mt-4 divide-y divide-divider">
            {requests.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium">{r.category}</div>
                  <div className="text-sm text-fg-muted truncate">{r.exams.join(" • ")}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm text-fg-muted hover:underline focus-visible:outline-none" onClick={() => editSet(r.category)}>Edit</button>
                  <button className="text-sm text-fg-muted hover:underline focus-visible:outline-none" onClick={() => removeSet(r.category)}>Remove</button>
                </div>
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-fg-muted py-3">No lab orders selected.</p>}
          </div>
        </section>

        <Separator className="my-6" />

        {/* Summary card */}
        <section>
          <div className="rounded-md border border-border bg-surface p-4">
            <div className="font-medium mb-1">Order summary</div>
            <div className="text-sm text-fg-muted leading-6">
              {renderSummary(selectedDiagnoses, otherDx, requests)}
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-black text-white hover:opacity-90">Save</Button>
        </div>
      </div>

      {/* Modal: preselect ALL items for the chosen set; user can uncheck then Confirm */}
      {modal.open && modal.category ? (
        <OrderSetModal
          title={modal.category}
          options={LAB_SETS[modal.category]}
          selected={
            requests.find((r) => r.category === modal.category)?.exams ??
            LAB_SETS[modal.category]
          }
          onClose={() => setModal({ open: false, category: null })}
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