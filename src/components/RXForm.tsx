import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import { copy } from "@/copy/en";

type Frequency = {
  label: string;
  perDay: number;
  value: string;
};

const FREQUENCIES: Frequency[] = [
  { label: "Once daily", perDay: 1, value: "qd" },
  { label: "Every 12 hours", perDay: 2, value: "q12h" },
  { label: "Every 8 hours", perDay: 3, value: "q8h" },
  { label: "Every 6 hours", perDay: 4, value: "q6h" },
  { label: "Every other day", perDay: 0.5, value: "qod" }
];

const FORMULATIONS = ["Tablet", "Capsule", "Liquid", "ODT"];
const ROUTES = ["Oral", "IM", "IV"];
const QTY_UNITS = ["Tablet", "Capsule", "mL"];
const DURATION_UNITS = ["Days", "Weeks"];

export default function RXForm() {
  // Core fields
  const [medicine, setMedicine] = React.useState("Amoxicillin-pot clavulanate | 875-125 mg tablet");
  const [formulation, setFormulation] = React.useState("Tablet");
  const [route, setRoute] = React.useState("Oral");
  const [quantityPerDose, setQuantityPerDose] = React.useState<number>(1);
  const [frequency, setFrequency] = React.useState<Frequency>(FREQUENCIES[1]); // Every 12 hours
  const [duration, setDuration] = React.useState<number>(10);
  const [durationUnit, setDurationUnit] = React.useState<string>("Days");
  const [totalQty, setTotalQty] = React.useState<number>(20);
  const [totalQtyUnit, setTotalQtyUnit] = React.useState<string>("Tablet");
  const [refills, setRefills] = React.useState<number>(0);
  const [action, setAction] = React.useState("Take");
  const [isPRN, setIsPRN] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const [subsAllowed, setSubsAllowed] = React.useState(true);
  const [startDate, setStartDate] = React.useState<string>("2025-08-19");
  const [earliestFill, setEarliestFill] = React.useState<string>("2025-08-29");
  const [notesPatient, setNotesPatient] = React.useState<string>("");
  const [notesPharmacy, setNotesPharmacy] = React.useState<string>("Patient has a history of hepatic dysfunction/liver problems");

  // Derived: administrations per day
  const perDay = React.useMemo(() => frequency.perDay, [frequency]);

  // Auto-calc total quantity whenever inputs change
  React.useEffect(() => {
    const days = durationUnit === "Weeks" ? duration * 7 : duration;
    const calc = Math.ceil((quantityPerDose || 0) * (perDay || 0) * (days || 0));
    if (Number.isFinite(calc)) setTotalQty(calc);
  }, [quantityPerDose, perDay, duration, durationUnit]);

  // AI suggestions (chips)
  const chipTherapy =
    "For acute sinusitis/otitis, consider amoxicillin–clavulanate 875/125 mg PO q12h for 5–10 days; no beta-lactam allergy on file.";
  const chipSafety =
    "Avoid if history of anaphylaxis to penicillins; use doxycycline/azithromycin as alternatives. Take with food to reduce GI upset.";
  const chipDose =
    "Dose suggestion: 875/125 mg every 12 hours. Renal adjust: CrCl < 30 → 500/125 mg q12–24h.";
  const chipQty =
    "Total Qty 20 tablets for 1 tab BID x 10 days. Use 14 for 7 days.";
  const chipRefills = "Acute infection: 0 refills.";
  const chipInstructions =
    "Take with food. Stop and seek care for rash or breathing difficulty. Consider probiotic to reduce diarrhea. Recheck if not improved in 48–72h.";

  // Insert handlers
  const insertTherapy = () => {
    setMedicine("Amoxicillin-pot clavulanate | 875-125 mg tablet");
    setFormulation("Tablet");
    setRoute("Oral");
    setQuantityPerDose(1);
    setFrequency(FREQUENCIES[1]); // q12h
    setDuration(10);
    setDurationUnit("Days");
    setRefills(0);
    setTotalQtyUnit("Tablet");
  };

  const insertDose = () => {
    setQuantityPerDose(1);
    setFrequency(FREQUENCIES[1]);
  };

  const insertQty = () => {
    setDuration(10);
    setDurationUnit("Days");
    setQuantityPerDose(1);
    setFrequency(FREQUENCIES[1]);
    // total qty will auto-calc
  };

  const insertRefills = () => setRefills(0);

  const insertInstructions = () => {
    setNotesPatient((v) =>
      dedupeLines(v, [
        "Take with food.",
        "Report rash, swelling, or breathing difficulty immediately.",
        "If no improvement in 48–72 hours, contact clinic."
      ])
    );
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">ADD ORDER #1</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">{copy.createRefill}</Button>
          <Button variant="outline">{copy.edit}</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label htmlFor="medicine">{copy.medicineName}</Label>
          <Input
            id="medicine"
            placeholder={copy.medicineNamePlaceholder}
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
          />
        </div>

        {/* GoldCare AI chips */}
        <div className="space-y-2">
          <AIChipClosedSmart
            text={chipTherapy}
            onInsert={insertTherapy}
            onPreview={() => window.alert(chipTherapy)}
          />
          <AIChipClosedSmart
            text={chipSafety}
            onInsert={() => window.alert("Safety acknowledged")}
            onPreview={() => window.alert(chipSafety)}
          />
          <AIChipClosedSmart
            text={chipDose}
            onInsert={insertDose}
            onPreview={() => window.alert(chipDose)}
          />
          <AIChipClosedSmart
            text={chipQty}
            onInsert={insertQty}
            onPreview={() => window.alert(chipQty)}
          />
          <AIChipClosedSmart
            text={chipRefills}
            onInsert={insertRefills}
            onPreview={() => window.alert(chipRefills)}
          />
          <AIChipClosedSmart
            text={chipInstructions}
            onInsert={insertInstructions}
            onPreview={() => window.alert(chipInstructions)}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Quantity per dose */}
        <div className="md:col-span-3">
          <Label htmlFor="qty">{copy.quantity}</Label>
          <Input
            id="qty"
            type="number"
            min={0}
            value={Number.isFinite(quantityPerDose) ? quantityPerDose : 0}
            onChange={(e) => setQuantityPerDose(Number(e.target.value))}
          />
        </div>

        {/* Formulation */}
        <div className="md:col-span-3">
          <Label>{copy.formulation}</Label>
          <Select value={formulation} onChange={setFormulation} options={FORMULATIONS} />
        </div>

        {/* Route */}
        <div className="md:col-span-3">
          <Label>{copy.route}</Label>
          <Select value={route} onChange={setRoute} options={ROUTES} />
        </div>

        {/* Frequency */}
        <div className="md:col-span-3">
          <Label>{copy.frequency}</Label>
          <Select
            value={frequency.label}
            onChange={(label) => {
              const f = FREQUENCIES.find((x) => x.label === label) ?? FREQUENCIES[0];
              setFrequency(f);
            }}
            options={FREQUENCIES.map((f) => f.label)}
          />
        </div>

        {/* Duration */}
        <div className="md:col-span-3">
          <Label htmlFor="duration">{copy.duration}</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-3">
          <Label>{copy.unit}</Label>
          <Select value={durationUnit} onChange={setDurationUnit} options={DURATION_UNITS} />
        </div>

        {/* Total Qty */}
        <div className="md:col-span-3">
          <Label htmlFor="tqty">{copy.totalQty}</Label>
          <Input id="tqty" type="number" value={totalQty} readOnly />
        </div>
        <div className="md:col-span-3">
          <Label>{copy.unit}</Label>
          <Select value={totalQtyUnit} onChange={setTotalQtyUnit} options={QTY_UNITS} />
        </div>

        {/* Refills */}
        <div className="md:col-span-3">
          <Label htmlFor="refills">{copy.refills}</Label>
          <Input
            id="refills"
            type="number"
            min={0}
            value={refills}
            onChange={(e) => setRefills(Number(e.target.value))}
          />
        </div>

        {/* Action */}
        <div className="md:col-span-3">
          <Label htmlFor="action">{copy.action}</Label>
          <Input id="action" value={action} onChange={(e) => setAction(e.target.value)} />
        </div>

        {/* PRN */}
        <div className="md:col-span-3 flex items-end gap-2">
          <input
            id="prn"
            type="checkbox"
            className="h-4 w-4"
            checked={isPRN}
            onChange={(e) => setIsPRN(e.target.checked)}
          />
          <Label htmlFor="prn" className="mb-0">{copy.prnAsNeeded}</Label>
        </div>

        {/* Location */}
        <div className="md:col-span-3">
          <Label htmlFor="location">{copy.location}</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        {/* Substitutions */}
        <div className="md:col-span-3">
          <Label>{copy.substitutions}</Label>
          <Select
            value={subsAllowed ? copy.substitutionsAllowed : copy.noSubstitutions}
            onChange={(v) => setSubsAllowed(v === copy.substitutionsAllowed)}
            options={[copy.substitutionsAllowed, copy.noSubstitutions]}
          />
        </div>

        {/* Dates */}
        <div className="md:col-span-3">
          <Label htmlFor="startDate">{copy.startDate}</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Label htmlFor="earliestFill">{copy.earliestFillDate}</Label>
          <Input id="earliestFill" type="date" value={earliestFill} onChange={(e) => setEarliestFill(e.target.value)} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{copy.notesToPatient}</Label>
          <AutosizeTextarea
            minRows={2}
            placeholder={copy.patientNotesPlaceholder}
            value={notesPatient}
            onChange={(e) => setNotesPatient(e.target.value)}
          />
        </div>
        <div>
          <Label>{copy.notesToPharmacy}</Label>
          <AutosizeTextarea
            minRows={2}
            placeholder={copy.pharmacyNotesPlaceholder}
            value={notesPharmacy}
            onChange={(e) => setNotesPharmacy(e.target.value)}
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-md border border-border bg-surface p-4">
        <div className="font-medium mb-1">{copy.orderSummary}</div>
        <div className="text-sm text-fg-muted">
          {renderSummary({
            action,
            quantityPerDose,
            formulation,
            route,
            frequency: frequency.label,
            duration,
            durationUnit,
            totalQty,
            totalQtyUnit,
            refills,
            medicine,
            startDate,
            earliestFill,
            isPRN,
            subsAllowed
          })}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Pharmacy selector (mock) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChoiceCard label={copy.partellSpecialty} sub={copy.freedom} />
        <ChoiceCard label={copy.walgreens} sub={copy.nearby} />
        <ChoiceCard label={copy.chooseOtherPharmacy} />
        <ChoiceCard label={copy.sendToManager} />
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline">{copy.cancel}</Button>
        <Button className="bg-primary text-on-primary">{copy.save}</Button>
      </div>
    </div>
  );
}

/* ---------- Small helpers ---------- */

function Select({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      className={cn(
        "w-full h-9 px-3 rounded-md bg-surface border border-border",
        "text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
}

function ChoiceCard({ label, sub }: { label: string; sub?: string }) {
  const [selected, setSelected] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setSelected((s) => !s)}
      className={cn(
        "w-full text-left rounded-md border p-4 transition",
        selected ? "border-primary ring-2 ring-primary" : "border-border bg-surface"
      )}
    >
      <div className="font-medium">{label}</div>
      {sub ? <div className="text-sm text-fg-muted">{sub}</div> : null}
    </button>
  );
}

function renderSummary(args: {
  action: string;
  quantityPerDose: number;
  formulation: string;
  route: string;
  frequency: string;
  duration: number;
  durationUnit: string;
  totalQty: number;
  totalQtyUnit: string;
  refills: number;
  medicine: string;
  startDate: string;
  earliestFill: string;
  isPRN: boolean;
  subsAllowed: boolean;
}) {
  const parts = [
    `Prescribed ${args.medicine}`,
    `${capitalize(args.action)} ${args.quantityPerDose} ${args.formulation.toLowerCase()} ( ${args.route.toLowerCase()} ) ${args.frequency.toLowerCase()}`,
    `for ${args.duration} ${args.durationUnit.toLowerCase()}`,
    `Total Qty: ${args.totalQty} ${args.totalQtyUnit.toLowerCase()}`,
    `Refills: ${args.refills}`,
    args.isPRN ? "PRN" : null,
    args.subsAllowed ? "Substitutions allowed" : "No substitutions",
    `Start: ${formatISO(args.startDate)}; Earliest fill: ${formatISO(args.earliestFill)}`
  ].filter(Boolean);
  return parts.join("; ");
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function formatISO(date: string) {
  return date ? date : "—";
}

function dedupeLines(existing: string, lines: string[]) {
  const set = new Set(
    existing
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
  );
  for (const l of lines) set.add(l);
  return Array.from(set).join("\n");
}