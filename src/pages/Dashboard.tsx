import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { PatientProfileDrawer } from "@/components/PatientProfileDrawer";
import { LabsImagingSideSheet } from "@/components/LabsImagingSideSheet";
import { DiagnosesMedsAllergiesSideSheet } from "@/components/DiagnosesMedsAllergiesSideSheet";
import { PatientMiniCard } from "@/components/PatientMiniCard";
import { RightPanel } from "@/components/layout/RightPanel";
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
  const [patientProfileDrawerOpen, setPatientProfileDrawerOpen] = useState(false);
  const [labsImagingSideSheetOpen, setLabsImagingSideSheetOpen] = useState(false);
  const [diagnosesMedsAllergiesSideSheetOpen, setDiagnosesMedsAllergiesSideSheetOpen] = useState(false);

  const handleJoinMeeting = () => {
    console.log("Joining meeting...");
  };

  const handleFinishAppointment = () => {
    console.log("Finishing appointment...");
  };

  const handleItemClick = (itemId: string) => {
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

  const hasRightSheet = labsImagingSideSheetOpen || diagnosesMedsAllergiesSideSheetOpen;

  return (
    <div className={cn("min-h-screen bg-bg flex flex-col", hasRightSheet && "has-rightsheet")}>
      {/* Patient Mini Card */}
      <PatientMiniCard
        patient={mockPatient}
        timeLeft="45 minutes"
        onJoinMeeting={handleJoinMeeting}
        onFinishAppointment={handleFinishAppointment}
      />

      {/* Main Layout - CSS Grid */}
      <div className={cn(
        "flex-1 grid transition-all duration-200",
        hasRightSheet 
          ? "grid-cols-[280px_minmax(0,1fr)_auto] lg:grid-cols-[280px_minmax(0,1fr)_auto]" 
          : "grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]"
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

      {/* Patient Profile Drawer - Keep as overlay for now */}
      <PatientProfileDrawer 
        isOpen={patientProfileDrawerOpen}
        onClose={() => setPatientProfileDrawerOpen(false)}
      />
    </div>
  );
}