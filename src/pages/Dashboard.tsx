import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import AddLabOrderScreen from "@/components/labs/AddLabOrderScreen";
import { PatientProfileDrawer } from "@/components/PatientProfileDrawer";
import { LabsImagingSideSheet } from "@/components/LabsImagingSideSheet";
import { DiagnosesMedsAllergiesSideSheet } from "@/components/DiagnosesMedsAllergiesSideSheet";
import { GoldCareAIPanel } from "@/components/GoldCareAIPanel";
import { PatientMiniCard } from "@/components/PatientMiniCard";
import { RightPanel } from "@/components/layout/RightPanel";
import { cn } from "@/lib/utils";

const mockPatient = {
  name: "Sarah Johnson",
  age: 34,
  location: "Naples, FL",
  membership: "Premium",
  avatar: ""
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("soap");
  const [sidebarMini, setSidebarMini] = useState(false);
  const [patientProfileDrawerOpen, setPatientProfileDrawerOpen] = useState(false);
  const [labsImagingSideSheetOpen, setLabsImagingSideSheetOpen] = useState(false);
  const [diagnosesMedsAllergiesSideSheetOpen, setDiagnosesMedsAllergiesSideSheetOpen] = useState(false);
  const [goldcareAIPanelOpen, setGoldcareAIPanelOpen] = useState(false);

  const handleJoinMeeting = () => {
    console.log("Joining meeting...");
  };

  const handleFinishAppointment = () => {
    console.log("Finishing appointment...");
  };

  const handleItemClick = (itemId: string) => {
    // Close all panels first
    setPatientProfileDrawerOpen(false);
    setLabsImagingSideSheetOpen(false);
    setDiagnosesMedsAllergiesSideSheetOpen(false);
    setGoldcareAIPanelOpen(false);
    
    // Open the selected panel
    if (itemId === "profile") {
      setPatientProfileDrawerOpen(true);
    } else if (itemId === "previous-results") {
      setLabsImagingSideSheetOpen(true);
    } else if (itemId === "diagnoses-meds-allergies") {
      setDiagnosesMedsAllergiesSideSheetOpen(true);
    } else if (itemId === "goldcare-ai") {
      setGoldcareAIPanelOpen(true);
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

  const hasRightSheet = labsImagingSideSheetOpen || diagnosesMedsAllergiesSideSheetOpen || patientProfileDrawerOpen || goldcareAIPanelOpen;

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      {/* Patient Mini Card */}
      <PatientMiniCard
        sidebarMini={sidebarMini}
        onToggleSidebar={() => setSidebarMini(!sidebarMini)}
        patient={mockPatient}
        timeLeft="45 minutes"
        onJoinMeeting={handleJoinMeeting}
        onFinishAppointment={handleFinishAppointment}
        onProfileClick={() => handleItemClick("profile")}
      />

      {/* Main Layout */}
      <div className={cn(
        "grid grid-cols-1",
        hasRightSheet 
          ? "md:grid-cols-[280px_minmax(0,1fr)_auto]" 
          : "md:grid-cols-[280px_minmax(0,1fr)]"
      )}>
        <aside className="md:w-[280px] shrink-0 border-r border-border">
          <AppSidebar 
            mini={sidebarMini}
            activeItem={activeSection}
            onItemClick={handleItemClick}
          />
        </aside>
        <main className="min-w-0">
          <div className="mx-auto w-full max-w-5xl px-6">
            {new URLSearchParams(window.location.search).get("labs") === "add" ? (
              <AddLabOrderScreen />
            ) : (
              <MainContent activeSection={activeSection} />
            )}
          </div>
        </main>
        
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
          {goldcareAIPanelOpen && (
            <GoldCareAIPanel />
          )}
        </RightPanel>
      </div>
    </div>
  );
}