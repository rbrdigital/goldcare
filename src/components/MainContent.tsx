import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  const AIsuggestion = ({ text, onInsert, onDismiss }: { text: string; onInsert: () => void; onDismiss: () => void }) => (
    <div className="mt-3 p-4 rounded-lg bg-surface border border-border shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-3 h-3 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-fg">GoldCare AI</span>
            <span className="text-xs text-fg-muted">Suggestion</span>
          </div>
          <p className="text-sm text-fg leading-relaxed">{text}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button 
          onClick={onInsert}
          className="px-4 py-2 text-sm font-medium bg-bg text-primary border border-border rounded-md hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Insert above
        </button>
        <button 
          onClick={onDismiss}
          className="px-4 py-2 text-sm font-medium bg-surface text-fg border border-border rounded-md hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Dismiss
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-medical-blue" />
            SOAP Note
          </h1>
          <p className="text-muted-foreground">Document subjective, objective, assessment, and plan</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-medical-blue-light text-medical-blue">
            <Clock className="h-3 w-3 mr-1" />
            Auto-saved 2 min ago
          </Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Subjective Section */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Subjective</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">What brings you here today?</label>
              <textarea 
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe the main concern or reason for today's visit..."
              />
              <AIsuggestion 
                text="Patient reports experiencing persistent headaches for the past 3 days, described as throbbing pain located in the frontal region, rated 7/10 in severity. Pain is worse in the morning and improves slightly with over-the-counter ibuprofen."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">What medication(s) are you taking?</label>
              <textarea 
                className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="List current medications, dosages, and frequency..."
              />
              <AIsuggestion 
                text="Current medications include Lisinopril 10mg daily for hypertension, Metformin 500mg twice daily for type 2 diabetes, and Atorvastatin 20mg daily for cholesterol management."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
              <div className="flex gap-2 mt-3 flex-wrap">
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 1</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 2</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 3</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 4</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">What supplements/OTC are you taking?</label>
              <textarea 
                className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="List over-the-counter medications and supplements..."
              />
              <AIsuggestion 
                text="Patient takes Vitamin D3 2000 IU daily, Omega-3 fish oil 1000mg daily, and occasional ibuprofen 400mg as needed for headaches (approximately 2-3 times per week)."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
              <div className="flex gap-2 mt-3 flex-wrap">
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 1</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 2</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 3</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 4</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Do you have any drug allergies?</label>
              <textarea 
                className="w-full h-20 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="List any known drug allergies and reactions..."
              />
              <AIsuggestion 
                text="Patient reports allergy to Penicillin (causes rash and hives), Sulfa drugs (nausea and vomiting), and NKDA (No Known Drug Allergies) to other medications."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
              <div className="flex gap-2 mt-3 flex-wrap">
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 1</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 2</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 3</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 4</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 5</button>
              </div>
            </div>
          </div>
        </section>

        {/* Objective Section */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Objective</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Weight (lbs)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
                <div className="mt-2 flex items-center gap-2 text-sm text-fg-muted">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-2 h-2 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="font-medium">GoldCare AI:</span>
                  <span>xx lbs</span>
                  <button className="ml-auto text-primary hover:opacity-80 underline text-xs">Add</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Height (inches)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
                <div className="mt-2 flex items-center gap-2 text-sm text-fg-muted">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-2 h-2 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="font-medium">GoldCare AI:</span>
                  <span>xx inches</span>
                  <button className="ml-auto text-primary hover:opacity-80 underline text-xs">Add</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hip Measurement (inches)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
                <div className="mt-2 flex items-center gap-2 text-sm text-fg-muted">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-2 h-2 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="font-medium">GoldCare AI:</span>
                  <span>xx inches</span>
                  <button className="ml-auto text-primary hover:opacity-80 underline text-xs">Add</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Body Mass Index (BMI)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" 
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Observations</label>
              <textarea 
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Clinical observations and physical examination findings..."
              />
              <AIsuggestion 
                text="Patient appears well-nourished and in no acute distress. Vital signs are stable. Physical examination reveals normal heart sounds, clear lung fields bilaterally, and soft, non-tender abdomen. No obvious signs of illness or distress noted during the encounter."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>
          </div>
        </section>

        {/* Assessment Section */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Assessment</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Problem</label>
              <textarea 
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Primary medical problem or diagnosis..."
              />
              <AIsuggestion 
                text="Primary concern appears to be tension-type headache, likely related to stress and poor sleep hygiene. Patient's symptoms are consistent with episodic tension headaches without concerning neurological signs. Consider medication overuse headache given frequent ibuprofen use."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Differential Diagnosis</label>
              <textarea 
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="List potential diagnoses to consider..."
              />
              <AIsuggestion 
                text="Differential diagnosis includes: 1) Tension-type headache (most likely), 2) Medication overuse headache, 3) Migraine without aura, 4) Cervicogenic headache, 5) Cluster headache (less likely given pattern), 6) Secondary headache due to hypertension or other systemic cause."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>
          </div>
        </section>

        {/* Plan Section */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Plan</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Acute Diagnosis</label>
              <textarea 
                className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="ICD-10 codes and acute diagnoses..."
              />
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-2 h-2 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-fg">GoldCare AI</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Z32.00- Encounter for pregnancy test, result unknow</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Z32.01- Encounter for pregnancy test, result positive</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Z32.02- Encounter for pregnancy test, result negative</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Patient Education and Discharge Instructions</label>
              <textarea 
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Instructions for patient care and follow-up..."
              />
              <AIsuggestion 
                text="Educate patient on headache triggers and lifestyle modifications including adequate sleep (7-8 hours), regular meals, stress management techniques, and hydration. Recommend limiting ibuprofen use to prevent medication overuse headaches. Provide instructions on when to seek emergency care for severe headaches, vision changes, or neurological symptoms. Schedule follow-up in 2-3 weeks to assess response to treatment modifications."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Comorbidities/Contributing Conditions</label>
              <textarea 
                className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Related conditions that may impact treatment..."
              />
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-2 h-2 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-fg">GoldCare AI</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 1</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 2</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 3</button>
                <button className="px-3 py-1 text-xs bg-surface text-fg border border-border rounded-full hover:bg-bg">Suggestion 4</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RXSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pill className="h-6 w-6 text-medical-blue" />
            Prescriptions
          </h1>
          <p className="text-muted-foreground">Manage patient medications and prescriptions</p>
        </div>
        <Button>Add Prescription</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Dextromethorphan 15mg</h4>
                <p className="text-sm text-muted-foreground">Take 1 tablet every 4-6 hours as needed for cough</p>
                <p className="text-sm text-muted-foreground">Quantity: 30 tablets • Refills: 0</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
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