import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useRef, useEffect } from "react";
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  FlaskConical, 
  Activity,
  User,
  Save
} from "lucide-react";
import { RXForm } from "@/components/RXForm";

interface MainContentProps {
  activeSection: string;
}

export function MainContent({ activeSection }: MainContentProps) {
  const renderSection = () => {
    switch (activeSection) {
      case "soap":
        return <SOAPNoteSection />;
      case "rx":
        return <RXSection />;
      case "lab-orders":
        return <LabOrdersSection />;
      case "intake":
        return <IntakeFormSection />;
      case "diagnoses":
        return <DiagnosesSection />;
      case "previous-results":
        return <PreviousResultsSection />;
      default:
        return <SOAPNoteSection />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        {renderSection()}
      </div>
    </main>
  );
}

function SOAPNoteSection() {
  // --- Helper: shared AI suggestion card (kept your look-and-feel) ---
  const AIsuggestion = ({
    text,
    onInsert,
    onDismiss,
  }: { text: string; onInsert: () => void; onDismiss: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      const checkOverflow = () => {
        if (textRef.current) {
          setHasOverflow(textRef.current.scrollHeight > textRef.current.clientHeight);
        }
      };
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }, [text, isExpanded]);

    return (
      <div className="mt-3 p-4 rounded-lg bg-surface shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {/* same icon */}
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 16 16">
                <g clipPath="url(#clip0_1036_3138)">
                  <path d="M13 9c.001 0 0 .204-.177.57a1.02 1.02 0 0 1-.474.364l-3.224 1.19-1.188 3.226a1.5 1.5 0 0 1-2.5.472L4.875 11.125l-3.226-1.188A1 1 0 0 1 1 9.004c0-.204.062-.402.178-.57A1.02 1.02 0 0 1 1.65 8.07l3.225-1.195 1.188-3.226a1.5 1.5 0 0 1 2.5-.472l1.225 3.226 3.226 1.188c.192.07.358.197.474.365.117.167.178.367.178.59ZM9.5 3h1V1.5a.5.5 0 0 1 1 0V3h1.5a.5.5 0 0 1 0 1H11.5v1.5a.5.5 0 1 1-1 0V4H9.5a.5.5 0 0 1 0-1Z"/>
                </g>
                <defs><clipPath id="clip0_1036_3138"><rect width="16" height="16" fill="white"/></clipPath></defs>
              </svg>
            </div>
            <span className="text-sm font-semibold text-fg">GoldCare AI</span>
            <span className="text-xs text-fg-muted">Suggestion</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onInsert}
              className="text-sm font-medium text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Insert above
            </button>
            <button type="button" onClick={onDismiss}
              className="text-sm font-medium text-fg underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Dismiss
            </button>
          </div>
        </div>

        <div className="relative">
          <p ref={textRef} className={`text-sm text-fg leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
            {text}
          </p>
          {hasOverflow && (
            <button type="button" onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    );
  };

  // --- local state for height/weight → BMI demo calc (keeps your style) ---
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [weightLbs, setWeightLbs] = useState<string>("");
  const heightMeters =
    (Number(heightFt || 0) * 12 + Number(heightIn || 0)) * 0.0254;
  const weightKg = Number(weightLbs || 0) * 0.453592;
  const bmi = heightMeters > 0 ? (weightKg / (heightMeters * heightMeters)).toFixed(1) : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-fg">
            <FileText className="h-6 w-6 text-medical-blue" />
            SOAP Note
          </h1>
          <p className="text-fg-muted">Document subjective, objective, assessment, and plan</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-medical-blue-light text-medical-blue">
            <Clock className="h-3 w-3 mr-1" />
            Auto-saved 2 min ago
          </Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* ========== Subjective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Subjective</h3>
          <div className="space-y-6">
            {/* CC/HPI */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chief Complaint / History of Present Illness
              </label>
              <textarea
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter patient’s reported concerns, symptom history, and relevant context."
              />
              <AIsuggestion
                text="Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol. Notes increased stress at work and poor sleep quality. No prior hospitalizations. Family history includes early coronary artery disease."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Medications</label>
              <SearchSelectPills placeholder="List all current prescription medications with dosage and frequency." />
              <AIsuggestion
                text="Lisinopril 10 mg once daily • Atorvastatin 20 mg once nightly • Albuterol inhaler PRN, ~2 times per week"
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            {/* Supplements & OTC */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Supplements & OTC</label>
              <SearchSelectPills placeholder="List all supplements, vitamins, or over-the-counter products with dosage and frequency." />
              <AIsuggestion
                text="Vitamin D3 2000 IU daily • Magnesium glycinate 400 mg nightly • Ibuprofen 200 mg PRN for headaches"
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Allergies</label>
              <SearchSelectPills placeholder="Document drug, food, or environmental allergies and reactions. If none, enter NKDA." />
              <AIsuggestion
                text="Penicillin — rash • No food or environmental allergies reported"
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>
          </div>
        </section>

        {/* ========== Objective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Objective</h3>

          {/* Measurements */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Waist (inches)</label>
                  <input type="number" className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="e.g., 34" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hip (inches)</label>
                  <input type="number" className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="e.g., 40" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Height (ft)</label>
                  <input type="number" value={heightFt} onChange={e=>setHeightFt(e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (in)</label>
                  <input type="number" value={heightIn} onChange={e=>setHeightIn(e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="7" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
                  <input type="number" value={weightLbs} onChange={e=>setWeightLbs(e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="178" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">BMI (auto)</label>
                <input disabled value={bmi} placeholder="—"
                  className="w-full p-3 border border-border rounded-md bg-muted text-fg-muted" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Blood Pressure</label>
                  <input type="text" placeholder="120/80"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pulse (bpm)</label>
                  <input type="number" placeholder="72"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Respiratory Rate</label>
                  <input type="number" placeholder="16"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature (°F)</label>
                  <input type="number" step="0.1" placeholder="98.6"
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">Clinical Observations</label>
            <textarea
              className="w-full h-28 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Summarize physical exam and general appearance."
            />
            <AIsuggestion
              text="Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted. No edema in extremities."
              onInsert={() => {}}
              onDismiss={() => {}}
            />
          </div>
        </section>

        {/* ========== Assessment ========== */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Assessment</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assessment / Problem List</label>
              <textarea
                className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Summarize the key clinical issues under consideration."
              />
              <AIsuggestion
                text="Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Differential Diagnosis</label>
              <textarea
                className="w-full h-20 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter possible alternate explanations."
              />
              <AIsuggestion
                text="Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness"
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>
          </div>
        </section>

        {/* ========== Plan ========== */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Plan</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Plan / Patient Instructions</label>
              <textarea
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter diagnostic tests, prescriptions, lifestyle guidance, and follow-up instructions."
              />
              <AIsuggestion
                text="1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Encourage Mediterranean diet, daily walking, and stress-reduction practices. 5) Follow-up in 6 weeks with lab results."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Acute Diagnosis</label>
              <SearchSelectPills placeholder="Enter confirmed diagnosis with ICD-10 codes." />
              <AIsuggestion
                text="I10 — Essential hypertension • E78.5 — Hyperlipidemia, unspecified"
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Comorbidities / Contributing Conditions</label>
              <SearchSelectPills placeholder="Document chronic or contributing factors." />
              <AIsuggestion
                text="Overweight • Family history of premature CAD • Poor sleep hygiene"
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- tiny helpers (keep your visual style) ---------- */
function SearchSelectPills({ placeholder }: { placeholder: string }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const addItem = () => {
    const clean = query.trim();
    if (!clean) return;
    setItems((prev) => [...prev, clean]);
    setQuery("");
  };
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          className="flex-1 p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" onClick={addItem}>Add</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {items.map((it, idx) => (
            <Tag key={idx} text={it} onRemove={() => setItems(items.filter((_, i) => i !== idx))} />
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <span className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full inline-flex items-center gap-2">
      {text}
      <button onClick={onRemove} className="text-fg-muted hover:text-fg focus-visible:outline-none">×</button>
    </span>
  );
}


function RXSection() {
  return <RXForm />;
}

function LabOrdersSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-medical-blue" />
            Lab Orders
            <Badge className="ml-2">2 Pending</Badge>
          </h1>
          <p className="text-muted-foreground">Laboratory tests and orders</p>
        </div>
        <Button>Order New Lab</Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Complete Blood Count (CBC)
              <Badge variant="secondary" className="bg-medical-amber-light text-medical-amber">
                Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><strong>Ordered:</strong> Today, 2:30 PM</p>
              <p className="text-sm"><strong>Priority:</strong> Routine</p>
              <p className="text-sm"><strong>Indication:</strong> Follow-up on recent infection</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Basic Metabolic Panel (BMP)
              <Badge variant="secondary" className="bg-medical-amber-light text-medical-amber">
                Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><strong>Ordered:</strong> Today, 2:30 PM</p>
              <p className="text-sm"><strong>Priority:</strong> Routine</p>
              <p className="text-sm"><strong>Indication:</strong> Routine metabolic screening</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function IntakeFormSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-medical-amber" />
        <div>
          <h1 className="text-2xl font-bold">Intake Form</h1>
          <p className="text-muted-foreground">Complete patient intake information</p>
        </div>
        <Badge variant="secondary" className="bg-medical-amber-light text-medical-amber ml-auto">
          Requires Attention
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Basic demographic and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Intake form is incomplete. Please have patient complete form before proceeding.</p>
            <Button className="mt-4">Send Intake Form to Patient</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DiagnosesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-medical-blue" />
          Diagnoses, Medications & Allergies
        </h1>
        <p className="text-muted-foreground">Current patient conditions and treatments</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Diagnoses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Acute Upper Respiratory Infection</h4>
                  <p className="text-sm text-muted-foreground">ICD-10: J06.9 • Diagnosed today</p>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Lisinopril 10mg</h4>
                  <p className="text-sm text-muted-foreground">Daily for hypertension</p>
                </div>
                <Badge variant="secondary">Long-term</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-medical-red-light rounded-lg">
                <div>
                  <h4 className="font-medium text-medical-red">Penicillin</h4>
                  <p className="text-sm text-muted-foreground">Severe: Anaphylaxis</p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PreviousResultsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-medical-blue" />
            Previous Labs & Imaging Results
            <Badge className="ml-2 bg-medical-green text-white">3 New</Badge>
          </h1>
          <p className="text-muted-foreground">Historical test results and imaging studies</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Complete Blood Count (CBC)
              <Badge className="bg-medical-green-light text-medical-green">New</Badge>
            </CardTitle>
            <CardDescription>Lab Corp • Collected: March 10, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>WBC:</strong> 7.2 K/uL (Normal)</p>
                <p><strong>RBC:</strong> 4.8 M/uL (Normal)</p>
              </div>
              <div>
                <p><strong>Hemoglobin:</strong> 14.2 g/dL (Normal)</p>
                <p><strong>Platelets:</strong> 280 K/uL (Normal)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chest X-Ray</CardTitle>
            <CardDescription>Regional Medical Center • March 8, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Clear lung fields. No acute cardiopulmonary process. Heart size normal.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}