import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Bot, Check, Edit3, RefreshCw, ChevronDown, ChevronUp, 
  FileText, Stethoscope, Pill, TestTube, Send, Settings, 
  AlertTriangle, ExternalLink, Clock, User, Activity,
  Sparkles, ArrowRight, MoreHorizontal, Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Types
type ProvenanceItem =
  | { type: "transcript"; ts: string; text?: string }
  | { type: "intake"; question: string; answer: string }
  | { type: "prior_note"; date: string; author?: string }
  | { type: "lab"; loinc: string; value?: string; date?: string };

type SafetyItem = { severity: "info" | "warning" | "error"; code: string; msg: string };

type SuggestedOrder = { loinc: string; name: string; dx: string[] };

type SuggestedRx = { rxnorm: string; drug: string; sig: string; qty: number; refills: number };

type BlockType =
  | "chief_hpi" | "ros" | "med_recon" | "allergy_recon" | "pe"
  | "assessment" | "plan" | "orders" | "rx" | "referrals"
  | "patient_summary" | "coding";

type Block = {
  block_id: string;
  type: BlockType;
  title: string;
  content_md: string;
  rationale?: string;
  suggested_orders?: SuggestedOrder[];
  suggested_rx?: SuggestedRx[];
  safety?: SafetyItem[];
  provenance?: ProvenanceItem[];
  accept_actions?: { write?: string; stage?: "orders" | "rx" | "referrals" | "instructions" | "superbill" }[];
};

// Mock data
const mockBlocks: Block[] = [
  { 
    block_id: "chief-complaint", 
    type: "chief_hpi", 
    title: "Chief Complaint & History", 
    content_md: "Patient reports 3 days of worsening cough and wheeze, predominantly at night. No fever or chest pain. Previously well-controlled asthma.", 
    rationale: "Synthesized from patient interview",
    provenance: [
      { type: "transcript", ts: "02:15", text: "cough getting worse at night" },
      { type: "intake", question: "Current symptoms?", answer: "Cough, wheeze" }
    ]
  },
  { 
    block_id: "assessment", 
    type: "assessment", 
    title: "Clinical Assessment", 
    content_md: "• Asthma exacerbation (moderate severity)\n• Likely triggered by recent URI\n• Currently stable, responsive to bronchodilators", 
    rationale: "Based on clinical presentation and exam findings",
    safety: [{ severity: "info", code: "STABLE", msg: "Patient is clinically stable" }],
    provenance: [{ type: "prior_note", date: "2024-08-15", author: "Dr. Smith" }]
  },
  { 
    block_id: "treatment-plan", 
    type: "plan", 
    title: "Treatment Plan", 
    content_md: "• Increase controller therapy: Budesonide/Formoterol 160/4.5 mcg BID\n• Continue rescue inhaler as needed\n• Follow up in 2 weeks\n• Peak flow monitoring daily", 
    suggested_rx: [
      { rxnorm: "617314", drug: "Budesonide/Formoterol 160/4.5", sig: "2 puffs BID", qty: 1, refills: 2 }
    ],
    suggested_orders: [
      { loinc: "33747-0", name: "Peak flow rate", dx: ["J45.901"] }
    ],
    provenance: [{ type: "intake", question: "Current medications?", answer: "Albuterol PRN" }]
  }
];

// Utility components
const CodePill = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "blue" | "green" | "amber" }) => (
  <span className={`
    inline-flex items-center px-2 py-1 rounded-md text-xs font-mono
    ${variant === "blue" ? "bg-medical-blue/10 text-medical-blue border border-medical-blue/20" : ""}
    ${variant === "green" ? "bg-medical-green/10 text-medical-green border border-medical-green/20" : ""}
    ${variant === "amber" ? "bg-medical-amber/10 text-medical-amber border border-medical-amber/20" : ""}
    ${variant === "default" ? "bg-surface border border-border text-fg-muted" : ""}
  `}>
    {children}
  </span>
);

const getSafetyVariant = (severity: string) => {
  switch (severity) {
    case "error": return "amber";
    case "warning": return "amber";
    default: return "blue";
  }
};

// Main component
export function GoldCareAISection() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [streaming, setStreaming] = useState<boolean>(true);

  const commitEnabled = Object.values(accepted).some(Boolean);

  // Stage collectors
  const staged = useMemo(() => {
    const orders: SuggestedOrder[] = [];
    const rx: SuggestedRx[] = [];
    const referrals: string[] = [];
    const instructions: string[] = [];
    const superbill: string[] = [];
    
    blocks.forEach(b => {
      if (!accepted[b.block_id]) return;
      if (b.suggested_orders) orders.push(...b.suggested_orders);
      if (b.suggested_rx) rx.push(...b.suggested_rx);
      if (b.type === "referrals") referrals.push(b.content_md);
      if (b.type === "patient_summary") instructions.push(b.content_md);
      if (b.type === "coding") superbill.push(b.content_md);
    });
    
    return { orders, rx, referrals, instructions, superbill };
  }, [blocks, accepted]);

  // Simulate streaming blocks
  useEffect(() => {
    let i = 0;
    setBlocks([]);
    setStreaming(true);
    const id = setInterval(() => {
      setBlocks(prev => (i < mockBlocks.length ? [...prev, mockBlocks[i++]] : prev));
      if (i >= mockBlocks.length) { 
        clearInterval(id); 
        setStreaming(false); 
      }
    }, 800);
    return () => clearInterval(id);
  }, []);

  const tryAccept = (b: Block) => {
    const hasErrors = (b.safety || []).some(s => s.severity === 'error');
    if (hasErrors) {
      alert('Resolve safety warnings before accepting.');
      return;
    }
    setAccepted(prev => ({ ...prev, [b.block_id]: true }));
  };

  const getBlockIcon = (type: BlockType) => {
    const iconClass = "h-4 w-4 text-medical-blue";
    switch (type) {
      case "chief_hpi": return <FileText className={iconClass} />;
      case "assessment": return <Activity className={iconClass} />;
      case "plan": return <ArrowRight className={iconClass} />;
      case "orders": return <TestTube className={iconClass} />;
      case "rx": return <Pill className={iconClass} />;
      case "referrals": return <ExternalLink className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-bg">
        {/* Header */}
        <div className="border-b border-border bg-surface">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-medical-blue" />
                  <h1 className="text-lg font-semibold text-fg">GoldCare AI</h1>
                </div>
                <Badge variant="outline" className="text-fg-muted">
                  Encounter Assistant
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant={commitEnabled ? "default" : "outline"} 
                  size="sm" 
                  disabled={!commitEnabled}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Finalize
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Patient Info */}
            <div className="col-span-3">
              <PatientSidebar />
            </div>

            {/* Main Content */}
            <div className="col-span-6 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-medium text-fg">AI-Generated Notes</h2>
                  <p className="text-sm text-fg-muted mt-1">
                    Review and accept the suggestions below
                  </p>
                </div>
                {streaming && (
                  <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <div className="animate-spin h-4 w-4 border-2 border-medical-blue border-t-transparent rounded-full" />
                    Generating...
                  </div>
                )}
              </div>

              <AnimatePresence>
                {blocks.map((block) => (
                  <motion.div
                    key={block.block_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BlockCard
                      block={block}
                      accepted={!!accepted[block.block_id]}
                      expanded={!!expanded[block.block_id]}
                      editing={!!editing[block.block_id]}
                      onToggleExpand={() => setExpanded(prev => ({ ...prev, [block.block_id]: !prev[block.block_id] }))}
                      onToggleEdit={() => setEditing(prev => ({ ...prev, [block.block_id]: !prev[block.block_id] }))}
                      onAccept={() => tryAccept(block)}
                      getIcon={() => getBlockIcon(block.type)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {streaming && <SkeletonCard />}
            </div>

            {/* Staging Area */}
            <div className="col-span-3">
              <StagingPanel staged={staged} commitEnabled={commitEnabled} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Patient sidebar component
function PatientSidebar() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-medical-blue" />
            <CardTitle className="text-sm">Patient</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-fg">Jane Smith</p>
            <p className="text-sm text-fg-muted">34F • MRN: 102938</p>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Visit Type</span>
              <span className="text-fg">Follow-up</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Date</span>
              <span className="text-fg">Sep 5, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Provider</span>
              <span className="text-fg">Dr. Wilson</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-medical-blue" />
            <CardTitle className="text-sm">Sources</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Transcript</span>
            <Badge variant="outline" className="text-xs">12:44</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Intake Form</span>
            <Badge variant="outline" className="text-xs">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-fg-muted">Prior Notes</span>
            <Badge variant="outline" className="text-xs">3 found</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Block card component
interface BlockCardProps {
  block: Block;
  accepted: boolean;
  expanded: boolean;
  editing: boolean;
  onToggleExpand: () => void;
  onToggleEdit: () => void;
  onAccept: () => void;
  getIcon: () => React.ReactElement;
}

function BlockCard({ block, accepted, expanded, editing, onToggleExpand, onToggleEdit, onAccept, getIcon }: BlockCardProps) {
  const hasWarnings = (block.safety || []).some(s => s.severity !== 'info');

  return (
    <Card className={`transition-all ${accepted ? 'ring-1 ring-medical-green/20 bg-medical-green/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <CardTitle className="text-sm font-medium text-fg flex items-center gap-2">
                {block.title}
                {accepted && (
                  <Badge className="bg-medical-green text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Accepted
                  </Badge>
                )}
              </CardTitle>
              {block.rationale && (
                <p className="text-xs text-fg-muted mt-1">{block.rationale}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {(block.provenance || []).length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      {block.provenance?.length} sources
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      {block.provenance?.map((p, i) => (
                        <div key={i} className="mb-1">
                          {p.type === "transcript" && `Transcript: ${p.ts}`}
                          {p.type === "intake" && `Intake: ${p.question}`}
                          {p.type === "prior_note" && `Prior note: ${p.date}`}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Safety warnings */}
        {hasWarnings && (
          <div className="flex flex-wrap gap-2">
            {(block.safety || []).map((safety, i) => (
              <Badge
                key={i}
                className={`
                  ${safety.severity === 'error' ? 'bg-medical-red/10 text-medical-red border-medical-red/20' : ''}
                  ${safety.severity === 'warning' ? 'bg-medical-amber/10 text-medical-amber border-medical-amber/20' : ''}
                  ${safety.severity === 'info' ? 'bg-medical-blue/10 text-medical-blue border-medical-blue/20' : ''}
                  border
                `}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {safety.msg}
              </Badge>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          {editing ? (
            <Textarea
              defaultValue={block.content_md}
              className="min-h-[120px] resize-none"
            />
          ) : (
            <div className="text-sm text-fg leading-relaxed whitespace-pre-line">
              {block.content_md}
            </div>
          )}
        </div>

        {/* Suggested items */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t border-border">
            {(block.suggested_orders || []).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-fg mb-2 flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-medical-blue" />
                  Suggested Orders
                </h4>
                <div className="space-y-1">
                  {block.suggested_orders?.map((order, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-surface rounded-md">
                      <span className="text-fg">{order.name}</span>
                      <CodePill variant="blue">LOINC {order.loinc}</CodePill>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(block.suggested_rx || []).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-fg mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-medical-blue" />
                  Suggested Prescriptions
                </h4>
                <div className="space-y-1">
                  {block.suggested_rx?.map((rx, i) => (
                    <div key={i} className="text-sm p-2 bg-surface rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-fg">{rx.drug}</span>
                        <CodePill variant="blue">RxNorm {rx.rxnorm}</CodePill>
                      </div>
                      <p className="text-fg-muted mt-1">{rx.sig} • Qty: {rx.qty} • Refills: {rx.refills}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onAccept}
              disabled={accepted || hasWarnings}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              {accepted ? 'Accepted' : 'Accept'}
            </Button>
            <Button size="sm" variant="ghost" onClick={onToggleEdit} className="gap-1">
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          </div>
          
          <Button size="sm" variant="ghost" onClick={onToggleExpand} className="gap-1">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {expanded ? 'Less' : 'More'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loading component
function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 bg-surface-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-surface-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-3 w-full bg-surface-muted rounded animate-pulse" />
        <div className="h-3 w-4/5 bg-surface-muted rounded animate-pulse" />
        <div className="h-3 w-3/5 bg-surface-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

// Staging panel component
interface StagingPanelProps {
  staged: {
    orders: SuggestedOrder[];
    rx: SuggestedRx[];
    referrals: string[];
    instructions: string[];
    superbill: string[];
  };
  commitEnabled: boolean;
}

function StagingPanel({ staged, commitEnabled }: StagingPanelProps) {
  const totalItems = staged.orders.length + staged.rx.length + staged.referrals.length + 
                    staged.instructions.length + staged.superbill.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Review & Commit</CardTitle>
            <Badge variant="outline">{totalItems} items</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalItems === 0 ? (
            <p className="text-sm text-fg-muted text-center py-4">
              No items to review yet. Accept AI suggestions to see them here.
            </p>
          ) : (
            <div className="space-y-3">
              {staged.orders.length > 0 && (
                <StagingSection
                  title="Orders"
                  icon={<TestTube className="h-4 w-4" />}
                  count={staged.orders.length}
                  items={staged.orders.map(o => o.name)}
                />
              )}
              
              {staged.rx.length > 0 && (
                <StagingSection
                  title="Prescriptions"
                  icon={<Pill className="h-4 w-4" />}
                  count={staged.rx.length}
                  items={staged.rx.map(r => r.drug)}
                />
              )}
              
              {staged.referrals.length > 0 && (
                <StagingSection
                  title="Referrals"
                  icon={<ExternalLink className="h-4 w-4" />}
                  count={staged.referrals.length}
                  items={staged.referrals}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Staging section component
interface StagingSectionProps {
  title: string;
  icon: React.ReactElement;
  count: number;
  items: string[];
}

function StagingSection({ title, icon, count, items }: StagingSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {React.cloneElement(icon, { className: "h-4 w-4 text-medical-blue" })}
        <span className="text-sm font-medium text-fg">{title}</span>
        <Badge variant="outline" className="text-xs">{count}</Badge>
      </div>
      <div className="space-y-1">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="text-xs text-fg-muted bg-surface p-2 rounded">
            {item}
          </div>
        ))}
        {items.length > 3 && (
          <div className="text-xs text-fg-muted">
            +{items.length - 3} more items
          </div>
        )}
      </div>
    </div>
  );
}

export default GoldCareAISection;