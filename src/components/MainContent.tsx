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
        {/* Chief Complaint */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chief Complaint</CardTitle>
            <CardDescription>Primary reason for visit</CardDescription>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Enter chief complaint..."
              defaultValue="Persistent cough for 3 days"
            />
          </CardContent>
        </Card>

        {/* History of Present Illness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">History of Present Illness (HPI)</CardTitle>
            <CardDescription>Detailed description of the present illness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Onset</Label>
                <Input placeholder="When did symptoms start?" defaultValue="3 days ago" />
              </div>
              <div>
                <Label>Duration</Label>
                <Input placeholder="How long have symptoms lasted?" defaultValue="Continuous" />
              </div>
              <div>
                <Label>Quality</Label>
                <Input placeholder="Describe the symptoms" defaultValue="Dry, non-productive cough" />
              </div>
              <div>
                <Label>Severity (1-10)</Label>
                <Input placeholder="Rate severity" defaultValue="4" />
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="Where are symptoms located?" defaultValue="Chest/throat" />
              </div>
              <div>
                <Label>Radiation</Label>
                <Input placeholder="Do symptoms spread?" defaultValue="None" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Associated Symptoms</Label>
              <Textarea 
                placeholder="List associated symptoms..."
                className="min-h-[80px] resize-none"
                defaultValue="Mild fatigue, slight throat irritation. Denies fever, chills, shortness of breath, chest pain."
              />
            </div>
            <div className="space-y-2">
              <Label>Aggravating/Relieving Factors</Label>
              <Textarea 
                placeholder="What makes symptoms better or worse?"
                className="min-h-[60px] resize-none"
                defaultValue="Worse in morning, improves with warm liquids"
              />
            </div>
          </CardContent>
        </Card>

        {/* Review of Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review of Systems (ROS)</CardTitle>
            <CardDescription>Systematic review of body systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Constitutional</Label>
                  <Textarea 
                    placeholder="Fever, chills, weight changes..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Denies fever, chills, weight loss. Reports mild fatigue."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">HEENT</Label>
                  <Textarea 
                    placeholder="Head, eyes, ears, nose, throat..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Mild throat irritation. Denies headache, vision changes, hearing loss."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Cardiovascular</Label>
                  <Textarea 
                    placeholder="Chest pain, palpitations..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Denies chest pain, palpitations, or edema."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Respiratory</Label>
                  <Textarea 
                    placeholder="Cough, shortness of breath..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Persistent dry cough. Denies shortness of breath or wheezing."
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Gastrointestinal</Label>
                  <Textarea 
                    placeholder="Nausea, vomiting, diarrhea..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Denies nausea, vomiting, diarrhea, or abdominal pain."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Genitourinary</Label>
                  <Textarea 
                    placeholder="Urinary symptoms..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Denies dysuria, frequency, or urgency."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Musculoskeletal</Label>
                  <Textarea 
                    placeholder="Joint pain, muscle weakness..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Denies joint pain or muscle weakness."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Neurological</Label>
                  <Textarea 
                    placeholder="Dizziness, weakness, numbness..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Denies dizziness, weakness, or numbness."
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Past Medical History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Past Medical History (PMH)</CardTitle>
            <CardDescription>Previous medical conditions and surgeries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Medical Conditions</Label>
                <Textarea 
                  placeholder="List previous medical conditions..."
                  className="min-h-[80px] resize-none"
                  defaultValue="Hypertension (diagnosed 2018), well-controlled"
                />
              </div>
              <div>
                <Label>Surgical History</Label>
                <Textarea 
                  placeholder="List previous surgeries..."
                  className="min-h-[80px] resize-none"
                  defaultValue="Appendectomy (2015), no complications"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Allergies</Label>
                <Textarea 
                  placeholder="List allergies..."
                  className="min-h-[60px] resize-none"
                  defaultValue="Penicillin - anaphylaxis"
                />
              </div>
              <div>
                <Label>Current Medications</Label>
                <Textarea 
                  placeholder="List current medications..."
                  className="min-h-[60px] resize-none"
                  defaultValue="Lisinopril 10mg daily"
                />
              </div>
              <div>
                <Label>Social History</Label>
                <Textarea 
                  placeholder="Smoking, alcohol, drugs..."
                  className="min-h-[60px] resize-none"
                  defaultValue="Non-smoker, occasional alcohol use"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Examination */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Physical Examination</CardTitle>
            <CardDescription>Objective clinical findings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
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
              <div>
                <Label>Respiratory Rate</Label>
                <Input defaultValue="16/min" />
              </div>
              <div>
                <Label>Height</Label>
                <Input defaultValue="5'6&quot;" />
              </div>
              <div>
                <Label>Weight</Label>
                <Input defaultValue="140 lbs" />
              </div>
              <div>
                <Label>BMI</Label>
                <Input defaultValue="22.6" />
              </div>
              <div>
                <Label>O2 Saturation</Label>
                <Input defaultValue="98%" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">General Appearance</Label>
                  <Textarea 
                    placeholder="Overall appearance and demeanor..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Well-appearing, alert and oriented, no acute distress"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">HEENT</Label>
                  <Textarea 
                    placeholder="Head, eyes, ears, nose, throat examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="NCAT, PERRLA, TMs clear, mild throat erythema"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Neck</Label>
                  <Textarea 
                    placeholder="Neck examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Supple, no lymphadenopathy, no JVD"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Cardiovascular</Label>
                  <Textarea 
                    placeholder="Heart examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="RRR, no murmurs, rubs, or gallops"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Respiratory</Label>
                  <Textarea 
                    placeholder="Lung examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Clear to auscultation bilaterally, no wheezes, rales, or rhonchi"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Abdomen</Label>
                  <Textarea 
                    placeholder="Abdominal examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Soft, non-tender, non-distended, normal bowel sounds"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Extremities</Label>
                  <Textarea 
                    placeholder="Extremity examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="No edema, cyanosis, or clubbing"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Neurological</Label>
                  <Textarea 
                    placeholder="Neurological examination..."
                    className="min-h-[60px] resize-none text-sm"
                    defaultValue="Alert and oriented x3, CN II-XII intact, normal strength and sensation"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment and Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment & Plan</CardTitle>
            <CardDescription>Clinical impression, diagnoses, and treatment plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Primary Diagnosis</Label>
              <Input 
                placeholder="Enter primary diagnosis with ICD-10 code..."
                defaultValue="Acute upper respiratory infection (J06.9)"
              />
            </div>
            <div>
              <Label>Secondary Diagnoses</Label>
              <Textarea 
                placeholder="List additional diagnoses..."
                className="min-h-[60px] resize-none"
                defaultValue="Hypertension, controlled (I10)"
              />
            </div>
            <div>
              <Label>Treatment Plan</Label>
              <Textarea 
                placeholder="Detailed treatment plan..."
                className="min-h-[120px] resize-none"
                defaultValue="1. Supportive care with rest and increased fluid intake
2. Dextromethorphan 15mg PO q4-6h PRN cough
3. Throat lozenges for comfort
4. Return if symptoms worsen or persist >7 days
5. Follow-up in 1 week if no improvement"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Patient Education</Label>
                <Textarea 
                  placeholder="Education provided to patient..."
                  className="min-h-[80px] resize-none"
                  defaultValue="Discussed viral vs bacterial infections, importance of rest and hydration, when to return for care"
                />
              </div>
              <div>
                <Label>Follow-up Instructions</Label>
                <Textarea 
                  placeholder="Follow-up care instructions..."
                  className="min-h-[80px] resize-none"
                  defaultValue="Return in 1 week if symptoms persist or worsen. Call if develops fever >101°F, difficulty breathing, or severe throat pain"
                />
              </div>
            </div>
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