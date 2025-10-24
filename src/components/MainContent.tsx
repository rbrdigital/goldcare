import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import { InlineAddInput } from "@/components/ui/inline-add-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddLabOrderScreen from "@/components/labs/AddLabOrderScreen";
import ImagingOrdersSection from "./imaging/ImagingOrdersSection";
import OutsideOrdersSection from "./outside-orders/OutsideOrdersSection";
import { PrescriptionsPanel } from "./prescriptions/PrescriptionsPanel";
import { AppSidebar } from "@/components/AppSidebar";
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
  Save,
  StickyNote
} from "lucide-react";
import RXForm from "@/components/RXForm";
import { RXPanel } from "@/components/rx/RXPanel";
import { SummarySection } from "@/components/SummarySection";
import { PrivateNotesSection } from "@/components/PrivateNotesSection";
import { GoldCareAISection } from "@/components/GoldCareAISection";
import { copy } from "@/copy/en";
import PageContainer from "@/components/layout/PageContainer";
import { useConsultStore } from "@/store/useConsultStore";

interface MainContentProps {
  activeSection: string;
  onNavigateToSection?: (section: string) => void;
}

export function MainContent({ activeSection, onNavigateToSection }: MainContentProps) {
  const renderSection = () => {
    switch (activeSection) {
      case "summary":
        return <SummarySection onNavigateToAI={() => onNavigateToSection?.('goldcare-ai')} />;
      case "goldcare-ai":
        return <GoldCareAISection />;
      case "soap":
        return <SOAPNoteSection />;
      case "rx":
        return <RXPanel />;
      case "lab-orders":
        return <LabOrdersSection />;
      case "imaging-orders":
        return <ImagingOrdersSectionWrapper />;
      case "outside-orders":
        return <OutsideOrdersSection />;
      case "prescriptions":
        return <PrescriptionsPanel />;
      case "intake":
        return <IntakeFormSection />;
      case "diagnoses":
        return <DiagnosesSection />;
      case "private-notes":
        return <PrivateNotesSection />;
      default:
        return <SOAPNoteSection />;
    }
  };

  return (
    <PageContainer>
      {renderSection()}
    </PageContainer>
  );
}

function SOAPNoteSection() {
  const {
    soapNote,
    updateSOAPField,
    updateVitals,
    addMedication,
    removeMedication,
    addSupplement,
    removeSupplement,
    addAllergy,
    removeAllergy,
    addDiagnosis,
    removeDiagnosis,
    addComorbidity,
    removeComorbidity
  } = useConsultStore();

  // Auto-save functionality 
  const handleSave = () => {
    toast({
      title: "SOAP Note Saved",
      description: "Your changes have been automatically saved.",
    });
  };

  // Insert AI suggestion into focused field
  const insertSuggestion = (text: string, field: keyof typeof soapNote) => {
    const currentValue = soapNote[field] as string;
    const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
    updateSOAPField(field, newValue);
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
          <h3 className="text-lg font-semibold text-fg mb-4">{copy.subjective.toUpperCase()}</h3>
          <div className="space-y-6">
            {/* CC/HPI */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">
                {copy.chiefComplaint}
              </Label>
              <AutosizeTextarea
                value={soapNote.chiefComplaint}
                onChange={(e) => updateSOAPField('chiefComplaint', e.target.value)}
                placeholder={copy.chiefComplaintPlaceholder}
                minRows={3}
                maxRows={8}
              />
              <AIChipClosedSmart
                text="Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol."
                onInsert={() => insertSuggestion("Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough. Reports a history of elevated blood pressure and borderline cholesterol.", 'chiefComplaint')}
                onGenerateInsert={(text) => insertSuggestion(text, 'chiefComplaint')}
                useCustomizable={true}
              />
            </div>
            
            {/* Current Medications */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.currentMedications}</Label>
              <InlineAddInput
                placeholder={copy.currentMedsPlaceholder}
                onAdd={(value) => addMedication(value)}
              />
              {soapNote.currentMedications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {soapNote.currentMedications.map((med, idx) => (
                    <Tag key={idx} text={med} onRemove={() => removeMedication(idx)} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="Lisinopril 10 mg once daily • Atorvastatin 20 mg once nightly • Albuterol inhaler PRN"
                onInsert={() => {
                  const meds = ["Lisinopril 10 mg once daily", "Atorvastatin 20 mg once nightly", "Albuterol inhaler PRN"];
                  meds.forEach(med => addMedication(med));
                }}
              />
            </div>

            {/* Supplements & OTC */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.supplementsOtc}</Label>
              <InlineAddInput
                placeholder={copy.supplementsPlaceholder}
                onAdd={(value) => addSupplement(value)}
              />
              {soapNote.supplements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {soapNote.supplements.map((supp, idx) => (
                    <Tag key={idx} text={supp} onRemove={() => removeSupplement(idx)} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="Vitamin D3 2000 IU daily • Magnesium glycinate 400 mg nightly"
                onInsert={() => {
                  const supps = ["Vitamin D3 2000 IU daily", "Magnesium glycinate 400 mg nightly"];
                  supps.forEach(supp => addSupplement(supp));
                }}
              />
            </div>

            {/* Allergies */}
            <div>
              <Label className="text-sm font-medium text-fg mb-2">{copy.allergies}</Label>
              <InlineAddInput
                placeholder={copy.allergiesPlaceholder}
                onAdd={(value) => addAllergy(value)}
              />
              {soapNote.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {soapNote.allergies.map((allergy, idx) => (
                    <Tag key={idx} text={allergy} onRemove={() => removeAllergy(idx)} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="Penicillin — rash • No food or environmental allergies reported"
                onInsert={() => {
                  const allergyList = ["Penicillin — rash", "No food or environmental allergies reported"];
                  allergyList.forEach(allergy => addAllergy(allergy));
                }}
              />
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* ========== Objective ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">{copy.objective.toUpperCase()}</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.waist}</Label>
                <Input 
                  type="number" 
                  value={soapNote.vitals.waist} 
                  onChange={e=>updateVitals('waist', e.target.value)}
                  placeholder="34" 
                />
                <AIChipClosedSmart
                  text="32"
                  onInsert={() => updateVitals('waist', "32")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.hip}</Label>
                <Input 
                  type="number" 
                  value={soapNote.vitals.hip} 
                  onChange={e=>updateVitals('hip', e.target.value)}
                  placeholder="40" 
                />
                <AIChipClosedSmart
                  text="38"
                  onInsert={() => updateVitals('hip', "38")}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-1">{copy.height}</Label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input 
                    type="number" 
                    value={soapNote.vitals.heightFt} 
                    onChange={e=>updateVitals('heightFt', e.target.value)} 
                    placeholder="5" 
                    min="0" 
                    max="8"
                  />
                  <span className="text-xs text-fg-muted mt-1 block">{copy.feet}</span>
                </div>
                <div className="flex-1">
                  <Input 
                    type="number" 
                    value={soapNote.vitals.heightIn} 
                    onChange={e=>updateVitals('heightIn', e.target.value)} 
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
                  updateVitals('heightFt', "5");
                  updateVitals('heightIn', "8");
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.weight}</Label>
                <Input type="number" value={soapNote.vitals.weightLbs} onChange={e=>updateVitals('weightLbs', e.target.value)} placeholder="178" />
                <AIChipClosedSmart
                  text="165"
                  onInsert={() => updateVitals('weightLbs', "165")}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-fg mb-1">{copy.bmi}</Label>
                <Input disabled value={soapNote.vitals.bmi} placeholder="—" className="bg-surface-muted text-fg-muted" />
                <AIChipClosedSmart
                  text="BMI will be calculated automatically based on height and weight"
                  onInsert={() => {}} // BMI is auto-calculated, no insert action
                />
              </div>
            </div>
          </div>

          {/* Clinical Observations */}
          <div className="mt-6">
            <Label className="text-sm font-medium text-fg mb-2">{copy.clinicalObservations}</Label>
            <AutosizeTextarea
              value={soapNote.observations}
              onChange={(e) => updateSOAPField('observations', e.target.value)}
              placeholder={copy.observationsPlaceholder}
              minRows={3}
              maxRows={6}
            />
            <AIChipClosedSmart
              text="Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted."
              onInsert={() => insertSuggestion("Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted.", 'observations')}
              onGenerateInsert={(text) => insertSuggestion(text, 'observations')}
              useCustomizable={true}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* ========== Assessment / Plan ========== */}
        <section>
          <h3 className="text-lg font-semibold text-fg mb-4">ASSESSMENT / PLAN</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-fg mb-2">Assessment</Label>
              <AutosizeTextarea
                value={soapNote.assessment}
                onChange={(e) => updateSOAPField('assessment', e.target.value)}
                placeholder={copy.assessmentPlaceholder}
                minRows={3}
                maxRows={6}
              />
              <AIChipClosedSmart
                text="Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue."
                onInsert={() => insertSuggestion("Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue.", 'assessment')}
                onGenerateInsert={(text) => insertSuggestion(text, 'assessment')}
                useCustomizable={true}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">Diagnosis</Label>
              <p className="text-xs text-fg-muted mb-2">{copy.acuteDiagnosisPlaceholder}</p>
              <InlineAddInput
                placeholder={copy.acuteDiagnosisPlaceholder}
                onAdd={(value) => addDiagnosis(value)}
              />
              {soapNote.diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {soapNote.diagnoses.map((diagnosis, idx) => (
                    <Tag key={idx} text={diagnosis} onRemove={() => removeDiagnosis(idx)} />
                  ))}
                </div>
              )}
              <AIChipClosedSmart
                text="I10 — Essential hypertension • E78.5 — Hyperlipidemia, unspecified"
                onInsert={() => {
                  const diagList = ["I10 — Essential hypertension", "E78.5 — Hyperlipidemia, unspecified"];
                  diagList.forEach(diag => addDiagnosis(diag));
                }}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">Patient Education and Discharge Instructions</Label>
              <AutosizeTextarea
                value={soapNote.patientEducation}
                onChange={(e) => updateSOAPField('patientEducation', e.target.value)}
                placeholder="Patient education, discharge instructions, and lifestyle recommendations"
                minRows={3}
                maxRows={6}
              />
              <AIChipClosedSmart
                text="Continue current medications as prescribed. Monitor blood pressure daily. Limit sodium intake and increase physical activity. Return if symptoms worsen."
                onInsert={() => insertSuggestion("Continue current medications as prescribed. Monitor blood pressure daily. Limit sodium intake and increase physical activity. Return if symptoms worsen.", 'patientEducation')}
                onGenerateInsert={(text) => insertSuggestion(text, 'patientEducation')}
                useCustomizable={true}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-fg mb-2">Follow-up Appointment</Label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input 
                    type="number" 
                    value={soapNote.followUpValue} 
                    onChange={(e) => updateSOAPField('followUpValue', e.target.value)}
                    placeholder="Select days, weeks, or months" 
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <Select
                    value={soapNote.followUpUnit}
                    onValueChange={(value) => updateSOAPField('followUpUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                      <SelectItem value="Months">Months</SelectItem>
                      <SelectItem value="Years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {soapNote.followUpValue && soapNote.followUpUnit && (
                <p className="text-sm text-fg-muted mt-2">
                  Follow-up in {soapNote.followUpValue} {soapNote.followUpUnit.toLowerCase()}
                </p>
              )}
              <AIChipClosedSmart
                text="6 weeks"
                onInsert={() => {
                  updateSOAPField('followUpValue', "6");
                  updateSOAPField('followUpUnit', "Weeks");
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

function ImagingOrdersSectionWrapper() {
  return <ImagingOrdersSection />;
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