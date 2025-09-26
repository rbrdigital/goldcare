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
import { Camera } from "lucide-react";
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
            icon={Camera}
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