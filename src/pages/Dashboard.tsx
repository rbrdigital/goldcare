import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { PatientProfileDrawer } from "@/components/PatientProfileDrawer";
import { LabsImagingSideSheet } from "@/components/LabsImagingSideSheet";
import { DiagnosesMedsAllergiesSideSheet } from "@/components/DiagnosesMedsAllergiesSideSheet";
import { GoldCareAIPanel } from "@/components/GoldCareAIPanel";
import { PatientMiniCard } from "@/components/PatientMiniCard";
import { MedicationWorkspace } from "@/components/MedicationWorkspace";
import { RightPanel } from "@/components/layout/RightPanel";
import { cn } from "@/lib/utils";
import { useConsultStore } from "@/store/useConsultStore";

const mockPatient = {
  name: "Sarah Johnson",
  age: 34,
  location: "Naples, FL",
  membership: "Premium",
  avatar: ""
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("summary");
  const [sidebarMini, setSidebarMini] = useState(false);
  const [patientProfileDrawerOpen, setPatientProfileDrawerOpen] = useState(false);
  const [labsImagingSideSheetOpen, setLabsImagingSideSheetOpen] = useState(false);
  const [diagnosesMedsAllergiesSideSheetOpen, setDiagnosesMedsAllergiesSideSheetOpen] = useState(false);
  const [goldcareAIPanelOpen, setGoldcareAIPanelOpen] = useState(false);
  const [medicationWorkspaceOpen, setMedicationWorkspaceOpen] = useState(false);

  const { initializeSession } = useConsultStore();

  // Initialize consult session on mount
  useEffect(() => {
    // In a real app, these would come from the patient context/route
    const patientId = "patient-sarah-johnson";
    const encounterId = `encounter-${Date.now()}`;
    initializeSession(patientId, encounterId);
  }, [initializeSession]);

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
    setMedicationWorkspaceOpen(false);
    
    // Open the selected panel or change section
    if (itemId === "profile") {
      setPatientProfileDrawerOpen(true);
    } else if (itemId === "previous-results") {
      setLabsImagingSideSheetOpen(true);
    } else if (itemId === "diagnoses-meds-allergies") {
      setDiagnosesMedsAllergiesSideSheetOpen(true);
    } else if (itemId === "goldcare-ai") {
      setGoldcareAIPanelOpen(true);
    } else {
      // For all other items (soap, rx, lab-orders, imaging-orders, etc.), just change the active section
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
      if ((e.altKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        setMedicationWorkspaceOpen(!medicationWorkspaceOpen);
      }
    };

    const handleMedicationWorkspaceEvent = () => {
      setMedicationWorkspaceOpen(true);
    };

    // Handle URL hash
    if (window.location.hash === "#prev-labs") {
      setLabsImagingSideSheetOpen(true);
    }
    if (window.location.hash === "#dma") {
      setDiagnosesMedsAllergiesSideSheetOpen(true);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("openMedicationWorkspace", handleMedicationWorkspaceEvent);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("openMedicationWorkspace", handleMedicationWorkspaceEvent);
    };
  }, [labsImagingSideSheetOpen, diagnosesMedsAllergiesSideSheetOpen, medicationWorkspaceOpen]);

  const hasRightSheet = labsImagingSideSheetOpen || diagnosesMedsAllergiesSideSheetOpen || patientProfileDrawerOpen || goldcareAIPanelOpen || medicationWorkspaceOpen;

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
        <main className="min-w-0 py-6">
          <MainContent activeSection={activeSection} />
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
          {medicationWorkspaceOpen && (
            <MedicationWorkspace
              isOpen={true}
              onClose={() => setMedicationWorkspaceOpen(false)}
            />
          )}
        </RightPanel>
      </div>
    </div>
  );
}