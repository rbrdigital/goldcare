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
import PageContainer from "@/components/layout/PageContainer";
import ComboboxChips from "@/components/ui/ComboboxChips";
import { useConsultStore, type ImagingOrder as ConsultImagingOrder } from "@/store/useConsultStore";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { searchOrders, formatOrderDisplayName, type ImagingOrderData } from "@/data/imagingOrders";

// Types for additional studies with contrast
interface SelectedStudy {
  id: string;
  name: string;
  contrast: "yes" | "no" | "unsure" | null;
}

// Extended imaging order for local state management
interface ImagingOrder {
  id: string;
  diagnoses: string[];
  otherDx: string;
  commonStudies: string[];
  additionalStudies: SelectedStudy[];
}

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
  // Local state for imaging orders (could be moved to store later)
  const [imagingOrders, setImagingOrders] = React.useState<ImagingOrder[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<ImagingOrderData[]>([]);
  const [activeSearchOrder, setActiveSearchOrder] = React.useState<number | null>(null);

  // Convert TOP_DIAGNOSES to combobox format
  const diagnosisOptions = React.useMemo(
    () => TOP_DIAGNOSES.map(d => ({
      value: `${d.label} (${d.code})`,
      label: `${d.label} (${d.code})`
    })),
    []
  );

  // Initialize with one empty order
  React.useEffect(() => {
    if (imagingOrders.length === 0) {
      const newOrder: ImagingOrder = {
        id: crypto.randomUUID(),
        diagnoses: [],
        otherDx: "",
        commonStudies: [],
        additionalStudies: []
      };
      setImagingOrders([newOrder]);
    }
  }, [imagingOrders.length]);

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
    // Auto-save functionality placeholder
  };

  const addImagingOrder = () => {
    const newOrder: ImagingOrder = {
      id: crypto.randomUUID(),
      diagnoses: [],
      otherDx: "",
      commonStudies: [],
      additionalStudies: []
    };
    setImagingOrders(prev => [...prev, newOrder]);
  };

  const removeImagingOrder = (index: number) => {
    if (imagingOrders.length <= 1) return;
    setImagingOrders(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateImagingOrder = (index: number) => {
    const orderToDuplicate = imagingOrders[index];
    const duplicatedOrder: ImagingOrder = {
      ...orderToDuplicate,
      id: crypto.randomUUID(),
      additionalStudies: orderToDuplicate.additionalStudies.map(study => ({
        ...study,
        id: crypto.randomUUID()
      }))
    };
    setImagingOrders(prev => [...prev, duplicatedOrder]);
  };

  const updateImagingOrder = (index: number, updates: Partial<ImagingOrder>) => {
    setImagingOrders(prev => prev.map((order, i) => 
      i === index ? { ...order, ...updates } : order
    ));
  };

  const toggleCommonStudy = (orderIndex: number, study: string) => {
    const currentOrder = imagingOrders[orderIndex];
    const isSelected = currentOrder.commonStudies.includes(study);
    
    if (isSelected) {
      updateImagingOrder(orderIndex, {
        commonStudies: currentOrder.commonStudies.filter(s => s !== study)
      });
    } else {
      updateImagingOrder(orderIndex, {
        commonStudies: [...currentOrder.commonStudies, study]
      });
    }
  };

  const addAdditionalStudy = (orderIndex: number, studyName: string) => {
    const currentOrder = imagingOrders[orderIndex];
    
    // Check if study already exists
    const existsInCommon = currentOrder.commonStudies.includes(studyName);
    const existsInAdditional = currentOrder.additionalStudies.some(s => s.name === studyName);
    
    if (!existsInCommon && !existsInAdditional) {
      const newStudy: SelectedStudy = {
        id: crypto.randomUUID(),
        name: studyName,
        contrast: null
      };
      
      updateImagingOrder(orderIndex, {
        additionalStudies: [...currentOrder.additionalStudies, newStudy]
      });
    }
    
    setSearchTerm("");
    setActiveSearchOrder(null);
  };

  const removeAdditionalStudy = (orderIndex: number, studyId: string) => {
    const currentOrder = imagingOrders[orderIndex];
    updateImagingOrder(orderIndex, {
      additionalStudies: currentOrder.additionalStudies.filter(s => s.id !== studyId)
    });
  };

  const updateStudyContrast = (orderIndex: number, studyId: string, contrast: "yes" | "no" | "unsure") => {
    const currentOrder = imagingOrders[orderIndex];
    updateImagingOrder(orderIndex, {
      additionalStudies: currentOrder.additionalStudies.map(study => 
        study.id === studyId ? { ...study, contrast } : study
      )
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent, orderIndex: number) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault();
      addAdditionalStudy(orderIndex, searchTerm.trim());
    } else if (e.key === "Escape") {
      setSearchTerm("");
      setActiveSearchOrder(null);
    }
  };

  return (
    <TooltipProvider>
      <PageContainer>
        <div className="space-y-6">
          <PageHeader
            title="Imaging Orders"
            description="Create and manage imaging orders for your patients"
            icon={ImagingIcon}
            onSave={handleSave}
          />

          {imagingOrders.map((order, orderIndex) => (
            <div key={order.id} className="space-y-6">
              {/* Order header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Order #{orderIndex + 1}</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => duplicateImagingOrder(orderIndex)}
                  >
                    Duplicate
                  </Button>
                  {imagingOrders.length > 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => removeImagingOrder(orderIndex)}
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
                    selected={order.diagnoses}
                    onSelectionChange={(diagnoses) => updateImagingOrder(orderIndex, { diagnoses })}
                  />

                  <div>
                    <Label htmlFor={`other-${orderIndex}`}>Other (free text)</Label>
                    <AutosizeTextarea
                      id={`other-${orderIndex}`}
                      minRows={2}
                      placeholder="Describe additional clinical context"
                      value={order.otherDx}
                      onChange={(e) => updateImagingOrder(orderIndex, { otherDx: e.target.value })}
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
                    {COMMON_STUDIES.map((study) => (
                      <button
                        key={study}
                        type="button"
                        className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          order.commonStudies.includes(study)
                            ? 'border-primary bg-primary text-on-primary'
                            : 'border-border bg-surface hover:bg-surface-muted text-fg'
                        }`}
                        onClick={() => toggleCommonStudy(orderIndex, study)}
                      >
                        {study}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional studies search */}
                <div className="relative">
                  <Label htmlFor={`additional-search-${orderIndex}`}>Additional studies</Label>
                  <Input
                    id={`additional-search-${orderIndex}`}
                    type="text"
                    placeholder="Search for specific imaging studies..."
                    value={activeSearchOrder === orderIndex ? searchTerm : ""}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setActiveSearchOrder(orderIndex);
                    }}
                    onFocus={() => setActiveSearchOrder(orderIndex)}
                    onKeyDown={(e) => handleSearchKeyDown(e, orderIndex)}
                    autoComplete="off"
                  />
                  
                  {/* Search results dropdown */}
                  {activeSearchOrder === orderIndex && searchTerm && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.OrderID}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-surface-muted focus:bg-surface-muted focus-visible:outline-none"
                          onClick={() => addAdditionalStudy(orderIndex, formatOrderDisplayName(result))}
                        >
                          {formatOrderDisplayName(result)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected additional studies with contrast toggles */}
                {order.additionalStudies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm text-fg-muted">Selected studies</Label>
                    {order.additionalStudies.map((study) => (
                      <div key={study.id} className="flex items-center gap-2 p-2 bg-surface border border-border rounded-md">
                        <Badge variant="outline" className="flex-1">
                          {study.name}
                        </Badge>
                        
                        {/* Contrast toggle */}
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-fg-muted">Contrast:</span>
                        <Toggle
                          size="sm"
                          pressed={study.contrast === "yes"}
                          onPressedChange={(pressed) => 
                            updateStudyContrast(orderIndex, study.id, pressed ? "yes" : "no")
                          }
                          className="h-6 px-2 data-[state=on]:bg-medical-green data-[state=on]:text-white"
                        >
                          Yes
                        </Toggle>
                        <Toggle
                          size="sm"
                          pressed={study.contrast === "no"}
                          onPressedChange={(pressed) => 
                            updateStudyContrast(orderIndex, study.id, pressed ? "no" : "yes")
                          }
                          className="h-6 px-2"
                        >
                          No
                        </Toggle>
                        <Toggle
                          size="sm"
                          pressed={study.contrast === "unsure"}
                          onPressedChange={(pressed) => 
                            updateStudyContrast(orderIndex, study.id, pressed ? "unsure" : null)
                          }
                          className="h-6 px-2 data-[state=on]:bg-medical-amber data-[state=on]:text-white"
                        >
                            ?
                          </Toggle>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAdditionalStudy(orderIndex, study.id)}
                          className="text-fg-muted hover:text-fg focus-visible:outline-none p-1"
                          aria-label={`Remove ${study.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Order summary */}
              <section>
                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="font-medium mb-1">Order summary</div>
                  <div className="text-sm text-fg-muted leading-6">
                    {renderSummary(order)}
                  </div>
                </div>
              </section>

              {/* Separator between orders */}
              {orderIndex < imagingOrders.length - 1 && <Separator className="my-6" />}
            </div>
          ))}

          {/* Add another order */}
          <div className="mt-4">
            <Button variant="outline" className="text-sm" onClick={addImagingOrder}>
              + Add another imaging order
            </Button>
          </div>
        </div>
      </PageContainer>
    </TooltipProvider>
  );
}

function renderSummary(order: ImagingOrder) {
  const dxPart = order.diagnoses.length > 0 
    ? `Diagnoses: ${order.diagnoses.join("; ")}`
    : "Diagnoses: —";
  const otherPart = order.otherDx.trim() ? `; Notes: ${order.otherDx.trim()}` : "";
  
  const allStudies = [...order.commonStudies];
  order.additionalStudies.forEach(study => {
    let studyText = study.name;
    if (study.contrast) {
      studyText += ` (${study.contrast === "yes" ? "with contrast" : study.contrast === "no" ? "no contrast" : "contrast TBD"})`;
    }
    allStudies.push(studyText);
  });
  
  const studiesPart = allStudies.length > 0 
    ? allStudies.join(", ")
    : "No imaging studies selected";
    
  return `${dxPart}${otherPart}; Imaging: ${studiesPart}`;
}