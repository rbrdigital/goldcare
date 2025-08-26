import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import { InlineAddInput } from "@/components/ui/inline-add-input";
import AddLabOrderScreen from "@/components/labs/AddLabOrderScreen";
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
import RXForm from "@/components/RXForm";
import { copy } from "@/copy/en";

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
      <div className="p-6">
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
      <PageHeader
        title={copy.soapNote}
        description={copy.soapNoteDesc}
        icon={FileText}
        onSave={handleSave}
      />

      <div className="space-y-8">
        {/* ========== Subjective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">{copy.subjective}</h3>
          <div className="space-y-6">
            {/* CC/HPI */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">
                {copy.chiefComplaint}
              </Label>
              <AutosizeTextarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder={copy.chiefComplaintPlaceholder}
                minRows={3}
                maxRows={8}
              />
              <AIChipClosedSmart
                text="Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol."
                onInsert={() => insertSuggestion("Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol.", setChiefComplaint)}
                onGenerateInsert={(text) => insertSuggestion(text, setChiefComplaint)}
                useCustomizable={true}
              />
            </div>
            
            {/* Current Medications */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.currentMedications}</Label>
              <InlineAddInput
                placeholder={copy.currentMedsPlaceholder}
                onAdd={(value) => setMedications(prev => [...prev, value])}
              />
              {medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {medications.map((med, idx) => (
                    <Tag key={idx} text={med} onRemove={() => setMedications(medications.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="Lisinopril 10 mg once daily • Atorvastatin 20 mg once nightly • Albuterol inhaler PRN"
                onInsert={() => {
                  const meds = ["Lisinopril 10 mg once daily", "Atorvastatin 20 mg once nightly", "Albuterol inhaler PRN"];
                  setMedications(prev => [...prev, ...meds]);
                }}
              />
            </div>

            {/* Supplements & OTC */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.supplementsOtc}</Label>
              <InlineAddInput
                placeholder={copy.supplementsPlaceholder}
                onAdd={(value) => setSupplements(prev => [...prev, value])}
              />
              {supplements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {supplements.map((supp, idx) => (
                    <Tag key={idx} text={supp} onRemove={() => setSupplements(supplements.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="Vitamin D3 2000 IU daily • Magnesium glycinate 400 mg nightly"
                onInsert={() => {
                  const supps = ["Vitamin D3 2000 IU daily", "Magnesium glycinate 400 mg nightly"];
                  setSupplements(prev => [...prev, ...supps]);
                }}
              />
            </div>

            {/* Allergies */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.allergies}</Label>
              <InlineAddInput
                placeholder={copy.allergiesPlaceholder}
                onAdd={(value) => setAllergies(prev => [...prev, value])}
              />
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {allergies.map((allergy, idx) => (
                    <Tag key={idx} text={allergy} onRemove={() => setAllergies(allergies.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="Penicillin — rash • No food or environmental allergies reported"
                onInsert={() => {
                  const allergyList = ["Penicillin — rash", "No food or environmental allergies reported"];
                  setAllergies(prev => [...prev, ...allergyList]);
                }}
              />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* ========== Objective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">{copy.objective}</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.waist}</Label>
                <Input 
                  type="number" 
                  value={waist} 
                  onChange={e=>setWaist(e.target.value)}
                  placeholder="34" 
                />
                <AIChipClosedSmart
                  text="32"
                  onInsert={() => setWaist("32")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.hip}</Label>
                <Input 
                  type="number" 
                  value={hip} 
                  onChange={e=>setHip(e.target.value)}
                  placeholder="40" 
                />
                <AIChipClosedSmart
                  text="38"
                  onInsert={() => setHip("38")}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-1">{copy.height}</Label>
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
                  <span className="text-xs text-fg-muted mt-1 block">{copy.feet}</span>
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
                  <span className="text-xs text-fg-muted mt-1 block">{copy.inches}</span>
                </div>
              </div>
              <AIChipClosedSmart
                text="5 feet 8 inches"
                onInsert={() => {
                  setHeightFt("5");
                  setHeightIn("8");
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.weight}</Label>
                <Input type="number" value={weightLbs} onChange={e=>setWeightLbs(e.target.value)} placeholder="178" />
                <AIChipClosedSmart
                  text="165"
                  onInsert={() => setWeightLbs("165")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.bmi}</Label>
                <Input disabled value={bmi} placeholder="—" className="bg-surface-muted text-fg-muted" />
                <AIChipClosedSmart
                  text="BMI will be calculated automatically based on height and weight"
                  onInsert={() => {}} // BMI is auto-calculated, no insert action
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Clinical Observations */}
          <div>
            <Label className="text-sm font-medium text-fg mb-2">{copy.clinicalObservations}</Label>
            <AutosizeTextarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder={copy.observationsPlaceholder}
              minRows={3}
              maxRows={6}
            />
            <AIChipClosedSmart
              text="Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted."
              onInsert={() => insertSuggestion("Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted.", setObservations)}
              onGenerateInsert={(text) => insertSuggestion(text, setObservations)}
              useCustomizable={true}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* ========== Assessment ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">Assessment</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.assessment}</Label>
              <AutosizeTextarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder={copy.assessmentPlaceholder}
                minRows={3}
                maxRows={6}
              />
              <AIChipClosedSmart
                text="Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue."
                onInsert={() => insertSuggestion("Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue.", setAssessment)}
                onGenerateInsert={(text) => insertSuggestion(text, setAssessment)}
                useCustomizable={true}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.differential}</Label>
              <AutosizeTextarea
                value={differential}
                onChange={(e) => setDifferential(e.target.value)}
                placeholder={copy.differentialPlaceholder}
                minRows={2}
                maxRows={5}
              />
              <AIChipClosedSmart
                text="Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness"
                onInsert={() => insertSuggestion("Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness", setDifferential)}
                onGenerateInsert={(text) => insertSuggestion(text, setDifferential)}
                useCustomizable={true}
              />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* ========== Plan ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">{copy.planSection}</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.plan}</Label>
              <AutosizeTextarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder={copy.planPlaceholder}
                minRows={4}
                maxRows={8}
              />
              <AIChipClosedSmart
                text="1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results."
                onInsert={() => insertSuggestion("1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results.", setPlan)}
                onGenerateInsert={(text) => insertSuggestion(text, setPlan)}
                useCustomizable={true}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.acuteDiagnosis}</Label>
              <InlineAddInput
                placeholder={copy.acuteDiagnosisPlaceholder}
                onAdd={(value) => setDiagnoses(prev => [...prev, value])}
              />
              {diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {diagnoses.map((diagnosis, idx) => (
                    <Tag key={idx} text={diagnosis} onRemove={() => setDiagnoses(diagnoses.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="I10 — Essential hypertension • E78.5 — Hyperlipidemia, unspecified"
                onInsert={() => {
                  const diagList = ["I10 — Essential hypertension", "E78.5 — Hyperlipidemia, unspecified"];
                  setDiagnoses(prev => [...prev, ...diagList]);
                }}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.comorbidities}</Label>
              <InlineAddInput
                placeholder={copy.comorbiditiesPlaceholder}
                onAdd={(value) => setComorbidities(prev => [...prev, value])}
              />
              {comorbidities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {comorbidities.map((condition, idx) => (
                    <Tag key={idx} text={condition} onRemove={() => setComorbidities(comorbidities.filter((_, i) => i !== idx))} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
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
  return <AddLabOrderScreen />;
}

function IntakeFormSection() {
  const handleSave = () => {
    toast({
      title: "Intake Form Saved",
      description: "Your changes have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={copy.intakeForm}
        description={copy.intakeFormDesc}
        icon={AlertTriangle}
        onSave={handleSave}
      >
        <Badge variant="secondary" className="bg-medical-amber-light text-medical-amber ml-4">
          {copy.requiresAttention}
        </Badge>
      </PageHeader>

      <div className="border border-border rounded-lg p-6 bg-surface">
        <h4 className="font-semibold text-fg mb-2">Patient Information</h4>
        <p className="text-sm text-fg-muted mb-4">Basic demographic and contact information</p>
        <div className="text-center py-8 text-fg-muted">
          <p>Intake form is incomplete. Please have patient complete form before proceeding.</p>
          <Button className="mt-4">{copy.sendIntakeForm}</Button>
        </div>
      </div>
    </div>
  );
}

function DiagnosesSection() {
  const handleSave = () => {
    toast({
      title: "Diagnoses Saved",
      description: "Patient diagnoses, medications, and allergies have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={copy.diagnosesTitle}
        description={copy.diagnosesDesc}
        icon={Activity}
        onSave={handleSave}
      />

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-fg mb-3">Active Diagnoses</h4>
          <div className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-fg">Acute Upper Respiratory Infection</h5>
                <p className="text-sm text-fg-muted">ICD-10: J06.9 • Diagnosed today</p>
              </div>
              <Badge>{copy.active}</Badge>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-fg mb-3">Current Medications</h4>
          <div className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-fg">Lisinopril 10mg</h5>
                <p className="text-sm text-fg-muted">Daily for hypertension</p>
              </div>
              <Badge variant="secondary">{copy.longTerm}</Badge>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-fg mb-3">Allergies</h4>
          <div className="border border-border rounded-lg p-4 bg-medical-red-light">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-medical-red">Penicillin</h5>
                <p className="text-sm text-fg-muted">Severe: Anaphylaxis</p>
              </div>
              <Badge variant="destructive">{copy.critical}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviousResultsSection() {
  const handleSave = () => {
    toast({
      title: "Results Saved",
      description: "Previous results have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={copy.previousResults}
        description={copy.previousResultsDesc}
        icon={Activity}
        onSave={handleSave}
      >
        <Badge className="ml-2 bg-medical-green text-white">{`3 ${copy.new}`}</Badge>
      </PageHeader>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 bg-surface">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-fg">Complete Blood Count (CBC)</h4>
            <Badge className="bg-medical-green-light text-medical-green">{copy.new}</Badge>
          </div>
          <p className="text-sm text-fg-muted mb-4">Lab Corp • {copy.collected}: March 10, 2024</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>WBC:</strong> 7.2 K/uL ({copy.normal})</p>
              <p><strong>RBC:</strong> 4.8 M/uL ({copy.normal})</p>
            </div>
            <div>
              <p><strong>Hemoglobin:</strong> 14.2 g/dL ({copy.normal})</p>
              <p><strong>Platelets:</strong> 280 K/uL ({copy.normal})</p>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-surface">
          <h4 className="font-semibold text-fg mb-3">Chest X-Ray</h4>
          <p className="text-sm text-fg-muted mb-3">Regional Medical Center • March 8, 2024</p>
          <p className="text-sm">Clear lung fields. No acute cardiopulmonary process. Heart size normal.</p>
        </div>
      </div>
    </div>
  );
}