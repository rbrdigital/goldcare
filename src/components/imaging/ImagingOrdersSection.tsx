"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
// Custom imaging icon to match sidebar
const ImagingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M11.4234 6.81094H12.5765V7.96406H11.4234V6.81094ZM11.4234 9.11719H12.5765V10.2703H11.4234V9.11719ZM11.4234 13.7297V15.4594C11.4234 15.7769 11.6824 16.0359 12 16.0359C12.3175 16.0359 12.5765 15.7769 12.5765 15.4594V13.7297H11.4234ZM16.0359 5.65781H13.7297V6.81094H15.4593C16.0572 6.81094 16.5978 7.04556 17.0081 7.42029C17.1213 7.23963 17.189 7.03199 17.189 6.81094C17.189 6.17468 16.6722 5.65781 16.0359 5.65781ZM12 4.50469C11.6824 4.50469 11.4234 4.76368 11.4234 5.08125V5.65781H12.5765V5.08125C12.5765 4.76368 12.3175 4.50469 12 4.50469ZM11.4234 11.4234H12.5765V12.5766H11.4234V11.4234Z" fill="currentColor"/>
    <path d="M20.1103 2.19844L3.88966 2.16C2.93587 2.16 2.15997 2.9359 2.15997 3.88969V20.1103C2.15997 21.0641 2.93587 21.84 3.88966 21.84H20.1103C21.0641 21.84 21.84 21.0641 21.84 20.0719V3.88969C21.84 2.97434 21.0641 2.19844 20.1103 2.19844ZM17.7656 9.11719C17.7656 9.7421 17.5098 10.3201 17.0765 10.7486C17.1429 10.9634 17.189 11.1871 17.189 11.4234C17.189 12.6948 16.1541 13.7297 14.8828 13.7297C14.5641 13.7297 14.3062 13.4718 14.3062 13.1531C14.3062 12.8344 14.5641 12.5766 14.8828 12.5766C15.519 12.5766 16.0359 12.0597 16.0359 11.4234C16.0359 10.7872 15.519 10.2703 14.8828 10.2703H13.7297V14.8828H15.4593C16.4131 14.8828 17.189 15.6587 17.189 16.6125C17.189 17.4042 16.6395 18.0866 15.8524 18.2735C14.8288 18.5478 13.968 19.1606 13.3941 19.9424C13.0191 20.3996 12.518 20.6484 12 20.6484C11.4561 20.6484 10.9527 20.3838 10.6171 19.9221C9.99999 19.1147 9.11489 18.5325 8.13182 18.2926C7.33343 18.0663 6.81091 17.394 6.81091 16.6125C6.81091 15.6587 7.58681 14.8828 8.5406 14.8828H10.2703V10.2703H9.11716C8.48091 10.2703 7.96404 10.7872 7.96404 11.4234C7.96404 12.0597 8.48091 12.5766 9.11716 12.5766C9.43585 12.5766 9.69372 12.8344 9.69372 13.1531C9.69372 13.4718 9.43585 13.7297 9.11716 13.7297C7.8458 13.7297 6.81091 12.6948 6.81091 11.4234C6.81091 11.1871 6.857 10.9634 6.92346 10.7486C6.49011 10.3201 6.23435 9.7421 6.23435 9.11719C6.23435 8.88084 6.28044 8.65717 6.34689 8.4423C5.91355 8.01388 5.65779 7.43585 5.65779 6.81094C5.65779 5.53958 6.69268 4.50469 7.96404 4.50469H10.3765C10.6153 3.83499 11.2493 3.35156 12 3.35156C12.7507 3.35156 13.3846 3.83499 13.6235 4.50469H16.0359C17.3073 4.50469 18.3422 5.53958 18.3422 6.81094C18.3422 7.43585 18.0864 8.0138 17.6531 8.4423C17.7194 8.65717 17.7656 8.88084 17.7656 9.11719Z" fill="currentColor"/>
    <path d="M15.4593 7.96406H13.7297V9.11719H14.8828C15.4807 9.11719 16.0213 9.35181 16.4315 9.72654C16.5447 9.54588 16.6125 9.33824 16.6125 9.11719C16.6125 8.48093 16.0956 7.96406 15.4593 7.96406ZM15.4593 16.0359H13.6306C13.3929 16.7071 12.7522 17.1891 12 17.1891C11.2478 17.1891 10.607 16.7071 10.3694 16.0359H8.5406C8.22303 16.0359 7.96404 16.2949 7.96404 16.6125C7.96404 16.9132 8.19601 17.1136 8.42575 17.1778C9.64306 17.474 10.7568 18.2059 11.5416 19.2329C11.6182 19.3376 11.7669 19.4953 12 19.4953C12.2353 19.4953 12.4031 19.332 12.4831 19.2352C13.2001 18.2585 14.2936 17.4946 15.5708 17.1553C15.8107 17.099 16.0359 16.9109 16.0359 16.6125C16.0359 16.2949 15.7769 16.0359 15.4593 16.0359ZM7.96404 5.65781C7.32778 5.65781 6.81091 6.17468 6.81091 6.81094C6.81091 7.03195 6.87868 7.23971 6.99191 7.42029C7.40219 7.04556 7.9427 6.81094 8.5406 6.81094H10.2703V5.65781H7.96404ZM8.5406 7.96406C7.90434 7.96406 7.38747 8.48093 7.38747 9.11719C7.38747 9.3382 7.45524 9.54596 7.56848 9.72654C7.97876 9.35181 8.51927 9.11719 9.11716 9.11719H10.2703V7.96406H8.5406Z" fill="currentColor"/>
  </svg>
);

import ComboboxChips from "@/components/ui/ComboboxChips";
import { useConsultStore, type ImagingOrder as ConsultImagingOrder } from "@/store/useConsultStore";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { searchOrders, formatOrderDisplayName, type ImagingOrderData } from "@/data/imagingOrders";
import { AIImagingOrderBox } from "./AIImagingOrderBox";

// Top common ICD-10 diagnoses (same as Lab Orders for consistency)
const TOP_DIAGNOSES = [
  { code: "I10", label: "Essential (primary) hypertension" },
  { code: "E11.9", label: "Type 2 diabetes mellitus, without complications" },
  { code: "E78.5", label: "Hyperlipidemia, unspecified" },
  { code: "E03.9", label: "Hypothyroidism, unspecified" },
  { code: "J06.9", label: "Acute upper respiratory infection, unspecified" },
  { code: "J01.90", label: "Acute sinusitis, unspecified" },
  { code: "J02.9", label: "Acute pharyngitis, unspecified" },
  { code: "H66.90", label: "Otitis media, unspecified" },
  { code: "J20.9", label: "Acute bronchitis, unspecified" },
  { code: "R07.9", label: "Chest pain, unspecified" },
  { code: "R10.9", label: "Abdominal pain, unspecified" },
  { code: "M54.50", label: "Low back pain, unspecified" },
  { code: "F41.9", label: "Anxiety disorder, unspecified" },
  { code: "F32.A", label: "Depression, unspecified" },
  { code: "K21.9", label: "GERD without esophagitis" },
  { code: "J45.909", label: "Unspecified asthma, uncomplicated" },
  { code: "J44.9", label: "COPD, unspecified" },
  { code: "N39.0", label: "Urinary tract infection, site not specified" },
  { code: "R51.9", label: "Headache, unspecified" },
  { code: "G43.909", label: "Migraine, unspecified, not intractable" },
  { code: "M25.50", label: "Pain in unspecified joint" },
  { code: "M79.10", label: "Myalgia, unspecified site" },
  { code: "D64.9", label: "Anemia, unspecified" },
  { code: "E86.0", label: "Dehydration" },
  { code: "E87.6", label: "Hypokalemia" },
  { code: "E66.9", label: "Obesity, unspecified" },
  { code: "Z23", label: "Encounter for immunization" },
  { code: "Z20.822", label: "Exposure to COVID-19" },
  { code: "Z00.00", label: "Adult health check, no abnormal findings" },
  { code: "Z32.01", label: "Pregnancy test, positive result" },
];

// Common imaging studies for quick selection
const COMMON_STUDIES = [
  "Chest X-ray",
  "CT Head",
  "MRI Brain",
  "Ultrasound Abdomen",
  "CT Abdomen/Pelvis",
  "MRI Lumbar Spine",
  "Ultrasound Pelvis",
  "CT Chest",
  "X-ray Knee",
  "Ultrasound Carotid",
  "MRI Cervical Spine",
  "CT Angiogram"
];

export default function ImagingOrdersSection() {
  // Use the store for imaging orders to enable autosave
  const {
    imagingOrders,
    addImagingOrder,
    updateImagingOrder,
    removeImagingOrder,
    imagingOrdersPanelState,
    setImagingOrdersPanelState
  } = useConsultStore();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<ImagingOrderData[]>([]);
  const [activeSearchOrder, setActiveSearchOrder] = React.useState<number | null>(null);
  const [isDrafting, setIsDrafting] = React.useState(false);

  // Convert TOP_DIAGNOSES to combobox format
  const diagnosisOptions = React.useMemo(
    () => TOP_DIAGNOSES.map(d => ({
      value: `${d.label} (${d.code})`,
      label: `${d.label} (${d.code})`
    })),
    []
  );

  // Initialize with one empty order if no orders exist
  React.useEffect(() => {
    if (imagingOrders.length === 0) {
      const newOrder: ConsultImagingOrder = {
        id: crypto.randomUUID(),
        diagnosisCodes: [],
        diagnosisText: "",
        studies: [],
        notes: ""
      };
      addImagingOrder(newOrder);
    }
  }, [imagingOrders.length, addImagingOrder]);

  // Search imaging studies
  React.useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchOrders(searchTerm).slice(0, 10); // Limit to 10 results
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSave = () => {
    // Auto-save functionality placeholder - store already handles autosave
  };

  const addImagingOrderItem = () => {
    const newOrder: ConsultImagingOrder = {
      id: crypto.randomUUID(),
      diagnosisCodes: [],
      diagnosisText: "",
      studies: [],
      notes: ""
    };
    addImagingOrder(newOrder);
  };

  const removeImagingOrderItem = (index: number) => {
    if (imagingOrders.length <= 1) return;
    const orderToRemove = imagingOrders[index];
    removeImagingOrder(orderToRemove.id);
  };

  const duplicateImagingOrderItem = (index: number) => {
    const orderToDuplicate = imagingOrders[index];
    const duplicatedOrder: ConsultImagingOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID(),
      studies: orderToDuplicate.studies.map(study => ({
        ...study,
        id: crypto.randomUUID()
      }))
    };
    addImagingOrder(duplicatedOrder);
  };

  const updateImagingOrderItem = (index: number, updates: Partial<ConsultImagingOrder>) => {
    const orderToUpdate = imagingOrders[index];
    updateImagingOrder(orderToUpdate.id, updates);
  };

  const toggleCommonStudy = (orderIndex: number, studyName: string) => {
    const currentOrder = imagingOrders[orderIndex];
    const isSelected = currentOrder.studies.some(s => s.label === studyName);
    
    if (isSelected) {
      updateImagingOrderItem(orderIndex, {
        studies: currentOrder.studies.filter(s => s.label !== studyName)
      });
    } else {
      const newStudy = {
        id: crypto.randomUUID(),
        label: studyName,
        contrast: undefined as "yes" | "no" | "unsure" | undefined
      };
      updateImagingOrderItem(orderIndex, {
        studies: [...currentOrder.studies, newStudy]
      });
    }
  };

  const addAdditionalStudy = (orderIndex: number, studyName: string) => {
    const currentOrder = imagingOrders[orderIndex];
    
    // Check if study already exists
    const exists = currentOrder.studies.some(s => s.label === studyName);
    
    if (!exists) {
      const newStudy = {
        id: crypto.randomUUID(),
        label: studyName,
        contrast: undefined as "yes" | "no" | "unsure" | undefined
      };
      
      updateImagingOrderItem(orderIndex, {
        studies: [...currentOrder.studies, newStudy]
      });
    }
    
    // Clear search
    setSearchTerm("");
    setActiveSearchOrder(null);
  };

  const removeStudy = (orderIndex: number, studyId: string) => {
    const currentOrder = imagingOrders[orderIndex];
    updateImagingOrderItem(orderIndex, {
      studies: currentOrder.studies.filter(s => s.id !== studyId)
    });
  };

  const updateStudyContrast = (orderIndex: number, studyId: string, contrast: "yes" | "no" | "unsure") => {
    const currentOrder = imagingOrders[orderIndex];
    updateImagingOrderItem(orderIndex, {
      studies: currentOrder.studies.map(s => 
        s.id === studyId ? { ...s, contrast } : s
      )
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent, orderIndex: number) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      addAdditionalStudy(orderIndex, searchResults[0].OrderName);
    }
  };

  const focusSearchInput = (orderIndex: number) => {
    setActiveSearchOrder(orderIndex);
  };

  // AI parsing function to populate first imaging order
  const handleAIDraft = async (prompt: string) => {
    setIsDrafting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple parsing logic - in real implementation, this would use actual AI
    const parseDiagnoses = (text: string): string[] => {
      const dxMatches = text.match(/dx:\s*([^;]+)/i);
      if (dxMatches) {
        return dxMatches[1].split(/,|\sand\s/).map(d => d.trim()).filter(Boolean);
      }
      return [];
    };
    
    const parseStudies = (text: string): Array<{id: string; label: string; contrast?: "yes" | "no" | "unsure"}> => {
      const commonStudies = [
        'Chest X-ray', 'CT Head', 'MRI Brain', 'Ultrasound Abdomen', 
        'CT Abdomen/Pelvis', 'MRI Lumbar Spine', 'CT Chest'
      ];
      const foundStudies: Array<{id: string; label: string; contrast?: "yes" | "no" | "unsure"}> = [];
      
      commonStudies.forEach(study => {
        if (text.toLowerCase().includes(study.toLowerCase())) {
          let contrast: "yes" | "no" | "unsure" | undefined = undefined;
          
          // Parse contrast information
          if (text.toLowerCase().includes('without contrast') || text.toLowerCase().includes('w/o contrast')) {
            contrast = 'no';
          } else if (text.toLowerCase().includes('with contrast') || text.toLowerCase().includes('w/ contrast')) {
            contrast = 'yes';
          } else if (text.toLowerCase().includes('w/ and w/o')) {
            contrast = 'yes'; // Default to yes for w/ and w/o
          }
          
          foundStudies.push({
            id: crypto.randomUUID(),
            label: study,
            contrast
          });
        }
      });
      
      return foundStudies;
    };
    
    const parseNotes = (text: string): string => {
      const notes: string[] = [];
      if (text.toLowerCase().includes('stat')) {
        notes.push('STAT priority');
      }
      if (text.toLowerCase().includes('urgent')) {
        notes.push('Urgent priority');
      }
      if (text.toLowerCase().includes('trauma')) {
        notes.push('Trauma indication');
      }
      return notes.join('; ');
    };
    
    const diagnoses = parseDiagnoses(prompt);
    const studies = parseStudies(prompt);
    const notes = parseNotes(prompt);
    
    // Update the first imaging order (create one if none exists)  
    if (imagingOrders.length === 0) {
      const newOrder: ConsultImagingOrder = {
        id: crypto.randomUUID(),
        diagnosisCodes: diagnoses,
        diagnosisText: "",
        studies,
        notes
      };
      addImagingOrder(newOrder);
    } else {
      // Update first existing order
      const firstOrder = imagingOrders[0];
      updateImagingOrder(firstOrder.id, {
        diagnosisCodes: [...new Set([...firstOrder.diagnosisCodes, ...diagnoses])],
        studies: [...firstOrder.studies, ...studies],
        notes: firstOrder.notes ? `${firstOrder.notes}; ${notes}` : notes
      });
    }
    
    setIsDrafting(false);
    
    // Update panel state to show form
    setImagingOrdersPanelState('drafted');
  };

  const handleManualEntry = () => {
    // Show empty form for manual entry
    setImagingOrdersPanelState('manual');
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
          <PageHeader
            title="Imaging Orders"
            description="Create and manage imaging orders for your patients"
            icon={ImagingIcon}
            onSave={handleSave}
          />

          {/* AI Imaging Order Box - Only visible in ai-ready state */}
          {imagingOrdersPanelState === 'ai-ready' && (
            <>
              <AIImagingOrderBox 
                onDraft={handleAIDraft}
                isLoading={isDrafting}
              />
              <div className="text-center">
                <button
                  onClick={handleManualEntry}
                  className="text-sm text-fg-muted hover:text-fg hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Or fill the form manually
                </button>
              </div>
            </>
          )}

          {/* Form - Only visible after draft or manual entry */}
          {(imagingOrdersPanelState === 'drafted' || imagingOrdersPanelState === 'manual') && imagingOrders.map((order, orderIndex) => (
            <div key={order.id} className="space-y-6">
              {/* Imaging order section header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Order #{orderIndex + 1}</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => duplicateImagingOrderItem(orderIndex)}
                  >
                    Duplicate
                  </Button>
                  {imagingOrders.length > 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => removeImagingOrderItem(orderIndex)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          disabled
                        >
                          Remove
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Keep one draft order
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Clinical diagnosis */}
              <section>
                <h3 className="text-base font-medium mb-3">Clinical diagnosis</h3>
                <div className="space-y-4">
                  <ComboboxChips
                    id={`diagnoses-${orderIndex}`}
                    label="Common diagnoses"
                    placeholder="Search diagnoses or add custom text..."
                    options={diagnosisOptions}
                    selected={order.diagnosisCodes}
                    onSelectionChange={(diagnosisCodes) => updateImagingOrderItem(orderIndex, { diagnosisCodes })}
                  />

                  <div>
                    <Label htmlFor={`diagnosis-text-${orderIndex}`}>Additional diagnosis notes</Label>
                    <AutosizeTextarea
                      id={`diagnosis-text-${orderIndex}`}
                      minRows={2}
                      placeholder="Describe additional clinical context"
                      value={order.diagnosisText}
                      onChange={(e) => updateImagingOrderItem(orderIndex, { diagnosisText: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Imaging study selection */}
              <section>
                <h3 className="text-base font-medium mb-3">Imaging studies</h3>
                
                {/* Common studies pills */}
                <div className="mb-4">
                  <Label className="text-sm text-fg-muted mb-2 block">Common studies</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_STUDIES.map((study) => {
                      const isSelected = order.studies.some(s => s.label === study);
                      return (
                        <button
                          key={study}
                          type="button"
                          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                            isSelected
                              ? "bg-primary text-on-primary border-primary"
                              : "border-border bg-surface hover:bg-surface-muted"
                          }`}
                          onClick={() => toggleCommonStudy(orderIndex, study)}
                        >
                          {study}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional studies search */}
                <div className="mb-4">
                  <Label className="text-sm text-fg-muted mb-2 block">Additional studies</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search for imaging studies..."
                      value={activeSearchOrder === orderIndex ? searchTerm : ""}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => focusSearchInput(orderIndex)}
                      onKeyDown={(e) => handleSearchKeyDown(e, orderIndex)}
                    />
                    
                    {/* Search results dropdown */}
                    {activeSearchOrder === orderIndex && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-surface border border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
        {searchResults.map((result) => (
          <button
            key={result.OrderID}
                            className="w-full text-left px-3 py-2 hover:bg-surface-muted text-sm"
        onClick={() => addAdditionalStudy(orderIndex, result.OrderName)}
      >
        <div className="font-medium">{result.OrderName}</div>
        <div className="text-xs text-fg-muted">{result.Modality}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected studies list */}
                <div className="space-y-2">
                  {order.studies.map((study) => (
                    <div key={study.id} className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{study.label}</div>
                      </div>
                      
                      {/* Contrast toggle */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-fg-muted mr-1">Contrast:</span>
                        {["yes", "no", "unsure"].map((option) => (
                          <Toggle
                            key={option}
                            size="sm"
                            pressed={study.contrast === option}
                            onPressedChange={(pressed) => {
                              if (pressed) {
                                updateStudyContrast(orderIndex, study.id, option as "yes" | "no" | "unsure");
                              }
                            }}
                            className={`h-6 px-2 text-xs ${
                              study.contrast === option 
                                ? option === "yes" 
                                  ? "bg-medical-green text-white" 
                                  : option === "no"
                                  ? "bg-medical-amber text-white"
                                  : "bg-surface text-fg"
                                : ""
                            }`}
                          >
                            {option}
                          </Toggle>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeStudy(orderIndex, study.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  {order.studies.length === 0 && (
                    <p className="text-sm text-fg-muted py-3">No imaging studies selected.</p>
                  )}
                </div>
              </section>

              {/* Notes */}
              <section>
                <div>
                  <Label htmlFor={`notes-${orderIndex}`}>Additional notes</Label>
                  <AutosizeTextarea
                    id={`notes-${orderIndex}`}
                    minRows={2}
                    placeholder="Additional clinical notes or special instructions"
                    value={order.notes || ""}
                    onChange={(e) => updateImagingOrderItem(orderIndex, { notes: e.target.value })}
                  />
                </div>
              </section>

              {/* Summary card for this order */}
              <section>
                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="font-medium mb-1">Order summary</div>
                  <div className="text-sm text-fg-muted leading-6">
                    {renderSummary(order.diagnosisCodes, order.diagnosisText, order.studies, order.notes)}
                  </div>
                </div>
              </section>

              {/* Separator between orders */}
              {orderIndex < imagingOrders.length - 1 && <Separator className="my-6" />}
            </div>
          ))}

          {/* Add another order - Only visible when form is shown */}
          {(imagingOrdersPanelState === 'drafted' || imagingOrdersPanelState === 'manual') && (
            <div className="mt-4">
              <Button variant="outline" className="text-sm" onClick={addImagingOrderItem}>
                + Add another imaging order
              </Button>
            </div>
          )}
      </div>
    </TooltipProvider>
  );
}

function renderSummary(
  diagnosisCodes: string[], 
  diagnosisText: string, 
  studies: Array<{id: string; label: string; contrast?: "yes" | "no" | "unsure"}>,
  notes?: string
) {
  const dxPart = diagnosisCodes.length > 0 
    ? `Diagnoses: ${diagnosisCodes.join("; ")}`
    : "Diagnoses: —";
  const diagnosisTextPart = diagnosisText?.trim() ? `; Notes: ${diagnosisText.trim()}` : "";
  const studiesPart = studies.length > 0
    ? studies.map(s => `${s.label}${s.contrast ? ` (contrast: ${s.contrast})` : ""}`).join(", ")
    : "No imaging studies selected";
  const notesPart = notes?.trim() ? `; Additional notes: ${notes.trim()}` : "";
    
  return `${dxPart}${diagnosisTextPart}; Imaging: ${studiesPart}${notesPart}`;
}