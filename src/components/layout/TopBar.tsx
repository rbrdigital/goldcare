import { Button } from "@/components/ui/button";
import { ArrowLeft, Minimize2, Maximize2 } from "lucide-react";
import { PatientMiniCard } from "@/components/PatientMiniCard";

interface TopBarProps {
  sidebarMini: boolean;
  onToggleSidebar: () => void;
  patient: {
    name: string;
    age: number;
    location: string;
    membership: string;
    avatar: string;
  };
  timeLeft: string;
  onJoinMeeting: () => void;
  onFinishAppointment: () => void;
}

export function TopBar({ 
  sidebarMini, 
  onToggleSidebar, 
  patient, 
  timeLeft, 
  onJoinMeeting, 
  onFinishAppointment 
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleSidebar}
          >
            {sidebarMini ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <PatientMiniCard
        patient={patient}
        timeLeft={timeLeft}
        onJoinMeeting={onJoinMeeting}
        onFinishAppointment={onFinishAppointment}
      />
    </div>
  );
}