import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { AIChip } from "@/components/ui/ai-chip";
import { InlineAddInput } from "@/components/ui/inline-add-input";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
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
  // State for measurements and calculations
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [weightLbs, setWeightLbs] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const heightMeters = (Number(heightFt || 0) * 12 + Number(heightIn || 0)) * 0.0254;
  const weightKg = Number(weightLbs || 0) * 0.453592;
  const bmi = heightMeters > 0 ? (weightKg / (heightMeters * heightMeters)).toFixed(1) : "";

  // State for lists
  const [medications, setMedications] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [comorbidities, setComorbidities] = useState<string[]>([]);

  // Form field values
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [observations, setObservations] = useState("");
  const [assessment, setAssessment] = useState("");
  const [differential, setDifferential] = useState("");
  const [plan, setPlan] = useState("");

  // Auto-save functionality 
  const handleSave = () => {
    toast({
      title: "SOAP Note Saved",
      description: "Your changes have been automatically saved.",
    });
  };

  // Insert AI suggestion into focused field
  const insertSuggestion = (text: string, targetSetter: React.Dispatch<React.SetStateAction<string>>) => {
    targetSetter(prev => prev ? `${prev}\n\n${text}` : text);
  };

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
        <Button variant="ghost" size="sm" onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="space-y-8">
        {/* ========== Subjective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">Subjective</h3>
          <div className="space-y-6">
            {/* CC/HPI */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">
                Chief Complaint / History of Present Illness
              </Label>
              <AutosizeTextarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Reported concerns, symptom history, relevant context"
                minRows={3}
                maxRows={8}
              />
              <AIChip
                text="Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol."
                onInsert={() => insertSuggestion("Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol.", setChiefComplaint)}
              />
            </div>

            {/* Current Medications */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">Current Medications</Label>
              <InlineAddInput
                placeholder="Prescription medications with dose and frequency"
                onAdd={(value) => setMedications(prev => [...prev, value])}
              />
              {medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {medications.map((med, idx) => (
                    <Tag key={idx} text={med} onRemove={() => setMedications(medications.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChip
                text="Lisinopril 10 mg once daily • Atorvastatin 20 mg once nightly • Albuterol inhaler PRN"
                onInsert={() => {
                  const meds = ["Lisinopril 10 mg once daily", "Atorvastatin 20 mg once nightly", "Albuterol inhaler PRN"];
                  setMedications(prev => [...prev, ...meds]);
                }}
              />
            </div>

            {/* Supplements & OTC */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">Supplements & OTC</Label>
              <InlineAddInput
                placeholder="Supplements or OTC with dose and frequency"
                onAdd={(value) => setSupplements(prev => [...prev, value])}
              />
              {supplements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {supplements.map((supp, idx) => (
                    <Tag key={idx} text={supp} onRemove={() => setSupplements(supplements.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChip
                text="Vitamin D3 2000 IU daily • Magnesium glycinate 400 mg nightly"
                onInsert={() => {
                  const supps = ["Vitamin D3 2000 IU daily", "Magnesium glycinate 400 mg nightly"];
                  setSupplements(prev => [...prev, ...supps]);
                }}
              />
            </div>

            {/* Allergies */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">Allergies</Label>
              <InlineAddInput
                placeholder="Allergies and reactions. NKDA if none"
                onAdd={(value) => setAllergies(prev => [...prev, value])}
              />
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {allergies.map((allergy, idx) => (
                    <Tag key={idx} text={allergy} onRemove={() => setAllergies(allergies.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChip
                text="Penicillin — rash • No food or environmental allergies reported"
                onInsert={() => {
                  const allergyList = ["Penicillin — rash", "No food or environmental allergies reported"];
                  setAllergies(prev => [...prev, ...allergyList]);
                }}
              />
            </div>
          </div>
        </section>

        {/* ========== Objective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">Objective</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-1">Waist (in)</Label>
                <Input 
                  type="number" 
                  value={waist} 
                  onChange={e=>setWaist(e.target.value)}
                  placeholder="34" 
                />
                <AIChip
                  text="32"
                  onInsert={() => setWaist("32")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-fg mb-1">Hip (in)</Label>
                <Input 
                  type="number" 
                  value={hip} 
                  onChange={e=>setHip(e.target.value)}
                  placeholder="40" 
                />
                <AIChip
                  text="38"
                  onInsert={() => setHip("38")}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-1">Height</Label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input 
                    type="number" 
                    value={heightFt} 
                    onChange={e=>setHeightFt(e.target.value)} 
                    placeholder="5" 
                    min="0" 
                    max="8"
                  />
                  <span className="text-xs text-fg-muted mt-1 block">feet</span>
                </div>
                <div className="flex-1">
                  <Input 
                    type="number" 
                    value={heightIn} 
                    onChange={e=>setHeightIn(e.target.value)} 
                    placeholder="7" 
                    min="0" 
                    max="11"
                  />
                  <span className="text-xs text-fg-muted mt-1 block">inches</span>
                </div>
              </div>
              <AIChip
                text="5 feet 8 inches"
                onInsert={() => {
                  setHeightFt("5");
                  setHeightIn("8");
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-1">Weight (lbs)</Label>
                <Input type="number" value={weightLbs} onChange={e=>setWeightLbs(e.target.value)} placeholder="178" />
                <AIChip
                  text="165"
                  onInsert={() => setWeightLbs("165")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-fg mb-1">BMI (auto)</Label>
                <Input disabled value={bmi} placeholder="—" className="bg-muted text-fg-muted" />
                <AIChip
                  text="BMI will be calculated automatically based on height and weight"
                  onInsert={() => {}} // BMI is auto-calculated, no insert action
                />
              </div>
            </div>
          </div>

          {/* Clinical Observations */}
          <div className="mt-6">
            <Label className="text-sm font-medium text-fg mb-2">Clinical Observations</Label>
            <AutosizeTextarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Summarize exam and general appearance"
              minRows={3}
              maxRows={6}
            />
            <AIChip
              text="Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted."
              onInsert={() => insertSuggestion("Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted.", setObservations)}
            />
          </div>
        </section>

        {/* ========== Assessment ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">Assessment</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-fg mb-2">Assessment / Problem List</Label>
              <AutosizeTextarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Key clinical issues under consideration"
                minRows={3}
                maxRows={6}
              />
              <AIChip
                text="Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue."
                onInsert={() => insertSuggestion("Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue.", setAssessment)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">Differential Diagnosis</Label>
              <AutosizeTextarea
                value={differential}
                onChange={(e) => setDifferential(e.target.value)}
                placeholder="Possible alternate explanations"
                minRows={2}
                maxRows={5}
              />
              <AIChip
                text="Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness"
                onInsert={() => insertSuggestion("Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness", setDifferential)}
              />
            </div>
          </div>
        </section>

        {/* ========== Plan ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">Plan</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-fg mb-2">Plan / Patient Instructions</Label>
              <AutosizeTextarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Diagnostic tests, prescriptions, lifestyle guidance, follow-up instructions"
                minRows={4}
                maxRows={8}
              />
              <AIChip
                text="1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results."
                onInsert={() => insertSuggestion("1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results.", setPlan)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">Acute Diagnosis</Label>
              <InlineAddInput
                placeholder="Confirmed diagnosis with ICD-10 codes"
                onAdd={(value) => setDiagnoses(prev => [...prev, value])}
              />
              {diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {diagnoses.map((diagnosis, idx) => (
                    <Tag key={idx} text={diagnosis} onRemove={() => setDiagnoses(diagnoses.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChip
                text="I10 — Essential hypertension • E78.5 — Hyperlipidemia, unspecified"
                onInsert={() => {
                  const diagList = ["I10 — Essential hypertension", "E78.5 — Hyperlipidemia, unspecified"];
                  setDiagnoses(prev => [...prev, ...diagList]);
                }}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">Comorbidities / Contributing Conditions</Label>
              <InlineAddInput
                placeholder="Chronic or contributing factors"
                onAdd={(value) => setComorbidities(prev => [...prev, value])}
              />
              {comorbidities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {comorbidities.map((condition, idx) => (
                    <Tag key={idx} text={condition} onRemove={() => setComorbidities(comorbidities.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChip
                text="Overweight • Family history of premature CAD • Poor sleep hygiene"
                onInsert={() => {
                  const conditions = ["Overweight", "Family history of premature CAD", "Poor sleep hygiene"];
                  setComorbidities(prev => [...prev, ...conditions]);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */
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
          <p className="text-fg-muted">Laboratory tests and orders</p>
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
          <p className="text-fg-muted">Complete patient intake information</p>
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
          <div className="text-center py-8 text-fg-muted">
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
        <p className="text-fg-muted">Current patient conditions and treatments</p>
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
                  <p className="text-sm text-fg-muted">ICD-10: J06.9 • Diagnosed today</p>
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
                  <p className="text-sm text-fg-muted">Daily for hypertension</p>
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
                  <p className="text-sm text-fg-muted">Severe: Anaphylaxis</p>
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
          <p className="text-fg-muted">Historical test results and imaging studies</p>
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
