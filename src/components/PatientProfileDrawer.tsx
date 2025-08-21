import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronRight, ExternalLink, Calendar, Pill, Stethoscope, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="h-full flex flex-col bg-surface">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-bg border-b border-border z-10">
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Patient Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">5 appointments • 1 year at GoldCare</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-bg">
        {/* My health journey */}
        <div className="space-y-4">
          <Collapsible 
            open={openSections.has("health-journey")}
            onOpenChange={() => toggleSection("health-journey")}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-foreground/80">
              {openSections.has("health-journey") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              My health journey
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                <p className="text-sm text-muted-foreground">Patient's health journey content would be displayed here.</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* About me */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">About me</h3>
          <div className="space-y-2 text-sm text-foreground">
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>My religion is Baptist</span>
              </div>
            </div>
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>Speaks English, French</span>
              </div>
            </div>
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>Adhere to a Vegetarian Diet</span>
              </div>
            </div>
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>I fast every morning and would like to pray before appointments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Health timeline</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Open all records
            </Button>
          </div>
          <div className="space-y-3">
            {/* Timeline item 1 */}
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Pill className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">03/30/25</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">Prescription Pack</Badge>
                    <Badge variant="secondary" className="text-xs">Medication</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    Ibuprofen Oral Tablet 600mg and Acetaminophen 3.2% Oral Elixir
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Provider: Jennifer Frangos, MD • Primary & Acute Care
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline item 2 */}
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 flex items-center justify-center mt-1">
                  <Calendar className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">03/30/25</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">Primary Care</Badge>
                    <Badge variant="secondary" className="text-xs">Appointment</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    Appointment completed to acquire the medical pack.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline item 3 */}
            <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center mt-1">
                  <Syringe className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">08/18/24</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">Pneumococcal</Badge>
                    <Badge variant="secondary" className="text-xs">Vaccine</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    Took the pneumococcal vaccine as a single dose via intramuscular or subcutaneous injection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite topics */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Favorite topics</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Yoga, meditation & mindfulness
            </Badge>
            <Badge variant="secondary">
              Nutrition & healthy recipes
            </Badge>
            <Badge variant="secondary">
              Gastronomy & cooking
            </Badge>
          </div>
        </div>

        {/* Previous providers */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Previous providers</h3>
          <div className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">Primary & Acute Care</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Jun 7th - 09:00 AM</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground">Walter Evans, MD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}