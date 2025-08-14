import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronRight, ExternalLink, Calendar, Pill, Stethoscope, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PatientProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PatientProfileDrawer({ isOpen, onClose }: PatientProfileDrawerProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["health-journey"]));

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[440px] bg-white border-l border-gray-200 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Patient Profile</h2>
            <Badge variant="secondary" className="mt-1 text-xs text-gray-600 bg-gray-100">
              5 appointments • 1 year at GoldCare
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* My health journey */}
            <Collapsible 
              open={openSections.has("health-journey")}
              onOpenChange={() => toggleSection("health-journey")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <h3 className="text-base font-medium text-gray-900">My health journey</h3>
                {openSections.has("health-journey") ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Patient's health journey content would be displayed here.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* About me */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">About me</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>My religion is Baptist</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>Speaks English, French</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>Adhere to a Vegetarian Diet</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                  <span>I fast every morning and would like to pray before appointments</span>
                </div>
              </div>
            </div>

            {/* Health timeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-gray-900">Health timeline</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Open all records
                </button>
              </div>
              <div className="space-y-4">
                {/* Timeline item 1 */}
                <div className="hover:bg-gray-50 rounded-md p-3 -m-3 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                      <Pill className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">03/30/25</span>
                        <span className="text-sm text-gray-500">•</span>
                        <Badge variant="outline" className="text-xs">Prescription Pack</Badge>
                        <Badge variant="secondary" className="text-xs">Medication</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Ibuprofen Oral Tablet 600mg and Acetaminophen 3.2% Oral Elixir
                      </p>
                      <p className="text-xs text-gray-500">
                        Provider: Jennifer Frangos, MD • Primary & Acute Care
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline item 2 */}
                <div className="hover:bg-gray-50 rounded-md p-3 -m-3 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">03/30/25</span>
                        <span className="text-sm text-gray-500">•</span>
                        <Badge variant="outline" className="text-xs">Primary Care</Badge>
                        <Badge variant="secondary" className="text-xs">Appointment</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Appointment completed to acquire the medical pack.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline item 3 */}
                <div className="hover:bg-gray-50 rounded-md p-3 -m-3 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                      <Syringe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">08/18/24</span>
                        <span className="text-sm text-gray-500">•</span>
                        <Badge variant="outline" className="text-xs">Pneumococcal</Badge>
                        <Badge variant="secondary" className="text-xs">Vaccine</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Took the pneumococcal vaccine as a single dose via intramuscular or subcutaneous injection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite topics */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">Favorite topics</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Yoga, meditation & mindfulness
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Nutrition & healthy recipes
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Gastronomy & cooking
                </Badge>
              </div>
            </div>

            {/* Previous providers */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">Previous providers</h3>
              <div className="hover:bg-gray-50 rounded-md p-3 -m-3 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">Primary & Acute Care</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">Jun 7th - 09:00 AM</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-700">Walter Evans, MD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}