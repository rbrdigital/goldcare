import { useState } from "react";
import { 
  FileText, 
  Pill, 
  FlaskConical, 
  Scan, 
  Upload, 
  StickyNote,
  ClipboardList,
  Stethoscope,
  Activity,
  Users,
  FileBarChart,
  User,
  Settings,
  UserCheck,
  AlertTriangle,
  Calendar,
  XCircle,
  Search,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  count?: number;
  dirty?: boolean;
  attention?: boolean;
  disabled?: boolean;
  isNew?: boolean;
}

interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

const clinicalItems: SidebarItem[] = [
  { id: "soap", label: "SOAP Note", icon: <FileText className="h-4 w-4" />, href: "#soap", dirty: true },
  { id: "rx", label: "RX", icon: <Pill className="h-4 w-4" />, href: "#rx" },
  { id: "lab-orders", label: "Lab Orders", icon: <FlaskConical className="h-4 w-4" />, href: "#lab-orders", count: 2 },
  { id: "imaging-orders", label: "Imaging Orders", icon: <Scan className="h-4 w-4" />, href: "#imaging-orders" },
  { id: "outside-orders", label: "Outside Orders", icon: <Upload className="h-4 w-4" />, href: "#outside-orders" },
  { id: "private-notes", label: "Private Clinician Notes", icon: <StickyNote className="h-4 w-4" />, href: "#private-notes" }
];

const patientDataItems: SidebarItem[] = [
  { id: "intake", label: "Intake Form", icon: <ClipboardList className="h-4 w-4" />, href: "#intake", attention: true },
  { id: "diagnoses", label: "Diagnoses, Meds, Allergies", icon: <Stethoscope className="h-4 w-4" />, href: "#diagnoses" },
  { id: "previous-results", label: "Previous Labs & Imaging Results", icon: <Activity className="h-4 w-4" />, href: "#previous-results", count: 3, isNew: true },
  { id: "history", label: "Family & Surgical History", icon: <Users className="h-4 w-4" />, href: "#history" },
  { id: "profile", label: "Patient Profile", icon: <User className="h-4 w-4" />, href: "#profile" },
  { id: "accommodation", label: "Patient Accommodation & Notes", icon: <FileBarChart className="h-4 w-4" />, href: "#accommodation" }
];

const manageApptItems: SidebarItem[] = [
  { id: "adjust-member", label: "Adjust Member Information", icon: <UserCheck className="h-4 w-4" />, href: "#adjust-member" },
  { id: "change-family", label: "Change Family Member", icon: <Users className="h-4 w-4" />, href: "#change-family" },
  { id: "cancel", label: "Cancel Appointment", icon: <XCircle className="h-4 w-4" />, href: "#cancel" },
  { id: "no-show", label: "No-show", icon: <Calendar className="h-4 w-4" />, href: "#no-show", disabled: true },
  { id: "report-error", label: "Report Error to Manager", icon: <AlertTriangle className="h-4 w-4" />, href: "#report-error" }
];

const sections: SidebarSection[] = [
  { id: "chart", title: "Patient Chart", items: [...clinicalItems, ...patientDataItems], defaultOpen: true },
  { id: "appointment", title: "Manage Appointment", items: manageApptItems, defaultOpen: false }
];

interface AppSidebarProps {
  mini?: boolean;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export function AppSidebar({ mini = false, activeItem = "soap", onItemClick }: AppSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultOpen).map(s => s.id))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      searchQuery === "" || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  if (mini) {
    return (
      <aside className="w-16 border-r bg-background flex flex-col">
        <div className="p-2 space-y-1">
          {clinicalItems.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center relative group transition-colors",
                activeItem === item.id 
                  ? "bg-medical-blue text-white" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
                item.disabled && "opacity-40 pointer-events-none"
              )}
              title={item.label}
            >
              {item.icon}
              {item.dirty && <div className="absolute -top-1 -right-1 w-3 h-3 bg-medical-blue rounded-full" />}
              {item.attention && <div className="absolute -top-1 -right-1 w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-medical-amber" />}
              {item.count && (
                <Badge className="absolute -top-2 -right-2 h-5 min-w-5 text-xs p-0 flex items-center justify-center">
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-r bg-background flex flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chart (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-md text-sm border-0 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSections.map((section) => (
          <div key={section.id} className="border-b last:border-b-0">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h3>
              {openSections.has(section.id) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {openSections.has(section.id) && (
              <div className="pb-2">
                {section.id === "chart" && (
                  <>
                    <div className="px-4 pb-2">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                        Clinical Entries
                      </div>
                      {clinicalItems.map((item) => (
                        <SidebarItem
                          key={item.id}
                          item={item}
                          isActive={activeItem === item.id}
                          onClick={() => handleItemClick(item.id)}
                        />
                      ))}
                    </div>
                    <div className="px-4">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                        Patient Data
                      </div>
                      {patientDataItems.map((item) => (
                        <SidebarItem
                          key={item.id}
                          item={item}
                          isActive={activeItem === item.id}
                          onClick={() => handleItemClick(item.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {section.id === "appointment" && (
                  <div className="px-4">
                    {section.items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        isActive={activeItem === item.id}
                        onClick={() => handleItemClick(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
  // Don't show active state for drawer items like patient profile
  const showActive = item.id !== "profile" && isActive;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group",
        showActive 
          ? "bg-medical-blue-light text-medical-blue font-medium border-l-4 border-l-medical-blue" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        item.disabled && "opacity-40 pointer-events-none"
      )}
    >
      <div className="flex-shrink-0">
        {item.icon}
      </div>
      <span className="flex-1 text-left truncate">{item.label}</span>
      
      <div className="flex items-center gap-1">
        {item.count && (
          <Badge variant="secondary" className="h-5 text-xs px-2">
            {item.count}
          </Badge>
        )}
        {item.isNew && (
          <Badge className="h-5 text-xs px-2 bg-medical-green text-white">
            New
          </Badge>
        )}
        {item.dirty && (
          <div className="w-2 h-2 rounded-full bg-medical-blue" />
        )}
        {item.attention && (
          <div className="w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-medical-amber" />
        )}
      </div>
    </button>
  );
}