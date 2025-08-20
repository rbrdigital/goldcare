import { Clock, Users, MapPin, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PatientMiniCardProps {
  patient: {
    name: string;
    age: number;
    location: string;
    membership: string;
    avatar?: string;
  };
  timeLeft: string;
  sidebarMini: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar: () => void;
  onJoinMeeting: () => void;
  onFinishAppointment: () => void;
  onProfileClick: () => void;
}

export function PatientMiniCard({ 
  patient, 
  timeLeft, 
  sidebarMini, 
  sidebarOpen, 
  onToggleSidebar, 
  onJoinMeeting, 
  onFinishAppointment,
  onProfileClick 
}: PatientMiniCardProps) {
  return (
    <div className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left side - Patient info with sidebar toggle */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onToggleSidebar}
            className="p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0 touch-manipulation"
            title={sidebarMini ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarMini || sidebarOpen ? (
              <ChevronRight className="h-4 w-4 text-fg-muted" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-fg-muted" />
            )}
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-1 touch-manipulation" onClick={onProfileClick}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-medical-blue-light flex items-center justify-center flex-shrink-0">
              {patient.avatar ? (
                <img src={patient.avatar} alt={patient.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              ) : (
                <span className="text-medical-blue font-semibold text-xs sm:text-sm">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-sm text-fg truncate">{patient.name}, {patient.age}</h2>
              <div className="flex items-center gap-1 sm:gap-2 text-xs text-fg-muted">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{patient.location}</span>
                <Shield className="h-3 w-3 ml-1 flex-shrink-0" />
                <span className="truncate">{patient.membership}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Time and actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-sm text-fg-muted">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              onClick={onJoinMeeting}
              size="sm" 
              className="bg-medical-green hover:bg-medical-green-dark text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 touch-manipulation"
            >
              <span className="hidden sm:inline">Join Meeting</span>
              <span className="sm:hidden">Join</span>
            </Button>
            <Button 
              onClick={onFinishAppointment}
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 touch-manipulation"
            >
              <span className="hidden sm:inline">Finish Appointment</span>
              <span className="sm:hidden">Finish</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
