import { GlassCard } from "./GlassCard";
import { 
  FileText, 
  Pill, 
  TestTube, 
  Camera, 
  Send, 
  Lock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface Capability {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  featured?: boolean;
  status?: "active" | "pending" | "none";
}

const capabilities: Capability[] = [
  {
    id: "soap",
    icon: FileText,
    title: "SOAP Notes",
    description: "AI-generated documentation built from real-time transcription, vitals, and previous entries. A new draft is ready for your review.",
    action: "Start Documenting",
    featured: true,
    status: "none"
  },
  {
    id: "rx",
    icon: Pill,
    title: "Prescriptions",
    description: "AI verified against prior notes and interaction database. Current: Lisinopril 10 mg daily, Metformin 500 mg BID, Omega-3 1 g daily.",
    action: "Write Prescription",
    featured: true,
    status: "active"
  },
  {
    id: "labs",
    icon: TestTube,
    title: "Lab Orders",
    description: "Comprehensive Metabolic Panel collected today; AI will auto-update once results are synced.",
    action: "Order Labs",
    status: "pending"
  },
  {
    id: "imaging",
    icon: Camera,
    title: "Imaging",
    description: "Request diagnostic studies with clear indication and urgency. None linked to this visit transcript.",
    action: "Request Imaging",
    status: "none"
  },
  {
    id: "referrals",
    icon: Send,
    title: "Referrals",
    description: "Generate referrals with attached transcript summary and clinical context. No referrals created yet.",
    action: "Create Referral",
    status: "none"
  },
  {
    id: "private",
    icon: Lock,
    title: "Private Notes",
    description: "Encrypted notes for your own planning and reflections. AI data excluded from this section.",
    action: "Open Workspace",
    featured: true,
    status: "none"
  }
];

export function CapabilityShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-fg">Clinical Capabilities</h2>

      {/* Grid layout with proper spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((capability, index) => {
          const Icon = capability.icon;
          const isHovered = hoveredId === capability.id;
          const isFeatured = capability.featured;

          return (
            <GlassCard
              key={capability.id}
              className={`
                p-6 cursor-pointer flex flex-col overflow-hidden
                animate-fade-in
                ${isFeatured ? "lg:col-span-1" : ""}
              `}
              hover
              onMouseEnter={() => setHoveredId(capability.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "backwards",
                minHeight: isFeatured ? "320px" : "240px"
              }}
            >
              {/* Header with icon and status */}
              <div className="flex items-start justify-between">
                <div 
                  className={`
                    p-3 rounded-lg bg-surface-muted border border-border
                    transition-all duration-300
                    ${isHovered ? "scale-110 border-gc-gold-500/30" : ""}
                  `}
                  style={{
                    filter: isHovered 
                      ? "drop-shadow(0 0 8px hsl(var(--gc-gold-500) / 0.2))"
                      : "none"
                  }}
                >
                  <Icon 
                    className={`
                      h-6 w-6 text-fg transition-all duration-300
                      ${isHovered ? "text-gc-gold-600" : ""}
                    `}
                  />
                </div>

                {/* Status indicator */}
                {capability.status !== "none" && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {capability.status === "active" && (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-medical-green" />
                        <span className="text-medical-green font-medium">Active</span>
                      </>
                    )}
                    {capability.status === "pending" && (
                      <>
                        <div className="h-2 w-2 rounded-full bg-medical-amber animate-pulse" />
                        <span className="text-medical-amber font-medium">Pending</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-semibold text-fg">
                  {capability.title}
                </h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {capability.description}
                </p>
              </div>


              {/* Action - appears on hover */}
              <div 
                className={`
                  flex items-center justify-between text-sm font-medium mt-4
                  transition-all duration-300
                  ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                `}
              >
                <span className="text-fg">{capability.action}</span>
                <ArrowRight className="h-4 w-4 text-gc-gold-500" />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
