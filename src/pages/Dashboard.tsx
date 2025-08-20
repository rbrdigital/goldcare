import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { PatientProfileDrawer } from "@/components/PatientProfileDrawer";
import { LabsImagingSideSheet } from "@/components/LabsImagingSideSheet";
import { DiagnosesMedsAllergiesSideSheet } from "@/components/DiagnosesMedsAllergiesSideSheet";
import { PatientMiniCard } from "@/components/PatientMiniCard";
import { RightPanel } from "@/components/layout/RightPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const mockPatient = {
  name: "Sarah Johnson",
  age: 34,
  location: "Seattle, WA",
  membership: "Premium",
  avatar: ""
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("soap");
  const [sidebarMini, setSidebarMini] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientProfileDrawerOpen, setPatientProfileDrawerOpen] = useState(false);
  const [labsImagingSideSheetOpen, setLabsImagingSideSheetOpen] = useState(false);
  const [diagnosesMedsAllergiesSideSheetOpen, setDiagnosesMedsAllergiesSideSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleJoinMeeting = () => {
    console.log("Joining meeting...");
  };

  const handleFinishAppointment = () => {
    console.log("Finishing appointment...");
  };

  const handleItemClick = (itemId: string) => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
    
    // Close all panels first
    setPatientProfileDrawerOpen(false);
    setLabsImagingSideSheetOpen(false);
    setDiagnosesMedsAllergiesSideSheetOpen(false);
    
    // Open the selected panel
    if (itemId === "profile") {
      setPatientProfileDrawerOpen(true);
    } else if (itemId === "previous-results") {
      setLabsImagingSideSheetOpen(true);
    } else if (itemId === "diagnoses-meds-allergies") {
      setDiagnosesMedsAllergiesSideSheetOpen(true);
    } else {
      setActiveSection(itemId);
    }
  };

  // Handle keyboard shortcuts and URL hash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        setLabsImagingSideSheetOpen(!labsImagingSideSheetOpen);
      }
      if ((e.altKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        setDiagnosesMedsAllergiesSideSheetOpen(!diagnosesMedsAllergiesSideSheetOpen);
      }
    };

    // Handle URL hash
    if (window.location.hash === "#prev-labs") {
      setLabsImagingSideSheetOpen(true);
    }
    if (window.location.hash === "#dma") {
      setDiagnosesMedsAllergiesSideSheetOpen(true);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [labsImagingSideSheetOpen, diagnosesMedsAllergiesSideSheetOpen]);

  const hasRightSheet = labsImagingSideSheetOpen || diagnosesMedsAllergiesSideSheetOpen || patientProfileDrawerOpen;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Patient Mini Card */}
      <PatientMiniCard
        sidebarMini={sidebarMini}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => isMobile ? setSidebarOpen(!sidebarOpen) : setSidebarMini(!sidebarMini)}
        patient={mockPatient}
        timeLeft="45 minutes"
        onJoinMeeting={handleJoinMeeting}
        onFinishAppointment={handleFinishAppointment}
        onProfileClick={() => handleItemClick("profile")}
      />

      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex-1 flex flex-col">
          {/* Mobile Sidebar Sheet */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-80 p-0">
              <AppSidebar 
                mini={false}
                activeItem={activeSection}
                onItemClick={handleItemClick}
                isMobile={true}
              />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <MainContent activeSection={activeSection} />

          {/* Mobile Right Panels as Full Screen Sheets */}
          <Sheet open={patientProfileDrawerOpen} onOpenChange={setPatientProfileDrawerOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg p-0">
              <PatientProfileDrawer
                isOpen={true}
                onClose={() => setPatientProfileDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={labsImagingSideSheetOpen} onOpenChange={setLabsImagingSideSheetOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg p-0">
              <LabsImagingSideSheet
                isOpen={true}
                onClose={() => setLabsImagingSideSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={diagnosesMedsAllergiesSideSheetOpen} onOpenChange={setDiagnosesMedsAllergiesSideSheetOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg p-0">
              <DiagnosesMedsAllergiesSideSheet
                isOpen={true}
                onClose={() => setDiagnosesMedsAllergiesSideSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        /* Desktop Layout - CSS Grid */
        <div className={cn(
          "flex-1 grid transition-all duration-200",
          hasRightSheet 
            ? "grid-cols-[280px_minmax(0,1fr)_auto]" 
            : "grid-cols-[280px_minmax(0,1fr)]"
        )}>
          {/* Left Sidebar */}
          <AppSidebar 
            mini={sidebarMini}
            activeItem={activeSection}
            onItemClick={handleItemClick}
          />

          {/* Main Content */}
          <MainContent activeSection={activeSection} />

          {/* Right Panel */}
          <RightPanel isOpen={hasRightSheet}>
            {patientProfileDrawerOpen && (
              <PatientProfileDrawer
                isOpen={true}
                onClose={() => setPatientProfileDrawerOpen(false)}
              />
            )}
            {labsImagingSideSheetOpen && (
              <LabsImagingSideSheet
                isOpen={true}
                onClose={() => setLabsImagingSideSheetOpen(false)}
              />
            )}
            {diagnosesMedsAllergiesSideSheetOpen && (
              <DiagnosesMedsAllergiesSideSheet
                isOpen={true}
                onClose={() => setDiagnosesMedsAllergiesSideSheetOpen(false)}
              />
            )}
          </RightPanel>
        </div>
      )}
    </div>
  );
}