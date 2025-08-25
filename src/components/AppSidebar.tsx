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
import { GoldCareAIIcon } from "@/components/icons/GoldCareAIIcon";
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
  { id: "imaging-orders", label: "Imaging Orders", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M11.4234 6.81094H12.5765V7.96406H11.4234V6.81094ZM11.4234 9.11719H12.5765V10.2703H11.4234V9.11719ZM11.4234 13.7297V15.4594C11.4234 15.7769 11.6824 16.0359 12 16.0359C12.3175 16.0359 12.5765 15.7769 12.5765 15.4594V13.7297H11.4234ZM16.0359 5.65781H13.7297V6.81094H15.4593C16.0572 6.81094 16.5978 7.04556 17.0081 7.42029C17.1213 7.23963 17.189 7.03199 17.189 6.81094C17.189 6.17468 16.6722 5.65781 16.0359 5.65781ZM12 4.50469C11.6824 4.50469 11.4234 4.76368 11.4234 5.08125V5.65781H12.5765V5.08125C12.5765 4.76368 12.3175 4.50469 12 4.50469ZM11.4234 11.4234H12.5765V12.5766H11.4234V11.4234Z" fill="currentColor"/><path d="M20.1103 2.19844L3.88966 2.16C2.93587 2.16 2.15997 2.9359 2.15997 3.88969V20.1103C2.15997 21.0641 2.93587 21.84 3.88966 21.84H20.1103C21.0641 21.84 21.84 21.0641 21.84 20.0719V3.88969C21.84 2.97434 21.0641 2.19844 20.1103 2.19844ZM17.7656 9.11719C17.7656 9.7421 17.5098 10.3201 17.0765 10.7486C17.1429 10.9634 17.189 11.1871 17.189 11.4234C17.189 12.6948 16.1541 13.7297 14.8828 13.7297C14.5641 13.7297 14.3062 13.4718 14.3062 13.1531C14.3062 12.8344 14.5641 12.5766 14.8828 12.5766C15.519 12.5766 16.0359 12.0597 16.0359 11.4234C16.0359 10.7872 15.519 10.2703 14.8828 10.2703H13.7297V14.8828H15.4593C16.4131 14.8828 17.189 15.6587 17.189 16.6125C17.189 17.4042 16.6395 18.0866 15.8524 18.2735C14.8288 18.5478 13.968 19.1606 13.3941 19.9424C13.0191 20.3996 12.518 20.6484 12 20.6484C11.4561 20.6484 10.9527 20.3838 10.6171 19.9221C9.99999 19.1147 9.11489 18.5325 8.13182 18.2926C7.33343 18.0663 6.81091 17.394 6.81091 16.6125C6.81091 15.6587 7.58681 14.8828 8.5406 14.8828H10.2703V10.2703H9.11716C8.48091 10.2703 7.96404 10.7872 7.96404 11.4234C7.96404 12.0597 8.48091 12.5766 9.11716 12.5766C9.43585 12.5766 9.69372 12.8344 9.69372 13.1531C9.69372 13.4718 9.43585 13.7297 9.11716 13.7297C7.8458 13.7297 6.81091 12.6948 6.81091 11.4234C6.81091 11.1871 6.857 10.9634 6.92346 10.7486C6.49011 10.3201 6.23435 9.7421 6.23435 9.11719C6.23435 8.88084 6.28044 8.65717 6.34689 8.4423C5.91355 8.01388 5.65779 7.43585 5.65779 6.81094C5.65779 5.53958 6.69268 4.50469 7.96404 4.50469H10.3765C10.6153 3.83499 11.2493 3.35156 12 3.35156C12.7507 3.35156 13.3846 3.83499 13.6235 4.50469H16.0359C17.3073 4.50469 18.3422 5.53958 18.3422 6.81094C18.3422 7.43585 18.0864 8.0138 17.6531 8.4423C17.7194 8.65717 17.7656 8.88084 17.7656 9.11719Z" fill="currentColor"/><path d="M15.4593 7.96406H13.7297V9.11719H14.8828C15.4807 9.11719 16.0213 9.35181 16.4315 9.72654C16.5447 9.54588 16.6125 9.33824 16.6125 9.11719C16.6125 8.48093 16.0956 7.96406 15.4593 7.96406ZM15.4593 16.0359H13.6306C13.3929 16.7071 12.7522 17.1891 12 17.1891C11.2478 17.1891 10.607 16.7071 10.3694 16.0359H8.5406C8.22303 16.0359 7.96404 16.2949 7.96404 16.6125C7.96404 16.9132 8.19601 17.1136 8.42575 17.1778C9.64306 17.474 10.7568 18.2059 11.5416 19.2329C11.6182 19.3376 11.7669 19.4953 12 19.4953C12.2353 19.4953 12.4031 19.332 12.4831 19.2352C13.2001 18.2585 14.2936 17.4946 15.5708 17.1553C15.8107 17.099 16.0359 16.9109 16.0359 16.6125C16.0359 16.2949 15.7769 16.0359 15.4593 16.0359ZM7.96404 5.65781C7.32778 5.65781 6.81091 6.17468 6.81091 6.81094C6.81091 7.03195 6.87868 7.23971 6.99191 7.42029C7.40219 7.04556 7.9427 6.81094 8.5406 6.81094H10.2703V5.65781H7.96404ZM8.5406 7.96406C7.90434 7.96406 7.38747 8.48093 7.38747 9.11719C7.38747 9.3382 7.45524 9.54596 7.56848 9.72654C7.97876 9.35181 8.51927 9.11719 9.11716 9.11719H10.2703V7.96406H8.5406Z" fill="currentColor"/></svg>, href: "#imaging-orders" },
  { id: "outside-orders", label: "Outside Orders", icon: <Upload className="h-4 w-4" />, href: "#outside-orders" },
  { id: "private-notes", label: "Private Clinician Notes", icon: <StickyNote className="h-4 w-4" />, href: "#private-notes" }
];

const patientDataItems: SidebarItem[] = [
  { id: "goldcare-ai", label: "GoldCare AI", icon: <GoldCareAIIcon className="h-4 w-4" />, href: "#goldcare-ai", isNew: true },
  { id: "intake", label: "Intake Form", icon: <ClipboardList className="h-4 w-4" />, href: "#intake", attention: true },
  { id: "diagnoses-meds-allergies", label: "Diagnoses, Meds, Allergies", icon: <Stethoscope className="h-4 w-4" />, href: "#diagnoses" },
  { id: "previous-results", label: "Previous Labs & Imaging Results", icon: <Activity className="h-4 w-4" />, href: "#previous-results", count: 3 },
  { id: "history", label: "Family & Surgical History", icon: <Users className="h-4 w-4" />, href: "#history" },
  { id: "profile", label: "Patient Profile", icon: <User className="h-4 w-4" />, href: "#profile" },
  { id: "accommodation", label: "Accommodation & Notes", icon: <FileBarChart className="h-4 w-4" />, href: "#accommodation" }
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
    // Don't allow toggling the "chart" section - keep it permanently open
    if (sectionId === "chart") return;
    
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
    <aside className="w-[264px] border-r bg-background flex flex-col">
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
              className={cn(
                "w-full flex items-center justify-between p-4 text-left transition-colors",
                section.id === "chart" ? "cursor-default" : "hover:bg-muted/50"
              )}
            >
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h3>
              {section.id !== "chart" && (
                <>
                  {openSections.has(section.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </>
              )}
            </button>

            {(openSections.has(section.id) || section.id === "chart") && (
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
  // Don't show active state for drawer items like patient profile, labs & imaging, diagnoses, goldcare-ai
  const showActive = !["profile", "previous-results", "diagnoses-meds-allergies", "goldcare-ai"].includes(item.id) && isActive;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group",
        showActive 
          ? "bg-medical-blue-light text-medical-blue font-medium" 
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