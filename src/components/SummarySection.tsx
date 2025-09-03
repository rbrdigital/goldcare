import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { FileBarChart, Calendar, User, Stethoscope, Pill, FlaskConical, Activity, Upload, StickyNote } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from a store/context
const mockSummaryData = {
  patient: {
    name: "Sarah Johnson",
    age: 34,
    sex: "Female",
    consultDate: "January 15, 2024"
  },
  soapNote: {
    chiefComplaint: "Patient presents with intermittent chest tightness and shortness of breath for the past 3 weeks, worse at night and after exertion. Denies fever or cough.",
    currentMedications: ["Lisinopril 10 mg once daily", "Atorvastatin 20 mg once nightly", "Albuterol inhaler PRN"],
    supplements: ["Vitamin D3 2000 IU daily", "Magnesium glycinate 400 mg nightly"],
    allergies: ["Penicillin — rash"],
    vitals: {
      height: "5'8\"",
      weight: "165 lbs",
      bmi: "25.1",
      waist: "32\"",
      hip: "38\""
    },
    observations: "Patient appears alert and oriented, in no acute distress. Lungs clear to auscultation, regular heart rhythm, no murmurs. Mildly elevated blood pressure noted.",
    assessment: "Primary concerns include hypertension, possible early cardiovascular disease, and poor sleep contributing to fatigue.",
    differential: "Hypertension with secondary cardiovascular risk • Obstructive sleep apnea • Anxiety-related chest tightness",
    plan: "1) Order EKG, lipid panel, and basic metabolic panel. 2) Continue lisinopril and atorvastatin as prescribed. 3) Recommend sleep study referral to rule out OSA. 4) Follow-up in 6 weeks with lab results.",
    diagnoses: ["I10 — Essential hypertension", "E78.5 — Hyperlipidemia, unspecified"]
  },
  prescriptions: [
    {
      medication: "Lisinopril 10mg",
      instructions: "Take 1 tablet by mouth once daily",
      quantity: "30 tablets",
      refills: "5"
    }
  ],
  labOrders: [
    "Lipid Panel",
    "Basic Metabolic Panel"
  ],
  imagingOrders: [
    "EKG - 12 Lead"
  ],
  outsideOrders: [
    "Sleep Study Referral - Pulmonology"
  ],
  privateNotes: "Patient seems motivated to make lifestyle changes. Consider discussing diet and exercise modifications at follow-up."
};

export function SummarySection() {
  const handleSave = () => {
    toast({
      title: "Summary Reviewed",
      description: "All consult data has been reviewed and saved.",
    });
  };

  const handleFinishAppointment = () => {
    toast({
      title: "Appointment Finalized",
      description: "The consultation has been marked complete.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consult Summary"
        description="Review all data collected during this consultation"
        icon={FileBarChart}
        onSave={handleSave}
      />

      <div className="space-y-6">
        {/* Patient Basics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-fg-muted">Name:</span>
                <div className="font-medium text-fg">{mockSummaryData.patient.name}</div>
              </div>
              <div>
                <span className="text-fg-muted">Age:</span>
                <div className="font-medium text-fg">{mockSummaryData.patient.age}</div>
              </div>
              <div>
                <span className="text-fg-muted">Sex:</span>
                <div className="font-medium text-fg">{mockSummaryData.patient.sex}</div>
              </div>
              <div>
                <span className="text-fg-muted">Consult Date:</span>
                <div className="font-medium text-fg">{mockSummaryData.patient.consultDate}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Note Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-4 w-4" />
              SOAP Note Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-fg mb-2">Chief Complaint</h4>
              <p className="text-sm text-fg-muted">{mockSummaryData.soapNote.chiefComplaint}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-fg mb-2">Vitals & Measurements</h4>
                <div className="space-y-1 text-sm">
                  <div>Height: <span className="text-fg">{mockSummaryData.soapNote.vitals.height}</span></div>
                  <div>Weight: <span className="text-fg">{mockSummaryData.soapNote.vitals.weight}</span></div>
                  <div>BMI: <span className="text-fg">{mockSummaryData.soapNote.vitals.bmi}</span></div>
                  <div>Waist: <span className="text-fg">{mockSummaryData.soapNote.vitals.waist}</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-fg mb-2">Current Medications</h4>
                <div className="flex flex-wrap gap-1">
                  {mockSummaryData.soapNote.currentMedications.map((med, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{med}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-sm text-fg mb-2">Clinical Observations</h4>
              <p className="text-sm text-fg-muted">{mockSummaryData.soapNote.observations}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-fg mb-2">Assessment & Plan</h4>
              <p className="text-sm text-fg-muted mb-2">{mockSummaryData.soapNote.assessment}</p>
              <p className="text-sm text-fg-muted">{mockSummaryData.soapNote.plan}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-fg mb-2">Diagnoses</h4>
              <div className="flex flex-wrap gap-1">
                {mockSummaryData.soapNote.diagnoses.map((diagnosis, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{diagnosis}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Pill className="h-4 w-4" />
              Medications Prescribed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockSummaryData.prescriptions.length > 0 ? (
              <div className="space-y-3">
                {mockSummaryData.prescriptions.map((rx, idx) => (
                  <div key={idx} className="p-3 bg-surface-muted rounded-lg">
                    <div className="font-medium text-sm text-fg">{rx.medication}</div>
                    <div className="text-xs text-fg-muted mt-1">{rx.instructions}</div>
                    <div className="flex gap-4 mt-2 text-xs text-fg-muted">
                      <span>Quantity: {rx.quantity}</span>
                      <span>Refills: {rx.refills}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fg-muted">No prescriptions added</p>
            )}
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Orders & Referrals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 font-medium text-sm text-fg mb-2">
                <FlaskConical className="h-4 w-4" />
                Lab Orders
              </h4>
              {mockSummaryData.labOrders.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {mockSummaryData.labOrders.map((lab, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{lab}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-fg-muted">No lab orders added</p>
              )}
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-medium text-sm text-fg mb-2">
                <Activity className="h-4 w-4" />
                Imaging Orders
              </h4>
              {mockSummaryData.imagingOrders.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {mockSummaryData.imagingOrders.map((imaging, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{imaging}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-fg-muted">No imaging orders added</p>
              )}
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-medium text-sm text-fg mb-2">
                <Upload className="h-4 w-4" />
                Outside Orders
              </h4>
              {mockSummaryData.outsideOrders.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {mockSummaryData.outsideOrders.map((order, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{order}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-fg-muted">No outside orders added</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Private Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <StickyNote className="h-4 w-4" />
              Private Clinician Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockSummaryData.privateNotes ? (
              <p className="text-sm text-fg-muted">{mockSummaryData.privateNotes}</p>
            ) : (
              <p className="text-sm text-fg-muted">No private notes added</p>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Follow-up appointment in 6 weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Review lab results when available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Patient to schedule sleep study</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleFinishAppointment} className="flex-1">
            Finalize & Finish Appointment
          </Button>
          <Button variant="outline" onClick={handleSave}>
            Save Summary
          </Button>
        </div>
      </div>
    </div>
  );
}