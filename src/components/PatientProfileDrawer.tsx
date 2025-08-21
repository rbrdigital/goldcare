import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, ExternalLink, Pill, Calendar, Shield, MapPin, Phone, Mail, User } from "lucide-react";

interface PatientProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthTimelineEntry {
  id: string;
  type: "prescription" | "appointment" | "vaccine";
  title: string;
  provider: string;
  date: string;
  details?: string;
}

const healthTimelineData: HealthTimelineEntry[] = [
  {
    id: "1",
    type: "appointment",
    title: "Annual Wellness Visit",
    provider: "Dr. Sarah Johnson",
    date: "2024-03-15",
    details: "Routine checkup, vitals stable"
  },
  {
    id: "2",
    type: "prescription",
    title: "Lisinopril 10mg",
    provider: "Dr. Sarah Johnson",
    date: "2024-03-10",
    details: "For blood pressure management"
  },
  {
    id: "3",
    type: "vaccine",
    title: "COVID-19 Booster",
    provider: "Walgreens Pharmacy",
    date: "2024-02-28",
    details: "Pfizer-BioNTech"
  },
  {
    id: "4",
    type: "appointment",
    title: "Telehealth Follow-up",
    provider: "Dr. Michael Chen",
    date: "2024-02-20",
    details: "Medication review"
  },
  {
    id: "5",
    type: "prescription",
    title: "Vitamin D3 2000 IU",
    provider: "Dr. Sarah Johnson",
    date: "2024-01-15",
    details: "Daily supplement"
  }
];

function TimelineIcon({ type }: { type: HealthTimelineEntry["type"] }) {
  const iconClass = "h-4 w-4";
  
  switch (type) {
    case "prescription":
      return <Pill className={`${iconClass} text-primary`} />;
    case "appointment":
      return <Calendar className={`${iconClass} text-success`} />;
    case "vaccine":
      return <Shield className={`${iconClass} text-warning`} />;
    default:
      return <Calendar className={`${iconClass} text-fg-muted`} />;
  }
}

function TimelineEntry({ entry }: { entry: HealthTimelineEntry }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type: HealthTimelineEntry["type"]) => {
    switch (type) {
      case "prescription":
        return "Prescription Pack";
      case "appointment":
        return "Appointment";
      case "vaccine":
        return "Vaccine";
      default:
        return "Event";
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg">
      <div className="flex-shrink-0 mt-0.5">
        <TimelineIcon type={entry.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-fg truncate">{entry.title}</h4>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {getTypeLabel(entry.type)}
          </Badge>
        </div>
        <p className="text-sm text-fg-muted mb-1">{entry.provider}</p>
        <p className="text-xs text-fg-muted">{formatDate(entry.date)}</p>
        {entry.details && (
          <p className="text-xs text-fg-muted mt-1">{entry.details}</p>
        )}
      </div>
    </div>
  );
}

export function PatientProfileDrawer({ isOpen, onClose }: PatientProfileDrawerProps) {
  const [activeSection, setActiveSection] = useState<string>("journey");

  if (!isOpen) return null;

  const sections = [
    { id: "journey", label: "Journey" },
    { id: "about", label: "About" },
    { id: "timeline", label: "Timeline" },
    { id: "topics", label: "Topics" },
    { id: "providers", label: "Providers" }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "journey":
        return (
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Sarah has been a GoldCare member for 2 years and actively participates in her health management through regular check-ups and preventive care.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-surface border border-border rounded-lg">
                <h4 className="text-sm font-semibold text-fg mb-1">Health Goals</h4>
                <ul className="text-sm text-fg-muted space-y-1">
                  <li>• Maintain healthy blood pressure</li>
                  <li>• Increase daily physical activity</li>
                  <li>• Improve sleep quality</li>
                </ul>
              </div>
              <div className="p-3 bg-surface border border-border rounded-lg">
                <h4 className="text-sm font-semibold text-fg mb-1">Recent Achievements</h4>
                <ul className="text-sm text-fg-muted space-y-1">
                  <li>• Completed annual wellness visit</li>
                  <li>• Up to date on preventive care</li>
                  <li>• Consistent medication adherence</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-fg-muted" />
                  <span className="text-fg-muted">Age:</span>
                  <span className="text-fg">34 years old</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-fg-muted" />
                  <span className="text-fg-muted">Location:</span>
                  <span className="text-fg">Seattle, WA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-fg-muted" />
                  <span className="text-fg-muted">Phone:</span>
                  <span className="text-fg">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-fg-muted" />
                  <span className="text-fg-muted">Email:</span>
                  <span className="text-fg">sarah.j@email.com</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-fg">Emergency Contact</h4>
                <div className="text-sm text-fg-muted">
                  <p>Michael Johnson (Spouse)</p>
                  <p>(555) 987-6543</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-fg">Preferences</h4>
                <div className="text-sm text-fg-muted space-y-1">
                  <p>• Baptist faith</p>
                  <p>• Speaks English, French</p>
                  <p>• Vegetarian diet</p>
                  <p>• Morning fasting, prefers prayer before appointments</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-fg-muted">Recent health events and activities</p>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-primary hover:text-primary/80 h-auto p-0"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open all records
              </Button>
            </div>
            <div className="space-y-3">
              {healthTimelineData.map((entry) => (
                <TimelineEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        );

      case "topics":
        return (
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Topics Sarah is interested in learning more about
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Yoga, meditation & mindfulness",
                "Nutrition & healthy recipes", 
                "Gastronomy & cooking",
                "Heart Health",
                "Stress Management",
                "Exercise",
                "Sleep Hygiene",
                "Preventive Care",
                "Mental Wellness"
              ].map((topic) => (
                <Badge 
                  key={topic}
                  variant="secondary" 
                  className="bg-surface text-fg border border-border"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        );

      case "providers":
        return (
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">Healthcare providers Sarah has worked with</p>
            <div className="space-y-3">
              {[
                { name: "Dr. Sarah Johnson", specialty: "Family Medicine", years: "2022-Present", lastVisit: "March 15, 2024" },
                { name: "Dr. Michael Chen", specialty: "Cardiology", years: "2023", lastVisit: "February 20, 2024" },
                { name: "Walter Evans, MD", specialty: "Primary & Acute Care", years: "2020-2022", lastVisit: "June 7, 2023" }
              ].map((provider, index) => (
                <div key={index} className="p-3 bg-surface border border-border rounded-lg">
                  <h4 className="text-sm font-semibold text-fg">{provider.name}</h4>
                  <p className="text-sm text-fg-muted">{provider.specialty}</p>
                  <p className="text-xs text-fg-muted">Active: {provider.years}</p>
                  <p className="text-xs text-fg-muted">Last visit: {provider.lastVisit}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <aside className="w-96 h-full bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-fg">Patient Profile</h3>
            <p className="text-xs text-fg-muted">Sarah Johnson • Premium Member</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-bg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderSectionContent()}
      </div>
    </aside>
  );
}