import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { PatientMiniCard } from "@/components/PatientMiniCard";
import { MainContent } from "@/components/MainContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minimize2, Maximize2 } from "lucide-react";

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

  const handleJoinMeeting = () => {
    console.log("Joining meeting...");
  };

  const handleFinishAppointment = () => {
    console.log("Finishing appointment...");
  };

  const handleItemClick = (itemId: string) => {
    setActiveSection(itemId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Queue
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarMini(!sidebarMini)}
            >
              {sidebarMini ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <PatientMiniCard
          patient={mockPatient}
          timeLeft="45 minutes"
          onJoinMeeting={handleJoinMeeting}
          onFinishAppointment={handleFinishAppointment}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">
        <AppSidebar 
          mini={sidebarMini}
          activeItem={activeSection}
          onItemClick={handleItemClick}
        />
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
}