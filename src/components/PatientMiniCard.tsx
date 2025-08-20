import { Clock, Users, MapPin, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatientMiniCardProps {
  patient: {
    name: string;
    age: number;
    location: string;
    membership: string;
    avatar?: string;
  };
  timeLeft: string;
  onJoinMeeting: () => void;
  onFinishAppointment: () => void;
}

export function PatientMiniCard({ 
  patient, 
  timeLeft, 
  onJoinMeeting, 
  onFinishAppointment 
}: PatientMiniCardProps) {
  return (
    <div className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-medical-blue text-white flex items-center justify-center font-semibold">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{patient.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{patient.age}y</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{patient.location}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <Badge variant="secondary" className="h-5">
              <Shield className="h-3 w-3 mr-1" />
              {patient.membership}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Time left: {timeLeft}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onJoinMeeting}
              className="px-4 py-2 bg-medical-green hover:bg-medical-green/90 text-white rounded-md text-sm font-medium transition-colors"
            >
              Join Meeting
            </button>
            <button 
              onClick={onFinishAppointment}
              className="px-4 py-2 bg-button-primary text-button-primary-text hover:opacity-95 rounded-md text-sm font-medium transition-colors"
            >
              Finish Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
