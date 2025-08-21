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
  const AIsuggestion = ({ text, onInsert, onDismiss }: { text: string; onInsert: () => void; onDismiss: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      const checkOverflow = () => {
        if (textRef.current) {
          const { scrollHeight, clientHeight } = textRef.current;
          setHasOverflow(scrollHeight > clientHeight);
        }
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);

      return () => {
        window.removeEventListener('resize', checkOverflow);
      };
    }, [text, isExpanded]);
    
    return (
      <div className="mt-3 p-4 rounded-lg bg-surface shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 16 16">
                <g clipPath="url(#clip0_1036_3138)">
                  <path d="M13 9C13.0012 9.20386 12.9393 9.40311 12.8227 9.57033C12.7061 9.73754 12.5405 9.86451 12.3487 9.93375L9.12498 11.125L7.93748 14.3512C7.86716 14.5423 7.73992 14.7072 7.57295 14.8236C7.40598 14.9401 7.2073 15.0025 7.00373 15.0025C6.80015 15.0025 6.60147 14.9401 6.4345 14.8236C6.26753 14.7072 6.1403 14.5423 6.06998 14.3512L4.87498 11.125L1.64873 9.9375C1.45768 9.86718 1.29281 9.73995 1.17634 9.57298C1.05988 9.406 0.997437 9.20733 0.997437 9.00375C0.997437 8.80017 1.05988 8.6015 1.17634 8.43452C1.29281 8.26755 1.45768 8.14032 1.64873 8.07L4.87498 6.875L6.06248 3.64875C6.1328 3.45771 6.26003 3.29283 6.427 3.17637C6.59397 3.0599 6.79265 2.99746 6.99623 2.99746C7.1998 2.99746 7.39848 3.0599 7.56545 3.17637C7.73242 3.29283 7.85965 3.45771 7.92998 3.64875L9.12498 6.875L12.3512 8.0625C12.5431 8.13237 12.7086 8.26008 12.8248 8.42801C12.941 8.59594 13.0022 8.7958 13 9ZM9.49998 3H10.5V4C10.5 4.13261 10.5527 4.25979 10.6464 4.35355C10.7402 4.44732 10.8674 4.5 11 4.5C11.1326 4.5 11.2598 4.44732 11.3535 4.35355C11.4473 4.25979 11.5 4.13261 11.5 4V3H12.5C12.6326 3 12.7598 2.94732 12.8535 2.85355C12.9473 2.75979 13 2.63261 13 2.5C13 2.36739 12.9473 2.24021 12.8535 2.14645C12.7598 2.05268 12.6326 2 12.5 2H11.5V1C11.5 0.867392 11.4473 0.740215 11.3535 0.646447C11.2598 0.552678 11.1326 0.5 11 0.5C10.8674 0.5 10.7402 0.552678 10.6464 0.646447C10.5527 0.740215 10.5 0.867392 10.5 1V2H9.49998C9.36737 2 9.24019 2.05268 9.14642 2.14645C9.05266 2.24021 8.99998 2.36739 8.99998 2.5C8.99998 2.63261 9.05266 2.75979 9.14642 2.85355C9.24019 2.94732 9.36737 3 9.49998 3ZM15 5H14.5V4.5C14.5 4.36739 14.4473 4.24021 14.3535 4.14645C14.2598 4.05268 14.1326 4 14 4C13.8674 4 13.7402 4.05268 13.6464 4.14645C13.5527 4.24021 13.5 4.36739 13.5 4.5V5H13C12.8674 5 12.7402 5.05268 12.6464 5.14645C12.5527 5.24021 12.5 5.36739 12.5 5.5C12.5 5.63261 12.5527 5.75979 12.6464 5.85355C12.7402 5.94732 12.8674 6 13 6H13.5V6.5C13.5 6.63261 13.5527 6.75979 13.6464 6.85355C13.7402 6.94732 13.8674 7 14 7C14.1326 7 14.2598 6.94732 14.3535 6.85355C14.4473 6.75979 14.5 6.63261 14.5 6.5V6H15C15.1326 6 15.2598 5.94732 15.3535 5.85355C15.4473 5.75979 15.5 5.63261 15.5 5.5C15.5 5.36739 15.4473 5.24021 15.3535 5.14645C15.2598 5.05268 15.1326 5 15 5Z"/>
                </g>
                <defs>
                  <clipPath id="clip0_1036_3138">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className="text-sm font-semibold text-fg">GoldCare AI</span>
            <span className="text-xs text-fg-muted">Suggestion</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onInsert} className="text-sm font-medium text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Insert above</button>
            <button type="button" onClick={onDismiss} className="text-sm font-medium text-fg underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Dismiss</button>
          </div>
        </div>
        
        <div className="relative">
          <p 
            ref={textRef}
            className={`text-sm text-fg leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}
          >
            {text}
          </p>
          {hasOverflow && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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
                text="Patient reports no known drug allergies. Previous medical records confirm no adverse reactions to common medications including penicillin, sulfa drugs, or NSAIDs."
                onInsert={() => {}}
                onDismiss={() => {}}
              />
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
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Height (inches)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Section */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Assessment</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Primary Diagnosis</label>
              <textarea 
                className="w-full h-24 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Primary diagnosis with ICD-10 code..."
              />
            </div>
          </div>
        </section>

        {/* Plan Section */}
        <section>
          <h3 className="text-lg font-semibold text-primary mb-4">Plan</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Treatment Plan</label>
              <textarea 
                className="w-full h-32 p-3 border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe the treatment plan and next steps..."
              />
            </div>
          </div>
        </section>
      </div>
    </div>
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