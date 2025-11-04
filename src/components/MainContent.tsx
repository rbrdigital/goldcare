import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { AIChipClosedSmart } from "@/components/ai/AIChipClosedSmart";
import { InlineAddInput } from "@/components/ui/inline-add-input";
import { DiagnosisSelector } from "@/components/diagnosis/DiagnosisSelector";
import { FieldTips } from "@/components/ui/field-tips";
import { NumberWithUnitInput } from "@/components/ui/number-with-unit-input";
import { HeightInput } from "@/components/ui/height-input";
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

      <div>
        {/* ========== Subjective ========== */}
        <section className="border border-gray-200 rounded-xl mb-8">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900 leading-7">Subjective</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* CC/HPI */}
            <div>
              <Label className="mb-2 inline-flex items-center">
                {copy.chiefComplaint}
                <FieldTips
                  tip="Summarize the patient's main concern (onset, duration, triggers) along with any relevant context to help the provider focus the telehealth consultation."
                />
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
              <Label className="mb-2 inline-flex items-center">
                {copy.currentMedications}
                <FieldTips
                  tip="List all prescription medications with dosages and frequencies to ensure accurate EMR records and prevent drug interactions."
                />
              </Label>
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
              <Label className="mb-2 inline-flex items-center">
                {copy.supplementsOtc}
                <FieldTips
                  tip="Include all over‑the‑counter medicines and supplements with dosages; these can interact with prescriptions and influence care plans."
                />
              </Label>
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
              <Label className="mb-2 inline-flex items-center">
                {copy.allergies}
                <FieldTips
                  tip="Document drug, food and environmental allergies, including reaction types, or indicate 'NKDA' if none."
                />
              </Label>
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

        {/* ========== Objective ========== */}
        <section className="border border-gray-200 rounded-xl mb-8">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 leading-7">Objective</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">BMI:</span>
              <span className="text-2xl font-semibold text-gray-900">{soapNote.vitals.bmi || "—"}</span>
              <FieldTips
                tip="Ensure height and weight entries are accurate; BMI will auto‑calculate from these values."
              />
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Measurement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Label className="text-xs font-medium text-gray-600 mb-2 inline-flex items-center">
                  {copy.waist}
                  <FieldTips
                    tip="Measure waist circumference at the narrowest point after exhaling normally to monitor metabolic health trends."
                  />
                </Label>
                <div className="text-2xl font-semibold text-gray-900">{soapNote.vitals.waist || "—"}</div>
                <div className="text-sm text-gray-600">inches</div>
                <div className="mt-2">
                  <Input 
                    type="number" 
                    value={soapNote.vitals.waist} 
                    onChange={e=>updateVitals('waist', e.target.value)}
                    placeholder="34" 
                    className="text-sm"
                  />
                </div>
                <AIChipClosedSmart
                  text="32"
                  onInsert={() => updateVitals('waist', "32")}
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Label className="text-xs font-medium text-gray-600 mb-2 inline-flex items-center">
                  {copy.hip}
                  <FieldTips
                    tip="Measure the fullest part of the hips/buttocks; together with waist, this helps calculate waist–hip ratio."
                  />
                </Label>
                <div className="text-2xl font-semibold text-gray-900">{soapNote.vitals.hip || "—"}</div>
                <div className="text-sm text-gray-600">inches</div>
                <div className="mt-2">
                  <Input 
                    type="number" 
                    value={soapNote.vitals.hip} 
                    onChange={e=>updateVitals('hip', e.target.value)}
                    placeholder="40" 
                    className="text-sm"
                  />
                </div>
                <AIChipClosedSmart
                  text="38"
                  onInsert={() => updateVitals('hip', "38")}
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Label className="text-xs font-medium text-gray-600 mb-2 inline-flex items-center">
                  {copy.height}
                  <FieldTips
                    tip="Record height using a stadiometer if the patient can stand; otherwise measure supine with a tape measure."
                  />
                </Label>
                <div className="text-2xl font-semibold text-gray-900">
                  {soapNote.vitals.heightFt && soapNote.vitals.heightIn 
                    ? `${soapNote.vitals.heightFt}'${soapNote.vitals.heightIn}"` 
                    : "—"}
                </div>
                <div className="text-sm text-gray-600">feet, inches</div>
                <div className="mt-2">
                  <HeightInput
                    feet={soapNote.vitals.heightFt}
                    inches={soapNote.vitals.heightIn}
                    onFeetChange={(value) => updateVitals('heightFt', value)}
                    onInchesChange={(value) => updateVitals('heightIn', value)}
                  />
                </div>
                <AIChipClosedSmart
                  text="5 feet 8 inches"
                  onInsert={() => {
                    updateVitals('heightFt', "5");
                    updateVitals('heightIn', "8");
                  }}
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <Label className="text-xs font-medium text-gray-600 mb-2 inline-flex items-center">
                  {copy.weight}
                  <FieldTips
                    tip="Enter the current weight in pounds, noting the measurement date to track changes over time."
                  />
                </Label>
                <div className="text-2xl font-semibold text-gray-900">{soapNote.vitals.weightLbs || "—"}</div>
                <div className="text-sm text-gray-600">lbs</div>
                <div className="mt-2">
                  <Input 
                    type="number" 
                    value={soapNote.vitals.weightLbs} 
                    onChange={e=>updateVitals('weightLbs', e.target.value)} 
                    placeholder="178" 
                    className="text-sm"
                  />
                </div>
                <AIChipClosedSmart
                  text="165"
                  onInsert={() => updateVitals('weightLbs', "165")}
                />
              </div>
            </div>

            <Label className="mb-2 inline-flex items-center">
              {copy.clinicalObservations}
              <FieldTips
                tip="Summarize general appearance and notable findings (e.g., distress, orientation) observed during the telehealth exam."
              />
            </Label>
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

        {/* ========== Assessment / Plan ========== */}
        <section className="border border-gray-200 rounded-xl mb-8">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900 leading-7">Assessment & Plan</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <Label className="mb-2 inline-flex items-center">
                Assessment
                <FieldTips
                  tip="Outline key clinical issues and provisional diagnoses, prioritizing conditions for follow‑up and treatment."
                />
              </Label>
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
          <DiagnosisSelector
            label="Diagnosis"
            tooltip="Use ICD‑10 search to choose accurate codes; proper coding ensures correct billing and data reporting."
            placeholder="Search for diagnosis..."
            showAdvancedSearch={true}
            onSelect={(diagnosis) => {
                  // Format as "CODE - Description"
                  const formatted = `${diagnosis.code} — ${diagnosis.diagnosis}`;
                  addDiagnosis(formatted);
                }}
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
              <Label className="mb-2 inline-flex items-center">
                Patient Education and Discharge Instructions
                <FieldTips
                  tip="Provide clear, jargon‑free instructions and lifestyle recommendations; refer patients to trusted resources like GoldCare's WellnessU."
                />
              </Label>
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

            <div className="h-px bg-gray-200"></div>

            <div>
              <Label className="mb-2 inline-flex items-center">
                Follow-up Appointment
                <FieldTips
                  tip="Specify the timing and modality (virtual vs in‑person) of the next appointment based on clinical need."
                />
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <NumberWithUnitInput
                  value={soapNote.followUpValue}
                  onValueChange={(value) => updateSOAPField('followUpValue', value)}
                  unit={soapNote.followUpUnit || "Days"}
                  onUnitChange={(value) => updateSOAPField('followUpUnit', value)}
                  units={[
                    { value: "Days", label: "Days" },
                    { value: "Weeks", label: "Weeks" },
                    { value: "Months", label: "Months" },
                    { value: "Years", label: "Years" },
                  ]}
                  placeholder="Amount"
                  min="1"
                />
                <div>
                  <Select
                    value={soapNote.followUpLength}
                    onValueChange={(value) => updateSOAPField('followUpLength', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select length (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                      <SelectItem value="120">120 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {soapNote.followUpValue && soapNote.followUpUnit && (
                <p className="text-sm text-gray-600 mt-2">
                  Follow-up in {soapNote.followUpValue} {soapNote.followUpUnit.toLowerCase()}{soapNote.followUpLength && ` for ${soapNote.followUpLength} minutes`}
                </p>
              )}
              <AIChipClosedSmart
                text="6 weeks for a 30-minute appointment"
                onInsert={() => {
                  updateSOAPField('followUpValue', "6");
                  updateSOAPField('followUpUnit', "Weeks");
                  updateSOAPField('followUpLength', "30");
                }}
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline">Save draft</Button>
          <Button className="px-8">Complete note</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */
function Tag({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <Badge variant="calcom" className="flex items-center gap-1">
      {text}
      <button onClick={onRemove} className="ml-1 text-gray-600 hover:text-gray-900 focus-visible:outline-none">×</button>
    </Badge>
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