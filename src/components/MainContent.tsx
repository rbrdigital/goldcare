import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import TextareaAutosize from 'react-textarea-autosize';

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
  const [waist, setWaist] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [weightLbs, setWeightLbs] = useState<string>("");
  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [pulse, setPulse] = useState<string>("");
  const [respiratoryRate, setRespiratoryRate] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  
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
      title: "Saved",
      description: `Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    });
  };

  // Insert AI suggestion into focused field
  const insertSuggestion = (text: string, targetSetter: React.Dispatch<React.SetStateAction<string>>) => {
    targetSetter(prev => prev ? `${prev}\n\n${text}` : text);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight text-neutral-900 mb-2">SOAP Note</h1>
      </div>

      <div className="space-y-10">
        {/* ========== Subjective ========== */}
        <section className="space-y-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-8">Subjective</h2>
          
          {/* CC/HPI */}
          <div className="space-y-12">
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Chief Complaint / History of Present Illness</label>
              <TextareaAutosize
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Reported concerns, symptom history, relevant context."
                minRows={3}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400 resize-none"
              />
              <AIChip
                text="Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports elevated blood pressure and borderline cholesterol. Increased work stress and poor sleep. No prior hospitalizations. Family history of early coronary artery disease."
                onInsert={() => insertSuggestion("Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports elevated blood pressure and borderline cholesterol. Increased work stress and poor sleep. No prior hospitalizations. Family history of early coronary artery disease.", setChiefComplaint)}
              />
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Current Medications</label>
              <InlineAddInput
                placeholder="Prescription medications with dose and frequency."
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
                text="Lisinopril 10 mg once daily • Atorvastatin 20 mg once nightly • Albuterol inhaler PRN, ~2×/week"
                onInsert={() => {
                  const meds = ["Lisinopril 10 mg once daily", "Atorvastatin 20 mg once nightly", "Albuterol inhaler PRN, ~2×/week"];
                  setMedications(prev => [...prev, ...meds]);
                }}
              />
            </div>

            {/* Supplements & OTC */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Supplements & OTC</label>
              <InlineAddInput
                placeholder="Supplements or OTC with dose and frequency."
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
                text="Vitamin D3 2000 IU daily • Magnesium glycinate 400 mg nightly • Ibuprofen 200 mg PRN for headaches"
                onInsert={() => {
                  const supps = ["Vitamin D3 2000 IU daily", "Magnesium glycinate 400 mg nightly", "Ibuprofen 200 mg PRN for headaches"];
                  setSupplements(prev => [...prev, ...supps]);
                }}
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Allergies</label>
              <InlineAddInput
                placeholder="Allergies and reactions. NKDA if none."
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

        {/* Divider */}
        <div className="h-px bg-neutral-200 my-8"></div>

        {/* ========== Objective ========== */}
        <section className="space-y-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-8">Objective</h2>

          <div className="space-y-12">
            {/* Measurements */}
            <div>
              <h3 className="text-[12px] font-medium text-neutral-600 mb-6">Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Waist (inches)</label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Hip (inches)</label>
                  <input
                    type="number"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Height (ft)</label>
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Height (in)</label>
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">BMI</label>
                  <input
                    type="text"
                    value={bmi}
                    disabled
                    className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-neutral-500"
                  />
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div>
              <h3 className="text-[12px] font-medium text-neutral-600 mb-6">Vitals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Blood Pressure</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="120/80"
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Pulse bpm</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Respiratory Rate /min</label>
                  <input
                    type="number"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Temperature °F</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Observations */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Clinical Observations</label>
              <TextareaAutosize
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Summarize exam and general appearance."
                minRows={3}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400 resize-none"
              />
              <AIChip
                text="Alert, oriented, no acute distress. Lungs clear to auscultation; regular heart rhythm, no murmurs. Mildly elevated blood pressure. No peripheral edema."
                onInsert={() => insertSuggestion("Alert, oriented, no acute distress. Lungs clear to auscultation; regular heart rhythm, no murmurs. Mildly elevated blood pressure. No peripheral edema.", setObservations)}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-neutral-200 my-8"></div>

        {/* ========== Assessment ========== */}
        <section className="space-y-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-8">Assessment</h2>
          
          <div className="space-y-12">
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Assessment / Problem List</label>
              <TextareaAutosize
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Key clinical issues under consideration."
                minRows={3}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400 resize-none"
              />
              <AIChip
                text="Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue."
                onInsert={() => insertSuggestion("Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue.", setAssessment)}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Differential Diagnosis</label>
              <TextareaAutosize
                value={differential}
                onChange={(e) => setDifferential(e.target.value)}
                placeholder="Possible alternate explanations."
                minRows={3}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400 resize-none"
              />
              <AIChip
                text="Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness"
                onInsert={() => insertSuggestion("Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness", setDifferential)}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-neutral-200 my-8"></div>

        {/* ========== Plan ========== */}
        <section className="space-y-5">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-8">Plan</h2>
          
          <div className="space-y-12">
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Plan / Patient Instructions</label>
              <TextareaAutosize
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Diagnostic tests, prescriptions, lifestyle guidance, follow-up instructions."
                minRows={3}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-neutral-400 resize-none"
              />
              <AIChip
                text="1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results."
                onInsert={() => insertSuggestion("1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results.", setPlan)}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Acute Diagnosis</label>
              <InlineAddInput
                placeholder="Confirmed diagnosis with ICD-10."
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
              <label className="block text-[12px] font-medium text-neutral-600 mb-6">Comorbidities / Contributing Conditions</label>
              <InlineAddInput
                placeholder="Chronic or contributing factors."
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

      {/* Save Button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={handleSave} className="shadow-lg">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */
function Tag({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <span className="px-2.5 py-1 text-[12px] bg-white border border-neutral-200 rounded-md inline-flex items-center gap-2">
      {text}
      <button onClick={onRemove} className="text-neutral-500 hover:text-neutral-700 focus-visible:outline-none">×</button>
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
