import * as React from "react";
import { motion } from "framer-motion";
import { Pill, Stethoscope, AlertTriangle, Brain, Search, Syringe, FileWarning, Filter, X, Plus, ChevronRight, History, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

// ————————————————————————————————————————————————————————
// Mock Data
// ————————————————————————————————————————————————————————

type Severity = "minor" | "moderate" | "major";

type DrugProduct = {
  id: string;
  ingredient: string; // generic
  brand?: string;
  route: string;
  form: string;
  strength: string; // display strength
  rxnorm?: string;
  ndc?: string;
  atc?: string;
  hasBlackBox?: boolean;
  commonDoses?: string[];
  indications?: { code: string; label: string; onLabel: boolean }[];
  adverse?: { effect: string; frequency: "very common" | "common" | "uncommon" | "rare" }[];
  classes?: string[]; // e.g., ACE inhibitor, NSAID
};

type InteractionRule = { a: string; b: string; severity: Severity; note: string };

type AllergyRule = { allergen: string; crossClasses: string[]; note: string; alternatives?: string[] };

type ConditionGuide = { condition: string; code: string; classes: { name: string; drugs: string[]; onLabel?: boolean }[] };

const PRODUCTS: DrugProduct[] = [
  {
    id: "DBP-MET-500-ORAL-TAB",
    ingredient: "Metformin",
    route: "oral",
    form: "tablet",
    strength: "500 mg",
    rxnorm: "860975",
    ndc: "00093-1045",
    atc: "A10BA02",
    hasBlackBox: false,
    commonDoses: ["500 mg BID", "500 mg QD", "850 mg BID"],
    indications: [
      { code: "E11", label: "Type 2 diabetes mellitus", onLabel: true },
    ],
    adverse: [
      { effect: "GI upset", frequency: "very common" },
      { effect: "B12 deficiency", frequency: "uncommon" },
      { effect: "Lactic acidosis", frequency: "rare" },
    ],
    classes: ["Biguanide"],
  },
  {
    id: "DBP-AMOX-500-ORAL-CAP",
    ingredient: "Amoxicillin",
    route: "oral",
    form: "capsule",
    strength: "500 mg",
    rxnorm: "318272",
    ndc: "54868-3105",
    atc: "J01CA04",
    hasBlackBox: false,
    commonDoses: ["500 mg TID", "875 mg BID"],
    indications: [
      { code: "H66.9", label: "Otitis media", onLabel: true },
      { code: "J02.9", label: "Pharyngitis", onLabel: true },
    ],
    adverse: [
      { effect: "Rash", frequency: "common" },
      { effect: "Diarrhea", frequency: "common" },
    ],
    classes: ["Penicillin"],
  },
  {
    id: "DBP-LISI-10-ORAL-TAB",
    ingredient: "Lisinopril",
    route: "oral",
    form: "tablet",
    strength: "10 mg",
    rxnorm: "314076",
    ndc: "59762-1301",
    atc: "C09AA03",
    hasBlackBox: false,
    commonDoses: ["10 mg QD", "20 mg QD"],
    indications: [
      { code: "I10", label: "Hypertension", onLabel: true },
      { code: "I50.9", label: "Heart failure", onLabel: true },
    ],
    adverse: [
      { effect: "Cough", frequency: "common" },
      { effect: "Hyperkalemia", frequency: "uncommon" },
      { effect: "Angioedema", frequency: "rare" },
    ],
    classes: ["ACE inhibitor"],
  },
  {
    id: "DBP-METOP-50-ORAL-TAB",
    ingredient: "Metoprolol",
    route: "oral",
    form: "tablet",
    strength: "50 mg",
    rxnorm: "866414",
    ndc: "00078-0423",
    atc: "C07AB02",
    hasBlackBox: false,
    commonDoses: ["50 mg QD", "50 mg BID"],
    indications: [
      { code: "I10", label: "Hypertension", onLabel: true },
      { code: "I20.9", label: "Angina pectoris", onLabel: true },
      { code: "G43.9", label: "Migraine prophylaxis", onLabel: false },
    ],
    adverse: [
      { effect: "Bradycardia", frequency: "common" },
      { effect: "Fatigue", frequency: "common" },
    ],
    classes: ["Beta blocker"],
  },
  {
    id: "DBP-IBU-200-ORAL-TAB",
    ingredient: "Ibuprofen",
    route: "oral",
    form: "tablet",
    strength: "200 mg",
    rxnorm: "310965",
    ndc: "00603-4040",
    atc: "M01AE01",
    hasBlackBox: true,
    commonDoses: ["200 mg Q6H prn", "400 mg Q6H prn"],
    indications: [
      { code: "M79.1", label: "Myalgia", onLabel: true },
    ],
    adverse: [
      { effect: "GI bleed", frequency: "rare" },
      { effect: "Edema", frequency: "uncommon" },
    ],
    classes: ["NSAID"],
  },
  {
    id: "DBP-NAPR-500-ORAL-TAB",
    ingredient: "Naproxen",
    route: "oral",
    form: "tablet",
    strength: "500 mg",
    rxnorm: "198014",
    ndc: "0904-6080",
    atc: "M01AE02",
    hasBlackBox: true,
    commonDoses: ["500 mg BID"],
    indications: [
      { code: "M79.1", label: "Myalgia", onLabel: true },
      { code: "G43.9", label: "Migraine", onLabel: false },
    ],
    adverse: [
      { effect: "GI bleed", frequency: "rare" },
    ],
    classes: ["NSAID"],
  },
  {
    id: "DBP-AZITH-500-ORAL-TAB",
    ingredient: "Azithromycin",
    route: "oral",
    form: "tablet",
    strength: "500 mg",
    rxnorm: "750149",
    ndc: "59762-2318",
    atc: "J01FA10",
    hasBlackBox: false,
    commonDoses: ["500 mg QD x3d", "500 mg day 1, then 250 mg x4d"],
    indications: [
      { code: "J18.9", label: "Pneumonia", onLabel: true },
    ],
    adverse: [
      { effect: "QT prolongation", frequency: "uncommon" },
    ],
    classes: ["Macrolide"],
  },
];

const INTERACTIONS: InteractionRule[] = [
  { a: "Lisinopril", b: "Ibuprofen", severity: "moderate", note: "NSAIDs may diminish antihypertensive effect; risk of renal impairment." },
  { a: "Lisinopril", b: "Naproxen", severity: "moderate", note: "NSAIDs may diminish antihypertensive effect; risk of renal impairment." },
  { a: "Metoprolol", b: "Azithromycin", severity: "minor", note: "Additive bradycardia risk; monitor." },
  { a: "Ibuprofen", b: "Naproxen", severity: "major", note: "Duplicate NSAID therapy increases GI bleed risk." },
];

const ALLERGIES: AllergyRule[] = [
  { allergen: "Penicillin", crossClasses: ["Penicillin", "Cephalosporin"], note: "Cross-reactivity possible; assess severity.", alternatives: ["Macrolide"] },
  { allergen: "Sulfa", crossClasses: ["Sulfonamide"], note: "Check for sulfonamide moieties in diuretics." },
];

const CONDITIONS: ConditionGuide[] = [
  {
    condition: "Type 2 Diabetes Mellitus",
    code: "E11",
    classes: [
      { name: "Biguanide", drugs: ["Metformin"], onLabel: true },
      { name: "GLP-1 RA", drugs: ["Semaglutide"], onLabel: true },
      { name: "SGLT2 inhibitor", drugs: ["Empagliflozin"], onLabel: true },
    ],
  },
  {
    condition: "Hypertension",
    code: "I10",
    classes: [
      { name: "ACE inhibitor", drugs: ["Lisinopril"], onLabel: true },
      { name: "ARB", drugs: ["Losartan"], onLabel: true },
      { name: "Beta blocker", drugs: ["Metoprolol"], onLabel: true },
    ],
  },
  {
    condition: "Migraine",
    code: "G43.9",
    classes: [
      { name: "Triptan", drugs: ["Sumatriptan"], onLabel: true },
      { name: "Beta blocker", drugs: ["Metoprolol"], onLabel: false },
      { name: "Anticonvulsant", drugs: ["Topiramate"], onLabel: true },
    ],
  },
];

const PATIENT_ALLERGIES = ["Penicillin", "Sulfa"];

const PATIENT_CURRENT_MEDS: DrugProduct[] = [
  PRODUCTS.find(p => p.ingredient === "Lisinopril")!,
  PRODUCTS.find(p => p.ingredient === "Metformin")!,
];

// ————————————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————————————

function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }

function normalizeText(x: string) {
  return x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function searchProducts(query: string) {
  const q = normalizeText(query);
  if (!q) return [] as DrugProduct[];
  return PRODUCTS.filter(p => normalizeText(p.ingredient).includes(q) || normalizeText(p.brand || "").includes(q));
}

function routesFor(ingredient: string) {
  return uniq(PRODUCTS.filter(p => p.ingredient === ingredient).map(p => p.route));
}

function formsFor(ingredient: string, route: string) {
  return uniq(PRODUCTS.filter(p => p.ingredient === ingredient && p.route === route).map(p => p.form));
}

function strengthsFor(ingredient: string, route: string, form: string) {
  return uniq(PRODUCTS.filter(p => p.ingredient === ingredient && p.route === route && p.form === form).map(p => p.strength));
}

function productByConcept(ingredient: string, route: string, form: string, strength: string) {
  return PRODUCTS.find(p => p.ingredient === ingredient && p.route === route && p.form === form && p.strength === strength);
}

function computeInteractions(list: DrugProduct[]): InteractionRule[] {
  const names = list.map(m => m.ingredient);
  const hits: InteractionRule[] = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i], b = names[j];
      const match = INTERACTIONS.find(r => (r.a === a && r.b === b) || (r.a === b && r.b === a));
      if (match) hits.push(match);
    }
  }
  const order: Severity[] = ["major", "moderate", "minor"];
  return hits.sort((x, y) => order.indexOf(x.severity) - order.indexOf(y.severity));
}

function allergyAlerts(drug: DrugProduct | null) {
  if (!drug) return [] as { allergen: string; note: string; alternatives?: string[] }[];
  const classes = drug.classes || [];
  const alerts = ALLERGIES.filter(rule => rule.crossClasses.some(c => classes.includes(c)))
    .map(rule => ({ allergen: rule.allergen, note: rule.note, alternatives: rule.alternatives }));
  return alerts;
}

function findAlternatives(conditionCode?: string, avoidClasses: string[] = []) {
  if (!conditionCode) return [] as string[];
  const guide = CONDITIONS.find(c => c.code === conditionCode);
  if (!guide) return [] as string[];
  const options = guide.classes
    .filter(c => !avoidClasses.includes(c.name))
    .flatMap(c => c.drugs);
  return uniq(options);
}

function duplicateTherapy(list: DrugProduct[]) {
  const byClass = new Map<string, DrugProduct[]>();
  list.forEach(m => (m.classes || []).forEach(c => {
    const cur = byClass.get(c) || [];
    byClass.set(c, [...cur, m]);
  }));
  const dups: { cls: string; items: DrugProduct[] }[] = [];
  byClass.forEach((items, cls) => { if (items.length > 1) dups.push({ cls, items }); });
  return dups;
}

// ————————————————————————————————————————————————————————
// UI Primitives
// ————————————————————————————————————————————————————————

function SectionTitle({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-fg-muted">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </div>
  );
}

function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-primary text-on-primary" : "bg-surface hover:bg-surface-muted"}`}>
      {children}
    </button>
  );
}

function SeverityBadge({ level }: { level: Severity }) {
  const map: Record<Severity, { label: string }> = {
    minor: { label: "Minor" },
    moderate: { label: "Moderate" },
    major: { label: "Major" },
  };
  return <Badge variant={level === "major" ? "destructive" : level === "moderate" ? "secondary" : "outline"}>{map[level].label}</Badge>;
}

// ————————————————————————————————————————————————————————
// Main Component
// ————————————————————————————————————————————————————————

interface MedicationWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MedicationWorkspace({ isOpen, onClose }: MedicationWorkspaceProps) {
  // Patient & workspace state
  const [currentMeds, setCurrentMeds] = React.useState<DrugProduct[]>(PATIENT_CURRENT_MEDS);
  const [pending, setPending] = React.useState<DrugProduct[]>([]);
  const [selected, setSelected] = React.useState<DrugProduct | null>(null);
  const [condition, setCondition] = React.useState("");

  // Guided search state
  const [q, setQ] = React.useState("");
  const [pickedIngredient, setPickedIngredient] = React.useState("");
  const [pickedRoute, setPickedRoute] = React.useState("");
  const [pickedForm, setPickedForm] = React.useState("");
  const [pickedStrength, setPickedStrength] = React.useState("");

  const results = React.useMemo(() => searchProducts(q), [q]);
  const routes = React.useMemo(() => pickedIngredient ? routesFor(pickedIngredient) : [], [pickedIngredient]);
  const forms = React.useMemo(() => pickedIngredient && pickedRoute ? formsFor(pickedIngredient, pickedRoute) : [], [pickedIngredient, pickedRoute]);
  const strengths = React.useMemo(() => pickedIngredient && pickedRoute && pickedForm ? strengthsFor(pickedIngredient, pickedRoute, pickedForm) : [], [pickedIngredient, pickedRoute, pickedForm]);

  const selectedConcept = React.useMemo(() => pickedIngredient && pickedRoute && pickedForm && pickedStrength ? productByConcept(pickedIngredient, pickedRoute, pickedForm, pickedStrength) : null, [pickedIngredient, pickedRoute, pickedForm, pickedStrength]);

  const allForSafety = React.useMemo(() => uniq([...currentMeds, ...pending]), [currentMeds, pending]);
  const ddi = React.useMemo(() => computeInteractions(allForSafety), [allForSafety]);
  const dupes = React.useMemo(() => duplicateTherapy(allForSafety), [allForSafety]);

  function addToPending(p: DrugProduct | null) {
    if (!p) return;
    setPending(prev => uniq([...prev, p]));
    setSelected(p);
  }

  function clearGuided() {
    setPickedIngredient("");
    setPickedRoute("");
    setPickedForm("");
    setPickedStrength("");
  }

  function quickDose(dose: string) {
    // Attach a sig to the selected item label in pending, purely for display
    if (!selected) return;
    setPending(prev => prev.map(m => m.id === selected.id ? { ...m, strength: `${selected.strength} • ${dose}` } : m));
  }

  function importIntake(lines: string[]) {
    const guesses = lines
      .map(l => PRODUCTS.find(p => normalizeText(p.ingredient).includes(normalizeText(l)) || normalizeText(l).includes(normalizeText(p.ingredient))))
      .filter(Boolean) as DrugProduct[];
    setCurrentMeds(prev => uniq([...prev, ...guesses]));
  }

  const altFromAllergy = React.useMemo(() => {
    if (!selected) return [] as string[];
    const alerts = allergyAlerts(selected);
    const avoid = selected.classes || [];
    const code = selected.indications?.[0]?.code;
    const alts = alerts.flatMap(a => findAlternatives(code, avoid));
    return uniq(alts);
  }, [selected]);

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <div className="h-full bg-bg text-fg flex flex-col">
        <header className="sticky top-0 z-20 border-b bg-bg/80 backdrop-blur px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Medication Workspace</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Patient Summary */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Patient</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="flex items-center justify-between"><span>Jane Doe · 58 F</span><Badge variant="outline">MRN 123456</Badge></div>
                  <div className="space-y-1">
                    <SectionTitle icon={Syringe}>Allergies</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                      {PATIENT_ALLERGIES.map(a => (<Badge key={a} variant="destructive">{a}</Badge>))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <SectionTitle icon={Pill}>Current Meds</SectionTitle>
                    <ul className="space-y-2">
                      {currentMeds.map(m => (
                        <li key={m.id} className="flex items-center justify-between">
                          <span className="truncate">{m.ingredient} {m.strength} {m.form}</span>
                          <Button variant="ghost" size="icon" onClick={() => setCurrentMeds(prev => prev.filter(x => x.id !== m.id))}><X className="h-4 w-4" /></Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Smarter Drug Search */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4" /> Smarter Drug Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Step 1: Query */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="q">Search by name</Label>
                      <div className="flex gap-2 mt-1">
                        <Input id="q" placeholder="e.g., metformin, amox, ibup..." value={q} onChange={e => { setQ(e.target.value); }} />
                        <Button variant="secondary" size="sm" onClick={() => setQ("")}>Clear</Button>
                      </div>
                      {q && (
                        <ScrollArea className="mt-2 h-28 rounded-md border">
                          <ul className="text-sm p-2 space-y-1">
                            {results.map(r => (
                              <li key={r.id}>
                                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setPickedIngredient(r.ingredient); setPickedRoute(""); setPickedForm(""); setPickedStrength(""); }}>
                                  {r.ingredient}
                                </Button>
                              </li>
                            ))}
                            {results.length === 0 && <li className="text-fg-muted p-2">No matches</li>}
                          </ul>
                        </ScrollArea>
                      )}
                    </div>

                    {/* Step 2: Route */}
                    <div>
                      <Label>Route</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {routes.map(r => (
                          <Chip key={r} active={pickedRoute === r} onClick={() => { setPickedRoute(r); setPickedForm(""); setPickedStrength(""); }}>{r}</Chip>
                        ))}
                        {pickedIngredient && routes.length === 0 && <span className="text-sm text-fg-muted">No routes available</span>}
                      </div>
                    </div>

                    {/* Step 3: Form */}
                    <div>
                      <Label>Form</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {forms.map(f => (
                          <Chip key={f} active={pickedForm === f} onClick={() => { setPickedForm(f); setPickedStrength(""); }}>{f}</Chip>
                        ))}
                        {pickedRoute && forms.length === 0 && <span className="text-sm text-fg-muted">No forms available</span>}
                      </div>
                    </div>

                    {/* Step 4: Strength */}
                    <div>
                      <Label>Strength</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {strengths.map(s => (
                          <Chip key={s} active={pickedStrength === s} onClick={() => setPickedStrength(s)}>{s}</Chip>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" disabled={!selectedConcept} onClick={() => { addToPending(selectedConcept); clearGuided(); }}>Add to pending</Button>
                    {selectedConcept && (
                      <div className="text-xs text-fg-muted">Selected: {selectedConcept.ingredient} {selectedConcept.strength} {selectedConcept.form}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contextual Prescribing */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4" /> Contextual Prescribing</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Selected</Label>
                    <div className="text-sm border rounded-lg p-3 min-h-[40px] flex items-center justify-between">
                      <span>{selected ? `${selected.ingredient} ${selected.strength} ${selected.form}` : "Nothing selected"}</span>
                      {selected && <Badge variant="outline" className="font-mono text-xs">{selected.id}</Badge>}
                    </div>
                    {selected?.hasBlackBox && (
                      <div className="flex items-start gap-2 rounded-lg border bg-surface-muted p-3 text-fg">
                        <FileWarning className="h-4 w-4 mt-[2px]" />
                        <div>
                          <div className="font-medium">Boxed Warning</div>
                          <div className="text-xs">This drug carries a boxed warning. Review label before prescribing.</div>
                        </div>
                      </div>
                    )}
                    <div>
                      <Label>Common doses</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(selected?.commonDoses || []).map(d => (
                          <Chip key={d} onClick={() => quickDose(d)}>{d}</Chip>
                        ))}
                        {selected && (selected.commonDoses || []).length === 0 && <span className="text-sm text-fg-muted">No common dose presets</span>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Pending Order</Label>
                    <div className="border rounded-lg p-2">
                      {pending.length === 0 && <div className="text-sm text-fg-muted p-2">Add a product to begin…</div>}
                      <ul className="divide-y">
                        {pending.map(m => (
                          <li key={m.id} className="flex items-center justify-between p-2">
                            <div className="text-sm">
                              <div className="font-medium">{m.ingredient}</div>
                              <div className="text-fg-muted">{m.strength} {m.form} · {m.route}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="secondary" onClick={() => setSelected(m)}>Edit</Button>
                              <Button size="icon" variant="ghost" onClick={() => setPending(prev => prev.filter(x => x.id !== m.id))}><X className="h-4 w-4" /></Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={pending.length === 0} onClick={() => { setCurrentMeds(prev => uniq([...prev, ...pending])); setPending([]); }}>Sign & add to meds</Button>
                      <Button size="sm" variant="outline" disabled={pending.length === 0} onClick={() => setPending([])}>Clear</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Drug-Drug Interactions */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Interactions</CardTitle></CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 pr-2">
                    <ul className="space-y-3">
                      {ddi.length === 0 && <li className="text-sm text-fg-muted">No known interactions</li>}
                      {ddi.map((r, idx) => (
                        <li key={idx} className="text-sm">
                          <div className="flex items-center justify-between"><SeverityBadge level={r.severity} /><span className="text-fg-muted">{r.a} + {r.b}</span></div>
                          <div className="text-fg-muted text-xs mt-1">{r.note}</div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Allergy & Cross-Sensitivity */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Syringe className="h-4 w-4" /> Allergy & Cross-Sensitivity</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {selected ? (
                    <>
                      {allergyAlerts(selected).length === 0 ? (
                        <div className="text-sm text-fg-muted">No allergy conflicts for current selection</div>
                      ) : (
                        <ul className="space-y-2 text-sm">
                          {allergyAlerts(selected).map((a, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-medical-amber mt-[2px]" />
                              <div>
                                <div className="font-medium">{a.allergen} risk</div>
                                <div className="text-fg-muted text-xs">{a.note}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      {altFromAllergy.length > 0 && (
                        <div className="pt-2">
                          <Label>Alternatives</Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {altFromAllergy.map(name => (
                              <Button key={name} size="sm" variant="secondary" onClick={() => {
                                const alt = PRODUCTS.find(p => p.ingredient === name);
                                if (alt) { setSelected(alt); addToPending(alt); }
                              }}>{name}</Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-fg-muted">Select a drug to check allergy/cross-sensitivity</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Assistant */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4" /> AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AIChat selected={selected} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

// ————————————————————————————————————————————————————————
// Subcomponents
// ————————————————————————————————————————————————————————

function Intake({ onImport }: { onImport: (lines: string[]) => void }) {
  const [text, setText] = React.useState("Metformin 500\nibuprofen 200\nnaproxen 500");
  return (
    <div className="space-y-2">
      <Label htmlFor="intake">Patient-entered meds</Label>
      <textarea id="intake" className="w-full h-28 border rounded-lg p-2 text-sm" value={text} onChange={e => setText(e.target.value)} />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => onImport(text.split(/\n+/).filter(Boolean))}><Plus className="h-4 w-4 mr-1" /> Import & normalize</Button>
      </div>
    </div>
  );
}

function AIChat({ selected }: { selected: DrugProduct | null }) {
  const [history, setHistory] = React.useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Ask about contraindications, MOA, dosing, or label warnings. This is a mock assistant." },
  ]);
  const [input, setInput] = React.useState("");
  function respond(q: string) {
    const qn = normalizeText(q);
    let a = "I can summarize mechanisms, contraindications, and warnings from the integrated label. (Demo)";
    if (qn.includes("contraindication") && selected) a = `${selected.ingredient}: pregnancy (risk varies), hypersensitivity to ${selected.ingredient}. Monitor renal/hepatic function as applicable. (Mock)`;
    if (qn.includes("mechanism") && selected) a = `${selected.ingredient}: mechanism overview — see class ${selected.classes?.[0] || ""}. (Mock)`;
    if (qn.includes("dose") && selected) a = `Common doses for ${selected.ingredient}: ${(selected.commonDoses || []).join(", ") || "varies"}. (Mock)`;
    setHistory(h => [...h, { role: "assistant", text: a }]);
  }
  return (
    <div className="flex flex-col gap-2">
      <ScrollArea className="h-32 border rounded-lg p-2">
        <div className="space-y-2 text-sm">
          {history.map((m, i) => (
            <div key={i} className={m.role === "assistant" ? "" : "text-right"}>
              <div className={`inline-block rounded-lg px-3 py-2 ${m.role === "assistant" ? "bg-surface-muted" : "bg-primary text-on-primary"}`}>{m.text}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input size={30} placeholder="e.g., contraindications of this drug" value={input} onChange={e => setInput(e.target.value)} />
        <Button size="sm" onClick={() => { if (!input) return; setHistory(h => [...h, { role: "user", text: input }]); respond(input); setInput(""); }}>Send</Button>
      </div>
    </div>
  );
}