import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { PatientProfileDrawer } from "@/components/PatientProfileDrawer";
import { LabsImagingSideSheet } from "@/components/LabsImagingSideSheet";
import { DiagnosesMedsAllergiesSideSheet } from "@/components/DiagnosesMedsAllergiesSideSheet";
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
    setMedicationWorkspaceOpen(false);
    
    // Open the selected panel or change section
    if (itemId === "profile") {
      setPatientProfileDrawerOpen(true);
    } else if (itemId === "previous-results") {
      setLabsImagingSideSheetOpen(true);
    } else if (itemId === "diagnoses-meds-allergies") {
      setDiagnosesMedsAllergiesSideSheetOpen(true);
    } else {
      // For all other items (soap, rx, lab-orders, imaging-orders, etc.), just change the active section
      setActiveSection(itemId);
    }
  };

  const handleNavigateToSection = (section: string) => {
    setActiveSection(section);
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

  const hasRightSheet = labsImagingSideSheetOpen || diagnosesMedsAllergiesSideSheetOpen || patientProfileDrawerOpen || medicationWorkspaceOpen;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Patient Mini Card - Fixed at top */}
      <PatientMiniCard
        sidebarMini={sidebarMini}
        onToggleSidebar={() => setSidebarMini(!sidebarMini)}
        patient={mockPatient}
        timeLeft="45 minutes"
        onJoinMeeting={handleJoinMeeting}
        onFinishAppointment={handleFinishAppointment}
        onProfileClick={() => handleItemClick("profile")}
      />

      {/* Main Layout - Fixed Sidebar + Scrollable Content */}
      <div className="flex-1 relative">
        {/* Fixed Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 bottom-0 z-30 border-r border-border bg-bg transition-all duration-200",
          sidebarMini ? "w-16" : "w-[280px]"
        )}>
          <AppSidebar 
            mini={sidebarMini}
            activeItem={activeSection}
            onItemClick={handleItemClick}
          />
        </aside>

        {/* Content Area with Left Margin for Fixed Sidebar */}
        <div className={cn(
          "transition-all duration-200",
          sidebarMini ? "ml-16" : "ml-[280px]"
        )}>
          <div className={cn(
            "grid grid-cols-1",
            hasRightSheet 
              ? "md:grid-cols-[minmax(0,1fr)_auto]" 
              : "md:grid-cols-[minmax(0,1fr)]"
          )}>
            <main className="min-w-0 py-6">
              <MainContent activeSection={activeSection} onNavigateToSection={handleNavigateToSection} />
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
              {medicationWorkspaceOpen && (
                <MedicationWorkspace
                  isOpen={true}
                  onClose={() => setMedicationWorkspaceOpen(false)}
                />
              )}
            </RightPanel>
          </div>
        </div>
      </div>
    </div>
  );
}