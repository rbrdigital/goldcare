import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { AIChip } from "@/components/ui/ai-chip";
import { InlineAddInput } from "@/components/ui/inline-add-input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  Save,
  FlaskConical,
  Activity,
  AlertTriangle
} from "lucide-react";

// Card components are only used in other sections, not SOAP
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [bp, setBp] = useState<string>("");
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
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    toast({
      title: `Saved at ${timeString}`,
      duration: 2000,
    });
  };

  // Insert AI suggestion into focused field
  const insertSuggestion = (text: string, targetSetter: React.Dispatch<React.SetStateAction<string>>) => {
    targetSetter(prev => prev ? `${prev}\n\n${text}` : text);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            SOAP Note
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1">Document subjective, objective, assessment, and plan</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSave} className="gap-2 text-[12px]">
          <Save className="h-3 w-3" />
          Save
        </Button>
      </div>

      <div className="space-y-10">
        {/* ========== Subjective ========== */}
        <section>
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">Subjective</h3>
          <div className="space-y-5">
            {/* CC/HPI */}
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">
                Chief Complaint / History of Present Illness
              </Label>
              <AutosizeTextarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Reported concerns, symptom history, relevant context."
                minRows={2}
                maxRows={8}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Current Medications</Label>
              <InlineAddInput
                placeholder="Prescription medications with dose and frequency."
                onAdd={(value) => setMedications(prev => [...prev, value])}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              {medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {medications.map((med, idx) => (
                    <Tag key={idx} text={med} onRemove={() => setMedications(medications.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>

            {/* Supplements & OTC */}
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Supplements & OTC</Label>
              <InlineAddInput
                placeholder="Supplements or OTC with dose and frequency."
                onAdd={(value) => setSupplements(prev => [...prev, value])}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              {supplements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {supplements.map((supp, idx) => (
                    <Tag key={idx} text={supp} onRemove={() => setSupplements(supplements.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Allergies</Label>
              <InlineAddInput
                placeholder="Allergies and reactions. NKDA if none."
                onAdd={(value) => setAllergies(prev => [...prev, value])}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {allergies.map((allergy, idx) => (
                    <Tag key={idx} text={allergy} onRemove={() => setAllergies(allergies.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-neutral-200"></div>

        {/* ========== Objective ========== */}
        <section>
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">Objective</h3>
          
          <div className="space-y-5">
            {/* Measurements Section */}
            <div>
              <h4 className="text-[12px] font-medium text-neutral-600 mb-3">Measurements</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Waist</Label>
                  <input
                    type="number" 
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="34 in"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Hip</Label>
                  <input
                    type="number" 
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    placeholder="40 in"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Height (ft)</Label>
                  <input
                    type="number" 
                    value={heightFt} 
                    onChange={(e) => setHeightFt(e.target.value)} 
                    placeholder="5"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Height (in)</Label>
                  <input
                    type="number" 
                    value={heightIn} 
                    onChange={(e) => setHeightIn(e.target.value)} 
                    placeholder="7"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Weight</Label>
                  <input
                    type="number" 
                    value={weightLbs} 
                    onChange={(e) => setWeightLbs(e.target.value)} 
                    placeholder="178 lbs"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">BMI</Label>
                  <input
                    disabled 
                    value={bmi} 
                    placeholder="—"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500 text-[13px] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Vitals Section */}
            <div>
              <h4 className="text-[12px] font-medium text-neutral-600 mb-3">Vital Signs</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Blood Pressure</Label>
                  <input
                    type="text" 
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Pulse</Label>
                  <input
                    type="number" 
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="72 bpm"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Respiratory Rate</Label>
                  <input
                    type="number" 
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value)}
                    placeholder="16"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Temperature</Label>
                  <input
                    type="number" 
                    step="0.1" 
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="98.6°F"
                    className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Observations */}
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Clinical Observations</Label>
              <AutosizeTextarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Summarize exam and general appearance."
                minRows={2}
                maxRows={6}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-neutral-200"></div>

        {/* ========== Assessment ========== */}
        <section>
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">Assessment</h3>
          <div className="space-y-5">
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Assessment / Problem List</Label>
              <AutosizeTextarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Key clinical issues under consideration."
                minRows={2}
                maxRows={6}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>

            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Differential Diagnosis</Label>
              <AutosizeTextarea
                value={differential}
                onChange={(e) => setDifferential(e.target.value)}
                placeholder="Possible alternate explanations."
                minRows={2}
                maxRows={5}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-neutral-200"></div>

        {/* ========== Plan ========== */}
        <section>
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">Plan</h3>
          <div className="space-y-5">
            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Plan / Patient Instructions</Label>
              <AutosizeTextarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Diagnostic tests, prescriptions, lifestyle guidance, follow-up instructions."
                minRows={2}
                maxRows={8}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>

            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Acute Diagnosis</Label>
              <InlineAddInput
                placeholder="Confirmed diagnosis with ICD-10 codes."
                onAdd={(value) => setDiagnoses(prev => [...prev, value])}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              {diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {diagnoses.map((diagnosis, idx) => (
                    <Tag key={idx} text={diagnosis} onRemove={() => setDiagnoses(diagnoses.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
            </div>

            <div>
              <Label className="text-[12px] font-medium text-neutral-600 mb-1.5">Comorbidities / Contributing Conditions</Label>
              <InlineAddInput
                placeholder="Chronic or contributing factors."
                onAdd={(value) => setComorbidities(prev => [...prev, value])}
                className="w-full p-3 rounded-md border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-[13px] placeholder:text-neutral-500"
              />
              {comorbidities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {comorbidities.map((condition, idx) => (
                    <Tag key={idx} text={condition} onRemove={() => setComorbidities(comorbidities.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>GoldCare AI • Preview</span>
              </div>
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
    <span className="px-2.5 py-1 text-[12px] bg-white border border-neutral-200 text-neutral-700 rounded-full inline-flex items-center gap-2">
      {text}
      <button onClick={onRemove} className="text-neutral-400 hover:text-neutral-600 focus-visible:outline-none">×</button>
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
