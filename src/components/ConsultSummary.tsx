"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Pill, 
  FlaskConical, 
  Scan, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronRight,
  Eye,
  CheckCircle,
  Calendar,
  User,
  Activity
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { toast } from "@/hooks/use-toast";
import { useStore } from "zustand";
import { 
  ConsultStore, 
  selectSoap, 
  selectRx, 
  selectLabs, 
  selectImaging, 
  selectOutsideOrders, 
  selectPrivateNotes, 
  selectFollowUp,
  selectPatientInfo,
  selectVisitInfo
} from "@/store/useConsultStore";

interface ConsultSummaryProps {
  consultStore: ConsultStore;
}

export function ConsultSummary({ consultStore }: ConsultSummaryProps) {
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [finishModalOpen, setFinishModalOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["subjective", "assessment"])
  );

  // Subscribe to store data
  const soapData = useStore(consultStore, selectSoap);
  const rxOrders = useStore(consultStore, selectRx);
  const labOrders = useStore(consultStore, selectLabs);
  const imagingOrders = useStore(consultStore, selectImaging);
  const outsideOrders = useStore(consultStore, selectOutsideOrders);
  const privateNotes = useStore(consultStore, selectPrivateNotes);
  const followUp = useStore(consultStore, selectFollowUp);
  const patientInfo = useStore(consultStore, selectPatientInfo);
  const visitInfo = useStore(consultStore, selectVisitInfo);
  const locked = useStore(consultStore, (state) => state.locked);
  const lockConsult = useStore(consultStore, (state) => state.lockConsult);

  const handleSave = () => {
    toast({
      title: "Summary Auto-saved",
      description: "All consultation data has been automatically saved.",
    });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleFinishAppointment = () => {
    lockConsult();
    setFinishModalOpen(false);
    toast({
      title: "Appointment Finished",
      description: "The consultation has been locked and finalized.",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getFirstSentences = (text: string, maxSentences: number = 3) => {
    if (!text) return [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, maxSentences).map(s => s.trim());
  };

  const getBulletPoints = (text: string, maxPoints: number = 3) => {
    if (!text) return [];
    const points = text.split(/[\n•-]/).filter(p => p.trim().length > 0);
    return points.slice(0, maxPoints).map(p => p.trim());
  };

  const renderVitalsChips = () => {
    const vitals = soapData.vitals;
    const chips = [];
    
    if (vitals.bp) chips.push(`BP: ${vitals.bp}`);
    if (vitals.hr) chips.push(`HR: ${vitals.hr}`);
    if (vitals.temp) chips.push(`Temp: ${vitals.temp}`);
    if (vitals.height) chips.push(`Height: ${vitals.height}`);
    if (vitals.weight) chips.push(`Weight: ${vitals.weight}`);
    if (vitals.bmi) chips.push(`BMI: ${vitals.bmi}`);
    if (vitals.waist) chips.push(`Waist: ${vitals.waist}`);
    
    return chips;
  };

  return (
    <TooltipProvider>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Summary"
            description="Review everything recorded for this visit before finishing the appointment."
            icon={FileText}
            onSave={handleSave}
          >
            {locked ? (
              <Badge variant="secondary">Locked</Badge>
            ) : (
              <Badge variant="outline">Auto-saved</Badge>
            )}
          </PageHeader>

          {/* Visit Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Visit Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-fg">Patient</div>
                  <div className="text-sm text-fg-muted">
                    {patientInfo.name}, {patientInfo.age} {patientInfo.sex}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-fg">Visit</div>
                  <div className="text-sm text-fg-muted">
                    {visitInfo.date} • {visitInfo.provider}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-fg">Reason for visit</div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm text-fg-muted truncate">
                        {visitInfo.reasonForVisit || getFirstSentences(soapData.subjective, 1)[0] || "—"}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{visitInfo.reasonForVisit || soapData.subjective || "No reason specified"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {renderVitalsChips().length > 0 && (
                <div>
                  <div className="text-sm font-medium text-fg mb-2">Vitals</div>
                  <div className="flex flex-wrap gap-2">
                    {renderVitalsChips().map((vital, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {vital}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SOAP Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                SOAP Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subjective */}
              <Collapsible
                open={expandedSections.has("subjective")}
                onOpenChange={() => toggleSection("subjective")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">Subjective</span>
                    {expandedSections.has("subjective") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 text-sm text-fg-muted">
                    {getBulletPoints(soapData.subjective).map((point, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                    {!soapData.subjective && <div>No content yet</div>}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Objective */}
              <Collapsible
                open={expandedSections.has("objective")}
                onOpenChange={() => toggleSection("objective")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">Objective</span>
                    {expandedSections.has("objective") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 text-sm text-fg-muted">
                    {getFirstSentences(soapData.observations).map((sentence, idx) => (
                      <div key={idx}>{sentence}</div>
                    ))}
                    {!soapData.observations && <div>No content yet</div>}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Assessment */}
              <Collapsible
                open={expandedSections.has("assessment")}
                onOpenChange={() => toggleSection("assessment")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">Assessment</span>
                    {expandedSections.has("assessment") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 text-sm text-fg-muted">
                    {soapData.diagnoses.length > 0 ? (
                      soapData.diagnoses.map((diagnosis, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span>•</span>
                          <span>{diagnosis}</span>
                        </div>
                      ))
                    ) : (
                      getFirstSentences(soapData.assessment).map((sentence, idx) => (
                        <div key={idx}>{sentence}</div>
                      ))
                    )}
                    {!soapData.assessment && soapData.diagnoses.length === 0 && <div>No content yet</div>}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Plan */}
              <Collapsible
                open={expandedSections.has("plan")}
                onOpenChange={() => toggleSection("plan")}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">Plan</span>
                    {expandedSections.has("plan") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 text-sm text-fg-muted">
                    {getBulletPoints(soapData.plan).map((point, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                    {!soapData.plan && <div>No content yet</div>}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Medications/Supplements/Allergies Summary */}
              <div className="pt-2 border-t">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                        <span className="font-medium">Medications ({soapData.currentMeds.length})</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <div className="space-y-1 text-xs text-fg-muted">
                        {soapData.currentMeds.slice(0, 3).map((med, idx) => (
                          <div key={idx}>• {med}</div>
                        ))}
                        {soapData.currentMeds.length > 3 && (
                          <div>... and {soapData.currentMeds.length - 3} more</div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                        <span className="font-medium">Supplements ({soapData.supplements.length})</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <div className="space-y-1 text-xs text-fg-muted">
                        {soapData.supplements.slice(0, 3).map((supp, idx) => (
                          <div key={idx}>• {supp}</div>
                        ))}
                        {soapData.supplements.length > 3 && (
                          <div>... and {soapData.supplements.length - 3} more</div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                        <span className="font-medium">OTC ({soapData.otcs.length})</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <div className="space-y-1 text-xs text-fg-muted">
                        {soapData.otcs.slice(0, 3).map((otc, idx) => (
                          <div key={idx}>• {otc}</div>
                        ))}
                        {soapData.otcs.length > 3 && (
                          <div>... and {soapData.otcs.length - 3} more</div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0 justify-start">
                        <span className="font-medium">Allergies ({soapData.allergies.length})</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <div className="space-y-1 text-xs text-fg-muted">
                        {soapData.allergies.slice(0, 3).map((allergy, idx) => (
                          <div key={idx}>• {allergy}</div>
                        ))}
                        {soapData.allergies.length > 3 && (
                          <div>... and {soapData.allergies.length - 3} more</div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prescriptions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="h-4 w-4" />
                  <span className="font-medium">Prescriptions</span>
                </div>
                {rxOrders.length > 0 ? (
                  <div className="space-y-2">
                    {rxOrders.map((rx) => (
                      <div key={rx.id} className="flex items-center justify-between p-3 bg-surface rounded-md">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{rx.name}</div>
                          <div className="text-xs text-fg-muted">
                            {rx.sig} • Qty: {rx.qty} • Refills: {rx.refills}
                          </div>
                        </div>
                        {rx.status && (
                          <Badge variant="outline" className="text-xs">
                            {rx.status}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-fg-muted">No prescriptions yet</div>
                )}
              </div>

              {/* Lab Orders */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="h-4 w-4" />
                  <span className="font-medium">Lab Orders</span>
                </div>
                {labOrders.length > 0 ? (
                  <div className="space-y-2">
                    {labOrders.map((lab) => (
                      <div key={lab.id} className="p-3 bg-surface rounded-md">
                        <div className="space-y-1">
                          {lab.requests.map((request) => (
                            <div key={request.id} className="text-sm">
                              <span className="font-medium">{request.category}</span>
                              <span className="text-fg-muted">: {request.exams.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-fg-muted">No lab orders yet</div>
                )}
              </div>

              {/* Imaging Orders */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Scan className="h-4 w-4" />
                  <span className="font-medium">Imaging Orders</span>
                </div>
                {imagingOrders.length > 0 ? (
                  <div className="space-y-2">
                    {imagingOrders.map((imaging) => (
                      <div key={imaging.id} className="p-3 bg-surface rounded-md">
                        <div className="space-y-1">
                          {imaging.requests.map((request) => (
                            <div key={request.id} className="text-sm">
                              <span className="font-medium">{request.category}</span>
                              <span className="text-fg-muted">: {request.exams.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-fg-muted">No imaging orders yet</div>
                )}
              </div>

              {/* Outside Orders */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="font-medium">Outside Orders</span>
                </div>
                {outsideOrders.length > 0 ? (
                  <div className="space-y-2">
                    {outsideOrders.map((order) => (
                      <div key={order.id} className="p-3 bg-surface rounded-md">
                        {order.external && (
                          <div className="text-sm">
                            <span className="font-medium">External referral: </span>
                            <span className="text-fg-muted">{order.external.content}</span>
                          </div>
                        )}
                        {order.internal?.type === "specialty" && (
                          <div className="text-sm">
                            <span className="font-medium">Specialty: </span>
                            <span className="text-fg-muted">{order.internal.specialty}</span>
                          </div>
                        )}
                        {order.internal?.type === "provider" && order.internal.providers && (
                          <div className="text-sm">
                            <span className="font-medium">Internal referral: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {order.internal.providers.slice(0, 5).map((provider, providerIdx) => (
                                <div key={provider.id || providerIdx} className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={provider.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {provider.name.split(" ").map((n, idx) => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{provider.name}</span>
                                </div>
                              ))}
                              {order.internal.providers.length > 5 && (
                                <span className="text-xs text-fg-muted">
                                  +{order.internal.providers.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-fg-muted">No outside orders yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Private Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Private Clinician Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {privateNotes ? (
                <div className="text-sm text-fg-muted">
                  {getFirstSentences(privateNotes, 3).map((sentence, idx) => (
                    <div key={idx} className="mb-1">{sentence}</div>
                  ))}
                  {privateNotes.split(/[.!?]+/).length > 3 && (
                    <Button variant="ghost" size="sm" className="mt-2 h-auto p-0 text-xs">
                      View full notes
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-sm text-fg-muted">No private notes yet</div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-fg">Follow-up</div>
                <div className="text-sm text-fg-muted">
                  {followUp.date ? `${followUp.date}` : "None set"}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-fg">Patient Instructions</div>
                <div className="text-sm text-fg-muted">
                  {followUp.instructions || getBulletPoints(soapData.plan, 1)[0] || "—"}
                </div>
              </div>

              {followUp.tasks && followUp.tasks.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-fg">Tasks</div>
                  <div className="space-y-1">
                    {followUp.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-fg-muted">
                        <CheckCircle className="h-3 w-3" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-bg border-t p-4 mt-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setPreviewModalOpen(true)}
              className="flex items-center gap-2"
              disabled={locked}
            >
              <Eye className="h-4 w-4" />
              Preview Patient Summary
            </Button>
            
            <Button 
              onClick={() => setFinishModalOpen(true)}
              disabled={locked}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Finish Appointment
            </Button>
          </div>
        </div>

        {/* Patient Preview Modal */}
        <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">Visit Summary</h3>
                <p>{visitInfo.reasonForVisit || "Routine consultation"}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Key Findings</h3>
                {soapData.diagnoses.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {soapData.diagnoses.map((diagnosis, idx) => (
                      <li key={idx}>{diagnosis.replace(/\s*\([^)]*\)/, "")}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Your doctor will discuss the findings with you.</p>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Treatment Plan</h3>
                {getBulletPoints(soapData.plan).length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {getBulletPoints(soapData.plan).map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Your treatment plan will be discussed during the visit.</p>
                )}
              </div>

              {followUp.instructions && (
                <div>
                  <h3 className="font-medium mb-2">Instructions</h3>
                  <p>{followUp.instructions}</p>
                </div>
              )}

              {followUp.date && (
                <div>
                  <h3 className="font-medium mb-2">Follow-up</h3>
                  <p>Next appointment: {followUp.date}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Finish Appointment Modal */}
        <Dialog open={finishModalOpen} onOpenChange={setFinishModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finish Appointment</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-fg-muted">
                This will lock today's note and orders. You can still view them later.
              </p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setFinishModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFinishAppointment}>
                Finish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </TooltipProvider>
  );
}