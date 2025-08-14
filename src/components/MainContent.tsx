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
      <div className="p-6 max-w-4xl">
        {renderSection()}
      </div>
    </main>
  );
}

function SOAPNoteSection() {
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
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subjective</CardTitle>
            <CardDescription>Patient's reported symptoms and concerns</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Enter patient's subjective complaints, symptoms, and history of present illness..."
              className="min-h-[120px] resize-none"
              defaultValue="Patient reports persistent cough for 3 days, accompanied by mild fatigue. No fever, chills, or shortness of breath. Symptoms worse in the morning."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objective</CardTitle>
            <CardDescription>Clinical findings and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Blood Pressure</Label>
                <Input defaultValue="120/80 mmHg" />
              </div>
              <div>
                <Label>Heart Rate</Label>
                <Input defaultValue="72 bpm" />
              </div>
              <div>
                <Label>Temperature</Label>
                <Input defaultValue="98.6°F" />
              </div>
            </div>
            <Textarea 
              placeholder="Physical examination findings, diagnostic test results..."
              className="min-h-[100px] resize-none"
              defaultValue="Vital signs stable. HEENT: Clear nasal passages, mild erythema in throat. Chest: Clear to auscultation bilaterally, no wheezes or rales. Heart: Regular rate and rhythm."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment</CardTitle>
            <CardDescription>Clinical impression and diagnosis</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Primary and differential diagnoses..."
              className="min-h-[100px] resize-none"
              defaultValue="1. Acute upper respiratory infection, likely viral\n2. Rule out bacterial infection\n3. Symptomatic treatment indicated"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plan</CardTitle>
            <CardDescription>Treatment plan and follow-up instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Treatment plan, medications, follow-up instructions, patient education..."
              className="min-h-[120px] resize-none"
              defaultValue="1. Supportive care with rest and fluids\n2. OTC cough suppressant as needed\n3. Return if symptoms worsen or persist >7 days\n4. Follow-up in 1 week if no improvement"
            />
          </CardContent>
        </Card>
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