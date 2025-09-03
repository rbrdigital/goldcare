import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { FileBarChart, Calendar, User, Stethoscope, Pill, FlaskConical, Activity, Upload, StickyNote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useConsultSelectors, useConsultStore } from "@/store/useConsultStore";

export function SummarySection() {
  const consultData = useConsultSelectors();
  const { setFinished } = useConsultStore();

  const handleSave = () => {
    toast({
      title: "Summary Reviewed",
      description: "All consult data has been reviewed and saved.",
    });
  };

  const handleFinishAppointment = () => {
    setFinished(true);
    toast({
      title: "Appointment Finalized",
      description: "The consultation has been marked complete.",
    });
  };

  // Patient info with fallback
  const patientName = "Sarah Johnson"; // In real app, would come from patient context
  const patientAge = 34;
  const patientSex = "Female";
  const consultDate = new Date(consultData.patientInfo.consultDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format height for display
  const formatHeight = () => {
    const { heightFt, heightIn } = consultData.soapNote.vitals;
    if (heightFt || heightIn) {
      return `${heightFt || 0}'${heightIn || 0}"`;
    }
    return "";
  };

  // Format prescriptions for display
  const formatPrescriptions = () => {
    return consultData.prescriptions.map(rx => ({
      medication: `${rx.medicine} ${rx.qtyPerDose}${rx.formulation ? ` ${rx.formulation}` : ''}`,
      instructions: `${rx.action || 'Take'} ${rx.qtyPerDose || 1} ${rx.route || 'by mouth'} ${rx.frequency || 'as directed'}${rx.prn ? ' as needed' : ''}${rx.prnInstructions ? ` for ${rx.prnInstructions}` : ''}`,
      quantity: `${rx.duration || ''} ${rx.durationUnit || 'Days'}`.trim(),
      refills: rx.refills?.toString() || "0"
    }));
  };

  // Format lab orders for display
  const formatLabOrders = () => {
    return consultData.labOrders.flatMap(lab => 
      lab.requests.flatMap(request => request.exams)
    );
  };

  // Format imaging orders for display
  const formatImagingOrders = () => {
    return consultData.imagingOrders.flatMap(imaging => imaging.studies);
  };

  // Format outside orders for display
  const formatOutsideOrders = () => {
    return consultData.outsideOrders.map(order => {
      if (order.type === 'external' && order.external) {
        return order.external.content;
      }
      if (order.type === 'internal' && order.internal) {
        if (order.internal.type === 'specialty') {
          return `${order.internal.specialty} Referral`;
        }
        if (order.internal.type === 'provider' && order.internal.providers?.length) {
          const providerNames = order.internal.providers.map(p => p.name).join(', ');
          return `Provider Referral: ${providerNames}`;
        }
      }
      return "External Order";
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
                <div className="font-medium text-fg">{patientName}</div>
              </div>
              <div>
                <span className="text-fg-muted">Age:</span>
                <div className="font-medium text-fg">{patientAge}</div>
              </div>
              <div>
                <span className="text-fg-muted">Sex:</span>
                <div className="font-medium text-fg">{patientSex}</div>
              </div>
              <div>
                <span className="text-fg-muted">Consult Date:</span>
                <div className="font-medium text-fg">{consultDate}</div>
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
            {consultData.soapNote.chiefComplaint && (
              <div>
                <h4 className="font-medium text-sm text-fg mb-2">Chief Complaint</h4>
                <p className="text-sm text-fg-muted">{consultData.soapNote.chiefComplaint}</p>
              </div>
            )}
            
            {(consultData.soapNote.chiefComplaint || formatHeight() || consultData.soapNote.vitals.weightLbs || consultData.soapNote.currentMedications.length > 0) && <Separator />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formatHeight() || consultData.soapNote.vitals.weightLbs || consultData.soapNote.vitals.bmi || consultData.soapNote.vitals.waist) && (
                <div>
                  <h4 className="font-medium text-sm text-fg mb-2">Vitals & Measurements</h4>
                  <div className="space-y-1 text-sm text-fg-muted">
                    {formatHeight() && <div>Height: <span className="text-fg">{formatHeight()}</span></div>}
                    {consultData.soapNote.vitals.weightLbs && <div>Weight: <span className="text-fg">{consultData.soapNote.vitals.weightLbs} lbs</span></div>}
                    {consultData.soapNote.vitals.bmi && <div>BMI: <span className="text-fg">{consultData.soapNote.vitals.bmi}</span></div>}
                    {consultData.soapNote.vitals.waist && <div>Waist: <span className="text-fg">{consultData.soapNote.vitals.waist}"</span></div>}
                    {consultData.soapNote.vitals.hip && <div>Hip: <span className="text-fg">{consultData.soapNote.vitals.hip}"</span></div>}
                  </div>
                </div>
              )}
              
              {consultData.soapNote.currentMedications.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-fg mb-2">Current Medications</h4>
                  <div className="flex flex-wrap gap-1">
                    {consultData.soapNote.currentMedications.map((med, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{med}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {consultData.soapNote.supplements.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-fg mb-2">Supplements</h4>
                  <div className="flex flex-wrap gap-1">
                    {consultData.soapNote.supplements.map((supplement, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{supplement}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {consultData.soapNote.allergies.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-fg mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-1">
                    {consultData.soapNote.allergies.map((allergy, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-danger border-danger">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {consultData.soapNote.observations && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-fg mb-2">Clinical Observations</h4>
                  <p className="text-sm text-fg-muted">{consultData.soapNote.observations}</p>
                </div>
              </>
            )}

            {(consultData.soapNote.assessment || consultData.soapNote.plan) && (
              <div>
                <h4 className="font-medium text-sm text-fg mb-2">Assessment & Plan</h4>
                {consultData.soapNote.assessment && <p className="text-sm text-fg-muted mb-2">{consultData.soapNote.assessment}</p>}
                {consultData.soapNote.differential && <p className="text-sm text-fg-muted mb-2"><strong>Differential:</strong> {consultData.soapNote.differential}</p>}
                {consultData.soapNote.plan && <p className="text-sm text-fg-muted">{consultData.soapNote.plan}</p>}
              </div>
            )}

            {consultData.soapNote.diagnoses.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-fg mb-2">Diagnoses</h4>
                <div className="flex flex-wrap gap-1">
                  {consultData.soapNote.diagnoses.map((diagnosis, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{diagnosis}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medications - only show if there are prescriptions */}
        {formatPrescriptions().length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Pill className="h-4 w-4" />
                Medications Prescribed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formatPrescriptions().map((rx, idx) => (
                  <div key={idx} className="p-3 bg-surface-muted rounded-lg">
                    <div className="font-medium text-sm text-fg">{rx.medication}</div>
                    <div className="text-xs text-fg-muted mt-1">{rx.instructions}</div>
                    <div className="flex gap-4 mt-2 text-xs text-fg-muted">
                      <span>Duration: {rx.quantity}</span>
                      <span>Refills: {rx.refills}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders - only show if there are any orders */}
        {(formatLabOrders().length > 0 || formatImagingOrders().length > 0 || formatOutsideOrders().length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4" />
                Orders & Referrals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formatLabOrders().length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-sm text-fg mb-2">
                    <FlaskConical className="h-4 w-4" />
                    Lab Orders
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {formatLabOrders().map((lab, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{lab}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {formatImagingOrders().length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-sm text-fg mb-2">
                    <Activity className="h-4 w-4" />
                    Imaging Orders
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {formatImagingOrders().map((imaging, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{imaging}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {formatOutsideOrders().length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-sm text-fg mb-2">
                    <Upload className="h-4 w-4" />
                    Outside Orders
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {formatOutsideOrders().map((order, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{order}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Private Notes - only show if there are notes */}
        {consultData.privateNotes?.trim() && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <StickyNote className="h-4 w-4" />
                Private Clinician Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fg-muted">{consultData.privateNotes}</p>
            </CardContent>
          </Card>
        )}

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
          <Button 
            onClick={handleFinishAppointment} 
            className="flex-1"
            disabled={consultData.finished}
          >
            {consultData.finished ? "Appointment Finalized" : "Finalize & Finish Appointment"}
          </Button>
          <Button variant="outline" onClick={handleSave}>
            Save Summary
          </Button>
        </div>
      </div>
    </div>
  );
}