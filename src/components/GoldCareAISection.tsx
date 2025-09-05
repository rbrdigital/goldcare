import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Check, 
  Edit3, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Search,
  FileText,
  Pill,
  TestTube,
  Stethoscope,
  AlertTriangle,
  Clock,
  User,
  BookOpen,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type ProvenanceItem = {
  type: "transcript" | "intake" | "prior_note";
  label: string;
  content?: string;
  timestamp?: string;
};

type SafetyItem = {
  severity: "warning" | "error" | "info";
  message: string;
  blocking?: boolean;
};

type AIBlock = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  content: string;
  provenance: ProvenanceItem[];
  safety?: SafetyItem[];
  confidence: "high" | "medium" | "low";
  accepted: boolean;
  isEditing: boolean;
};

// Mock data
const mockBlocks: AIBlock[] = [
  {
    id: "cc-hpi",
    type: "chief_complaint",
    title: "Chief Complaint & History",
    subtitle: "Synthesized from transcript and intake",
    content: "Reports 3 days of nocturnal cough and wheeze; no chest pain or fever. Symptoms worsen with exercise. Previously managed with albuterol PRN.",
    provenance: [
      { type: "transcript", label: "Transcript 12:31–13:05", content: "Patient: The cough is really bad at night, and I get wheezy when I climb stairs..." },
      { type: "intake", label: "Intake Q3", content: "Q: Cough duration? A: 3 days" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "med-recon",
    type: "medications",
    title: "Medication Reconciliation",
    subtitle: "Current medications with changes noted",
    content: "• Albuterol HFA 90mcg, 2 puffs Q4-6H PRN (confirmed)\n• NEW: Montelukast 10mg daily at bedtime\n• CHANGED: Fluticasone 110mcg → 220mcg BID",
    provenance: [
      { type: "intake", label: "Intake Q8", content: "Q: Current medications? A: Listed all current meds" },
      { type: "prior_note", label: "Note 2025-02-18", content: "Previous medication list comparison" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "allergies",
    type: "allergies",
    title: "Allergies",
    subtitle: "Confirmed from intake and chart review",
    content: "• Penicillin (rash, 2019)\n• Tree nuts (anaphylaxis, carries EpiPen)",
    provenance: [
      { type: "intake", label: "Intake Q12", content: "Q: Known allergies? A: Penicillin causes rash, allergic to nuts" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "physical-exam",
    type: "objective",
    title: "Physical Exam / Objective",
    subtitle: "Key findings from encounter",
    content: "Vitals: HR 88, BP 122/76, SpO2 97%, RR 18\nLungs: Mild expiratory wheeze bilaterally\nGeneral: No acute distress, speaks in full sentences",
    provenance: [
      { type: "transcript", label: "Transcript 10:02–10:40", content: "Examining the chest now... I can hear some wheezing..." }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "assessment",
    type: "assessment",
    title: "Clinical Assessment",
    subtitle: "Primary diagnosis with differentials",
    content: "• Asthma exacerbation (moderate) — nocturnal symptoms, exercise intolerance\n• Allergic rhinitis — contributing factor\n• Rule out: GERD, viral bronchitis",
    provenance: [
      { type: "prior_note", label: "Note 2025-05-03", content: "Previous asthma diagnosis and management" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "plan",
    type: "plan",
    title: "Treatment Plan",
    subtitle: "Evidence-based recommendations",
    content: "• Start controller therapy: budesonide-formoterol inhaler\n• Continue rescue albuterol PRN\n• Inhaler technique education today\n• Follow-up in 4-6 weeks\n• Peak flow monitoring at home",
    provenance: [
      { type: "transcript", label: "Transcript 15:22–16:10", content: "Let's discuss treatment options..." }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "orders",
    type: "orders",
    title: "Orders (Labs/Imaging)",
    subtitle: "Recommended diagnostic tests",
    content: "• CBC with differential\n• Total IgE level\n• Consider spirometry next visit",
    provenance: [
      { type: "prior_note", label: "Note 2024-12-10", content: "Last CBC results for comparison" }
    ],
    confidence: "medium",
    accepted: false,
    isEditing: false
  },
  {
    id: "prescriptions",
    type: "prescriptions",
    title: "Prescriptions (eRx draft)",
    subtitle: "Ready for electronic prescribing",
    content: "• Budesonide-formoterol 80/4.5mcg inhaler\n  2 puffs BID, #1 inhaler, 2 refills\n• Albuterol HFA 90mcg inhaler\n  2 puffs Q4-6H PRN SOB, #1 inhaler, 3 refills",
    provenance: [
      { type: "transcript", label: "Transcript 16:45–17:20", content: "We'll start you on a controller inhaler..." }
    ],
    safety: [
      { severity: "info", message: "No significant drug interactions found" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "instructions",
    type: "instructions",
    title: "Patient Instructions",
    subtitle: "5th-grade reading level, bilingual available",
    content: "Use your daily inhaler twice a day, morning and evening. Use your rescue inhaler when you feel short of breath. Avoid smoke and strong smells. Call if symptoms get worse.",
    provenance: [
      { type: "intake", label: "Intake Q2", content: "Q: Preferred language? A: English" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  },
  {
    id: "superbill",
    type: "coding",
    title: "Superbill (Coding)",
    subtitle: "ICD-10 and CPT codes",
    content: "• ICD-10: J45.901 (Unspecified asthma with acute exacerbation)\n• CPT: 99214 (Office visit, moderate complexity)\n• Time: 25 minutes",
    provenance: [
      { type: "transcript", label: "Full encounter", content: "Complete encounter documentation" }
    ],
    confidence: "high",
    accepted: false,
    isEditing: false
  }
];

export function GoldCareAISection() {
  const [blocks, setBlocks] = useState<AIBlock[]>(mockBlocks);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const acceptedCount = blocks.filter(b => b.accepted).length;
  const totalCount = blocks.length;

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setSavedAt(new Date());
    }, 2000);
    return () => clearTimeout(timer);
  }, [blocks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'Enter':
          if (focusedBlockId) {
            handleAccept(focusedBlockId);
          }
          break;
        case 'e':
        case 'E':
          if (focusedBlockId) {
            handleEdit(focusedBlockId);
          }
          break;
        case 'r':
        case 'R':
          if (focusedBlockId) {
            handleRegenerate(focusedBlockId);
          }
          break;
        case 'j':
        case 'J':
          focusNextBlock(1);
          break;
        case 'k':
        case 'K':
          focusNextBlock(-1);
          break;
      }

      if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        handleCommit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedBlockId, blocks]);

  const focusNextBlock = (direction: 1 | -1) => {
    const currentIndex = blocks.findIndex(b => b.id === focusedBlockId);
    const nextIndex = Math.max(0, Math.min(blocks.length - 1, currentIndex + direction));
    setFocusedBlockId(blocks[nextIndex]?.id || null);
  };

  const handleAccept = (blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, accepted: true, isEditing: false }
        : block
    ));
  };

  const handleEdit = (blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, isEditing: !block.isEditing }
        : block
    ));
  };

  const handleRegenerate = (blockId: string) => {
    // Simulate regeneration
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content: block.content + "\n\n[Regenerated at " + new Date().toLocaleTimeString() + "]" }
        : block
    ));
  };

  const handleContentUpdate = (blockId: string, newContent: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content: newContent }
        : block
    ));
  };

  const handleAcceptAll = () => {
    setBlocks(prev => prev.map(block => ({ ...block, accepted: true, isEditing: false })));
  };

  const handleCommit = () => {
    // Simulate commit
    alert(`Committed ${acceptedCount} accepted items. Redirecting to chart note...`);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-50 bg-bg border-b border-border px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-fg">GoldCare AI — Encounter Assistant</h1>
            <Badge variant="outline" className="gap-1">
              <User className="h-3 w-3" />
              Sarah Johnson, 34F, MRN 102938
            </Badge>
          </div>
          
          <div className="text-sm text-fg-muted">
            {acceptedCount} of {totalCount} accepted
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleAcceptAll}
              disabled={acceptedCount === totalCount}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Accept All
            </Button>
            <Button 
              onClick={handleCommit}
              disabled={acceptedCount === 0}
              variant="default"
              className="gap-2"
            >
              Commit & Finalize
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-fg-muted" />
              <Input
                placeholder="Type 'rx albuterol' or 'add cbc'..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </div>
        
        {savedAt && (
          <div className="text-xs text-fg-muted text-right mt-1">
            Saved at {savedAt.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6" ref={containerRef}>
        {/* Sources Section */}
        <Card>
          <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-surface-muted transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Sources</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Transcript (12:44)
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Intake (Complete)
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <BookOpen className="h-3 w-3" />
                        Prior Notes (3)
                      </Badge>
                    </div>
                    {sourcesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Transcript Segments</h4>
                    <div className="space-y-1 text-fg-muted">
                      <div>00:02:30 - Chief complaint discussion</div>
                      <div>00:08:15 - Symptom details</div>
                      <div>00:12:31 - Physical examination</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Intake Responses</h4>
                    <div className="space-y-1 text-fg-muted">
                      <div>Q3: Cough duration - 3 days</div>
                      <div>Q8: Current medications - Listed</div>
                      <div>Q12: Allergies - Penicillin, nuts</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Prior Notes</h4>
                    <div className="space-y-1 text-fg-muted">
                      <div>2025-02-18 - Medication review</div>
                      <div>2025-05-03 - Asthma follow-up</div>
                      <div>2024-12-10 - Annual physical</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* AI Blocks */}
        {blocks.map((block, index) => (
          <AIBlockCard
            key={block.id}
            block={block}
            isFocused={focusedBlockId === block.id}
            onFocus={() => setFocusedBlockId(block.id)}
            onAccept={() => handleAccept(block.id)}
            onEdit={() => handleEdit(block.id)}
            onRegenerate={() => handleRegenerate(block.id)}
            onContentUpdate={(content) => handleContentUpdate(block.id, content)}
          />
        ))}

        {/* Final Review */}
        {acceptedCount > 0 && (
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base font-medium">Final Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline">Orders: 1</Badge>
                <Badge variant="outline">Prescriptions: 2</Badge>
                <Badge variant="outline">Instructions: 1</Badge>
                <Badge variant="outline">Superbill: 1</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// AI Block Card Component
function AIBlockCard({ 
  block, 
  isFocused, 
  onFocus, 
  onAccept, 
  onEdit, 
  onRegenerate, 
  onContentUpdate 
}: {
  block: AIBlock;
  isFocused: boolean;
  onFocus: () => void;
  onEdit: () => void;
  onAccept: () => void;
  onRegenerate: () => void;
  onContentUpdate: (content: string) => void;
}) {
  const [editContent, setEditContent] = useState(block.content);

  useEffect(() => {
    setEditContent(block.content);
  }, [block.content]);

  const handleSaveEdit = () => {
    onContentUpdate(editContent);
    onEdit();
  };

  if (block.accepted && !block.isEditing) {
    return (
      <Card className="border-success bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-success" />
              <span className="font-medium">{block.title}</span>
              <Badge variant="outline" className="text-success border-success">Accepted</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              View details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all",
        isFocused && "ring-2 ring-primary ring-offset-2",
        block.confidence === "low" && "border-warning"
      )}
      onClick={onFocus}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              {getBlockIcon(block.type)}
              {block.title}
              {block.confidence === "low" && (
                <Badge variant="outline" className="text-warning border-warning">
                  Low confidence
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-fg-muted mt-1">{block.subtitle}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {block.provenance.map((prov, idx) => (
              <HoverCard key={idx}>
                <HoverCardTrigger>
                  <Badge variant="outline" className="text-xs cursor-help">
                    {prov.label}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <div className="font-medium">{prov.type === "transcript" ? "Transcript" : prov.type === "intake" ? "Intake Q/A" : "Prior Note"}</div>
                    <div className="text-sm text-fg-muted">{prov.content}</div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {block.safety && block.safety.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {block.safety.map((safety, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className={cn(
                  "gap-1",
                  safety.severity === "error" && "text-danger border-danger",
                  safety.severity === "warning" && "text-warning border-warning",
                  safety.severity === "info" && "text-primary border-primary"
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                {safety.message}
              </Badge>
            ))}
          </div>
        )}

        {block.isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={onEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {block.content.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2 last:mb-0 leading-relaxed">
                {line.startsWith('•') ? (
                  <span className="block">{line}</span>
                ) : (
                  <HoverCard>
                    <HoverCardTrigger className="underline decoration-dotted underline-offset-2 cursor-help">
                      {line}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="text-sm">
                        Source information and context for this statement.
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </p>
            ))}
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={onAccept}
              disabled={block.safety?.some(s => s.blocking) || block.confidence === "low"}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              Accept {isFocused && "(Enter)"}
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit} className="gap-1">
              <Edit3 className="h-4 w-4" />
              Edit {isFocused && "(E)"}
            </Button>
            <Button size="sm" variant="outline" onClick={onRegenerate} className="gap-1">
              <RefreshCw className="h-4 w-4" />
              Regenerate {isFocused && "(R)"}
            </Button>
          </div>
          
          {isFocused && (
            <div className="text-xs text-fg-muted">
              J/K to navigate blocks
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getBlockIcon(type: string) {
  const className = "h-4 w-4 text-fg-muted";
  
  switch (type) {
    case "chief_complaint":
      return <FileText className={className} />;
    case "medications":
      return <Pill className={className} />;
    case "allergies":
      return <AlertTriangle className={className} />;
    case "objective":
      return <Stethoscope className={className} />;
    case "assessment":
      return <FileText className={className} />;
    case "plan":
      return <FileText className={className} />;
    case "orders":
      return <TestTube className={className} />;
    case "prescriptions":
      return <Pill className={className} />;
    case "instructions":
      return <Globe className={className} />;
    case "coding":
      return <FileText className={className} />;
    default:
      return <FileText className={className} />;
  }
}