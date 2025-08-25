"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Separator } from "@/components/ui/separator";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RxItem = { drug: string; sig: string };
type LabItem = { test: string; status: "Ordered" | "Pending" | "Resulted" };

export default function UnifiedClinicalScreen() {
  const [subjective, setSubjective] = React.useState("");
  const [objective, setObjective] = React.useState("");
  const [assessment, setAssessment] = React.useState("");
  const [plan, setPlan] = React.useState("");

  const [diagnoses, setDiagnoses] = React.useState<string[]>([]);
  const [rx, setRx] = React.useState<RxItem[]>([]);
  const [labs, setLabs] = React.useState<LabItem[]>([]);

  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [allergies, setAllergies] = React.useState("");

  const [prevResults, setPrevResults] = React.useState("");

  const aiAssessment =
    "Likely viral URI; supportive care, fluids, antipyretics; return precautions if worsening.";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-[22px] font-semibold">Clinical Encounter</h1>
      <p className="text-sm text-fg-muted">Unified GoldCare screen with expanded sections.</p>

      <Separator className="my-4" />

      <section aria-labelledby="soap">
        <h2 id="soap" className="text-lg font-semibold mb-4">SOAP Note</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="subjective">Subjective</Label>
            <AutosizeTextarea
              id="subjective"
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="Chief complaint, HPI, ROS..."
              minRows={2}
              className="bg-surface"
            />
          </div>

          <div>
            <Label htmlFor="objective">Objective</Label>
            <AutosizeTextarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Vitals, exam findings..."
              minRows={2}
              className="bg-surface"
            />
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="assessment">Assessment</Label>
              <AutosizeTextarea
                id="assessment"
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Working diagnosis, differential..."
                minRows={2}
                className="bg-surface"
              />
            </div>
            <AIChipClosedSmart
              text={aiAssessment}
              onInsert={() =>
                setAssessment((v) => (v ? `${v} ${aiAssessment}` : aiAssessment))
              }
              onPreview={() => alert(aiAssessment)}
            />
          </div>

          <div>
            <Label htmlFor="plan">Plan</Label>
            <AutosizeTextarea
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Treatment plan, follow-up..."
              minRows={2}
              className="bg-surface"
            />
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      <section aria-labelledby="diagnoses">
        <h2 id="diagnoses" className="text-lg font-semibold mb-4">Diagnoses</h2>
        <DiagnosesEditor value={diagnoses} onChange={setDiagnoses} />
      </section>

      <Separator className="my-4" />

      <section aria-labelledby="rx">
        <h2 id="rx" className="text-lg font-semibold mb-4">Medications (RX)</h2>
        <RxEditor value={rx} onChange={setRx} />
      </section>

      <Separator className="my-4" />

      <section aria-labelledby="labs">
        <h2 id="labs" className="text-lg font-semibold mb-4">Lab Orders</h2>
        <LabsEditor value={labs} onChange={setLabs} />
      </section>

      <Separator className="my-4" />

      <section aria-labelledby="intake">
        <h2 id="intake" className="text-lg font-semibold mb-4">Intake</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">Height</Label>
            <Input id="height" placeholder="in or cm" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input id="weight" placeholder="lb or kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Input id="allergies" placeholder="e.g., penicillin" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      <section aria-labelledby="prev-results">
        <h2 id="prev-results" className="text-lg font-semibold mb-4">Previous Results</h2>
        <AutosizeTextarea
          value={prevResults}
          onChange={(e) => setPrevResults(e.target.value)}
          placeholder="Summarize previous labs/imaging and interpretations..."
          minRows={2}
          className="bg-surface"
        />
      </section>

      <Separator className="my-4" />

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="rounded-full">Encounter: New • 08/25/2025</Badge>
        <div className="flex-1" />
        <Button className="bg-surface border border-border hover:bg-surface-muted">Save Draft</Button>
        <Button className="bg-primary text-on-primary hover:opacity-90">Finalize Note</Button>
      </div>
    </div>
  );
}

function DiagnosesEditor({
  value,
  onChange
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = React.useState("");
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="Add diagnosis (ICD-10 optional)" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Button
          onClick={() => {
            const t = draft.trim();
            if (!t) return;
            onChange([...value, t]);
            setDraft("");
          }}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((d, i) => (
          <Badge key={i} variant="outline" className="rounded-full">
            <span className="truncate max-w-[200px]">{d}</span>
            <button
              className="ml-2 text-fg-muted hover:underline focus-visible:outline-none"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              title="Remove"
              type="button"
            >
              Remove
            </button>
          </Badge>
        ))}
        {value.length === 0 && <p className="text-fg-muted text-sm">No diagnoses.</p>}
      </div>
    </div>
  );
}

function RxEditor({
  value,
  onChange
}: {
  value: RxItem[];
  onChange: (v: RxItem[]) => void;
}) {
  const [drug, setDrug] = React.useState("");
  const [sig, setSig] = React.useState("");
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="md:col-span-2">
          <Label>Medication</Label>
          <Input placeholder="e.g., Amoxicillin 500 mg" value={drug} onChange={(e) => setDrug(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Label>Sig</Label>
          <Input placeholder="1 tab PO BID x 7 days" value={sig} onChange={(e) => setSig(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            const d = drug.trim();
            const s = sig.trim();
            if (!d || !s) return;
            onChange([...value, { drug: d, sig: s }]);
            setDrug("");
            setSig("");
          }}
        >
          Add Medication
        </Button>
      </div>
      <div className="divide-y divide-divider">
        {value.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="min-w-0">
              <div className="font-medium">{r.drug}</div>
              <div className="text-fg-muted text-sm truncate">{r.sig}</div>
            </div>
            <button
              className="text-fg-muted hover:underline focus-visible:outline-none"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
        {value.length === 0 && <p className="py-2 text-fg-muted text-sm">No medications.</p>}
      </div>
    </div>
  );
}

function LabsEditor({
  value,
  onChange
}: {
  value: LabItem[];
  onChange: (v: LabItem[]) => void;
}) {
  const [test, setTest] = React.useState("");
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="md:col-span-3">
          <Label>Test</Label>
          <Input placeholder="e.g., CBC w/ diff" value={test} onChange={(e) => setTest(e.target.value)} />
        </div>
        <div className="md:col-span-1 flex items-end">
          <Button
            onClick={() => {
              const t = test.trim();
              if (!t) return;
              onChange([...value, { test: t, status: "Ordered" }]);
              setTest("");
            }}
          >
            Order
          </Button>
        </div>
      </div>
      <div className="divide-y divide-divider">
        {value.map((l, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="min-w-0">
              <div className="font-medium truncate">{l.test}</div>
              <div className="text-fg-muted text-sm">{l.status}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="text-fg-muted hover:underline focus-visible:outline-none"
                onClick={() => onChange(value.map((it, idx) => (idx === i ? { ...it, status: "Pending" } : it)))}
                type="button"
              >
                Mark Pending
              </button>
              <button
                className="text-fg-muted hover:underline focus-visible:outline-none"
                onClick={() => onChange(value.map((it, idx) => (idx === i ? { ...it, status: "Resulted" } : it)))}
                type="button"
              >
                Mark Resulted
              </button>
              <button
                className="text-fg-muted hover:underline focus-visible:outline-none"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {value.length === 0 && <p className="py-2 text-fg-muted text-sm">No lab orders.</p>}
      </div>
    </div>
  );
}